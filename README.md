# Cloud Harbor

A premium, cinematic weather dashboard. Luxury glassmorphism aesthetic, ocean-inspired palette, and dynamic theme switching based on live weather conditions. Built with React, Vite, TypeScript, Tailwind, Framer Motion, and React Three Fiber.

## Highlights

- **Glassmorphism UI** — Floating glass cards with shimmer, soft shadows, and dynamic reflections.
- **Dynamic themes** — The whole experience transforms: clear sky, cloudy, rain, thunderstorm, snow, and night, each with its own particle systems, lighting, and atmosphere.
- **3D depth** — The dashboard tilts gently with mouse movement. React Three Fiber renders drifting clouds and stars; rain, snow, and lightning are composited on top.
- **Live data** — OpenWeatherMap integration with city search, recent searches in localStorage, and a graceful mock-data fallback.
- **Cinematic motion** — Framer Motion drives page load, fade-rise transitions, hover states, and theme crossfades.
- **Typography** — Instrument Serif for cinematic headings, Inter for body.

## Live Demo

https://cloud-harbor.vercel.app/

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Optional: real weather data

Copy `.env.example` to `.env` and add your OpenWeatherMap key:

```
VITE_OPENWEATHER_API_KEY=your_key_here
```

Without a key the app uses realistic mock data so you can preview every theme. Try searching: `Tokyo`, `London`, `New York`, `Paris`, `Sydney`, `Reykjavik`, `Dubai`.

## Project structure

```
src/
├── components/        # UI building blocks (Dashboard, SearchBar, cards)
│   └── effects/       # Dynamic background, 3D scene, particles
├── config/themes.ts   # Theme + color config per weather condition
├── hooks/             # useWeather, useMousePosition, useSearchHistory
├── services/          # OpenWeatherMap client + mock fallback
├── types/             # TypeScript interfaces
├── utils/             # Formatting helpers
├── App.tsx
├── main.tsx
└── index.css
```

## Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Three Fiber** + **drei** for 3D scenes
- **lucide-react** for icons
