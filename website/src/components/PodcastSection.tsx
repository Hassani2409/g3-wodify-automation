import Image from "next/image";
import { site } from "@/lib/site";
export default function PodcastSection() {
  return <section className="py-16 bg-card"><div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-[240px_1fr] gap-10 items-center">
    <Image src="/images/g3-podcast.jpeg" alt="Open Gym Podcast" width={480} height={480} sizes="(max-width: 768px) 100vw, 240px" className="w-full max-w-60 rounded-card" />
    <div><h2 className="text-3xl font-heading font-bold mb-4">Open Gym Podcast</h2><p className="text-muted-foreground max-w-2xl">Nici, Sebastian und Felix sprechen über Training und das Leben rund um die Box.</p><a href={site.podcastUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 text-primary-700 underline underline-offset-4">Podcast anhören</a></div>
  </div></section>;
}
