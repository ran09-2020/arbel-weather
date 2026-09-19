import { useMemo } from 'react';
import { CloudRain, Calendar, TrendingUp, Droplets, Download, Loader2 } from 'lucide-react';

interface WeatherRecord {
  recorded_at: string;
  precip_total: number | null;
}

interface MonthlyRainSummaryProps {
  data: WeatherRecord[];
  onImport?: () => void;
  isImporting?: boolean;
  importProgress?: {current: number;total: number;} | null;
}

interface DailyData {
  date: string;
  totalRain: number;
}

interface MonthlyData {
  month: string;
  monthKey: string;
  year: number;
  totalRain: number;
  daysWithRain: number;
  maxDailyRain: number;
  dailyBreakdown: DailyData[];
}

const HEBREW_MONTHS = [
'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];


// Get local date string (YYYY-MM-DD) for Israel timezone
function getLocalDateKey(isoString: string): string {
  const date = new Date(isoString);
  // Format as local date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function MonthlyRainSummary({ data, onImport, isImporting, importProgress }: MonthlyRainSummaryProps) {
  const { monthlyData, debugInfo } = useMemo(() => {
    // Debug info
    const totalRecords = data.length;
    const recordsWithPrecip = data.filter((r) => r.precip_total !== null && r.precip_total > 0).length;
    const dateRange = data.length > 0 ? {
      from: new Date(data[0].recorded_at).toLocaleDateString('he-IL'),
      to: new Date(data[data.length - 1].recorded_at).toLocaleDateString('he-IL')
    } : null;

    // Group data by LOCAL day first, then find max precip_total for each day
    const dailyMaxByDate: Record<string, number> = {};

    data.forEach((record) => {
      if (record.precip_total === null || record.precip_total === undefined) return;
      if (record.precip_total < 0) return; // Invalid data

      const dateKey = getLocalDateKey(record.recorded_at);

      // Keep the max precip_total for each day (it's cumulative within the day)
      if (dailyMaxByDate[dateKey] === undefined || record.precip_total > dailyMaxByDate[dateKey]) {
        dailyMaxByDate[dateKey] = record.precip_total;
      }
    });

    // Debug: log daily totals
    console.log('Daily rain totals:', dailyMaxByDate);

    // Now aggregate by month
    const monthlyTotals: Record<string, MonthlyData> = {};

    Object.entries(dailyMaxByDate).forEach(([dateKey, dailyTotal]) => {
      const [yearStr, monthStr] = dateKey.split('-');
      const year = parseInt(yearStr);
      const month = parseInt(monthStr) - 1; // 0-indexed
      const monthKey = `${year}-${monthStr}`;

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = {
          month: HEBREW_MONTHS[month],
          monthKey,
          year,
          totalRain: 0,
          daysWithRain: 0,
          maxDailyRain: 0,
          dailyBreakdown: []
        };
      }

      monthlyTotals[monthKey].totalRain += dailyTotal;
      monthlyTotals[monthKey].dailyBreakdown.push({ date: dateKey, totalRain: dailyTotal });

      if (dailyTotal > 0.1) {// More than 0.1mm counts as a rainy day
        monthlyTotals[monthKey].daysWithRain += 1;
      }
      if (dailyTotal > monthlyTotals[monthKey].maxDailyRain) {
        monthlyTotals[monthKey].maxDailyRain = dailyTotal;
      }
    });

    // Debug: log monthly totals
    console.log('Monthly totals:', monthlyTotals);

    // Sort by date descending (newest first)
    const sorted = Object.values(monthlyTotals).sort((a, b) =>
    b.monthKey.localeCompare(a.monthKey)
    );

    return {
      monthlyData: sorted,
      debugInfo: {
        totalRecords,
        recordsWithPrecip,
        dateRange,
        daysWithData: Object.keys(dailyMaxByDate).length
      }
    };
  }, [data]);

  const currentMonthData = monthlyData[0];
  const totalYearRain = monthlyData.
  filter((m) => m.year === new Date().getFullYear()).
  reduce((sum, m) => sum + m.totalRain, 0);

  if (monthlyData.length === 0) {
    return (
      <div data-ev-id="ev_f848cd9e4e" className="text-center py-16 text-gray-400">
        <CloudRain className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p data-ev-id="ev_39256c911a" className="text-lg">אין נתוני משקעים זמינים</p>
        <p data-ev-id="ev_5e9296b46b" className="text-sm mt-2 mb-6">ניתן לייבא נתונים היסטוריים מ-Weather Underground</p>
        {onImport &&
        <button data-ev-id="ev_7019f26b52"
        onClick={onImport}
        disabled={isImporting}
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white font-medium rounded-lg transition-colors flex items-center gap-2 mx-auto">

            {isImporting ?
          <>
                <Loader2 className="w-5 h-5 animate-spin" />
                מייבא נתונים...
                {importProgress && ` (${importProgress.current}/${importProgress.total})`}
              </> :

          <>
                <Download className="w-5 h-5" />
                ייבוא 12 חודשים אחרונים
              </>
          }
          </button>
        }
      </div>);

  }

  return (
    <div data-ev-id="ev_e46900608f" className="flex flex-col gap-6" dir="rtl">
      {/* Import Button */}
      {onImport &&
      <div data-ev-id="ev_c1b38aa6c2" className="flex justify-end">
          <button data-ev-id="ev_b4ac3349ca"
        onClick={onImport}
        disabled={isImporting}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">

            {isImporting ?
          <>
                <Loader2 className="w-4 h-4 animate-spin" />
                מייבא... {importProgress && `(${importProgress.current}/${importProgress.total})`}
              </> :

          <>
                <Download className="w-4 h-4" />
                עדכון נתונים מ-WU
              </>
          }
          </button>
        </div>
      }

      {/* Summary Cards */}
      <div data-ev-id="ev_52b850772c" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current Month */}
        {currentMonthData &&
        <div data-ev-id="ev_5e8de8876b" className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-5 border border-blue-400/30">
            <div data-ev-id="ev_3af3c68438" className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span data-ev-id="ev_36cb814bc0" className="text-blue-300 text-sm font-medium">החודש ({currentMonthData.month} {currentMonthData.year})</span>
            </div>
            <div data-ev-id="ev_2980d1f971" className="text-3xl font-bold text-white">
              {currentMonthData.totalRain.toFixed(1)} <span data-ev-id="ev_432119b212" className="text-lg text-white/70">מ״מ</span>
            </div>
            <p data-ev-id="ev_daf3ee81e7" className="text-blue-300/70 text-sm mt-1">
              {currentMonthData.daysWithRain} ימים עם גשם
            </p>
          </div>
        }

        {/* Year Total */}
        <div data-ev-id="ev_c72aa6c1d9" className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl p-5 border border-violet-400/30">
          <div data-ev-id="ev_c0105f7731" className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <span data-ev-id="ev_62c833b08b" className="text-violet-300 text-sm font-medium">סה״כ השנה ({new Date().getFullYear()})</span>
          </div>
          <div data-ev-id="ev_a12e9ce2be" className="text-3xl font-bold text-white">
            {totalYearRain.toFixed(1)} <span data-ev-id="ev_3ebbf982ac" className="text-lg text-white/70">מ״מ</span>
          </div>
        </div>

        {/* Max Daily */}
        {currentMonthData &&
        <div data-ev-id="ev_140254fc30" className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-5 border border-emerald-400/30">
            <div data-ev-id="ev_5cfb83725d" className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-emerald-400" />
              <span data-ev-id="ev_f5c952f6bb" className="text-emerald-300 text-sm font-medium">שיא יומי החודש</span>
            </div>
            <div data-ev-id="ev_d60d36f86e" className="text-3xl font-bold text-white">
              {currentMonthData.maxDailyRain.toFixed(1)} <span data-ev-id="ev_9b3517f09c" className="text-lg text-white/70">מ״מ</span>
            </div>
          </div>
        }
      </div>

      {/* Monthly Table */}
      <div data-ev-id="ev_c02df3c33f" className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div data-ev-id="ev_10a77c8595" className="px-5 py-4 border-b border-white/10">
          <h3 data-ev-id="ev_8eb9ee4777" className="text-lg font-semibold text-white flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            סיכום משקעים חודשי
          </h3>
        </div>
        <div data-ev-id="ev_9d67d8dc20" className="overflow-x-auto">
          <table data-ev-id="ev_73d5fb7122" className="w-full">
            <thead data-ev-id="ev_57422b4d71">
              <tr data-ev-id="ev_a29f39f8c8" className="bg-white/5">
                <th data-ev-id="ev_dc34176250" className="px-5 py-3 text-right text-sm font-medium text-gray-400">חודש</th>
                <th data-ev-id="ev_5cdc451c84" className="px-5 py-3 text-right text-sm font-medium text-gray-400">שנה</th>
                <th data-ev-id="ev_6db0bef623" className="px-5 py-3 text-right text-sm font-medium text-gray-400">סה״כ גשם</th>
                <th data-ev-id="ev_20d6e86e32" className="px-5 py-3 text-right text-sm font-medium text-gray-400">ימים עם גשם</th>
                <th data-ev-id="ev_b4f049ef55" className="px-5 py-3 text-right text-sm font-medium text-gray-400">שיא יומי</th>
                <th data-ev-id="ev_95bf467595" className="px-5 py-3 text-right text-sm font-medium text-gray-400">ויזואלי</th>
              </tr>
            </thead>
            <tbody data-ev-id="ev_65166e78ca">
              {monthlyData.map((month, index) => {
                const maxRain = Math.max(...monthlyData.map((m) => m.totalRain), 1);
                const barWidth = month.totalRain / maxRain * 100;

                return (
                  <tr data-ev-id="ev_e30edf2618"
                  key={month.monthKey}
                  className={`border-t border-white/5 ${index === 0 ? 'bg-cyan-500/10' : 'hover:bg-white/5'} transition-colors`}>

                    <td data-ev-id="ev_63604aa987" className="px-5 py-4 text-white font-medium">
                      {month.month}
                      {index === 0 && <span data-ev-id="ev_385fd31911" className="mr-2 text-xs bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded">נוכחי</span>}
                    </td>
                    <td data-ev-id="ev_36f389db61" className="px-5 py-4 text-gray-300">{month.year}</td>
                    <td data-ev-id="ev_083e0910ce" className="px-5 py-4 text-white font-semibold">{month.totalRain.toFixed(1)} מ״מ</td>
                    <td data-ev-id="ev_bea2e27f80" className="px-5 py-4 text-gray-300">{month.daysWithRain}</td>
                    <td data-ev-id="ev_ceeb37a748" className="px-5 py-4 text-gray-300">{month.maxDailyRain.toFixed(1)} מ״מ</td>
                    <td data-ev-id="ev_cd77724609" className="px-5 py-4 w-32">
                      <div data-ev-id="ev_0e97933ea5" className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div data-ev-id="ev_e7d791350f"
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }} />

                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily breakdown for current month */}
      {currentMonthData && currentMonthData.dailyBreakdown.length > 0 &&
      <div data-ev-id="ev_91fa7e1641" className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div data-ev-id="ev_b8f3959d2b" className="px-5 py-4 border-b border-white/10">
            <h3 data-ev-id="ev_cabd5338ae" className="text-lg font-semibold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              פירוט יומי - {currentMonthData.month} {currentMonthData.year}
            </h3>
          </div>
          <div data-ev-id="ev_970ab68863" className="p-5">
            <div data-ev-id="ev_0d65e9dc0d" className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {currentMonthData.dailyBreakdown.
            sort((a, b) => b.date.localeCompare(a.date)).
            map((day) => {
              const dayNum = parseInt(day.date.split('-')[2]);
              const hasRain = day.totalRain > 0.1;
              return (
                <div data-ev-id="ev_78c493c2cc"
                key={day.date}
                className={`p-3 rounded-lg text-center ${hasRain ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-white/5 border border-white/10'}`}>

                      <div data-ev-id="ev_a32342cdfd" className="text-sm text-gray-400">{dayNum}</div>
                      <div data-ev-id="ev_40b5f1dc37" className={`text-lg font-bold ${hasRain ? 'text-blue-300' : 'text-gray-500'}`}>
                        {day.totalRain.toFixed(1)}
                      </div>
                      <div data-ev-id="ev_6ff86804f8" className="text-xs text-gray-500">מ״מ</div>
                    </div>);

            })}
            </div>
          </div>
        </div>
      }
    </div>);

}