# HeartBridge AI

A comprehensive cardiac rehabilitation companion that supports post-operative heart patients through their recovery journey. HeartBridge provides AI-powered coaching, guided exercise sessions with real-time heart rate monitoring, medication adherence tracking, daily vitals logging, emotional support through conversational AI, peer matching, care team coordination, and an emergency response system — all designed to improve outcomes for patients in 12-week cardiac rehab programs.

**Live Demo:** https://heartbridge-anc7.vercel.app/

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
