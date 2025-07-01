import React, { useState } from 'react';
import { parseFitFile } from '../utils/fitFileUtils';
import type { SessionMesg, FitParseResult, FitMessages } from '@garmin/fitsdk';

export interface FitFileUploaderProps {
  onFileParsed?: (result: FitMessages) => void;
}

const FitFileUploader: React.FC<FitFileUploaderProps> = ({ onFileParsed }) => {
  const [result, setResult] = useState<FitParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    try {
      const parsed = await parseFitFile(file);
      setResult(parsed);
      if (onFileParsed) {
        onFileParsed(parsed.messages);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to parse FIT file.');
      }
    }
  };

  const renderSessionMesg = (session: SessionMesg, idx: number) => (
    <div key={idx} className="bg-gray-700 rounded p-4 mb-4">
      <div>
        <span className="font-bold">Sport:</span> {session.sport ?? 'N/A'}
      </div>
      <div>
        <span className="font-bold">SubSport:</span> {session.subSport ?? 'N/A'}
      </div>
      <div>
        <span className="font-bold">Start Time:</span>{' '}
        {session.startTime?.toLocaleString() ?? 'N/A'}
      </div>
      <div>
        <span className="font-bold">Total Elapsed Time:</span>{' '}
        {session.totalElapsedTime ?? 'N/A'} s
      </div>
      <div>
        <span className="font-bold">Total Moving Time:</span>{' '}
        {session.totalMovingTime ?? 'N/A'} s
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-800 rounded-lg text-white">
      <input type="file" accept=".fit" onChange={handleFileChange} />
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {result &&
        result.messages.sessionMesgs &&
        result.messages.sessionMesgs.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">Session Summary</h2>
            {result.messages.sessionMesgs.map(renderSessionMesg)}
            <div className="h-24 overflow-y-scroll">
              {result.messages.recordMesgs &&
                JSON.stringify(result.messages.recordMesgs)}
            </div>
          </div>
        )}
    </div>
  );
};

export default FitFileUploader;
