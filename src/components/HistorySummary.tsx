import { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Download } from 'lucide-react';
import { fetchHistoricalData } from '@/services/weatherService';
import type { HistoricalObservation } from '@/services/weatherService';

type ViewMode = 'daily' | 'weekly' | 'monthly' | 'yearly';

const HEBREW_MONTHS = [
'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];


const MODE_LABELS: Record<ViewMode, string> = {
  daily: 'יומי',
  weekly: 'שבועי',
  monthly: 'חודשי',
  yearly: 'שנתי'
};

const WIND_DIRECTIONS_HEBREW: Record<string, string> = {
  'N': 'צפון',
  'NNE': 'צפון-צפון-מזרח',
  'NE': 'צפון-מזרח',
  'ENE': 'מזרח-צפון-מזרח',
  'E': 'מזרח',
  'ESE': 'מזרח-דרום-מזרח',
  'SE': 'דרום-מזרח',
  'SSE': 'דרום-דרום-מזרח',
  'S': 'דרום',
  'SSW': 'דרום-דרום-מערב',
  'SW': 'דרום-מערב',
  'WSW': 'מערב-דרום-מערב',
  'W': 'מערב',
  'WNW': 'מערב-צפון-מערב',
  'NW': 'צפון-מערב',
  'NNW': 'צפון-צפון-מערב'
};

function getWindDirectionName(degrees: number | null): string {
  if (degrees === null) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function getWindDirectionHebrew(degrees: number | null): string {
  const dir = getWindDirectionName(degrees);
  return WIND_DIRECTIONS_HEBREW[dir] || dir;
}

function formatValue(value: number | null | undefined, decimals: number = 1, suffix: string = ''): string {
  if (value === null || value === undefined) return '--';
  return `${value.toFixed(decimals)}${suffix}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Get background color based on rain amount (gradient from light to dark blue)
function getRainCardStyle(amount: number, maxAmount: number): {background: string;borderColor: string;} {
  const intensity = Math.min(amount / Math.max(maxAmount, 1), 1);
  // From light blue (#1e3a5f) to dark blue (#0c4a6e)
  const r = Math.round(30 - intensity * 20);
  const g = Math.round(58 + intensity * 16);
  const b = Math.round(95 + intensity * 15);
  const alpha = 0.3 + intensity * 0.5;
  return {
    background: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    borderColor: `rgba(96, 165, 250, ${0.3 + intensity * 0.4})`
  };
}

interface SummaryData {
  temperature: {high: number | null;low: number | null;avg: number | null;};
  dewPoint: {high: number | null;low: number | null;avg: number | null;};
  humidity: {high: number | null;low: number | null;avg: number | null;};
  precipitation: {total: number;maxRate: number | null;};
  windSpeed: {high: number | null;low: number | null;avg: number | null;};
  windGust: {high: number | null;avg: number | null;};
  windDirection: {degrees: number | null;name: string;hebrew: string;};
  pressure: {high: number | null;low: number | null;avg: number | null;};
  uv: {high: number | null;avg: number | null;};
  hotDays: number; // days > 30°C
  coldDays: number; // days < 10°C
  dateRange: {start: string;end: string;};
  actualDateRange: {start: string;end: string;}; // Actual data found
  daysWithData: number;
  totalDaysInPeriod: number;
  rainyDays: {date: string;fullDate: string;amount: number;}[];
  raniestDay: {date: string;amount: number;} | null;
  periodLabel: string;
}

export function HistorySummary() {
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [csvContentDataOnly, setCsvContentDataOnly] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setLoadingProgress('');

    try {
      let startDate: Date;
      let endDate: Date;
      let periodLabel: string;

      if (viewMode === 'daily') {
        startDate = new Date(selectedYear, selectedMonth, selectedDay);
        endDate = startDate;
        periodLabel = `${selectedDay} ${HEBREW_MONTHS[selectedMonth]} ${selectedYear}`;
      } else if (viewMode === 'weekly') {
        startDate = new Date(selectedYear, selectedMonth, selectedDay);
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        periodLabel = `שבוע ${startDate.toLocaleDateString('he-IL')} - ${endDate.toLocaleDateString('he-IL')}`;
      } else if (viewMode === 'monthly') {
        startDate = new Date(selectedYear, selectedMonth, 1);
        endDate = new Date(selectedYear, selectedMonth + 1, 0);
        periodLabel = `${HEBREW_MONTHS[selectedMonth]} ${selectedYear}`;
      } else {
        // Yearly - Rain year in Israel: August 1 to July 31
        // selectedYear represents the END year of the rain year
        // e.g., "שנת גשם 2024" = August 1 of previous year to July 31, 2024
        startDate = new Date(selectedYear - 1, 7, 1); // August 1 of previous year
        endDate = new Date(selectedYear, 6, 31); // July 31 of selected year
        periodLabel = `שנת גשם ${selectedYear - 1}/${selectedYear}`;
      }

      const dailyData: HistoricalObservation[] = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Determine actual end date (can't fetch future data)
      const actualEndDate = endDate <= today ? endDate : today;
      
      // DEBUG: Log date range calculation
      console.log('=== DATE RANGE DEBUG ===');
      console.log('startDate:', startDate.toISOString());
      console.log('endDate:', endDate.toISOString());
      console.log('today:', today.toISOString());
      console.log('actualEndDate:', actualEndDate.toISOString());
      console.log('========================');

      // Scan BACKWARDS from end date to start date
      // This way we find recent data first and stop when we hit a gap before the station started
      const currentDate = new Date(actualEndDate);

      // Track consecutive failures to exit early if no data exists
      let consecutiveFailures = 0;
      const MAX_CONSECUTIVE_FAILURES = 14; // 2 weeks of no data = stop

      const totalDays = Math.ceil((actualEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      let fetchedDays = 0;

      while (currentDate >= startDate) {
        const dateStr = `${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}`;

        // Update progress
        fetchedDays++;
        if (viewMode === 'yearly' || viewMode === 'monthly') {
          setLoadingProgress(`${fetchedDays}/${totalDays} ימים (${Math.round(fetchedDays / totalDays * 100)}%)`);
        }

        try {
          const data = await fetchHistoricalData(dateStr);
          console.log(`[${dateStr}] fetchHistoricalData returned:`, data ? 'DATA' : 'NULL');
          
          if (data) {
            console.log(`[${dateStr}] obsTimeLocal=${data.obsTimeLocal}, obsTimeUtc=${data.obsTimeUtc}`);
            
            // Check for duplicates - only add if this date doesn't already exist
            const dataDate = new Date(data.obsTimeLocal || data.obsTimeUtc).toDateString();
            const isDuplicate = dailyData.some(d => {
              const existingDate = new Date(d.obsTimeLocal || d.obsTimeUtc).toDateString();
              return existingDate === dataDate;
            });
            
            console.log(`[${dateStr}] dataDate=${dataDate}, isDuplicate=${isDuplicate}, dailyData.length=${dailyData.length}`);
            
            if (!isDuplicate) {
              dailyData.push(data);
              console.log(`[${dateStr}] ADDED to dailyData`);
            } else {
              console.log(`[${dateStr}] SKIPPED as duplicate`);
            }
            consecutiveFailures = 0; // Reset on success
          } else {
            console.log(`[${dateStr}] No data returned`);
            consecutiveFailures++;
          }
        } catch (err) {
          console.error(`[${dateStr}] ERROR:`, err);
          consecutiveFailures++;
        }

        // Exit early if we found data before but now hit a long gap (reached before station started)
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES && dailyData.length > 0) {
          break;
        }

        // If no data at all after scanning reasonable portion, give up
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES * 3 && dailyData.length === 0) {
          setError(`לא נמצאו נתונים לתקופה זו`);
          setSummaryData(null);
          setLoadingProgress('');
          return;
        }

        currentDate.setDate(currentDate.getDate() - 1); // Go backwards

        // Shorter delay for faster modes
        const delay = viewMode === 'yearly' ? 30 : viewMode === 'monthly' ? 50 : 100;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      setLoadingProgress('');

      // Sort data chronologically (since we fetched backwards)
      dailyData.sort((a, b) => {
        const dateA = new Date(a.obsTimeLocal || a.obsTimeUtc);
        const dateB = new Date(b.obsTimeLocal || b.obsTimeUtc);
        return dateA.getTime() - dateB.getTime();
      });

      if (dailyData.length === 0) {
        setError('לא נמצאו נתונים לתקופה זו');
        setSummaryData(null);
        return;
      }

      // Aggregate the data
      const temps = dailyData.map((d) => d.metric?.tempHigh).filter((v): v is number => v !== null && v !== undefined);
      const tempsLow = dailyData.map((d) => d.metric?.tempLow).filter((v): v is number => v !== null && v !== undefined);
      const tempsAvg = dailyData.map((d) => d.metric?.tempAvg).filter((v): v is number => v !== null && v !== undefined);

      const dewHigh = dailyData.map((d) => d.metric?.dewptHigh).filter((v): v is number => v !== null && v !== undefined);
      const dewLow = dailyData.map((d) => d.metric?.dewptLow).filter((v): v is number => v !== null && v !== undefined);
      const dewAvg = dailyData.map((d) => d.metric?.dewptAvg).filter((v): v is number => v !== null && v !== undefined);

      const humHigh = dailyData.map((d) => d.humidityHigh).filter((v): v is number => v !== null && v !== undefined);
      const humLow = dailyData.map((d) => d.humidityLow).filter((v): v is number => v !== null && v !== undefined);
      const humAvg = dailyData.map((d) => d.humidityAvg).filter((v): v is number => v !== null && v !== undefined);

      const windHigh = dailyData.map((d) => d.metric?.windspeedHigh).filter((v): v is number => v !== null && v !== undefined);
      const windLow = dailyData.map((d) => d.metric?.windspeedLow).filter((v): v is number => v !== null && v !== undefined);
      const windAvg = dailyData.map((d) => d.metric?.windspeedAvg).filter((v): v is number => v !== null && v !== undefined);

      const gustHigh = dailyData.map((d) => d.metric?.windgustHigh).filter((v): v is number => v !== null && v !== undefined);
      const gustAvg = dailyData.map((d) => d.metric?.windgustAvg).filter((v): v is number => v !== null && v !== undefined);

      const pressureHigh = dailyData.map((d) => d.metric?.pressureMax).filter((v): v is number => v !== null && v !== undefined);
      const pressureLow = dailyData.map((d) => d.metric?.pressureMin).filter((v): v is number => v !== null && v !== undefined);

      const uvHigh = dailyData.map((d) => d.uvHigh).filter((v): v is number => v !== null && v !== undefined);

      const windDirs = dailyData.map((d) => d.winddirAvg).filter((v): v is number => v !== null && v !== undefined);

      // Precipitation - sum of daily totals
      const rainyDays: {date: string;fullDate: string;amount: number;}[] = [];
      let totalPrecip = 0;
      let maxPrecipRate: number | null = null;

      dailyData.forEach((d) => {
        const precip = d.metric?.precipTotal ?? 0;
        const rate = d.metric?.precipRate ?? null;
        if (rate !== null && (maxPrecipRate === null || rate > maxPrecipRate)) {
          maxPrecipRate = rate;
        }
        if (precip > 0.1) {
          const date = new Date(d.obsTimeLocal || d.obsTimeUtc);
          rainyDays.push({
            date: `${date.getDate()}/${date.getMonth() + 1}`,
            fullDate: date.toLocaleDateString('he-IL'),
            amount: precip
          });
        }
        totalPrecip += precip;
      });

      // Sort rainy days by date (chronological)
      rainyDays.sort((a, b) => {
        const [dayA, monthA] = a.date.split('/').map(Number);
        const [dayB, monthB] = b.date.split('/').map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      });

      // Find rainiest day
      const raniestDay = rainyDays.length > 0 ?
      rainyDays.reduce((max, day) => day.amount > max.amount ? day : max, rainyDays[0]) :
      null;

      // Count hot and cold days
      let hotDays = 0;
      let coldDays = 0;
      dailyData.forEach((d) => {
        const maxTemp = d.metric?.tempHigh;
        const minTemp = d.metric?.tempLow;
        if (maxTemp !== null && maxTemp !== undefined && maxTemp > 30) hotDays++;
        if (minTemp !== null && minTemp !== undefined && minTemp < 10) coldDays++;
      });

      const avgWindDir = windDirs.length > 0 ? windDirs.reduce((a, b) => a + b, 0) / windDirs.length : null;

      // Calculate actual date range from data
      const sortedDates = dailyData.map((d) => new Date(d.obsTimeLocal || d.obsTimeUtc)).sort((a, b) => a.getTime() - b.getTime());
      const actualStart = sortedDates[0];
      const actualEnd = sortedDates[sortedDates.length - 1];

      setSummaryData({
        temperature: {
          high: temps.length > 0 ? Math.max(...temps) : null,
          low: tempsLow.length > 0 ? Math.min(...tempsLow) : null,
          avg: tempsAvg.length > 0 ? tempsAvg.reduce((a, b) => a + b, 0) / tempsAvg.length : null
        },
        dewPoint: {
          high: dewHigh.length > 0 ? Math.max(...dewHigh) : null,
          low: dewLow.length > 0 ? Math.min(...dewLow) : null,
          avg: dewAvg.length > 0 ? dewAvg.reduce((a, b) => a + b, 0) / dewAvg.length : null
        },
        humidity: {
          high: humHigh.length > 0 ? Math.max(...humHigh) : null,
          low: humLow.length > 0 ? Math.min(...humLow) : null,
          avg: humAvg.length > 0 ? humAvg.reduce((a, b) => a + b, 0) / humAvg.length : null
        },
        precipitation: {
          total: totalPrecip,
          maxRate: maxPrecipRate
        },
        windSpeed: {
          high: windHigh.length > 0 ? Math.max(...windHigh) : null,
          low: windLow.length > 0 ? Math.min(...windLow) : null,
          avg: windAvg.length > 0 ? windAvg.reduce((a, b) => a + b, 0) / windAvg.length : null
        },
        windGust: {
          high: gustHigh.length > 0 ? Math.max(...gustHigh) : null,
          avg: gustAvg.length > 0 ? gustAvg.reduce((a, b) => a + b, 0) / gustAvg.length : null
        },
        windDirection: {
          degrees: avgWindDir,
          name: getWindDirectionName(avgWindDir),
          hebrew: getWindDirectionHebrew(avgWindDir)
        },
        pressure: {
          high: pressureHigh.length > 0 ? Math.max(...pressureHigh) : null,
          low: pressureLow.length > 0 ? Math.min(...pressureLow) : null,
          avg: pressureHigh.length > 0 && pressureLow.length > 0 ?
          (Math.max(...pressureHigh) + Math.min(...pressureLow)) / 2 :
          null
        },
        uv: {
          high: uvHigh.length > 0 ? Math.max(...uvHigh) : null,
          avg: uvHigh.length > 0 ? uvHigh.reduce((a, b) => a + b, 0) / uvHigh.length : null
        },
        hotDays,
        coldDays,
        dateRange: {
          start: startDate.toLocaleDateString('he-IL'),
          end: actualEndDate.toLocaleDateString('he-IL')
        },
        actualDateRange: {
          start: actualStart.toLocaleDateString('he-IL'),
          end: actualEnd.toLocaleDateString('he-IL')
        },
        daysWithData: dailyData.length,
        totalDaysInPeriod: totalDays,
        rainyDays,
        raniestDay: raniestDay ? { date: raniestDay.date, amount: raniestDay.amount } : null,
        periodLabel
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  }, [viewMode, selectedYear, selectedMonth, selectedDay]);

  const exportToCSV = useCallback(() => {
    if (!summaryData) return;

    // Headers row - all metrics as columns
    const headers = [
    'תקופה',
    'תאריך התחלה',
    'תאריך סיום',
    'ימי נתונים',
    'טמפ\' מקס (°C)',
    'טמפ\' מינ (°C)',
    'טמפ\' ממוצע (°C)',
    'ימים חמים (>30°)',
    'ימים קרים (<10°)',
    'נק\' טל מקס (°C)',
    'נק\' טל מינ (°C)',
    'נק\' טל ממוצע (°C)',
    'לחות מקס (%)',
    'לחות מינ (%)',
    'לחות ממוצע (%)',
    'רוח מקס (קמ"ש)',
    'רוח מינ (קמ"ש)',
    'רוח ממוצע (קמ"ש)',
    'משב מקס (קמ"ש)',
    'משב ממוצע (קמ"ש)',
    'כיוון רוח',
    'לחץ מקס (hPa)',
    'לחץ מינ (hPa)',
    'לחץ ממוצע (hPa)',
    'UV מקס',
    'UV ממוצע',
    'גשם סה"כ (מ"מ)',
    'עוצמת גשם מקס (מ"מ/ש)',
    'ימים גשומים',
    'יום הכי גשום',
    'כמות ביום הכי גשום (מ"מ)'];


    // Data row - all values
    const values = [
    summaryData.periodLabel,
    summaryData.actualDateRange.start,
    summaryData.actualDateRange.end,
    summaryData.daysWithData,
    summaryData.temperature.high?.toFixed(1) ?? '',
    summaryData.temperature.low?.toFixed(1) ?? '',
    summaryData.temperature.avg?.toFixed(1) ?? '',
    summaryData.hotDays,
    summaryData.coldDays,
    summaryData.dewPoint.high?.toFixed(1) ?? '',
    summaryData.dewPoint.low?.toFixed(1) ?? '',
    summaryData.dewPoint.avg?.toFixed(1) ?? '',
    summaryData.humidity.high?.toFixed(0) ?? '',
    summaryData.humidity.low?.toFixed(0) ?? '',
    summaryData.humidity.avg?.toFixed(0) ?? '',
    summaryData.windSpeed.high?.toFixed(1) ?? '',
    summaryData.windSpeed.low?.toFixed(1) ?? '',
    summaryData.windSpeed.avg?.toFixed(1) ?? '',
    summaryData.windGust.high?.toFixed(1) ?? '',
    summaryData.windGust.avg?.toFixed(1) ?? '',
    summaryData.windDirection.hebrew,
    summaryData.pressure.high?.toFixed(1) ?? '',
    summaryData.pressure.low?.toFixed(1) ?? '',
    summaryData.pressure.avg?.toFixed(1) ?? '',
    summaryData.uv.high?.toFixed(0) ?? '',
    summaryData.uv.avg?.toFixed(1) ?? '',
    summaryData.precipitation.total.toFixed(1),
    summaryData.precipitation.maxRate?.toFixed(1) ?? '',
    summaryData.rainyDays.length,
    summaryData.raniestDay?.date ?? '',
    summaryData.raniestDay?.amount.toFixed(1) ?? ''];


    const headersLine = headers.join('\t');
    const dataLine = values.join('\t');

    setCsvContent(headersLine + '\n' + dataLine);
    setCsvContentDataOnly(dataLine);
    setShowCsvModal(true);
  }, [summaryData]);

  const copyToClipboard = useCallback((dataOnly: boolean = false) => {
    const content = dataOnly ? csvContentDataOnly : csvContent;
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert(dataOnly ? 'שורת הנתונים הועתקה!' : 'הועתק עם כותרות!');
  }, [csvContent, csvContentDataOnly]);

  const openInGoogleSheets = useCallback((dataOnly: boolean = false) => {
    const content = dataOnly ? csvContentDataOnly : csvContent;
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    window.open('https://docs.google.com/spreadsheets/create', '_blank');

    if (dataOnly) {
      alert('שורת הנתונים הועתקה!\n\nהדבק עם Ctrl+V בשורה הבאה בגיליון הקיים');
    } else {
      alert('הנתונים הועתקו!\n\n1. הדבק עם Ctrl+V\n2. להגדרת הגיליון מימין לשמאל:\n   קובץ > הגדרות גיליון אלקטרוני > כללי > אזור: ישראל');
    }
  }, [csvContent, csvContentDataOnly]);

  const goToPrev = () => {
    if (viewMode === 'yearly') {
      setSelectedYear((y) => y - 1);
    } else if (viewMode === 'monthly') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear((y) => y - 1);
      } else {
        setSelectedMonth((m) => m - 1);
      }
    } else if (viewMode === 'weekly') {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay - 7);
      setSelectedYear(newDate.getFullYear());
      setSelectedMonth(newDate.getMonth());
      setSelectedDay(newDate.getDate());
    } else {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay - 1);
      setSelectedYear(newDate.getFullYear());
      setSelectedMonth(newDate.getMonth());
      setSelectedDay(newDate.getDate());
    }
  };

  const goToNext = () => {
    const today = new Date();

    if (viewMode === 'yearly') {
      // For rain year: allow going to current rain year
      // Current rain year ends in July of current year or next year
      const currentMonth = today.getMonth();
      // If we're in Aug-Dec, current rain year ends next July (next calendar year)
      // If we're in Jan-Jul, current rain year ends this July (current calendar year)
      const currentRainYearEnd = currentMonth >= 7 ?
      today.getFullYear() + 1 :
      today.getFullYear();

      if (selectedYear < currentRainYearEnd) {
        setSelectedYear((y) => y + 1);
      }
    } else if (viewMode === 'monthly') {
      const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
      const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
      if (new Date(nextYear, nextMonth, 1) <= today) {
        setSelectedMonth(nextMonth);
        setSelectedYear(nextYear);
      }
    } else if (viewMode === 'weekly') {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay + 7);
      if (newDate <= today) {
        setSelectedYear(newDate.getFullYear());
        setSelectedMonth(newDate.getMonth());
        setSelectedDay(newDate.getDate());
      }
    } else {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay + 1);
      if (newDate <= today) {
        setSelectedYear(newDate.getFullYear());
        setSelectedMonth(newDate.getMonth());
        setSelectedDay(newDate.getDate());
      }
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1);

  const maxRainAmount = summaryData?.rainyDays.length ?
  Math.max(...summaryData.rainyDays.map((d) => d.amount)) :
  0;

  return (
    <div data-ev-id="ev_9c86352ea9" className="bg-white/5 rounded-xl border border-white/10 overflow-hidden mb-6">
      {/* Mode and Date Selector */}
      <div data-ev-id="ev_1077447806" className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-white/10 bg-white/5">
        {/* Right arrow - go to NEXT (forward in time) */}
        <button data-ev-id="ev_94814b610d"
        onClick={goToNext}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        title="הבא">

          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
        
        <div data-ev-id="ev_8cc2a10129" className="flex flex-wrap items-center gap-2" dir="rtl">
          {/* View Mode */}
          <select data-ev-id="ev_97648a9b14"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value as ViewMode)}
          className="bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option:hover]:bg-cyan-600 [&>option:checked]:bg-cyan-500">

            <option data-ev-id="ev_a25de94c99" value="daily">יומי</option>
            <option data-ev-id="ev_47518e8b0c" value="weekly">שבועי</option>
            <option data-ev-id="ev_f7af560d61" value="monthly">חודשי</option>
            <option data-ev-id="ev_21a7b0f85d" value="yearly">שנתי</option>
          </select>
          
          {/* Month - hidden for yearly */}
          {viewMode !== 'yearly' &&
          <select data-ev-id="ev_37d84697de"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option:hover]:bg-cyan-600 [&>option:checked]:bg-cyan-500">

              {HEBREW_MONTHS.map((month, i) =>
            <option data-ev-id="ev_25333b1836" key={i} value={i}>{month}</option>
            )}
            </select>
          }
          
          {/* Day - only for daily and weekly */}
          {(viewMode === 'daily' || viewMode === 'weekly') &&
          <select data-ev-id="ev_7902470ab7"
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          className="bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option:hover]:bg-cyan-600 [&>option:checked]:bg-cyan-500">

              {days.map((day) =>
            <option data-ev-id="ev_cbd49c9051" key={day} value={day}>{day}</option>
            )}
            </select>
          }
          
          {/* Year */}
          <select data-ev-id="ev_0706c8a6c5"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-gray-800 border border-white/20 rounded-lg px-3 py-2 text-white text-sm cursor-pointer [&>option]:bg-gray-800 [&>option]:text-white [&>option:hover]:bg-cyan-600 [&>option:checked]:bg-cyan-500">

            {years.map((year) =>
            <option data-ev-id="ev_ed977c396f" key={year} value={year}>
                {viewMode === 'yearly' ? `${year - 1}/${year}` : year}
              </option>
            )}
          </select>
          
          {/* View Button */}
          <button data-ev-id="ev_640c58460e"
          onClick={fetchData}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">

            {loading ?
            <>
                <Loader2 className="w-4 h-4 animate-spin" />
                טוען...
              </> :

            'הצג'
            }
          </button>

          {summaryData && !loading &&
          <button data-ev-id="ev_76cf069b29"
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          title="הצג נתונים להעתקה">

              <Download className="w-4 h-4" />
              ייצוא
            </button>
          }
        </div>
        
        {/* Left arrow - go to PREV (back in time) */}
        <button data-ev-id="ev_b2a6f34720"
        onClick={goToPrev}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        title="הקודם">

          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Period Label */}
      {summaryData &&
      <div data-ev-id="ev_ab023aa47c" className="px-4 py-3 text-center border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10">
          <h2 data-ev-id="ev_4cc843fb69" className="text-xl font-bold text-white">📊 דוח מזג אוויר - {summaryData.periodLabel}</h2>
          {summaryData.daysWithData < summaryData.totalDaysInPeriod ?
        <div data-ev-id="ev_ff0161d0aa" className="mt-1">
              <p data-ev-id="ev_4ba443bbb0" className="text-sm text-amber-400">
                ⚠️ נמצאו נתונים חלקיים: {summaryData.daysWithData} ימים מתוך {summaryData.totalDaysInPeriod}
              </p>
              <p data-ev-id="ev_7938f6fda4" className="text-xs text-gray-400">
                נתונים זמינים: {summaryData.actualDateRange.start} - {summaryData.actualDateRange.end}
              </p>
            </div> :

        <p data-ev-id="ev_8ecb1e15bb" className="text-sm text-gray-400 mt-1">{summaryData.dateRange.start} - {summaryData.dateRange.end}</p>
        }
        </div>
      }

      {/* Error */}
      {error &&
      <div data-ev-id="ev_bff4da81fc" className="p-4 text-center text-red-400">
          {error}
        </div>
      }

      {/* Loading */}
      {loading &&
      <div data-ev-id="ev_0de3aa169d" className="p-8 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <div data-ev-id="ev_c683ef7c0a">טוען נתונים היסטוריים...</div>
          {loadingProgress &&
        <div data-ev-id="ev_1ffd20255b" className="text-sm mt-2 text-cyan-400 font-medium">
              {loadingProgress}
            </div>
        }
          {viewMode === 'yearly' && !loadingProgress &&
        <div data-ev-id="ev_ea39d6e4ba" className="text-xs mt-2 text-gray-500">
              טעינת נתונים שנתיים עשויה להימשך עד דקה
            </div>
        }
        </div>
      }

      {/* Summary Content */}
      {summaryData && !loading &&
      <div data-ev-id="ev_b263701cdd" className="p-4" dir="rtl">
          {/* Main Stats Grid */}
          <div data-ev-id="ev_7c8e4c4ce2" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Temperature Section */}
            <div data-ev-id="ev_ee24e63f91" className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-4 border border-orange-500/20">
              <h3 data-ev-id="ev_09418f76e5" className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                🌡️ טמפרטורה
              </h3>
              <div data-ev-id="ev_75f5923603" className="grid grid-cols-3 gap-3 mb-4">
                <div data-ev-id="ev_6be07637f4" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_c667348b6d" className="text-xs text-gray-400 mb-1">מקסימום</div>
                  <div data-ev-id="ev_9880a2178a" className="text-base md:text-2xl font-bold text-red-400">{formatValue(summaryData.temperature.high, 1, '°')}</div>
                </div>
                <div data-ev-id="ev_30af5948f0" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_f25c0b8b69" className="text-xs text-gray-400 mb-1">מינימום</div>
                  <div data-ev-id="ev_6b4e2763a5" className="text-base md:text-2xl font-bold text-blue-400">{formatValue(summaryData.temperature.low, 1, '°')}</div>
                </div>
                <div data-ev-id="ev_7abed6bef9" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_37e257c5d5" className="text-xs text-gray-400 mb-1">ממוצע</div>
                  <div data-ev-id="ev_70dfd47792" className="text-base md:text-2xl font-bold text-gray-300">{formatValue(summaryData.temperature.avg, 1, '°')}</div>
                </div>
              </div>
              <div data-ev-id="ev_2cee249384" className="grid grid-cols-2 gap-3">
                <div data-ev-id="ev_66788b50fa" className="flex items-center gap-2 bg-red-500/20 rounded-lg p-3">
                  <span data-ev-id="ev_af158a8d62" className="text-2xl">🔥</span>
                  <div data-ev-id="ev_5237d75952">
                    <div data-ev-id="ev_048a6ff783" className="text-xs text-gray-400">ימים חמים (מעל 30°)</div>
                    <div data-ev-id="ev_d46636ed2e" className="text-sm md:text-xl font-bold text-red-300">{summaryData.hotDays} ימים</div>
                  </div>
                </div>
                <div data-ev-id="ev_bd0d2306b8" className="flex items-center gap-2 bg-blue-500/20 rounded-lg p-3">
                  <span data-ev-id="ev_5d00de2349" className="text-2xl">❄️</span>
                  <div data-ev-id="ev_a31f7a06b2">
                    <div data-ev-id="ev_cec61efc91" className="text-xs text-gray-400">ימים קרים (מתחת ל-10°)</div>
                    <div data-ev-id="ev_5a62c90f84" className="text-sm md:text-xl font-bold text-blue-300">{summaryData.coldDays} ימים</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dew Point Section */}
            <div data-ev-id="ev_5d8087ae83" className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl p-4 border border-teal-500/20">
              <h3 data-ev-id="ev_2bb0f56de7" className="text-lg font-bold text-teal-400 mb-3 flex items-center gap-2">
                💧 נקודת טל
              </h3>
              <div data-ev-id="ev_f90cfa581c" className="grid grid-cols-3 gap-3">
                <div data-ev-id="ev_96ca15ad9a" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_275fad72bc" className="text-xs text-gray-400 mb-1">מקסימום</div>
                  <div data-ev-id="ev_117d04e3a7" className="text-base md:text-2xl font-bold text-teal-400">{formatValue(summaryData.dewPoint.high, 1, '°')}</div>
                </div>
                <div data-ev-id="ev_19cf091562" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_8e2c2e909a" className="text-xs text-gray-400 mb-1">מינימום</div>
                  <div data-ev-id="ev_a30ea5693b" className="text-base md:text-2xl font-bold text-cyan-400">{formatValue(summaryData.dewPoint.low, 1, '°')}</div>
                </div>
                <div data-ev-id="ev_2ece0b7e6e" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_898d3f80d0" className="text-xs text-gray-400 mb-1">ממוצע</div>
                  <div data-ev-id="ev_beeaa4542f" className="text-base md:text-2xl font-bold text-gray-300">{formatValue(summaryData.dewPoint.avg, 1, '°')}</div>
                </div>
              </div>
            </div>

            {/* Humidity Section */}
            <div data-ev-id="ev_37cebcb6ac" className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl p-4 border border-blue-500/20">
              <h3 data-ev-id="ev_3a07c150cc" className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                💦 לחות
              </h3>
              <div data-ev-id="ev_c9ed8ff2b7" className="grid grid-cols-3 gap-3">
                <div data-ev-id="ev_b35cb8b6d9" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_53d4256bd1" className="text-xs text-gray-400 mb-1">מקסימום</div>
                  <div data-ev-id="ev_38a445bba0" className="text-base md:text-2xl font-bold text-blue-400">{formatValue(summaryData.humidity.high, 0, '%')}</div>
                </div>
                <div data-ev-id="ev_e390f9b0aa" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_fafe0ca8b9" className="text-xs text-gray-400 mb-1">מינימום</div>
                  <div data-ev-id="ev_53e4b9fa5f" className="text-base md:text-2xl font-bold text-indigo-400">{formatValue(summaryData.humidity.low, 0, '%')}</div>
                </div>
                <div data-ev-id="ev_620c57d991" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_72f23b6614" className="text-xs text-gray-400 mb-1">ממוצע</div>
                  <div data-ev-id="ev_7e2137597f" className="text-base md:text-2xl font-bold text-gray-300">{formatValue(summaryData.humidity.avg, 0, '%')}</div>
                </div>
              </div>
            </div>

            {/* Wind Section */}
            <div data-ev-id="ev_8fd8952528" className="bg-gradient-to-br from-slate-500/10 to-gray-500/10 rounded-xl p-4 border border-slate-500/20">
              <h3 data-ev-id="ev_e5fc0e5242" className="text-lg font-bold text-slate-300 mb-3 flex items-center gap-2">
                💨 רוח
              </h3>
              <div data-ev-id="ev_5514f4522e" className="grid grid-cols-2 gap-3 mb-3">
                <div data-ev-id="ev_a5ad28edf8" className="bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_d34f41c879" className="text-xs text-gray-400 mb-1">מהירות מקסימלית</div>
                  <div data-ev-id="ev_850b5a7f94" className="text-sm md:text-xl font-bold text-cyan-400">{formatValue(summaryData.windSpeed.high, 1, ' קמ״ש')}</div>
                </div>
                <div data-ev-id="ev_1cb8a8a993" className="bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_60b093a1c4" className="text-xs text-gray-400 mb-1">מהירות ממוצעת</div>
                  <div data-ev-id="ev_284de44e1a" className="text-sm md:text-xl font-bold text-gray-300">{formatValue(summaryData.windSpeed.avg, 1, ' קמ״ש')}</div>
                </div>
                <div data-ev-id="ev_67a469fddf" className="bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_791529d55e" className="text-xs text-gray-400 mb-1">משב מקסימלי (גסט)</div>
                  <div data-ev-id="ev_fe3e6cfa1e" className="text-sm md:text-xl font-bold text-amber-400">{formatValue(summaryData.windGust.high, 1, ' קמ״ש')}</div>
                </div>
                <div data-ev-id="ev_a27e19d8d1" className="bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_18ef4773a6" className="text-xs text-gray-400 mb-1">🧭 כיוון שכיח</div>
                  <div data-ev-id="ev_8651ced8fb" className="text-sm md:text-xl font-bold text-gray-300">{summaryData.windDirection.hebrew}</div>
                  <div data-ev-id="ev_324f852cf7" className="text-xs text-gray-500">{summaryData.windDirection.name}</div>
                </div>
              </div>
            </div>

            {/* Pressure Section */}
            <div data-ev-id="ev_cca0fd4567" className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl p-4 border border-purple-500/20">
              <h3 data-ev-id="ev_7ee8fc2421" className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                📊 לחץ אוויר
              </h3>
              <div data-ev-id="ev_e051591a4c" className="grid grid-cols-3 gap-3">
                <div data-ev-id="ev_18d10f0931" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_592a352933" className="text-xs text-gray-400 mb-1">מקסימום</div>
                  <div data-ev-id="ev_d625b879ec" className="text-sm md:text-xl font-bold text-purple-400">{formatValue(summaryData.pressure.high, 1, '')}</div>
                  <div data-ev-id="ev_3f0aa24f6a" className="text-xs text-gray-500">hPa</div>
                </div>
                <div data-ev-id="ev_2738781065" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_6dcc24d1a9" className="text-xs text-gray-400 mb-1">מינימום</div>
                  <div data-ev-id="ev_396bf258dc" className="text-sm md:text-xl font-bold text-violet-400">{formatValue(summaryData.pressure.low, 1, '')}</div>
                  <div data-ev-id="ev_aff1584cb3" className="text-xs text-gray-500">hPa</div>
                </div>
                <div data-ev-id="ev_69ec127ab5" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_c605775e1b" className="text-xs text-gray-400 mb-1">ממוצע</div>
                  <div data-ev-id="ev_7321e3754d" className="text-sm md:text-xl font-bold text-gray-300">{formatValue(summaryData.pressure.avg, 1, '')}</div>
                  <div data-ev-id="ev_169a398e53" className="text-xs text-gray-500">hPa</div>
                </div>
              </div>
            </div>

            {/* UV Section */}
            <div data-ev-id="ev_def3878329" className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
              <h3 data-ev-id="ev_0b1b953adc" className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                ☀️ קרינה UV
              </h3>
              <div data-ev-id="ev_15aa7b3237" className="grid grid-cols-2 gap-3">
                <div data-ev-id="ev_bb382fe035" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_39a7f841b6" className="text-xs text-gray-400 mb-1">מקסימום</div>
                  <div data-ev-id="ev_a9d4548304" className="text-sm md:text-xl font-bold text-yellow-400">{formatValue(summaryData.uv.high, 0, '')}</div>
                  <div data-ev-id="ev_550fcaf7d0" className="text-xs text-gray-500">מדד</div>
                </div>
                <div data-ev-id="ev_307ce51a1c" className="text-center bg-white/5 rounded-lg p-3">
                  <div data-ev-id="ev_1b1382c6f9" className="text-xs text-gray-400 mb-1">ממוצע</div>
                  <div data-ev-id="ev_512fd52e6e" className="text-sm md:text-xl font-bold text-gray-300">{formatValue(summaryData.uv.avg, 1, '')}</div>
                  <div data-ev-id="ev_be002abd1e" className="text-xs text-gray-500">מדד</div>
                </div>
              </div>
            </div>
          </div>
          {/* Precipitation Section - Full Width */}
          <div data-ev-id="ev_9820db506f" className="mt-6 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-xl p-4 border border-blue-500/20">
            <h3 data-ev-id="ev_50317237ef" className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              🌧️ משקעים
            </h3>
            
            {/* Summary Stats */}
            <div data-ev-id="ev_d5ee170857" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div data-ev-id="ev_56611f2858" className="text-center bg-white/5 rounded-lg p-3">
                <div data-ev-id="ev_f2bc46961d" className="text-xs text-gray-400 mb-1">סה"כ</div>
                <div data-ev-id="ev_092bcd7c41" className="text-base md:text-2xl font-bold text-blue-400">{summaryData.precipitation.total.toFixed(1)}</div>
                <div data-ev-id="ev_b88b21149c" className="text-xs text-gray-500">מ"מ</div>
              </div>
              <div data-ev-id="ev_f2efd60755" className="text-center bg-white/5 rounded-lg p-3">
                <div data-ev-id="ev_e84278a038" className="text-xs text-gray-400 mb-1">עוצמה מקסימלית</div>
                <div data-ev-id="ev_2c312b3a1f" className="text-base md:text-2xl font-bold text-cyan-400">{formatValue(summaryData.precipitation.maxRate, 1, '')}</div>
                <div data-ev-id="ev_e47d9b5362" className="text-xs text-gray-500">מ"מ/שעה</div>
              </div>
              <div data-ev-id="ev_436df027d4" className="text-center bg-white/5 rounded-lg p-3">
                <div data-ev-id="ev_d0a9570589" className="text-xs text-gray-400 mb-1">ימים גשומים</div>
                <div data-ev-id="ev_f48054c3c0" className="text-base md:text-2xl font-bold text-indigo-400">{summaryData.rainyDays.length}</div>
                <div data-ev-id="ev_c132b56fa4" className="text-xs text-gray-500">ימים</div>
              </div>
              {summaryData.raniestDay &&
            <div data-ev-id="ev_4c806e0d8a" className="text-center bg-blue-500/20 rounded-lg p-3 border border-blue-400/30">
                  <div data-ev-id="ev_85477f7621" className="text-xs text-gray-400 mb-1">⭐ יום הכי גשום</div>
                  <div data-ev-id="ev_4f7eee6805" className="text-sm md:text-xl font-bold text-blue-300">{summaryData.raniestDay.date}</div>
                  <div data-ev-id="ev_9834fb43cf" className="text-xs md:text-sm text-blue-400">{summaryData.raniestDay.amount.toFixed(1)} מ"מ</div>
                </div>
            }
            </div>

            {/* Rainy Days Grid */}
            {summaryData.rainyDays.length > 0 &&
          <div data-ev-id="ev_3da822dd3e">
                <h4 data-ev-id="ev_1563307af4" className="text-sm font-medium text-gray-400 mb-3">ימים גשומים - פירוט ({summaryData.rainyDays.length} ימים)</h4>
                <div data-ev-id="ev_e3035707cf" className="flex flex-wrap gap-2">
                  {summaryData.rainyDays.map((day, i) => {
                const isMax = summaryData.raniestDay && day.amount === summaryData.raniestDay.amount && day.date === summaryData.raniestDay.date;
                const style = getRainCardStyle(day.amount, maxRainAmount);
                return (
                  <div data-ev-id="ev_f59abdf05c"
                  key={i}
                  className={`rounded-lg px-3 py-2 text-center min-w-[75px] transition-all ${
                  isMax ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-transparent' : ''}`
                  }
                  style={{
                    background: style.background,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: style.borderColor
                  }}>

                        {isMax && <div data-ev-id="ev_8fc078a338" className="text-yellow-400 text-xs mb-0.5">⭐</div>}
                        <div data-ev-id="ev_c4c8f9f04c" className="text-xs text-gray-400">{day.date}</div>
                        <div data-ev-id="ev_f9c3341c67" className={`text-sm md:text-lg font-bold ${isMax ? 'text-yellow-300' : 'text-blue-300'}`}>
                          {day.amount.toFixed(1)}
                        </div>
                        <div data-ev-id="ev_8a4f6a2c09" className="text-xs text-gray-500">מ״מ</div>
                      </div>);

              })}
                </div>
              </div>
          }
            {summaryData.rainyDays.length === 0 &&
          <div data-ev-id="ev_a6f8b4780e" className="text-center text-gray-500 py-4">
                לא היו ימים גשומים בתקופה זו
              </div>
          }
          </div>
        </div>
      }

      {/* Initial State */}
      {!summaryData && !loading && !error &&
      <div data-ev-id="ev_23b771d379" className="p-8 text-center text-gray-400">
          בחר תאריך ולחץ "הצג" כדי לראות את הנתונים
        </div>
      }

      {/* CSV Modal */}
      {showCsvModal &&
      <div data-ev-id="ev_f6cd538454" className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div data-ev-id="ev_126504e2fc" className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-white/20">
            <div data-ev-id="ev_88c56e45b9" className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 data-ev-id="ev_39ad79c1bb" className="text-lg font-bold text-white">📄 ייצוא נתונים</h3>
              <button data-ev-id="ev_37bdf9487a"
            onClick={() => setShowCsvModal(false)}
            className="text-gray-400 hover:text-white text-2xl leading-none">

                ×
              </button>
            </div>
            
            <div data-ev-id="ev_dc3c7027cd" className="p-4 overflow-auto flex-1" dir="rtl">
              <pre data-ev-id="ev_0bc912c320" className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded-lg overflow-x-auto">
                {csvContent}
              </pre>
            </div>
            
            <div data-ev-id="ev_0fe324194a" className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 text-xs text-amber-300" dir="rtl">
              💡 <strong data-ev-id="ev_3924bab8a7">טיפ:</strong> ב-Google Sheets, לחץ קובץ → הגדרות → אזור: ישראל (להצגה מימין לשמאל)
            </div>
            
            <div data-ev-id="ev_02fe35de7f" className="p-4 border-t border-white/10" dir="rtl">
              {/* New Sheet - With Headers */}
              <div data-ev-id="ev_abd70ad154" className="mb-4">
                <div data-ev-id="ev_d2f0fe44ac" className="text-sm text-gray-400 mb-2">📊 גיליון חדש (עם כותרות):</div>
                <div data-ev-id="ev_fea442ce72" className="flex gap-2">
                  <button data-ev-id="ev_aaf40f8004"
                onClick={() => openInGoogleSheets(false)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">

                    פתח ב-Google Sheets
                  </button>
                  <button data-ev-id="ev_30191eb2aa"
                onClick={() => copyToClipboard(false)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">

                    📋 העתק עם כותרות
                  </button>
                </div>
              </div>
              
              {/* Add to Existing - Data Only */}
              <div data-ev-id="ev_3548d1d893" className="mb-4">
                <div data-ev-id="ev_dc7f567188" className="text-sm text-gray-400 mb-2">➕ הוספה לגיליון קיים (שורת נתונים בלבד):</div>
                <div data-ev-id="ev_35d96f6393" className="flex gap-2">
                  <button data-ev-id="ev_747650dd88"
                onClick={() => copyToClipboard(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">

                    📋 העתק נתונים בלבד
                  </button>
                </div>
              </div>
              
              {/* Close */}
              <button data-ev-id="ev_ddc398b6a3"
            onClick={() => setShowCsvModal(false)}
            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm">

                סגור
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}