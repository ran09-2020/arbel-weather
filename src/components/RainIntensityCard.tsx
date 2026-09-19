import { CloudRain } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface RainIntensityCardProps {
  currentRate: number;
  isDark?: boolean;
}

const RAIN_INTENSITY_INFO = `קצב ירידת הגשם כרגע, במ"מ/שעה.

⛈️ עוצמות:
• 0: יבש
• 0-2.5: קל
• 2.5-7.5: בינוני
• 7.5-15: חזק
• מעל 15: זלעפות

⚠️ גשם חזק = הצפות וקושי בנהיגה`;

// Calculate dynamic max scale based on current rate
function getDynamicMax(rate: number): number {
  if (rate <= 20) return 20;
  if (rate <= 50) return 50;
  if (rate <= 100) return 100;
  if (rate <= 200) return 200;
  return Math.ceil(rate / 100) * 100; // Round up to nearest 100
}

export function RainIntensityCard({ currentRate, isDark = false }: RainIntensityCardProps) {
  const maxRate = getDynamicMax(currentRate);
  const ratePercentage = Math.min(100, currentRate / maxRate * 100);

  const getRateStatus = (rate: number) => {
    if (rate === 0) return { label: 'יבש', color: '#6B7280' };
    if (rate < 2.5) return { label: 'גשם קל', color: '#60A5FA' };
    if (rate < 7.5) return { label: 'גשם', color: '#3B82F6' };
    if (rate < 15) return { label: 'גשם חזק', color: '#F59E0B' };
    return { label: 'גשם זלעפות', color: '#EF4444' };
  };

  const status = getRateStatus(currentRate);
  const filledBars = Math.ceil(ratePercentage / 100 * 10);

  // Calculate scale labels based on max
  const scaleLabels = [
  '0',
  `${Math.round(maxRate * 0.25)}`,
  `${Math.round(maxRate * 0.5)}`,
  `${Math.round(maxRate * 0.75)}`,
  `${maxRate}`];


  return (
    <div data-ev-id="ev_0f965f52a4" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-indigo-400/30">
      <div data-ev-id="ev_7460a14fa6" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-indigo-500/20 blur-2xl" />
      
      {/* Rain drops animation when raining */}
      {currentRate > 0 &&
      <div data-ev-id="ev_f79fb91a33" className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) =>
        <div data-ev-id="ev_414654caba"
        key={i}
        className="absolute w-0.5 bg-gradient-to-b from-transparent to-blue-300 rounded-full opacity-40"
        style={{
          height: `${10 + Math.random() * 6}px`,
          left: `${15 + i * 15}%`,
          animation: `fall ${0.6 + Math.random() * 0.3}s linear infinite`,
          animationDelay: `${Math.random() * 0.4}s`
        }} />

        )}
        </div>
      }
      
      <div data-ev-id="ev_39b1d65b90" className="relative z-10">
        <div data-ev-id="ev_9b399ff0fd" className="flex items-center justify-between mb-4">
          <div data-ev-id="ev_57562d57e1" className="flex items-center gap-2">
            <div data-ev-id="ev_fb1ceda6f9" className="p-2 rounded-lg bg-white/20">
              <CloudRain className="w-5 h-5 text-white" />
            </div>
            <span data-ev-id="ev_5647b9e737" className="text-white/80 text-sm font-medium">עוצמת גשם</span>
          </div>
          <div data-ev-id="ev_24de2404ae" className="flex items-center gap-2">
            <span data-ev-id="ev_6ad8e05fcf"
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: status.color, color: 'white' }}>
              {status.label}
            </span>
            <InfoTooltip title="עוצמת גשם" content={RAIN_INTENSITY_INFO} />
          </div>
        </div>
        
        {/* Value */}
        <div data-ev-id="ev_3b36ceaee4" className="mb-4" dir="rtl">
          <span data-ev-id="ev_59f2272eed" className="text-4xl font-bold text-white" dir="ltr">{currentRate.toFixed(1)}</span>
          <span data-ev-id="ev_863637d77b" className="text-xl text-white/70 mr-1"> מ״מ/שעה</span>
        </div>
        
        {/* Vertical bars */}
        <div data-ev-id="ev_c0eb274c6b" className="flex items-end gap-1.5 h-24">
          {[...Array(10)].map((_, i) => {
            const barHeight = (i + 1) * 10;
            const isFilled = i < filledBars;

            // Color gradient based on intensity level
            const getBarColor = (index: number) => {
              if (index < 2) return '#60A5FA'; // Light blue - light rain
              if (index < 5) return '#3B82F6'; // Blue - moderate
              if (index < 8) return '#F59E0B'; // Orange - heavy
              return '#EF4444'; // Red - torrential
            };

            return (
              <div data-ev-id="ev_0f9e285341"
              key={i}
              className="flex-1 rounded-t transition-all duration-300"
              style={{
                height: `${barHeight}%`,
                background: isFilled ?
                getBarColor(i) :
                'rgba(255,255,255,0.15)',
                boxShadow: isFilled ? `0 0 8px ${getBarColor(i)}50` : 'none'
              }} />);


          })}
        </div>
        
        {/* Dynamic Scale */}
        <div data-ev-id="ev_725efba1fe" className="flex justify-between mt-2 text-xs text-white/50">
          {scaleLabels.map((label, i) =>
          <span data-ev-id="ev_a72e1e3443" key={i}>{label}</span>
          )}
        </div>
      </div>
      
      <style data-ev-id="ev_7ee042ae9d">{`
        @keyframes fall {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(200px); opacity: 0; }
        }
      `}</style>
    </div>);

}