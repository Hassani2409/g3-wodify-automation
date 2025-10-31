"use client";

import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import TrainingPrograms from "@/components/TrainingPrograms";
import AboutPreview from "@/components/AboutPreview";
import CoachPreview from "@/components/CoachPreview";
import Testimonials from "@/components/Testimonials";
import { motion } from 'framer-motion';

export default function Home() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const MotionSection = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div>
      <HeroSection />
      <FeatureCards />
      <MotionSection>
        <TrainingPrograms />
      </MotionSection>
      <MotionSection>
        <AboutPreview />
      </MotionSection>
      <MotionSection>
        <CoachPreview />
      </MotionSection>
      <MotionSection>
        <Testimonials />
      </MotionSection>
    </div>
  );
}
