"use client"
import React from 'react'
import {motion} from 'framer-motion'
import { slideInFromLeft, slideInFromRight, slideInFromTop } from "../../../utils/motion";
import { SparklesIcon } from '@heroicons/react/24/solid'

const SkillText = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center justify-center'>

        <motion.div
          variants={slideInFromLeft(0.5)}
          className="text-[80px] text-white font-extrabold mt-10 text-center mb-2"
        >
          Projects
        </motion.div>
      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-purple-200 mb-10 text-center"
      >
  
          ✨ Things I{`'`}ve enjoyed working on ✨
  
      </motion.div>
    </div>
  )
}

export default SkillText