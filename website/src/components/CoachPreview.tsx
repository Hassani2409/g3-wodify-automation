import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function CoachPreview() {
  return <section className="bg-primary-900 text-white py-20"><div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
    <Image src="/images/g3-team.jpg" alt="Das G3 CrossFit Trainerteam" width={1200} height={809} sizes="(max-width: 1024px) 100vw, 50vw" className="rounded-card w-full" />
    <div><h2 className="text-4xl font-heading font-bold mb-5">Persönliches Coaching im G3</h2><p className="text-primary-100 mb-6">Technik, Motivation und deine Ziele stehen im Mittelpunkt. Lerne unser Team im Probetraining kennen.</p><Button asChild><Link href="/coaches">Unser Trainerteam kennenlernen</Link></Button></div>
  </div></section>;
}
