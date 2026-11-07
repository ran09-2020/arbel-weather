import { useState, useMemo, useEffect } from 'react';
import { Archive, Search, LineChart, BarChart3, Thermometer, Droplets, CloudRain, Gauge, GitCompare, Trophy } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { TalComparison } from '@/components/TalComparison';
import { TalRecords } from '@/components/TalRecords';

const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';
type Tab = 'reports' | 'charts' | 'compare' | 'records';

function formatDateLabel(dateStr: string, range: TimeRange): string {
  const date = new Date(dateStr);
  if (range === 'daily') {
    return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  }
  if (range === 'weekly') {
    return date.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric' });
  }
  if (range === 'monthly') {
    return date.toLocaleDateString('he-IL', { day: 'numeric' });
  }
  return date.toLocaleDateString('he-IL', { month: 'short' });
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#efeae2] dark:bg-[#0b141a] p-3 rounded-lg shadow-lg border border-[#25D366]/30 text-right">
      <p className="font-medium text-[#128C7E] dark:text-[#00a884] mb-2">{label}</p>
      {payload.map((entry: any, index: number) => {
        const isGradient = entry.color?.includes('url');
        return (
          <p 
            key={index} 
            style={isGradient ? undefined : { color: entry.color }} 
            className={`text-sm font-medium ${isGradient ? 'text-[#128C7E] dark:text-[#25D366]' : ''}`}
          >
            {entry.name}: {entry.value !== null && entry.value !== undefined ? `${entry.value.toFixed(1)}${entry.unit || ''}` : 'אין נתונים'}
          </p>
        );
      })}
    </div>
  );
}

function ChartCard({ title, icon, children }: {title: string;icon: React.ReactNode;children: React.ReactNode;}) {
  return (
    <div className="w-full backdrop-blur-sm rounded-none sm:rounded-2xl p-2 sm:p-4 shadow-none sm:shadow-lg border-0 sm:border bg-white/90 dark:bg-[#111b21]/90 border-[#25D366]/30">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        {icon}
        <h3 className="text-base sm:text-lg font-semibold text-[#128C7E] dark:text-[#00a884]">{title}</h3>
      </div>
      <div className="h-52 sm:h-64 flex items-center justify-center" dir="ltr">
        {children}
      </div>
    </div>
  );
}

export default function TalHistory() {
  const { isDark } = useThemeContext();
  const [talData, setTalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<Tab>('records');
  const [hasSearched, setHasSearched] = useState(false);
  
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [compareMode, setCompareMode] = useState<'month' | 'year'>('month');
  const [compareMonth, setCompareMonth] = useState<number>(new Date().getMonth());
  const [compareYear1, setCompareYear1] = useState<number>(new Date().getFullYear() - 1);
  const [compareYear2, setCompareYear2] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    // Adding a random query param so the browser never caches an old version of the JSON
    fetch(`/arbel-weather/tal-history.json?v=${new Date().getTime()}`)
      .then(res => res.json())
      .then(json => {
        setTalData(json);
        if (json.length > 0) {
          const lastRecord = json[json.length - 1];
          const lastDate = new Date(lastRecord.time);
          setSelectedMonth(lastDate.getMonth());
          setSelectedYear(lastDate.getFullYear());
          setCompareMonth(lastDate.getMonth());
          setCompareYear2(lastDate.getFullYear());
          setCompareYear1(lastDate.getFullYear() - 1);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load Tal's diary:", err);
        setLoading(false);
      });
  }, []);

  const getDateRange = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (timeRange) {
      case 'daily':
        start = new Date(selectedDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(selectedDate);
        end.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        start = new Date(selectedDate);
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        end = new Date(selectedDate);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        start = new Date(selectedYear, selectedMonth, 1);
        end = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
        break;
      case 'yearly':
        start = new Date(selectedYear, 0, 1);
        end = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = new Date();
        end = new Date();
    }
    if (end > now) {
      end = now;
    }
    return { start, end };
  }, [timeRange, selectedDate, selectedMonth, selectedYear]);

  const filteredData = useMemo(() => {
    if (!hasSearched || talData.length === 0) return [];
    const { start, end } = getDateRange;
    return talData.filter(obs => {
      const d = new Date(obs.time);
      return d >= start && d <= end;
    });
  }, [hasSearched, talData, getDateRange]);

  const summarizedData = useMemo(() => {
    if (timeRange === 'daily') {
      return filteredData.map(obs => ({
        ...obs,
        date: obs.time,
        label: formatDateLabel(obs.time, timeRange),
        tempHigh: obs.temp,
        tempLow: obs.temp,
        tempAvg: obs.temp,
      }));
    }

    const grouped = new Map<string, any[]>();
    filteredData.forEach(obs => {
      const d = new Date(obs.time);
      const key = timeRange === 'yearly' 
        ? `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-01`
        : `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(obs);
    });

    const summarized = Array.from(grouped.entries()).map(([dateStr, items]) => {
      const temps = items.map(i => i.temp).filter(t => t !== null && t !== undefined);
      const hums = items.map(i => i.humidity).filter(h => h !== null && h !== undefined);
      const precips = items.map(i => i.precip).filter(p => p !== null && p !== undefined);
      const pressures = items.map(i => i.pressure).filter(p => p !== null && p !== undefined);

      return {
        date: dateStr,
        label: formatDateLabel(dateStr, timeRange),
        tempHigh: temps.length ? Math.max(...temps) : null,
        tempLow: temps.length ? Math.min(...temps) : null,
        tempAvg: temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null,
        humidity: hums.length ? hums.reduce((a, b) => a + b, 0) / hums.length : null,
        precip: precips.length ? precips.reduce((a, b) => a + b, 0) : null,
        pressure: pressures.length ? Math.max(...pressures) : null,
      };
    });

    return summarized.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredData, timeRange]);

  // Report specific aggregations
  const reportStats = useMemo(() => {
    if (filteredData.length === 0) return null;
    
    const temps = filteredData.map(i => i.temp).filter(t => t !== null && t !== undefined);
    const hums = filteredData.map(i => i.humidity).filter(h => h !== null && h !== undefined);
    const precips = filteredData.map(i => i.precip).filter(p => p !== null && p !== undefined);
    
    let hotDays = 0;
    let coldDays = 0;
    
    // For hot/cold days, we need daily max/min
    const dailyMap = new Map<string, number[]>();
    filteredData.forEach(obs => {
      if (obs.temp === null || obs.temp === undefined) return;
      const d = new Date(obs.time);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!dailyMap.has(key)) dailyMap.set(key, []);
      dailyMap.get(key)!.push(obs.temp);
    });
    
    dailyMap.forEach(dayTemps => {
      const max = Math.max(...dayTemps);
      const min = Math.min(...dayTemps);
      if (max >= 30) hotDays++;
      if (min <= 10) coldDays++;
    });

    return {
      tempHigh: temps.length ? Math.max(...temps) : null,
      tempLow: temps.length ? Math.min(...temps) : null,
      tempAvg: temps.length ? temps.reduce((a, b) => a + b, 0) / temps.length : null,
      humHigh: hums.length ? Math.max(...hums) : null,
      humLow: hums.length ? Math.min(...hums) : null,
      humAvg: hums.length ? hums.reduce((a, b) => a + b, 0) / hums.length : null,
      totalPrecip: precips.length ? precips.reduce((a, b) => a + b, 0) : 0,
      hotDays,
      coldDays,
      daysCount: dailyMap.size
    };
  }, [filteredData]);

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 2020; y--) {
    yearOptions.push(y);
  }

  const handleSearch = () => {
    setHasSearched(true);
  };

  const axisStyle = {
    fontSize: 11,
    fill: isDark ? '#94a3b8' : '#64748b'
  };

  const gridStyle = {
    strokeDasharray: '3 3',
    stroke: isDark ? '#2a3942' : '#d1d5db'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0b141a]' : 'bg-[#efeae2]'}`} dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#25D366] dark:bg-[#1f2c34] shadow-md border-b border-[#128C7E]/20 dark:border-black/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-3 w-full md:w-auto justify-start">
            <Link to="/" className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors shrink-0">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white flex items-center gap-2 whitespace-nowrap">
              <Archive className="w-6 h-6 shrink-0" />
              היומן של טל
            </h1>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-2 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
                activeTab === 'charts' 
                  ? 'bg-white text-[#128C7E] dark:bg-[#00a884] dark:text-white' 
                  : 'bg-transparent text-white border border-white/40 hover:bg-white/10'
              }`}
            >
              <LineChart className="w-4 h-4 inline-block mr-1" />
              גרפים
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
                activeTab === 'reports' 
                  ? 'bg-white text-[#128C7E] dark:bg-[#00a884] dark:text-white' 
                  : 'bg-transparent text-white border border-white/40 hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-1" />
              דוחות
            </button>
            <button 
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
                activeTab === 'compare' 
                  ? 'bg-white text-[#128C7E] dark:bg-[#00a884] dark:text-white' 
                  : 'bg-transparent text-white border border-white/40 hover:bg-white/10'
              }`}
            >
              <GitCompare className="w-4 h-4 inline-block mr-1" />
              השוואה
            </button>
            <button 
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
                activeTab === 'records' 
                  ? 'bg-white text-[#128C7E] dark:bg-[#00a884] dark:text-white' 
                  : 'bg-transparent text-white border border-white/40 hover:bg-white/10'
              }`}
            >
              <Trophy className="w-4 h-4 inline-block mr-1" />
              שיאים
            </button>
          </div>
        </div>
      </header>

      <main className="py-6 max-w-7xl mx-auto px-4">
        {/* Date Selector Card */}
        {activeTab === 'charts' || activeTab === 'reports' ? (
        <div className="bg-white dark:bg-[#111b21] rounded-2xl shadow-sm border border-[#25D366]/20 p-4 sm:p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            
            <div className="flex flex-wrap justify-center items-center gap-2 bg-[#efeae2] dark:bg-[#202c33] rounded-xl p-1">
              {[
                { key: 'daily', label: 'יומי' },
                { key: 'weekly', label: 'שבועי' },
                { key: 'monthly', label: 'חודשי' },
                { key: 'yearly', label: 'שנתי' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setTimeRange(key as TimeRange); setHasSearched(false); }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    timeRange === key 
                      ? 'bg-[#25D366] text-white shadow-sm' 
                      : 'text-[#128C7E] dark:text-[#8696a0] hover:bg-white/50 dark:hover:bg-[#2a3942]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2">
              {(timeRange === 'daily' || timeRange === 'weekly') && (
                <input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setSelectedDate(new Date(e.target.value)); setHasSearched(false); }}
                  className="bg-[#efeae2] dark:bg-[#202c33] border-none text-[#128C7E] dark:text-[#d1d7db] rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-[#25D366]"
                />
              )}
              {timeRange === 'monthly' && (
                <>
                  <select
                    value={selectedMonth}
                    onChange={(e) => { setSelectedMonth(Number(e.target.value)); setHasSearched(false); }}
                    className="bg-[#efeae2] dark:bg-[#202c33] border-none text-[#128C7E] dark:text-[#d1d7db] rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-[#25D366]"
                  >
                    {hebrewMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => { setSelectedYear(Number(e.target.value)); setHasSearched(false); }}
                    className="bg-[#efeae2] dark:bg-[#202c33] border-none text-[#128C7E] dark:text-[#d1d7db] rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-[#25D366]"
                  >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </>
              )}
              {timeRange === 'yearly' && (
                <select
                  value={selectedYear}
                  onChange={(e) => { setSelectedYear(Number(e.target.value)); setHasSearched(false); }}
                  className="bg-[#efeae2] dark:bg-[#202c33] border-none text-[#128C7E] dark:text-[#d1d7db] rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-[#25D366]"
                >
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              הצג נתונים
            </button>

          </div>
        </div>
        ) : activeTab === 'compare' ? (
        <div className="bg-white dark:bg-[#111b21] rounded-2xl shadow-sm border border-[#25D366]/20 p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-4 justify-center">
            <div className="flex flex-wrap justify-center items-center gap-2 bg-[#efeae2] dark:bg-[#202c33] rounded-xl p-1 w-full sm:w-auto">
              <button
                onClick={() => setCompareMode('month')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  compareMode === 'month' ? 'bg-[#25D366] text-white shadow-sm' : 'text-[#128C7E] dark:text-[#8696a0] hover:bg-white/50 dark:hover:bg-[#2a3942]'
                }`}
              >
                חודשים מקבילים
              </button>
              <button
                onClick={() => setCompareMode('year')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  compareMode === 'year' ? 'bg-[#25D366] text-white shadow-sm' : 'text-[#128C7E] dark:text-[#8696a0] hover:bg-white/50 dark:hover:bg-[#2a3942]'
                }`}
              >
                השוואת שנים מלאות
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto">
              {compareMode === 'month' && (
                <select
                  value={compareMonth}
                  onChange={(e) => setCompareMonth(Number(e.target.value))}
                  className="bg-[#efeae2] dark:bg-[#202c33] border-none text-[#128C7E] dark:text-[#d1d7db] rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-[#25D366]"
                >
                  {hebrewMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
              )}
              
              <div className="flex items-center gap-2 px-2 bg-white/50 dark:bg-black/20 rounded-lg p-1 border border-[#25D366]/30">
                <select
                  value={compareYear1}
                  onChange={(e) => setCompareYear1(Number(e.target.value))}
                  className="bg-transparent border-none text-slate-700 dark:text-slate-300 font-bold focus:ring-0 cursor-pointer"
                >
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <span className="text-sm font-bold text-[#25D366]">VS</span>
                <select
                  value={compareYear2}
                  onChange={(e) => setCompareYear2(Number(e.target.value))}
                  className="bg-transparent border-none text-slate-700 dark:text-slate-300 font-bold focus:ring-0 cursor-pointer"
                >
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        ) : null}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#25D366] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#128C7E] dark:text-[#8696a0]">טוען את היומן של טל...</p>
          </div>
        )}

        {/* Unsearched State */}
        {!loading && !hasSearched && (activeTab === 'charts' || activeTab === 'reports') && (
          <div className="text-center py-32 bg-white/50 dark:bg-[#111b21]/50 rounded-2xl border border-[#25D366]/20">
            <Archive className="w-16 h-16 text-[#25D366]/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#128C7E] dark:text-[#d1d7db] mb-2">מוכן לחיפוש</h2>
            <p className="text-[#128C7E]/70 dark:text-[#8696a0]">בחר את התאריכים הרצויים ולחץ על "הצג נתונים"</p>
          </div>
        )}

        {/* Comparison View */}
        {!loading && activeTab === 'compare' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TalComparison 
              talData={talData} 
              compareMode={compareMode} 
              month={compareMonth} 
              year1={compareYear1} 
              year2={compareYear2} 
            />
          </div>
        )}

        {/* Records View */}
        {!loading && activeTab === 'records' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TalRecords talData={talData} />
          </div>
        )}

        {/* No Data State */}
        {!loading && hasSearched && summarizedData.length === 0 && (activeTab === 'charts' || activeTab === 'reports') && (
          <div className="text-center py-32 bg-white/50 dark:bg-[#111b21]/50 rounded-2xl border border-red-500/20">
            <p className="text-red-500 font-bold text-lg">לא נמצאו נתונים לתאריכים שנבחרו.</p>
          </div>
        )}

        {/* Data Views */}
        {!loading && hasSearched && summarizedData.length > 0 && (activeTab === 'charts' || activeTab === 'reports') && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'charts' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ChartCard title="טמפרטורה" icon={<Thermometer className="w-5 h-5 text-[#ef4444]" />}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={summarizedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="tempHighGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="tempLowGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="label" tick={axisStyle} />
                      <YAxis tick={axisStyle} unit="°" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="tempHigh" name="מקסימום" stroke="#ef4444" fill="url(#tempHighGrad)" strokeWidth={2} unit="°C" />
                      <Area type="monotone" dataKey="tempLow" name="מינימום" stroke="#3b82f6" fill="url(#tempLowGrad)" strokeWidth={2} unit="°C" />
                      <Line type="monotone" dataKey="tempAvg" name="ממוצע" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} unit="°C" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="לחות" icon={<Droplets className="w-5 h-5 text-[#06b6d4]" />}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={summarizedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="label" tick={axisStyle} />
                      <YAxis tick={axisStyle} unit="%" domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="humidity" name="לחות" stroke="#06b6d4" fill="url(#humGrad)" strokeWidth={2} unit="%" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="משקעים" icon={<CloudRain className="w-5 h-5 text-[#3b82f6]" />}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summarizedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#25D366" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#128C7E" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="label" tick={axisStyle} />
                      <YAxis tick={axisStyle} unit=" מ״מ" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="precip" name="משקעים" fill="url(#rainGrad)" radius={[4, 4, 0, 0]} unit=" מ״מ" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="לחץ אטמוספרי" icon={<Gauge className="w-5 h-5 text-[#f97316]" />}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={summarizedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="label" tick={axisStyle} />
                      <YAxis tick={axisStyle} unit=" hPa" domain={['auto', 'auto']} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="pressure" name="לחץ" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} unit=" hPa" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111b21] rounded-2xl shadow-sm border border-[#25D366]/20 p-6">
                <h2 className="text-2xl font-bold text-[#128C7E] dark:text-[#00a884] mb-6 text-center border-b border-[#25D366]/20 pb-4">
                  סיכום דוח יומן התחנה
                </h2>
                
                {reportStats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Temp Report */}
                    <div className="bg-[#efeae2]/50 dark:bg-[#202c33]/50 rounded-xl p-4 border border-orange-500/20">
                      <h3 className="text-lg font-bold text-orange-500 dark:text-orange-400 mb-4 flex items-center gap-2">
                        <Thermometer className="w-5 h-5" /> טמפרטורה
                      </h3>
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-2">
                          <div className="text-xs text-[#128C7E] dark:text-[#8696a0]">מקסימום</div>
                          <div className="text-xl font-bold text-red-500">{reportStats.tempHigh?.toFixed(1) ?? '--'}°</div>
                        </div>
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-2">
                          <div className="text-xs text-[#128C7E] dark:text-[#8696a0]">מינימום</div>
                          <div className="text-xl font-bold text-blue-500">{reportStats.tempLow?.toFixed(1) ?? '--'}°</div>
                        </div>
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-2">
                          <div className="text-xs text-[#128C7E] dark:text-[#8696a0]">ממוצע</div>
                          <div className="text-xl font-bold text-orange-500">{reportStats.tempAvg?.toFixed(1) ?? '--'}°</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm bg-white dark:bg-[#111b21] rounded-lg p-3">
                        <span className="text-red-500 font-medium">🔥 {reportStats.hotDays} ימים מעל 30°</span>
                        <span className="text-blue-500 font-medium">❄️ {reportStats.coldDays} ימים מתחת ל-10°</span>
                      </div>
                    </div>

                    {/* Precip Report */}
                    <div className="bg-[#efeae2]/50 dark:bg-[#202c33]/50 rounded-xl p-4 border border-[#25D366]/30">
                      <h3 className="text-lg font-bold text-[#128C7E] dark:text-[#25D366] mb-4 flex items-center gap-2">
                        <CloudRain className="w-5 h-5" /> משקעים ולחות
                      </h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-4 text-center">
                          <div className="text-sm text-[#128C7E] dark:text-[#8696a0] mb-1">סה"כ גשם לתקופה</div>
                          <div className="text-3xl font-bold text-[#00a884]">{reportStats.totalPrecip.toFixed(1)} <span className="text-lg">מ"מ</span></div>
                        </div>
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-4 text-center">
                          <div className="text-sm text-[#128C7E] dark:text-[#8696a0] mb-1">מספר ימי נתונים</div>
                          <div className="text-3xl font-bold text-[#128C7E] dark:text-[#d1d7db]">{reportStats.daysCount}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-2">
                          <div className="text-xs text-[#128C7E] dark:text-[#8696a0]">לחות מקס'</div>
                          <div className="text-lg font-bold text-[#06b6d4]">{reportStats.humHigh?.toFixed(0) ?? '--'}%</div>
                        </div>
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-2">
                          <div className="text-xs text-[#128C7E] dark:text-[#8696a0]">לחות מינ'</div>
                          <div className="text-lg font-bold text-[#06b6d4]">{reportStats.humLow?.toFixed(0) ?? '--'}%</div>
                        </div>
                        <div className="bg-white dark:bg-[#111b21] rounded-lg p-2">
                          <div className="text-xs text-[#128C7E] dark:text-[#8696a0]">לחות ממוצעת</div>
                          <div className="text-lg font-bold text-[#06b6d4]">{reportStats.humAvg?.toFixed(0) ?? '--'}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
