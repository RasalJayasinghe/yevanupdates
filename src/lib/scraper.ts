import * as cheerio from "cheerio";
import { SessionResult } from "./types";

const DRIVER_SURNAME = "David";
const FIA_F3_BASE = "https://www.fiaformula3.com";

// ─── FIA __NEXT_DATA__ types ────────────────────────────────────────

interface FiaDriverResult {
  DriverId: number;
  FinishPosition: number;
  DriverForename: string;
  DriverSurname: string;
  TLA: string;
  DriverDisplayName: string;
  TeamName: string;
  CarNumber: number;
  LapsCompleted: number;
  TimeOrFinishReason: string;
  Gap: string;
  Interval: string;
  Speed: string;
  Best: string;
  ResultStatus: string | null;
}

interface FiaSessionResult {
  SessionId: number;
  SessionName: string;
  SessionShortName: string;
  SessionType: string; // "PRACTICE" | "QUALIFYING" | "RESULT"
  SessionResultsAvailable: boolean;
  Results: FiaDriverResult[];
}

interface FiaPageData {
  RaceId: number;
  SeasonName: string;
  CountryName: string;
  RoundNumber: number;
  RaceStartDate: string;
  RaceEndDate: string;
  CircuitInformation: {
    CircuitName: string;
    CircuitShortName: string;
  };
  SessionResults: FiaSessionResult[];
}

interface FiaNextData {
  props: {
    pageProps: {
      pageData: FiaPageData;
    };
  };
}

// ─── Session type mapping ───────────────────────────────────────────

function mapSessionType(
  sessionName: string,
  sessionType: string
): SessionResult["session"] | null {
  const name = sessionName.toLowerCase();
  if (name.includes("practice")) return "Practice";
  if (sessionType === "QUALIFYING" || name.includes("qualifying"))
    return "Qualifying";
  if (name.includes("sprint")) return "Sprint Race";
  if (name.includes("feature")) return "Feature Race";
  return null;
}

// ─── Points calculation ─────────────────────────────────────────────

const FEATURE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const SPRINT_POINTS = [10, 8, 6, 5, 4, 3, 2, 1];

function calcPoints(
  sessionType: SessionResult["session"],
  position: number | null
): number {
  if (!position) return 0;
  if (sessionType === "Feature Race" && position <= FEATURE_POINTS.length)
    return FEATURE_POINTS[position - 1];
  if (sessionType === "Sprint Race" && position <= SPRINT_POINTS.length)
    return SPRINT_POINTS[position - 1];
  return 0;
}

// ─── Scraper ────────────────────────────────────────────────────────

export interface ScrapedRound {
  raceid: number;
  roundNumber: number;
  roundName: string;
  country: string;
  circuit: string;
  sessions: SessionResult[];
}

/**
 * Scrape a single FIA F3 round results page by extracting the __NEXT_DATA__
 * JSON blob embedded in the HTML. This gives us clean structured data for
 * every session and every driver — far more reliable than HTML table parsing.
 *
 * URL: https://www.fiaformula3.com/Results?raceid=XXXX
 */
export async function scrapeRoundResults(
  raceid: number
): Promise<ScrapedRound | null> {
  const url = `${FIA_F3_BASE}/Results?raceid=${raceid}`;

  let html: string;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; YevanUpdates/1.0; +https://github.com)",
        Accept: "text/html",
      },
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    return null;
  }

  // Extract __NEXT_DATA__ JSON from the page
  const $ = cheerio.load(html);
  const nextDataScript = $("#__NEXT_DATA__").html();
  if (!nextDataScript) return null;

  let nextData: FiaNextData;
  try {
    nextData = JSON.parse(nextDataScript);
  } catch {
    return null;
  }

  const pageData = nextData.props?.pageProps?.pageData;
  if (!pageData?.SessionResults) return null;

  const sessions: SessionResult[] = [];

  for (const fiaSession of pageData.SessionResults) {
    if (!fiaSession.SessionResultsAvailable || fiaSession.Results.length === 0)
      continue;

    const sessionType = mapSessionType(
      fiaSession.SessionName,
      fiaSession.SessionType
    );
    if (!sessionType) continue;

    // Find Yevan David in the results
    const yevan = fiaSession.Results.find(
      (r) => r.DriverSurname === DRIVER_SURNAME
    );
    if (!yevan) continue;

    const position = yevan.FinishPosition || null;
    const points = calcPoints(sessionType, position);

    sessions.push({
      session: sessionType,
      position,
      time: yevan.TimeOrFinishReason || yevan.Best || null,
      gap: yevan.Gap && yevan.Gap !== "" ? `+${yevan.Gap}` : null,
      laps: yevan.LapsCompleted || null,
      points,
    });
  }

  return {
    raceid,
    roundNumber: pageData.RoundNumber,
    roundName: `${pageData.CountryName} — ${pageData.CircuitInformation.CircuitShortName}`,
    country: pageData.CountryName,
    circuit: pageData.CircuitInformation.CircuitName,
    sessions,
  };
}

/**
 * Known race IDs for 2026 F3 rounds.
 * Round 1 is confirmed. Others will be discoverable via the calendar scraper
 * or added manually as FIA publishes them.
 */
const RACE_IDS_2026: Record<number, number> = {
  1: 1069,
  2: 1070,
  3: 1071,
  4: 1072,
  5: 1073,
  6: 1074,
  7: 1075,
  8: 1076,
  9: 1077,
  10: 1078,
};

export function getRaceId(round: number): number | null {
  return RACE_IDS_2026[round] ?? null;
}

export function setRaceId(round: number, raceid: number): void {
  RACE_IDS_2026[round] = raceid;
}

/**
 * Scrape the FIA F3 calendar page to discover race IDs for all rounds.
 */
export async function scrapeCalendarRaceIds(): Promise<
  Record<number, number>
> {
  const url = `${FIA_F3_BASE}/Calendar`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; YevanUpdates/1.0; +https://github.com)",
      },
    });
    if (!res.ok) return RACE_IDS_2026;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Calendar page also has __NEXT_DATA__ with round info
    const nextDataScript = $("#__NEXT_DATA__").html();
    if (nextDataScript) {
      try {
        const data = JSON.parse(nextDataScript);
        const races = data.props?.pageProps?.pageData?.Races;
        if (Array.isArray(races)) {
          for (const race of races) {
            if (race.RoundNumber && race.RaceId) {
              RACE_IDS_2026[race.RoundNumber] = race.RaceId;
            }
          }
        }
      } catch {
        // Fall through to link-based discovery
      }
    }

    // Also try link-based discovery as fallback
    $("a[href*='raceid=']").each((_i, el) => {
      const href = $(el).attr("href") || "";
      const match = href.match(/raceid=(\d+)/i);
      if (!match) return;
      const raceid = parseInt(match[1]);
      const text = $(el).closest("[class*='round'], li, div").text();
      const roundMatch = text.match(/Round\s*(\d+)/i);
      if (roundMatch) {
        RACE_IDS_2026[parseInt(roundMatch[1])] = raceid;
      }
    });

    return { ...RACE_IDS_2026 };
  } catch {
    return RACE_IDS_2026;
  }
}
