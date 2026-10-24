import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-svh flex items-center overflow-hidden bg-primary-900 pt-24 text-white">
        <Image src="/images/g3-team.jpg" alt="Das Team von G3 CrossFit" fill priority sizes="100vw" className="object-cover object-[65%_center]" />
        <div className="absolute inset-0 bg-black/30 lg:bg-transparent bg-linear-to-tr from-black/80 via-black/45 to-black/10" />
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <h1 className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight text-balance">Dein CrossFit am Gleisdreieck</h1>
          <p className="max-w-2xl text-lg sm:text-xl text-primary-50 mt-6 mb-8 font-body">Trainiere mit persönlichem Coaching und einer Community, die dich unterstützt – auf deinem Fitnesslevel.</p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent-600 h-auto min-h-14 px-6 py-4 whitespace-normal text-center font-button">
            <Link href="/contact#booking">Kostenloses Probetraining<ArrowRight aria-hidden="true" /></Link>
          </Button>
          <p className="mt-6 text-sm text-primary-100">Maximal 8 Personen pro Kurs. Bei einer Anmeldung: Personal Training ohne Aufpreis.</p>
        </div>
      </section>
      <section aria-label="Training bei G3" className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid gap-6 sm:grid-cols-3 font-body">
          <p><strong className="block text-xl font-heading">Persönliches Coaching</strong><span className="text-sm text-primary-100">Begleitung bei deinem Training</span></p>
          <p><strong className="block text-xl font-heading">Alle Fitnesslevel</strong><span className="text-sm text-primary-100">Workouts an dein Level angepasst</span></p>
          <p><strong className="block text-xl font-heading">Gemeinsam trainieren</strong><span className="text-sm text-primary-100">CrossFit in einer starken Community</span></p>
        </div>
      </section>
    </>
  );
}
