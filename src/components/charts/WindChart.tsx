import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import type { WeatherHistoryRecord } from '@/hooks/useWeatherHistory';

interface WindChartProps {
  data: WeatherHistoryRecord[];
}

function formatTimeLabel(date: Date): string {
  const hours = date.getHours();
  if (hours === 0) return '12AM';
  if (hours === 12) return '12PM';
  if (hours < 12) return `${hours}AM`;
  return `${hours - 12}PM`;
}

// Small dot for wind gust scatter
function SmallDot(props: any) {
  const { cx, cy, fill } = props;
  if (cx === undefined || cy === undefined) return null;
  return <circle data-ev-id="ev_ae0ebef818" cx={cx} cy={cy} r={2} fill={fill} />;
}

// Filter out invalid values - check for timestamps mistakenly stored as values
function validateValue(value: number | null, max: number): number | null {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  // Any value over 1 billion is definitely a timestamp, not a weather value
  if (num > 1000000000) return null;
  if (num > max || num < 0) return null;
  return num;
}

// Custom tooltip to filter out invalid values
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;

  const date = new Date(label);
  const formattedDate = date.toLocaleString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  });

  const validItems = payload.filter((item: any) => {
    const value = item.value;
    return value !== null && value !== undefined && value < 1000;
  });

  if (validItems.length === 0) return null;

  return (
    <div data-ev-id="ev_890ce7e7ac" className="bg-slate-800 border border-slate-600 rounded-md p-2 text-xs shadow-lg" dir="rtl">
      <p data-ev-id="ev_7db19b04f6" className="font-medium mb-1 text-slate-200">{formattedDate}</p>
      {validItems.map((item: any, index: number) =>
      <p data-ev-id="ev_8747f2c8ef" key={index} style={{ color: item.color }}>
          {item.name === 'windSpeed' ? 'מהירות רוח' : 'משב רוח'}: {item.value?.toFixed(1)} קמ״ש
        </p>
      )}
    </div>);

}

export function WindChart({ data }: WindChartProps) {
  const chartData = data.map((record) => {
    const date = new Date(record.recorded_at);
    return {
      timestamp: date.getTime(),
      time: formatTimeLabel(date),
      windSpeed: validateValue(record.wind_speed, 300),
      windGust: validateValue(record.wind_gust, 300)
    };
  });

  const getTickValues = () => {
    if (chartData.length === 0) return [];
    const ticks: number[] = [];
    const seen = new Set<string>();
    chartData.forEach((d) => {
      const date = new Date(d.timestamp);
      const hour = date.getHours();
      if (hour % 3 === 0) {
        const key = `${date.toDateString()}-${hour}`;
        if (!seen.has(key)) {
          seen.add(key);
          ticks.push(d.timestamp);
        }
      }
    });
    return ticks;
  };

  return (
    <div data-ev-id="ev_890ce7e7ac" className="bg-slate-800/90 backdrop-blur-sm rounded-none sm:rounded-lg border-y sm:border border-white/10 p-0 sm:p-4 -mx-6 sm:mx-0">
      <div data-ev-id="ev_6395ae6f08" className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={true} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              ticks={getTickValues()}
              tickFormatter={(ts) => formatTimeLabel(new Date(ts))}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569' }} />

            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#475569' }}
              width={35} />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="bottom"
              align="right"
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: '#94a3b8' }}
              formatter={(value) =>
              value === 'windSpeed' ? 'מהירות רוח (קמ״ש)' : 'משב רוח (קמ״ש)'
              } />

            <Line
              type="monotone"
              dataKey="windSpeed"
              name="windSpeed"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#38bdf8' }} />

            <Scatter
              dataKey="windGust"
              name="windGust"
              fill="#fbbf24"
              shape={<SmallDot />} />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>);

}