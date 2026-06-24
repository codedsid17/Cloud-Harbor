import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Cloud, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeatherTheme } from '../../types/weather';

interface Scene3DProps {
  theme: WeatherTheme;
}

export function Scene3D({ theme }: Scene3DProps) {
  const showStars = theme === 'clear-night' || theme === 'thunderstorm';
  const showClouds = theme === 'cloudy' || theme === 'clear-day' || theme === 'rain';

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        {showStars && (
          <Stars
            radius={50}
            depth={20}
            count={2000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
        )}

        {showClouds && (
          <CloudsLayer theme={theme} />
        )}
      </Canvas>
    </div>
  );
}

function CloudsLayer({ theme }: { theme: WeatherTheme }) {
  const cloudPositions = useMemo(
    () => [
      { pos: [-6, 2, -5] as [number, number, number], scale: 1.2, opacity: 0.4 },
      { pos: [5, 1, -8] as [number, number, number], scale: 1.5, opacity: 0.3 },
      { pos: [-3, -2, -6] as [number, number, number], scale: 0.9, opacity: 0.5 },
      { pos: [7, 3, -10] as [number, number, number], scale: 1.8, opacity: 0.25 },
      { pos: [-8, 0, -7] as [number, number, number], scale: 1.1, opacity: 0.35 },
    ],
    [],
  );

  return (
    <>
      {cloudPositions.map((c, i) => (
        <FloatingCloud
          key={`${theme}-${i}`}
          position={c.pos}
          scale={c.scale}
          opacity={c.opacity}
        />
      ))}
    </>
  );
}

function FloatingCloud({
  position,
  scale,
  opacity,
}: {
  position: [number, number, number];
  scale: number;
  opacity: number;
}) {
  return (
    <Cloud
      position={position}
      scale={scale}
      opacity={opacity}
      speed={0.2}
      bounds={[20, 2, 5]}
      concentrate="random"
      color="#ffffff"
    />
  );
}

// Particle overlays for 2D effects on top of the 3D scene
export function WeatherParticles({ theme }: { theme: WeatherTheme }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        {theme === 'rain' && <RainEffect key="rain" />}
        {theme === 'snow' && <SnowEffect key="snow" />}
        {theme === 'thunderstorm' && <RainEffect key="storm-rain" intense />}
        {theme === 'clear-night' && <StarsEffect key="stars" />}
        {theme === 'thunderstorm' && <LightningEffect key="lightning" />}
        {theme === 'cloudy' && <CloudOverlay key="clouds" />}
        {theme === 'mist' && <MistEffect key="mist" />}
        {theme === 'clear-day' && <SunlightEffect key="sun" />}
      </AnimatePresence>
    </div>
  );
}

function RainEffect({ intense = false }: { intense?: boolean }) {
  const drops = Array.from({ length: intense ? 200 : 120 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.6,
    height: 12 + Math.random() * 18,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  return (
    <div className="absolute inset-0">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-px"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            background:
              'linear-gradient(to bottom, transparent, rgba(180, 215, 240, 0.6))',
            opacity: drop.opacity,
          }}
          initial={{ y: '-10vh' }}
          animate={{ y: '110vh' }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function SnowEffect() {
  const flakes = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 6,
    size: 4 + Math.random() * 8,
    drift: (Math.random() - 0.5) * 60,
    opacity: 0.4 + Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0">
      {flakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            boxShadow: '0 0 6px rgba(255,255,255,0.6)',
          }}
          initial={{ y: '-10vh', x: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            x: flake.drift,
            rotate: 360,
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

function StarsEffect() {
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 70,
    size: 1 + Math.random() * 2,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: '0 0 4px rgba(255,255,255,0.8)',
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function LightningEffect() {
  return (
    <>
      <motion.div
        className="absolute inset-0 bg-white"
        style={{ mixBlendMode: 'overlay' }}
        animate={{
          opacity: [0, 0, 0, 0.8, 0.2, 0.6, 0, 0, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          times: [0, 0.85, 0.9, 0.92, 0.94, 0.95, 0.96, 0.98, 1],
        }}
      />
    </>
  );
}

function CloudOverlay() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(140,193,233,0.06) 0%, transparent 50%)',
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

function MistEffect() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(140,193,233,0.1) 100%)',
      }}
      animate={{
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function SunlightEffect() {
  return (
    <motion.div
      className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(255, 248, 231, 0.4) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 0.9, 0.6],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}