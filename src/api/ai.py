"""
G3 CrossFit WODIFY Automation - AI/LLM Integration

This module provides AI-powered features like training plan generation.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from loguru import logger
from typing import Optional, List, Dict

from src.api.auth import get_current_user
from src.models.database import User
from src.services.llm_service import llm_service

router = APIRouter(prefix="/api/ai", tags=["ai"])


class TrainingPlanRequest(BaseModel):
    prompt: str
    experience_level: Optional[str] = "Fortgeschritten"
    goals: Optional[str] = "Allgemeine Fitness"


class TrainingPlanResponse(BaseModel):
    plan: str
    success: bool = True


class AIResponseRequest(BaseModel):
    prompt: str
    context: Optional[str] = ""


class AIResponseResponse(BaseModel):
    response: str
    success: bool = True


@router.post("/generate-training-plan")
async def generate_training_plan(
    request: TrainingPlanRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate a personalized training plan using AI/LLM
    
    This endpoint generates a training plan based on user input.
    Currently returns a mock response, but can be integrated with:
    - OpenAI API
    - Anthropic Claude
    - Local LLM (Ollama, etc.)
    """
    try:
        logger.info(f"Generating training plan for user {current_user.email}")
        
        # TODO: Integrate with actual LLM service
        # For now, return a structured mock response
        
        mock_plan = f"""# Dein personalisierter CrossFit Trainingsplan

## Woche: {request.experience_level} Level

### Tag 1: Kraft & Technik

#### Warm-up (10 Minuten)
- 5 Minuten leichtes Laufen oder Rudern
- Dynamisches Dehnen: Armkreise, Beinschwünge, Rumpfrotationen
- 2 Runden: 10 Air Squats, 10 Push-ups, 10 Sit-ups

#### Skill/Strength Part (20 Minuten)
**Back Squat**
- 5x5 @ 75% 1RM
- Fokus auf Tiefe und Kontrolle
- 2-3 Minuten Pause zwischen den Sätzen

#### Metcon (20 Minuten)
**"Strength Builder"**
- 5 Runden für Zeit:
  - 10 Back Squats (60% 1RM)
  - 15 Kettlebell Swings (24kg)
  - 20 Double Unders
  - 400m Lauf

#### Cool-down (5 Minuten)
- Statisches Dehnen: Quadrizeps, Hamstrings, Waden
- Foam Rolling: Beine und Rücken

---

### Tag 2: Kondition & Ausdauer

#### Warm-up (10 Minuten)
- 5 Minuten Rudern
- Beweglichkeitsübungen: Cat-Cow, Hip Circles
- 2 Runden: 10 Burpees, 10 Mountain Climbers

#### Skill/Strength Part (20 Minuten)
**Strict Pull-ups**
- 5x3-5 Wiederholungen
- Falls nicht möglich: Negatives oder Band-Unterstützung
- Fokus auf vollständige Bewegungsamplitude

#### Metcon (25 Minuten)
**"Endurance Challenge"**
- AMRAP in 20 Minuten:
  - 400m Lauf
  - 15 Box Jumps (24")
  - 10 Pull-ups
  - 15 Wall Balls (9kg)

#### Cool-down (5 Minuten)
- Dehnen: Schultern, Rücken, Hüfte
- Leichtes Gehen

---

### Tag 3: Gymnastics & Beweglichkeit

#### Warm-up (10 Minuten)
- 5 Minuten Seilspringen
- Gymnastics Warm-up: Handstand Practice, Ring Dips
- Beweglichkeitsübungen für Schultern und Hüfte

#### Skill/Strength Part (20 Minuten)
**Handstand Push-ups Progression**
- 5x3-5 Wiederholungen
- Oder Pike Push-ups falls noch nicht möglich
- Fokus auf Stabilität und Kontrolle

#### Metcon (15 Minuten)
**"Gymnastics Flow"**
- 3 Runden für Zeit:
  - 15 Handstand Push-ups (oder Pike Push-ups)
  - 20 Toes-to-Bar
  - 25 Sit-ups
  - 30 Double Unders

#### Cool-down (5 Minuten)
- Ausgiebiges Dehnen: Schultern, Rücken, Bauch
- Yoga-Positionen: Downward Dog, Child's Pose

---

### Ruhetage

**Tag 4 & Tag 7: Aktive Erholung**
- Leichtes Cardio: 30 Minuten Spazieren, Radfahren oder Schwimmen
- Beweglichkeitstraining: 20 Minuten Yoga oder Mobility Work
- Foam Rolling: Ganzkörper

---

## Tipps für dein Training

- **Konsistenz ist wichtiger als Intensität**: Regelmäßiges Training bringt mehr als sporadische Höchstleistungen
- **Höre auf deinen Körper**: Bei Schmerzen oder extremer Müdigkeit lieber einen Tag Pause machen
- **Ernährung**: Achte auf ausreichend Protein (ca. 1.6-2g pro kg Körpergewicht) und Hydration
- **Schlaf**: 7-9 Stunden Schlaf sind essentiell für Regeneration und Performance

Viel Erfolg bei deinem Training! 💪
"""
        
        return TrainingPlanResponse(
            plan=mock_plan,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error generating training plan: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Fehler beim Generieren des Trainingsplans"
        )


@router.post("/generate-response")
async def generate_response(
    request: AIResponseRequest
):
    """
    Generate a general AI response for phone assistant or chatbot
    
    This endpoint can be used without authentication for public-facing features
    like phone assistant or chatbot.
    
    Uses configured LLM provider (OpenAI, Anthropic) or falls back to rule-based responses.
    """
    try:
        logger.info(f"Generating AI response for prompt: {request.prompt[:50]}...")
        
        # Build context with G3 CrossFit information
        system_context = f"""
Du bist ein freundlicher und professioneller AI-Assistent für G3 CrossFit in Berlin.

WICHTIGE INFORMATIONEN:
- Standort: Musterstraße 123, 10115 Berlin
- Telefon: +49 30 12345678
- Öffnungszeiten: Mo-Fr 6:00-21:00, Sa 8:00-18:00, So 9:00-16:00
- Preise: Starter 89€, Unlimited 139€, Premium 189€
- Kostenloses Probetraining verfügbar
- Alle Level willkommen

GESPRÄCHSFÜHRUNG:
- Sei freundlich, professionell und hilfsbereit
- Antworte kurz und präzise (max. 2-3 Sätze)
- Biete bei Fragen zu Probetraining die Online-Buchung an
- Erwähne wichtige Informationen wie kostenloses Probetraining
- Antworte immer auf Deutsch

{request.context or ""}
"""
        
        # Generate response using LLM service
        response = await llm_service.generate_response(
            prompt=request.prompt,
            context=system_context
        )
        
        return AIResponseResponse(
            response=response,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error generating AI response: {str(e)}")
        # Fallback to rule-based response on error
        fallback_response = llm_service._generate_fallback(request.prompt)
        return AIResponseResponse(
            response=fallback_response,
            success=True
        )

