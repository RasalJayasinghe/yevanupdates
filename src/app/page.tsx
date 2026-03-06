import { getCalendar, getStandings, getNextRace } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StandingsWidget from "@/components/StandingsWidget";
import RoundResults from "@/components/RoundResults";
import Calendar from "@/components/Calendar";
import Footer from "@/components/Footer";

export const revalidate = 600;

export default async function Home() {
  const [calendar, standing] = await Promise.all([
    getCalendar(),
    getStandings(),
  ]);

  const nextRace = getNextRace(calendar);
  const isLive = calendar.some((r) => r.status === "live");

  return (
    <>
      <Navbar isLive={isLive} />
      <main>
        <Hero nextRace={nextRace} />
        <StandingsWidget standing={standing} />
        <RoundResults rounds={calendar} />
        <Calendar rounds={calendar} />
      </main>
      <Footer />
    </>
  );
}
