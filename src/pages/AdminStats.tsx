import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Globe, Users, Eye, Clock, MapPin, Monitor, Smartphone } from 'lucide-react';

export default function AdminStats() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'real' | 'admin'>('real');
  const [chartMode, setChartMode] = useState<'pages' | 'days' | 'months'>('pages');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'arbeladmin') { // simple local password
      setIsAuthenticated(true);
      localStorage.setItem('arbel_admin', 'true');
      fetchStats();
    } else {
      alert('סיסמה שגויה');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    if (supabase) {
      const { data, error } = await supabase
        .from('arbel_weather_page_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
        
      if (data) {
        setViews(data);
      }
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4" dir="rtl">
        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">כניסת מנהל אנליטיקס</h2>
          <input 
            type="password" 
            placeholder="הכנס סיסמה"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-transparent text-gray-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-bold transition-colors">
            כניסה
          </button>
        </form>
      </div>
    );
  }

  // Analytics Logic
  const filteredViews = views.filter(v =>
    v.path !== '[תיקון גשם]' &&
    (activeTab === 'admin' ? v.path.startsWith('[מנהל]') : !v.path.startsWith('[מנהל]'))
  );

  const totalViews = filteredViews.length;
  const uniqueVisitors = new Set(filteredViews.map(v => v.visitor_id)).size;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const viewsToday = filteredViews.filter(v => new Date(v.created_at) >= today).length;

  // Chart data
  const pageCounts = filteredViews.reduce((acc, curr) => {
    acc[curr.path] = (acc[curr.path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pagesChartData = Object.keys(pageCounts).map(path => ({
    name: path === '/' ? 'Home' : path.replace('/', ''),
    views: pageCounts[path]
  })).sort((a,b) => b.views - a.views).slice(0, 5);

  const dayCounts = filteredViews.reduce((acc, curr) => {
    const d = new Date(curr.created_at).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const daysChartData = Object.keys(dayCounts).map(d => ({ name: d, views: dayCounts[d] })).reverse();

  const monthCounts = filteredViews.reduce((acc, curr) => {
    const m = new Date(curr.created_at).toLocaleString('he-IL', { month: 'short', year: '2-digit' });
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const monthsChartData = Object.keys(monthCounts).map(m => ({ name: m, views: monthCounts[m] })).reverse();

  const currentChartData = chartMode === 'pages' ? pagesChartData : chartMode === 'days' ? daysChartData : monthsChartData;

  // Helper for User Agent
  const getBrowserInfo = (ua: string) => {
    if (!ua) return { name: 'Unknown', icon: <Monitor className="w-3 h-3 text-gray-400" /> };
    if (ua.includes('Edg/')) return { name: 'Edge', icon: <Globe className="w-3 h-3 text-blue-500" /> };
    if (ua.includes('Chrome/')) return { name: 'Chrome', icon: <Globe className="w-3 h-3 text-green-500" /> };
    if (ua.includes('Firefox/')) return { name: 'Firefox', icon: <Globe className="w-3 h-3 text-orange-500" /> };
    if (ua.includes('Safari/') && !ua.includes('Chrome/')) return { name: 'Safari', icon: <Globe className="w-3 h-3 text-blue-400" /> };
    if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return { name: 'Mobile', icon: <Smartphone className="w-3 h-3 text-gray-500" /> };
    return { name: 'Other', icon: <Monitor className="w-3 h-3 text-gray-400" /> };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Globe className="w-8 h-8 text-blue-500" />
            לוח בקרה - אנליטיקס
          </h1>
          <button onClick={fetchStats} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-800 dark:text-white">
            רענן נתונים
          </button>
        </header>

        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">טוען נתונים...</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg w-fit mb-6">
              <button 
                onClick={() => setActiveTab('real')} 
                className={`px-6 py-2 rounded-md transition font-medium ${activeTab === 'real' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                גולשים אמיתיים
              </button>
              <button 
                onClick={() => setActiveTab('admin')} 
                className={`px-6 py-2 rounded-md transition font-medium ${activeTab === 'admin' ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                בדיקות מנהל
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"><Eye className="w-8 h-8"/></div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">סה"כ צפיות (1000 אחרונות)</div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-white">{totalViews}</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400"><Users className="w-8 h-8"/></div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">מבקרים ייחודיים (Unique)</div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-white">{uniqueVisitors}</div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex items-center gap-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400"><Clock className="w-8 h-8"/></div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">צפיות היום</div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-white">{viewsToday}</div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">פילוח צפיות</h2>
                <div className="flex bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg text-sm">
                  <button onClick={() => setChartMode('pages')} className={`px-4 py-1.5 rounded ${chartMode === 'pages' ? 'bg-white dark:bg-gray-600 shadow font-medium text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>דפים</button>
                  <button onClick={() => setChartMode('days')} className={`px-4 py-1.5 rounded ${chartMode === 'days' ? 'bg-white dark:bg-gray-600 shadow font-medium text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>ימים</button>
                  <button onClick={() => setChartMode('months')} className={`px-4 py-1.5 rounded ${chartMode === 'months' ? 'bg-white dark:bg-gray-600 shadow font-medium text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>חודשים</button>
                </div>
              </div>
              <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{fill: '#888'}} />
                    <YAxis tick={{fill: '#888'}} />
                    <Tooltip contentStyle={{backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px'}}/>
                    <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-hidden">
              <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">צפיות אחרונות (פירוט דחוס)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2 whitespace-nowrap rounded-r-lg">זמן</th>
                      <th className="px-3 py-2 whitespace-nowrap">עמוד</th>
                      <th className="px-3 py-2 whitespace-nowrap">גולש</th>
                      <th className="px-3 py-2 whitespace-nowrap">אזור</th>
                      <th className="px-3 py-2 whitespace-nowrap rounded-l-lg">דפדפן</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredViews.slice(0, 100).map((v) => {
                      const browser = getBrowserInfo(v.user_agent);
                      return (
                        <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition text-gray-700 dark:text-gray-300">
                          <td className="px-3 py-2 whitespace-nowrap text-xs" dir="ltr">
                            {new Date(v.created_at).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}
                            <span className="text-gray-400 ml-1 block text-[10px]">{new Date(v.created_at).toLocaleDateString('he-IL')}</span>
                          </td>
                          <td className="px-3 py-2 font-mono text-blue-500 text-xs" dir="ltr">{v.path}</td>
                          <td className="px-3 py-2 font-mono text-[10px] opacity-60 uppercase" dir="ltr">{v.visitor_id.substring(0, 6)}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-400" />
                              <span className="truncate max-w-[120px]">{v.country === 'Unknown' ? 'לא ידוע' : `${v.country}, ${v.region}`}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-xs">
                            <div className="flex items-center gap-1.5" title={v.user_agent}>
                              {browser.icon}
                              <span className="font-medium">{browser.name}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
