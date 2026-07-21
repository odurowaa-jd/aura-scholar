# Aura Scholar
**Live Demo:** [https://aura-scholar.vercel.app/]

Aura Scholar is a personal command center for managing school, scholarship, and assistantship applications — built for any student, at any level, applying anywhere. I built it to solve a problem I was living through firsthand: keeping track of deadlines, required documents, and progress across a dozen different programs while applying to schools. Spreadsheets and sticky notes weren't cutting it, so I built the tool I actually needed.

## Why I built this

Applying to schools means juggling wildly different requirements — transcripts here, a statement of purpose there, GRE scores for one program and not another — all against deadlines that don't care how many other applications you're also managing. This isn't just a graduate-school problem: undergraduates, transfer students, and anyone applying for scholarships or assistantships run into the exact same chaos. Aura Scholar exists to take that mental load off my plate: one place to see what's due, what's done, and what's left, with just enough structure to keep momentum without feeling like overhead.

## Features

- **Application Portfolio** — Track every school, scholarship, and assistantship in one place, organized by status: active, submitted, and accepted.
- **Per-Application Document Checklists** — Attach a checklist of required documents to each application, pulled from common presets (CV, SOP, transcripts, letters of recommendation, passport, GRE scores) or added as fully custom requirements unique to that program.
- **Readiness Scoring** — Each application shows a live completion percentage based on its document checklist, plus an overall portfolio-wide readiness score.
- **Daily Planner** — A task list grouped by month, week, and day, with priority levels (High, Medium, Low) so the most time-sensitive to-dos stand out.
- **Deadline Countdown** — Every application card shows the days remaining until its deadline, so nothing sneaks up unannounced.
- **Status-Driven Organization** — Applications automatically move between the Active Portfolio, Submission Archive, and Success Gallery as their status changes, with a small celebration when something is submitted or you get in.
- **Admin / Guest Modes** — Toggle between an editable admin view and a read-only guest view, useful for sharing progress without risking accidental edits.
- **Light & Dark Mode** — A calm, low-glare theme for late-night application sessions, and a softer daytime theme, both persisted between visits.
- **Local Persistence** — All data is saved to the browser automatically; no account or backend required to get started.

## Tech Stack

- **React** with functional components and hooks (`useState`, `useEffect`, `useMemo`)
- **TypeScript** for type-safe data models (applications, documents, tasks)
- **Tailwind CSS** for styling and theming
- **lucide-react** for iconography
- **localStorage** for client-side data persistence

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/aura-scholar.git
   cd aura-scholar
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Switch to **Admin Mode** using the toggle in the header.
2. Click **Add New Opportunity** to log a school, scholarship, or assistantship, including its degree level, program, deadline, priority, application fee, and required documents.
3. Check off documents as you complete them — each card's readiness bar updates automatically.
4. Use the **Daily Planner** to break application work into dated, prioritized tasks.
5. Update an application's status as it moves through the process; submitted and accepted applications move into their own sections automatically.

## Roadmap

Ideas for future iterations:

- Export/import application data (JSON or CSV)
- Optional cloud sync across devices
- Email or push reminders for upcoming deadlines
- Shareable read-only portfolio links

## License

This project is open source and available under the [MIT License](LICENSE).