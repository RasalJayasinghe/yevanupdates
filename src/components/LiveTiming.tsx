"use client";

import { useEffect, useState } from "react";
import { LiveStatus } from "@/lib/types";

export default function LiveTiming({
  initialStatus,
}: {
  initialStatus: LiveStatus;
}) {
  const [status, setStatus] = useState<LiveStatus>(initialStatus);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/live");
        if (res.ok) setStatus(await res.json());
      } catch {
        /* silently ignore */
      }
    };
    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="live" className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-2 text-sm font-semibold tracking-widest text-accent uppercase">
          Race Weekend
        </div>
        <h2 className="mb-12 font-heading text-5xl tracking-wider text-white sm:text-6xl">
          LIVE TIMING
        </h2>

        {status.isLive && (
          <div className="mb-8 neo-brutal-card animate-pulse-glow border-primary bg-primary/10 p-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-3">
              <span className="live-dot" />
              <span className="font-heading text-2xl tracking-wider text-primary">
                SESSION LIVE
              </span>
              <span className="live-dot" />
            </div>
            <div className="text-lg text-white">{status.session}</div>
            <div className="text-sm text-muted">{status.circuit}</div>
          </div>
        )}

        <div className="neo-brutal-card bg-card p-8 text-center">
          {!status.isLive && (
            <div className="mb-6">
              <div className="mb-2 font-heading text-3xl text-muted">
                NO ACTIVE SESSION
              </div>
              <p className="text-sm text-muted">
                Live timing will be available during race weekends. Check the
                calendar for upcoming events.
              </p>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={status.liveTimingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-brutal-btn bg-primary px-8 py-3 text-white"
            >
              OPEN FIA LIVE TIMING
            </a>

            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="neo-brutal-btn bg-secondary px-8 py-3 text-white"
            >
              {showEmbed ? "HIDE EMBED" : "EMBED TIMING"}
            </button>
          </div>

          {showEmbed && (
            <div className="mt-8 border-3 border-white">
              <iframe
                src={status.liveTimingUrl}
                className="h-[600px] w-full bg-black"
                title="FIA Formula 3 Live Timing"
                allow="fullscreen"
              />
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-muted">
          Live timing data provided by{" "}
          <a
            href="https://www.fiaformula3.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline"
          >
            FIA Formula 3
          </a>
          . Embedded content is subject to FIA availability.
        </div>
      </div>
    </section>
  );
}
