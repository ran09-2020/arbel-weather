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
      let path = location.pathname;
      
      // Do not track admin pages
      if (path.startsWith('/admin')) {
        return;
      }
      
      if (localStorage.getItem('arbel_admin') === 'true') {
        path = '[מנהל] ' + path;
      }
      
      // Fetch geolocation info
      let country = 'Unknown';
      let region = 'Unknown';
      try {
        const geoResponse = await fetch('https://ipwho.is/');
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          country = geoData.country || 'Unknown';
          region = geoData.region || 'Unknown';
          sessionStorage.setItem('arbel_country', country);
          sessionStorage.setItem('arbel_region', region);
        }
      } catch (err) {
        console.warn('Could not fetch geolocation', err);
      }
      
      try {
        await supabase.from('arbel_weather_page_views').insert([
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

  // Track outbound clicks
  useEffect(() => {
    const handleGlobalClick = async (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target || !target.href) return;
      
      const href = target.href;
      if (href.includes('learn-about-weather.sticklight.app') || href.includes('atlas.sticklight.app')) {
        const visitorId = getVisitorId();
        const country = sessionStorage.getItem('arbel_country') || 'Unknown';
        const region = sessionStorage.getItem('arbel_region') || 'Unknown';
        
        let linkName = '[קישור חיצוני]';
        if (href.includes('learn-about-weather')) linkName = '[אנציקלופדיה]';
        if (href.includes('atlas')) linkName = '[אטלס]';

        if (localStorage.getItem('arbel_admin') === 'true') {
          linkName = '[מנהל] ' + linkName;
        }

        try {
          await supabase.from('arbel_weather_page_views').insert([
            {
              visitor_id: visitorId,
              path: linkName,
              user_agent: navigator.userAgent,
              country: country,
              region: region
            }
          ]);
        } catch (error) {
          console.error('Failed to track outbound click', error);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);
}
