"use client";

import { useEffect, useState, useCallback } from "react";
import { SessionResult } from "@/lib/types";

interface TickerData {
  sessions: SessionResult[];
  isLive: boolean;
  circuit: string | null;
}

export default function LiveRaceTicker({
  initialSessions,
  isLive,
}: {
  initialSessions: SessionResult[];
  isLive: boolean;
}) {
  const [data, setData] = useState<TickerData>({
    sessions: initialSessions,
    isLive,
    circuit: null,
  });
  const [activeIdx, setActiveIdx] = useState(0);

  const poll = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) return;
      const calendar = await res.json();
      const liveRound = calendar.find(
        (r: { status: string }) => r.status === "live"
      );
      if (liveRound && liveRound.sessions.length > 0) {
        setData({
          sessions: liveRound.sessions,
          isLive: true,
          circuit: liveRound.circuit,
        });
      }
    } catch {
      /* silently ignore */
    }
  }, []);

  useEffect(() => {
    if (!data.isLive) return;
    const id = setInterval(poll, 60_000);
    return () => clearInterval(id);
  }, [data.isLive, poll]);

  useEffect(() => {
    if (data.sessions.length <= 1) return;
    const id = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % data.sessions.length);
    }, 4000);
    return () => clearInterval(id);
  }, [data.sessions.length]);

  if (data.sessions.length === 0 && !data.isLive) return null;

  const latestSession = data.sessions[data.sessions.length - 1];
  const activeSession = data.sessions[activeIdx] ?? latestSession;

  return (
    <div className="animate-slide-up w-full max-w-md" style={{ animationDelay: "0.15s" }}>
      {/* Live indicator bar */}
      {data.isLive && (
        <div className="mb-3 flex items-center gap-2">
          <span className="live-dot" />
          <span className="font-heading text-sm tracking-widest text-primary">
            RACE WEEKEND LIVE
          </span>
          <span className="live-dot" />
        </div>
      )}

      {/* Session ticker */}
      <div className="neo-brutal-card border-primary bg-card/80 backdrop-blur-sm p-0 overflow-hidden">
        {/* Scrolling sessions tabs */}
        <div className="flex border-b-2 border-border">
          {data.sessions.map((s, i) => (
            <button
              key={s.session}
              onClick={() => setActiveIdx(i)}
              className={`flex-1 px-3 py-2 text-[10px] font-semibold tracking-widest uppercase transition-colors ${
                i === activeIdx
                  ? "bg-primary/20 text-primary border-b-2 border-primary -mb-[2px]"
                  : "text-muted hover:text-white"
              }`}
            >
              {s.session === "Sprint Race"
                ? "SPRINT"
                : s.session === "Feature Race"
                  ? "FEATURE"
                  : s.session === "Qualifying"
                    ? "QUALI"
                    : "FP"}
            </button>
          ))}
          {data.isLive && data.sessions.length < 4 && (
            <>
              {!data.sessions.find((s) => s.session === "Sprint Race") && (
                <div className="flex-1 px-3 py-2 text-[10px] tracking-widest text-muted/30 text-center uppercase">
                  SPRINT
                </div>
              )}
              {!data.sessions.find((s) => s.session === "Feature Race") && (
                <div className="flex-1 px-3 py-2 text-[10px] tracking-widest text-muted/30 text-center uppercase">
                  FEATURE
                </div>
              )}
            </>
          )}
        </div>

        {/* Active session detail */}
        {activeSession && (
          <div className="p-4">
            <div className="flex items-center justify-between">
              {/* Position */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-14 w-14 items-center justify-center border-3 font-heading text-2xl ${
                    activeSession.position && activeSession.position <= 10
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-secondary text-white"
                  }`}
                >
                  {activeSession.position
                    ? `P${activeSession.position}`
                    : "—"}
                </div>
                <div>
                  <div className="font-heading text-base tracking-wider text-white">
                    {activeSession.session.toUpperCase()}
                  </div>
                  <div className="text-xs text-muted">
                    {activeSession.time || "No time set"}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-right">
                {activeSession.gap && (
                  <div>
                    <div className="text-[10px] tracking-widest text-muted uppercase">
                      GAP
                    </div>
                    <div className="font-heading text-lg text-primary">
                      {activeSession.gap}s
                    </div>
                  </div>
                )}
                {activeSession.laps && (
                  <div>
                    <div className="text-[10px] tracking-widest text-muted uppercase">
                      LAPS
                    </div>
                    <div className="font-heading text-lg text-white">
                      {activeSession.laps}
                    </div>
                  </div>
                )}
                {activeSession.points > 0 && (
                  <div>
                    <div className="text-[10px] tracking-widest text-muted uppercase">
                      PTS
                    </div>
                    <div className="font-heading text-lg text-accent">
                      +{activeSession.points}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Auto-cycle indicator dots */}
        {data.sessions.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-3">
            {data.sessions.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === activeIdx
                    ? "w-4 bg-primary"
                    : "w-1 bg-muted/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
