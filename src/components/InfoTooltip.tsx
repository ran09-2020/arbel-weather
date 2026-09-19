import { useState } from 'react';
import { Eye, X } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  content: string;
}

export function InfoTooltip({ title, content }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button data-ev-id="ev_ccfe42271e"
      onClick={() => setIsOpen(true)}
      className="flex flex-col items-center gap-0.5 p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      aria-label="מידע נוסף"
      title="מידע נוסף">
        <Eye className="w-4 h-4 text-yellow-400" />
        <span data-ev-id="ev_a1778e38f3" className="text-[8px] sm:text-[9px] text-yellow-400/80">מידע</span>
      </button>

      {isOpen &&
      <div data-ev-id="ev_3d900dcc4d"
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={() => setIsOpen(false)}>

          {/* Backdrop */}
          <div data-ev-id="ev_101f627aab" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <div data-ev-id="ev_8011b6bd32"
        className="relative bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-5 max-w-xs w-full shadow-2xl cursor-pointer"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
        dir="rtl">

            {/* Header */}
            <h3 data-ev-id="ev_befb29053e" className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4 text-yellow-400 shrink-0" />
              {title}
            </h3>
            
            {/* Scrollable Content */}
            <div data-ev-id="ev_3b1089031f"
          className="overflow-y-auto pr-1"
          style={{ maxHeight: 'calc(100vh - 220px)' }}>

              <p data-ev-id="ev_5b5515e7fe" className="text-white/80 text-xs leading-relaxed whitespace-pre-line">
                {content}
              </p>
            </div>
            
            {/* Tap to close hint */}
            <p data-ev-id="ev_0bec42fd56" className="text-white/40 text-xs text-center mt-3">לחץ לסגירה</p>
          </div>
        </div>
      }
    </>);

}