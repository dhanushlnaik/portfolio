import { motion } from 'framer-motion';
import React from 'react';
import { slideInFromLeft, slideInFromRight } from '../../utils/motion';

interface HeadingsProps {
  title: string;
  subtitle?: string;
}

const Headings: React.FC<HeadingsProps> = ({ title, subtitle }) => (
  <div>
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="text-[60px] text-white font-bold mt-10 text-center mb-5"
        >
          {title}
        </motion.div>
      <motion.div
        variants={slideInFromRight(0.5)}
        className="cursive text-[20px] text-gray-200 mb-10 mt-5 text-center"
      >
        {subtitle}
      </motion.div>
  </div>
);

export default Headings;