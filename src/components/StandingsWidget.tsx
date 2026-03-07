"use client";

import { useInView } from "@/hooks/useInView";
import { DriverStanding } from "@/lib/types";

export default function StandingsWidget({
  standing,
}: {
  standing: DriverStanding;
}) {
  const { ref, isInView } = useInView();
  const hasRaceData = standing.pointsHistory.length > 0;
  const bestRoundPts = hasRaceData
    ? Math.max(...standing.pointsHistory.map((p) => p.points))
    : 0;

  return (
    <section
      ref={ref}
      id="standings"
      className={`section-enter relative px-4 py-12 sm:px-6 sm:py-16 lg:py-24 ${isInView ? "visible" : ""}`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 text-sm font-semibold tracking-widest text-accent uppercase">
          Championship
        </div>
        <h2 className="mb-8 font-heading text-4xl tracking-wider text-white sm:mb-12 sm:text-5xl lg:text-6xl">
          STANDINGS
        </h2>

        {/* Stat cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Position",
              value: standing.position > 0 ? `P${standing.position}` : "—",
              valueClass: "text-primary",
              sub: "Driver Standings",
            },
            {
              label: "Points",
              value: String(standing.points),
              valueClass: "text-accent",
              sub: "Total",
            },
            {
              label: "Car Number",
              value: `#${standing.driverNumber}`,
              valueClass: "text-white",
              sub: standing.team,
            },
            {
              label: "Best Round",
              value: bestRoundPts > 0 ? `+${bestRoundPts}` : "—",
              valueClass: "text-white",
              sub: "Points in a round",
            },
          ].map((card, i) => (
            <div
              key={card.label}
              className="stagger-child neo-brutal-card bg-card p-6 text-center"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div className="mb-2 text-xs tracking-widest text-muted uppercase">
                {card.label}
              </div>
              <div
                className={`font-heading text-5xl sm:text-6xl ${card.valueClass}`}
              >
                {card.value}
              </div>
              <div className="mt-1 text-xs text-muted">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Points history chart */}
        {hasRaceData && (
          <div
            className="stagger-child mt-8 neo-brutal-card bg-card p-6"
            style={{ transitionDelay: "0.24s" }}
          >
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
        <div
          className="stagger-child mt-8 border-2 border-border bg-card/50 p-4 text-center text-sm text-muted"
          style={{ transitionDelay: "0.3s" }}
        >
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
