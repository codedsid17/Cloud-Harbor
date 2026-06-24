import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="glass rounded-3xl p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-red-500/10 border border-red-400/30 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertCircle className="w-8 h-8 text-red-300" />
        </motion.div>
        <p className="text-white/80 text-base font-light text-center max-w-md">{message}</p>
        <p className="text-white/40 text-xs">Try searching for another city</p>
      </motion.div>
    </AnimatePresence>
  );
}