import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveTimingBoard from "@/components/LiveTimingBoard";

export const metadata: Metadata = {
  title: "Live Timing | Yevan Updates",
  description:
    "Experimental FIA Formula 3 live timing feed for Yevan David's 2026 season.",
};

export default function LivePage() {
  return (
    <>
      <Navbar isLive={true} />
      <main className="min-h-screen pt-20">
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-2 text-sm font-semibold tracking-widest text-accent uppercase">
              Experimental
            </div>
            <h1 className="mb-4 font-heading text-4xl tracking-wider text-white sm:text-5xl lg:text-6xl">
              LIVE TIMING
            </h1>
            <p className="mb-8 max-w-2xl text-sm text-muted">
              Real-time timing data streamed directly from the FIA F3 SignalR
              feed. This page is experimental and may not work if the FIA server
              blocks third-party connections. If the feed doesn&apos;t load, use
              the{" "}
              <a
                href="https://www.fiaformula3.com/livetiming/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-primary"
              >
                official FIA live timing
              </a>{" "}
              page instead.
            </p>

            <LiveTimingBoard />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
