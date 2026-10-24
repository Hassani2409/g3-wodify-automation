import Image from "next/image";
import Link from "next/link";
import { coaches } from "@/lib/site";
import { Button } from "@/components/ui/button";
export default function CoachesPage() {
  return <div className="pt-28 min-h-svh max-w-7xl mx-auto px-6 lg:px-8 pb-20"><h1 className="text-5xl font-heading font-bold mb-8">Das Team im G3 CrossFit</h1>
    <Image src="/images/g3-team.jpg" alt="Das G3 CrossFit Team" width={1200} height={809} sizes="(max-width: 1280px) 100vw, 1200px" className="w-full rounded-card mb-10" />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">{coaches.map(coach => <article key={coach.name} className="border border-border rounded-card p-6"><h2 className="text-2xl font-heading font-semibold">{coach.name}</h2><p className="text-muted-foreground mt-2">{coach.role}</p></article>)}</div>
    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-600"><Link href="/contact#booking">Kostenloses Probetraining anfragen</Link></Button>
  </div>;
}
