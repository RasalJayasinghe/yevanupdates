"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

const JQUERY_CDN = "https://code.jquery.com/jquery-2.1.4.min.js";
const SIGNALR_CDN =
  "https://cdnjs.cloudflare.com/ajax/libs/signalr.js/2.4.1/jquery.signalR.min.js";
const HUBS_URL = "https://ltss.fiaformula3.com/streaming/hubs";
const HUB_CONNECTION_URL = "https://ltss.fiaformula3.com/streaming";

const FIA_LIVE_TIMING_URL =
  "https://www.fiaformula3.com/livetiming/index.html";

type Status = "loading-scripts" | "connecting" | "connected" | "error" | "no-session";

interface DriverLine {
  position: string;
  number: string;
  name: string;
  tla: string;
  gap: string;
  interval: string;
  bestLap: string;
  sector1: string;
  sector2: string;
  sector3: string;
  laps: string;
  pits: string;
}

interface SessionInfo {
  session: string;
  round: string;
  country: string;
  countdown: string;
  trackStatus: string;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export default function LiveTimingBoard() {
  const [status, setStatus] = useState<Status>("loading-scripts");
  const [errorMsg, setErrorMsg] = useState("");
  const [drivers, setDrivers] = useState<DriverLine[]>([]);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    session: "",
    round: "",
    country: "",
    countdown: "",
    trackStatus: "",
  });
  const connectionRef = useRef<any>(null);
  const mountedRef = useRef(true);

  const cleanup = useCallback(() => {
    mountedRef.current = false;
    try {
      connectionRef.current?.stop();
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    initConnection();
    return cleanup;
  }, [cleanup]);

  async function initConnection() {
    try {
      setStatus("loading-scripts");

      await loadScript(JQUERY_CDN);
      if (!mountedRef.current) return;

      await loadScript(SIGNALR_CDN);
      if (!mountedRef.current) return;

      await loadScript(HUBS_URL);
      if (!mountedRef.current) return;

      setStatus("connecting");
      connectToHub();
    } catch (err: any) {
      if (!mountedRef.current) return;
      setStatus("error");
      setErrorMsg(err?.message ?? "Failed to load required scripts.");
    }
  }

  function connectToHub() {
    const $ = (window as any).jQuery;
    if (!$ || !$.hubConnection) {
      setStatus("error");
      setErrorMsg(
        "SignalR library did not load correctly. The FIA hub script may have been blocked."
      );
      return;
    }

    try {
      const connection = $.hubConnection(HUB_CONNECTION_URL);
      connectionRef.current = connection;

      const proxy = connection.createHubProxy("streaming");

      proxy.on("feed", (data: any) => {
        if (!mountedRef.current) return;
        try {
          handleFeedData(data);
        } catch {
          /* ignore parse errors */
        }
      });

      proxy.on("commentary", () => {
        /* not used */
      });

      connection.logging = false;
      connection.reconnectDelay = 5000;

      connection.stateChanged((change: any) => {
        if (!mountedRef.current) return;
        // $.signalR.connectionState: 0=connecting, 1=connected, 2=reconnecting, 4=disconnected
        if (change.newState === 1) {
          setStatus("connected");
        } else if (change.newState === 4) {
          setStatus("error");
          setErrorMsg("Connection lost. The session may have ended.");
        }
      });

      connection.error((err: any) => {
        if (!mountedRef.current) return;
        const msg =
          err?.message ??
          err?.source?.message ??
          "Connection error";
        if (
          msg.includes("CORS") ||
          msg.includes("Access-Control") ||
          msg.includes("No Transport") ||
          msg.includes("negotiate")
        ) {
          setStatus("error");
          setErrorMsg(
            "The FIA server blocked the connection (CORS). This is expected for third-party sites."
          );
        } else {
          setStatus("error");
          setErrorMsg(msg);
        }
      });

      connection
        .start({ transport: ["webSockets", "longPolling"] })
        .done(() => {
          if (!mountedRef.current) return;
          setStatus("connected");
        })
        .fail((err: any) => {
          if (!mountedRef.current) return;
          setStatus("error");
          setErrorMsg(
            err?.message ??
              "Unable to connect. The FIA server may not allow third-party connections."
          );
        });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Failed to initialize SignalR connection.");
    }
  }

  function handleFeedData(data: any) {
    if (!data) return;

    if (data.Session) {
      setSessionInfo((prev) => ({ ...prev, session: data.Session }));
    }
    if (data.RoundNumber) {
      setSessionInfo((prev) => ({ ...prev, round: data.RoundNumber }));
    }
    if (data.Country) {
      setSessionInfo((prev) => ({ ...prev, country: data.Country }));
    }

    if (data.Lines || data.R) {
      const lines = data.Lines || data.R;
      if (typeof lines === "object" && lines !== null) {
        setDrivers((prev) => {
          const updated = [...prev];
          for (const [num, lineData] of Object.entries(lines)) {
            const ld = lineData as any;
            const existingIdx = updated.findIndex((d) => d.number === num);
            const existing = existingIdx >= 0 ? updated[existingIdx] : createEmptyLine(num);

            const merged: DriverLine = {
              position: ld?.Line?.toString() ?? ld?.Position?.toString() ?? existing.position,
              number: num,
              name: ld?.BroadcastName ?? ld?.FullName ?? existing.name,
              tla: ld?.Tla ?? ld?.TLA ?? existing.tla,
              gap: ld?.GapToLeader ?? ld?.TimeDiffToFastest ?? existing.gap,
              interval: ld?.IntervalToPositionAhead?.Value ?? ld?.Interval ?? existing.interval,
              bestLap: ld?.BestLapTime?.Value ?? existing.bestLap,
              sector1: extractSector(ld, 0) ?? existing.sector1,
              sector2: extractSector(ld, 1) ?? existing.sector2,
              sector3: extractSector(ld, 2) ?? existing.sector3,
              laps: ld?.NumberOfLaps?.toString() ?? existing.laps,
              pits: ld?.NumberOfPitStops?.toString() ?? existing.pits,
            };

            if (existingIdx >= 0) {
              updated[existingIdx] = merged;
            } else {
              updated.push(merged);
            }
          }

          return updated.sort((a, b) => {
            const pa = parseInt(a.position) || 999;
            const pb = parseInt(b.position) || 999;
            return pa - pb;
          });
        });
      }
    }
  }

  function extractSector(ld: any, idx: number): string | null {
    if (ld?.Sectors && Array.isArray(ld.Sectors) && ld.Sectors[idx]) {
      return ld.Sectors[idx]?.Value ?? null;
    }
    const key = `Sector${idx + 1}`;
    if (ld?.[key]?.Value) return ld[key].Value;
    return null;
  }

  function createEmptyLine(number: string): DriverLine {
    return {
      position: "",
      number,
      name: "",
      tla: "",
      gap: "",
      interval: "",
      bestLap: "",
      sector1: "",
      sector2: "",
      sector3: "",
      laps: "",
      pits: "",
    };
  }

  // --- RENDER ---

  if (status === "loading-scripts") {
    return <StatusCard icon="loading" title="Loading Scripts" message="Loading jQuery, SignalR, and FIA hub scripts..." />;
  }

  if (status === "connecting") {
    return <StatusCard icon="loading" title="Connecting" message="Establishing connection to FIA F3 live timing server..." />;
  }

  if (status === "error") {
    return (
      <div className="neo-brutal-card bg-card p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border-3 border-primary bg-primary/10 font-heading text-xl text-primary">
            !
          </div>
          <div>
            <h3 className="font-heading text-xl tracking-wider text-white">
              CONNECTION FAILED
            </h3>
            <p className="mt-2 text-sm text-muted">{errorMsg}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setStatus("loading-scripts");
                  setErrorMsg("");
                  setDrivers([]);
                  initConnection();
                }}
                className="neo-brutal-btn bg-secondary px-6 py-2 text-sm text-white"
              >
                RETRY
              </button>
              <a
                href={FIA_LIVE_TIMING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-brutal-btn bg-primary px-6 py-2 text-sm text-white"
              >
                OFFICIAL FIA TIMING
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "connected" && drivers.length === 0) {
    return (
      <StatusCard
        icon="waiting"
        title="Connected"
        message="Connected to FIA server. Waiting for timing data — a session may not be active right now."
        extra={
          <a
            href={FIA_LIVE_TIMING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-accent underline hover:text-primary"
          >
            Check official FIA live timing
          </a>
        }
      />
    );
  }

  return (
    <div>
      {/* Connection + session header */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold tracking-widest text-accent uppercase">
            CONNECTED
          </span>
        </div>
        {sessionInfo.session && (
          <span className="border-2 border-border px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase">
            {sessionInfo.session}
          </span>
        )}
        {sessionInfo.country && (
          <span className="text-xs text-muted">{sessionInfo.country}</span>
        )}
      </div>

      {/* Timing table */}
      <div className="neo-brutal-card overflow-hidden bg-card p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead>
              <tr className="border-b-3 border-white bg-secondary">
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">P</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">#</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">DRIVER</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">GAP</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">INT</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">BEST</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">S1</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">S2</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">S3</th>
                <th className="px-3 py-3 font-heading text-xs tracking-widest text-muted">LAPS</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => {
                const isYevan = d.number === "27";
                return (
                  <tr
                    key={d.number}
                    className={`border-b border-border transition-colors ${
                      isYevan
                        ? "bg-accent/10 border-l-4 border-l-accent"
                        : "hover:bg-card/80"
                    }`}
                  >
                    <td className="px-3 py-2.5 font-heading text-base text-primary tabular-nums">
                      {d.position}
                    </td>
                    <td className="px-3 py-2.5 font-heading text-sm text-accent tabular-nums">
                      {d.number}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="font-heading text-sm tracking-wider text-white">
                        {d.tla || d.name || `Driver ${d.number}`}
                      </span>
                      {d.name && d.tla && (
                        <span className="ml-2 hidden text-xs text-muted sm:inline">
                          {d.name}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-body text-sm text-yellow-400 tabular-nums">
                      {d.gap || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-body text-sm text-white tabular-nums">
                      {d.interval || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-body text-sm text-white tabular-nums">
                      {d.bestLap || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-body text-xs text-muted tabular-nums">
                      {d.sector1 || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-body text-xs text-muted tabular-nums">
                      {d.sector2 || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-body text-xs text-muted tabular-nums">
                      {d.sector3 || "—"}
                    </td>
                    <td className="px-3 py-2.5 font-body text-sm text-white tabular-nums">
                      {d.laps || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-4 text-center text-xs text-muted/60">
        Data streamed from FIA F3 live timing. Unofficial and for personal use only.
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  message,
  extra,
}: {
  icon: "loading" | "waiting";
  title: string;
  message: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="neo-brutal-card bg-card p-8 text-center">
      <div className="mb-4 flex justify-center">
        {icon === "loading" ? (
          <div className="h-12 w-12 border-3 border-accent border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center border-3 border-accent bg-accent/10 rounded-full">
            <span className="h-3 w-3 rounded-full bg-accent animate-pulse" />
          </div>
        )}
      </div>
      <h3 className="font-heading text-xl tracking-wider text-white">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {extra}
    </div>
  );
}
