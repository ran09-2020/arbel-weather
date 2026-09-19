import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, WeatherObservation } from '@/services/weatherService';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/helpers';

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Validate weather values - filter out obviously invalid data (like timestamps stored by mistake)
function validateValue(value: number | null, max: number): number | null {
  if (value === null || value === undefined) return null;
  if (value < 0 || value > max) return null;
  return value;
}

async function saveWeatherToHistory(weather: WeatherObservation) {
  if (!supabase) return;

  const record: TablesInsert<'weather_history'> = {
    recorded_at: weather.obsTimeUtc || new Date().toISOString(),
    temperature: validateValue(weather.metric?.temp ?? null, 70), // Max 70°C
    feels_like: validateValue(weather.metric?.heatIndex ?? null, 70),
    humidity: validateValue(weather.humidity ?? null, 100),
    wind_speed: validateValue(weather.metric?.windSpeed ?? null, 500), // Max 500 km/h
    wind_gust: validateValue(weather.metric?.windGust ?? null, 500),
    wind_direction: validateValue(weather.winddir ?? null, 360),
    precip_rate: validateValue(weather.metric?.precipRate ?? null, 500), // Max 500 mm/h
    precip_total: validateValue(weather.metric?.precipTotal ?? null, 2000),
    pressure: validateValue(weather.metric?.pressure ?? null, 1100), // Max 1100 hPa
    uv_index: validateValue(weather.uv ?? null, 20),
    dew_point: validateValue(weather.metric?.dewpt ?? null, 50),
  };

  try {
    await supabase.from('weather_history').insert(record);
  } catch (err) {
    console.error('Failed to save weather history:', err);
  }
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshWeather = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchWeatherData();
      setWeather(data);
      setLastUpdated(new Date());
      
      // Save to history database
      if (data) {
        saveWeatherToHistory(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    refreshWeather();

    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(refreshWeather, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [refreshWeather]);

  return {
    weather,
    loading,
    error,
    lastUpdated,
    refresh: refreshWeather
  };
}
