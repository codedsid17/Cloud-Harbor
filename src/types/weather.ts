// OpenWeatherMap API types

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CloudsData {
  all: number;
}

export interface RainData {
  '1h'?: number;
  '3h'?: number;
}

export interface SysData {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface CurrentWeather {
  coord: Coord;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  rain?: RainData;
  clouds: CloudsData;
  dt: number;
  sys: SysData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: CloudsData;
  wind: WindData;
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DailyForecast {
  date: string;
  dayName: string;
  temp_max: number;
  temp_min: number;
  weather: WeatherCondition;
  pop: number;
  wind: number;
}

export interface HourlyForecast {
  time: string;
  hour: number;
  temp: number;
  weather: WeatherCondition;
  pop: number;
  wind: number;
}

export type WeatherTheme =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'snow'
  | 'mist';

export interface ThemeConfig {
  name: string;
  bg: string;
  overlay: string;
  accent: string;
  text: string;
  particleType: 'sun' | 'stars' | 'rain' | 'snow' | 'clouds' | 'lightning' | 'mist';
  ambient: string;
}

export interface SearchHistoryItem {
  city: string;
  country: string;
  timestamp: number;
}
