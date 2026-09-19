import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import type { WeatherHistoryRecord } from '@/hooks/useWeatherHistory';

interface PrecipChartProps {
  data: WeatherHistoryRecord[];
  timeRange?: number;
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

function getViewMode(hours: number): ViewMode {
  if (hours <= 24) return 'daily';
  if (hours <= 168) return 'weekly';
  return 'monthly';
}

function formatHour(hour: number): string {
  if (hour === 0 || hour === 24) return '12AM';
  if (hour === 12) return '12PM';
  if (hour < 12) return `${hour}AM`;
  return `${hour - 12}PM`;
}

export function PrecipChart({ data, timeRange = 24 }: PrecipChartProps) {
  const viewMode = getViewMode(timeRange);

  const sortedData = [...data].sort((a, b) =>
  new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  let chartData: {
    key: string;
    timestamp: number;
    label: string;
    tooltipTitle: string;
    total: number;
    maxRate: number;
  }[] = [];

  if (viewMode === 'monthly') {
    // Monthly: MAX precip_total per day (resets at midnight = total daily rain)
    const dayData = new Map<string, {
      date: Date;
      maxTotal: number;
      maxRate: number;
    }>();

    sortedData.forEach((record) => {
      const date = new Date(record.recorded_at);
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const precipTotal = record.precip_total ?? 0;
      const precipRate = record.precip_rate ?? 0;

      if (!dayData.has(dayKey)) {
        dayData.set(dayKey, { date, maxTotal: precipTotal, maxRate: precipRate });
      } else {
        const day = dayData.get(dayKey)!;
        if (precipTotal > day.maxTotal) day.maxTotal = precipTotal;
        if (precipRate > day.maxRate) day.maxRate = precipRate;
      }
    });

    chartData = Array.from(dayData.entries()).
    map(([key, d]) => ({
      key,
      timestamp: d.date.getTime(),
      label: `${d.date.getDate()}`,
      tooltipTitle: d.date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }),
      total: d.maxTotal,
      maxRate: d.maxRate
    })).
    sort((a, b) => a.timestamp - b.timestamp);

  } else if (viewMode === 'weekly') {
    // Weekly: 6-hour blocks, calculate difference per block
    const blockData = new Map<string, {
      date: Date;
      blockHour: number;
      maxTotal: number;
      maxRate: number;
    }>();

    sortedData.forEach((record) => {
      const date = new Date(record.recorded_at);
      const hour = date.getHours();
      const blockHour = Math.floor(hour / 6) * 6;
      const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${blockHour}`;
      const precipTotal = record.precip_total ?? 0;
      const precipRate = record.precip_rate ?? 0;

      if (!blockData.has(dayKey)) {
        blockData.set(dayKey, { date, blockHour, maxTotal: precipTotal, maxRate: precipRate });
      } else {
        const block = blockData.get(dayKey)!;
        if (precipTotal > block.maxTotal) block.maxTotal = precipTotal;
        if (precipRate > block.maxRate) block.maxRate = precipRate;
      }
    });

    const sortedBlocks = Array.from(blockData.entries()).sort((a, b) => {
      const dateA = a[1].date.getTime() + a[1].blockHour * 3600000;
      const dateB = b[1].date.getTime() + b[1].blockHour * 3600000;
      return dateA - dateB;
    });

    let prevDayTotal = 0;
    let prevDay = '';

    chartData = sortedBlocks.map(([key, d]) => {
      const currentDay = `${d.date.getFullYear()}-${d.date.getMonth()}-${d.date.getDate()}`;
      const displayHour = `${d.blockHour.toString().padStart(2, '0')}:00`;

      if (currentDay !== prevDay) {
        prevDayTotal = 0;
        prevDay = currentDay;
      }

      const blockPrecip = Math.max(0, d.maxTotal - prevDayTotal);
      prevDayTotal = d.maxTotal;

      return {
        key,
        timestamp: d.date.getTime() + d.blockHour * 3600000,
        label: `${d.date.getDate()}.${d.date.getMonth() + 1}`,
        tooltipTitle: `${d.date.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })} ${displayHour}`,
        total: blockPrecip,
        maxRate: d.maxRate
      };
    });

  } else {
    // Daily: hourly, calculate difference per hour
    const hourData = new Map<number, {
      date: Date;
      maxTotal: number;
      maxRate: number;
    }>();

    sortedData.forEach((record) => {
      const date = new Date(record.recorded_at);
      const hour = date.getHours();
      const precipTotal = record.precip_total ?? 0;
      const precipRate = record.precip_rate ?? 0;

      if (!hourData.has(hour)) {
        hourData.set(hour, { date, maxTotal: precipTotal, maxRate: precipRate });
      } else {
        const h = hourData.get(hour)!;
        if (precipTotal > h.maxTotal) h.maxTotal = precipTotal;
        if (precipRate > h.maxRate) h.maxRate = precipRate;
      }
    });

    const baseDate = sortedData.length > 0 ? new Date(sortedData[0].recorded_at) : new Date();
    let prevTotal = 0;

    chartData = Array.from({ length: 24 }, (_, hour) => {
      const h = hourData.get(hour);
      let hourPrecip = 0;

      if (h) {
        if (hour === 0 || prevTotal === 0) {
          hourPrecip = h.maxTotal;
        } else {
          hourPrecip = Math.max(0, h.maxTotal - prevTotal);
        }
        prevTotal = h.maxTotal;
      }

      return {
        key: `hour-${hour}`,
        timestamp: hour,
        label: formatHour(hour),
        tooltipTitle: `${baseDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })} ${formatHour(hour)}`,
        total: hourPrecip,
        maxRate: h?.maxRate ?? 0
      };
    });
  }

  if (chartData.length === 0) {
    return (
      <div data-ev-id="ev_f66e57b716" className="bg-slate-800/90 backdrop-blur-sm rounded-none sm:rounded-lg border-y sm:border border-white/10 p-4 -mx-6 sm:mx-0">
        <h3 data-ev-id="ev_29117d5e29" className="text-sm font-medium text-gray-400 mb-2">משקעים</h3>
        <div data-ev-id="ev_1d174b0bce" className="h-32 flex items-center justify-center text-gray-500">
          אין נתונים
        </div>
      </div>);

  }

  return (
    <div data-ev-id="ev_adac91c5fe" className="bg-slate-800/90 backdrop-blur-sm rounded-none sm:rounded-lg border-y sm:border border-white/10 p-0 sm:p-4 -mx-6 sm:mx-0">
      <h3 data-ev-id="ev_49ed96f02e" className="text-sm font-medium text-gray-400 mb-2 px-4 sm:px-0">משקעים</h3>
      <div data-ev-id="ev_8fd43c4652" style={{ width: '100%', height: 256 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>

            <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={viewMode === 'weekly'} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={viewMode === 'daily' ? 9 : 11}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
              interval={viewMode === 'daily' ? 2 : 0} />


            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
              width={40}
              label={{ value: 'מ״מ', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, dx: 10 }} />


            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const d = payload[0].payload;
                  return (
                    <div data-ev-id="ev_c8fbfed396" className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl z-50">
                      <div data-ev-id="ev_125f1f9a2c" className="font-bold text-white mb-2">{d.tooltipTitle}</div>
                      <div data-ev-id="ev_a14c514e00" className="flex items-center gap-2 text-cyan-400">
                        <span data-ev-id="ev_a9daae3a13" className="w-3 h-3 bg-cyan-400 rounded-sm inline-block"></span>
                        <span data-ev-id="ev_a921ac9e20" dir="ltr">Total: {d.total.toFixed(1)} mm</span>
                      </div>
                      <div data-ev-id="ev_04463325ba" className="flex items-center gap-2 text-cyan-600 mt-1">
                        <span data-ev-id="ev_a4c6afbbf7" className="w-3 h-3 bg-cyan-700 rounded-sm inline-block"></span>
                        <span data-ev-id="ev_298bc7a227" dir="ltr">Max: {d.maxRate.toFixed(1)} mm/h</span>
                      </div>
                    </div>);

                }
                return null;
              }} />


            <Bar
              dataKey="total"
              fill="#38bdf8"
              radius={[2, 2, 0, 0]} />


          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>);

}