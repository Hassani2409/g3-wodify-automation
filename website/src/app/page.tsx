import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import TrainingPrograms from '@/components/TrainingPrograms';
import AboutPreview from '@/components/AboutPreview';
import CoachPreview from '@/components/CoachPreview';
import Testimonials from '@/components/Testimonials';
import { ClubMotion, Visit } from '@/components/ClubSections';
export default function Home() {
  return <ClubMotion><HeroSection /><FeatureCards /><TrainingPrograms /><AboutPreview /><CoachPreview /><Testimonials /><Visit /></ClubMotion>;
}
