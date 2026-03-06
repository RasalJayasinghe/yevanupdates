import { NextResponse } from "next/server";
import { getStandings } from "@/lib/data";

export const revalidate = 600; // 10 minutes

export async function GET() {
  const standings = await getStandings();
  return NextResponse.json(standings);
}
