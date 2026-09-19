import { Sun } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface UVIndexCardProps {
  uvIndex: number;
  isDark?: boolean;
}

const UV_INDEX_INFO = `עוצמת קרינת UV מהשמש.

☀️ רמות:
• 0-2: נמוך - בסדר
• 3-5: בינוני - קרם הגנה
• 6-7: גבוה - חובה הגנה
• 8+: קיצוני - הישארו בצל

🛡️ הגנה: קרם SPF 30+, כובע, משקפיים`;

export function UVIndexCard({ uvIndex, isDark = false }: UVIndexCardProps) {
  const getUVInfo = (uv: number) => {
    if (uv <= 2) return { label: 'נמוך', color: '#22C55E', risk: 'סיכון נמוך' };
    if (uv <= 5) return { label: 'בינוני', color: '#EAB308', risk: 'סיכון בינוני' };
    if (uv <= 7) return { label: 'גבוה', color: '#F97316', risk: 'סיכון גבוה' };
    if (uv <= 10) return { label: 'גבוה מאוד', color: '#EF4444', risk: 'סיכון גבוה מאוד' };
    return { label: 'קיצוני', color: '#7C3AED', risk: 'סיכון קיצוני' };
  };

  const info = getUVInfo(uvIndex);
  const angle = Math.min(180, uvIndex / 11 * 180);

  return (
    <div data-ev-id="ev_ef0b742ed1" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-amber-400/30">
      <div data-ev-id="ev_c9a38c20a8" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-amber-500/20 blur-2xl" />
      
      <div data-ev-id="ev_83723f34a1" className="relative z-10">
        <div data-ev-id="ev_96eb7c5661" className="flex items-center justify-between mb-4">
          <div data-ev-id="ev_952ae2f45b" className="flex items-center gap-2">
            <div data-ev-id="ev_7a6f076147" className="p-2 rounded-lg bg-white/20">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span data-ev-id="ev_be05eddf20" className="text-white/80 text-sm font-medium">מדד UV</span>
          </div>
          <InfoTooltip title="קרינת UV" content={UV_INDEX_INFO} />
        </div>
        
        {/* Semi-circle gauge */}
        <div data-ev-id="ev_a9a05f6624" className="relative w-full h-24 flex justify-center">
          <svg data-ev-id="ev_54e9501359" viewBox="0 0 200 100" className="w-full max-w-[180px]">
            {/* Background segments */}
            <path data-ev-id="ev_92c192d4bb" d="M 20 90 A 70 70 0 0 1 56 34" stroke="#22C55E" strokeWidth="16" fill="none" strokeLinecap="round" />
            <path data-ev-id="ev_4372448d4a" d="M 60 30 A 70 70 0 0 1 100 20" stroke="#EAB308" strokeWidth="16" fill="none" />
            <path data-ev-id="ev_c502090ece" d="M 100 20 A 70 70 0 0 1 140 30" stroke="#F97316" strokeWidth="16" fill="none" />
            <path data-ev-id="ev_aa5d2fa1c6" d="M 144 34 A 70 70 0 0 1 170 60" stroke="#EF4444" strokeWidth="16" fill="none" />
            <path data-ev-id="ev_675f8ae5d1" d="M 172 65 A 70 70 0 0 1 180 90" stroke="#7C3AED" strokeWidth="16" fill="none" strokeLinecap="round" />
            
            {/* Needle */}
            <g data-ev-id="ev_198703dccc" transform={`rotate(${angle - 90}, 100, 90)`}>
              <line data-ev-id="ev_2df59ee2d4" x1="100" y1="90" x2="100" y2="35" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <circle data-ev-id="ev_124b028fc3" cx="100" cy="90" r="8" fill="white" />
            </g>
            
            {/* Scale labels */}
            <text data-ev-id="ev_4f3f12c345" x="15" y="98" fill="white" fontSize="10" opacity="0.7">0</text>
            <text data-ev-id="ev_d874ae0864" x="50" y="30" fill="white" fontSize="10" opacity="0.7">3</text>
            <text data-ev-id="ev_a26ee64c55" x="97" y="15" fill="white" fontSize="10" opacity="0.7">6</text>
            <text data-ev-id="ev_337b0e810b" x="145" y="30" fill="white" fontSize="10" opacity="0.7">8</text>
            <text data-ev-id="ev_4bec525c9a" x="178" y="98" fill="white" fontSize="10" opacity="0.7">11+</text>
          </svg>
        </div>
        
        {/* Value and status */}
        <div data-ev-id="ev_963d750389" className="text-center mt-2" dir="rtl">
          <div data-ev-id="ev_e5d027a1dd" className="text-4xl font-bold text-white" dir="ltr">
            {uvIndex}
          </div>
          <div data-ev-id="ev_b2b00067d3" className="flex items-center justify-center gap-2 mt-2">
            <span data-ev-id="ev_aa64efc985"
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ background: info.color }}>

              {info.label}
            </span>
          </div>
          <p data-ev-id="ev_19334d433a" className="text-white/60 text-xs mt-2">{info.risk}</p>
        </div>
      </div>
    </div>);

}