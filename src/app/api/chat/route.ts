import { NextRequest, NextResponse } from 'next/server';
import {
  patient,
  vitalsHistory,
  medications,
  caqHistory,
  peerMatches,
  careSchedule,
  todaySession,
} from '@/lib/mockData';

// ---------------------------------------------------------------
// System prompt — gives the AI full context about Maria
// ---------------------------------------------------------------
function buildSystemPrompt(caqSummary?: { fear: number; avoidance: number; attention: number }) {
  const baseline = caqHistory[0]; // week 1
  const current = caqHistory[caqHistory.length - 1]; // week 7
  const firstVitals = vitalsHistory[0];
  const latestVitals = vitalsHistory[vitalsHistory.length - 1];
  const medList = medications.map((m) => `${m.name} ${m.dose} (${m.adherenceRate}% adherence)`).join(', ');
  const peerList = peerMatches.map((p) => `${p.name} (age ${p.age}, interests: ${p.interests.join(', ')})`).join('; ');

  let caqContext = `
CAQ Cardiac Anxiety Scores (0–4 scale, lower is better):
  Week 1 baseline — Fear: ${baseline.fear}, Avoidance: ${baseline.avoidance}, Attention: ${baseline.attention}
  Week ${current.week} current — Fear: ${current.fear}, Avoidance: ${current.avoidance}, Attention: ${current.attention}`;

  if (caqSummary) {
    caqContext += `
  THIS WEEK's just-computed scores — Fear: ${caqSummary.fear.toFixed(1)}, Avoidance: ${caqSummary.avoidance.toFixed(1)}, Attention: ${caqSummary.attention.toFixed(1)}
  Task: Write a warm, concise summary (3–5 sentences) comparing THIS WEEK's scores to the Week 1 baseline above.
  Celebrate specific improvements with exact numbers. If a score held steady or worsened, acknowledge it gently without alarm.
  End with one sentence about how the care team will be informed.`;
  }

  return `You are Rosa AI, a warm and encouraging cardiac rehabilitation companion for ${patient.firstName} ${patient.lastName}.

PATIENT CONTEXT:
  Age: ${patient.age} | Diagnosis: ${patient.diagnosis}
  Program: Week ${patient.currentWeek} of ${patient.totalWeeks} | Sessions: ${patient.sessionsCompleted}/${patient.totalSessions} completed
  Interests: ${patient.interests.join(', ')}
  Today's session: ${todaySession.totalDuration}-min ${todaySession.type}, target HR ${todaySession.targetHRMin}–${todaySession.targetHRMax} bpm

VITALS TREND:
  Resting HR: ${firstVitals.restingHR} bpm (Week 1) → ${latestVitals.restingHR} bpm (Week ${latestVitals.week})
  Blood Pressure: ${firstVitals.systolicBP}/${firstVitals.diastolicBP} (Week 1) → ${latestVitals.systolicBP}/${latestVitals.diastolicBP} (Week ${latestVitals.week})
  Weight: ${firstVitals.weight} lbs (Week 1) → ${latestVitals.weight} lbs (Week ${latestVitals.week})

MEDICATIONS: ${medList}

${caqContext}

CARE TEAM:
  Nurse: ${careSchedule.nurse.name} — weekly on ${careSchedule.nurse.day} at ${careSchedule.nurse.time}; next: ${careSchedule.nurse.nextCheckIn}
  Doctor: ${careSchedule.doctor.name} — every 4 weeks; next: ${careSchedule.doctor.nextCheckUp}

PEER MATCHES: ${peerList}

GUIDELINES FOR YOUR RESPONSES:
  - Be warm, encouraging, and conversational — not clinical
  - Reference Maria's actual numbers to make praise concrete (e.g. "your HR went from 82 to 74")
  - Keep responses concise: 2–4 sentences for most replies, 5–6 for summaries
  - NEVER diagnose, prescribe, or give specific medical advice — always defer to Dr. Patel or Nurse ${careSchedule.nurse.name.split(' ')[0]}
  - If Maria mentions chest pain, dizziness, or difficulty breathing, immediately tell her to stop and tap the SOS button
  - If Maria expresses wanting to give up, being too tired, or questioning the point of the program, YOU MUST intervene by reminding her of her primary "Why" (being healthy for her daughter's weekly calls and visits) and pointing out her concrete physical progress to show her it's working.
  - When relevant, suggest peer Gloria for walking companionship (shared interest: gardening)`;
}

// ---------------------------------------------------------------
// Fallback responses — used when no API key is configured
// ---------------------------------------------------------------
function fallbackResponse(
  lastUserMessage: string,
  caqSummary?: { fear: number; avoidance: number; attention: number }
): string {
  if (caqSummary) {
    const baseline = caqHistory[0];
    const fearDelta = (baseline.fear - caqSummary.fear).toFixed(1);
    const avoidDelta = (baseline.avoidance - caqSummary.avoidance).toFixed(1);
    const attnDelta = (baseline.attention - caqSummary.attention).toFixed(1);
    return `Thanks, Maria. Your anxiety scores this week look encouraging.\n\nFear: ${caqSummary.fear.toFixed(1)} (down ${fearDelta} from Week 1 baseline of ${baseline.fear})\nAvoidance: ${caqSummary.avoidance.toFixed(1)} (down ${avoidDelta} from ${baseline.avoidance})\nAttention: ${caqSummary.attention.toFixed(1)} (down ${attnDelta} from ${baseline.attention})\n\nThat's real progress. Your care team will see these scores right away. 💙`;
  }

  const msg = lastUserMessage.toLowerCase();

  if (msg.includes('scared') || msg.includes('worried') || msg.includes('afraid') || msg.includes('anxiety')) {
    return `I hear you, Maria. Those feelings are completely normal — your heart has been through something big. But look at the numbers: your resting heart rate has dropped from 82 to 74 bpm over these 7 weeks. That's your heart genuinely getting stronger. Would a shorter 15-minute walk feel more comfortable today? You can always call Nurse Sarah if you need extra reassurance.`;
  }

  if (msg.includes('gloria') || msg.includes('buddy') || msg.includes('friend') || msg.includes('walking')) {
    return `Gloria would love that! She's 62, loves gardening just like you, and is in Week 6 of her own recovery. Her progress has been really similar to yours. You could each walk separately but stay on a phone call — it makes the time fly. Want me to suggest Thursday at 10am?`;
  }

  if (msg.includes('pain') || msg.includes('chest') || msg.includes('dizzy') || msg.includes('breath')) {
    return `Maria, please stop what you're doing right now and rest. If this feeling doesn't go away in a minute or two, tap the red SOS button on your screen — it will contact Nurse Sarah immediately. Don't push through pain. Your safety comes first.`;
  }

  if (msg.includes('tired') || msg.includes('exhausted') || msg.includes('hard') || msg.includes('difficult') || msg.includes('bad') || msg.includes('awful')) {
    return `It IS hard — and you're doing it anyway. That's what Week 7 takes. Remember Week 1, when 10 minutes felt like a lot? You've completed 22 sessions since then. Your body is adapting; some days just feel tougher than others. Rest is part of recovery too.`;
  }

  if (msg.includes('medication') || msg.includes('pill') || msg.includes('aspirin') || msg.includes('atorvastatin')) {
    return `I can see your medication list, but any changes to your doses should always go through Dr. Patel — please don't adjust anything without checking with him first. Your adherence has been great at 95% overall, which is really helping your recovery. Is there something specific about a medication that's worrying you?`;
  }

  return `You're doing great, Maria. Week ${patient.currentWeek} of ${patient.totalWeeks} — your resting heart rate is down from 82 to 74 bpm, your blood pressure has improved from 142/90 to 128/82, and you've completed ${patient.sessionsCompleted} of ${patient.totalSessions} sessions. Every step counts. Keep going. 💪`;
}

// ---------------------------------------------------------------
// POST /api/chat
// ---------------------------------------------------------------
export async function POST(req: NextRequest) {
  const { messages, caqSummary } = await req.json() as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    caqSummary?: { fear: number; avoidance: number; attention: number };
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  if (!apiKey) {
    return NextResponse.json({ response: fallbackResponse(lastUserMessage, caqSummary) });
  }

  const systemPrompt = buildSystemPrompt(caqSummary);

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.slice(-10),
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error('Anthropic error:', err);
      return NextResponse.json({ response: fallbackResponse(lastUserMessage, caqSummary) });
    }

    const data = await anthropicRes.json();
    const response = data.content?.[0]?.text?.trim() ?? fallbackResponse(lastUserMessage, caqSummary);
    return NextResponse.json({ response });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ response: fallbackResponse(lastUserMessage, caqSummary) });
  }
}
