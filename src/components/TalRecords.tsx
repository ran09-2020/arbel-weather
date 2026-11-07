import { useState, useMemo, useEffect } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Trophy, ThermometerSun, ThermometerSnowflake, Flame, CloudRain, CalendarDays } from 'lucide-react';

const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

interface Props {
  talData: any[];
}

function RecordBox({ title, value, subtitle, icon, colorClass, isDark }: any) {
  return (
    <div className="bg-white dark:bg-[#111b21] rounded-2xl p-5 shadow-sm border border-[#25D366]/20 flex items-start gap-4">
      <div className={`p-3 rounded-full ${colorClass.bg}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#128C7E] dark:text-[#8696a0] mb-1">{title}</h4>
        <div className="text-2xl font-bold text-slate-800 dark:text-white" dir="ltr">
          {value}
        </div>
        <div className="text-sm text-slate-500 dark:text-[#8696a0] mt-1">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export function TalRecords({ talData }: Props) {
  const { isDark } = useThemeContext();
  
  const currentYear = new Date().getFullYear();
  const [fromYear, setFromYear] = useState<number>(2020);
  const [toYear, setToYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  // Automatically select the latest month and year when data loads
  useEffect(() => {
    if (talData && talData.length > 0) {
      const lastRecord = talData[talData.length - 1];
      const lastDate = new Date(lastRecord.time);
      setSelectedMonth(lastDate.getMonth());
      setToYear(lastDate.getFullYear());
    }
  }, [talData]);

  const yearOptions = [];
  for (let y = currentYear; y >= 2020; y--) {
    yearOptions.push(y);
  }

  const { records, monthChartData } = useMemo(() => {
    if (!talData || talData.length === 0) return { records: null, monthChartData: [] };

    // 1. Filter by year range
    const filtered = talData.filter(d => {
      const y = new Date(d.time).getFullYear();
      return y >= fromYear && y <= toYear;
    });

    if (filtered.length === 0) return { records: null, monthChartData: [] };

    let maxTempObj = filtered[0];
    let minTempObj = filtered[0];

    const monthlyMap = new Map<string, { temps: number[], rain: number }>();

    filtered.forEach(obs => {
      if (obs.temp !== null && obs.temp !== undefined) {
        if (maxTempObj.temp === null || obs.temp > maxTempObj.temp) maxTempObj = obs;
        if (minTempObj.temp === null || obs.temp < minTempObj.temp) minTempObj = obs;
      }

      const d = new Date(obs.time);
      const mKey = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthlyMap.has(mKey)) {
        monthlyMap.set(mKey, { temps: [], rain: 0 });
      }
      const mData = monthlyMap.get(mKey)!;
      if (obs.temp !== null) mData.temps.push(obs.temp);
      if (obs.precip !== null) mData.rain += obs.precip;
    });

    let hottestMonthKey = '';
    let hottestMonthAvg = -999;
    
    let rainiestMonthKey = '';
    let rainiestMonthTotal = -1;

    monthlyMap.forEach((data, key) => {
      if (data.temps.length > 0) {
        const avg = data.temps.reduce((a, b) => a + b, 0) / data.temps.length;
        if (avg > hottestMonthAvg) {
          hottestMonthAvg = avg;
          hottestMonthKey = key;
        }
      }
      if (data.rain > rainiestMonthTotal) {
        rainiestMonthTotal = data.rain;
        rainiestMonthKey = key;
      }
    });

    const formatMonthKey = (key: string) => {
      if (!key) return '--';
      const [y, m] = key.split('-');
      return `${hebrewMonths[parseInt(m)]} ${y}`;
    };

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} בשעה ${d.getHours().toString().padStart(2, '0')}:00`;
    };

    // Build month chart data
    const mChartData = [];
    for (let y = fromYear; y <= toYear; y++) {
      const key = `${y}-${selectedMonth}`;
      if (monthlyMap.has(key)) {
        const data = monthlyMap.get(key)!;
        const avgTemp = data.temps.length ? data.temps.reduce((a, b) => a + b, 0) / data.temps.length : null;
        mChartData.push({
          year: y.toString(),
          temp: avgTemp !== null ? parseFloat(avgTemp.toFixed(1)) : null,
          rain: data.rain > 0 ? parseFloat(data.rain.toFixed(1)) : null
        });
      } else {
        mChartData.push({ year: y.toString(), temp: null, rain: null });
      }
    }

    return {
      records: {
        maxTemp: maxTempObj.temp,
        maxTempDate: formatDate(maxTempObj.time),
        minTemp: minTempObj.temp,
        minTempDate: formatDate(minTempObj.time),
        hottestMonth: formatMonthKey(hottestMonthKey),
        hottestMonthAvg: hottestMonthAvg !== -999 ? hottestMonthAvg.toFixed(1) : '--',
        rainiestMonth: formatMonthKey(rainiestMonthKey),
        rainiestMonthTotal: rainiestMonthTotal !== -1 ? rainiestMonthTotal.toFixed(1) : '--'
      },
      monthChartData: mChartData
    };

  }, [talData, fromYear, toYear, selectedMonth]);

  const axisStyle = {
    fontSize: 11,
    fill: isDark ? '#94a3b8' : '#64748b'
  };

  const gridStyle = {
    strokeDasharray: '3 3',
    stroke: isDark ? '#2a3942' : '#d1d5db'
  };

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="bg-white dark:bg-[#111b21] rounded-2xl shadow-sm border border-[#25D366]/20 p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#128C7E] dark:text-[#8696a0] font-bold">טווח שנים:</span>
          <select
            value={fromYear}
            onChange={(e) => setFromYear(Number(e.target.value))}
            className="bg-[#efeae2] dark:bg-[#202c33] border-none text-slate-800 dark:text-white rounded-lg px-3 py-1.5 font-bold"
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-[#128C7E] dark:text-[#8696a0] font-bold">עד</span>
          <select
            value={toYear}
            onChange={(e) => setToYear(Number(e.target.value))}
            className="bg-[#efeae2] dark:bg-[#202c33] border-none text-slate-800 dark:text-white rounded-lg px-3 py-1.5 font-bold"
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {records && (
        <>
          {/* Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RecordBox 
              title="הטמפרטורה הגבוהה ביותר" 
              value={`${records.maxTemp}°C`} 
              subtitle={records.maxTempDate}
              icon={<ThermometerSun className="w-6 h-6 text-red-500" />}
              colorClass={{ bg: 'bg-red-500/10' }}
              isDark={isDark}
            />
            <RecordBox 
              title="הטמפרטורה הנמוכה ביותר" 
              value={`${records.minTemp}°C`} 
              subtitle={records.minTempDate}
              icon={<ThermometerSnowflake className="w-6 h-6 text-blue-500" />}
              colorClass={{ bg: 'bg-blue-500/10' }}
              isDark={isDark}
            />
            <RecordBox 
              title="החודש החם ביותר בממוצע" 
              value={`${records.hottestMonthAvg}°C`} 
              subtitle={records.hottestMonth}
              icon={<Flame className="w-6 h-6 text-orange-500" />}
              colorClass={{ bg: 'bg-orange-500/10' }}
              isDark={isDark}
            />
            <RecordBox 
              title="החודש הגשום ביותר" 
              value={`${records.rainiestMonthTotal} מ״מ`} 
              subtitle={records.rainiestMonth}
              icon={<CloudRain className="w-6 h-6 text-[#00a884]" />}
              colorClass={{ bg: 'bg-[#25D366]/10' }}
              isDark={isDark}
            />
          </div>

          {/* specific month check */}
          <div className="bg-white dark:bg-[#111b21] rounded-2xl shadow-sm border border-[#25D366]/20 p-6 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 border-b border-[#25D366]/20 pb-4">
              <h3 className="text-xl font-bold text-[#128C7E] dark:text-[#00a884] flex items-center gap-2">
                <CalendarDays className="w-6 h-6" />
                מבחן השנים: השוואת חודש 
              </h3>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-[#efeae2] dark:bg-[#202c33] border-none text-[#128C7E] dark:text-[#d1d7db] rounded-lg px-4 py-2 font-bold focus:ring-2 focus:ring-[#25D366] mt-4 md:mt-0"
              >
                {hebrewMonths.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            
            <p className="text-slate-600 dark:text-[#8696a0] mb-6 text-sm">
              הגרף מציג את הטמפרטורה הממוצעת וכמות המשקעים הכוללת של חודש {hebrewMonths[selectedMonth]} בכל אחת מהשנים שבחרת בטווח.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Temp Chart */}
              <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl p-4">
                <h4 className="flex items-center justify-center gap-2 font-bold text-orange-500 mb-4">
                  <ThermometerSun className="w-5 h-5" /> טמפרטורה ממוצעת
                </h4>
                <div className="h-64" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="year" tick={axisStyle} />
                      <YAxis tick={axisStyle} unit="°" domain={[(dataMin: number) => Math.floor(dataMin) - 2, 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: isDark ? '#1f2c34' : '#fff', borderRadius: '8px', border: '1px solid #25D366' }}
                        itemStyle={{ fontWeight: 'bold', color: '#ef4444' }}
                        formatter={(val: number) => [`${val}°C`, 'ממוצע']}
                      />
                      <Bar dataKey="temp" name="ממוצע טמפרטורה" fill="#ef4444" radius={[4,4,0,0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rain Chart */}
              <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl p-4">
                <h4 className="flex items-center justify-center gap-2 font-bold text-blue-500 mb-4">
                  <CloudRain className="w-5 h-5" /> סה"כ משקעים
                </h4>
                <div className="h-64" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid {...gridStyle} />
                      <XAxis dataKey="year" tick={axisStyle} />
                      <YAxis tick={axisStyle} unit=" מ״מ" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: isDark ? '#1f2c34' : '#fff', borderRadius: '8px', border: '1px solid #25D366' }}
                        itemStyle={{ fontWeight: 'bold', color: '#3b82f6' }}
                        formatter={(val: number) => [`${val} מ"מ`, 'סה"כ משקעים']}
                      />
                      <Bar dataKey="rain" name='סה"כ משקעים' fill="#3b82f6" radius={[4,4,0,0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!records && (
        <div className="text-center py-20">
          <p className="text-red-500 font-bold">לא נמצאו נתונים בטווח השנים הנבחר.</p>
        </div>
      )}
    </div>
  );
}
