import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  Gauge,
  Sun,
  Eye,
  Thermometer,
  Compass,
  CloudRain,
} from 'lucide-react';
import type { CurrentWeather } from '../types/weather';
import {
  formatTemp,
  getWindDirection,
  metersToKm,
} from '../utils/format';

interface WeatherDetailsProps {
  weather: CurrentWeather;
  uvIndex?: number;
}

export function WeatherDetails({ weather, uvIndex = 5 }: WeatherDetailsProps) {
  const details = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      accent: 'from-blue-400/20 to-cyan-400/20',
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${weather.wind.speed.toFixed(1)} m/s`,
      sub: getWindDirection(weather.wind.deg),
      accent: 'from-emerald-400/20 to-teal-400/20',
    },
    {
      icon: Gauge,
      label: 'Pressure',
      value: `${weather.main.pressure}`,
      sub: 'hPa',
      accent: 'from-purple-400/20 to-pink-400/20',
    },
    {
      icon: Sun,
      label: 'UV Index',
      value: `${uvIndex}`,
      sub: uvIndex <= 2 ? 'Low' : uvIndex <= 5 ? 'Moderate' : uvIndex <= 7 ? 'High' : 'Extreme',
      accent: 'from-yellow-400/20 to-orange-400/20',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: `${metersToKm(weather.visibility).toFixed(1)}`,
      sub: 'km',
      accent: 'from-sky-400/20 to-indigo-400/20',
    },
    {
      icon: Thermometer,
      label: 'Feels Like',
      value: formatTemp(weather.main.feels_like),
      accent: 'from-rose-400/20 to-red-400/20',
    },
    {
      icon: Compass,
      label: 'Wind Direction',
      value: `${weather.wind.deg}°`,
      sub: getWindDirection(weather.wind.deg),
      accent: 'from-amber-400/20 to-yellow-400/20',
    },
    {
      icon: CloudRain,
      label: 'Cloud Cover',
      value: `${weather.clouds.all}%`,
      accent: 'from-slate-400/20 to-gray-400/20',
    },
  ];

  return (
    <motion.div
      className="glass rounded-3xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-2xl text-white">Weather Details</h3>
        <span className="text-xs text-white/40 uppercase tracking-wider">Live metrics</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {details.map((detail, i) => (
          <motion.div
            key={detail.label}
            className="relative group rounded-2xl p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.05 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${detail.accent}`}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <detail.icon className="w-4 h-4 text-white/50" />
              </div>
              <p className="text-xs text-white/50 uppercase tracking-wider mb-1">
                {detail.label}
              </p>
              <p className="text-xl text-white font-light">{detail.value}</p>
              {detail.sub && (
                <p className="text-xs text-white/40 mt-1">{detail.sub}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}