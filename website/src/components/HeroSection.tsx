import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { specificUnsplashPhotos } from "@/lib/unsplash";

export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-svh flex items-center overflow-hidden bg-primary-900 pt-24 text-white">
        <Image src={specificUnsplashPhotos.heroMain} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-primary-900/80" />
        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <h1 className="max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight text-balance">Dein CrossFit Gym im Herzen Berlins</h1>
          <p className="max-w-2xl text-lg sm:text-xl text-primary-50 mt-6 mb-8 font-body">Trainiere mit persönlichem Coaching und einer Community, die dich unterstützt – auf deinem Fitnesslevel.</p>
          <Button asChild size="lg" className="bg-white text-primary-700 hover:bg-primary-50 h-auto min-h-14 px-6 py-4 whitespace-normal text-center font-button">
            <Link href="/contact#booking">Kostenloses Probetraining<ArrowRight aria-hidden="true" /></Link>
          </Button>
          <p className="mt-6 text-sm text-primary-100">Lerne uns im Probetraining persönlich kennen.</p>
          <p className="mt-12 text-xs text-primary-100">Symbolbild · Originalfotos folgen</p>
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
