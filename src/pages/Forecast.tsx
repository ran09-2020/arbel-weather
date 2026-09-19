import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, RefreshCw, Droplets, Wind, Sun } from 'lucide-react';
import { fetchForecast, getWeatherDescription, ForecastData, HourlyForecast, DailyForecast } from '@/services/forecastService';

function formatHour(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

function formatDay(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'היום';
  if (date.toDateString() === tomorrow.toDateString()) return 'מחר';

  return date.toLocaleDateString('he-IL', { weekday: 'long' });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' });
}

function HourlyCard({ hour }: {hour: HourlyForecast;}) {
  const weather = getWeatherDescription(hour.weatherCode);

  return (
    <div data-ev-id="ev_8458a5f6e1" className="flex-shrink-0 w-20 bg-slate-700/50 rounded-xl p-3 text-center border border-white/10">
      <p data-ev-id="ev_f310cf99f1" className="text-slate-400 text-xs mb-1">{formatHour(hour.time)}</p>
      <p data-ev-id="ev_8b5d1e6938" className="text-2xl mb-1">{weather.icon}</p>
      <p data-ev-id="ev_179cd2b8c3" className="text-white font-bold">{Math.round(hour.temperature)}°</p>
      {hour.precipitationProbability > 0 &&
      <p data-ev-id="ev_aa4e3a30c3" className="text-cyan-400 text-xs mt-1 flex items-center justify-center gap-1">
          <Droplets className="w-3 h-3" />
          {hour.precipitationProbability}%
        </p>
      }
    </div>);

}

function DailyCard({ day, isFirst }: {day: DailyForecast;isFirst: boolean;}) {
  const weather = getWeatherDescription(day.weatherCode);

  return (
    <div data-ev-id="ev_c0af8ce7b3" className={`bg-slate-700/50 rounded-xl p-4 border border-white/10 ${isFirst ? 'ring-2 ring-cyan-500/50' : ''}`}>
      <div data-ev-id="ev_e938d406e6" className="flex items-center justify-between" dir="rtl">
        <div data-ev-id="ev_23c4fca67f" className="flex items-center gap-3">
          <span data-ev-id="ev_11993aa819" className="text-3xl">{weather.icon}</span>
          <div data-ev-id="ev_0e3d6c6c5e">
            <p data-ev-id="ev_e7c2629c6e" className="text-white font-bold">{formatDay(day.date)}</p>
            <p data-ev-id="ev_c5189d30de" className="text-slate-400 text-sm">{formatDate(day.date)}</p>
          </div>
        </div>
        
        <div data-ev-id="ev_df97cbeae8" className="text-left">
          <p data-ev-id="ev_cce4fbc3a7" className="text-white">
            <span data-ev-id="ev_a0476715a1" className="font-bold text-lg">{Math.round(day.temperatureMax)}°</span>
            <span data-ev-id="ev_ba861c345f" className="text-slate-400 mx-1">/</span>
            <span data-ev-id="ev_f1bbad4af5" className="text-slate-400">{Math.round(day.temperatureMin)}°</span>
          </p>
          <p data-ev-id="ev_d9146b82ff" className="text-slate-400 text-sm">{weather.description}</p>
        </div>
      </div>
      
      <div data-ev-id="ev_19949de000" className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-sm" dir="rtl">
        <div data-ev-id="ev_17f5edcbd9" className="flex items-center gap-1 text-cyan-400">
          <Droplets className="w-4 h-4" />
          <span data-ev-id="ev_e69f679be7">{day.precipitationProbabilityMax}%</span>
        </div>
        <div data-ev-id="ev_2e843bcfa6" className="flex items-center gap-1 text-slate-400">
          <Wind className="w-4 h-4" />
          <span data-ev-id="ev_206a5fa77d">{Math.round(day.windSpeedMax)} קמ״ש</span>
        </div>
        <div data-ev-id="ev_ff7e846b0b" className="flex items-center gap-1 text-yellow-400">
          <Sun className="w-4 h-4" />
          <span data-ev-id="ev_5b9f7b0fe1">UV {Math.round(day.uvIndexMax)}</span>
        </div>
      </div>
    </div>);

}

export default function Forecast() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadForecast = async () => {
    setLoading(true);
    setError(null);
    const data = await fetchForecast();
    if (data) {
      setForecast(data);
    } else {
      setError('לא ניתן לטעון את התחזית');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  return (
    <div data-ev-id="ev_9e9f0a1e92" className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900">
      {/* Header */}
      <header data-ev-id="ev_493d6ae211" className="bg-white/5 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div data-ev-id="ev_b82279003d" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div data-ev-id="ev_bda616ab54" className="flex items-center justify-between">
            <div data-ev-id="ev_09683d6afc" className="flex items-center gap-3">
              <Link
                to="/"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </Link>
              <h1 data-ev-id="ev_1710c3b6dd" className="text-xl font-bold text-white">תחזית מזג אוויר - ריחן</h1>
            </div>
            <button data-ev-id="ev_c24645a85e"
            onClick={loadForecast}
            disabled={loading}
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 text-gray-300 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main data-ev-id="ev_f30174be32" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error &&
        <div data-ev-id="ev_0be885a3a5" className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-red-300">
            {error}
          </div>
        }

        {loading && !forecast ?
        <div data-ev-id="ev_9b6b67de7e" className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-300" />
          </div> :
        forecast ?
        <>
            {/* Hourly Forecast */}
            <div data-ev-id="ev_e0403a225c" className="mb-6">
              <h3 data-ev-id="ev_1efe8519d6" className="text-white font-bold mb-3" dir="rtl">תחזית שעתית</h3>
              <div data-ev-id="ev_39781b44f3" className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600">
                {forecast.hourly
                  .filter(hour => new Date(hour.time) >= new Date(new Date().setMinutes(0, 0, 0)))
                  .slice(0, 24)
                  .map((hour, index) =>
                <HourlyCard key={index} hour={hour} />
                )}
              </div>
            </div>

            {/* Daily Forecast */}
            <div data-ev-id="ev_b9a616fcf5">
              <h3 data-ev-id="ev_319c928d60" className="text-white font-bold mb-3" dir="rtl">תחזית שבועית</h3>
              <div data-ev-id="ev_f82b2b6455" className="flex flex-col gap-3">
                {forecast.daily.map((day, index) =>
              <DailyCard key={index} day={day} isFirst={index === 0} />
              )}
              </div>
            </div>

            {/* Attribution */}
            <p data-ev-id="ev_3bcf92a6ca" className="text-center text-slate-500 text-sm mt-6">
              נתונים מ-Open-Meteo • נ״צ: 32°28'04"N 35°07'59"E
            </p>
          </> :
        null}
      </main>
    </div>);

}