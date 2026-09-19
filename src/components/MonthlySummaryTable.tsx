import { useMemo, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface WeatherRecord {
  recorded_at: string;
  temperature: number | null;
  dew_point: number | null;
  humidity: number | null;
  wind_speed: number | null;
  wind_gust: number | null;
  wind_direction: number | null;
  pressure: number | null;
  precip_total: number | null;
}

interface MonthlySummaryTableProps {
  data: WeatherRecord[];
}

const HEBREW_MONTHS = [
'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];


function getWindDirectionName(degrees: number | null): string {
  if (degrees === null) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function calcStats(values: (number | null)[]) {
  const validValues = values.filter((v): v is number => v !== null && !isNaN(v));
  if (validValues.length === 0) return { high: null, low: null, avg: null };

  return {
    high: Math.max(...validValues),
    low: Math.min(...validValues),
    avg: validValues.reduce((a, b) => a + b, 0) / validValues.length
  };
}

function formatValue(value: number | null, decimals: number = 1, suffix: string = ''): string {
  if (value === null) return '--';
  return `${value.toFixed(decimals)}${suffix}`;
}

export function MonthlySummaryTable({ data }: MonthlySummaryTableProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    data.forEach((record) => {
      const date = new Date(record.recorded_at);
      months.add(`${date.getFullYear()}-${date.getMonth()}`);
    });
    return Array.from(months).map((m) => {
      const [year, month] = m.split('-').map(Number);
      return { year, month };
    }).sort((a, b) => b.year - a.year || b.month - a.month);
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((record) => {
      const date = new Date(record.recorded_at);
      return date.getMonth() === selectedMonth.month && date.getFullYear() === selectedMonth.year;
    });
  }, [data, selectedMonth]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    // Get daily max precip_total (it's cumulative per day)
    const dailyPrecip: Record<string, number> = {};
    filteredData.forEach((record) => {
      if (record.precip_total === null) return;
      const date = new Date(record.recorded_at);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (!dailyPrecip[dateKey] || record.precip_total > dailyPrecip[dateKey]) {
        dailyPrecip[dateKey] = record.precip_total;
      }
    });
    const totalPrecip = Object.values(dailyPrecip).reduce((a, b) => a + b, 0);

    // Get days with rain (> 0.1mm)
    const rainyDays = Object.entries(dailyPrecip).
    filter(([_, amount]) => amount > 0.1).
    map(([date, amount]) => ({ date, amount })).
    sort((a, b) => a.date.localeCompare(b.date));

    // Calculate average wind direction
    const windDirs = filteredData.map((r) => r.wind_direction).filter((v): v is number => v !== null);
    const avgWindDir = windDirs.length > 0 ?
    windDirs.reduce((a, b) => a + b, 0) / windDirs.length :
    null;

    return {
      temperature: calcStats(filteredData.map((r) => r.temperature)),
      dewPoint: calcStats(filteredData.map((r) => r.dew_point)),
      humidity: calcStats(filteredData.map((r) => r.humidity)),
      precipitation: totalPrecip,
      rainyDays,
      windSpeed: calcStats(filteredData.map((r) => r.wind_speed)),
      windGust: calcStats(filteredData.map((r) => r.wind_gust)),
      windDirection: getWindDirectionName(avgWindDir),
      pressure: calcStats(filteredData.map((r) => r.pressure))
    };
  }, [filteredData]);

  const goToPrevMonth = () => {
    setSelectedMonth((prev) => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setSelectedMonth((prev) => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const isCurrentMonth = selectedMonth.month === new Date().getMonth() &&
  selectedMonth.year === new Date().getFullYear();

  // Get date range for display
  const startDate = new Date(selectedMonth.year, selectedMonth.month, 1);
  const endDate = new Date(selectedMonth.year, selectedMonth.month + 1, 0);

  return (
    <div data-ev-id="ev_d52f42c2fb" className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6">
      {/* Header with month selector */}
      <div data-ev-id="ev_164424394c" className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
        <button data-ev-id="ev_a662211129"
        onClick={goToPrevMonth}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors">

          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
        
        <div data-ev-id="ev_90c74cd067" className="text-center">
          <div data-ev-id="ev_4f83d02fe0" className="text-white font-bold text-lg">
            {HEBREW_MONTHS[selectedMonth.month]} {selectedMonth.year}
          </div>
          <div data-ev-id="ev_10d3e37638" className="text-gray-400 text-sm">
            {startDate.toLocaleDateString('he-IL')} - {endDate.toLocaleDateString('he-IL')}
          </div>
        </div>
        
        <button data-ev-id="ev_346f49a2fe"
        onClick={goToNextMonth}
        disabled={isCurrentMonth}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">

          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {!stats || filteredData.length === 0 ?
      <div data-ev-id="ev_fd274c0a16" className="p-8 text-center text-gray-400">
          אין נתונים לחודש זה
        </div> :
      <>
        <div data-ev-id="ev_d2c157162b" className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 p-4" dir="rtl">
          {/* Left Table */}
          <div data-ev-id="ev_b371100f2e" className="overflow-x-auto">
            <table data-ev-id="ev_050c7dd92a" className="w-full text-sm">
              <thead data-ev-id="ev_3c5eab5cde">
                <tr data-ev-id="ev_dde2543cb1" className="text-gray-400">
                  <th data-ev-id="ev_eb76fa6be5" className="text-right py-2 px-3 font-medium"></th>
                  <th data-ev-id="ev_00c49ab49e" className="text-right py-2 px-3 font-medium">מקס׳</th>
                  <th data-ev-id="ev_033fb61f47" className="text-right py-2 px-3 font-medium">מינ׳</th>
                  <th data-ev-id="ev_8c1a918bc6" className="text-right py-2 px-3 font-medium">ממוצע</th>
                </tr>
              </thead>
              <tbody data-ev-id="ev_a46cd9e855">
                <tr data-ev-id="ev_458a0fcda9" className="border-t border-white/5">
                  <td data-ev-id="ev_50fac9d30b" className="py-3 px-3 text-gray-300 font-medium">טמפרטורה</td>
                  <td data-ev-id="ev_7afb567e1b" className="py-3 px-3 text-cyan-400">{formatValue(stats.temperature.high, 1, ' °C')}</td>
                  <td data-ev-id="ev_cad4931263" className="py-3 px-3 text-blue-400">{formatValue(stats.temperature.low, 1, ' °C')}</td>
                  <td data-ev-id="ev_c12172a219" className="py-3 px-3 text-gray-300">{formatValue(stats.temperature.avg, 1, ' °C')}</td>
                </tr>
                <tr data-ev-id="ev_7a7b61fe6c" className="border-t border-white/5">
                  <td data-ev-id="ev_9a784d0025" className="py-3 px-3 text-gray-300 font-medium">נקודת טל</td>
                  <td data-ev-id="ev_a72bbb3754" className="py-3 px-3 text-cyan-400">{formatValue(stats.dewPoint.high, 1, ' °C')}</td>
                  <td data-ev-id="ev_f19287dbfe" className="py-3 px-3 text-blue-400">{formatValue(stats.dewPoint.low, 1, ' °C')}</td>
                  <td data-ev-id="ev_81b62d50e7" className="py-3 px-3 text-gray-300">{formatValue(stats.dewPoint.avg, 1, ' °C')}</td>
                </tr>
                <tr data-ev-id="ev_7c4baf4fae" className="border-t border-white/5">
                  <td data-ev-id="ev_d54114b6a0" className="py-3 px-3 text-gray-300 font-medium">לחות</td>
                  <td data-ev-id="ev_bd8a86431e" className="py-3 px-3 text-cyan-400">{formatValue(stats.humidity.high, 0, ' %')}</td>
                  <td data-ev-id="ev_d587968a80" className="py-3 px-3 text-blue-400">{formatValue(stats.humidity.low, 0, ' %')}</td>
                  <td data-ev-id="ev_381380739e" className="py-3 px-3 text-gray-300">{formatValue(stats.humidity.avg, 0, ' %')}</td>
                </tr>
                <tr data-ev-id="ev_c725a4fc23" className="border-t border-white/5">
                  <td data-ev-id="ev_ddbc67a8b1" className="py-3 px-3 text-gray-300 font-medium">משקעים</td>
                  <td data-ev-id="ev_09db6c6372" className="py-3 px-3 text-cyan-400">{formatValue(stats.precipitation, 2, ' מ״מ')}</td>
                  <td data-ev-id="ev_b5be19757d" className="py-3 px-3 text-gray-500">--</td>
                  <td data-ev-id="ev_2ef04d7f7c" className="py-3 px-3 text-gray-500">--</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Table */}
          <div data-ev-id="ev_eb37b3f31c" className="overflow-x-auto border-t md:border-t-0 md:border-r border-white/10 md:pr-4">
            <table data-ev-id="ev_2f4519ff9d" className="w-full text-sm">
              <thead data-ev-id="ev_94b37cfa0b">
                <tr data-ev-id="ev_67ffa09ea7" className="text-gray-400">
                  <th data-ev-id="ev_cffac9cf11" className="text-right py-2 px-3 font-medium"></th>
                  <th data-ev-id="ev_48d96ff223" className="text-right py-2 px-3 font-medium">מקס׳</th>
                  <th data-ev-id="ev_1af787db01" className="text-right py-2 px-3 font-medium">מינ׳</th>
                  <th data-ev-id="ev_ea3cdd463c" className="text-right py-2 px-3 font-medium">ממוצע</th>
                </tr>
              </thead>
              <tbody data-ev-id="ev_af0cb25f51">
                <tr data-ev-id="ev_6cbb747201" className="border-t border-white/5">
                  <td data-ev-id="ev_ac14b4bf3e" className="py-3 px-3 text-gray-300 font-medium">מהירות רוח</td>
                  <td data-ev-id="ev_c92e6bde77" className="py-3 px-3 text-cyan-400">{formatValue(stats.windSpeed.high, 1, ' קמ״ש')}</td>
                  <td data-ev-id="ev_1649c114db" className="py-3 px-3 text-blue-400">{formatValue(stats.windSpeed.low, 1, ' קמ״ש')}</td>
                  <td data-ev-id="ev_b36fd9d628" className="py-3 px-3 text-gray-300">{formatValue(stats.windSpeed.avg, 1, ' קמ״ש')}</td>
                </tr>
                <tr data-ev-id="ev_77db8d4bdc" className="border-t border-white/5">
                  <td data-ev-id="ev_09e5499d98" className="py-3 px-3 text-gray-300 font-medium">משב רוח</td>
                  <td data-ev-id="ev_a803e2d544" className="py-3 px-3 text-cyan-400">{formatValue(stats.windGust.high, 1, ' קמ״ש')}</td>
                  <td data-ev-id="ev_e3cb4c87e3" className="py-3 px-3 text-gray-500">--</td>
                  <td data-ev-id="ev_7f2405f58f" className="py-3 px-3 text-gray-300">{formatValue(stats.windGust.avg, 1, ' קמ״ש')}</td>
                </tr>
                <tr data-ev-id="ev_b143973dcb" className="border-t border-white/5">
                  <td data-ev-id="ev_6faf75e0e1" className="py-3 px-3 text-gray-300 font-medium">כיוון רוח</td>
                  <td data-ev-id="ev_e0454b0792" className="py-3 px-3 text-gray-500">--</td>
                  <td data-ev-id="ev_d23fe7e90b" className="py-3 px-3 text-gray-500">--</td>
                  <td data-ev-id="ev_8f560ebad0" className="py-3 px-3 text-gray-300">{stats.windDirection}</td>
                </tr>
                <tr data-ev-id="ev_54e97ee2b0" className="border-t border-white/5">
                  <td data-ev-id="ev_883726ec5e" className="py-3 px-3 text-gray-300 font-medium">לחץ אוויר</td>
                  <td data-ev-id="ev_b61f63d432" className="py-3 px-3 text-cyan-400">{formatValue(stats.pressure.high, 2, ' hPa')}</td>
                  <td data-ev-id="ev_377dad0bb0" className="py-3 px-3 text-blue-400">{formatValue(stats.pressure.low, 2, ' hPa')}</td>
                  <td data-ev-id="ev_b83e617c9a" className="py-3 px-3 text-gray-500">--</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Rainy Days Breakdown */}
        {stats.rainyDays && stats.rainyDays.length > 0 &&
        <div data-ev-id="ev_201a389dea" className="px-4 pb-4">
            <div data-ev-id="ev_5d09238572" className="border-t border-white/10 pt-4">
              <h4 data-ev-id="ev_3d5f2441dc" className="text-sm font-medium text-gray-400 mb-3">ימים עם משקעים ({stats.rainyDays.length} ימים)</h4>
              <div data-ev-id="ev_9f033a39cc" className="flex flex-wrap gap-2">
                {stats.rainyDays.map((day) => {
                const dayNum = parseInt(day.date.split('-')[2]);
                return (
                  <div data-ev-id="ev_c20a14a4a6"
                  key={day.date}
                  className="bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-2 text-center min-w-[70px]">

                      <div data-ev-id="ev_826eaa8e81" className="text-xs text-gray-400">{dayNum}/{selectedMonth.month + 1}</div>
                      <div data-ev-id="ev_5361775207" className="text-lg font-bold text-blue-300">{day.amount.toFixed(1)}</div>
                      <div data-ev-id="ev_f383590550" className="text-xs text-gray-500">מ״מ</div>
                    </div>);

              })}
              </div>
            </div>
          </div>
        }
      </>
      }
    </div>);

}