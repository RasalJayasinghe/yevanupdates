import { NextResponse } from "next/server";
import { getLiveStatus } from "@/lib/data";

export const revalidate = 30; // 30 seconds

export async function GET() {
  const status = await getLiveStatus();
  return NextResponse.json(status);
}
