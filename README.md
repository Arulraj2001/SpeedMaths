# SpeedMaths - Master Mental Arithmetic and Calculation Speed

SpeedMaths is a production-ready, highly interactive mental arithmetic speed training web platform. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, the application features a calculations cockpit, automatic local analytics dashboards, progressive achievements, offline PWA capabilities, and SEO-optimized math guides.

---

## 🚀 Key Features

1. **Interactive Learning Suites**:
   - Dynamic reference charts for **Times Tables (1-50)**, **Squares (1-100)**, **Cubes (1-50)**, **Power Tables**, and **Fractions-to-Decimals**.
   - **Number Types Glossary** analyzing characteristics (Prime, Armstrong, Neon, Palindrome, Palindromic, etc.) with custom equation checkers.
2. **Arithmetic Workout Cockpit**:
   - **Practice Modes**: Standard Practice, Exam Mode (Strict 3 Lives), Time Attack (60s total), Infinite Mode, and seeded **Daily Challenges** (date-seeded).
   - **Multiple HUD layout templates**: MCQ grid choices, True/False buttons, Flash Cards (self-graded), and manual input fields.
3. **Analytics Dashboard**:
   - Interactive local-storage stats database showing Correct/Wrong totals, accuracy percentages, speeds, and streak tracking.
   - Customized SVG progress line curves, category frequency bars, radar strength webs, and a GitHub-style calendar consistency activity heatmap grid.
   - Data backup panel supporting JSON export/import and account reset dials.
4. **PWA & Offline Support**:
   - Custom `sw.js` Service Worker caching core assets and serving a fallback `/offline.html` page when disconnected.
   - PWA manifest mapping application shortcuts and startup icons.
5. **SEO & Crawl Optimization**:
   - Custom dynamic `sitemap.xml` mapping 97 URLs, automated `robots.txt`, and XML RSS dynamic feed at `/feed.xml`.
   - Rich JSON-LD Structured Schema (Breadcrumbs, Articles, Tables, and FAQs).
   - 6 long-form **2000+ words** mental calculation tutorials.
6. **Accessibility & Print Support**:
   - Keyboard hotkey mappings for gameplay drills (`[1]-[4]` selects MCQ, `[Space]` flips flashcard, `[V]` speaks text, `[H]` toggles hint, `[Esc]` aborts).
   - Voice read aloud triggers using standard browser Speech Synthesis.
   - Media print style sheets (`@media print`) converting grids to high-contrast monochrome A4 templates for clean PDF downloads.

---

## 📁 Clean Folder Structure

```
├── public/                     # Static PWA assets & fallbacks
│   ├── manifest.json           # PWA metadata & shortcut mappings
│   ├── sw.js                   # Cache manager Service Worker
│   └── offline.html            # Connection disconnect overlay
├── src/
│   ├── app/                    # Next.js App Router Page directories
│   │   ├── analytics/          # Dashboards & heatmap panels
│   │   ├── blog/               # Dynamic 2000+ word tutorial guides
│   │   ├── learn/              # Interactive math reference modules
│   │   ├── practice/           # Configuration cockpit & gameplay HUD
│   │   ├── sitemap.ts          # Automatic dynamic XML map generator
│   │   ├── robots.ts           # Crawlers allowance index
│   │   ├── feed.xml/           # Dynamic RSS XML Route Handler
│   │   ├── error.tsx           # Runtime crash boundary handler
│   │   ├── loading.tsx         # Static transition loading skeletons
│   │   └── layout.tsx          # Global tracking scripts layout
│   ├── components/             # Reusable UI primitives
│   │   ├── ui/                 # Buttons, Cards, Dialogs, Badges, Toasts
│   │   ├── layout/             # Sticky Navbar & Footer
│   │   ├── adsense-placeholder.tsx  # Dynamic Ad slots placeholder
│   │   └── times-table-actions.tsx  # Isolated Client controls wrapper
│   ├── data/                   # Shared static dictionary layers
│   └── lib/                    # Math utilities & sound synthesis
└── vercel.json                 # Vercel Cache-Control & headers config
```

---

## ⌨️ Desktop Keyboard Shortcuts

| Shortcut | Game State | Action |
| :--- | :--- | :--- |
| `[1]` - `[4]` | Active MCQ / T-F | Select respective answer choice option |
| `[Space]` | Active Flash Card | Flip card to reveal correct answer |
| `[1]` / `[2]` | Flipped Flash Card | Rate card as **[1] Wrong** or **[2] Correct** |
| `[H]` | Active Game HUD | Toggle math concept hint drawer |
| `[V]` | Active Game HUD | Speak equation aloud using Speech Synthesis |
| `[Esc]` | Active Game HUD | Abort current workout and return to summary |
| `Ctrl + K` / `⌘ + K` | Global | Toggle layout search command palette |

---

## ⚡ Setup & Development

### 1. Installation
Clone the project and install local node modules:
```bash
npm install
```

### 2. Run Local Development Server
Execute the bundler:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.

### 3. Production Build & Compiles
Verify lint rules and static file generation parameters:
```bash
npm run build
```

---

## 🌐 Production Deployment Guide (Vercel)

1. Sign in to your [Vercel Console](https://vercel.com).
2. Click **Add New** $\rightarrow$ **Project** and select the SpeedMaths directory.
3. Configure Environment Variables if custom tracking is desired:
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Google Analytics measurement ID (e.g. `G-XXXXXXXXXX`).
   - `NEXT_PUBLIC_MS_CLARITY_ID`: Microsoft Clarity ID (e.g. `clarityid`).
4. Click **Deploy**. Vercel will automatically compile the site statically using the Next.js static renderer.
