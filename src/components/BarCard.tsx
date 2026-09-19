import { ReactNode } from 'react';
import { InfoTooltip } from './InfoTooltip';

interface BarCardProps {
  title: string;
  value: number;
  unit: string;
  max: number;
  icon: ReactNode;
  gradient: string;
  barColor?: string;
  segments?: number;
  subtitle?: string;
  showScale?: boolean;
  isDark?: boolean;
  infoContent?: string;
}

const WIND_SPEED_INFO = `מהירות הרוח בקמ"ש.

💨 עוצמות:
• 0-5: רגיעה
• 5-20: קלה
• 20-40: מתונה
• 40-60: חזקה
• 60+: עזה - סכנה

🌪️ משבים = פרצי רוח חזקים`;

export function BarCard({
  title,
  value,
  unit,
  max,
  icon,
  gradient,
  barColor = 'bg-white',
  segments = 10,
  subtitle,
  showScale = true,
  isDark = false,
  infoContent = WIND_SPEED_INFO
}: BarCardProps) {
  const percentage = Math.min(100, Math.max(0, value / max * 100));
  const filledSegments = Math.round(percentage / 100 * segments);

  return (
    <div data-ev-id="ev_4e29a6c860" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-teal-400/30">
      <div data-ev-id="ev_5170302e56" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-teal-500/20 blur-2xl" />
      
      <div data-ev-id="ev_b73e67b152" className="relative z-10">
        <div data-ev-id="ev_766bfcbffd" className="flex items-center justify-between mb-4">
          <div data-ev-id="ev_6e310aee88" className="flex items-center gap-2">
            <div data-ev-id="ev_1a95e7a75d" className="p-2 rounded-lg bg-white/20">
              {icon}
            </div>
            <span data-ev-id="ev_94a457f951" className="text-white/80 text-sm font-medium">{title}</span>
          </div>
          <InfoTooltip title={title} content={infoContent} />
        </div>
        
        {/* Value display */}
        <div data-ev-id="ev_2ef2044156" className="mb-4" dir="rtl">
          <span data-ev-id="ev_345898e4fc" className="text-4xl font-bold text-white" dir="ltr">{value}</span>
          <span data-ev-id="ev_5639337285" className="text-xl text-white/70 mr-1"> {unit}</span>
        </div>
        
        {/* Segmented bar */}
        <div data-ev-id="ev_3020a88383" className="flex gap-1 h-8">
          {Array.from({ length: segments }).map((_, i) =>
          <div data-ev-id="ev_2cd11d2c10"
          key={i}
          className={`flex-1 rounded-sm transition-all duration-300 ${
          i < filledSegments ?
          `${barColor} shadow-lg` :
          'bg-white/20'}`
          }
          style={{
            opacity: i < filledSegments ? 1 - i * 0.05 : 1,
            transform: i < filledSegments ? 'scaleY(1)' : 'scaleY(0.8)'
          }} />

          )}
        </div>
        
        {/* Scale */}
        {showScale &&
        <div data-ev-id="ev_b5185e26e3" className="flex justify-between mt-2 text-xs text-white/50">
            <span data-ev-id="ev_abb6d17064">0</span>
            <span data-ev-id="ev_5a52659a1c">{max / 2}</span>
            <span data-ev-id="ev_ca2cc802fb">{max}</span>
          </div>
        }
        
        {subtitle &&
        <p data-ev-id="ev_9ce24edc50" className="text-white/60 text-sm mt-3">{subtitle}</p>
        }
      </div>
    </div>);

}