"use client";

import { useState } from "react";

const LIVE_TIMING_URL = "/live";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Standings", href: "#standings" },
  { label: "Results", href: "#results" },
  { label: "Calendar", href: "#calendar" },
];

export default function Navbar({ isLive }: { isLive: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-3 border-white bg-secondary/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#hero" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-3 border-primary bg-primary font-heading text-xl text-white">
            YD
          </div>
          <div className="hidden sm:block">
            <div className="font-heading text-xl leading-none tracking-wider text-white">
              YEVAN DAVID
            </div>
            <div className="font-body text-xs font-medium tracking-widest text-accent uppercase">
              AIX RACING
            </div>
          </div>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="neo-brutal-btn border-2 border-transparent bg-transparent px-4 py-2 text-sm text-white shadow-none hover:border-primary hover:shadow-none hover:translate-0"
            >
              {link.label}
            </a>
          ))}

          <a
            href={LIVE_TIMING_URL}
            className={`neo-brutal-btn ml-1 flex items-center gap-2 px-4 py-2 text-sm shadow-none hover:translate-0 ${
              isLive
                ? "border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-none"
                : "border-2 border-transparent bg-transparent text-white hover:border-primary hover:shadow-none"
            }`}
          >
            {isLive && <span className="live-dot" />}
            Live Timing
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {isLive && (
            <a
              href={LIVE_TIMING_URL}
              className="flex items-center gap-1.5 border-2 border-primary bg-primary/10 px-3 py-1.5 text-xs font-semibold tracking-widest text-primary"
            >
              <span className="live-dot" />
              LIVE
            </a>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5 border-2 border-white"
            aria-label="Toggle menu"
          >
            <span
              className={`h-0.5 w-5 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-3 border-white bg-secondary px-4 py-4 sm:px-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 font-heading text-lg tracking-wider text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href={LIVE_TIMING_URL}
            onClick={() => setOpen(false)}
            className={`block py-3 font-heading text-lg tracking-wider ${
              isLive ? "text-primary" : "text-white"
            }`}
          >
            {isLive && (
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
            Live Timing
          </a>
        </div>
      )}
    </nav>
  );
}
