"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RaceRound } from "@/lib/types";
import LiveRaceTicker from "./LiveRaceTicker";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type CountdownKey = "days" | "hrs" | "min" | "sec";

function getCountdown(target: string): CountdownTime {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Hero({ nextRace }: { nextRace?: RaceRound }) {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [pulsingDigit, setPulsingDigit] = useState<CountdownKey | null>(null);
  const prevCountdown = useRef<CountdownTime>(countdown);

  const isLive = nextRace?.status === "live";
  const hasSessionData = (nextRace?.sessions?.length ?? 0) > 0;

  useEffect(() => {
    if (!nextRace || isLive) return;
    const tick = () => setCountdown(getCountdown(nextRace.dateStart));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextRace, isLive]);

  useEffect(() => {
    if (isLive) return;
    const prev = prevCountdown.current;
    let key: CountdownKey | null = null;
    if (countdown.seconds !== prev.seconds) key = "sec";
    else if (countdown.minutes !== prev.minutes) key = "min";
    else if (countdown.hours !== prev.hours) key = "hrs";
    else if (countdown.days !== prev.days) key = "days";
    prevCountdown.current = countdown;
    if (key) {
      setPulsingDigit(key);
      const t = setTimeout(() => setPulsingDigit(null), 200);
      return () => clearTimeout(t);
    }
  }, [countdown, isLive]);

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden pt-20"
    >
      {/* Background: cockpit image with heavy overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/yevan-cockpit.png"
          alt=""
          fill
          className="object-cover object-center opacity-30"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-background/70 to-background" />
        <div className="absolute inset-0 racing-stripe opacity-40" />
      </div>

      {/* Main content grid */}
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:min-h-screen lg:grid-cols-2 lg:gap-12 lg:py-0">
        {/* Left: text content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="animate-slide-up mb-3 inline-block border-3 border-accent bg-accent/10 px-4 py-1 font-body text-sm font-semibold tracking-widest text-accent uppercase">
            FIA FORMULA 3 CHAMPIONSHIP 2026
          </div>

          <h1
            className="animate-slide-up mt-2 font-heading text-6xl leading-[0.9] tracking-wider text-white sm:text-7xl md:text-8xl lg:text-9xl"
            style={{ animationDelay: "0.1s" }}
          >
            YEVAN
            <span className="block text-primary">DAVID</span>
          </h1>

          <div
            className="animate-slide-up mt-6 flex items-center gap-4 font-body text-lg font-medium text-muted"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="text-2xl">🇱🇰</span>
            <span className="h-4 w-px bg-muted" />
            <span>AIX Racing</span>
            <span className="h-4 w-px bg-muted" />
            <span className="text-accent">#27</span>
          </div>

          {/* Live race ticker — shown during active weekends with session data */}
          {isLive && hasSessionData && (
            <div className="mt-8 w-full">
              <LiveRaceTicker
                initialSessions={nextRace.sessions}
                isLive={true}
              />
            </div>
          )}

          {/* Countdown card — shown when NOT live, or live with no session data yet */}
          {nextRace && (!isLive || !hasSessionData) && (
            <div
              className="animate-slide-up mt-10 w-full max-w-md"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="neo-brutal-card bg-card p-5">
                <div className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
                  {isLive ? "Race Weekend Active" : "Next Race Weekend"}
                </div>
                <div className="mb-1 flex items-center gap-2 lg:justify-start justify-center">
                  <span className="text-2xl">{nextRace.flag}</span>
                  <span className="font-heading text-xl tracking-wider text-white sm:text-2xl">
                    {nextRace.name}
                  </span>
                </div>
                <div className="mb-4 text-sm text-muted">
                  {nextRace.circuit} &middot;{" "}
                  {new Date(nextRace.dateStart).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  &ndash;{" "}
                  {new Date(nextRace.dateEnd).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>

                {!isLive && (
                  <div className="grid grid-cols-4 gap-2">
                    {(
                      [
                        ["days", countdown.days],
                        ["hrs", countdown.hours],
                        ["min", countdown.minutes],
                        ["sec", countdown.seconds],
                      ] as const
                    ).map(([label, value]) => (
                      <div
                        key={label}
                        className={`border-2 border-border bg-secondary p-2 ${
                          pulsingDigit === label ? "countdown-digit-pulse" : ""
                        }`}
                      >
                        <div className="font-heading text-2xl text-primary sm:text-3xl tabular-nums">
                          {String(value).padStart(2, "0")}
                        </div>
                        <div className="text-[10px] tracking-widest text-muted uppercase">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Race weekend info strip — shown alongside ticker */}
          {isLive && hasSessionData && nextRace && (
            <div
              className="animate-slide-up mt-4 flex items-center gap-3 text-sm text-muted"
              style={{ animationDelay: "0.3s" }}
            >
              <span className="text-lg">{nextRace.flag}</span>
              <span className="font-heading tracking-wider text-white">
                {nextRace.name}
              </span>
              <span className="text-muted/50">&middot;</span>
              <span>{nextRace.circuit}</span>
            </div>
          )}

          <div
            className="animate-slide-up mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#standings"
              className="neo-brutal-btn min-h-[44px] w-full bg-primary px-8 py-3 text-center text-lg text-white sm:w-auto"
            >
              VIEW STANDINGS
            </a>
            <a
              href="#calendar"
              className="neo-brutal-btn min-h-[44px] w-full bg-secondary px-8 py-3 text-center text-lg text-white sm:w-auto"
            >
              RACE CALENDAR
            </a>
          </div>
        </div>

        {/* Right: portrait image with neo-brutal frame — overlaps next section */}
        <div
          className="animate-slide-up relative z-20 flex justify-center lg:justify-end lg:-mb-24 xl:-mb-32"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="relative">
            <div className="absolute top-3 left-3 h-full w-full border-3 border-primary bg-primary/20 sm:top-4 sm:left-4" />

            <div className="neo-brutal-card relative overflow-hidden bg-card">
              <Image
                src="/images/yevan-portrait.png"
                alt="Yevan David — AIX Racing F3 Driver"
                width={480}
                height={600}
                className="block h-auto w-full max-w-[480px] object-cover"
                priority
                quality={90}
              />

              <div className="absolute bottom-0 left-0 right-0 border-t-3 border-white bg-secondary/90 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-heading text-lg tracking-wider text-white">
                      YEVAN DAVID
                    </div>
                    <div className="text-xs font-medium tracking-widest text-accent uppercase">
                      AIX RACING
                    </div>
                  </div>
                  <div className="border-2 border-accent bg-accent/10 px-3 py-1 font-heading text-sm tracking-wider text-accent">
                    #27
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-2 -left-2 h-6 w-6 border-t-3 border-l-3 border-accent" />
            <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-3 border-r-3 border-accent" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="h-8 w-5 rounded-full border-2 border-muted p-1">
          <div className="mx-auto h-2 w-1 animate-bounce rounded-full bg-muted" />
        </div>
      </div>
    </section>
  );
}
