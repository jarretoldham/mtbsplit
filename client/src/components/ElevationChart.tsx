import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MtbLineString } from '../utils/fitFileUtils';

interface ElevationChartProps {
  lineString: MtbLineString;
}

const ElevationChart: React.FC<ElevationChartProps> = ({ lineString }) => {
  // Extract elevation data from coordinates
  const data = lineString.properties.altitudes.map((altitude, idx) => ({
    index: idx,
    elevation: altitude.toFixed(0) ?? 0,
    timestamp:
      lineString.properties.timestamps[idx]?.toLocaleTimeString() ?? '',
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <YAxis tick={{ fill: '#fff' }} />
        <XAxis dataKey="timestamp" tick={{ fill: '#fff' }} textAnchor="end" />
        <Tooltip formatter={(value) => [`${value} (m)`]} />
        <Line
          type="monotone"
          dataKey="elevation"
          stroke="#38bdf8"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ElevationChart;
