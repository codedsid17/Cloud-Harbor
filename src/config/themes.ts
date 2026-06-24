import type { ThemeConfig, WeatherTheme } from '../types/weather';

export const weatherThemes: Record<WeatherTheme, ThemeConfig> = {
  'clear-day': {
    name: 'Clear Sky',
    bg: 'linear-gradient(135deg, #438BC4 0%, #8CC1E9 50%, #FFF8E7 100%)',
    overlay: 'radial-gradient(ellipse at 30% 20%, rgba(255, 248, 231, 0.4) 0%, transparent 60%)',
    accent: '#FFF8E7',
    text: '#12284B',
    particleType: 'sun',
    ambient: 'bright',
  },
  'clear-night': {
    name: 'Clear Night',
    bg: 'linear-gradient(135deg, #0a1530 0%, #12284B 50%, #0055A0 100%)',
    overlay: 'radial-gradient(ellipse at 70% 30%, rgba(140, 193, 233, 0.15) 0%, transparent 60%)',
    accent: '#8CC1E9',
    text: '#FFF8E7',
    particleType: 'stars',
    ambient: 'night',
  },
  cloudy: {
    name: 'Cloudy',
    bg: 'linear-gradient(135deg, #12284B 0%, #0055A0 50%, #438BC4 100%)',
    overlay: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
    accent: '#8CC1E9',
    text: '#FFF8E7',
    particleType: 'clouds',
    ambient: 'cool',
  },
  rain: {
    name: 'Rain',
    bg: 'linear-gradient(135deg, #0a1530 0%, #12284B 50%, #0055A0 100%)',
    overlay: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, transparent 50%)',
    accent: '#8CC1E9',
    text: '#FFF8E7',
    particleType: 'rain',
    ambient: 'wet',
  },
  thunderstorm: {
    name: 'Thunderstorm',
    bg: 'linear-gradient(135deg, #050a1a 0%, #0a1530 50%, #12284B 100%)',
    overlay: 'radial-gradient(ellipse at 50% 0%, rgba(0, 85, 160, 0.4) 0%, transparent 60%)',
    accent: '#438BC4',
    text: '#FFF8E7',
    particleType: 'lightning',
    ambient: 'dark',
  },
  snow: {
    name: 'Snow',
    bg: 'linear-gradient(135deg, #12284B 0%, #438BC4 50%, #8CC1E9 100%)',
    overlay: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
    accent: '#FFF8E7',
    text: '#12284B',
    particleType: 'snow',
    ambient: 'cold',
  },
  mist: {
    name: 'Mist',
    bg: 'linear-gradient(135deg, #0055A0 0%, #438BC4 50%, #8CC1E9 100%)',
    overlay: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
    accent: '#FFF8E7',
    text: '#12284B',
    particleType: 'mist',
    ambient: 'cool',
  },
};

export function getWeatherTheme(
  conditionId: number,
  isDay: boolean,
): WeatherTheme {
  // Thunderstorm: 200-299
  if (conditionId >= 200 && conditionId < 300) return 'thunderstorm';
  // Drizzle: 300-399, Rain: 500-599
  if (conditionId >= 300 && conditionId < 600) return 'rain';
  // Snow: 600-699
  if (conditionId >= 600 && conditionId < 700) return 'snow';
  // Atmosphere (mist, fog, etc): 700-799
  if (conditionId >= 700 && conditionId < 800) return 'mist';
  // Clear: 800
  if (conditionId === 800) return isDay ? 'clear-day' : 'clear-night';
  // Clouds: 801-804
  if (conditionId > 800) return 'cloudy';
  return isDay ? 'clear-day' : 'clear-night';
}

export function isDaytime(sunrise: number, sunset: number, dt: number = Date.now() / 1000): boolean {
  return dt >= sunrise && dt < sunset;
}
