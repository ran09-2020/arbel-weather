import { Droplets } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface HumidityCardProps {
  humidity: number;
  dewPoint?: number;
  isDark?: boolean;
}

const HUMIDITY_INFO = `כמות אדי מים באוויר, באחוזים.

💧 רמות:
• 0-30%: יבש - עור יבש
• 30-50%: נוח - אידיאלי
• 50-70%: לח
• 70%+: לח מאוד - מחניק

🌡️ נקודת טל = טמפרטורה בה מתחילה התעבות`;

export function HumidityCard({ humidity, dewPoint, isDark = false }: HumidityCardProps) {
  // Water level visualization
  const waterLevel = humidity;

  const getStatus = (h: number) => {
    if (h <= 30) return { label: 'יבש', color: '#F97316' };
    if (h <= 50) return { label: 'נוח', color: '#22C55E' };
    if (h <= 70) return { label: 'לח', color: '#3B82F6' };
    return { label: 'לח מאוד', color: '#6366F1' };
  };

  const status = getStatus(humidity);

  return (
    <div data-ev-id="ev_a07eaf71d9" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-blue-400/30">
      <div data-ev-id="ev_9426b2a0d9" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-blue-500/20 blur-2xl" />
      
      <div data-ev-id="ev_b95582735d" className="relative z-10">
        <div data-ev-id="ev_62a0da7c58" className="flex items-center justify-between mb-4">
          <div data-ev-id="ev_b5df9faea3" className="flex items-center gap-2">
            <div data-ev-id="ev_f7473d6596" className="p-2 rounded-lg bg-white/20">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span data-ev-id="ev_ac17d67ef7" className="text-white/80 text-sm font-medium">לחות</span>
          </div>
          <InfoTooltip title="לחות" content={HUMIDITY_INFO} />
        </div>
        
        <div data-ev-id="ev_89ecbd5de9" className="flex items-center gap-6">
          {/* Water drop visualization */}
          <div data-ev-id="ev_e7f9554e75" className="relative w-20 h-28">
            <svg data-ev-id="ev_5146fd88d0" viewBox="0 0 80 100" className="w-full h-full">
              {/* Drop outline */}
              <path data-ev-id="ev_5ce33cbde0"
              d="M40 5 C40 5 10 45 10 65 C10 85 23 95 40 95 C57 95 70 85 70 65 C70 45 40 5 40 5"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2" />

              {/* Clip path for water */}
              <clipPath data-ev-id="ev_24ddda3e54" id="dropClip">
                <path data-ev-id="ev_3a36b1121e" d="M40 5 C40 5 10 45 10 65 C10 85 23 95 40 95 C57 95 70 85 70 65 C70 45 40 5 40 5" />
              </clipPath>
              {/* Water fill */}
              <rect data-ev-id="ev_269adf3b1a"
              x="5"
              y={95 - waterLevel * 0.9}
              width="70"
              height={waterLevel * 0.9 + 5}
              fill="rgba(255,255,255,0.4)"
              clipPath="url(#dropClip)"
              className="transition-all duration-700" />

              {/* Wave effect */}
              <path data-ev-id="ev_7b143ba8fc"
              d={`M5 ${95 - waterLevel * 0.9} Q20 ${92 - waterLevel * 0.9} 40 ${95 - waterLevel * 0.9} T75 ${95 - waterLevel * 0.9}`}
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              clipPath="url(#dropClip)"
              className="transition-all duration-700" />

              {/* Percentage text */}
              <text data-ev-id="ev_6571929ad2"
              x="40"
              y="70"
              textAnchor="middle"
              fill="white"
              fontSize="16"
              fontWeight="bold">

                {humidity}%
              </text>
            </svg>
          </div>
          
          {/* Values */}
          <div data-ev-id="ev_f21db9dd1c" className="flex-1">
            <div data-ev-id="ev_bf9c5850f8" className="text-4xl font-bold text-white mb-2">
              {humidity}
              <span data-ev-id="ev_1258986733" className="text-xl text-white/70">%</span>
            </div>
            {dewPoint !== undefined &&
            <p data-ev-id="ev_901e0b4160" className="text-white/60 text-sm mb-3" dir="rtl">
                נקודת טל: <span data-ev-id="ev_0041a7d27d" dir="ltr">{dewPoint}°C</span>
              </p>
            }
            <span data-ev-id="ev_e31c12e518"
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: status.color, color: 'white' }}>

              {status.label}
            </span>
          </div>
        </div>
        
        {/* Scale bar */}
        <div data-ev-id="ev_9d6f6f6ead" className="mt-4">
          <div data-ev-id="ev_e3c58183c4" className="h-2 rounded-full bg-gradient-to-r from-orange-400 via-green-400 to-blue-400 opacity-60" />
          <div data-ev-id="ev_b350262299" className="flex justify-between mt-1 text-xs text-white/50">
            <span data-ev-id="ev_1659f23478">0%</span>
            <span data-ev-id="ev_db834c4a90">50%</span>
            <span data-ev-id="ev_c74b39c65c">100%</span>
          </div>
        </div>
      </div>
    </div>);

}