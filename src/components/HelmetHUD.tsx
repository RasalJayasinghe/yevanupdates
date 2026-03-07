"use client";

import Image from "next/image";
import { SessionResult } from "@/lib/types";

interface HelmetHUDProps {
  sessions: SessionResult[];
  isLive: boolean;
}

function getLatestStat(sessions: SessionResult[]) {
  const latest = sessions[sessions.length - 1];
  if (!latest) return null;

  const best =
    sessions.find((s) => s.session === "Sprint Race") ??
    sessions.find((s) => s.session === "Feature Race") ??
    sessions.find((s) => s.session === "Qualifying") ??
    latest;

  return best;
}

export default function HelmetHUD({ sessions, isLive }: HelmetHUDProps) {
  const stat = getLatestStat(sessions);
  const hasSessions = sessions.length > 0;

  const dataPoints = stat
    ? [
        { label: "POS", value: stat.position ? `P${stat.position}` : "—", angle: -60 },
        { label: "TIME", value: stat.time ?? "—", angle: -20 },
        { label: "GAP", value: stat.gap ? `${stat.gap}s` : "—", angle: 20 },
        { label: "LAPS", value: stat.laps ? `${stat.laps}` : "—", angle: 60 },
      ]
    : [];

  const r = 46;
  const cx = 50;
  const cy = 50;

  function arcPath(startAngle: number, endAngle: number, radius: number) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  }

  function polarToCartesian(
    centerX: number,
    centerY: number,
    radius: number,
    angleDeg: number
  ) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  }

  function dataPointPos(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    const distance = 54;
    return {
      x: cx + distance * Math.cos(rad),
      y: cy + distance * Math.sin(rad),
    };
  }

  return (
    <div className="relative aspect-square w-full max-w-[460px] xl:max-w-[500px]">
      {/* SVG HUD rings */}
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 h-full w-full ${isLive ? "hud-glow-live" : ""}`}
        fill="none"
      >
        {/* Outer rotating arc segments */}
        <g className="hud-ring-outer" style={{ transformOrigin: "50% 50%" }}>
          <path
            d={arcPath(0, 90, r)}
            stroke="var(--color-accent)"
            strokeWidth="0.3"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
          <path
            d={arcPath(120, 210, r)}
            stroke="var(--color-primary)"
            strokeWidth="0.3"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
          <path
            d={arcPath(240, 330, r)}
            stroke="var(--color-accent)"
            strokeWidth="0.2"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />
        </g>

        {/* Inner counter-rotating ring */}
        <g className="hud-ring-inner" style={{ transformOrigin: "50% 50%" }}>
          <path
            d={arcPath(30, 150, r - 3)}
            stroke="var(--color-primary)"
            strokeWidth="0.2"
            strokeOpacity="0.3"
            strokeDasharray="1 2"
          />
          <path
            d={arcPath(200, 340, r - 3)}
            stroke="var(--color-accent)"
            strokeWidth="0.2"
            strokeOpacity="0.25"
            strokeDasharray="1 2"
          />
        </g>

        {/* Static tick marks around the circle */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10;
          const inner = polarToCartesian(cx, cy, r - 1, angle);
          const outer = polarToCartesian(cx, cy, r + 0.5, angle);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={i % 9 === 0 ? "var(--color-accent)" : "var(--color-muted)"}
              strokeWidth={i % 9 === 0 ? "0.4" : "0.15"}
              strokeOpacity={i % 9 === 0 ? "0.7" : "0.25"}
            />
          );
        })}

        {/* Crosshair lines */}
        <line x1="50" y1="4" x2="50" y2="8" stroke="var(--color-accent)" strokeWidth="0.15" strokeOpacity="0.4" />
        <line x1="50" y1="92" x2="50" y2="96" stroke="var(--color-accent)" strokeWidth="0.15" strokeOpacity="0.4" />
        <line x1="4" y1="50" x2="8" y2="50" stroke="var(--color-accent)" strokeWidth="0.15" strokeOpacity="0.4" />
        <line x1="92" y1="50" x2="96" y2="50" stroke="var(--color-accent)" strokeWidth="0.15" strokeOpacity="0.4" />
      </svg>

      {/* Helmet image — floating */}
      <div className="absolute inset-[12%] rounded-full overflow-hidden animate-helmet-float">
        <Image
          src="/images/yevan-helmet-profile.png"
          alt="Yevan David helmet"
          fill
          className="object-cover object-center scale-110"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </div>

      {/* Data points around the helmet */}
      {hasSessions && (
        <div className="absolute inset-0">
          {dataPoints.map((dp, i) => {
            const pos = dataPointPos(dp.angle);
            return (
              <div
                key={dp.label}
                className="hud-data-point absolute flex flex-col items-center"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                <span className="text-[9px] tracking-widest text-muted/70 uppercase">
                  {dp.label}
                </span>
                <span className="font-heading text-sm text-white xl:text-base tabular-nums">
                  {dp.value}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Live indicator at top */}
      {isLive && (
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <span className="live-dot !w-2 !h-2" />
          <span className="text-[9px] font-semibold tracking-widest text-primary uppercase">
            LIVE
          </span>
        </div>
      )}

      {/* Session label at bottom */}
      {stat && (
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 text-center">
          <span className="text-[9px] tracking-widest text-accent/70 uppercase">
            {stat.session}
          </span>
        </div>
      )}
    </div>
  );
}
