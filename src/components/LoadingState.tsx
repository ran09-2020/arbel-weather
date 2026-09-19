import { Cloud } from 'lucide-react';

export function LoadingState() {
  return (
    <div data-ev-id="ev_dd5ab0b37f" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center transition-colors duration-300">
      <div data-ev-id="ev_c8c8338c45" className="text-center">
        <div data-ev-id="ev_6c4485aeea" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-4 animate-pulse">
          <Cloud className="w-8 h-8 text-white" />
        </div>
        <p data-ev-id="ev_1da429128f" className="text-gray-600 dark:text-gray-400 font-medium">טוען נתוני מזג אוויר...</p>
      </div>
    </div>);

}