import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/helpers';
import type { WeatherObservation, HistoricalObservation } from '@/services/weatherService';
import { fetchHistoricalRange } from '@/services/weatherService';

export type WeatherHistoryRecord = Tables<'weather_history'>;

// Clean up any corrupted data (like timestamps stored in wrong fields)
function sanitizeRecord(record: WeatherHistoryRecord): WeatherHistoryRecord {
  const validateValue = (value: number | null, max: number, min: number = -50): number | null => {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    if (isNaN(num)) return null;
    // Any value over 1 billion is definitely a timestamp, not a weather value
    if (num > 1000000000) return null;
    if (num < min || num > max) return null;
    return num;
  };

  return {
    ...record,
    temperature: validateValue(record.temperature, 70),
    feels_like: validateValue(record.feels_like, 70),
    humidity: validateValue(record.humidity, 100, 0),
    wind_speed: validateValue(record.wind_speed, 500, 0),
    wind_gust: validateValue(record.wind_gust, 500, 0),
    wind_direction: validateValue(record.wind_direction, 360, 0),
    precip_rate: validateValue(record.precip_rate, 500, 0),
    precip_total: validateValue(record.precip_total, 2000, 0),
    pressure: validateValue(record.pressure, 1100, 800),
    uv_index: validateValue(record.uv_index, 20, 0),
    dew_point: validateValue(record.dew_point, 50),
  };
}

export function useWeatherHistory() {
  const [history, setHistory] = useState<WeatherHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);

  const fetchHistory = useCallback(async (hours: number = 24) => {
    if (!supabase) {
      setError('Database not connected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const since = new Date();
      since.setHours(since.getHours() - hours);

      // For longer periods, we need to fetch more data
      // Supabase default limit is 1000, so we need to increase it
      const limit = hours <= 24 ? 1500 : hours <= 168 ? 10000 : 50000;

      const { data, error: fetchError } = await supabase
        .from('weather_history')
        .select('*')
        .gte('recorded_at', since.toISOString())
        .order('recorded_at', { ascending: true })
        .limit(limit);

      if (fetchError) throw fetchError;
      
      console.log(`Fetched ${data?.length || 0} records for ${hours} hours`);
      
      // Sanitize data to remove corrupted values
      const sanitizedData = (data ?? []).map(sanitizeRecord);
      setHistory(sanitizedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveWeatherData = useCallback(async (weather: WeatherObservation) => {
    if (!supabase) return;

    const record: TablesInsert<'weather_history'> = {
      recorded_at: weather.obsTimeUtc || new Date().toISOString(),
      temperature: weather.metric?.temp ?? null,
      feels_like: weather.metric?.heatIndex ?? null,
      humidity: weather.humidity ?? null,
      wind_speed: weather.metric?.windSpeed ?? null,
      wind_gust: weather.metric?.windGust ?? null,
      wind_direction: weather.winddir ?? null,
      precip_rate: weather.metric?.precipRate ?? null,
      precip_total: weather.metric?.precipTotal ?? null,
      pressure: weather.metric?.pressure ?? null,
      uv_index: weather.uv ?? null,
      dew_point: weather.metric?.dewpt ?? null,
    };

    try {
      const { error: insertError } = await supabase
        .from('weather_history')
        .insert(record);

      if (insertError) {
        console.error('Failed to save weather data:', insertError);
      }
    } catch (err) {
      console.error('Failed to save weather data:', err);
    }
  }, []);

  // Import historical data from Weather Underground
  const importHistoricalData = useCallback(async (startDate: Date, endDate: Date) => {
    if (!supabase) {
      setError('Database not connected');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Calculate total days
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setImportProgress({ current: 0, total: totalDays });

      const results = await fetchHistoricalRange(startDate, endDate);
      
      let imported = 0;
      for (const obs of results) {
        // Create a record for each day's summary (at end of day)
        const record: TablesInsert<'weather_history'> = {
          recorded_at: obs.obsTimeUtc || new Date(obs.epoch * 1000).toISOString(),
          temperature: obs.metric?.tempAvg ?? null,
          feels_like: obs.metric?.heatindexAvg ?? null,
          humidity: obs.metric?.humidityAvg ?? null,
          wind_speed: obs.metric?.windspeedAvg ?? null,
          wind_gust: obs.metric?.windgustHigh ?? null,
          wind_direction: obs.winddirAvg ?? null,
          precip_rate: null, // Daily summary doesn't have rate
          precip_total: obs.metric?.precipTotal ?? null,
          pressure: obs.metric?.pressureMax ?? null,
          uv_index: obs.uvHigh ?? null,
          dew_point: obs.metric?.dewptAvg ?? null,
        };

        try {
          const { error: insertError } = await supabase
            .from('weather_history')
            .upsert(record, { onConflict: 'recorded_at' });

          if (!insertError) {
            imported++;
          }
        } catch (err) {
          console.error('Failed to import record:', err);
        }

        setImportProgress({ current: imported, total: totalDays });
      }

      console.log(`Imported ${imported} days of historical data`);
      
      // Refresh the history after import
      await fetchHistory(8760);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import historical data');
    } finally {
      setLoading(false);
      setImportProgress(null);
    }
  }, [fetchHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    importProgress,
    fetchHistory,
    saveWeatherData,
    importHistoricalData,
  };
}
