  import React from "react";
import SkillText from "./sub/SkillText";
import ProjectCard from "./sub/ProjectCard";
import {motion} from 'framer-motion'
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "../../utils/motion";
import { SparklesIcon, ArrowLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { Button } from "./ui/button";

  const Skills = () => {
    return (
      <section
        id="skills"
        className="flex flex-col items-center justify-center gap-3 h-full relative overflow-hidden pb-80 py-20"
        style={{ transform: "scale(0.9" }}
      >
        <SkillText />
  
        <div className="h-full w-full flex flex-col md:flex-row gap-10 px-10">
        <ProjectCard
          src="/projects/eipsinsights.png"
          title="EIPS Insights"
          description="User-friendly platform for exploring and understanding Ethereum Improvement Proposals (EIPs)."
        />
        <ProjectCard
          src="/projects/csinmamit.png"
          title="CSI NMAMIT"
          description="Dedicated platform for managing events, registrations, and member profiles for the CSI student branch at NMAMIT."
        />
        <ProjectCard
          src="/projects/SaavdhanIndia.png"
          title="Savdhaan India"
          description="Built at a hackathon, platform for enhancing public safety with timely updates and crucial information."
        />
      </div>

      <div className="mt-5">
      <Button variant={"secondary"} >
        My Work
        <ChevronDoubleRightIcon className="text-[#b49bff] mr-[10px] h-5 w-5" />
      </Button>
      </div>




  
        <div className="w-full h-full absolute">
          <div className="w-full h-full z-[-10] opacity-30 absolute flex items-center justify-center bg-cover">
            <video
              className="w-full h-auto"
              preload="false"
              playsInline
              loop
              muted
              autoPlay
              src="/cards-video.webm"
            />
          </div>
        </div>
      </section>
    );
  };
  
  export default Skills;