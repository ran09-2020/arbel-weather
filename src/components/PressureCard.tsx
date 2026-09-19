import { Gauge } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface PressureCardProps {
  pressure: number;
  isDark?: boolean;
}

const PRESSURE_INFO = `משקל האוויר מעלינו, ב-hPa.

📊 טווחים:
• מתחת 1000: נמוך
• 1000-1020: תקין
• מעל 1020: גבוה

🌦️ לחץ נמוך = עננים וגשם
לחץ גבוה = שמיים בהירים

💡 ממוצע: 1013 hPa`;

export function PressureCard({ pressure }: PressureCardProps) {
  const min = 970;
  const max = 1050;
  const percentage = Math.min(100, Math.max(0, (pressure - min) / (max - min) * 100));

  const getStatus = (p: number) => {
    if (p < 1000) return { label: 'לחץ נמוך', desc: 'אפשרות לגשם', color: '#3B82F6' };
    if (p <= 1020) return { label: 'לחץ תקין', desc: 'מזג אוויר יציב', color: '#22C55E' };
    return { label: 'לחץ גבוה', desc: 'מזג אוויר יבש', color: '#F97316' };
  };

  const status = getStatus(pressure);

  return (
    <div data-ev-id="ev_3377e7d245" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-slate-400/30">
      <div data-ev-id="ev_caba9d51bf" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-slate-500/20 blur-2xl" />
      
      <div data-ev-id="ev_845ba426d8" className="relative z-10">
        <div data-ev-id="ev_ed1a5cc88a" className="flex items-center justify-between mb-4">
          <div data-ev-id="ev_940e6b96d9" className="flex items-center gap-2">
            <div data-ev-id="ev_060cbc1359" className="p-2 rounded-lg bg-white/20">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <span data-ev-id="ev_f1e34940da" className="text-white/80 text-sm font-medium">לחץ אטמוספרי</span>
          </div>
          <InfoTooltip title="לחץ ברומטרי" content={PRESSURE_INFO} />
        </div>
        
        {/* Circular gauge */}
        <div data-ev-id="ev_9dd7e2247a" className="relative w-full flex justify-center">
          <div data-ev-id="ev_221c741b06" className="relative w-36 h-36">
            <svg data-ev-id="ev_9d2a6600e9" viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
              {/* Background arc */}
              <circle data-ev-id="ev_35196c39c8"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              strokeDasharray="188.5 62.8" /* 270 degrees */
              strokeLinecap="round" />

              {/* Value arc */}
              <circle data-ev-id="ev_389c9b4b58"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={status.color}
              strokeWidth="8"
              strokeDasharray={`${percentage * 1.885} 251.3`}
              strokeLinecap="round"
              className="transition-all duration-700" />

            </svg>
            {/* Center value */}
            <div data-ev-id="ev_8018b71e29" className="absolute inset-0 flex flex-col items-center justify-center">
              <span data-ev-id="ev_9227ed55d8" className="text-2xl font-bold text-white">{pressure}</span>
              <span data-ev-id="ev_88a05782a0" className="text-xs text-white/60">hPa</span>
            </div>
          </div>
        </div>
        
        {/* Status */}
        <div data-ev-id="ev_6326e50daa" className="text-center mt-4" dir="rtl">
          <span data-ev-id="ev_e1d60f1b12"
          className="px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: status.color }}>

            {status.label}
          </span>
          <p data-ev-id="ev_bb488bdd03" className="text-white/50 text-xs mt-2">{status.desc}</p>
        </div>
        
        {/* Scale */}
        <div data-ev-id="ev_9af463f3f8" className="flex justify-between mt-3 text-xs text-white/40">
          <span data-ev-id="ev_723f7736f8">{min}</span>
          <span data-ev-id="ev_7bf15ab6da">1010</span>
          <span data-ev-id="ev_adedb1472b">{max}</span>
        </div>
      </div>
    </div>);

}