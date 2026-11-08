import { SessionResult } from "./types";

export function isDnf(gap: string | null): boolean {
  return gap === "DNF" || gap === "DNS" || gap === "DSQ";
}

/** Numeric gaps are stored without a unit. Retirement codes are left unchanged. */
export function formatGap(gap: string | null): string | null {
  if (!gap) return null;
  if (isDnf(gap)) return gap;
  return `${gap}s`;
}

export function isRaceSession(session: SessionResult["session"]): boolean {
  return (
    session === "Sprint Race" ||
    session === "Feature Race" ||
    session === "Feature Race 2"
  );
}

export function sessionShortLabel(session: SessionResult["session"]): string {
  switch (session) {
    case "Practice":
      return "FP";
    case "Qualifying":
      return "QUALI";
    case "Sprint Race":
      return "SPRINT";
    case "Feature Race":
      return "FEATURE";
    case "Feature Race 2":
      return "FR2";
  }
}
