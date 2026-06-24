import { motion } from 'framer-motion';
import type { DailyForecast } from '../types/weather';
import { formatTemp } from '../utils/format';

interface DailyForecastProps {
  daily: DailyForecast[];
}

export function DailyForecast({ daily }: DailyForecastProps) {
  return (
    <motion.div
      className="glass rounded-3xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-2xl text-white">7-Day Forecast</h3>
        <span className="text-xs text-white/40 uppercase tracking-wider">Weekly outlook</span>
      </div>

      <ul className="space-y-2">
        {daily.map((day, i) => {
          const minT = day.temp_min;
          const maxT = day.temp_max;
          // Calculate position of indicator on the temperature range
          const allTemps = daily.flatMap((d) => [d.temp_min, d.temp_max]);
          const minAll = Math.min(...allTemps);
          const maxAll = Math.max(...allTemps);
          const range = maxAll - minAll || 1;
          const left = ((minT - minAll) / range) * 100;
          const right = 100 - ((maxT - minAll) / range) * 100;

          return (
            <motion.li
              key={day.date}
              className="grid grid-cols-[60px_40px_1fr_80px] items-center gap-4 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.05 }}
            >
              <span className="text-white/80 text-sm font-medium">
                {i === 0 ? 'Today' : day.dayName}
              </span>

              <motion.img
                src={`https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                alt={day.weather.description}
                className="w-9 h-9"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.3,
                }}
              />

              <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 rounded-full"
                  style={{
                    left: `${left}%`,
                    right: `${right}%`,
                    background:
                      'linear-gradient(90deg, #438BC4 0%, #8CC1E9 50%, #FFF8E7 100%)',
                    boxShadow: '0 0 8px rgba(140, 193, 233, 0.5)',
                  }}
                />
              </div>

              <div className="text-right">
                <span className="text-white font-medium text-sm">
                  {formatTemp(day.temp_max)}
                </span>
                <span className="text-white/40 text-sm ml-2">
                  {formatTemp(day.temp_min)}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}