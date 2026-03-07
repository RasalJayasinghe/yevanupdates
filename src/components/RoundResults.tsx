"use client";

import { useInView } from "@/hooks/useInView";
import { RaceRound, SessionResult } from "@/lib/types";

function positionColor(pos: number | null): string {
  if (!pos) return "text-muted";
  if (pos <= 3) return "text-accent";
  if (pos <= 10) return "text-white";
  return "text-muted";
}

function SessionRow({ result }: { result: SessionResult }) {
  const isRace =
    result.session === "Sprint Race" || result.session === "Feature Race";

  return (
    <div className="flex items-center gap-3 border-b-2 border-border py-3 last:border-b-0">
      {/* Position badge */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center border-2 font-heading text-lg ${
          result.position && result.position <= 10
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-secondary text-muted"
        }`}
      >
        {result.position ? `P${result.position}` : "—"}
      </div>

      {/* Session info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm tracking-wider text-white">
            {result.session.toUpperCase()}
          </span>
          {isRace && result.points > 0 && (
            <span className="border border-accent bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-accent">
              +{result.points} PTS
            </span>
          )}
          {result.fastestLap && (
            <span className="border border-primary bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary">
              FL
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
          {result.time && <span>Time: {result.time}</span>}
          {result.gap && <span>Gap: {result.gap}s</span>}
          {result.laps && <span>{result.laps} laps</span>}
          {result.gridPosition && <span>Grid: P{result.gridPosition}</span>}
        </div>
      </div>

      {/* Position big number */}
      <div
        className={`font-heading text-2xl ${positionColor(result.position)}`}
      >
        {result.position ?? "—"}
      </div>
    </div>
  );
}

function PendingSession({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 border-b-2 border-border py-3 last:border-b-0 opacity-40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-dashed border-border font-heading text-lg text-muted">
        —
      </div>
      <div className="flex-1">
        <span className="font-heading text-sm tracking-wider text-muted">
          {name.toUpperCase()}
        </span>
        <div className="mt-0.5 text-xs text-muted/60">Awaiting results</div>
      </div>
    </div>
  );
}

export default function RoundResults({ rounds }: { rounds: RaceRound[] }) {
  const roundsWithData = rounds.filter((r) => r.sessions.length > 0);
  const { ref, isInView } = useInView();

  if (roundsWithData.length === 0) return null;

  const allSessions: ("Practice" | "Qualifying" | "Sprint Race" | "Feature Race")[] = [
    "Practice",
    "Qualifying",
    "Sprint Race",
    "Feature Race",
  ];

  return (
    <section
      ref={ref}
      id="results"
      className={`section-enter relative px-4 py-12 sm:px-6 sm:py-16 lg:py-24 ${isInView ? "visible" : ""}`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 text-sm font-semibold tracking-widest text-accent uppercase">
          Yevan David #27
        </div>
        <h2 className="mb-8 font-heading text-4xl tracking-wider text-white sm:mb-12 sm:text-5xl lg:text-6xl">
          RACE RESULTS
        </h2>

        <div className="space-y-8">
          {roundsWithData.map((round, roundIndex) => {
            const completedSessionNames = round.sessions.map((s) => s.session);
            const pendingSessions = allSessions.filter(
              (name) => !completedSessionNames.includes(name)
            );

            const totalRoundPts = round.sessions.reduce(
              (sum, s) => sum + s.points,
              0
            );

            return (
              <div
                key={round.round}
                className="stagger-child neo-brutal-card bg-card p-0 overflow-hidden"
                style={{
                  transitionDelay: `${roundIndex * 0.08}s`,
                }}
              >
                {/* Round header */}
                <div className="flex flex-col gap-3 border-b-3 border-white bg-secondary px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 text-2xl">{round.flag}</span>
                    <div className="min-w-0">
                      <div className="font-heading text-lg tracking-wider text-white sm:text-xl truncate">
                        R{String(round.round).padStart(2, "0")} &mdash;{" "}
                        {round.name}
                      </div>
                      <div className="text-xs text-muted truncate">
                        {round.circuit} &middot;{" "}
                        {new Date(round.dateStart).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        &ndash;{" "}
                        {new Date(round.dateEnd).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {round.status === "live" && (
                      <span className="flex items-center gap-2 border-2 border-primary bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary uppercase">
                        <span className="live-dot" />
                        LIVE
                      </span>
                    )}
                    {totalRoundPts > 0 && (
                      <span className="border-2 border-accent bg-accent/10 px-3 py-1 font-heading text-sm tracking-wider text-accent">
                        +{totalRoundPts} PTS
                      </span>
                    )}
                  </div>
                </div>

                {/* Session results */}
                <div className="px-4 py-2 sm:px-5">
                  {round.sessions.map((s, i) => (
                    <SessionRow key={`${round.round}-${s.session}-${i}`} result={s} />
                  ))}
                  {pendingSessions.map((name) => (
                    <PendingSession key={`${round.round}-pending-${name}`} name={name} />
                  ))}
                </div>

                {/* Results link */}
                <div className="border-t-2 border-border px-4 py-3 sm:px-5">
                  <a
                    href={`https://www.fiaformula3.com/Results?raceid=1069`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium tracking-wider text-accent hover:text-primary"
                  >
                    VIEW FULL RESULTS ON FIA F3 &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
