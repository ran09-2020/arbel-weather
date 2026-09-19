import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { HistorySummary } from '@/components/HistorySummary';

export default function History() {
  return (
    <div data-ev-id="ev_6bc4519db2" className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 overflow-x-hidden">
      {/* Header */}
      <header data-ev-id="ev_bfe655e98d" className="bg-white/5 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div data-ev-id="ev_052044f187" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div data-ev-id="ev_159cd13f16" className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors">

              <ArrowRight className="w-5 h-5 text-gray-300" />
            </Link>
            <h1 data-ev-id="ev_6eb692e9fb" className="text-xl font-bold text-white">
              היסטוריית מזג אוויר
            </h1>
          </div>
        </div>
      </header>

      <main data-ev-id="ev_7c619c0a3d" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
        <HistorySummary />
      </main>
    </div>);

}