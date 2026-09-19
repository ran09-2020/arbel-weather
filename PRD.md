# PRD - תחנת מזג אוויר ריחאן

## סקירה כללית

אפליקציית דשבורד מזג אוויר המציגה נתונים בזמן אמת מתחנת מזג אוויר פרטית (PWS) ברייחאן, באמצעות Weather Underground API.

### מטרות המוצר
- הצגת נתוני מזג אוויר עדכניים בצורה ויזואלית ואינטואיטיבית
- מעקב אחר היסטוריית מזג האוויר (יומי, שבועי, חודשי, שנתי)
- גרפים ותרשימים אינטראקטיביים
- תמיכה מלאה בעברית ו-RTL
- עיצוב רספונסיבי למובייל ודסקטופ

---

## קהל יעד

- תושבי האזור המעוניינים במזג אוויר מקומי מדויק
- חקלאים ובעלי גינות
- חובבי מטאורולוגיה
- כל מי שמחפש נתונים מפורטים מעבר לתחזית הרגילה

---

## פיצ'רים עיקריים

### 1. דף הבית - מזג אוויר נוכחי
**נתיב:** `/`

| רכיב | תיאור |
|------|--------|
| ThermometerCard | טמפרטורה נוכחית + תחושה |
| HumidityCard | לחות יחסית + נקודת טל |
| WindDirectionCard | כיוון רוח + מצפן ויזואלי |
| GaugeCard | מד מהירות רוח |
| UVIndexCard | מדד UV עם סקאלת צבעים |
| PressureCard | לחץ אטמוספרי עם מגמה |
| RainGaugeCard | סה"כ גשם יומי |
| RainIntensityCard | עוצמת גשם נוכחית |

### 2. גרפים
**נתיב:** `/charts`

- **טווחי זמן:** יומי (24 שעות), שבועי, חודשי, שנתי
- **סוגי גרפים:**
  - טמפרטורה (min/avg/max)
  - לחות
  - רוח (מהירות + משבים)
  - משקעים (סה"כ לתקופה)

### 3. היסטוריה
**נתיב:** `/history`

- סיכום יומי/שבועי/חודשי/שנתי
- טבלאות נתונים מפורטות
- סיכום גשמים חודשי עם קוד צבעים
- ייבוא נתונים היסטוריים מ-API

### 4. תחזית
**נתיב:** `/forecast`

- תחזית שעתית ל-48 שעות
- תחזית יומית ל-7 ימים
- מקור: Open-Meteo API

### 5. אנציקלופדיה
**נתיב:** `/encyclopedia`

- מדריך מושגי מזג אוויר
- הסבר על מדדים ויחידות
- טיפים לפרשנות נתונים

### 6. משאבים
**נתיב:** `/resources`

- קישורים לאתרי מזג אוויר
- מפות רדאר ולוויין
- מקורות מידע נוספים

---

## ארכיטקטורה טכנית

### Frontend
```
React 18 + TypeScript + Vite 6
├── Tailwind CSS v4 (עיצוב)
├── Recharts (גרפים)
├── Lucide React (אייקונים)
└── React Router v7 (ניווט)
```

### Backend
```
Supabase (Cloud Backend)
├── Edge Function: weather-proxy
│   └── פרוקסי מאובטח ל-Weather Underground API
├── Database: PostgreSQL
│   └── weather_history (אחסון נתונים היסטוריים)
└── Secrets
    └── WEATHER_API_KEY
```

### תרשים זרימה
```
┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App │───▶│  weather-proxy   │───▶│  Weather        │
│   (Client)  │◀───│  (Edge Function) │◀───│  Underground    │
└─────────────┘    └──────────────────┘    └─────────────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │    PostgreSQL    │
                   │ (weather_history)│
                   └──────────────────┘
```

---

## מבנה קבצים

```
src/
├── pages/
│   ├── Index.tsx        # דף הבית
│   ├── Charts.tsx       # גרפים
│   ├── History.tsx      # היסטוריה
│   ├── Forecast.tsx     # תחזית
│   ├── Encyclopedia.tsx # אנציקלופדיה
│   └── Resources.tsx    # משאבים
├── components/
│   ├── ThermometerCard.tsx
│   ├── HumidityCard.tsx
│   ├── WindDirectionCard.tsx
│   ├── GaugeCard.tsx
│   ├── UVIndexCard.tsx
│   ├── PressureCard.tsx
│   ├── RainGaugeCard.tsx
│   ├── RainIntensityCard.tsx
│   ├── Header.tsx
│   ├── HistorySummary.tsx
│   ├── HistoryTable.tsx
│   ├── MonthlyRainSummary.tsx
│   └── charts/
│       ├── TemperatureChart.tsx
│       ├── HumidityChart.tsx
│       ├── WindChart.tsx
│       └── PrecipChart.tsx
├── hooks/
│   ├── useWeather.ts         # נתונים נוכחיים
│   └── useWeatherHistory.ts  # נתונים היסטוריים
├── services/
│   ├── weatherService.ts     # WU API
│   └── forecastService.ts    # Open-Meteo API
└── utils/
    └── weatherIndicators.ts  # פונקציות עזר
```

---

## API Integration

### Weather Underground PWS API

**תחנה:** `IREIHA8`

| Endpoint | תיאור |
|----------|--------|
| `/v2/pws/observations/current` | נתונים נוכחיים |
| `/v2/pws/observations/hourly/7day` | נתונים שעתיים |
| `/v2/pws/dailysummary/7day` | סיכום יומי |
| `/v2/pws/history/daily` | היסטוריה לפי תאריך |
| `/v2/pws/history/hourly` | היסטוריה שעתית |
| `/v2/pws/history/all` | כל הנתונים (5 דקות) |

### Open-Meteo API (תחזית)

**קואורדינטות:** `32.4679°N, 35.1329°E`

---

## מודל נתונים

### טבלת weather_history

```sql
CREATE TABLE weather_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  temp_high NUMERIC,
  temp_low NUMERIC,
  temp_avg NUMERIC,
  humidity_high NUMERIC,
  humidity_low NUMERIC,
  humidity_avg NUMERIC,
  wind_high NUMERIC,
  wind_avg NUMERIC,
  wind_gust_high NUMERIC,
  wind_dir_avg NUMERIC,
  precip_total NUMERIC,
  pressure_high NUMERIC,
  pressure_low NUMERIC,
  uv_high NUMERIC,
  solar_radiation_high NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## עיצוב ו-UX

### עקרונות
- **Mobile-first:** אופטימיזציה למכשירים ניידים
- **RTL:** תמיכה מלאה בעברית
- **Dark/Light mode:** מצב כהה ובהיר
- **ויזואליות:** מדים, גרפים וכרטיסים צבעוניים

### צבעים (לפי ערכים)
| מדד | צבע | טווח |
|-----|-----|------|
| טמפרטורה קרה | כחול | < 10°C |
| טמפרטורה נוחה | ירוק | 10-25°C |
| טמפרטורה חמה | כתום | 25-35°C |
| טמפרטורה גבוהה | אדום | > 35°C |
| UV נמוך | ירוק | 0-2 |
| UV בינוני | צהוב | 3-5 |
| UV גבוה | כתום | 6-7 |
| UV גבוה מאוד | אדום | 8-10 |
| UV קיצוני | סגול | 11+ |

---

## אבטחה

- ✅ API Key מאוחסן ב-Secrets (לא בקוד)
- ✅ כל הקריאות עוברות דרך Edge Function
- ✅ CORS מוגדר נכון
- ✅ אין חשיפת מפתחות בצד הלקוח

---

## ביצועים

- ⚡ רענון אוטומטי כל 5 דקות
- 💾 שמירת נתונים היסטוריים ב-DB
- 📊 טעינה עצלה של גרפים
- 🔄 מצב טעינה ושגיאה לכל רכיב

---

## פיתוחים עתידיים (Backlog)

### גרסה 1.1
- [ ] התראות על תנאי מזג אוויר קיצוניים
- [ ] השוואה בין תקופות
- [ ] ייצוא נתונים ל-CSV/Excel

### גרסה 1.2
- [ ] ווידג'ט להטמעה באתרים אחרים
- [ ] Push notifications
- [ ] תמיכה במספר תחנות

### גרסה 2.0
- [ ] PWA - התקנה כאפליקציה
- [ ] מצב אופליין
- [ ] אינטגרציה עם חיישנים נוספים

---

## גרסאות

| גרסה | תאריך | שינויים |
|-------|--------|----------|
| 1.0.0 | 2024 | השקה ראשונית |

---

## אנשי קשר

- **תחנה:** IREIHA8 - Reihan
- **מיקום:** 32.4679°N, 35.1329°E
- **גובה:** 365 מטר
