"use client";

import PortalLayout from '@/components/portal/PortalLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function MyCommunity() {
    return (
        <PortalLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-4xl font-bold text-foreground font-heading">Community</h1>
                    <p className="text-lg text-muted-foreground mt-2 font-body">
                        Vernetze dich, fordere dich heraus und wachse gemeinsam.
                    </p>
                </header>

                <div className="mt-8">
                    <Card className="min-h-[400px] flex items-center justify-center bg-neutral-50">
                        <CardContent className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-neutral-400" />
                            <h2 className="mt-6 text-xl font-semibold text-neutral-700 font-heading">Coming Soon</h2>
                            <p className="mt-2 text-neutral-500 font-body">
                                Wir arbeiten an aufregenden Community-Features, inklusive Trainingspartner-Matching und Team-Challenges.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PortalLayout>
    );
}

