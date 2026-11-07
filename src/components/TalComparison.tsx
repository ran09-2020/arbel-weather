import { useMemo } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, CloudRain, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const hebrewMonths = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
];

interface Props {
  talData: any[];
  compareMode: 'month' | 'year';
  month: number;
  year1: number;
  year2: number;
}

function StatBox({ title, val1, val2, unit, isDark, invertColors = false }: any) {
  const diff = val1 !== null && val2 !== null ? val2 - val1 : null;
  
  let diffColor = '';
  let DiffIcon = Minus;
  
  if (diff !== null && diff !== 0) {
    const isIncrease = diff > 0;
    // For temp, increase might be "red", for rain, increase is "green/blue"
    if (invertColors) {
      diffColor = isIncrease ? 'text-blue-500' : 'text-red-500';
    } else {
      diffColor = isIncrease ? 'text-red-500' : 'text-blue-500';
    }
    DiffIcon = isIncrease ? ArrowUpRight : ArrowDownRight;
  } else {
    diffColor = 'text-gray-500';
  }

  return (
    <div className="bg-[#efeae2]/50 dark:bg-[#202c33]/50 rounded-xl p-4 border border-[#25D366]/30">
      <h4 className="text-sm font-bold text-[#128C7E] dark:text-[#8696a0] mb-3 text-center">{title}</h4>
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {val1 !== null ? val1.toFixed(1) : '--'}
            <span className="text-sm font-normal ml-1">{unit}</span>
          </div>
        </div>
        
        <div className={`flex flex-col items-center justify-center px-2 ${diffColor}`}>
          <DiffIcon className="w-5 h-5 mb-1" />
          <span className="text-xs font-bold" dir="ltr">
            {diff !== null ? (diff > 0 ? '+' : '') + diff.toFixed(1) : '--'}
          </span>
        </div>

        <div className="text-center flex-1">
          <div className="text-2xl font-bold text-slate-800 dark:text-white">
            {val2 !== null ? val2.toFixed(1) : '--'}
            <span className="text-sm font-normal ml-1">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TalComparison({ talData, compareMode, month, year1, year2 }: Props) {
  const { isDark } = useThemeContext();

  const comparisonData = useMemo(() => {
    if (talData.length === 0) return { chartData: [], stats: null };

    if (compareMode === 'month') {
      const daysInMonth = new Date(year1, month + 1, 0).getDate();
      const chartData = [];
      
      let tempSum1 = 0, tempCount1 = 0, rainSum1 = 0;
      let tempSum2 = 0, tempCount2 = 0, rainSum2 = 0;

      for (let day = 1; day <= Math.max(daysInMonth, new Date(year2, month + 1, 0).getDate()); day++) {
        const d1 = talData.filter(o => {
          const dt = new Date(o.time);
          return dt.getFullYear() === year1 && dt.getMonth() === month && dt.getDate() === day;
        });
        const d2 = talData.filter(o => {
          const dt = new Date(o.time);
          return dt.getFullYear() === year2 && dt.getMonth() === month && dt.getDate() === day;
        });

        const temps1 = d1.map(o => o.temp).filter(t => t !== null && t !== undefined);
        const temps2 = d2.map(o => o.temp).filter(t => t !== null && t !== undefined);
        
        const r1 = d1.map(o => o.precip).filter(p => p !== null && p !== undefined).reduce((a, b) => a + b, 0);
        const r2 = d2.map(o => o.precip).filter(p => p !== null && p !== undefined).reduce((a, b) => a + b, 0);

        const t1 = temps1.length ? temps1.reduce((a, b) => a + b, 0) / temps1.length : null;
        const t2 = temps2.length ? temps2.reduce((a, b) => a + b, 0) / temps2.length : null;

        if (t1 !== null) { tempSum1 += t1; tempCount1++; }
        if (t2 !== null) { tempSum2 += t2; tempCount2++; }
        rainSum1 += r1;
        rainSum2 += r2;

        chartData.push({
          label: day.toString(),
          temp1: t1 !== null ? parseFloat(t1.toFixed(1)) : null,
          temp2: t2 !== null ? parseFloat(t2.toFixed(1)) : null,
          rain1: r1 > 0 ? parseFloat(r1.toFixed(1)) : null,
          rain2: r2 > 0 ? parseFloat(r2.toFixed(1)) : null,
        });
      }

      return {
        chartData,
        stats: {
          tempAvg1: tempCount1 ? tempSum1 / tempCount1 : null,
          tempAvg2: tempCount2 ? tempSum2 / tempCount2 : null,
          rainTotal1: rainSum1,
          rainTotal2: rainSum2,
          label1: `${hebrewMonths[month]} ${year1}`,
          label2: `${hebrewMonths[month]} ${year2}`,
        }
      };
    } else {
      // Yearly comparison
      const chartData = [];
      let tempSum1 = 0, tempCount1 = 0, rainSum1 = 0;
      let tempSum2 = 0, tempCount2 = 0, rainSum2 = 0;

      for (let m = 0; m < 12; m++) {
        const d1 = talData.filter(o => {
          const dt = new Date(o.time);
          return dt.getFullYear() === year1 && dt.getMonth() === m;
        });
        const d2 = talData.filter(o => {
          const dt = new Date(o.time);
          return dt.getFullYear() === year2 && dt.getMonth() === m;
        });

        const temps1 = d1.map(o => o.temp).filter(t => t !== null && t !== undefined);
        const temps2 = d2.map(o => o.temp).filter(t => t !== null && t !== undefined);
        
        const r1 = d1.map(o => o.precip).filter(p => p !== null && p !== undefined).reduce((a, b) => a + b, 0);
        const r2 = d2.map(o => o.precip).filter(p => p !== null && p !== undefined).reduce((a, b) => a + b, 0);

        const t1 = temps1.length ? temps1.reduce((a, b) => a + b, 0) / temps1.length : null;
        const t2 = temps2.length ? temps2.reduce((a, b) => a + b, 0) / temps2.length : null;

        if (t1 !== null) { tempSum1 += t1; tempCount1++; }
        if (t2 !== null) { tempSum2 += t2; tempCount2++; }
        rainSum1 += r1;
        rainSum2 += r2;

        chartData.push({
          label: hebrewMonths[m].substring(0, 3),
          temp1: t1 !== null ? parseFloat(t1.toFixed(1)) : null,
          temp2: t2 !== null ? parseFloat(t2.toFixed(1)) : null,
          rain1: r1 > 0 ? parseFloat(r1.toFixed(1)) : null,
          rain2: r2 > 0 ? parseFloat(r2.toFixed(1)) : null,
        });
      }

      return {
        chartData,
        stats: {
          tempAvg1: tempCount1 ? tempSum1 / tempCount1 : null,
          tempAvg2: tempCount2 ? tempSum2 / tempCount2 : null,
          rainTotal1: rainSum1,
          rainTotal2: rainSum2,
          label1: `שנת ${year1}`,
          label2: `שנת ${year2}`,
        }
      };
    }
  }, [talData, compareMode, month, year1, year2]);

  const { chartData, stats } = comparisonData;

  const axisStyle = {
    fontSize: 11,
    fill: isDark ? '#94a3b8' : '#64748b'
  };

  const gridStyle = {
    strokeDasharray: '3 3',
    stroke: isDark ? '#2a3942' : '#d1d5db'
  };

  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-[#111b21] rounded-2xl shadow-sm border border-[#25D366]/20 p-4 sm:p-6 mt-6">
      
      {/* Header comparing titles */}
      <div className="flex justify-between items-center mb-6 border-b border-[#25D366]/20 pb-4">
        <div className="text-xl font-bold text-[#128C7E] dark:text-[#00a884]">{stats.label1}</div>
        <div className="text-sm font-bold bg-[#25D366] text-white px-3 py-1 rounded-full">VS</div>
        <div className="text-xl font-bold text-[#128C7E] dark:text-[#00a884]">{stats.label2}</div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatBox title="טמפרטורה ממוצעת" val1={stats.tempAvg1} val2={stats.tempAvg2} unit="°C" isDark={isDark} />
        <StatBox title='סה"כ משקעים' val1={stats.rainTotal1} val2={stats.rainTotal2} unit="מ״מ" isDark={isDark} invertColors={true} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Temp Chart */}
        <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl p-4">
          <h4 className="flex items-center justify-center gap-2 font-bold text-orange-500 mb-4">
            <Thermometer className="w-5 h-5" /> טמפרטורה
          </h4>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="label" tick={axisStyle} />
                <YAxis tick={axisStyle} unit="°" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1f2c34' : '#fff', borderRadius: '8px', border: '1px solid #25D366' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line type="monotone" dataKey="temp1" name={stats.label1} stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="temp2" name={stats.label2} stroke="#ef4444" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rain Chart */}
        <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl p-4">
          <h4 className="flex items-center justify-center gap-2 font-bold text-blue-500 mb-4">
            <CloudRain className="w-5 h-5" /> משקעים
          </h4>
          <div className="h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid {...gridStyle} />
                <XAxis dataKey="label" tick={axisStyle} />
                <YAxis tick={axisStyle} unit=" מ״מ" />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? '#1f2c34' : '#fff', borderRadius: '8px', border: '1px solid #25D366' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Bar dataKey="rain1" name={stats.label1} fill="#94a3b8" radius={[2,2,0,0]} />
                <Bar dataKey="rain2" name={stats.label2} fill="#3b82f6" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
