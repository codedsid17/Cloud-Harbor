import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherTheme } from '../../types/weather';
import { weatherThemes } from '../../config/themes';
import { WeatherParticles } from './WeatherScene3D';

interface DynamicBackgroundProps {
  theme: WeatherTheme;
}

export function DynamicBackground({ theme }: DynamicBackgroundProps) {
  const config = weatherThemes[theme];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="absolute inset-0"
          style={{ background: config.bg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${theme}-overlay`}
          className="absolute inset-0"
          style={{ background: config.overlay }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      {/* Weather particles */}
      <WeatherParticles theme={theme} />

      {/* Subtle noise texture for premium film grain feel */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}