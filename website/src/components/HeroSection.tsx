import HeroScroll from "@/components/HeroScroll";

export default function HeroSection() {
  return (
    <>
      <HeroScroll />
      <section id="training-overview" aria-label="Training bei G3" className="bg-primary-700 text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid gap-6 sm:grid-cols-3 font-body">
          <p><strong className="block text-xl font-heading">Persönliches Coaching</strong><span className="text-sm text-primary-100">Begleitung bei deinem Training</span></p>
          <p><strong className="block text-xl font-heading">Alle Fitnesslevel</strong><span className="text-sm text-primary-100">Workouts an dein Level angepasst</span></p>
          <p><strong className="block text-xl font-heading">Gemeinsam trainieren</strong><span className="text-sm text-primary-100">CrossFit in einer starken Community</span></p>
        </div>
      </section>
    </>
  );
}
