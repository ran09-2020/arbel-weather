import type { WeatherHistoryRecord } from '@/hooks/useWeatherHistory';

interface HistoryTableProps {
  data: WeatherHistoryRecord[];
}

function getWindDirection(degrees: number | null): string {
  if (degrees === null) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Filter out invalid values - check for timestamps mistakenly stored as values
function isValidValue(value: number | null, max: number, min: number = -50): boolean {
  if (value === null || value === undefined) return false;
  const num = Number(value);
  if (isNaN(num)) return false;
  // Any value over 1 billion is definitely a timestamp, not a weather value
  if (num > 1000000000) return false;
  if (num > max || num < min) return false;
  return true;
}

function formatValue(value: number | null, max: number, decimals: number = 1, min: number = -50): string {
  if (!isValidValue(value, max, min)) return '--';
  return Number(value).toFixed(decimals);
}

export function HistoryTable({ data }: HistoryTableProps) {
  const formatTime = (recorded_at: string) => {
    const date = new Date(recorded_at);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div data-ev-id="ev_c5d182ad33" className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
      <div data-ev-id="ev_09feb10ff5" className="overflow-x-auto">
        <table data-ev-id="ev_36c9566dd3" className="w-full text-sm" dir="rtl">
          <thead data-ev-id="ev_f54d62b929">
            <tr data-ev-id="ev_1a3263f2d4" className="bg-slate-700/50 border-b border-white/10">
              <th data-ev-id="ev_70b5e80ee9" className="px-4 py-3 text-right font-semibold text-slate-200">שעה</th>
              <th data-ev-id="ev_2b4684114f" className="px-4 py-3 text-right font-semibold text-slate-200">טמפרטורה</th>
              <th data-ev-id="ev_f220947c15" className="px-4 py-3 text-right font-semibold text-slate-200">נקודת טל</th>
              <th data-ev-id="ev_883eb47731" className="px-4 py-3 text-right font-semibold text-slate-200">לחות</th>
              <th data-ev-id="ev_76943dbfc7" className="px-4 py-3 text-right font-semibold text-slate-200">כיוון רוח</th>
              <th data-ev-id="ev_cc3248b7a8" className="px-4 py-3 text-right font-semibold text-slate-200">מהירות</th>
              <th data-ev-id="ev_642b5a8e57" className="px-4 py-3 text-right font-semibold text-slate-200">משב</th>
              <th data-ev-id="ev_a9933f3541" className="px-4 py-3 text-right font-semibold text-slate-200">לחץ</th>
              <th data-ev-id="ev_ca346b0e32" className="px-4 py-3 text-right font-semibold text-slate-200">עוצמת גשם</th>
              <th data-ev-id="ev_1db696ed3c" className="px-4 py-3 text-right font-semibold text-slate-200">גשם מצטבר</th>
              <th data-ev-id="ev_15e13f639b" className="px-4 py-3 text-right font-semibold text-slate-200">UV</th>
            </tr>
          </thead>
          <tbody data-ev-id="ev_dad39a47e8">
            {data.map((record, index) =>
            <tr data-ev-id="ev_0a4336f256"
            key={record.id}
            className={index % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-700/30'}>

                <td data-ev-id="ev_3983018b00" className="px-4 py-2.5 text-slate-100 font-medium">
                  {formatTime(record.recorded_at)}
                </td>
                <td data-ev-id="ev_4f877b8c49" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.temperature, 70) !== '--' ? `${formatValue(record.temperature, 70)}°` : '--'}
                </td>
                <td data-ev-id="ev_eb69dc1243" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.dew_point, 60) !== '--' ? `${formatValue(record.dew_point, 60)}°` : '--'}
                </td>
                <td data-ev-id="ev_073c5ee686" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.humidity, 100, 0) !== '--' ? `${formatValue(record.humidity, 100, 0)}%` : '--'}
                </td>
                <td data-ev-id="ev_2bf064a15e" className="px-4 py-2.5 text-slate-300">
                  {getWindDirection(record.wind_direction)}
                </td>
                <td data-ev-id="ev_0487167a18" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.wind_speed, 300) !== '--' ? `${formatValue(record.wind_speed, 300)} קמ״ש` : '--'}
                </td>
                <td data-ev-id="ev_eeaf0b2f8b" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.wind_gust, 300) !== '--' ? `${formatValue(record.wind_gust, 300)} קמ״ש` : '--'}
                </td>
                <td data-ev-id="ev_fba7096bf4" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.pressure, 1100, 2) !== '--' ? `${formatValue(record.pressure, 1100, 2)} hPa` : '--'}
                </td>
                <td data-ev-id="ev_c07ef788f6" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.precip_rate, 500, 2) !== '--' ? `${formatValue(record.precip_rate, 500, 2)} מ״מ` : '--'}
                </td>
                <td data-ev-id="ev_51884b7a22" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.precip_total, 2000, 2) !== '--' ? `${formatValue(record.precip_total, 2000, 2)} מ״מ` : '--'}
                </td>
                <td data-ev-id="ev_45696a901b" className="px-4 py-2.5 text-slate-300">
                  {formatValue(record.uv_index, 20, 0) !== '--' ? formatValue(record.uv_index, 20, 0) : '--'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}