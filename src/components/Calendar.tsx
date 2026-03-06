import { RaceRound } from "@/lib/types";

function StatusBadge({ status }: { status: RaceRound["status"] }) {
  const styles = {
    upcoming: "border-muted text-muted",
    live: "border-primary bg-primary/20 text-primary animate-pulse-glow",
    completed: "border-accent bg-accent/10 text-accent",
  };
  const labels = {
    upcoming: "UPCOMING",
    live: "LIVE NOW",
    completed: "COMPLETED",
  };
  return (
    <span
      className={`inline-block border-2 px-2 py-0.5 text-xs font-semibold tracking-widest uppercase ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function Calendar({ rounds }: { rounds: RaceRound[] }) {
  return (
    <section id="calendar" className="relative px-4 py-12 sm:px-6 sm:py-16 lg:py-24 racing-stripe">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 text-sm font-semibold tracking-widest text-accent uppercase">
          2026 Season
        </div>
        <h2 className="mb-8 font-heading text-4xl tracking-wider text-white sm:mb-12 sm:text-5xl lg:text-6xl">
          RACE CALENDAR
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rounds.map((round, i) => {
            const hasResults = round.sessions.length > 0;
            const qualiResult = round.sessions.find(
              (s) => s.session === "Qualifying"
            );
            const sprintResult = round.sessions.find(
              (s) => s.session === "Sprint Race"
            );
            const featureResult = round.sessions.find(
              (s) => s.session === "Feature Race"
            );
            const roundPts = round.sessions.reduce(
              (sum, s) => sum + s.points,
              0
            );

            return (
              <div
                key={round.round}
                className={`neo-brutal-card bg-card p-5 animate-slide-up ${
                  round.status === "live" ? "border-primary" : ""
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-heading text-lg text-muted">
                    R{String(round.round).padStart(2, "0")}
                  </span>
                  <StatusBadge status={round.status} />
                </div>

                <div className="mb-1 flex items-center gap-2">
                  <span className="text-2xl">{round.flag}</span>
                  <h3 className="font-heading text-xl leading-tight tracking-wider text-white line-clamp-2">
                    {round.name}
                  </h3>
                </div>

                <div className="mb-3 text-sm text-muted truncate">{round.circuit}</div>

                {/* Session mini-results */}
                {hasResults && (
                  <div className="mb-3 space-y-1.5">
                    {qualiResult && (
                      <div className="flex items-center justify-between border-l-2 border-muted pl-2 text-xs">
                        <span className="text-muted">QUALI</span>
                        <span className="font-heading text-sm text-white">
                          P{qualiResult.position}{" "}
                          <span className="text-muted font-body">
                            {qualiResult.time}
                          </span>
                        </span>
                      </div>
                    )}
                    {sprintResult && (
                      <div className="flex items-center justify-between border-l-2 border-primary pl-2 text-xs">
                        <span className="text-muted">SPRINT</span>
                        <span className="font-heading text-sm text-white">
                          P{sprintResult.position}
                          {sprintResult.points > 0 && (
                            <span className="ml-1 text-accent">
                              +{sprintResult.points}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {featureResult && (
                      <div className="flex items-center justify-between border-l-2 border-accent pl-2 text-xs">
                        <span className="text-muted">FEATURE</span>
                        <span className="font-heading text-sm text-white">
                          P{featureResult.position}
                          {featureResult.points > 0 && (
                            <span className="ml-1 text-accent">
                              +{featureResult.points}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                    {!sprintResult && round.status === "live" && (
                      <div className="flex items-center justify-between border-l-2 border-dashed border-muted/30 pl-2 text-xs">
                        <span className="text-muted/40">SPRINT</span>
                        <span className="text-muted/40">TBD</span>
                      </div>
                    )}
                    {!featureResult && round.status === "live" && (
                      <div className="flex items-center justify-between border-l-2 border-dashed border-muted/30 pl-2 text-xs">
                        <span className="text-muted/40">FEATURE</span>
                        <span className="text-muted/40">TBD</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-border pt-3 text-sm">
                  <span className="text-muted">
                    {new Date(round.dateStart).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    &ndash;{" "}
                    {new Date(round.dateEnd).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  {roundPts > 0 && (
                    <span className="font-heading text-sm text-accent">
                      +{roundPts} PTS
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
