import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend } from
'recharts';
import type { WeatherHistoryRecord } from '@/hooks/useWeatherHistory';

interface HumidityChartProps {
  data: WeatherHistoryRecord[];
}

function formatTimeLabel(date: Date): string {
  const hours = date.getHours();
  if (hours === 0) return '12AM';
  if (hours === 12) return '12PM';
  if (hours < 12) return `${hours}AM`;
  return `${hours - 12}PM`;
}

export function HumidityChart({ data }: HumidityChartProps) {
  const chartData = data.map((record) => {
    const date = new Date(record.recorded_at);
    return {
      timestamp: date.getTime(),
      time: formatTimeLabel(date),
      humidity: record.humidity
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
    <div data-ev-id="ev_2cf47f4c30" className="bg-slate-800/90 backdrop-blur-sm rounded-none sm:rounded-lg border-y sm:border border-white/10 p-0 sm:p-4 -mx-6 sm:mx-0">
      <div data-ev-id="ev_4c7c2cdf8f" className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
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
              width={35}
              domain={[0, 100]} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#e2e8f0'
              }}
              labelStyle={{ color: '#e2e8f0' }}
              labelFormatter={(ts) => {
                const date = new Date(ts);
                return date.toLocaleString('he-IL', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short'
                });
              }}
              formatter={(value: number) => [`${value}%`, 'לחות']} />

            <Legend
              verticalAlign="bottom"
              align="right"
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: '#94a3b8' }}
              formatter={() => 'לחות (%)'} />

            <Line
              type="monotone"
              dataKey="humidity"
              name="humidity"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#a78bfa' }} />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>);

}