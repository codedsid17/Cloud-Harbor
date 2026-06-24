import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading weather data...' }: LoadingStateProps) {
  return (
    <motion.div
      className="glass rounded-3xl p-16 flex flex-col items-center justify-center gap-6 min-h-[400px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/10"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/80"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-white/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-white/60 text-sm font-light">{message}</p>
    </motion.div>
  );
}