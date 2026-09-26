import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Globe, Users, Eye, Clock, MapPin, Monitor } from 'lucide-react';

export default function AdminStats() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [views, setViews] = useState<any[]>([]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'arbeladmin') { // simple local password
      setIsAuthenticated(true);
      fetchStats();
    } else {
      alert('סיסמה שגויה');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    if (supabase) {
      const { data, error } = await supabase
        .from('page_views')
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
  const totalViews = views.length;
  const uniqueVisitors = new Set(views.map(v => v.visitor_id)).size;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  const viewsToday = views.filter(v => new Date(v.created_at) >= today).length;

  // Pages chart data
  const pageCounts = views.reduce((acc, curr) => {
    acc[curr.path] = (acc[curr.path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const pagesChartData = Object.keys(pageCounts).map(path => ({
    path: path === '/' ? 'Home' : path.replace('/', ''),
    views: pageCounts[path]
  })).sort((a,b) => b.views - a.views).slice(0, 5);

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
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">הדפים הנצפים ביותר</h2>
              <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pagesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="path" tick={{fill: '#888'}} />
                    <YAxis tick={{fill: '#888'}} />
                    <Tooltip contentStyle={{backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px'}}/>
                    <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow overflow-hidden">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">צפיות אחרונות (פירוט)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                    <tr>
                      <th className="p-3 whitespace-nowrap">זמן</th>
                      <th className="p-3 whitespace-nowrap">עמוד</th>
                      <th className="p-3 whitespace-nowrap">מזהה גולש (ID)</th>
                      <th className="p-3 whitespace-nowrap">מדינה ואזור</th>
                      <th className="p-3 whitespace-nowrap">מכשיר</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {views.slice(0, 100).map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition text-gray-800 dark:text-gray-200">
                        <td className="p-3 whitespace-nowrap" dir="ltr">{new Date(v.created_at).toLocaleString('he-IL')}</td>
                        <td className="p-3 font-mono text-blue-500" dir="ltr">{v.path}</td>
                        <td className="p-3 font-mono text-xs opacity-60" dir="ltr">{v.visitor_id.substring(0, 8)}...</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-500" />
                            {v.country || 'Unknown'}, {v.region || 'Unknown'}
                          </div>
                        </td>
                        <td className="p-3 text-xs opacity-70">
                          <div className="flex items-center gap-1 truncate max-w-[200px]" title={v.user_agent}>
                            <Monitor className="w-3 h-3 text-gray-400" />
                            {v.user_agent}
                          </div>
                        </td>
                      </tr>
                    ))}
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
