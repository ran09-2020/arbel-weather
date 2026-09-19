const WEATHER_API_BASE = 'https://api.weather.com/v2/pws';
const STATION_ID = 'IREIHA8';

// API key from environment secret
const API_KEY = Deno.env.get('WEATHER_API_KEY');

console.log('WEATHER_API_KEY configured:', !!API_KEY, API_KEY ? `(${API_KEY.substring(0, 4)}...) length=${API_KEY.length}` : '(missing)');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface RequestBody {
  endpoint: 'current' | 'history/daily' | 'history/all';
  date?: string; // YYYYMMDD format for history endpoints
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for API key
    if (!API_KEY) {
      console.error('WEATHER_API_KEY secret is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured. Please add WEATHER_API_KEY secret.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { endpoint, date }: RequestBody = await req.json();

    let url: string;
    
    switch (endpoint) {
      case 'current':
        url = `${WEATHER_API_BASE}/observations/current?stationId=${STATION_ID}&format=json&units=m&apiKey=${API_KEY}`;
        break;
      case 'history/daily':
        if (!date) {
          return new Response(
            JSON.stringify({ error: 'date is required for history endpoints' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        url = `${WEATHER_API_BASE}/history/daily?stationId=${STATION_ID}&format=json&units=m&date=${date}&apiKey=${API_KEY}`;
        break;
      case 'history/all':
        if (!date) {
          return new Response(
            JSON.stringify({ error: 'date is required for history endpoints' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        url = `${WEATHER_API_BASE}/history/all?stationId=${STATION_ID}&format=json&units=m&date=${date}&apiKey=${API_KEY}`;
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`Fetching: ${endpoint}${date ? ` for date ${date}` : ''}`);
    console.log(`URL (without key): ${url.replace(API_KEY!, 'HIDDEN')}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Weather API error: ${response.status} ${response.statusText}`);
      console.error(`Error body: ${errorBody}`);
      console.error(`API Key used (first 8 chars): ${API_KEY?.substring(0, 8)}`);
      return new Response(
        JSON.stringify({ error: `Weather API error: ${response.status}`, details: errorBody }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in weather-proxy:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});