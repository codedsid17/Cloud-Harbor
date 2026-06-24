import { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWeather } from './hooks/useWeather';
import { useSearchHistory } from './hooks/useSearchHistory';
import { useGeolocation } from './hooks/useGeolocation';
import { getWeatherTheme, isDaytime } from './config/themes';
import { Dashboard } from './components/Dashboard';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { WeatherDetails } from './components/WeatherDetails';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { DynamicBackground } from './components/effects/DynamicBackground';
import { Scene3D } from './components/effects/WeatherScene3D';
import type { WeatherTheme } from './types/weather';

const FALLBACK_CITY = 'Nagpur';

export default function App() {
  const [city, setCity] = useState<string>('');
  const [isLocating, setIsLocating] = useState(true);
  const { current, daily, hourly, uvIndex, isLoading, error, refetch } = useWeather(city);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { requestLocation, rememberCity } = useGeolocation(FALLBACK_CITY);

  const theme: WeatherTheme = useMemo(() => {
    if (!current) return 'clear-day';
    const day = isDaytime(current.sys.sunrise, current.sys.sunset, current.dt);
    return getWeatherTheme(current.weather[0].id, day);
  }, [current]);

  // On first mount: ask for the visitor's location and resolve to a city.
  // If they deny, the cached last city (or fallback) is used.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const resolved = await requestLocation();
      if (!cancelled) {
        setCity(resolved);
        setIsLocating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [requestLocation]);

  const handleSearch = useCallback(
    (newCity: string) => {
      setCity(newCity);
      refetch(newCity);
      rememberCity(newCity);
    },
    [refetch, rememberCity],
  );

  // Persist the most recently loaded city to search history.
  useEffect(() => {
    if (current) {
      addToHistory(current.name, current.sys.country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.name, current?.sys.country]);

  return (
    <>
      <DynamicBackground theme={theme} />
      <Scene3D theme={theme} />

      <Dashboard>
        <div className="space-y-6 lg:space-y-8">
          {/* Search bar */}
          <SearchBar
            onSearch={handleSearch}
            history={history}
            onClearHistory={clearHistory}
            isLoading={isLoading}
          />

          {/* Hero typography — appears once we have data */}
          <AnimatePresence mode="wait">
            {current && !isLoading && (
              <motion.section
                key={`hero-${current.name}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center pt-4 lg:pt-8 pb-2"
              >
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/40 mb-3 font-medium">
                  The forecast for {current.name}
                </p>
                <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-gradient leading-tight">
                  {getHeroQuote(theme)}
                </h2>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Main content */}
          <AnimatePresence mode="wait">
            {isLocating && !current && (
              <motion.div
                key="locating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState message="Finding your location..." />
              </motion.div>
            )}

            {isLoading && !current && !isLocating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingState message={`Reading the skies over ${city}...`} />
              </motion.div>
            )}

            {error && !current && !isLocating && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ErrorState message={error} />
              </motion.div>
            )}

            {current && !isLoading && (
              <motion.div
                key={`content-${current.name}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                  <CurrentWeatherCard weather={current} />
                  <HourlyForecast hourly={hourly} />
                  <DailyForecast daily={daily} />
                </div>

                <div className="space-y-6 lg:space-y-8">
                  <WeatherDetails weather={current} uvIndex={uvIndex} />

                  {/* Sun arc / astronomy card */}
                  <SunArcCard
                    sunrise={current.sys.sunrise}
                    sunset={current.sys.sunset}
                    timezone={current.timezone}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Dashboard>
    </>
  );
}

function getHeroQuote(theme: WeatherTheme): string {
  const quotes: Record<WeatherTheme, string> = {
    'clear-day': 'A day of brilliance awaits.',
    'clear-night': 'A quiet, starlit sky.',
    cloudy: 'Soft light through layered clouds.',
    rain: 'Listen to the rhythm of rain.',
    thunderstorm: 'A restless, electric sky.',
    snow: 'A hushed, frosted world.',
    mist: 'Wrapped in gentle mist.',
  };
  return quotes[theme];
}

function SunArcCard({
  sunrise,
  sunset,
  timezone,
}: {
  sunrise: number;
  sunset: number;
  timezone: number;
}) {
  const now = Math.floor(Date.now() / 1000);
  const dayProgress = Math.max(0, Math.min(1, (now - sunrise) / (sunset - sunrise)));
  const isDaytime = now >= sunrise && now <= sunset;

  // Convert progress to an angle for the sun arc
  const angle = dayProgress * Math.PI;

  const formatLocalTime = (timestamp: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone ? 'UTC' : undefined,
    });
  };

  return (
    <motion.div
      className="glass rounded-3xl p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-2xl text-white">Sun Cycle</h3>
        <span className="text-xs text-white/40 uppercase tracking-wider">
          {isDaytime ? 'Daytime' : 'Nighttime'}
        </span>
      </div>

      <div className="relative h-32 mb-4">
        {/* The arc background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#438BC4" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#FFF8E7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#438BC4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M 10 90 Q 100 -10 190 90"
            stroke="url(#arc-gradient)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2 4"
          />
        </svg>

        {/* Sun/moon position */}
        <motion.div
          className="absolute w-6 h-6 rounded-full"
          style={{
            left: `${10 + dayProgress * 80}%`,
            top: `${90 - Math.sin(angle) * 100}%`,
            transform: 'translate(-50%, -50%)',
            background: isDaytime
              ? 'radial-gradient(circle, #FFF8E7 0%, #8CC1E9 100%)'
              : 'radial-gradient(circle, #FFF8E7 0%, #438BC4 100%)',
            boxShadow: isDaytime
              ? '0 0 30px rgba(255, 248, 231, 0.6)'
              : '0 0 20px rgba(140, 193, 233, 0.4)',
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Sunrise</p>
          <p className="text-white font-light text-lg">{formatLocalTime(sunrise)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Sunset</p>
          <p className="text-white font-light text-lg">{formatLocalTime(sunset)}</p>
        </div>
      </div>
    </motion.div>
  );
}