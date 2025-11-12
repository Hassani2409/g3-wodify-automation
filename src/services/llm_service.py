"""
LLM Service for AI-powered conversations
Supports OpenAI and Anthropic Claude
"""

from typing import Optional, List, Dict
from loguru import logger
from config.settings import settings


class LLMService:
    """Service for interacting with LLM providers"""
    
    def __init__(self):
        self.provider = settings.llm_provider.lower()
        self.model = settings.llm_model
        self.temperature = settings.llm_temperature
        self.max_tokens = settings.llm_max_tokens
        
    async def generate_response(
        self, 
        prompt: str, 
        context: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Generate a response using the configured LLM provider
        
        Args:
            prompt: The user's prompt/question
            context: Additional context (e.g., system instructions)
            conversation_history: Previous conversation messages
            
        Returns:
            Generated response string
        """
        try:
            if self.provider == "openai":
                return await self._generate_openai(prompt, context, conversation_history)
            elif self.provider == "anthropic":
                return await self._generate_anthropic(prompt, context, conversation_history)
            else:
                logger.warning(f"Unknown LLM provider: {self.provider}, using fallback")
                return self._generate_fallback(prompt)
        except Exception as e:
            logger.error(f"Error generating LLM response: {str(e)}")
            return self._generate_fallback(prompt)
    
    async def _generate_openai(self, prompt: str, context: Optional[str], conversation_history: Optional[List[Dict[str, str]]]) -> str:
        """Generate response using OpenAI API"""
        try:
            import openai
            
            if not settings.openai_api_key:
                logger.warning("OpenAI API key not configured, using fallback")
                return self._generate_fallback(prompt)
            
            client = openai.OpenAI(api_key=settings.openai_api_key)
            
            # Build messages
            messages = []
            
            # Add system message with context
            if context:
                messages.append({
                    "role": "system",
                    "content": context
                })
            else:
                messages.append({
                    "role": "system",
                    "content": "Du bist ein freundlicher und hilfsbereiter Assistent für G3 CrossFit in Berlin."
                })
            
            # Add conversation history
            if conversation_history:
                messages.extend(conversation_history)
            
            # Add current user prompt
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            # Make API call
            response = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )
            
            return response.choices[0].message.content.strip()
            
        except ImportError:
            logger.error("OpenAI library not installed. Install with: pip install openai")
            return self._generate_fallback(prompt)
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return self._generate_fallback(prompt)
    
    async def _generate_anthropic(self, prompt: str, context: Optional[str], conversation_history: Optional[List[Dict[str, str]]]) -> str:
        """Generate response using Anthropic Claude API"""
        try:
            import anthropic
            
            if not settings.anthropic_api_key:
                logger.warning("Anthropic API key not configured, using fallback")
                return self._generate_fallback(prompt)
            
            client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
            
            # Build system message
            system_message = context or "Du bist ein freundlicher und hilfsbereiter Assistent für G3 CrossFit in Berlin."
            
            # Build messages list
            messages = []
            if conversation_history:
                messages.extend(conversation_history)
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            # Make API call
            response = client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_message,
                messages=messages
            )
            
            return response.content[0].text.strip()
            
        except ImportError:
            logger.error("Anthropic library not installed. Install with: pip install anthropic")
            return self._generate_fallback(prompt)
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            return self._generate_fallback(prompt)
    
    def _generate_fallback(self, prompt: str) -> str:
        """Fallback rule-based responses when LLM is unavailable"""
        prompt_lower = prompt.lower()
        
        if "probetraining" in prompt_lower or "trial" in prompt_lower:
            return "Gerne können Sie ein kostenloses Probetraining bei uns buchen! Wir bieten flexible Termine von Montag bis Sonntag. Möchten Sie direkt einen Termin vereinbaren oder haben Sie Fragen zu unseren Kursen?"
        
        if "preis" in prompt_lower or "kostet" in prompt_lower or "mitgliedschaft" in prompt_lower:
            return "Wir haben verschiedene Mitgliedschaftsoptionen: Starter für 89€, Unlimited für 139€ und Premium für 189€ pro Monat. Alle Mitgliedschaften beinhalten ein kostenloses Probetraining. Welche Option interessiert Sie am meisten?"
        
        if "standort" in prompt_lower or "wo" in prompt_lower or "adresse" in prompt_lower:
            return "Wir befinden uns in der Musterstraße 123, 10115 Berlin. Wir haben kostenlose Parkplätze und sind sehr gut mit den öffentlichen Verkehrsmitteln erreichbar. Möchten Sie eine Wegbeschreibung?"
        
        if "öffnungszeiten" in prompt_lower or "wann" in prompt_lower or "stunden" in prompt_lower:
            return "Unsere Öffnungszeiten sind: Montag bis Freitag von 6:00 bis 21:00 Uhr, Samstag von 8:00 bis 18:00 Uhr und Sonntag von 9:00 bis 16:00 Uhr. Wann passt es Ihnen am besten für ein Probetraining?"
        
        if "kurse" in prompt_lower or "klassen" in prompt_lower or "training" in prompt_lower:
            return "Wir bieten verschiedene Kurse an: CrossFit Foundations für Anfänger, CrossFit Classes für alle Level, Olympic Weightlifting und Strength & Conditioning. Alle Level sind willkommen! Welcher Kurs interessiert Sie?"
        
        if "anruf beginnt" in prompt_lower or "hallo" in prompt_lower:
            return "G3 CrossFit, mein Name ist Alex. Wie kann ich Ihnen helfen?"
        
        return "Vielen Dank für Ihre Anfrage! Gerne helfe ich Ihnen weiter. Möchten Sie mehr über unsere Mitgliedschaften, Kurse oder ein kostenloses Probetraining erfahren?"


# Global LLM service instance
llm_service = LLMService()

