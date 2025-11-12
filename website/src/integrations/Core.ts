/**
 * Core Integration Functions
 * Provides integration with backend AI/LLM services
 */

interface InvokeLLMParams {
    prompt: string;
    context?: string;
}

/**
 * Fallback rule-based responses when API is unavailable
 */
function getFallbackResponse(prompt: string): string {
    // Ensure prompt is a string and handle edge cases
    if (!prompt || typeof prompt !== 'string') {
        return "Vielen Dank für Ihre Anfrage! Gerne helfe ich Ihnen weiter. Möchten Sie mehr über unsere Mitgliedschaften, Kurse oder ein kostenloses Probetraining erfahren?";
    }
    
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes('probetraining') || promptLower.includes('trial')) {
        return "Gerne können Sie ein kostenloses Probetraining bei uns buchen! Wir bieten flexible Termine von Montag bis Sonntag. Möchten Sie direkt einen Termin vereinbaren oder haben Sie Fragen zu unseren Kursen?";
    }
    
    if (promptLower.includes('preis') || promptLower.includes('kostet') || promptLower.includes('mitgliedschaft')) {
        return "Wir haben verschiedene Mitgliedschaftsoptionen: Starter für 89€, Unlimited für 139€ und Premium für 189€ pro Monat. Alle Mitgliedschaften beinhalten ein kostenloses Probetraining. Welche Option interessiert Sie am meisten?";
    }
    
    if (promptLower.includes('standort') || promptLower.includes('wo') || promptLower.includes('adresse')) {
        return "Wir befinden uns in der Musterstraße 123, 10115 Berlin. Wir haben kostenlose Parkplätze und sind sehr gut mit den öffentlichen Verkehrsmitteln erreichbar. Möchten Sie eine Wegbeschreibung?";
    }
    
    if (promptLower.includes('öffnungszeiten') || promptLower.includes('wann') || promptLower.includes('stunden')) {
        return "Unsere Öffnungszeiten sind: Montag bis Freitag von 6:00 bis 21:00 Uhr, Samstag von 8:00 bis 18:00 Uhr und Sonntag von 9:00 bis 16:00 Uhr. Wann passt es Ihnen am besten für ein Probetraining?";
    }
    
    if (promptLower.includes('kurse') || promptLower.includes('klassen') || promptLower.includes('training')) {
        return "Wir bieten verschiedene Kurse an: CrossFit Foundations für Anfänger, CrossFit Classes für alle Level, Olympic Weightlifting und Strength & Conditioning. Alle Level sind willkommen! Welcher Kurs interessiert Sie?";
    }
    
    if (promptLower.includes('anruf beginnt') || promptLower.includes('hallo')) {
        return "G3 CrossFit, mein Name ist Alex. Wie kann ich Ihnen helfen?";
    }
    
    // Default response
    return "Vielen Dank für Ihre Anfrage! Gerne helfe ich Ihnen weiter. Möchten Sie mehr über unsere Mitgliedschaften, Kurse oder ein kostenloses Probetraining erfahren?";
}

/**
 * Invoke LLM service via backend API
 * @param params - Object containing prompt and optional context
 * @returns Promise<string> - The LLM response
 */
export async function InvokeLLM({ prompt, context }: InvokeLLMParams): Promise<string> {
    // Ensure prompt is a string
    const safePrompt = String(prompt || '');
    
    // Get fallback response first (always available)
    const fallbackResponse = getFallbackResponse(safePrompt);
    
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
        return fallbackResponse;
    }
    
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('access_token');
        
        // Create abort controller for timeout (browser-compatible)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        try {
            const response = await fetch(`${apiUrl}/api/ai/generate-response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({ 
                    prompt: safePrompt,
                    context: context || '',
                }),
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            return data.response || data.message || fallbackResponse;
        } catch (fetchError: any) {
            // If fetch fails (network error, timeout, etc.), use fallback
            clearTimeout(timeoutId);
            if (fetchError.name !== 'AbortError') {
                console.warn("API request failed, using fallback response:", fetchError.message);
            }
            return fallbackResponse;
        }
    } catch (error: any) {
        console.error("Error invoking LLM:", error);
        // Final fallback
        return fallbackResponse;
    }
}

