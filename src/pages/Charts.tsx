import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRight, RefreshCw, Thermometer, Droplets, Wind, CloudRain, Gauge, Sun, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { fetchHistoricalRange, fetchDetailedDayData, HistoricalObservation, DetailedObservation } from '@/services/weatherService';
import { useThemeContext } from '@/contexts/ThemeContext';

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ChartDataPoint {
  date: string;
  label: string;
  tempHigh: number | null;
  tempLow: number | null;
  tempAvg: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windGust: number | null;
  precip: number | null;
  pressure: number | null;
  uv: number | null;
}

const hebrewMonths = [
'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];


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
  // yearly
  return date.toLocaleDateString('he-IL', { month: 'short' });
}

function ChartCard({ title, icon, isTal, children }: {title: string;icon: React.ReactNode;isTal?: boolean;children: React.ReactNode;}) {
  return (
    <div data-ev-id="ev_cde0a88b89" className="w-full backdrop-blur-sm rounded-none sm:rounded-2xl p-2 sm:p-4 shadow-none sm:shadow-lg border-0 sm:border bg-white/80 dark:bg-slate-800/80 border-white/20 dark:border-slate-700/50">
      <div data-ev-id="ev_718f3ee6a5" className="flex items-center gap-2 mb-3 sm:mb-4">
        {icon}
        <h3 data-ev-id="ev_0cf3fd60f3" className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">{title}</h3>
      </div>
      <div data-ev-id="ev_cb793073d4" className="h-52 sm:h-64 flex items-center justify-center" dir="ltr">
        {children}
      </div>
    </div>);

}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div data-ev-id="ev_91f189d8f6" className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-600 text-right">
      <p data-ev-id="ev_fc7e5d4355" className="font-medium text-slate-800 dark:text-white mb-2">{label}</p>
      {payload.map((entry: any, index: number) => {
        const isGradient = entry.color?.includes('url');
        return (
          <p 
            data-ev-id="ev_2a3e772ccf" 
            key={index} 
            style={isGradient ? undefined : { color: entry.color }} 
            className={`text-sm font-medium ${isGradient ? 'text-sky-600 dark:text-sky-300' : ''}`}
          >
            {entry.name}: {entry.value !== null ? `${entry.value.toFixed(1)}${entry.unit || ''}` : 'אין נתונים'}
          </p>
        );
      })}
    </div>);

}

export default function Charts() {
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [data, setData] = useState<HistoricalObservation[]>([]);
  const [detailedData, setDetailedData] = useState<DetailedObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDark } = useThemeContext();

  // Date selection state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Calculate date range based on selection
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
        // Start from selected date and go back 6 days
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

    // Don't go beyond today
    if (end > now) {
      end = now;
    }

    return { start, end };
  }, [timeRange, selectedDate, selectedMonth, selectedYear]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    setDetailedData([]);
    setData([]);

    try {
      if (timeRange === 'daily') {
        // For daily view, fetch detailed hourly data
        const dateStr = selectedDate.toISOString().split('T')[0].replace(/-/g, '');
        const result = await fetchDetailedDayData(dateStr);

        if (result.length === 0) {
          setError('לא נמצאו נתונים ליום שנבחר');
        } else {
          setDetailedData(result);
        }
      } else {
        // For weekly/monthly/yearly, fetch daily summaries
        const { start, end } = getDateRange;
        const result = await fetchHistoricalRange(start, end);

        if (result.length === 0) {
          setError('לא נמצאו נתונים לטווח הזמן שנבחר');
        } else {
          setData(result);
        }
      }
    } catch (err) {
      console.error('Error loading chart data:', err);
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange, selectedDate, selectedMonth, selectedYear]);

  // Adjust selected date if needed

  const chartData: ChartDataPoint[] = useMemo(() => {

    if (timeRange === 'daily' && detailedData.length > 0) {
      // Map detailed observations for hourly chart
      
      // Sort data first so delta calculation is chronological
      const sortedDetailed = [...detailedData].sort((a, b) => new Date(a.obsTimeLocal).getTime() - new Date(b.obsTimeLocal).getTime());
      
      let prevPrecipTotal = 0;
      
      return sortedDetailed.map((obs) => {
        const currentTotal = obs.metric?.precipTotal ?? 0;
        let incremental = null;
        if (currentTotal > 0) {
           incremental = Math.max(0, currentTotal - prevPrecipTotal);
        }
        // Only update prevPrecipTotal if current is valid
        if (obs.metric?.precipTotal !== undefined && obs.metric?.precipTotal !== null) {
           prevPrecipTotal = currentTotal;
        }

        return {
          date: obs.obsTimeLocal,
          label: formatDateLabel(obs.obsTimeLocal, timeRange),
          tempHigh: obs.metric?.tempHigh ?? obs.metric?.tempAvg ?? null,
          tempLow: obs.metric?.tempLow ?? obs.metric?.tempAvg ?? null,
          tempAvg: obs.metric?.tempAvg ?? null,
          humidity: obs.humidityAvg ?? null,
          windSpeed: obs.metric?.windspeedAvg ?? null,
          windGust: obs.metric?.windgustHigh ?? null,
          precip: incremental,
          pressure: obs.metric?.pressureMax ?? null,
          uv: obs.uvHigh ?? null
        };
      });
    }

    // Map historical observations for daily/weekly/monthly/yearly charts
    return data.map((obs) => ({
      date: obs.obsTimeLocal,
      label: formatDateLabel(obs.obsTimeLocal, timeRange),
      tempHigh: obs.metric.tempHigh,
      tempLow: obs.metric.tempLow,
      tempAvg: obs.metric.tempAvg,
      humidity: obs.humidityAvg,
      windSpeed: obs.metric.windspeedAvg,
      windGust: obs.metric.windgustHigh,
      precip: obs.metric.precipTotal,
      pressure: obs.metric.pressureMax,
      uv: obs.uvHigh
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, detailedData, timeRange]);

  const axisStyle = {
    fontSize: 11,
    fill: isDark ? '#94a3b8' : '#64748b'
  };

  const gridStyle = {
    strokeDasharray: '3 3',
    stroke: isDark ? '#334155' : '#e2e8f0'
  };

  const rangeButtons: {key: TimeRange;label: string;}[] = [
  { key: 'daily', label: 'יומי' },
  { key: 'weekly', label: 'שבועי' },
  { key: 'monthly', label: 'חודשי' },
  { key: 'yearly', label: 'שנתי' }];


  // Navigation functions
  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    if (timeRange === 'daily') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (timeRange === 'weekly') {
      newDate.setDate(newDate.getDate() + direction * 7);
    }
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const navigateMonth = (direction: number) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    const now = new Date();
    if (newYear < now.getFullYear() || newYear === now.getFullYear() && newMonth <= now.getMonth()) {
      setSelectedMonth(newMonth);
      setSelectedYear(newYear);
    }
  };

  const navigateYear = (direction: number) => {
    const newYear = selectedYear + direction;
    if (newYear <= new Date().getFullYear() && newYear >= 2020) {
      setSelectedYear(newYear);
    }
  };

  // Generate year options (from 2020 to current year)
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 2020; y--) {
    yearOptions.push(y);
  }

  // Get display text for current selection
  const getSelectionDisplay = () => {
    switch (timeRange) {
      case 'daily':
        return selectedDate.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      case 'weekly':
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - 6);
        return `${weekStart.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })} - ${selectedDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' })}`;
      case 'monthly':
        return `${hebrewMonths[selectedMonth]} ${selectedYear}`;
      case 'yearly':
        return `שנת ${selectedYear}`;
      default:
        return '';
    }
  };

  return (
    <div data-ev-id="ev_b035004c17" className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" dir="rtl">
      {/* Header */}
      <header data-ev-id="ev_b6e6ab7b47" className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-white/20 dark:border-slate-700/50">
        <div data-ev-id="ev_2ee328b358" className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div data-ev-id="ev_a5fbefee08" className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-full bg-sky-100 dark:bg-slate-700 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-slate-600 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h1 data-ev-id="ev_4cb981a2a7" className="text-xl font-bold text-slate-800 dark:text-white">
              גרפים - תחנת ריחן
            </h1>
          </div>

          <div className="flex gap-2">
            <button data-ev-id="ev_d16c395b71"
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-full bg-sky-100 dark:bg-slate-700 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main data-ev-id="ev_f92727709d" className="py-4">
        {/* Time Range Selector */}
        <div data-ev-id="ev_839448b750" className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 px-2">
          <div data-ev-id="ev_4d6c0aeb29" className="inline-flex bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20 dark:border-slate-700/50">
            {rangeButtons.map(({ key, label }) =>
            <button data-ev-id="ev_e9b93c7e15"
            key={key}
            onClick={() => setTimeRange(key)}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-base ${
            timeRange === key ?
            'bg-sky-500 text-white shadow-md' :
            'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`
            }>

                {label}
              </button>
            )}
          </div>

          {/* Date Selector */}
          <div data-ev-id="ev_101edd2410" className="flex items-center gap-1 sm:gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-2 sm:px-4 py-1.5 sm:py-2 shadow-lg border border-white/20 dark:border-slate-700/50">
            {/* Navigation buttons */}
            <button data-ev-id="ev_b9620eb2d6"
            onClick={() => {
              if (timeRange === 'daily' || timeRange === 'weekly') navigateDate(-1);else
              if (timeRange === 'monthly') navigateMonth(-1);else
              navigateYear(-1);
            }}
            className="p-1 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">

              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Date display/input */}
            <div data-ev-id="ev_3945013ba5" className="flex items-center gap-1 sm:gap-2 min-w-[140px] sm:min-w-[200px] justify-center">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
              
              {(timeRange === 'daily' || timeRange === 'weekly') &&
              <input data-ev-id="ev_63883c502d"
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 text-sm sm:text-base font-medium text-center cursor-pointer" />

              }

              {timeRange === 'monthly' &&
              <div data-ev-id="ev_7d03e7775b" className="flex items-center gap-2">
                  <select data-ev-id="ev_9cfeaacab0"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-medium cursor-pointer">

                    {hebrewMonths.map((month, index) =>
                  <option data-ev-id="ev_be53012742" key={index} value={index} className="bg-white dark:bg-slate-800">
                        {month}
                      </option>
                  )}
                  </select>
                  <select data-ev-id="ev_073bca2813"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-medium cursor-pointer">

                    {yearOptions.map((year) =>
                  <option data-ev-id="ev_da4ce618bc" key={year} value={year} className="bg-white dark:bg-slate-800">
                        {year}
                      </option>
                  )}
                  </select>
                </div>
              }

              {timeRange === 'yearly' &&
              <select data-ev-id="ev_554850585c"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-medium text-lg cursor-pointer">

                  {yearOptions.map((year) =>
                <option data-ev-id="ev_4635db10c5" key={year} value={year} className="bg-white dark:bg-slate-800">
                      {year}
                    </option>
                )}
                </select>
              }
            </div>

            <button data-ev-id="ev_8ad5d174ae"
            onClick={() => {
              if (timeRange === 'daily' || timeRange === 'weekly') navigateDate(1);else
              if (timeRange === 'monthly') navigateMonth(1);else
              navigateYear(1);
            }}
            className="p-1 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">

              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <p data-ev-id="ev_bb412b947d" className="text-sm text-slate-600 dark:text-slate-400">
            {getSelectionDisplay()}
          </p>
        </div>

        {/* Loading State */}
        {loading &&
        <div data-ev-id="ev_4ef7827f1d" className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        }

        {/* Error State */}
        {error && !loading &&
        <div data-ev-id="ev_bdeb4bf6f4" className="text-center py-20">
            <p data-ev-id="ev_8c2b99105b" className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button data-ev-id="ev_eb185b8e85"
          onClick={loadData}
          className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">

              נסה שוב
            </button>
          </div>
        }

        {/* Charts Grid */}
        {!loading && !error && chartData.length > 0 &&
          <div data-ev-id="ev_c82ae5b166" className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
            {/* Temperature Chart */}
            <ChartCard
              title="טמפרטורה"
              icon={<Thermometer className="w-5 h-5 text-red-500" />}>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs data-ev-id="ev_abc9bc9a4a">
                    <linearGradient data-ev-id="ev_66f93994f8" id="tempHighGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop data-ev-id="ev_6f09621bef" offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop data-ev-id="ev_18a705f29b" offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient data-ev-id="ev_338c6a46cf" id="tempLowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop data-ev-id="ev_7924862bcb" offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop data-ev-id="ev_765bc2525d" offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="label" tick={axisStyle} />
                  <YAxis tick={axisStyle} unit="°" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="tempHigh" name="מקסימום" stroke="#ef4444" fill="url(#tempHighGradient)" strokeWidth={2} unit="°C" />
                  <Area type="monotone" dataKey="tempLow" name="מינימום" stroke="#3b82f6" fill="url(#tempLowGradient)" strokeWidth={2} unit="°C" />
                  <Line type="monotone" dataKey="tempAvg" name="ממוצע" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} unit="°C" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Humidity Chart */}
            <ChartCard
              title="לחות"
              icon={<Droplets className="w-5 h-5 text-cyan-500" />}>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs data-ev-id="ev_05e6b2fa87">
                    <linearGradient data-ev-id="ev_ad0aaab23f" id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop data-ev-id="ev_e102fd3058" offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop data-ev-id="ev_be0dea6450" offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="label" tick={axisStyle} />
                  <YAxis tick={axisStyle} unit="%" domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="humidity" name="לחות" stroke="#06b6d4" fill="url(#humidityGradient)" strokeWidth={2} unit="%" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Wind Chart */}
            <ChartCard
              title="רוח"
              icon={<Wind className="w-5 h-5 text-green-500" />}>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="label" tick={axisStyle} />
                  <YAxis tick={axisStyle} unit=" קמ״ש" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="windSpeed" name="מהירות ממוצעת" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} unit=" קמ״ש" />
                  <Line type="monotone" dataKey="windGust" name="משבים" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308', r: 3 }} unit=" קמ״ש" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Precipitation Chart */}
            <ChartCard
              title="משקעים"
              icon={<CloudRain className="w-5 h-5 text-blue-500" />}>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs data-ev-id="ev_d2f16651f9">
                    <linearGradient data-ev-id="ev_4a8bf03b23" id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop data-ev-id="ev_9db6b7618f" offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop data-ev-id="ev_f1d7f8abf3" offset="95%" stopColor="#3b82f6" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="label" tick={axisStyle} />
                  <YAxis tick={axisStyle} unit=" מ״מ" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="precip" name="משקעים" fill="url(#precipGradient)" radius={[4, 4, 0, 0]} unit=" מ״מ" />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Pressure Chart */}
            <ChartCard
              title="לחץ אטמוספרי"
              icon={<Gauge className="w-5 h-5 text-orange-500" />}>

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="label" tick={axisStyle} />
                  <YAxis tick={axisStyle} unit=" hPa" domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="pressure" name="לחץ" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} unit=" hPa" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* UV Index Chart */}
            <ChartCard
              title="מדד UV"
              icon={<Sun className="w-5 h-5 text-purple-500" />}>

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs data-ev-id="ev_04a4054ca2">
                    <linearGradient data-ev-id="ev_d5425ff673" id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop data-ev-id="ev_bf18a60e24" offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                      <stop data-ev-id="ev_9821963b00" offset="95%" stopColor="#a855f7" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="label" tick={axisStyle} />
                  <YAxis tick={axisStyle} domain={[0, 12]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="uv" name="מדד UV" fill="url(#uvGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        }

        {/* Data Attribution */}
        {!loading && !error && chartData.length > 0 &&
        <p data-ev-id="ev_46929d3ee6" className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            נתונים מתחנת מזג אוויר ריחן • Weather Underground
          </p>
        }
      </main>
    </div>);

}