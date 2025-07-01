declare module '@garmin/fitsdk' {
  export class Stream {
    static fromArrayBuffer(buffer: ArrayBuffer): Stream;
  }

  export class Decoder {
    constructor(stream: Stream);
    isFIT(): boolean;
    checkIntegrity(): boolean;
    read(): FitParseResult;
  }

  export interface FileIdMesg {
    type: string | null;
    timeCreated: string | null;
    manufacturer: string | null;
    serialNumber: number | null;
  }

  export interface FileCreatorMesg {
    hardwareVersion: number | null;
    softwareVersion: number | null;
  }

  export interface EventMesg {
    timestamp: Date | null;
    data: number | null;
    eventGroup: number | null;
    event: string | null;
    eventType: string | null;
    timerTrigger: string | null;
  }

  export interface DeviceInfoMesg {
    timestamp: Date | null;
  }

  export interface RecordMesg {
    cadence: number | null;
    distance: number | null;
    speed: number | null;
    power: number | null;
    accumulatedPower: number | null;
    enhancedSpeed: number | null;
    activityType: string | null;
    timestamp: Date | null;
    positionLat: number | null;
    positionLong: number | null;
  }

  export interface LapMesg {
    sport: string | null;
    subSport: string | null;
    startTime: Date | null;
    totalTimerTime: number | null;
    totalElapsedTime: number | null;
    totalMovingTime: number | null;
    totalDistance: number | null;
    avgSpeed: number | null;
    maxSpeed: number | null;
    totalAscent: number | null;
    avgCadence: number | null;
    maxCadence: number | null;
    avgPower: number | null;
    maxPower: number | null;
    normalizedPower: number | null;
    avgHeartRate: number | null;
    maxHeartRate: number | null;
    totalCalories: number | null;
    enhancedAvgSpeed: number | null;
    enhancedMaxSpeed: number | null;
  }

  export interface SessionMesg {
    sport: string | null;
    subSport: string | null;
    totalElapsedTime: number | null;
    startTime: Date | null;
    totalTimerTime: number | null;
    totalMovingTime: number | null;
    totalDistance: number | null;
    avgPower: number | null;
    maxPower: number | null;
    maxSpeed: number | null;
    avgSpeed: number | null;
    avgHeartRate: number | null;
    maxHeartRate: number | null;
    avgCadence: number | null;
    maxCadence: number | null;
    trainingStressScore: number | null;
    intensityFactor: number | null;
    thresholdPower: number | null;
    totalCalories: number | null;
    enhancedMaxSpeed: number | null;
    enhancedAvgSpeed: number | null;
  }

  export interface ActivityMesg {
    type: string | null;
    event: string | null;
    eventType: string | null;
    totalTimerTime: number | null;
    numSessions: number | null;
  }

  export interface FitMessages {
    fileIdMesgs?: FileIdMesg[];
    fileCreatorMesgs?: FileCreatorMesg[];
    eventMesgs?: EventMesg[];
    deviceInfoMesgs?: DeviceInfoMesg[];
    recordMesgs?: RecordMesg[];
    lapMesgs?: LapMesg[];
    sessionMesgs?: SessionMesg[];
    activityMesgs?: ActivityMesg[];
  }

  export interface FitParseResult {
    messages: FitMessages;
    errors: string[];
  }
}
