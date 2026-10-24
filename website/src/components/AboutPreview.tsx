import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Heart, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const values = [
  {
    icon: Target,
    title: "Zielorientiert",
    description: "Wir helfen dir, deine persönlichen Fitnessziele zu erreichen",
  },
  {
    icon: Heart,
    title: "Community First",
    description: "Gemeinsam sind wir stärker – unsere Community ist unser Herz",
  },
  {
    icon: Zap,
    title: "Maximale Intensität",
    description: "Hochintensives Training für maximale Ergebnisse",
  },
];

export default function AboutPreview() {
  return (
    <section className="py-24 bg-neutral-800 relative overflow-hidden">
      {/* Background Pattern */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Image */}
          <div
            className="relative"
          >
            {/* Community Image */}
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border-4 border-primary-500 shadow-2xl">
              <Image
                src="/images/g3-training.jpg"
                alt="Trainingsbereich im G3 CrossFit"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-br from-primary-900/40 to-transparent" />

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary-500/30 rounded-full blur-2xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-secondary-500/30 rounded-full blur-2xl" />
            </div>

          </div>

          {/* Right Column - Content */}
          <div
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
              Über uns
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Mehr als nur ein Gym
            </h2>

            <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
              Unsere Box am Gleisdreieck bringt Menschen aus Mitte, Kreuzberg und Schöneberg zusammen.
            </p>

            <p className="text-lg text-neutral-400 mb-10 leading-relaxed">
              Unser Team aus zertifizierten Coaches bietet dir professionelles Training
              in einer motivierenden Atmosphäre. Egal ob Anfänger oder Profi – bei uns
              bist du richtig.
            </p>

            {/* Values */}
            <div className="space-y-6 mb-10">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {value.title}
                      </h3>
                      <p className="text-neutral-400">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <Button asChild
                size="lg"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200 ease-out group"
              ><Link href="/about">
                Mehr über uns erfahren
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link></Button>
          </div>
        </div>
      </div>
    </section>
  );
}

