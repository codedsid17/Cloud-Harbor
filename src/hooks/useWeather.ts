import { useState, useEffect, useCallback } from 'react';
import {
  fetchCurrentWeather,
  fetchForecast,
  processDailyForecast,
  processHourlyForecast,
} from '../services/weatherApi';
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
} from '../types/weather';

interface UseWeatherResult {
  current: CurrentWeather | null;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  uvIndex: number;
  isLoading: boolean;
  error: string | null;
  refetch: (city: string) => Promise<void>;
}

export function useWeather(initialCity: string = ''): UseWeatherResult {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast[]>([]);
  const [hourly, setHourly] = useState<HourlyForecast[]>([]);
  const [uvIndex, setUvIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!!initialCity);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const [currentData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city),
      ]);

      setCurrent(currentData);
      setDaily(processDailyForecast(forecastData));
      setHourly(processHourlyForecast(forecastData));
      setUvIndex(estimateUVFromTime(currentData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCity) {
      refetch(initialCity);
    }
  }, [initialCity, refetch]);

  return { current, daily, hourly, uvIndex, isLoading, error, refetch };
}

// Heuristic UV estimate by local hour. Open-Meteo exposes a precise value
// on its current block; we keep the UI simple by deriving one from sun
// elevation if the upstream value isn't in our shape.
function estimateUVFromTime(weather: CurrentWeather): number {
  const now = new Date((weather.dt + weather.timezone) * 1000);
  const hour = now.getUTCHours();
  if (hour < 7 || hour > 19) return 0;
  // Peak at solar noon (~13), taper to dawn/dusk
  const peak = 13;
  const diff = Math.abs(hour - peak);
  return Math.max(0, Math.round(9 - diff));
}