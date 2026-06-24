import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock } from 'lucide-react';
import type { CurrentWeather } from '../types/weather';
import { formatTemp, formatDate, formatTime } from '../utils/format';

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
}

export function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  const condition = weather.weather[0];
  const localTime = formatTime(weather.dt, weather.timezone);
  const dateStr = formatDate(weather.dt);

  return (
    <motion.div
      className="glass glass-shimmer rounded-3xl p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
    >
      {/* Decorative gradient blob */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(140, 193, 233, 0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">
              {weather.name}, {weather.sys.country}
            </span>
          </div>

          <motion.h1
            className="font-serif text-7xl lg:text-8xl text-white leading-none tracking-tight mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {formatTemp(weather.main.temp)}
          </motion.h1>

          <motion.p
            className="text-white/80 text-lg capitalize font-light mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {condition.description}
          </motion.p>

          <div className="flex flex-wrap gap-4 text-sm text-white/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{localTime}</span>
            </div>
          </div>
        </div>

        <motion.div
          className="flex flex-col items-end gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: 'spring' }}
        >
          <WeatherIconLarge iconCode={condition.icon} />
          <div className="text-right">
            <p className="text-white/50 text-xs uppercase tracking-wider">Feels like</p>
            <p className="text-white text-lg font-light">
              {formatTemp(weather.main.feels_like)}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function WeatherIconLarge({ iconCode }: { iconCode: string }) {
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
        alt="weather icon"
        className="w-32 h-32 lg:w-40 lg:h-40 drop-shadow-2xl"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <div
        className="absolute inset-0 blur-2xl opacity-50 -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(255, 248, 231, 0.5) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}