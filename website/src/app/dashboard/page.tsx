"use client";

import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Dumbbell, Calendar, BarChart, Target, 
  ArrowRight, TrendingUp, Award, Clock 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: "Trainings diese Woche", value: "3", icon: Dumbbell, color: "text-primary-500" },
    { label: "Gebuchte Kurse", value: "5", icon: Calendar, color: "text-secondary-500" },
    { label: "Trainingsstreak", value: "7 Tage", icon: TrendingUp, color: "text-accent-500" },
    { label: "Erreichte Ziele", value: "12/15", icon: Award, color: "text-primary-600" },
  ];

  const quickActions = [
    { 
      title: "Trainingsplan generieren", 
      description: "Lass die KI einen personalisierten Plan für dich erstellen",
      href: "/dashboard/training",
      icon: Dumbbell,
      color: "bg-accent-500"
    },
    { 
      title: "Meine Bestellungen", 
      description: "Verfolge deine Shop-Bestellungen und den Versandstatus",
      href: "/shop/orders",
      icon: Calendar,
      color: "bg-primary-500"
    },
    { 
      title: "Kurs buchen", 
      description: "Buche deinen nächsten CrossFit-Kurs",
      href: "/schedule",
      icon: Calendar,
      color: "bg-primary-500"
    },
    { 
      title: "Fortschritt ansehen", 
      description: "Verfolge deine Trainingsfortschritte",
      href: "/dashboard/progress",
      icon: BarChart,
      color: "bg-secondary-500"
    },
    { 
      title: "Ziele setzen", 
      description: "Definiere neue Fitness-Ziele",
      href: "/dashboard/goals",
      icon: Target,
      color: "bg-primary-600"
    },
  ];

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 font-heading">
            Willkommen zurück{user?.first_name ? `, ${user.first_name}` : ''}!
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Hier ist dein persönlicher Überblick über dein Training bei G3 CrossFit.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-body mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground font-heading">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 font-heading">
            Schnellzugriff
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${action.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2 font-heading">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 font-body">
                            {action.description}
                          </p>
                          <div className="flex items-center text-accent-500 text-sm font-medium font-body">
                            Jetzt starten
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center font-heading">
              <Clock className="h-5 w-5 mr-2 text-accent-500" />
              Nächste Kurse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-foreground font-heading">CrossFit Foundations</p>
                  <p className="text-sm text-muted-foreground font-body">Morgen, 18:00 Uhr</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/schedule">Details</Link>
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-semibold text-foreground font-heading">Strength & Conditioning</p>
                  <p className="text-sm text-muted-foreground font-body">Freitag, 17:00 Uhr</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/schedule">Details</Link>
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/schedule">Alle Kurse ansehen</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

