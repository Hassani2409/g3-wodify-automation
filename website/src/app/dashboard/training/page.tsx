"use client";

import { useState } from 'react';
import PortalLayout from '@/components/portal/PortalLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Zap, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MyTrainingPage() {
  const [trainingPlan, setTrainingPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = async () => {
    setIsLoading(true);
    setTrainingPlan('');

    try {
      const prompt = `
Erstelle einen detaillierten 3-Tage-Split-Trainingsplan für eine Woche für einen CrossFit-Athleten mit dem Ziel, die allgemeine Fitness zu verbessern.

Das Erfahrungslevel ist "Fortgeschritten".

Der Plan sollte für jeden Tag Folgendes enthalten:

1. **Warm-up:** (ca. 10 Minuten) Eine kurze Routine zur Aktivierung.
2. **Skill/Strength Part:** (ca. 20 Minuten) Eine spezifische Kraft- oder Fähigkeitsübung.
3. **Metcon (Workout of the Day):** (ca. 15-25 Minuten) Ein hochintensives Workout.
4. **Cool-down:** (ca. 5 Minuten) Dehnübungen.

Strukturiere die Antwort klar in "Tag 1", "Tag 2", "Tag 3" und formatiere sie als Markdown. Gib auch zwei Ruhetage an.

Verwende fette Überschriften für jeden Abschnitt (Warm-up, Skill/Strength, Metcon, Cool-down).
`;

      // API call to backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${apiUrl}/api/ai/generate-training-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate training plan');
      }

      const data = await response.json();
      setTrainingPlan(data.plan || data.response || 'Plan wurde erfolgreich erstellt.');

    } catch (error) {
      console.error("Error generating training plan:", error);
      setTrainingPlan("Entschuldigung, es gab ein Problem beim Erstellen deines Plans. Bitte versuche es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-foreground font-heading">Mein Training</h1>
          <p className="text-lg text-muted-foreground mt-2 font-body">
            Dein persönlicher Bereich für Trainingspläne und Fortschritt.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center font-heading">
              <Bot className="mr-3 h-6 w-6 text-accent-500" />
              KI-Trainingsplan-Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6 text-muted-foreground font-body">
              Lass unsere KI einen personalisierten Trainingsplan für dich erstellen. 
              Basierend auf deinen Zielen und deinem Fitnesslevel (bald anpassbar!).
            </p>
            <Button 
              onClick={generatePlan} 
              disabled={isLoading}
              className="bg-accent-500 hover:bg-accent-600 text-white font-button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Plan wird erstellt...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Meinen Wochenplan generieren
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="font-semibold text-foreground mb-4 font-body">
                  Deine personalisierte Trainingswoche wird zusammengestellt...
                </p>
                <div className="w-16 h-16 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {trainingPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Dein neuer Trainingsplan</CardTitle>
            </CardHeader>
            <CardContent>
              <article className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
                <ReactMarkdown>{trainingPlan}</ReactMarkdown>
              </article>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}

