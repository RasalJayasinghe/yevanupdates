import { RaceRound, DriverStanding, SessionResult } from "./types";
import { scrapeRoundResults, getRaceId } from "./scraper";

/**
 * Official FIA Formula 3 2026 Calendar
 * Source: https://www.fiaformula3.com/Calendar
 */
const F3_CALENDAR_2026: Omit<RaceRound, "status">[] = [
  {
    round: 1,
    name: "Australian Grand Prix",
    circuit: "Albert Park Circuit",
    country: "Australia",
    dateStart: "2026-03-06",
    dateEnd: "2026-03-08",
    flag: "🇦🇺",
    sessions: [],
  },
  {
    round: 2,
    name: "Monaco Grand Prix",
    circuit: "Circuit de Monaco",
    country: "Monaco",
    dateStart: "2026-06-04",
    dateEnd: "2026-06-07",
    flag: "🇲🇨",
    sessions: [],
  },
  {
    round: 3,
    name: "Spanish Grand Prix",
    circuit: "Circuit de Barcelona-Catalunya",
    country: "Spain",
    dateStart: "2026-06-12",
    dateEnd: "2026-06-14",
    flag: "🇪🇸",
    sessions: [],
  },
  {
    round: 4,
    name: "Austrian Grand Prix",
    circuit: "Red Bull Ring",
    country: "Austria",
    dateStart: "2026-06-26",
    dateEnd: "2026-06-28",
    flag: "🇦🇹",
    sessions: [],
  },
  {
    round: 5,
    name: "British Grand Prix",
    circuit: "Silverstone Circuit",
    country: "Great Britain",
    dateStart: "2026-07-03",
    dateEnd: "2026-07-05",
    flag: "🇬🇧",
    sessions: [],
  },
  {
    round: 6,
    name: "Belgian Grand Prix",
    circuit: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    dateStart: "2026-07-17",
    dateEnd: "2026-07-19",
    flag: "🇧🇪",
    sessions: [],
  },
  {
    round: 7,
    name: "Hungarian Grand Prix",
    circuit: "Hungaroring",
    country: "Hungary",
    dateStart: "2026-07-24",
    dateEnd: "2026-07-26",
    flag: "🇭🇺",
    sessions: [],
  },
  {
    round: 8,
    name: "Italian Grand Prix",
    circuit: "Autodromo Nazionale Monza",
    country: "Italy",
    dateStart: "2026-09-04",
    dateEnd: "2026-09-06",
    flag: "🇮🇹",
    sessions: [],
  },
  {
    round: 9,
    name: "Madrid Grand Prix",
    circuit: "Madring",
    country: "Spain",
    dateStart: "2026-09-11",
    dateEnd: "2026-09-13",
    flag: "🇪🇸",
    sessions: [],
  },
];

/**
 * Fallback results if scraping fails.
 * Manually entered from https://www.fiaformula3.com/Results
 */
const FALLBACK_RESULTS: Record<number, SessionResult[]> = {
  1: [
    {
      session: "Practice",
      position: 26,
      time: "1:36.317",
      gap: "+1.710",
      laps: 14,
      points: 0,
    },
    {
      session: "Qualifying",
      position: 26,
      time: "1:35.731",
      gap: "+1.544",
      laps: 12,
      points: 0,
    },
    {
      session: "Sprint Race",
      position: 22,
      time: "11:58.060",
      gap: "+22.620",
      laps: 7,
      points: 0,
    },
    {
      session: "Feature Race",
      position: 20,
      time: "43:09.630",
      gap: "+9.977",
      laps: 23,
      points: 0,
    },
  ],
  2: [
    {
      session: "Practice",
      position: 26,
      time: "1:27.475",
      gap: "+1.681",
      laps: 23,
      points: 0,
    },
    {
      session: "Qualifying",
      position: 12,
      time: "1:25.520",
      gap: "+1.049",
      laps: 10,
      points: 0,
    },
    {
      session: "Sprint Race",
      position: 21,
      time: "1:02:50.784",
      gap: "+55.403",
      laps: 18,
      points: 0,
    },
    {
      session: "Feature Race",
      position: 20,
      time: "42:04.126",
      gap: "+49.140",
      laps: 27,
      points: 0,
    },
  ],
  3: [
    {
      session: "Practice",
      position: 27,
      time: "1:30.621",
      gap: "+2.199",
      laps: 16,
      points: 0,
    },
    {
      session: "Qualifying",
      position: 28,
      time: "1:29.819",
      gap: "+1.556",
      laps: 11,
      points: 0,
    },
    {
      session: "Sprint Race",
      position: 19,
      time: "37:13.320",
      gap: "+15.965",
      laps: 21,
      points: 0,
    },
    {
      session: "Feature Race",
      position: 27,
      time: "40:58.025",
      gap: "+81.842",
      laps: 25,
      points: 0,
    },
  ],
  4: [
    {
      session: "Practice",
      position: 28,
      time: "1:23.650",
      gap: "+1.240",
      laps: 19,
      points: 0,
    },
    {
      session: "Qualifying",
      position: 27,
      time: "1:22.678",
      gap: "+0.948",
      laps: 13,
      points: 0,
    },
    {
      session: "Sprint Race",
      position: 19,
      time: "31:52.534",
      gap: "+21.172",
      laps: 21,
      points: 0,
    },
    {
      session: "Feature Race",
      position: null,
      time: null,
      gap: "DNF",
      laps: null,
      points: 0,
    },
  ],
  5: [
    {
      session: "Practice",
      position: 12,
      time: "1:46.910",
      gap: "+0.749",
      laps: 16,
      points: 0,
    },
    {
      session: "Qualifying",
      position: 11,
      time: "1:46.215",
      gap: "+0.595",
      laps: 11,
      points: 0,
    },
    {
      session: "Sprint Race",
      position: 2,
      time: "33:08.248",
      gap: "+17.023",
      laps: 18,
      points: 9,
    },
    {
      session: "Feature Race",
      position: 7,
      time: "40:55.620",
      gap: "+3.995",
      laps: 21,
      points: 6,
    },
  ],
};

/**
 * In-memory cache for scraped results (per-round, TTL-based).
 */
const resultCache = new Map<number, { data: SessionResult[]; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getSessionsForRound(round: number): Promise<SessionResult[]> {
  const cached = resultCache.get(round);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.data;
  }

  const raceid = getRaceId(round);
  if (raceid) {
    try {
      const scraped = await scrapeRoundResults(raceid);
      if (scraped && scraped.sessions.length > 0) {
        resultCache.set(round, { data: scraped.sessions, ts: Date.now() });
        return scraped.sessions;
      }
    } catch {
      // Fall through to fallback
    }
  }

  return FALLBACK_RESULTS[round] ?? [];
}

function computeStatus(
  dateStart: string,
  dateEnd: string,
  sessions: SessionResult[]
): RaceRound["status"] {
  const hasFeatureResult = sessions.some((s) => s.session === "Feature Race");
  if (hasFeatureResult) return "completed";

  const now = new Date();
  const start = new Date(dateStart + "T00:00:00");
  const end = new Date(dateEnd + "T23:59:59");
  if (now >= start && now <= end) return "live";
  if (now > end) return "completed";
  return "upcoming";
}

export async function getCalendar(): Promise<RaceRound[]> {
  const results = await Promise.all(
    F3_CALENDAR_2026.map(async (round) => {
      const sessions = await getSessionsForRound(round.round);
      const status = computeStatus(round.dateStart, round.dateEnd, sessions);
      return { ...round, sessions, status } as RaceRound;
    })
  );
  return results;
}

function computeStanding(calendar: RaceRound[]): DriverStanding {
  let totalPoints = 0;
  const pointsHistory: DriverStanding["pointsHistory"] = [];

  for (const round of calendar) {
    if (round.sessions.length === 0) continue;
    let roundPts = 0;
    for (const s of round.sessions) {
      roundPts += s.points;
    }
    totalPoints += roundPts;
    pointsHistory.push({
      round: round.round,
      points: roundPts,
      cumulative: totalPoints,
    });
  }

  return {
    position: 0,
    driver: "Yevan David",
    team: "AIX Racing",
    driverNumber: 27,
    nationality: "Sri Lankan",
    points: totalPoints,
    pointsHistory,
  };
}

export async function getStandings(): Promise<DriverStanding> {
  const calendar = await getCalendar();
  return computeStanding(calendar);
}

export function getNextRace(calendar: RaceRound[]): RaceRound | undefined {
  return calendar.find((r) => r.status === "live" || r.status === "upcoming");
}
