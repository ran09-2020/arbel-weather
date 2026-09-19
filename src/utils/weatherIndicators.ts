// Temperature indicators
export function getTemperatureStatus(temp: number | null): { label: string; color: 'blue' | 'green' | 'yellow' | 'orange' | 'red' } {
  if (temp === null) return { label: '', color: 'green' };
  
  if (temp <= 5) return { label: 'קר מאוד', color: 'blue' };
  if (temp <= 15) return { label: 'קריר', color: 'blue' };
  if (temp <= 25) return { label: 'נעים', color: 'green' };
  if (temp <= 30) return { label: 'חם', color: 'yellow' };
  if (temp <= 35) return { label: 'חם מאוד', color: 'orange' };
  return { label: 'שרב', color: 'red' };
}

// Humidity indicators
export function getHumidityStatus(humidity: number | null): { label: string; color: 'blue' | 'green' | 'yellow' | 'orange' | 'red' } {
  if (humidity === null) return { label: '', color: 'green' };
  
  if (humidity <= 30) return { label: 'יבש', color: 'orange' };
  if (humidity <= 50) return { label: 'נוח', color: 'green' };
  if (humidity <= 70) return { label: 'לח', color: 'yellow' };
  return { label: 'לח מאוד', color: 'blue' };
}

// Wind speed indicators
export function getWindStatus(speed: number | null): { label: string; color: 'green' | 'yellow' | 'orange' | 'red' } {
  if (speed === null) return { label: '', color: 'green' };
  
  if (speed <= 10) return { label: 'רגוע', color: 'green' };
  if (speed <= 25) return { label: 'משב קל', color: 'green' };
  if (speed <= 40) return { label: 'רוח', color: 'yellow' };
  if (speed <= 60) return { label: 'רוח חזקה', color: 'orange' };
  return { label: 'סערה', color: 'red' };
}

// UV Index indicators
export function getUVStatus(uv: number | null): { label: string; color: 'green' | 'yellow' | 'orange' | 'red' | 'purple' } {
  if (uv === null) return { label: '', color: 'green' };
  
  if (uv <= 2) return { label: 'נמוך', color: 'green' };
  if (uv <= 5) return { label: 'בינוני', color: 'yellow' };
  if (uv <= 7) return { label: 'גבוה', color: 'orange' };
  if (uv <= 10) return { label: 'גבוה מאוד', color: 'red' };
  return { label: 'קיצוני', color: 'purple' };
}

// Precipitation indicators
export function getPrecipStatus(rate: number | null): { label: string; color: 'green' | 'yellow' | 'orange' | 'blue' } {
  if (rate === null || rate === 0) return { label: 'יבש', color: 'green' };
  
  if (rate < 2.5) return { label: 'גשם קל', color: 'blue' };
  if (rate < 7.5) return { label: 'גשם', color: 'blue' };
  if (rate < 15) return { label: 'גשם חזק', color: 'yellow' };
  return { label: 'גשם זלעפות', color: 'orange' };
}

// Pressure indicators
export function getPressureStatus(pressure: number | null): { label: string; color: 'blue' | 'green' | 'orange' } {
  if (pressure === null) return { label: '', color: 'green' };
  
  if (pressure < 1000) return { label: 'לחץ נמוך', color: 'blue' };
  if (pressure <= 1020) return { label: 'לחץ תקין', color: 'green' };
  return { label: 'לחץ גבוה', color: 'orange' };
}
