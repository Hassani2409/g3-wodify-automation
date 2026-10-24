import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import TrainingPrograms from "@/components/TrainingPrograms";
import AboutPreview from "@/components/AboutPreview";
import CoachPreview from "@/components/CoachPreview";
import MotionSection from "@/components/MotionSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <MotionSection><FeatureCards /></MotionSection>
      <MotionSection>
        <TrainingPrograms />
      </MotionSection>
      <MotionSection>
        <AboutPreview />
      </MotionSection>
      <MotionSection>
        <CoachPreview />
      </MotionSection>
    </div>
  );
}
