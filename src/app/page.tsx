import { getCalendar, getStandings, getLiveStatus, getNextRace } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StandingsWidget from "@/components/StandingsWidget";
import RoundResults from "@/components/RoundResults";
import Calendar from "@/components/Calendar";
import LiveTiming from "@/components/LiveTiming";
import Footer from "@/components/Footer";

export const revalidate = 600;

export default async function Home() {
  const [calendar, standing, liveStatus] = await Promise.all([
    getCalendar(),
    getStandings(),
    getLiveStatus(),
  ]);

  const nextRace = getNextRace(calendar);

  return (
    <>
      <Navbar />
      <main>
        <Hero nextRace={nextRace} />
        <StandingsWidget standing={standing} />
        <RoundResults rounds={calendar} />
        <Calendar rounds={calendar} />
        <LiveTiming initialStatus={liveStatus} />
      </main>
      <Footer />
    </>
  );
}
