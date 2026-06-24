import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useMouseTracker } from '../hooks/useMousePosition';

interface DashboardProps {
  children: ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  const mouse = useMouseTracker();
  const containerRef = useRef<HTMLDivElement>(null);

  // Smoothed tilt values for cinematic feel
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(useTransform(tiltY, [-1, 1], [4, -4]), {
    stiffness: 80,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(tiltX, [-1, 1], [-4, 4]), {
    stiffness: 80,
    damping: 20,
  });

  useEffect(() => {
    tiltX.set(mouse.x);
    tiltY.set(mouse.y);
  }, [mouse, tiltX, tiltY]);

  return (
    <div
      ref={containerRef}
      className="relative z-10 min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-10 py-8 lg:py-12"
    >
      {/* Header */}
      <motion.header
        className="w-full max-w-7xl mb-8 lg:mb-12 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-2xl glass flex items-center justify-center"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-5 h-5 text-white"
            >
              <path d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
            </svg>
          </motion.div>
          <div>
            <h1 className="font-serif text-2xl text-white tracking-tight">Cloud Harbor</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
              A premium weather experience
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider text-white/40">
          <span>v1.0</span>
          <span>·</span>
          <span>Live data</span>
        </div>
      </motion.header>

      {/* The tiltable dashboard */}
      <motion.div
        className="w-full max-w-7xl perspective-1000"
        style={{
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className="mt-12 lg:mt-16 text-center text-xs text-white/30 tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        Crafted with care · Move your cursor to interact · Search any city to begin
      </motion.footer>
    </div>
  );
}