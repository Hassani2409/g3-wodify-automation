"use client";

import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';

export default function MyNutrition() {
    return (
        <PortalLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-4xl font-bold text-foreground font-heading">Ernährung</h1>
                    <p className="text-lg text-muted-foreground mt-2 font-body">
                        Unterstütze dein Training mit der richtigen Ernährung.
                    </p>
                </header>

                <div className="mt-8">
                    <Card className="min-h-[400px] flex items-center justify-center bg-gray-50">
                        <CardContent className="text-center py-12">
                            <HeartPulse className="mx-auto h-12 w-12 text-gray-400" />
                            <h2 className="mt-6 text-xl font-semibold text-gray-700 font-heading">Coming Soon</h2>
                            <p className="mt-2 text-gray-500 font-body">
                                Hier findest du bald personalisierte Ernährungsempfehlungen und einen KI-gestützten Meal-Tracker.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PortalLayout>
    );
}

