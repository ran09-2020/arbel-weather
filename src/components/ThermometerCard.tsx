import { InfoTooltip } from './InfoTooltip';

interface ThermometerCardProps {
  temperature: number;
  feelsLike?: number;
  min?: number;
  max?: number;
  isDark?: boolean;
}

const TEMPERATURE_INFO = `מידת החום/קור באוויר, ב-°C.

🌡️ טווחים:
• מתחת 0: קפאון
• 0-10: קר
• 10-20: קריר נעים
• 20-30: חם נעים
• 30+: חם מאוד

💡 "מרגיש כמו" = השפעת לחות ורוח`;

export function ThermometerCard({ temperature, feelsLike, min = -10, max = 50, isDark = false }: ThermometerCardProps) {
  const percentage = Math.min(100, Math.max(0, (temperature - min) / (max - min) * 100));

  // Color based on temperature
  const getColor = (temp: number) => {
    if (temp <= 0) return '#3B82F6'; // blue
    if (temp <= 10) return '#06B6D4'; // cyan
    if (temp <= 20) return '#22C55E'; // green
    if (temp <= 30) return '#EAB308'; // yellow
    if (temp <= 40) return '#F97316'; // orange
    return '#EF4444'; // red
  };

  const color = getColor(temperature);

  // Generate scale marks
  const marks = [];
  for (let t = min; t <= max; t += 10) {
    marks.push(t);
  }

  return (
    <div data-ev-id="ev_967c0184e5" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-blue-400/30">
      <div data-ev-id="ev_8064eabafc" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-blue-500/20 blur-2xl" />
      
      <div data-ev-id="ev_1893599dcb" className="relative z-10">
        <div data-ev-id="ev_2a62bd9257" className="flex items-center justify-between mb-4">
          <p data-ev-id="ev_93c859cf2e" className="text-white/80 text-sm font-medium">טמפרטורה</p>
          <InfoTooltip title="טמפרטורה" content={TEMPERATURE_INFO} />
        </div>
        
        <div data-ev-id="ev_57f362c60b" className="flex items-center gap-6">
          {/* Thermometer visual */}
          <div data-ev-id="ev_dfbc867e96" className="relative h-40 w-8 flex flex-col items-center">
            {/* Tube */}
            <div data-ev-id="ev_cbb7f9b4bf" className="relative w-4 h-32 bg-white/10 rounded-full overflow-hidden border border-white/20">
              {/* Mercury */}
              <div data-ev-id="ev_794418fe44"
              className="absolute bottom-0 w-full rounded-full transition-all duration-700 ease-out"
              style={{
                height: `${percentage}%`,
                background: `linear-gradient(to top, ${color}, ${color}dd)`
              }} />

              {/* Scale marks */}
              {marks.map((mark) => {
                const pos = (mark - min) / (max - min) * 100;
                return (
                  <div data-ev-id="ev_8b5d30fa5d"
                  key={mark}
                  className="absolute right-full mr-1 flex items-center"
                  style={{ bottom: `${pos}%`, transform: 'translateY(50%)' }}>

                    <span data-ev-id="ev_2935030cdd" className="text-[10px] text-white/50 w-6 text-right">{mark}°</span>
                    <div data-ev-id="ev_6963636a78" className="w-2 h-px bg-white/30" />
                  </div>);

              })}
            </div>
            {/* Bulb */}
            <div data-ev-id="ev_6e6dfe2f29"
            className="w-8 h-8 rounded-full -mt-2 border-2 border-white/20 flex items-center justify-center"
            style={{ background: color }}>

              <div data-ev-id="ev_16270a639a" className="w-4 h-4 rounded-full bg-white/30" />
            </div>
          </div>
          
          {/* Values */}
          <div data-ev-id="ev_3f8b55d919" className="flex-1">
            <div data-ev-id="ev_e45e412b02" className="text-5xl font-bold text-white mb-2">
              {temperature}
              <span data-ev-id="ev_4d88d4ace2" className="text-2xl text-white/70">°C</span>
            </div>
            {feelsLike !== undefined &&
            <p data-ev-id="ev_fd7b92ef4c" className="text-white/60 text-sm" dir="rtl">
                מרגיש כמו: <span data-ev-id="ev_1c37fd720d" dir="ltr">{feelsLike}°C</span>
              </p>
            }
            <div data-ev-id="ev_404b560a5d" className="mt-4 flex items-center gap-2">
              <span data-ev-id="ev_183077eba0"
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: color }}>

                {temperature <= 10 ? 'קר' : temperature <= 25 ? 'נעים' : temperature <= 35 ? 'חם' : 'שרב'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>);

}