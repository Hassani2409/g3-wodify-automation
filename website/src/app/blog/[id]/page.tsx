"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";

// Mock blog posts data - in production, fetch from API
const blogPosts = [
  {
    id: 1,
    title: "CrossFit Ernährung: 10 einfache Tipps für mehr Energie im Training",
    content: `
# CrossFit Ernährung: 10 einfache Tipps für mehr Energie im Training

Entdecke, wie du deine Leistung im CrossFit Training durch die richtige Ernährung maximierst. Von Pre-Workout Snacks bis zur Regeneration nach dem Training.

## 1. Timing ist alles

Die richtige Ernährung zur richtigen Zeit kann deine Performance erheblich steigern. Ein leichtes Pre-Workout Meal 30-60 Minuten vor dem Training gibt dir die nötige Energie, ohne dich zu beschweren.

## 2. Hydration ist entscheidend

Wasser ist dein bester Freund beim CrossFit. Trinke über den Tag verteilt ausreichend Wasser und besonders vor, während und nach dem Training.

## 3. Protein für die Regeneration

Nach einem intensiven Workout braucht dein Körper Protein für die Muskelregeneration. Ein Protein-Shake oder eine proteinreiche Mahlzeit innerhalb von 30 Minuten nach dem Training ist ideal.

## 4. Komplexe Kohlenhydrate

Vollkornprodukte, Süßkartoffeln und Haferflocken liefern lang anhaltende Energie für dein Training.

## 5. Gesunde Fette nicht vergessen

Avocados, Nüsse und Olivenöl unterstützen die Hormonproduktion und helfen bei der Nährstoffaufnahme.

## Fazit

Die richtige Ernährung ist genauso wichtig wie das Training selbst. Probiere diese Tipps aus und finde heraus, was für dich am besten funktioniert!
    `,
    category: "Ernährung",
    author: "Sarah Mitchell",
    date: "2024-01-15",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Ernährung", "Performance", "Tipps", "CrossFit Berlin"]
  },
  {
    id: 2,
    title: "Olympic Weightlifting Technik: Snatch perfekt meistern",
    content: `
# Olympic Weightlifting Technik: Snatch perfekt meistern

Lerne die komplexe Technik des Snatch von unserem Head Coach. Schritt-für-Schritt Anleitung für CrossFit Athleten in Berlin.

## Die Grundlagen

Der Snatch ist eine der komplexesten Bewegungen im Olympic Weightlifting. Er erfordert Kraft, Mobilität, Koordination und Technik.

## Schritt 1: Die Startposition

Beginne mit den Füßen hüftbreit, die Zehenspitzen leicht nach außen. Die Hantel liegt über dem Mittelfuß, die Schultern sind über der Hantel.

## Schritt 2: Der First Pull

Ziehe die Hantel langsam und kontrolliert vom Boden, bis sie sich auf Kniehöhe befindet. Halte deinen Rücken gerade und deine Brust hoch.

## Schritt 3: Der Second Pull

Explosive Hüftstreckung! Dies ist der kraftvollste Teil der Bewegung. Die Hantel sollte nahe am Körper bleiben.

## Schritt 4: Der Catch

Unter die Hantel kommen und sie über dem Kopf fangen. Die Füße landen in einer breiten Position, die Arme sind gestreckt.

## Übung macht den Meister

Perfekte Technik kommt nicht über Nacht. Übe regelmäßig mit leichten Gewichten und arbeite mit einem erfahrenen Coach zusammen.
    `,
    category: "Training",
    author: "Dave Thompson",
    date: "2024-01-10",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Olympic Lifting", "Technik", "Snatch", "Berlin CrossFit"]
  },
  {
    id: 3,
    title: "Success Story: Marias Transformation bei G3 CrossFit",
    content: `
# Success Story: Marias Transformation bei G3 CrossFit

Von völlig untrainiert zu CrossFit Enthusiastin in 12 Monaten. Lese Marias inspirierende Reise in unserem CrossFit Gym in Berlin-Mitte.

## Der Anfang

Maria kam zu uns mit dem Ziel, fitter zu werden und mehr Selbstvertrauen zu gewinnen. Sie hatte noch nie zuvor regelmäßig trainiert.

## Die Herausforderungen

Die ersten Wochen waren hart. Jede Bewegung war neu, jeder Tag war eine Herausforderung. Aber Maria gab nicht auf.

## Der Durchbruch

Nach drei Monaten begann Maria, Fortschritte zu sehen. Sie konnte mehr Gewicht heben, ihre Ausdauer verbesserte sich, und sie fühlte sich stärker.

## Die Transformation

Nach 12 Monaten hat Maria nicht nur körperlich, sondern auch mental eine unglaubliche Transformation durchgemacht. Sie ist selbstbewusster, stärker und glücklicher.

## Marias Tipps

"Gib nicht auf, auch wenn es schwer wird. Die Community bei G3 CrossFit hat mich durch die schwierigen Zeiten getragen. Jeder kann es schaffen!"
    `,
    category: "Success Stories",
    author: "G3 Team",
    date: "2024-01-05",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    tags: ["Transformation", "Success Story", "Motivation", "Berlin CrossFit"]
  }
];

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const postId = parseInt(params.id as string);
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-primary-600">Artikel nicht gefunden</h1>
          <p className="text-gray-600 mb-6">Der gesuchte Blog-Artikel existiert nicht.</p>
          <Button asChild>
            <Link href="/blog">Zurück zum Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="bg-accent-500 text-white mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-200 flex-wrap gap-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(post.date).toLocaleDateString('de-DE')}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{post.readTime} Lesezeit</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{post.author}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zum Blog
            </Button>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {post.content.split('\n').map((line, index) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={index} className="text-3xl font-bold mb-6 mt-8 text-primary-600">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold mb-4 mt-6 text-primary-600">{line.substring(3)}</h2>;
                    } else if (line.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-bold mb-3 mt-4 text-primary-600">{line.substring(4)}</h3>;
                    } else if (line.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return <p key={index} className="mb-4">{line}</p>;
                    }
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-primary-600">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.content.substring(0, 100),
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link kopiert!');
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Artikel teilen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-primary-600">Weitere Artikel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <Badge className="bg-accent-500 text-white mb-3 w-fit">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-3 text-primary-600 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                        {relatedPost.content.substring(0, 150)}...
                      </p>
                      <Button asChild variant="outline" className="group-hover:bg-accent-500 group-hover:text-white transition-all">
                        <Link href={`/blog/${relatedPost.id}`}>
                          Weiterlesen
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

