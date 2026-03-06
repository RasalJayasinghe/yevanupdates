import { NextResponse } from "next/server";
import {
  scrapeRoundResults,
  scrapeCalendarRaceIds,
  getRaceId,
} from "@/lib/scraper";

export const dynamic = "force-dynamic";

/**
 * GET /api/scrape?round=1        — scrape a specific round
 * GET /api/scrape?discover=true  — discover all race IDs from calendar
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("discover") === "true") {
    const ids = await scrapeCalendarRaceIds();
    return NextResponse.json({ raceIds: ids });
  }

  const roundParam = searchParams.get("round");
  if (!roundParam) {
    return NextResponse.json(
      { error: "Use ?round=1 to scrape a round, or ?discover=true to find race IDs." },
      { status: 400 }
    );
  }

  const round = parseInt(roundParam);
  const raceid = getRaceId(round);

  if (!raceid) {
    return NextResponse.json(
      {
        error: `No race ID known for round ${round}.`,
        hint: "Try /api/scrape?discover=true first to find race IDs.",
      },
      { status: 404 }
    );
  }

  const result = await scrapeRoundResults(raceid);

  if (!result) {
    return NextResponse.json(
      { error: `Failed to fetch/parse results for round ${round} (raceid=${raceid}).` },
      { status: 502 }
    );
  }

  return NextResponse.json(result);
}
