import { site } from "@/lib/site";

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
    
    const question = prompt.match(/Der (?:Nutzer|Anrufer) sagt: "([\s\S]*)"\s*$/)?.[1] ?? prompt;
    const promptLower = question.toLowerCase();
    
    if (promptLower.includes('probetraining') || promptLower.includes('trial')) {
        return "Gerne können Sie ein kostenloses Probetraining bei uns buchen! Deinen Termin stimmen wir persönlich mit dir ab. Möchten Sie direkt einen Termin vereinbaren oder haben Sie Fragen zu unseren Kursen?";
    }
    
    if (promptLower.includes('preis') || promptLower.includes('kostet') || promptLower.includes('mitgliedschaft')) {
        return `Aktuelle Preise bestätigen wir dir gern persönlich. Schreib uns an ${site.email}.`;
    }
    
    if (promptLower.includes('standort') || /\bwo\b/.test(promptLower) || promptLower.includes('adresse')) {
        return `Du findest uns am ${site.street}, ${site.postalCode} ${site.city}, ${site.entrance}.`;
    }
    
    if (promptLower.includes('öffnungszeiten') || promptLower.includes('geöffnet') || promptLower.includes('wann') || promptLower.includes('stunden')) {
        return `Die aktuellen Zeiten findest du im Kursplan. Bei Fragen erreichst du uns unter ${site.email}.`;
    }
    
    if (promptLower.includes('kurse') || promptLower.includes('klassen') || promptLower.includes('training')) {
        return "Wir bieten verschiedene Kurse an: CrossFit, Yoga, Weightlifting, Functional Bodybuilding und Team-WODs. Alle Level sind willkommen! Welcher Kurs interessiert Sie?";
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
        } catch (fetchError: unknown) {
            // If fetch fails (network error, timeout, etc.), use fallback
            clearTimeout(timeoutId);
            if (!(fetchError instanceof Error && fetchError.name === 'AbortError')) {
                console.warn("API request failed, using fallback response:", fetchError instanceof Error ? fetchError.message : String(fetchError));
            }
            return fallbackResponse;
        }
    } catch (error: unknown) {
        console.error("Error invoking LLM:", error);
        // Final fallback
        return fallbackResponse;
    }
}

