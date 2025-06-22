import Image from "next/image";
import Approach from "~/components/Approach";
import Clients from "~/components/Clients";
import Experience from "~/components/Experience";
import Grid from "~/components/Grid";
import Hero from "~/components/Hero";
import RecentProjects from "~/components/RecentProjects";
import Skills from "~/components/Skills";

export default function Home() {
  return (
    <main>
      <Hero/>
      <Grid/>
      <RecentProjects/>
      <Approach/>
      <Clients/>
      <Experience/>
    </main>
  );
}
