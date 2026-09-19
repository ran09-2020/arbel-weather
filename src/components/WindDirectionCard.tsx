import { Navigation } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface WindDirectionCardProps {
  degrees: number | null;
  isDark?: boolean;
}

const WIND_DIRECTION_INFO = `מאיפה הרוח נושבת (0°-360°).

🧭 כיוונים:
• צ: 0° • מ: 90°
• ד: 180° • מע: 270°

🌊 בישראל:
• מערבית - מהים, לחה
• מזרחית - מהמדבר, יבשה

💡 החץ מצביע לכיוון הרוח`;

function getWindDirectionHebrew(degrees: number | null): {short: string;full: string;} {
  if (degrees === null) return { short: '--', full: '' };

  const directions = [
  { short: 'צ', full: 'צפון' },
  { short: 'צמ', full: 'צפון-מזרח' },
  { short: 'מ', full: 'מזרח' },
  { short: 'דמ', full: 'דרום-מזרח' },
  { short: 'ד', full: 'דרום' },
  { short: 'דמע', full: 'דרום-מערב' },
  { short: 'מע', full: 'מערב' },
  { short: 'צמע', full: 'צפון-מערב' }];


  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function WindDirectionCard({ degrees, isDark = false }: WindDirectionCardProps) {
  const direction = getWindDirectionHebrew(degrees);

  return (
    <div data-ev-id="ev_acf904c5ca" className="relative overflow-hidden rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-800/90 backdrop-blur-xl border border-cyan-400/30">
      {/* Background decoration */}
      <div data-ev-id="ev_b83f78a554" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-cyan-500/20 blur-2xl" />
      <div data-ev-id="ev_060f9cf31d" className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-cyan-500/10 blur-xl" />
      
      <div data-ev-id="ev_3dec944b17" className="relative z-10">
        <div data-ev-id="ev_5e96db677c" className="flex items-center justify-between mb-2">
          <div data-ev-id="ev_177e68f57c" className="flex items-center gap-2">
            <div data-ev-id="ev_f86533f650" className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <Navigation
                className="w-5 h-5 text-white transition-transform duration-500"
                style={{ transform: degrees !== null ? `rotate(${degrees}deg)` : 'rotate(0deg)' }} />
            </div>
            <span data-ev-id="ev_ff64ec8334" className="text-white/80 text-sm font-medium">כיוון רוח</span>
          </div>
          <div data-ev-id="ev_2924538e52" className="flex items-center gap-2">
            {direction.full &&
            <span data-ev-id="ev_9376063694" className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/30 text-white">
                {direction.full}
              </span>
            }
            <InfoTooltip title="כיוון רוח" content={WIND_DIRECTION_INFO} />
          </div>
        </div>
        
        {/* Compass visual indicator */}
        <div data-ev-id="ev_4506a75f3f" className="flex justify-center">
          <div data-ev-id="ev_839a9c01ff" className="relative w-40 h-40">
            {/* Outer ring with azimuth numbers */}
            <div data-ev-id="ev_e970483bfa" className="absolute inset-0 rounded-full">
              {/* Azimuth numbers */}
              <span data-ev-id="ev_5d37b1e943" className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-yellow-300 font-bold">0°</span>
              <span data-ev-id="ev_032f592882" className="absolute top-2 right-2 text-[9px] text-white/60">45°</span>
              <span data-ev-id="ev_eaa36cae70" className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-white/80 font-medium">90°</span>
              <span data-ev-id="ev_efac850636" className="absolute bottom-2 right-2 text-[9px] text-white/60">135°</span>
              <span data-ev-id="ev_f5f8855a5e" className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] text-white/80 font-medium">180°</span>
              <span data-ev-id="ev_2c94ac9165" className="absolute bottom-2 left-2 text-[9px] text-white/60">225°</span>
              <span data-ev-id="ev_262779dfe9" className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-white/80 font-medium">270°</span>
              <span data-ev-id="ev_84d93068e6" className="absolute top-2 left-2 text-[9px] text-white/60">315°</span>
            </div>
            {/* Compass circle */}
            <div data-ev-id="ev_4afb7dc75f" className="absolute inset-3 rounded-full border-[3px] border-white/30" />
            {/* Inner circle */}
            <div data-ev-id="ev_5db9adae51" className="absolute inset-6 rounded-full border border-white/20" />
            {/* Tick marks */}
            {[...Array(36)].map((_, i) => {
              const angle = i * 10;
              const isMain = i % 9 === 0;
              const isMid = i % 9 === 4 || i % 9 === 5;
              return (
                <div data-ev-id="ev_a1cc6ab7df"
                key={i}
                className="absolute top-1/2 left-1/2 origin-center"
                style={{
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  width: 'calc(100% - 24px)',
                  height: 'calc(100% - 24px)'
                }}>

                  <div data-ev-id="ev_f0bba2d3a2"
                  className={`absolute top-0 left-1/2 -translate-x-1/2 bg-white/50 ${isMain ? 'w-0.5 h-2' : isMid ? 'w-px h-1.5' : 'w-px h-1'}`} />

                </div>);

            })}
            {/* Direction markers */}
            <span data-ev-id="ev_9337b92668" className="absolute top-6 left-1/2 -translate-x-1/2 text-sm text-white font-bold">צ</span>
            <span data-ev-id="ev_5d8516cb34" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white font-bold">ד</span>
            <span data-ev-id="ev_56b86d6470" className="absolute left-6 top-1/2 -translate-y-1/2 text-sm text-white font-bold">מע</span>
            <span data-ev-id="ev_3056b79b94" className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-white font-bold">מ</span>
            {/* Pointer */}
            <div data-ev-id="ev_725342ec62"
            className="absolute inset-3 flex items-center justify-center transition-transform duration-500"
            style={{ transform: degrees !== null ? `rotate(${degrees}deg)` : 'rotate(0deg)' }}>
              <svg data-ev-id="ev_cbd6dc0f9c" viewBox="0 0 100 100" className="w-full h-full">
                {/* Long arrow pointing up (north) */}
                <polygon data-ev-id="ev_bf17668894"
                points="50,12 46,50 50,46 54,50"
                fill="#EF4444"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />

                {/* Short tail */}
                <polygon data-ev-id="ev_85cad96f39"
                points="50,88 46,50 50,54 54,50"
                fill="rgba(255,255,255,0.5)" />

              </svg>
            </div>
            {/* Center dot */}
            <div data-ev-id="ev_b60a255d0d" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-200" />
          </div>
        </div>
        
        {/* Value display */}
        <div data-ev-id="ev_f3ae5beb06" className="text-center mt-2">
          <span data-ev-id="ev_26677cb301" className="text-2xl font-bold text-white">{degrees !== null ? `${degrees}°` : '--'}</span>
        </div>
      </div>
    </div>);

}