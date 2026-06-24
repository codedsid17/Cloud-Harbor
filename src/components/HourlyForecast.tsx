import { motion } from 'framer-motion';
import type { HourlyForecast } from '../types/weather';
import { formatTemp } from '../utils/format';

interface HourlyForecastProps {
  hourly: HourlyForecast[];
}

export function HourlyForecast({ hourly }: HourlyForecastProps) {
  return (
    <motion.div
      className="glass rounded-3xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-2xl text-white">Hourly Forecast</h3>
        <span className="text-xs text-white/40 uppercase tracking-wider">Next 24 hours</span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {hourly.map((hour, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all min-w-[80px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <span className="text-xs text-white/50 font-medium">{hour.time}</span>
            <motion.img
              src={`https://openweathermap.org/img/wn/${hour.weather.icon}@2x.png`}
              alt={hour.weather.description}
              className="w-10 h-10"
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
            <span className="text-white font-medium text-sm">
              {formatTemp(hour.temp)}
            </span>
            {hour.pop > 0.1 && (
              <span className="text-[10px] text-blue-300 font-medium">
                {Math.round(hour.pop * 100)}%
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}