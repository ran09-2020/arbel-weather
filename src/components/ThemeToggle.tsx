import { Sun, Moon } from 'lucide-react';
import { Theme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  isDark: boolean;
}

export function ThemeToggle({ theme, onToggle, isDark }: ThemeToggleProps) {
  return (
    <button data-ev-id="ev_158c40d848"
    onClick={onToggle}
    className={`flex flex-col items-center gap-0.5 p-1 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 group ${
    isDark ?
    'bg-white/10 hover:bg-white/20' :
    'bg-gray-100 hover:bg-gray-200'}`
    }
    aria-label={theme === 'light' ? 'הפעל מצב כהה' : 'הפעל מצב בהיר'}>

      {theme === 'light' ?
      <Moon className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-colors" /> :

      <Sun className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
      }
      <span data-ev-id="ev_f0af9f9189" className={`text-[8px] sm:text-[10px] whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {theme === 'light' ? 'מסך' : 'מסך'}
      </span>
    </button>);

}