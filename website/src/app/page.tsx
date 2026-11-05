import ClosingInvitation from "@/components/ClosingInvitation";
import Directions from "@/components/Directions";
import PodcastSection from "@/components/PodcastSection";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import WhiteboardWOD from "@/components/WhiteboardWOD";
import TrainingScroll from "@/components/TrainingScroll";
import TrainingPrograms from "@/components/TrainingPrograms";
import AboutPreview from "@/components/AboutPreview";
import MotionSection from "@/components/MotionSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <MotionSection><FeatureCards /></MotionSection>
      <WhiteboardWOD />
      <TrainingScroll />
      <MotionSection>
        <TrainingPrograms />
      </MotionSection>
      <MotionSection>
        <AboutPreview />
      </MotionSection>
      <PodcastSection />
      <Directions />
      <ClosingInvitation />
    </div>
  );
}
