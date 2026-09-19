import { CloudRain } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';

interface RainGaugeCardProps {
  totalToday: number;
  isDark?: boolean;
}

const TOTAL_RAIN_INFO = `כמות הגשם שנצברה היום, במילימטרים.

🌧️ כמויות:
• 0-2 מ"מ: טפטוף קל
• 2-10 מ"מ: גשם קל
• 10-30 מ"מ: בינוני
• מעל 30 מ"מ: כבד

💡 מ"מ אחד = ליטר לכל מ"ר`;

// Calculate dynamic scale based on rainfall amount
function getScaleConfig(value: number): {max: number;marks: number[];} {
  if (value <= 10) return { max: 10, marks: [0, 2, 4, 6, 8, 10] };
  if (value <= 20) return { max: 20, marks: [0, 5, 10, 15, 20] };
  if (value <= 50) return { max: 50, marks: [0, 10, 20, 30, 40, 50] };
  if (value <= 100) return { max: 100, marks: [0, 25, 50, 75, 100] };
  return { max: 200, marks: [0, 50, 100, 150, 200] };
}

export function RainGaugeCard({ totalToday, isDark = false }: RainGaugeCardProps) {
  const { max: dynamicMax, marks: scaleMarks } = getScaleConfig(totalToday);
  const totalPercentage = Math.min(100, totalToday / dynamicMax * 100);

  return (
    <div data-ev-id="ev_1bc2c129ac" className="relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-slate-800/90 backdrop-blur-xl border border-violet-400/30">
      <div data-ev-id="ev_f8bc9208f0" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-violet-500/20 blur-2xl" />
      
      <div data-ev-id="ev_84254f78dd" className="relative z-10">
        <div data-ev-id="ev_4cb665f22e" className="flex items-center justify-between mb-4">
          <div data-ev-id="ev_f90c29167c" className="flex items-center gap-2">
            <div data-ev-id="ev_e247af3ed3" className="p-2 rounded-lg bg-white/20">
              <CloudRain className="w-5 h-5 text-white" />
            </div>
            <span data-ev-id="ev_ca94199b66" className="text-white/80 text-sm font-medium">סה״כ משקעים</span>
          </div>
          <InfoTooltip title="סה״כ משקעים" content={TOTAL_RAIN_INFO} />
        </div>
        
        <div data-ev-id="ev_d7b535cf0b" className="flex items-center gap-6">
          {/* Rain Gauge Tube */}
          <div data-ev-id="ev_597f8910b5" className="flex flex-col items-center">
            <div data-ev-id="ev_f052b19354" className="relative">
              {/* Glass tube */}
              <div data-ev-id="ev_958ddb6e55" className="relative w-14 h-36 bg-white/10 rounded-b-xl rounded-t-sm border-2 border-white/30 overflow-hidden">
                {/* Scale marks with labels */}
                {scaleMarks.map((mark) => {
                  const pos = mark / dynamicMax * 100;
                  return (
                    <div data-ev-id="ev_4f8bdf5416"
                    key={mark}
                    className="absolute left-0 right-0 flex items-center"
                    style={{ bottom: `${pos}%` }}>

                      <div data-ev-id="ev_9977f15c6d" className="w-3 h-px bg-white/50" />
                      <span data-ev-id="ev_266b330ce0" className="text-[9px] text-white/60 mr-0.5 font-medium">{mark}</span>
                    </div>);

                })}
                
                {/* Current value indicator line */}
                {totalToday > 0 &&
                <div data-ev-id="ev_eed010a485"
                className="absolute left-0 right-0 flex items-center z-20"
                style={{ bottom: `${totalPercentage}%` }}>
                    <div data-ev-id="ev_596a4ed9d7" className="w-full h-0.5 bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
                  </div>
                }
                
                {/* Water fill */}
                <div data-ev-id="ev_373aa441db"
                className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
                style={{
                  height: `${totalPercentage}%`,
                  background: 'linear-gradient(to top, #8B5CF6, #A78BFA, #C4B5FD)'
                }}>

                  {/* Wave effect */}
                  <div data-ev-id="ev_0b8ec05977" className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
                    <svg data-ev-id="ev_25d9a59e37" viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                      <path data-ev-id="ev_c9730b8545"
                      d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z"
                      fill="rgba(255,255,255,0.3)"
                      className="animate-pulse" />

                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Base */}
              <div data-ev-id="ev_9455a279f4" className="w-16 h-3 bg-white/20 rounded-b-lg -mt-px" style={{ marginLeft: '-4px' }} />
            </div>
          </div>
          
          {/* Values */}
          <div data-ev-id="ev_b783eba5b8" className="flex-1" dir="rtl">
            <div data-ev-id="ev_2b2998a3a7" className="text-4xl font-bold text-white mb-1">
              <span data-ev-id="ev_ce86d3c517" dir="ltr">{totalToday.toFixed(1)}</span>
              <span data-ev-id="ev_5c97aca6ad" className="text-xl text-white/70 mr-1"> מ״מ</span>
            </div>
            <p data-ev-id="ev_916946f0be" className="text-white/60 text-sm">סה״כ היום</p>
            
            {/* Mini bar indicator */}
            <div data-ev-id="ev_69d42e8f6e" className="mt-4">
              <div data-ev-id="ev_943489e461" className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div data-ev-id="ev_4e68ed1b62"
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-700"
                style={{ width: `${totalPercentage}%` }} />

              </div>
              <div data-ev-id="ev_d66f8cfce5" className="flex justify-between mt-1 text-xs text-white/40">
                <span data-ev-id="ev_607f36d69b">0</span>
                <span data-ev-id="ev_81d7ef44ad"><span data-ev-id="ev_1089af1a60" dir="ltr">{dynamicMax}</span> מ״מ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}