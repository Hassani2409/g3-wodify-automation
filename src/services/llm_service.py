"""
LLM Service for AI-powered conversations
Supports OpenAI and Anthropic Claude
"""

from typing import Optional, List, Dict
from loguru import logger
from config.settings import settings
from config.site_info import public_info_response


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
        
        public_reply = public_info_response(prompt)
        if public_reply:
            return public_reply

        if "kurse" in prompt_lower or "klassen" in prompt_lower or "training" in prompt_lower:
            return "Wir bieten verschiedene Kurse an: CrossFit, Yoga, Weightlifting, Functional Bodybuilding und Team-WODs. Alle Level sind willkommen! Welcher Kurs interessiert Sie?"
        
        if "anruf beginnt" in prompt_lower or "hallo" in prompt_lower:
            return "G3 CrossFit, mein Name ist Alex. Wie kann ich Ihnen helfen?"
        
        return "Vielen Dank für Ihre Anfrage! Gerne helfe ich Ihnen weiter. Möchten Sie mehr über unsere Mitgliedschaften, Kurse oder ein kostenloses Probetraining erfahren?"


# Global LLM service instance
llm_service = LLMService()

