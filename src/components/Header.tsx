import { BarChart3, CloudSun, Map, BookOpen, Cloud, LineChart, Archive } from 'lucide-react';
import { Link } from 'react-router';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Theme } from '@/contexts/ThemeContext';
import reihanLogo from '@/assets/uploads/station-logo.png';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  isDark: boolean;
}

export function Header({ theme, onToggleTheme, isDark }: HeaderProps) {
  return (
    <header data-ev-id="ev_f7042d43e5" className={`backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300 ${
    isDark ?
    'bg-gray-900/90 border-gray-800' :
    'bg-white/80 border-gray-100'}`
    }>
      <div data-ev-id="ev_4cbea60ef0" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div data-ev-id="ev_4fb5be28a2" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" dir="rtl">
          <div data-ev-id="ev_e7bea079ec" className="flex items-center gap-3">
            <div data-ev-id="ev_712d159f53">
              {/* Logo */}
              <img data-ev-id="ev_e7c006470b" src={reihanLogo} alt="סמל ריחן" className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-full shadow-lg" />
            </div>
            <div data-ev-id="ev_7f4dffb6a8" className="text-right">
              <h1 data-ev-id="ev_4240aca21a" className={`text-2xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                אתר מזג אוויר
              </h1>
              <p data-ev-id="ev_8dc297540c" className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>משפחת ארבל</p>
              <p data-ev-id="ev_d367c65f86" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ריחן, ישראל</p>
            </div>
          </div>
          
          {/* Navigation - with labels on all screens */}
          <div data-ev-id="ev_374c2e91af" className="flex items-center justify-between sm:justify-end gap-0.5 sm:gap-2">
            <a data-ev-id="ev_cloud_atlas"
            href="https://atlas.sticklight.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group ${
            isDark ?
            'bg-white/10 hover:bg-white/20' :
            'bg-gray-100 hover:bg-gray-200'}`
            }
            title="אטלס עננים">
              <Cloud
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                isDark ?
                'text-gray-300 group-hover:text-white' :
                'text-gray-600 group-hover:text-gray-800'}`
                } />
              <span data-ev-id="ev_f099e1948a" className={`text-[8px] sm:text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>עננים</span>
            </a>
            <a data-ev-id="ev_cc05dc5402"
            href="https://learn-about-weather.sticklight.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group ${
            isDark ?
            'bg-white/10 hover:bg-white/20' :
            'bg-gray-100 hover:bg-gray-200'}`
            }
            title="אנציקלופדיה">
              <BookOpen
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                isDark ?
                'text-gray-300 group-hover:text-white' :
                'text-gray-600 group-hover:text-gray-800'}`
                } />
              <span data-ev-id="ev_760c964287" className={`text-[8px] sm:text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>למידה</span>
            </a>
            <Link
              to="/resources"
              className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group ${
              isDark ?
              'bg-white/10 hover:bg-white/20' :
              'bg-gray-100 hover:bg-gray-200'}`
              }
              title="מפות מזג אוויר">
              <Map
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                isDark ?
                'text-gray-300 group-hover:text-white' :
                'text-gray-600 group-hover:text-gray-800'}`
                } />
              <span data-ev-id="ev_480d35b10b" className={`text-[8px] sm:text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>מפות</span>
            </Link>
            <Link
              to="/forecast"
              className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group ${
              isDark ?
              'bg-white/10 hover:bg-white/20' :
              'bg-gray-100 hover:bg-gray-200'}`
              }
              title="תחזית מזג אוויר">
              <CloudSun
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                isDark ?
                'text-gray-300 group-hover:text-white' :
                'text-gray-600 group-hover:text-gray-800'}`
                } />
              <span data-ev-id="ev_5e820faab8" className={`text-[8px] sm:text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>תחזית</span>
            </Link>
            <Link
              to="/history"
              className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group ${
              isDark ?
              'bg-white/10 hover:bg-white/20' :
              'bg-gray-100 hover:bg-gray-200'}`
              }
              title="דוחות התחנה">
              <BarChart3
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                isDark ?
                'text-gray-300 group-hover:text-white' :
                'text-gray-600 group-hover:text-gray-800'}`
                } />
              <span data-ev-id="ev_8d21906636" className={`text-[8px] sm:text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>דוחות</span>
            </Link>
            <Link
              to="/charts"
              className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group ${
              isDark ?
              'bg-white/10 hover:bg-white/20' :
              'bg-gray-100 hover:bg-gray-200'}`
              }
              title="גרפים">
              <LineChart
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                isDark ?
                'text-gray-300 group-hover:text-white' :
                'text-gray-600 group-hover:text-gray-800'}`
                } />
              <span data-ev-id="ev_5a558ef3a7" className={`text-[8px] sm:text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>גרפים</span>
            </Link>
            <Link
              to="/tal-history"
              className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-200 group ${
              isDark ?
              'bg-[#128C7E]/20 hover:bg-[#128C7E]/40' :
              'bg-[#25D366]/20 hover:bg-[#25D366]/40'}`
              }
              title="היומן של טל">
              <Archive
                className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-colors ${
                isDark ?
                'text-[#00a884] group-hover:text-green-400' :
                'text-[#128C7E] group-hover:text-green-700'}`
                } />
              <span className={`text-[8px] sm:text-[10px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>היומן של טל</span>
            </Link>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} isDark={isDark} />
          </div>
        </div>
      </div>
    </header>);

}