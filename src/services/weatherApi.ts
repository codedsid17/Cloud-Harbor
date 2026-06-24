import type {
  CurrentWeather,
  ForecastResponse,
  DailyForecast,
  HourlyForecast,
  WeatherCondition,
} from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// Map Open-Meteo's WMO weather codes → OpenWeatherMap-style condition objects
// so the rest of the app (which expects OWM shape) keeps working unchanged.
// Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
function wmoToCondition(code: number, isDay: boolean): WeatherCondition {
  const map: Record<
    number,
    { id: number; main: string; description: string; icon: string }
  > = {
    0: { id: 800, main: 'Clear', description: 'clear sky', icon: isDay ? '01d' : '01n' },
    1: {
      id: 801,
      main: 'Clouds',
      description: 'mainly clear',
      icon: isDay ? '02d' : '02n',
    },
    2: {
      id: 802,
      main: 'Clouds',
      description: 'partly cloudy',
      icon: isDay ? '03d' : '03n',
    },
    3: { id: 804, main: 'Clouds', description: 'overcast', icon: '04d' },
    45: { id: 701, main: 'Mist', description: 'fog', icon: '50d' },
    48: { id: 701, main: 'Mist', description: 'depositing rime fog', icon: '50d' },
    51: {
      id: 300,
      main: 'Drizzle',
      description: 'light drizzle',
      icon: '09d',
    },
    53: {
      id: 301,
      main: 'Drizzle',
      description: 'moderate drizzle',
      icon: '09d',
    },
    55: {
      id: 302,
      main: 'Drizzle',
      description: 'dense drizzle',
      icon: '09d',
    },
    56: {
      id: 311,
      main: 'Drizzle',
      description: 'light freezing drizzle',
      icon: '09d',
    },
    57: {
      id: 312,
      main: 'Drizzle',
      description: 'dense freezing drizzle',
      icon: '09d',
    },
    61: { id: 500, main: 'Rain', description: 'slight rain', icon: '10d' },
    63: { id: 501, main: 'Rain', description: 'moderate rain', icon: '10d' },
    65: { id: 502, main: 'Rain', description: 'heavy rain', icon: '10d' },
    66: {
      id: 511,
      main: 'Rain',
      description: 'light freezing rain',
      icon: '13d',
    },
    67: {
      id: 513,
      main: 'Rain',
      description: 'heavy freezing rain',
      icon: '13d',
    },
    71: { id: 600, main: 'Snow', description: 'slight snowfall', icon: '13d' },
    73: { id: 601, main: 'Snow', description: 'moderate snowfall', icon: '13d' },
    75: { id: 602, main: 'Snow', description: 'heavy snowfall', icon: '13d' },
    77: { id: 621, main: 'Snow', description: 'snow grains', icon: '13d' },
    80: {
      id: 520,
      main: 'Rain',
      description: 'slight rain showers',
      icon: '09d',
    },
    81: {
      id: 521,
      main: 'Rain',
      description: 'moderate rain showers',
      icon: '09d',
    },
    82: {
      id: 522,
      main: 'Rain',
      description: 'violent rain showers',
      icon: '09d',
    },
    85: {
      id: 621,
      main: 'Snow',
      description: 'slight snow showers',
      icon: '13d',
    },
    86: {
      id: 622,
      main: 'Snow',
      description: 'heavy snow showers',
      icon: '13d',
    },
    95: {
      id: 200,
      main: 'Thunderstorm',
      description: 'thunderstorm',
      icon: '11d',
    },
    96: {
      id: 201,
      main: 'Thunderstorm',
      description: 'thunderstorm with slight hail',
      icon: '11d',
    },
    99: {
      id: 202,
      main: 'Thunderstorm',
      description: 'thunderstorm with heavy hail',
      icon: '11d',
    },
  };

  return map[code] ?? {
    id: 800,
    main: 'Clear',
    description: 'clear sky',
    icon: isDay ? '01d' : '01n',
  };
}

interface GeocodingResult {
  name: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
}

interface OpenMeteoCurrent {
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  pressure_msl: number;
  relative_humidity_2m: number;
  is_day: number;
  uv_index?: number;
}

interface OpenMeteoHourly {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  relative_humidity_2m: number[];
}

interface OpenMeteoDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: OpenMeteoCurrent;
  hourly: OpenMeteoHourly;
  daily: OpenMeteoDaily;
}

async function geocodeCity(
  city: string,
): Promise<GeocodingResult> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Geocoding failed (${res.status})`);
  }
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`No location found for "${city}"`);
  }
  return data.results[0] as GeocodingResult;
}

async function fetchOpenMeteo(
  lat: number,
  lon: number,
): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current:
      'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,relative_humidity_2m,is_day,uv_index',
    hourly:
      'temperature_2m,weather_code,precipitation_probability,wind_speed_10m,relative_humidity_2m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Forecast failed (${res.status})`);
  }
  return await res.json();
}

// Compute sunrise/sunset from a date + lat/lon using the standard algorithm.
// (Rough but accurate to within a minute or two, which is plenty for UI.)
function computeSunTimes(
  lat: number,
  lon: number,
  date: Date,
): { sunrise: number; sunset: number } {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  );

  const declination = 23.45 * rad * Math.sin(((360 / 365) * (dayOfYear - 81)) * rad);
  const latRad = lat * rad;

  const cosHourAngle = -Math.tan(latRad) * Math.tan(declination);
  // Polar day / night — clamp to ±1 so acos doesn't NaN
  const clamped = Math.max(-1, Math.min(1, cosHourAngle));
  const hourAngle = Math.acos(clamped) * (180 / Math.PI);

  const solarNoonUTC = 12 - lon / 15;
  const sunriseUTC = solarNoonUTC - hourAngle / 15;
  const sunsetUTC = solarNoonUTC + hourAngle / 15;

  const baseUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return {
    sunrise: Math.floor((baseUTC + sunriseUTC * 3600 * 1000) / 1000),
    sunset: Math.floor((baseUTC + sunsetUTC * 3600 * 1000) / 1000),
  };
}

export async function fetchCurrentWeather(city: string): Promise<CurrentWeather> {
  const geo = await geocodeCity(city);
  const data = await fetchOpenMeteo(geo.latitude, geo.longitude);

  const now = new Date();
  const { sunrise, sunset } = computeSunTimes(geo.latitude, geo.longitude, now);
  const isDay = data.current.is_day === 1;

  return {
    coord: { lon: geo.longitude, lat: geo.latitude },
    weather: [wmoToCondition(data.current.weather_code, isDay)],
    base: 'open-meteo',
    main: {
      temp: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      temp_min: data.daily.temperature_2m_min[0],
      temp_max: data.daily.temperature_2m_max[0],
      pressure: Math.round(data.current.pressure_msl),
      humidity: data.current.relative_humidity_2m,
    },
    visibility: 10000,
    wind: {
      speed: data.current.wind_speed_10m / 3.6, // km/h → m/s to match OWM
      deg: data.current.wind_direction_10m,
    },
    clouds: { all: estimateCloudCover(data.current.weather_code) },
    dt: Math.floor(now.getTime() / 1000),
    sys: {
      country: geo.country_code || geo.country,
      sunrise,
      sunset,
    },
    timezone: tzOffsetSeconds(data.timezone),
    id: Math.floor(geo.latitude * 1000 + geo.longitude * 1000),
    name: geo.name,
    cod: 200,
  };
}

export async function fetchForecast(city: string): Promise<ForecastResponse> {
  const geo = await geocodeCity(city);
  const data = await fetchOpenMeteo(geo.latitude, geo.longitude);

  const list: ForecastResponse['list'] = data.hourly.time.map((t, i) => ({
    dt: Math.floor(new Date(t).getTime() / 1000),
    main: {
      temp: data.hourly.temperature_2m[i],
      feels_like: data.hourly.temperature_2m[i],
      temp_min: data.hourly.temperature_2m[i],
      temp_max: data.hourly.temperature_2m[i],
      pressure: data.current.pressure_msl,
      humidity: data.hourly.relative_humidity_2m[i] ?? data.current.relative_humidity_2m,
    },
    weather: [
      wmoToCondition(
        data.hourly.weather_code[i],
        isDayHour(new Date(t), geo.latitude, geo.longitude),
      ),
    ],
    clouds: { all: estimateCloudCover(data.hourly.weather_code[i]) },
    wind: {
      speed: (data.hourly.wind_speed_10m[i] ?? 0) / 3.6,
      deg: data.current.wind_direction_10m,
    },
    visibility: 10000,
    pop: (data.hourly.precipitation_probability[i] ?? 0) / 100,
    dt_txt: t,
  }));

  return {
    cod: '200',
    message: 0,
    cnt: list.length,
    list,
    city: {
      id: Math.floor(geo.latitude * 1000 + geo.longitude * 1000),
      name: geo.name,
      coord: { lon: geo.longitude, lat: geo.latitude },
      country: geo.country_code || geo.country,
      population: geo.population ?? 0,
      timezone: tzOffsetSeconds(data.timezone),
      sunrise: computeSunTimes(geo.latitude, geo.longitude, new Date()).sunrise,
      sunset: computeSunTimes(geo.latitude, geo.longitude, new Date()).sunset,
    },
  };
}

function tzOffsetSeconds(tz: string): number {
  try {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    return Math.round((tzDate.getTime() - utcDate.getTime()) / 1000);
  } catch {
    return 0;
  }
}

function estimateCloudCover(code: number): number {
  if (code === 0) return 0;
  if (code === 1) return 15;
  if (code === 2) return 50;
  if (code === 3) return 100;
  if (code >= 45 && code <= 48) return 100;
  if (code >= 51 && code <= 67) return 90;
  if (code >= 71 && code <= 86) return 100;
  if (code >= 95) return 100;
  return 50;
}

function isDayHour(date: Date, lat: number, lon: number): boolean {
  const { sunrise, sunset } = computeSunTimes(lat, lon, date);
  const t = Math.floor(date.getTime() / 1000);
  return t >= sunrise && t < sunset;
}

export function processDailyForecast(forecast: ForecastResponse): DailyForecast[] {
  const dailyMap = new Map<string, DailyForecast>();

  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];

    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        dayName: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        weather: item.weather[0],
        pop: item.pop,
        wind: item.wind.speed,
      });
    } else {
      const existing = dailyMap.get(date)!;
      existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
      existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
      existing.pop = Math.max(existing.pop, item.pop);
    }
  });

  return Array.from(dailyMap.values()).slice(0, 7);
}

export function processHourlyForecast(forecast: ForecastResponse): HourlyForecast[] {
  return forecast.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      hour: date.getHours(),
      temp: item.main.temp,
      weather: item.weather[0],
      pop: item.pop,
      wind: item.wind.speed,
    };
  });
}