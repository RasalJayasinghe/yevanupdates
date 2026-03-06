import { NextResponse } from "next/server";
import { getCalendar } from "@/lib/data";

export const revalidate = 300; // 5 minutes (scraper has its own TTL cache)

export async function GET() {
  const calendar = await getCalendar();
  return NextResponse.json(calendar);
}
