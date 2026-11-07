import { Wind, Mountain } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';
import { useThemeContext } from '@/contexts/ThemeContext';
import { WindDirectionCard } from '@/components/WindDirectionCard';
import { Header } from '@/components/Header';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { ThermometerCard } from '@/components/ThermometerCard';
import { HumidityCard } from '@/components/HumidityCard';
import { BarCard } from '@/components/BarCard';
import { UVIndexCard } from '@/components/UVIndexCard';
import { PressureCard } from '@/components/PressureCard';
import { RainGaugeCard } from '@/components/RainGaugeCard';
import { RainIntensityCard } from '@/components/RainIntensityCard';

export default function Index() {
  const { weather, loading, error, lastUpdated, refresh } = useWeather();
  const { theme, toggleTheme, isDark } = useThemeContext();

  if (loading && !weather) {
    return <LoadingState />;
  }

  if (error && !weather) {
    return <ErrorState message={error} onRetry={refresh} />;
  }

  const metric = weather?.metric;

  return (
    <div data-ev-id="ev_20a6a1b48d" className={`min-h-screen transition-colors duration-300 ${
    isDark ?
    'bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900' :
    'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'}`
    }>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        isDark={isDark} />

      
      <main data-ev-id="ev_baa0c4ecb7" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Station Info */}
        <div data-ev-id="ev_cfdc42425c" className={`mb-8 p-4 backdrop-blur-sm rounded-xl shadow-sm transition-colors duration-300 ${
        isDark ?
        'bg-white/5 border border-white/10' :
        'bg-white/60 border border-white/80'}`
        }>
          <div data-ev-id="ev_b8d09348c3" className={`flex flex-wrap items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`} dir="rtl">
            <span data-ev-id="ev_a91172b177" className="flex items-center gap-2">
              <span data-ev-id="ev_c62f0c7828" className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              תחנה מקוונת
            </span>
            <span data-ev-id="ev_610ed3e8be">עדכון אחרון: {lastUpdated ? lastUpdated.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}</span>
            <span data-ev-id="ev_610ed3e8be">מיקום: ריחן, ישראל</span>
          </div>
        </div>

        {/* Weather Cards Grid */}
        <div data-ev-id="ev_bba4417994" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr" dir="rtl">
          {/* Temperature - Thermometer */}
          <ThermometerCard
            temperature={metric?.temp ?? 0}
            feelsLike={metric?.heatIndex ?? undefined}
            isDark={isDark} />


          {/* Humidity - Water drop */}
          <HumidityCard
            humidity={weather?.humidity ?? 0}
            dewPoint={metric?.dewpt ?? undefined}
            isDark={isDark} />


          {/* Wind Speed - Bar chart */}
          <BarCard
            title="מהירות רוח"
            value={metric?.windSpeed ?? 0}
            unit="קמ״ש"
            max={80}
            icon={<Wind className="w-5 h-5 text-white" />}
            gradient="bg-gradient-to-br from-teal-500 to-emerald-700"
            segments={12}
            subtitle={metric?.windGust ? `משבים: עד ${metric.windGust} קמ״ש` : undefined}
            isDark={isDark} />


          {/* Rain Gauge - Total precipitation */}
          <RainGaugeCard
            totalToday={metric?.precipTotal ?? 0}
            rawWuToday={metric?.rawPrecipTotal}
            isOverridden={metric?.isRainOverridden}
            obsDate={weather?.obsTimeLocal}
            onRainUpdated={refresh}
            isDark={isDark} />

          {/* Rain Intensity - Current rate with bar chart */}
          <RainIntensityCard currentRate={metric?.precipRate ?? 0} isDark={isDark} />

          {/* Wind Direction */}
          <WindDirectionCard degrees={weather?.winddir ?? null} isDark={isDark} />

          {/* UV Index - Semi-circle gauge */}
          <UVIndexCard uvIndex={weather?.uv ?? 0} isDark={isDark} />

          {/* Pressure - Circular gauge */}
          <PressureCard pressure={metric?.pressure ?? 1013} isDark={isDark} />

          {/* Elevation */}
          <div data-ev-id="ev_e3aaa57a73" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-stone-400/30">
            <div data-ev-id="ev_a135e8f137" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-stone-500/20 blur-2xl" />
            <div data-ev-id="ev_d8065cc3b2" className="relative z-10">
              <div data-ev-id="ev_dc5acfa618" className="flex items-center gap-2 mb-4">
                <div data-ev-id="ev_dfedcefa03" className="p-2 rounded-lg bg-white/20">
                  <Mountain className="w-5 h-5 text-white" />
                </div>
                <span data-ev-id="ev_302f4ed73c" className="text-white/80 text-sm font-medium">גובה התחנה</span>
              </div>
              
              {/* Mountain visualization */}
              <div data-ev-id="ev_b21978b932" className="relative h-24 flex items-end justify-center">
                <svg data-ev-id="ev_5ded644e30" viewBox="0 0 100 60" className="w-full max-w-[160px]">
                  {/* Mountains */}
                  <polygon data-ev-id="ev_a7c0cc91fc" points="0,60 25,20 50,60" fill="rgba(255,255,255,0.15)" />
                  <polygon data-ev-id="ev_d903f64e2d" points="30,60 55,10 80,60" fill="rgba(255,255,255,0.25)" />
                  <polygon data-ev-id="ev_5d10538995" points="60,60 85,25 100,60" fill="rgba(255,255,255,0.15)" />
                  {/* Elevation line */}
                  <line data-ev-id="ev_66c9961c04"
                  x1="0"
                  y1={60 - (metric?.elev ?? 0) / 1000 * 50}
                  x2="100"
                  y2={60 - (metric?.elev ?? 0) / 1000 * 50}
                  stroke="rgba(34,197,94,0.8)"
                  strokeWidth="2"
                  strokeDasharray="4 2" />

                </svg>
              </div>
              
              <div data-ev-id="ev_d3979fcf18" className="text-center mt-4">
                <span data-ev-id="ev_62aac89729" className="text-4xl font-bold text-white">{metric?.elev ?? '--'}</span>
                <span data-ev-id="ev_58583cc7b0" className="text-xl text-white/70 mr-1">מטר</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer data-ev-id="ev_2a2b70ea9b" className="mt-12 text-center text-sm text-gray-400" dir="rtl">
          <p data-ev-id="ev_836b2e34c8">הנתונים מתעדכנים אוטומטית כל דקה</p>
          <p data-ev-id="ev_4a7eeb3853" className="mt-1">מופעל על ידי Weather Underground PWS API</p>
          
          <div data-ev-id="ev_a3394c5b6b" className="mt-8">
            <p data-ev-id="ev_4fa753ce19">תכנון וארגון האתר: רענן ארבל</p>
            <p data-ev-id="ev_bff6efdb79" className="mt-1">raanan.arbel@gmail.com   054-3136363</p>
          </div>
        </footer>
      </main>
    </div>);

}