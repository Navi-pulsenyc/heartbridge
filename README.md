# HeartBridge AI

A comprehensive cardiac rehabilitation companion that supports post-operative heart patients through their recovery journey. HeartBridge provides AI-powered coaching, guided exercise sessions with real-time heart rate monitoring, medication adherence tracking, daily vitals logging, emotional support through conversational AI, peer matching, care team coordination, and an emergency response system — all designed to improve outcomes for patients in 12-week cardiac rehab programs.

**Live Demo:** https://heartbridge-anc7.vercel.app/

## Inspiration

Cardiac rehab programs save lives — patients who complete them are 50% less likely to be readmitted — yet dropout rates hover around 50%. We spoke with clinicians and learned that the biggest barriers aren't medical: they're emotional. Patients feel scared to exercise after a heart procedure, isolated during weeks of recovery at home, and overwhelmed by medications and vital tracking. Existing tools focus on data collection but ignore the human side. We asked: what if a patient's phone could be a companion that watches over them, coaches them through anxiety, and quietly alerts their care team the moment something goes wrong?

## What it does

HeartBridge AI is a mobile-first cardiac rehabilitation companion for post-operative heart patients. It provides:

- **AI-powered coaching** — A conversational companion (powered by Claude) that knows the patient's vitals, medications, anxiety scores, and care team. It offers personalized encouragement, answers questions, and escalates safety concerns.
- **Weekly Cardiac Anxiety Questionnaire (CAQ)** — A 6-question check-in that measures fear, avoidance, and heart-focused attention. The AI summarizes trends and shares results with the care team.
- **Guided exercise sessions** — Phase-by-phase workouts (warmup → active → cool-down) with real-time heart rate monitoring and video tutorials.
- **Medication adherence tracking** — Daily reminders and a tap-to-confirm interface for each dose.
- **Vitals logging** — Blood pressure, weight, SpO2, and blood sugar entry with historical trends.
- **3-level emergency response** — If the patient stops moving during exercise, the system escalates from a gentle screen prompt (30s) to an automatic nurse call (45s) to 911 dispatch (75s).
- **Peer matching** — Connects patients with similar diagnoses and interests (e.g., walking buddies who share a love of gardening).
- **Family sharing** — Lets patients share selected data (milestones, session counts) with family members while keeping sensitive data (vitals, anxiety scores) private.
- **Clinician dashboard** — A traffic-light view of all patients with drill-down into vitals trends, dropout risk scores, and anxiety trajectories, so care teams can intervene early.

## How we built it

We built HeartBridge as a Next.js 16 application with TypeScript, deployed on Vercel. The AI companion integrates with Anthropic's Claude API (claude-opus-4-6) through a custom API route that injects a rich system prompt containing the patient's full medical context — vitals trends, medication adherence rates, anxiety scores, care team info, and peer matches. This lets Claude generate responses grounded in real patient data rather than generic advice. The frontend uses Recharts for clinician-facing data visualizations and Lucide React for icons. We designed a comprehensive mock data layer in `mockData.ts` that simulates a realistic 12-week rehab journey for our demo patient (Maria Garcia, age 58, post-PCI with stent), including 7 weeks of vitals history, anxiety score trajectories, and session logs with intentional missed sessions to demonstrate the dropout-detection features. The emergency response system uses a timer-based escalation model. The entire app is client-side rendered with no database, making it simple to demo and deploy.

## Challenges we ran into

- **Crafting the AI system prompt** — Getting Claude to respond as a warm companion (not a clinical robot) while staying medically responsible took many iterations. We had to balance personality with safety guardrails — ensuring it never gives medical advice but always escalates chest pain or dizziness to an immediate SOS action.
- **Designing the CAQ flow inside chat** — Embedding a structured 6-question assessment within a free-form chat interface required careful state management to switch between conversational mode and questionnaire mode, then computing subscale scores and sending them back to the AI for summarization.
- **Making mock data feel real** — Creating 7 weeks of vitals, anxiety scores, and session history that tell a coherent recovery story (with realistic setbacks) was more work than expected. Every number needed to be clinically plausible.
- **Emergency escalation UX** — Designing a demo that conveys the life-saving potential of automatic nurse/911 escalation without actually calling anyone required thoughtful visual design and timed state transitions.

## Accomplishments that we're proud of

- The AI companion genuinely feels like talking to a coach who knows you — it references your exact heart rate improvements, your peer matches by name, and your medication adherence.
- The 3-level emergency escalation demo effectively communicates a feature that could save lives in a real deployment.
- The clinician dashboard's traffic-light system (green/yellow/red) makes it immediately obvious which patients need attention, with drill-down charts powered by Recharts.
- The weekly CAQ check-in seamlessly blends a validated psychological assessment into a conversational chat flow.
- The entire app works without an API key thanks to intelligent fallback responses, making it easy to demo anywhere.

## What we learned

- Cardiac rehab is as much a mental health challenge as a physical one — anxiety about exercising after heart surgery is a primary driver of dropout.
- Small design decisions (like letting patients share milestones with family but hide anxiety scores) have outsized impact on trust and adoption.
- Grounding an AI in real patient context (vitals, medications, scores) dramatically improves response quality compared to generic health chatbots.
- Building a convincing healthcare demo requires clinically plausible data — every blood pressure reading, anxiety score, and medication dose had to be realistic.

## What's next for HeartBridge AI

- **Wearable integration** — Connect to Apple Watch and Fitbit for real-time heart rate and movement data during exercise sessions, replacing the simulated values.
- **Persistent backend** — Add a database (e.g., Supabase) to store patient vitals, medication logs, and chat history across sessions.
- **Real emergency dispatch** — Integrate with hospital systems and nurse paging services for actual escalation beyond the demo.
- **Multi-patient AI** — Extend the clinician dashboard so care teams can ask Claude questions across their entire patient panel (e.g., "Which patients have rising anxiety this week?").
- **Validated clinical pilot** — Partner with a cardiac rehab program to test whether HeartBridge reduces dropout rates and improves CAQ scores compared to standard care.
- **Multilingual support** — Add Spanish and other languages to serve diverse patient populations.

## Team Members

- Lucas Yao
- Fergie Yang
- Sahil Parupudi
- Khyati
- Muhammad

## Run / Deploy Instructions

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local (optional — the app works without it using fallback responses)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy

The app is deployed on [Vercel](https://vercel.com). To deploy your own instance:

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set the `ANTHROPIC_API_KEY` environment variable in Vercel's project settings.
4. Deploy.

## Third-Party APIs, Models, and Datasets

| Category | Name | Usage |
|----------|------|-------|
| **AI Model** | [Claude (Anthropic)](https://www.anthropic.com/) — `claude-opus-4-6` | Powers the AI coach for personalized patient conversations, emotional support, and weekly cardiac anxiety check-in summaries |
| **Framework** | [Next.js](https://nextjs.org/) 16 | React framework for the full-stack web app |
| **Charts** | [Recharts](https://recharts.org/) | Visualizes vitals trends, anxiety scores, and clinician dashboards |
| **Icons** | [Lucide React](https://lucide.dev/) | UI icon library |
| **Videos** | [YouTube](https://youtube.com) (embedded) | Exercise tutorial videos for warmup, walking form, and cool-down stretches |
| **Dataset** | None (all patient data is locally defined) | Mock patient profiles, vitals history, medications, and care team data are defined in `src/lib/mockData.ts` |

## What Is Mocked vs. Live in the Demo

### Live

- **Claude AI Chat** — When an `ANTHROPIC_API_KEY` is configured, chat messages are sent to the Anthropic API and the AI generates real, personalized responses based on patient context (vitals, medications, anxiety scores, care team info).
- **YouTube Video Embeds** — Exercise tutorial videos are real YouTube videos embedded in the exercise page.

### Mocked

- **Patient data** — All vitals, medications, session history, anxiety/mood scores, and patient profiles are hardcoded demo data (no database or real patient records).
- **Exercise tracking** — Heart rate during guided sessions is simulated, not read from a wearable device.
- **Medication adherence** — UI allows marking medications as taken, but changes are not persisted.
- **Vitals logging** — Forms accept input but do not save to a backend.
- **Peer matching & community** — Peer profiles and messaging are static demo data.
- **Family sharing** — Family circle and privacy controls use mock data.
- **Care team & hospitals** — Care team schedules and hospital directory are hardcoded.
- **Emergency response** — SOS escalation is a timed demo (30s → 45s → 75s), not connected to real emergency services.
- **Clinician dashboard** — Patient list and risk scores are hardcoded; no real clinical data integration.
- **AI fallback** — If no API key is set or the API call fails, the chat returns pattern-matched hardcoded responses so the demo still works.

## License

MIT License — see [LICENSE](LICENSE) for details.
