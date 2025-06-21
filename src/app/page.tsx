import Image from "next/image";
import Approach from "~/components/Approach";
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
    </main>
  );
}
