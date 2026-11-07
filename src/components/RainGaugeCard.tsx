import { useState } from 'react';
import { CloudRain, Edit2, X, Check, RotateCcw, Lock } from 'lucide-react';
import { InfoTooltip } from './InfoTooltip';
import { saveRainOverride, clearRainOverride, getTodayDateKey } from '@/services/weatherService';

interface RainGaugeCardProps {
  totalToday: number;
  rawWuToday?: number | null;
  isOverridden?: boolean;
  obsDate?: string;
  onRainUpdated?: () => void;
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

export function RainGaugeCard({
  totalToday,
  rawWuToday,
  isOverridden = false,
  obsDate,
  onRainUpdated,
  isDark = false
}: RainGaugeCardProps) {
  const { max: dynamicMax, marks: scaleMarks } = getScaleConfig(totalToday);
  const totalPercentage = Math.min(100, totalToday / dynamicMax * 100);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('arbel_admin') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [rainInput, setRainInput] = useState(totalToday.toFixed(1));
  const [saving, setSaving] = useState(false);

  const handleOpenEdit = () => {
    setIsAdmin(localStorage.getItem('arbel_admin') === 'true');
    setRainInput(totalToday.toFixed(1));
    setPasswordError(false);
    setIsEditing(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'arbeladmin') {
      localStorage.setItem('arbel_admin', 'true');
      setIsAdmin(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const activeDateKey = obsDate ? obsDate.substring(0, 10) : getTodayDateKey();

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(rainInput);
    if (isNaN(parsed) || parsed < 0) return;

    setSaving(true);
    try {
      const wuBase = rawWuToday !== null && rawWuToday !== undefined ? rawWuToday : totalToday;
      await saveRainOverride(activeDateKey, parsed, wuBase);
      setIsEditing(false);
      onRainUpdated?.();
    } finally {
      setSaving(false);
    }
  };

  const handleResetOverride = async () => {
    setSaving(true);
    try {
      await clearRainOverride(activeDateKey);
      setIsEditing(false);
      onRainUpdated?.();
    } finally {
      setSaving(false);
    }
  };

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
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleOpenEdit}
              title="תיקון כמות גשם (מנהל)"
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <InfoTooltip title="סה״כ משקעים" content={TOTAL_RAIN_INFO} />
          </div>
        </div>

        {/* Admin Edit Overlay */}
        {isEditing && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900/95 border border-violet-400/40 text-white text-sm" dir="rtl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-violet-300 flex items-center gap-1.5">
                {isAdmin ? <Edit2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {isAdmin ? 'תיקון כמות גשם להיום' : 'כניסת מנהל'}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isAdmin ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-2">
                <input
                  type="password"
                  placeholder="סיסמת מנהל"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-violet-400"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-xs text-red-400">סיסמה שגויה</p>
                )}
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 font-bold text-white transition-colors"
                >
                  אישור
                </button>
              </form>
            ) : (
              <form onSubmit={handleSaveOverride} className="space-y-2.5">
                <div className="flex justify-between text-xs text-white/70 bg-white/5 px-2.5 py-1.5 rounded-lg">
                  <span>נתון WU כרגע: <strong dir="ltr">{(rawWuToday ?? totalToday).toFixed(1)}</strong> מ״מ</span>
                  <span>מוצג: <strong dir="ltr">{totalToday.toFixed(1)}</strong> מ״מ</span>
                </div>
                <div>
                  <label className="block text-xs text-white/80 mb-1">
                    כמות הגשם הנכונה כרגע (מ״מ):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    dir="ltr"
                    value={rainInput}
                    onChange={(e) => setRainInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-center focus:outline-none focus:border-violet-400"
                    autoFocus
                  />
                  <p className="text-[11px] text-white/50 mt-1">
                    הגשם שיירד ב-WU מעתה ימשיך להצטבר מעל הערך שתשמור.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 font-bold text-white flex items-center justify-center gap-1 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    {saving ? 'שומר...' : 'שמור'}
                  </button>
                  {isOverridden && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={handleResetOverride}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-500/30 text-white/80 hover:text-red-200 text-xs flex items-center gap-1 transition-colors"
                      title="חזרה לנתון המקורי מ-WU"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      איפוס ל-WU
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
        
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
                    <div
                    key={mark}
                    className="absolute left-0 right-0 flex items-center h-0"
                    style={{ bottom: `${pos}%` }}>
                      <div className={`w-3 h-px bg-white/50 ${pos === 0 || pos === 100 ? 'invisible' : ''}`} />
                      <span className="text-[9px] text-white/60 mr-0.5 font-medium" style={{
                        transform: pos === 0 ? 'translateY(-6px)' : pos === 100 ? 'translateY(6px)' : 'none'
                      }}>{mark}</span>
                    </div>
                  );
                })}
                
                {/* Current value indicator line */}
                {totalToday > 0 &&
                  <div
                  className="absolute left-0 right-0 flex items-center h-0 z-20"
                  style={{ bottom: `${totalPercentage}%` }}>
                    <div className="w-full h-0.5 bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]" />
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