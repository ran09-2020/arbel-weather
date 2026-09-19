// Open-Meteo Forecast API Service (Free, no API key required)

const LATITUDE = 32.4679; // 32°28'04.3"N
const LONGITUDE = 35.1331; // 35°07'59.1"E

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  windSpeedMax: number;
  uvIndexMax: number;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  currentWeather: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    isDay: boolean;
  };
}

// Weather code to Hebrew description and icon
export function getWeatherDescription(code: number): { description: string; icon: string } {
  const weatherCodes: Record<number, { description: string; icon: string }> = {
    0: { description: 'שמיים בהירים', icon: '☀️' },
    1: { description: 'בעיקר בהיר', icon: '🌤️' },
    2: { description: 'מעונן חלקית', icon: '⛅' },
    3: { description: 'מעונן', icon: '☁️' },
    45: { description: 'ערפל', icon: '🌫️' },
    48: { description: 'ערפל קפוא', icon: '🌫️' },
    51: { description: 'טפטוף קל', icon: '🌦️' },
    53: { description: 'טפטוף', icon: '🌦️' },
    55: { description: 'טפטוף כבד', icon: '🌧️' },
    56: { description: 'טפטוף קפוא קל', icon: '🌨️' },
    57: { description: 'טפטוף קפוא', icon: '🌨️' },
    61: { description: 'גשם קל', icon: '🌧️' },
    63: { description: 'גשם', icon: '🌧️' },
    65: { description: 'גשם כבד', icon: '🌧️' },
    66: { description: 'גשם קפוא קל', icon: '🌨️' },
    67: { description: 'גשם קפוא כבד', icon: '🌨️' },
    71: { description: 'שלג קל', icon: '❄️' },
    73: { description: 'שלג', icon: '❄️' },
    75: { description: 'שלג כבד', icon: '❄️' },
    77: { description: 'גרגירי שלג', icon: '❄️' },
    80: { description: 'ממטרים קלים', icon: '🌦️' },
    81: { description: 'ממטרים', icon: '🌧️' },
    82: { description: 'ממטרים חזקים', icon: '⛈️' },
    85: { description: 'ממטרי שלג קלים', icon: '🌨️' },
    86: { description: 'ממטרי שלג כבדים', icon: '🌨️' },
    95: { description: 'סופת רעמים', icon: '⛈️' },
    96: { description: 'סופת רעמים עם ברד קל', icon: '⛈️' },
    99: { description: 'סופת רעמים עם ברד כבד', icon: '⛈️' },
  };
  return weatherCodes[code] || { description: 'לא ידוע', icon: '❓' };
}

export async function fetchForecast(): Promise<ForecastData | null> {
  try {
    const params = new URLSearchParams({
      latitude: LATITUDE.toString(),
      longitude: LONGITUDE.toString(),
      hourly: 'temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,is_day',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,sunrise,sunset,wind_speed_10m_max,uv_index_max',
      current_weather: 'true',
      timezone: 'Asia/Jerusalem',
      forecast_days: '7'
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`);
    }

    const data = await response.json();

    // Parse hourly data (next 48 hours)
    const hourly: HourlyForecast[] = data.hourly.time.slice(0, 48).map((time: string, i: number) => ({
      time,
      temperature: data.hourly.temperature_2m[i],
      humidity: data.hourly.relative_humidity_2m[i],
      precipitation: data.hourly.precipitation[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
      weatherCode: data.hourly.weather_code[i],
      windSpeed: data.hourly.wind_speed_10m[i],
      windDirection: data.hourly.wind_direction_10m[i],
      isDay: data.hourly.is_day[i] === 1,
    }));

    // Parse daily data
    const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
      date,
      temperatureMax: data.daily.temperature_2m_max[i],
      temperatureMin: data.daily.temperature_2m_min[i],
      precipitationSum: data.daily.precipitation_sum[i],
      precipitationProbabilityMax: data.daily.precipitation_probability_max[i],
      weatherCode: data.daily.weather_code[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      uvIndexMax: data.daily.uv_index_max[i],
    }));

    return {
      hourly,
      daily,
      currentWeather: {
        temperature: data.current_weather.temperature,
        weatherCode: data.current_weather.weathercode,
        windSpeed: data.current_weather.windspeed,
        windDirection: data.current_weather.winddirection,
        isDay: data.current_weather.is_day === 1,
      },
    };
  } catch (error) {
    console.error('Failed to fetch forecast:', error);
    return null;
  }
}
