import { DriverStanding } from "@/lib/types";

export default function StandingsWidget({
  standing,
}: {
  standing: DriverStanding;
}) {
  const hasRaceData = standing.pointsHistory.length > 0;
  const bestRoundPts = hasRaceData
    ? Math.max(...standing.pointsHistory.map((p) => p.points))
    : 0;

  return (
    <section id="standings" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 text-sm font-semibold tracking-widest text-accent uppercase">
          Championship
        </div>
        <h2 className="mb-12 font-heading text-5xl tracking-wider text-white sm:text-6xl">
          STANDINGS
        </h2>

        {/* Stat cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="neo-brutal-card bg-card p-6 text-center">
            <div className="mb-2 text-xs tracking-widest text-muted uppercase">
              Position
            </div>
            <div className="font-heading text-6xl text-primary">
              {standing.position > 0 ? `P${standing.position}` : "—"}
            </div>
            <div className="mt-1 text-xs text-muted">Driver Standings</div>
          </div>

          <div className="neo-brutal-card bg-card p-6 text-center">
            <div className="mb-2 text-xs tracking-widest text-muted uppercase">
              Points
            </div>
            <div className="font-heading text-6xl text-accent">
              {standing.points}
            </div>
            <div className="mt-1 text-xs text-muted">Total</div>
          </div>

          <div className="neo-brutal-card bg-card p-6 text-center">
            <div className="mb-2 text-xs tracking-widest text-muted uppercase">
              Car Number
            </div>
            <div className="font-heading text-6xl text-white">
              #{standing.driverNumber}
            </div>
            <div className="mt-1 text-xs text-muted">{standing.team}</div>
          </div>

          <div className="neo-brutal-card bg-card p-6 text-center">
            <div className="mb-2 text-xs tracking-widest text-muted uppercase">
              Best Round
            </div>
            <div className="font-heading text-6xl text-white">
              {bestRoundPts > 0 ? `+${bestRoundPts}` : "—"}
            </div>
            <div className="mt-1 text-xs text-muted">Points in a round</div>
          </div>
        </div>

        {/* Points history chart */}
        {hasRaceData && (
          <div className="mt-8 neo-brutal-card bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-widest text-muted uppercase">
                Points Per Round
              </span>
              <span className="text-xs text-muted">
                Cumulative: {standing.points} pts
              </span>
            </div>
            <div className="flex items-end gap-3 h-36">
              {standing.pointsHistory.map((ph) => {
                const maxPts = Math.max(
                  ...standing.pointsHistory.map((p) => p.points),
                  1
                );
                const height = Math.max((ph.points / maxPts) * 100, 4);
                return (
                  <div
                    key={ph.round}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-xs font-semibold text-accent">
                      {ph.points > 0 ? `+${ph.points}` : "0"}
                    </span>
                    <div
                      className="w-full border-2 border-primary bg-primary/30 transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-muted">R{ph.round}</span>
                    <span className="text-[10px] font-semibold text-white">
                      {ph.cumulative}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 text-center text-[10px] tracking-wider text-muted/50 uppercase">
              Round points / Cumulative total
            </div>
          </div>
        )}

        {/* Status note */}
        <div className="mt-8 border-2 border-border bg-card/50 p-4 text-center text-sm text-muted">
          {standing.points > 0
            ? `Yevan David currently has ${standing.points} championship points.`
            : "Round 1 is underway — championship points will update after race results."}{" "}
          Data sourced from{" "}
          <a
            href="https://www.fiaformula3.com/Standings/Driver"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            FIA Formula 3
          </a>
          {" "}and{" "}
          <a
            href="https://www.fiaformula3.com/Results?raceid=1069"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            Round Results
          </a>
          .
        </div>
      </div>
    </section>
  );
}
