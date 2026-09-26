import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { supabase } from '@/integrations/supabase/client';

// Generate a random UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get or create a visitor ID stored in localStorage
function getVisitorId() {
  const STORAGE_KEY = 'arbel_visitor_id';
  let visitorId = localStorage.getItem(STORAGE_KEY);
  
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem(STORAGE_KEY, visitorId);
  }
  
  return visitorId;
}

export function useTracker() {
  const location = useLocation();

  useEffect(() => {
    async function trackPageLoad() {
      if (!supabase) return; // Database not enabled yet
      
      const visitorId = getVisitorId();
      const userAgent = navigator.userAgent;
      const path = location.pathname;
      
      // Fetch geolocation info
      let country = 'Unknown';
      let region = 'Unknown';
      try {
        const geoResponse = await fetch('http://ip-api.com/json/');
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          country = geoData.country || 'Unknown';
          region = geoData.regionName || geoData.city || 'Unknown';
        }
      } catch (err) {
        console.warn('Could not fetch geolocation', err);
      }
      
      try {
        await supabase.from('page_views').insert([
          {
            visitor_id: visitorId,
            path: path,
            user_agent: userAgent,
            country: country,
            region: region
          }
        ]);
      } catch (error) {
        console.error('Failed to track page view', error);
      }
    }
    
    // Use setTimeout to not block main thread on navigation
    setTimeout(trackPageLoad, 100);
  }, [location.pathname]);
}
