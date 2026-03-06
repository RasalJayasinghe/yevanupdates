export interface SessionResult {
  session: "Practice" | "Qualifying" | "Sprint Race" | "Feature Race";
  position: number | null;
  time: string | null;
  gap: string | null;
  laps: number | null;
  points: number;
  gridPosition?: number;
  fastestLap?: boolean;
  topSpeed?: number;
}

export interface RaceRound {
  round: number;
  name: string;
  circuit: string;
  country: string;
  dateStart: string;
  dateEnd: string;
  flag: string;
  sessions: SessionResult[];
  status: "upcoming" | "live" | "completed";
}

export interface DriverStanding {
  position: number;
  driver: string;
  team: string;
  driverNumber: number;
  nationality: string;
  points: number;
  pointsHistory: { round: number; points: number; cumulative: number }[];
}