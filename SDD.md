# SDD - System Design Document
# תחנת מזג אוויר ריחאן

---

## 1. סקירה כללית

### 1.1 מטרת המערכת

המערכת בנויה כ-**Single Page Application (SPA)** עם ארכיטקטורת **Client-Server**:

```
┌───────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │     Pages     │  │   Components  │  │     Hooks     │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                          │                                   │
│                  ┌───────┴────────┐                          │
│                  │    Services    │                          │
│                  └───────┬────────┘                          │
└────────────────────────┼──────────────────────────────────┘
                            │
                    HTTPS │ REST API
                            │
┌────────────────────────┼──────────────────────────────────┐
│                       SERVER                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  Supabase Edge Function                 │  │
│  │                    (weather-proxy)                      │  │
│  └──────────────────────────┬──────────────────────────┘  │
│                             │                                │
│  ┌─────────────────────────┴───────────────────────────┐  │
│  │         Supabase PostgreSQL Database             │  │
│  │              (weather_history)                   │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
                            │
                    HTTPS │ External API
                            │
┌────────────────────────┼──────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌───────────────────────┐  ┌─────────────────────────┐  │
│  │   Weather Underground  │  │      Open-Meteo        │  │
│  │      PWS API          │  │    (Forecast API)      │  │
│  └───────────────────────┘  └─────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### 1.2 עקרונות ארכיטקטוריים

| עיקרון | הסבר |
|--------|------|
| **Separation of Concerns** | הפרדה בין UI, לוגיקה ונתונים |
| **Single Responsibility** | כל רכיב אחראי לפונקציה אחת |
| **DRY** | שימוש חוזר ב-hooks ו-utilities |
| **Security by Proxy** | API key מוסתר בשרת |

---

## 2. רכיבי Frontend

### 2.1 טכנולוגיות

| טכנולוגיה | גרסה | תפקיד |
|------------|--------|-------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.6.2 | Type Safety |
| Vite | 6.0.3 | Build Tool + HMR |
| Tailwind CSS | 4.1.18 | Styling |
| React Router | 7.1.0 | Routing |
| Recharts | 3.8.0 | Charts |
| Lucide React | 0.468.0 | Icons |
| Supabase JS | 2.47.3 | Backend Client |

### 2.2 מבנה תיקיות

```
src/
├── main.tsx                 # Entry point + BrowserRouter
├── App.tsx                  # Route definitions
├── providers.tsx            # Global providers (Theme)
├── index.css                # Tailwind imports
├── theme.css                # Design tokens
│
├── pages/                   # Route components
│   ├── Index.tsx            # דף הבית
│   ├── Charts.tsx           # גרפים
│   ├── History.tsx          # היסטוריה
│   ├── Forecast.tsx         # תחזית
│   ├── Encyclopedia.tsx     # אנציקלופדיה
│   └── Resources.tsx        # משאבים
│
├── components/              # Reusable UI components
│   ├── Header.tsx           # ניווט + לוגו
│   ├── ThermometerCard.tsx  # כרטיס טמפרטורה
│   ├── HumidityCard.tsx     # כרטיס לחות
│   ├── WindDirectionCard.tsx# כרטיס רוח
│   ├── GaugeCard.tsx        # מד גנרי
│   ├── UVIndexCard.tsx      # כרטיס UV
│   ├── PressureCard.tsx     # כרטיס לחץ
│   ├── RainGaugeCard.tsx    # כרטיס גשם יומי
│   ├── RainIntensityCard.tsx# כרטיס עוצמת גשם
│   ├── HistorySummary.tsx   # סיכום היסטורי
│   ├── HistoryTable.tsx     # טבלת נתונים
│   ├── MonthlyRainSummary.tsx # סיכום גשמים
│   ├── LoadingState.tsx     # מצב טעינה
│   ├── ErrorState.tsx       # מצב שגיאה
│   └── charts/              # רכיבי גרפים
│       ├── TemperatureChart.tsx
│       ├── HumidityChart.tsx
│       ├── WindChart.tsx
│       └── PrecipChart.tsx
│
├── hooks/                   # Custom React hooks
│   ├── useWeather.ts        # נתונים נוכחיים
│   └── useWeatherHistory.ts # נתונים היסטוריים
│
├── services/                # API communication
│   ├── weatherService.ts    # Weather Underground
│   └── forecastService.ts   # Open-Meteo
│
├── contexts/                # React contexts
│   └── ThemeContext.tsx     # Dark/Light mode
│
├── utils/                   # Helper functions
│   └── weatherIndicators.ts # פונקציות סטטוס
│
└── integrations/supabase/   # Supabase client
    ├── client.ts            # Supabase instance
    ├── types.ts             # Database types
    └── helpers.ts           # Type helpers
```

### 2.3 תרשים Component

```
┌──────────────────────────────────────────────────┐
│                    App                               │
│  ┌────────────────────────────────────────────┐  │
│  │                  Header                          │  │
│  │  [Logo] [Nav Links] [ThemeToggle]               │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │                  Routes                          │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  / → Index (Weather Cards Grid)           │  │  │
│  │  │  /charts → Charts (Time-series)           │  │  │
│  │  │  /history → History (Summaries)           │  │  │
│  │  │  /forecast → Forecast (Predictions)       │  │  │
│  │  │  /encyclopedia → Encyclopedia             │  │  │
│  │  │  /resources → Resources                   │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 2.4 State Management

#### 2.4.1 Context API

```typescript
// ThemeContext - ניהול מצב כהה/בהיר
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}
```

#### 2.4.2 Custom Hooks

```typescript
// useWeather - נתונים נוכחיים
interface UseWeatherReturn {
  data: WeatherObservation | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// useWeatherHistory - נתונים היסטוריים
interface UseWeatherHistoryReturn {
  data: WeatherHistoryRecord[];
  loading: boolean;
  error: string | null;
  importData: (startDate: Date, endDate: Date) => Promise<void>;
  isImporting: boolean;
  importProgress: number;
}
```

### 2.5 מחזור נתונים

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│  Component│───▶│    Hook   │───▶│   Service │───▶│    API    │
│  (Page)   │◀───│ useWeather│◀───│ weather-  │◀───│ External  │
└───────────┘     └───────────┘     │ Service   │     └───────────┘
      │                               └───────────┘
      │
      │  State: { data, loading, error }
      ▼
┌───────────┐
│    UI     │
│  Render   │
└───────────┘
```

---

## 3. רכיבי Backend

### 3.1 Edge Function: weather-proxy

**מיקום:** `supabase/functions/weather-proxy/index.ts`

**תפקיד:** פרוקסי מאובטח ל-Weather Underground API

#### 3.1.1 ממשק ה-API

```typescript
interface RequestBody {
  endpoint: 'current' | 'hourly' | 'daily' | 'history' | 'history-hourly' | 'history-all';
  date?: string;        // YYYYMMDD format
  startDate?: string;   // For ranges
  endDate?: string;     // For ranges
}
```

#### 3.1.2 Endpoints

| Endpoint | WU API Path | תיאור |
|----------|-------------|--------|
| `current` | `/v2/pws/observations/current` | נתונים נוכחיים |
| `hourly` | `/v2/pws/observations/hourly/7day` | 7 ימים שעתיים |
| `daily` | `/v2/pws/dailysummary/7day` | סיכום יומי |
| `history` | `/v2/pws/history/daily` | היסטוריה יומית |
| `history-hourly` | `/v2/pws/history/hourly` | היסטוריה שעתית |
| `history-all` | `/v2/pws/history/all` | כל הנתונים (5 דקות) |

#### 3.1.3 אבטחה

```typescript
// API Key נקרא מ-Secrets בלבד
const apiKey = Deno.env.get('WEATHER_API_KEY');

// לא נחשף לקליינט
// API Key לעולם לא עובר לצד הדפדפן
```

#### 3.1.4 CORS Headers

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
```

### 3.2 Database Schema

#### 3.2.1 טבלת weather_history

```sql
CREATE TABLE public.weather_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  
  -- Temperature (Celsius)
  temp_high NUMERIC,
  temp_low NUMERIC,
  temp_avg NUMERIC,
  
  -- Humidity (%)
  humidity_high NUMERIC,
  humidity_low NUMERIC,
  humidity_avg NUMERIC,
  
  -- Wind (km/h)
  wind_high NUMERIC,
  wind_avg NUMERIC,
  wind_gust_high NUMERIC,
  wind_dir_avg NUMERIC,        -- Degrees (0-360)
  
  -- Precipitation (mm)
  precip_total NUMERIC,
  
  -- Pressure (hPa)
  pressure_high NUMERIC,
  pressure_low NUMERIC,
  
  -- Solar
  uv_high NUMERIC,
  solar_radiation_high NUMERIC, -- W/m²
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_weather_history_date ON weather_history(date DESC);
```

#### 3.2.2 RLS Policies

```sql
-- קריאה פומבית
ALTER TABLE weather_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON weather_history
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON weather_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON weather_history
  FOR UPDATE USING (true);
```

---

## 4. שירותי נתונים (Services)

### 4.1 weatherService.ts

#### 4.1.1 טיפוסים

```typescript
// תצפיה נוכחית
export interface WeatherObservation {
  stationID: string;
  obsTimeLocal: string;
  neighborhood: string;
  temp: number | null;           // °C
  humidity: number | null;       // %
  windSpeed: number | null;      // km/h
  windGust: number | null;       // km/h
  winddir: number | null;        // degrees
  pressure: number | null;       // hPa
  precipRate: number | null;     // mm/h
  precipTotal: number | null;    // mm
  uv: number | null;
  solarRadiation: number | null; // W/m²
  feelsLike: number | null;      // °C
  dewpt: number | null;          // °C
}

// סיכום היסטורי
export interface HistoricalObservation {
  date: string;
  tempHigh: number | null;
  tempLow: number | null;
  tempAvg: number | null;
  humidityHigh: number | null;
  humidityLow: number | null;
  humidityAvg: number | null;
  windHigh: number | null;
  windAvg: number | null;
  windGustHigh: number | null;
  windDirAvg: number | null;
  precipTotal: number | null;
  pressureHigh: number | null;
  pressureLow: number | null;
  uvHigh: number | null;
  solarRadiationHigh: number | null;
}

// נתונים מפורטים (5 דקות)
export interface DetailedObservation {
  obsTimeLocal: string;
  temp: number | null;
  humidity: number | null;
  windSpeed: number | null;
  windGust: number | null;
  winddir: number | null;
  pressure: number | null;
  precipRate: number | null;
  precipTotal: number | null;
  uv: number | null;
  solarRadiation: number | null;
  heatIndex: number | null;
  dewpt: number | null;
}
```

#### 4.1.2 פונקציות עיקריות

```typescript
// נתונים נוכחיים
export async function fetchWeatherData(): Promise<WeatherObservation | null>

// היסטוריה לתאריך ספציפי
export async function fetchHistoricalData(date: string): Promise<HistoricalObservation | null>

// היסטוריה לטווח תאריכים
export async function fetchHistoricalRange(
  startDate: Date, 
  endDate: Date
): Promise<HistoricalObservation[]>

// נתונים מפורטים ליום
export async function fetchDetailedDayData(date: string): Promise<DetailedObservation[]>

// עזר
05d9ם
export function getWindDirection(degrees: number | null): string
export function formatTime(isoString: string): string
```

### 4.2 forecastService.ts

#### 4.2.1 טיפוסים

```typescript
export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  windSpeedMax: number;
  windDirection: number;
}

export interface ForecastData {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}
```

#### 4.2.2 API Configuration

```typescript
// Open-Meteo API - אין צורך במפתח
const LATITUDE = 32.4679;
const LONGITUDE = 35.1329;
const TIMEZONE = 'Asia/Jerusalem';

const API_URL = `https://api.open-meteo.com/v1/forecast?` +
  `latitude=${LATITUDE}&longitude=${LONGITUDE}` +
  `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,...` +
  `&daily=temperature_2m_max,temperature_2m_min,...` +
  `&timezone=${TIMEZONE}`;
```

---

## 5. מבנה הדפים

### 5.1 Index (Home)

```
┌────────────────────────────────────────────────┐
│  ┌───────────────┐  ┌───────────────┐  ┌──────────┐  │
│  │ Thermometer   │  │    Humidity   │  │   Wind    │  │
│  │   27°C        │  │      53%      │  │  4 km/h  │  │
│  └───────────────┘  └───────────────┘  └──────────┘  │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────┐  │
│  │   UV Index    │  │    Pressure   │  │   Rain    │  │
│  │      1        │  │   1010 hPa    │  │   0 mm   │  │
│  └───────────────┘  └───────────────┘  └──────────┘  │
└────────────────────────────────────────────────┘
```

**Data Flow:**
```
useWeather() → weatherService.fetchWeatherData() → Edge Function → WU API
```

### 5.2 Charts

```
┌────────────────────────────────────────────────┐
│  [Daily] [Weekly] [Monthly] [Yearly]              │
│                                                   │
│  ┌───────────────────────────────────────────┐  │
│  │  Temperature Chart                           │  │
│  │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  Humidity Chart                              │  │
│  │  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│  │
│  └───────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

**Time Ranges:**
- Daily: 24 שעות אחרונות (DetailedObservation[])
- Weekly: 7 ימים (HistoricalObservation[])
- Monthly: 30 ימים (HistoricalObservation[])
- Yearly: 365 ימים (weather_history from DB)

### 5.3 History

```
┌────────────────────────────────────────────────┐
│  HistorySummary                                    │
│  ┌───────────────────────────────────────────┐  │
│  │  [Daily] [Weekly] [Monthly] [Yearly]         │  │
│  ├───────────────────────────────────────────┤  │
│  │  Summary Cards (Temp, Rain, Wind...)         │  │
│  ├───────────────────────────────────────────┤  │
│  │  Monthly Rain Summary (Calendar Grid)        │  │
│  ├───────────────────────────────────────────┤  │
│  │  Data Table (Detailed records)               │  │
│  └───────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

**Data Sources:**
- Daily/Weekly: WU API via Edge Function
- Monthly/Yearly: PostgreSQL (weather_history table)

---

## 6. אינטגרציות חיצוניות

### 6.1 Weather Underground API

**Base URL:** `https://api.weather.com/v2/pws/`

**Authentication:** API Key כ-query parameter

**Station ID:** `IREIHA8`

**Rate Limits:**
- 1,500 calls/day (חינמי)
- מומלץ: לעשות caching בצד הלקוח

### 6.2 Open-Meteo API

**Base URL:** `https://api.open-meteo.com/v1/forecast`

**Authentication:** ללא (פתוח)

**Rate Limits:** 10,000 calls/day

---

## 7. אבטחה

### 7.1 אבטחת API Key

```
┌─────────────┐
│   Client    │  API Key לא נחשף לצד הלקוח
└─────┬───────┘
      │
      ▼
┌─────────────┐
│ Edge Func.  │  API Key נקרא מ-Secrets
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  WU API     │  המפתח מאומת
└─────────────┘
```

### 7.2 אימות נתונים

```typescript
// וולידציה של ערכים לא הגיוניים
function validateValue(value: number | null, max: number): number | null {
  if (value === null || value === undefined) return null;
  if (value > max || value < -50) return null;
  return value;
}

// סניטיזציה של רשומות
function sanitizeRecord(record: WeatherHistoryRecord): WeatherHistoryRecord {
  return {
    ...record,
    temp_high: validateValue(record.temp_high, 60),
    temp_low: validateValue(record.temp_low, 60),
    wind_high: validateValue(record.wind_high, 200),
    // ...
  };
}
```

### 7.3 RLS Policies

- קריאה פומבית (אין מידע רגיש)
- כתיבה מותרת למשתמשים מאומתים

---

## 8. ביצועים

### 8.1 רענון אוטומטי

```typescript
// useWeather hook
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 דקות

useEffect(() => {
  fetchData();
  const interval = setInterval(fetchData, REFRESH_INTERVAL);
  return () => clearInterval(interval);
}, []);
```

### 8.2 Loading States

```typescript
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// בכל רכיב
{loading && <LoadingState />}
{error && <ErrorState message={error} onRetry={refetch} />}
{data && <DataDisplay data={data} />}
```

### 8.3 Error Handling

```typescript
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error('API Error:', error);
  return null;
}
```

---

## 9. עיצוב ו-UI

### 9.1 Design Tokens (theme.css)

```css
@theme {
  /* Colors */
  --color-primary: #3b82f6;
  --color-background: #ffffff;
  --color-foreground: #1a1a2e;
  --color-muted: #f1f5f9;
  
  /* Typography */
  --font-sans: 'Rubik', system-ui, sans-serif;
  
  /* Spacing */
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

### 9.2 Responsive Breakpoints

| Breakpoint | Width | שימוש |
|------------|-------|------|
| Mobile | < 640px | ברירת מחדל |
| Tablet | 640-1024px | 2 עמודות |
| Desktop | > 1024px | 3-4 עמודות |

### 9.3 RTL Support

```html
<html lang="he" dir="rtl">
```

```css
/* Tailwind RTL classes */
.text-right { text-align: right; }
.mr-auto { margin-right: auto; }
```

---

## 10. מילון טכני

### 10.1 Glossary

| מונח | הסבר |
|------|------|
| PWS | Personal Weather Station |
| WU | Weather Underground |
| RLS | Row Level Security |
| HMR | Hot Module Replacement |
| SPA | Single Page Application |
| RTL | Right-to-Left |

### 10.2 מגבלות API

| מגבלה | שימוש | גבולות |
|--------|------|--------|
| WU Free | נתונים נוכחיים + היסטוריים | 1,500/day |
| Open-Meteo | תחזית | 10,000/day |

---

## 11. נספח A - התקנת הסביבה

### A.1 דרישות

1. Node.js 18+
2. Supabase CLI
3. WU API Key

### A.2 משתני סביבה

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### A.3 Secrets (Edge Functions)

```
WEATHER_API_KEY=xxx
```

---

## 12. נספח B - אינדקסים

### B.1 weather_history Indexes

```sql
-- אינדקס ראשי על תאריך
CREATE INDEX idx_weather_history_date 
  ON weather_history(date DESC);

-- אינדקס לטווח תאריכים
CREATE INDEX idx_weather_history_date_range 
  ON weather_history(date) 
  WHERE date IS NOT NULL;
```

---

**גרסה:** 1.0.0  
**תאריך עדכון:** יוני 2024
