/**
 * ⚠️ ROUTING RULES:
 * - Router is in main.tsx. Do NOT add another <BrowserRouter> here or anywhere.
 * - Use <Routes> + <Route> components ONLY. Do NOT use useRoutes().
 * - STATIC IMPORTS ONLY — no React.lazy() or dynamic import().
 * - Import from 'react-router' — NOT 'react-router-dom' (does not exist).
 */
import { Routes, Route } from 'react-router';
import { useTracker } from '@/hooks/useTracker';
import Index from '@/pages/Index';
import History from '@/pages/History';
import Forecast from '@/pages/Forecast';
import Resources from '@/pages/Resources';
import Encyclopedia from '@/pages/Encyclopedia';
import Charts from '@/pages/Charts';
import AdminStats from '@/pages/AdminStats';
import TalHistory from '@/pages/TalHistory';

export default function App() {
	useTracker();
	return (
		<Routes>
			<Route path="/" element={<Index />} />
			<Route path="/history" element={<History />} />
			<Route path="/forecast" element={<Forecast />} />
			<Route path="/resources" element={<Resources />} />
			<Route path="/encyclopedia" element={<Encyclopedia />} />
			<Route path="/charts" element={<Charts />} />
			<Route path="/admin/stats" element={<AdminStats />} />
			<Route path="/tal-history" element={<TalHistory />} />
		</Routes>
	);
}
