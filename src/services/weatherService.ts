// Weather Underground PWS API Service

export interface WeatherObservation {
  stationID: string;
  tz?: string;
  obsTimeUtc: string;
  obsTimeLocal: string;
  neighborhood?: string;
  softwareType?: string;
  country?: string;
  solarRadiation: number | null;
  lon: number;
  realtimeFrequency?: number | null;
  epoch: number;
  lat: number;
  uv: number | null;
  winddir: number | null;
  humidity: number | null;
  qcStatus: number;
  metric: {
    temp: number | null;
    heatIndex: number | null;
    dewpt: number | null;
    windChill: number | null;
    windSpeed: number | null;
    windGust: number | null;
    pressure: number | null;
    precipRate: number | null;
    precipTotal: number | null;
    elev: number | null;
  };
}

export interface HistoricalObservation {
  stationID: string;
  tz: string;
  obsTimeUtc: string;
  obsTimeLocal: string;
  epoch: number;
  lat: number;
  lon: number;
  solarRadiationHigh: number | null;
  uvHigh: number | null;
  winddirAvg: number | null;
  humidityHigh: number | null;
  humidityLow: number | null;
  humidityAvg: number | null;
  qcStatus: number;
  metric: {
    tempHigh: number | null;
    tempLow: number | null;
    tempAvg: number | null;
    windspeedHigh: number | null;
    windspeedLow: number | null;
    windspeedAvg: number | null;
    windgustHigh: number | null;
    windgustLow: number | null;
    windgustAvg: number | null;
    dewptHigh: number | null;
    dewptLow: number | null;
    dewptAvg: number | null;
    windchillHigh: number | null;
    windchillLow: number | null;
    windchillAvg: number | null;
    heatindexHigh: number | null;
    heatindexLow: number | null;
    heatindexAvg: number | null;
    pressureMax: number | null;
    pressureMin: number | null;
    pressureTrend: number | null;
    precipRate: number | null;
    precipTotal: number | null;
  };
}

export interface WeatherResponse {
  observations: WeatherObservation[];
}

export interface HistoricalResponse {
  observations: HistoricalObservation[];
}

// Detailed observation from history/all endpoint (includes all fields for calculating daily summary)
export interface DetailedObservation {
  obsTimeUtc: string;
  obsTimeLocal: string;
  epoch: number;
  humidityHigh?: number | null;
  humidityLow?: number | null;
  humidityAvg?: number | null;
  uvHigh?: number | null;
  winddirAvg?: number | null;
  metric?: {
    tempHigh?: number | null;
    tempLow?: number | null;
    tempAvg?: number | null;
    windspeedHigh?: number | null;
    windspeedLow?: number | null;
    windspeedAvg?: number | null;
    windgustHigh?: number | null;
    windgustLow?: number | null;
    windgustAvg?: number | null;
    dewptHigh?: number | null;
    dewptLow?: number | null;
    dewptAvg?: number | null;
    pressureMax?: number | null;
    pressureMin?: number | null;
    precipTotal?: number | null;
    precipRate?: number | null;
  };
}

interface DetailedHistoryResponse {
  observations: DetailedObservation[];
}

// Edge Function URL for weather proxy
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const EDGE_FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/weather-proxy` : null;

// Fallback direct API (used if Edge Function not available)
const API_URL = 'https://api.weather.com/v2/pws/observations/current';
const HISTORY_API_URL = 'https://api.weather.com/v2/pws/history/daily';
const HISTORY_ALL_API_URL = 'https://api.weather.com/v2/pws/history/all';
const STATION_ID = 'IREIHA8';
const API_KEY = '4832c76ac9de49d2b2c76ac9de89d293';

// Helper function to safely parse JSON from a Response
async function safeJsonParse<T>(response: Response): Promise<T | null> {
  try {
    const text = await response.text();
    if (!text || text.trim() === '') {
      console.warn('API returned empty response');
      return null;
    }
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

// Helper function to check if a date string (YYYYMMDD) is today
function isToday(dateStr: string): boolean {
  const today = new Date();
  const todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  console.log(`isToday check: dateStr=${dateStr}, todayStr=${todayStr}, match=${dateStr === todayStr}`);
  return dateStr === todayStr;
}

// Helper function to calculate summary from detailed observations
function calculateSummaryFromDetailed(observations: DetailedObservation[], date: string): HistoricalObservation | null {
  if (!observations || observations.length === 0) return null;

  // Parse the requested date
  const year = parseInt(date.substring(0, 4));
  const month = parseInt(date.substring(4, 6));
  const day = parseInt(date.substring(6, 8));
  const requestedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  
  // Filter observations to only include those from the requested date (based on obsTimeLocal)
  const filteredObs = observations.filter(o => {
    if (!o.obsTimeLocal) return false;
    // obsTimeLocal format is "YYYY-MM-DD HH:MM:SS"
    const obsDate = o.obsTimeLocal.substring(0, 10);
    return obsDate === requestedDateStr;
  });
  
  console.log(`[${date}] Filtered ${observations.length} observations to ${filteredObs.length} for date ${requestedDateStr}`);
  
  // If no observations match the requested date, return null
  if (filteredObs.length === 0) {
    console.log(`[${date}] No observations found for requested date`);
    return null;
  }

  // Extract values from filtered observations - using correct API field names
  const tempHighs = filteredObs.map(o => o.metric?.tempHigh).filter((v): v is number => v !== null && v !== undefined);
  const tempLows = filteredObs.map(o => o.metric?.tempLow).filter((v): v is number => v !== null && v !== undefined);
  const tempAvgs = filteredObs.map(o => o.metric?.tempAvg).filter((v): v is number => v !== null && v !== undefined);
  
  const windSpeedHighs = filteredObs.map(o => o.metric?.windspeedHigh).filter((v): v is number => v !== null && v !== undefined);
  const windSpeedLows = filteredObs.map(o => o.metric?.windspeedLow).filter((v): v is number => v !== null && v !== undefined);
  const windSpeedAvgs = filteredObs.map(o => o.metric?.windspeedAvg).filter((v): v is number => v !== null && v !== undefined);
  
  const windGustHighs = filteredObs.map(o => o.metric?.windgustHigh).filter((v): v is number => v !== null && v !== undefined);
  
  const dewptHighs = filteredObs.map(o => o.metric?.dewptHigh).filter((v): v is number => v !== null && v !== undefined);
  const dewptLows = filteredObs.map(o => o.metric?.dewptLow).filter((v): v is number => v !== null && v !== undefined);
  const dewptAvgs = filteredObs.map(o => o.metric?.dewptAvg).filter((v): v is number => v !== null && v !== undefined);
  
  const pressureMaxs = filteredObs.map(o => o.metric?.pressureMax).filter((v): v is number => v !== null && v !== undefined);
  const pressureMins = filteredObs.map(o => o.metric?.pressureMin).filter((v): v is number => v !== null && v !== undefined);
  
  const humidityHighs = filteredObs.map(o => o.humidityHigh).filter((v): v is number => v !== null && v !== undefined);
  const humidityLows = filteredObs.map(o => o.humidityLow).filter((v): v is number => v !== null && v !== undefined);
  const humidityAvgs = filteredObs.map(o => o.humidityAvg).filter((v): v is number => v !== null && v !== undefined);
  
  const uvs = filteredObs.map(o => o.uvHigh).filter((v): v is number => v !== null && v !== undefined);
  const windDirs = filteredObs.map(o => o.winddirAvg).filter((v): v is number => v !== null && v !== undefined);
  const precipRates = filteredObs.map(o => o.metric?.precipRate).filter((v): v is number => v !== null && v !== undefined);
  
  console.log(`[${date}] Data counts - tempHighs: ${tempHighs.length}, windSpeedHighs: ${windSpeedHighs.length}, humidityHighs: ${humidityHighs.length}`);
  if (tempHighs.length > 0) {
    console.log(`[${date}] Temp range: ${Math.min(...tempLows)}° - ${Math.max(...tempHighs)}°`);
  }
  
  // Get first and last filtered observations for precipitation calculation
  const firstObs = filteredObs[0];
  const lastObs = filteredObs[filteredObs.length - 1];
  
  // Calculate today's precipitation as the difference between last and first observation
  // precipTotal is cumulative and doesn't reset at midnight
  const firstPrecip = firstObs.metric?.precipTotal ?? 0;
  const lastPrecip = lastObs.metric?.precipTotal ?? 0;
  const todayPrecip = Math.max(0, lastPrecip - firstPrecip);
  
  console.log(`[${date}] firstObs.obsTimeLocal=${firstObs.obsTimeLocal}, precipTotal=${firstPrecip}`);
  console.log(`[${date}] lastObs.obsTimeLocal=${lastObs.obsTimeLocal}, precipTotal=${lastPrecip}`);
  console.log(`[${date}] Calculated today's precipitation: ${todayPrecip}mm`);
  
  // Create proper date for the summary
  const requestedDate = new Date(year, month - 1, day, 12, 0, 0);
  const obsTimeLocal = `${requestedDateStr} 12:00:00`;
  const obsTimeUtc = requestedDate.toISOString();

  return {
    stationID: 'IREIHA8',
    tz: 'Asia/Jerusalem',
    obsTimeUtc: obsTimeUtc,
    obsTimeLocal: obsTimeLocal,
    epoch: requestedDate.getTime() / 1000,
    lat: 0,
    lon: 0,
    solarRadiationHigh: null,
    uvHigh: uvs.length > 0 ? Math.max(...uvs) : null,
    winddirAvg: windDirs.length > 0 ? windDirs.reduce((a, b) => a + b, 0) / windDirs.length : null,
    humidityHigh: humidityHighs.length > 0 ? Math.max(...humidityHighs) : null,
    humidityLow: humidityLows.length > 0 ? Math.min(...humidityLows) : null,
    humidityAvg: humidityAvgs.length > 0 ? humidityAvgs.reduce((a, b) => a + b, 0) / humidityAvgs.length : null,
    qcStatus: 1,
    metric: {
      tempHigh: tempHighs.length > 0 ? Math.max(...tempHighs) : null,
      tempLow: tempLows.length > 0 ? Math.min(...tempLows) : null,
      tempAvg: tempAvgs.length > 0 ? tempAvgs.reduce((a, b) => a + b, 0) / tempAvgs.length : null,
      windspeedHigh: windSpeedHighs.length > 0 ? Math.max(...windSpeedHighs) : null,
      windspeedLow: windSpeedLows.length > 0 ? Math.min(...windSpeedLows) : null,
      windspeedAvg: windSpeedAvgs.length > 0 ? windSpeedAvgs.reduce((a, b) => a + b, 0) / windSpeedAvgs.length : null,
      windgustHigh: windGustHighs.length > 0 ? Math.max(...windGustHighs) : null,
      windgustLow: null,
      windgustAvg: null,
      dewptHigh: dewptHighs.length > 0 ? Math.max(...dewptHighs) : null,
      dewptLow: dewptLows.length > 0 ? Math.min(...dewptLows) : null,
      dewptAvg: dewptAvgs.length > 0 ? dewptAvgs.reduce((a, b) => a + b, 0) / dewptAvgs.length : null,
      windchillHigh: null,
      windchillLow: null,
      windchillAvg: null,
      heatindexHigh: null,
      heatindexLow: null,
      heatindexAvg: null,
      pressureMax: pressureMaxs.length > 0 ? Math.max(...pressureMaxs) : null,
      pressureMin: pressureMins.length > 0 ? Math.min(...pressureMins) : null,
      pressureTrend: null,
      precipRate: precipRates.length > 0 ? Math.max(...precipRates) : null,
      precipTotal: todayPrecip
    }
  };
}

// Helper to fetch from Edge Function (direct API calls don't work due to CORS)
async function fetchWithProxy(endpoint: 'current' | 'history/daily' | 'history/all', date?: string): Promise<Response> {
  // Check if Edge Function is configured
  if (!EDGE_FUNCTION_URL || !SUPABASE_ANON_KEY) {
    console.error('Edge Function not configured. SUPABASE_URL:', !!SUPABASE_URL, 'ANON_KEY:', !!SUPABASE_ANON_KEY);
    throw new Error('שירות מזג האוויר לא מוגדר. אנא בדוק את הגדרות המערכת.');
  }

  try {
    console.log(`Calling Edge Function: ${endpoint}${date ? ` for ${date}` : ''}`);
    
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ endpoint, date }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Edge Function error ${response.status}:`, errorText);
      throw new Error(`שגיאה בשליפת נתונים: ${response.status}`);
    }
    
    return response;
  } catch (err) {
    console.error('Edge Function request failed:', err);
    if (err instanceof Error && err.message.includes('שגיאה')) {
      throw err;
    }
    throw new Error('לא ניתן להתחבר לשירות מזג האוויר. אנא נסה שוב.');
  }
}

export async function fetchWeatherData(): Promise<WeatherObservation | null> {
  try {
    const response = await fetchWithProxy('current');
    
    if (!response || !response.ok) {
      throw new Error(`Weather API error: ${response?.status || 'no response'}`);
    }
    
    const data = await safeJsonParse<WeatherResponse>(response);
    
    if (data?.observations && data.observations.length > 0) {
      return data.observations[0];
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    throw error;
  }
}

// Fetch historical data for a specific date (YYYYMMDD format)
export async function fetchHistoricalData(date: string): Promise<HistoricalObservation | null> {
  try {
    // For today, only use detailed API and calculate summary (daily API doesn't have today's data)
    if (isToday(date)) {
      console.log(`[${date}] Fetching TODAY's data from detailed API...`);
      const detailedResponse = await fetchWithProxy('history/all', date);
      
      if (!detailedResponse.ok) {
        console.error(`[${date}] Detailed API error: ${detailedResponse.status}`);
        throw new Error(`Weather History API error: ${detailedResponse.status}`);
      }
      
      // Check for empty response
      const detailedText = await detailedResponse.text();
      if (!detailedText || detailedText.trim() === '') {
        console.warn(`[${date}] Detailed API returned empty response`);
        // Fall back to current weather data
        const currentData = await fetchWeatherData();
        if (currentData) {
          const year = parseInt(date.substring(0, 4));
          const month = parseInt(date.substring(4, 6));
          const day = parseInt(date.substring(6, 8));
          const requestedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          return {
            stationID: currentData.stationID,
            tz: currentData.tz || 'Asia/Jerusalem',
            obsTimeUtc: currentData.obsTimeUtc,
            obsTimeLocal: currentData.obsTimeLocal,
            epoch: currentData.epoch,
            lat: currentData.lat,
            lon: currentData.lon,
            solarRadiationHigh: currentData.solarRadiation ?? null,
            uvHigh: currentData.uv ?? null,
            winddirAvg: currentData.winddir ?? null,
            humidityHigh: currentData.humidity ?? null,
            humidityLow: currentData.humidity ?? null,
            humidityAvg: currentData.humidity ?? null,
            qcStatus: 1,
            metric: {
              tempHigh: currentData.metric?.temp ?? null,
              tempLow: currentData.metric?.temp ?? null,
              tempAvg: currentData.metric?.temp ?? null,
              windspeedHigh: currentData.metric?.windSpeed ?? null,
              windspeedLow: currentData.metric?.windSpeed ?? null,
              windspeedAvg: currentData.metric?.windSpeed ?? null,
              windgustHigh: currentData.metric?.windGust ?? null,
              windgustLow: currentData.metric?.windGust ?? null,
              windgustAvg: currentData.metric?.windGust ?? null,
              dewptHigh: currentData.metric?.dewpt ?? null,
              dewptLow: currentData.metric?.dewpt ?? null,
              dewptAvg: currentData.metric?.dewpt ?? null,
              windchillHigh: currentData.metric?.windChill ?? null,
              windchillLow: currentData.metric?.windChill ?? null,
              windchillAvg: currentData.metric?.windChill ?? null,
              heatindexHigh: currentData.metric?.heatIndex ?? null,
              heatindexLow: currentData.metric?.heatIndex ?? null,
              heatindexAvg: currentData.metric?.heatIndex ?? null,
              pressureMax: currentData.metric?.pressure ?? null,
              pressureMin: currentData.metric?.pressure ?? null,
              pressureTrend: null,
              precipRate: currentData.metric?.precipRate ?? null,
              precipTotal: currentData.metric?.precipTotal ?? null
            }
          };
        }
        return null;
      }
      
      let detailedData: DetailedHistoryResponse;
      try {
        detailedData = JSON.parse(detailedText);
      } catch (parseError) {
        console.error(`[${date}] Failed to parse detailed API response:`, parseError);
        // Fall back to current weather data
        const currentData = await fetchWeatherData();
        if (currentData) {
          const year = parseInt(date.substring(0, 4));
          const month = parseInt(date.substring(4, 6));
          const day = parseInt(date.substring(6, 8));
          return {
            stationID: currentData.stationID,
            tz: currentData.tz || 'Asia/Jerusalem',
            obsTimeUtc: currentData.obsTimeUtc,
            obsTimeLocal: currentData.obsTimeLocal,
            epoch: currentData.epoch,
            lat: currentData.lat,
            lon: currentData.lon,
            solarRadiationHigh: currentData.solarRadiation ?? null,
            uvHigh: currentData.uv ?? null,
            winddirAvg: currentData.winddir ?? null,
            humidityHigh: currentData.humidity ?? null,
            humidityLow: currentData.humidity ?? null,
            humidityAvg: currentData.humidity ?? null,
            qcStatus: 1,
            metric: {
              tempHigh: currentData.metric?.temp ?? null,
              tempLow: currentData.metric?.temp ?? null,
              tempAvg: currentData.metric?.temp ?? null,
              windspeedHigh: currentData.metric?.windSpeed ?? null,
              windspeedLow: currentData.metric?.windSpeed ?? null,
              windspeedAvg: currentData.metric?.windSpeed ?? null,
              windgustHigh: currentData.metric?.windGust ?? null,
              windgustLow: currentData.metric?.windGust ?? null,
              windgustAvg: currentData.metric?.windGust ?? null,
              dewptHigh: currentData.metric?.dewpt ?? null,
              dewptLow: currentData.metric?.dewpt ?? null,
              dewptAvg: currentData.metric?.dewpt ?? null,
              windchillHigh: currentData.metric?.windChill ?? null,
              windchillLow: currentData.metric?.windChill ?? null,
              windchillAvg: currentData.metric?.windChill ?? null,
              heatindexHigh: currentData.metric?.heatIndex ?? null,
              heatindexLow: currentData.metric?.heatIndex ?? null,
              heatindexAvg: currentData.metric?.heatIndex ?? null,
              pressureMax: currentData.metric?.pressure ?? null,
              pressureMin: currentData.metric?.pressure ?? null,
              pressureTrend: null,
              precipRate: currentData.metric?.precipRate ?? null,
              precipTotal: currentData.metric?.precipTotal ?? null
            }
          };
        }
        return null;
      }
      
      console.log(`[${date}] Got ${detailedData.observations?.length || 0} observations for today`);
      
      const result = calculateSummaryFromDetailed(detailedData.observations, date);
      
      // For today, always use current weather data (detailed API may have stale/limited data)
      const currentData = await fetchWeatherData();
      if (result && currentData) {
        // Override with current real-time values
        result.metric.precipTotal = currentData.metric?.precipTotal ?? 0;
        result.metric.precipRate = currentData.metric?.precipRate ?? 0;
        
        // Update temperature
        const currentTemp = currentData.metric?.temp;
        if (currentTemp !== null && currentTemp !== undefined) {
          if (result.metric.tempHigh === null || currentTemp > result.metric.tempHigh) {
            result.metric.tempHigh = currentTemp;
          }
          if (result.metric.tempLow === null || currentTemp < result.metric.tempLow) {
            result.metric.tempLow = currentTemp;
          }
          result.metric.tempAvg = result.metric.tempAvg !== null 
            ? (result.metric.tempAvg + currentTemp) / 2 
            : currentTemp;
        }
        
        // Update humidity
        const currentHumidity = currentData.humidity;
        if (currentHumidity !== null && currentHumidity !== undefined) {
          if (result.humidityHigh === null || currentHumidity > result.humidityHigh) {
            result.humidityHigh = currentHumidity;
          }
          if (result.humidityLow === null || currentHumidity < result.humidityLow) {
            result.humidityLow = currentHumidity;
          }
          result.humidityAvg = result.humidityAvg !== null
            ? (result.humidityAvg + currentHumidity) / 2
            : currentHumidity;
        }
        
        // Update wind speed
        const currentWindSpeed = currentData.metric?.windSpeed;
        if (currentWindSpeed !== null && currentWindSpeed !== undefined) {
          if (result.metric.windspeedHigh === null || currentWindSpeed > result.metric.windspeedHigh) {
            result.metric.windspeedHigh = currentWindSpeed;
          }
          if (result.metric.windspeedLow === null || currentWindSpeed < result.metric.windspeedLow) {
            result.metric.windspeedLow = currentWindSpeed;
          }
          result.metric.windspeedAvg = result.metric.windspeedAvg !== null
            ? (result.metric.windspeedAvg + currentWindSpeed) / 2
            : currentWindSpeed;
        }
        
        // Update wind gust
        const currentWindGust = currentData.metric?.windGust;
        if (currentWindGust !== null && currentWindGust !== undefined) {
          if (result.metric.windgustHigh === null || currentWindGust > result.metric.windgustHigh) {
            result.metric.windgustHigh = currentWindGust;
          }
        }
        
        // Update wind direction
        const currentWindDir = currentData.winddir;
        if (currentWindDir !== null && currentWindDir !== undefined) {
          result.winddirAvg = result.winddirAvg !== null
            ? (result.winddirAvg + currentWindDir) / 2
            : currentWindDir;
        }
        
        // Update dew point
        const currentDewpt = currentData.metric?.dewpt;
        if (currentDewpt !== null && currentDewpt !== undefined) {
          if (result.metric.dewptHigh === null || currentDewpt > result.metric.dewptHigh) {
            result.metric.dewptHigh = currentDewpt;
          }
          if (result.metric.dewptLow === null || currentDewpt < result.metric.dewptLow) {
            result.metric.dewptLow = currentDewpt;
          }
          result.metric.dewptAvg = result.metric.dewptAvg !== null
            ? (result.metric.dewptAvg + currentDewpt) / 2
            : currentDewpt;
        }
        
        // Update pressure
        const currentPressure = currentData.metric?.pressure;
        if (currentPressure !== null && currentPressure !== undefined) {
          if (result.metric.pressureMax === null || currentPressure > result.metric.pressureMax) {
            result.metric.pressureMax = currentPressure;
          }
          if (result.metric.pressureMin === null || currentPressure < result.metric.pressureMin) {
            result.metric.pressureMin = currentPressure;
          }
        }
        
        // Update UV
        const currentUV = currentData.uv;
        if (currentUV !== null && currentUV !== undefined) {
          if (result.uvHigh === null || currentUV > result.uvHigh) {
            result.uvHigh = currentUV;
          }
        }
        
        console.log(`[${date}] Updated with current weather: temp=${currentTemp}, precip=${result.metric.precipTotal}mm, pressure=${currentPressure}`);
      }
      
      // If no observations for today yet, use current weather data entirely
      if (!result) {
        console.log(`[${date}] No observations for today yet, fetching current weather...`);
        if (currentData) {
          // Convert current observation to historical format
          const year = parseInt(date.substring(0, 4));
          const month = parseInt(date.substring(4, 6));
          const day = parseInt(date.substring(6, 8));
          const requestedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          return {
            stationID: currentData.stationID,
            tz: currentData.tz || 'Asia/Jerusalem',
            obsTimeUtc: currentData.obsTimeUtc,
            obsTimeLocal: currentData.obsTimeLocal,
            epoch: currentData.epoch,
            lat: currentData.lat,
            lon: currentData.lon,
            solarRadiationHigh: currentData.solarRadiation ?? null,
            uvHigh: currentData.uv ?? null,
            winddirAvg: currentData.winddir ?? null,
            humidityHigh: currentData.humidity ?? null,
            humidityLow: currentData.humidity ?? null,
            humidityAvg: currentData.humidity ?? null,
            qcStatus: 1,
            metric: {
              tempHigh: currentData.metric?.temp ?? null,
              tempLow: currentData.metric?.temp ?? null,
              tempAvg: currentData.metric?.temp ?? null,
              windspeedHigh: currentData.metric?.windSpeed ?? null,
              windspeedLow: currentData.metric?.windSpeed ?? null,
              windspeedAvg: currentData.metric?.windSpeed ?? null,
              windgustHigh: currentData.metric?.windGust ?? null,
              windgustLow: currentData.metric?.windGust ?? null,
              windgustAvg: currentData.metric?.windGust ?? null,
              dewptHigh: currentData.metric?.dewpt ?? null,
              dewptLow: currentData.metric?.dewpt ?? null,
              dewptAvg: currentData.metric?.dewpt ?? null,
              windchillHigh: currentData.metric?.windChill ?? null,
              windchillLow: currentData.metric?.windChill ?? null,
              windchillAvg: currentData.metric?.windChill ?? null,
              heatindexHigh: currentData.metric?.heatIndex ?? null,
              heatindexLow: currentData.metric?.heatIndex ?? null,
              heatindexAvg: currentData.metric?.heatIndex ?? null,
              pressureMax: currentData.metric?.pressure ?? null,
              pressureMin: currentData.metric?.pressure ?? null,
              pressureTrend: null,
              precipRate: currentData.metric?.precipRate ?? null,
              precipTotal: currentData.metric?.precipTotal ?? null
            }
          };
        }
      }
      
      console.log(`[${date}] Summary result:`, result ? 'SUCCESS' : 'NULL');
      return result;
    }
    
    // For past days, fetch both APIs in parallel
    const [dailyResponse, detailedResponse] = await Promise.all([
      fetchWithProxy('history/daily', date),
      fetchWithProxy('history/all', date).catch(() => null)
    ]);
    
    if (!dailyResponse.ok) {
      // If daily API fails, try to use detailed API to calculate summary
      if (detailedResponse && detailedResponse.ok) {
        const detailedData = await safeJsonParse<DetailedHistoryResponse>(detailedResponse);
        if (detailedData) {
          return calculateSummaryFromDetailed(detailedData.observations, date);
        }
      }
      throw new Error(`Weather History API error: ${dailyResponse.status}`);
    }
    
    const dailyData = await safeJsonParse<HistoricalResponse>(dailyResponse);
    
    // If daily API returns no data, try detailed API
    if (!dailyData?.observations || dailyData.observations.length === 0) {
      if (detailedResponse && detailedResponse.ok) {
        const detailedData = await safeJsonParse<DetailedHistoryResponse>(detailedResponse);
        if (detailedData) {
          return calculateSummaryFromDetailed(detailedData.observations, date);
        }
      }
      return null;
    }
    
    const obs = dailyData.observations[0];
    
    // Process detailed history for accurate precipitation
    if (detailedResponse && detailedResponse.ok) {
      try {
        const detailedData = await safeJsonParse<DetailedHistoryResponse>(detailedResponse);
        
        if (detailedData?.observations && detailedData.observations.length > 0) {
          // Parse the requested date for filtering
          const year = parseInt(date.substring(0, 4));
          const month = parseInt(date.substring(4, 6));
          const day = parseInt(date.substring(6, 8));
          const requestedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          // Filter observations to only include those from the requested date
          const filteredObs = detailedData.observations.filter(o => {
            if (!o.obsTimeLocal) return false;
            const obsDate = o.obsTimeLocal.substring(0, 10);
            return obsDate === requestedDateStr;
          });
          
          if (filteredObs.length > 0) {
            const firstObs = filteredObs[0];
            const lastObs = filteredObs[filteredObs.length - 1];
            
            let maxPrecipRate = 0;
            for (const detailedObs of filteredObs) {
              if (detailedObs.metric?.precipRate && detailedObs.metric.precipRate > maxPrecipRate) {
                maxPrecipRate = detailedObs.metric.precipRate;
              }
            }
            
            // Only calculate precipitation from detailed API if daily API didn't provide a value
            // Daily API should have correct daily totals; detailed API precipTotal is cumulative
            if (obs.metric.precipTotal === null || obs.metric.precipTotal === undefined) {
              const firstPrecip = firstObs.metric?.precipTotal ?? 0;
              const lastPrecip = lastObs.metric?.precipTotal ?? 0;
              const dayPrecip = Math.max(0, lastPrecip - firstPrecip);
              obs.metric.precipTotal = dayPrecip;
            }
            
            if (maxPrecipRate > 0) {
              obs.metric.precipRate = maxPrecipRate;
            }
          }
        }
      } catch (parseError) {
        // Silently fail - use daily data if detailed parsing fails
      }
    }
    
    return obs;
  } catch (error) {
    console.error('Failed to fetch historical data:', error);
    throw error;
  }
}

// Fetch historical data for a date range (parallel fetching for performance)
export async function fetchHistoricalRange(startDate: Date, endDate: Date): Promise<HistoricalObservation[]> {
  const dates: string[] = [];
  const currentDate = new Date(startDate);
  
  // Build list of all dates to fetch
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0].replace(/-/g, ''));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log(`Fetching ${dates.length} days of data in parallel batches...`);
  
  // Fetch in parallel batches of 10 to avoid overwhelming the API
  const BATCH_SIZE = 10;
  const results: HistoricalObservation[] = [];
  
  for (let i = 0; i < dates.length; i += BATCH_SIZE) {
    const batch = dates.slice(i, i + BATCH_SIZE);
    
    // Fetch batch in parallel
    const batchResults = await Promise.all(
      batch.map(async (dateStr) => {
        try {
          return await fetchHistoricalData(dateStr);
        } catch (error) {
          console.error(`Failed to fetch data for ${dateStr}:`, error);
          return null;
        }
      })
    );
    
    // Add successful results
    batchResults.forEach(data => {
      if (data) results.push(data);
    });
    
    console.log(`Fetched ${Math.min(i + BATCH_SIZE, dates.length)}/${dates.length} days`);
  }
  
  // Sort by date
  results.sort((a, b) => a.epoch - b.epoch);
  
  return results;
}

// Fetch detailed observations for a single day (for hourly charts)
export async function fetchDetailedDayData(date: string): Promise<DetailedObservation[]> {
  try {
    console.log(`[${date}] Fetching detailed day data...`);
    const response = await fetchWithProxy('history/all', date);
    
    if (!response || !response.ok) {
      console.error(`[${date}] Failed to fetch detailed data: ${response?.status}`);
      return [];
    }
    
    const data = await safeJsonParse<DetailedHistoryResponse>(response);
    
    if (!data?.observations || data.observations.length === 0) {
      console.warn(`[${date}] No detailed observations found`);
      return [];
    }
    
    // Parse the requested date for filtering
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6));
    const day = parseInt(date.substring(6, 8));
    const requestedDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Filter to only include observations from the requested date
    const filteredObs = data.observations.filter(o => {
      if (!o.obsTimeLocal) return false;
      const obsDate = o.obsTimeLocal.substring(0, 10);
      return obsDate === requestedDateStr;
    });
    
    console.log(`[${date}] Found ${filteredObs.length} observations for the day`);
    return filteredObs;
  } catch (error) {
    console.error(`[${date}] Error fetching detailed day data:`, error);
    return [];
  }
}

export function getWindDirection(degrees: number | null): string {
  if (degrees === null) return 'N/A';
  
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
