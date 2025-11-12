"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, Clock, User, ChevronRight, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts = [
    {
      id: 1,
      title: "CrossFit Ernährung: 10 einfache Tipps für mehr Energie im Training",
      excerpt: "Entdecke, wie du deine Leistung im CrossFit Training durch die richtige Ernährung maximierst. Von Pre-Workout Snacks bis zur Regeneration nach dem Training.",
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
      excerpt: "Lerne die komplexe Technik des Snatch von unserem Head Coach. Schritt-für-Schritt Anleitung für CrossFit Athleten in Berlin.",
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
      excerpt: "Von völlig untrainiert zu CrossFit Enthusiastin in 12 Monaten. Lese Marias inspirierende Reise in unserem CrossFit Gym in Berlin-Mitte.",
      category: "Success Stories",
      author: "G3 Team",
      date: "2024-01-05",
      readTime: "15 min",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      tags: ["Transformation", "Success Story", "Motivation", "Berlin CrossFit"]
    }
  ];

  const categories = ['all', 'Training', 'Ernährung', 'Success Stories', 'Lifestyle', 'Events'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 text-white" style={{background: 'linear-gradient(135deg, #2A5D3C 0%, #6BAF7E 100%)'}}>
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80")' }}/>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">CrossFit Blog Berlin</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
            Trainingstipps, Ernährungsberatung und Erfolgsgeschichten von G3 CrossFit in Berlin-Mitte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach Artikeln, Tipps oder Themen..."
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-accent-500 text-white hover:bg-accent-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? 'Alle Kategorien' : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent-500 text-white">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-2">
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
                    
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 text-primary-600">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="group-hover:bg-accent-500 group-hover:text-white group-hover:border-accent-500 transition-all"
                    >
                      <Link href={`/blog/${post.id}`}>
                        Artikel lesen
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold mb-4 text-primary-600">
                Keine Artikel gefunden
              </h3>
              <p className="text-gray-600 mb-6">
                Versuche andere Suchbegriffe oder wähle eine andere Kategorie.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Alle Artikel anzeigen
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-600">
            Bleib auf dem Laufenden
          </h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Erhalte unsere neuesten CrossFit Tipps, Trainingsartikel und Erfolgsgeschichten aus Berlin-Mitte direkt in dein Postfach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Deine E-Mail Adresse"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3">
              Newsletter abonnieren
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Kostenlos und jederzeit abbestellbar. Deine Daten sind bei uns sicher.
          </p>
        </div>
      </section>
    </div>
  );
}

