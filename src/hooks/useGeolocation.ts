import { useState, useCallback } from 'react';

interface GeolocationState {
  city: string | null;
  error: string | null;
  isResolving: boolean;
}

/**
 * Reverse-geocode the visitor's lat/lon to a city name using Open-Meteo's
 * free geocoding API. Returns null if the user denies or the request fails.
 */
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].name as string;
    }
    return null;
  } catch {
    return null;
  }
}

const STORAGE_KEY = 'cloud-harbor-last-city';

export function useGeolocation(defaultCity: string = 'Tokyo') {
  const [state, setState] = useState<GeolocationState>({
    city: null,
    error: null,
    isResolving: true,
  });

  const requestLocation = useCallback(async (): Promise<string> => {
    // If we already remember a city from a prior visit, use it.
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState({ city: stored, error: null, isResolving: false });
        return stored;
      }
    } catch {
      /* localStorage unavailable */
    }

    // Try browser geolocation. If the user denies or the API is missing,
    // we fall back to the default city and remember that choice.
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        setState({ city: defaultCity, error: null, isResolving: false });
        try {
          localStorage.setItem(STORAGE_KEY, defaultCity);
        } catch {}
        resolve(defaultCity);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const city = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          const resolved = city ?? defaultCity;
          setState({ city: resolved, error: null, isResolving: false });
          try {
            localStorage.setItem(STORAGE_KEY, resolved);
          } catch {}
          resolve(resolved);
        },
        () => {
          // User denied, or geolocation timed out / errored.
          setState({ city: defaultCity, error: null, isResolving: false });
          try {
            localStorage.setItem(STORAGE_KEY, defaultCity);
          } catch {}
          resolve(defaultCity);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 },
      );
    });
  }, [defaultCity]);

  const rememberCity = useCallback((city: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, city);
    } catch {}
  }, []);

  return { ...state, requestLocation, rememberCity };
}