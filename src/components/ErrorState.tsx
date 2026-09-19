import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div data-ev-id="ev_6abf2a2fc3" className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center transition-colors duration-300">
      <div data-ev-id="ev_453483a895" className="text-center max-w-md px-4">
        <div data-ev-id="ev_bcbde063f8" className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-500/25 mb-4">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h2 data-ev-id="ev_2dd7d9bd0d" className="text-xl font-bold text-gray-900 dark:text-white mb-2">שגיאה בטעינת הנתונים</h2>
        <p data-ev-id="ev_12ef895f29" className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
        <button data-ev-id="ev_bd92df72a3"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors">

          <RefreshCw className="w-4 h-4" />
          נסה שוב
        </button>
      </div>
    </div>);

}