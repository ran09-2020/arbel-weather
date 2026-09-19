import { ReactNode } from 'react';

interface WeatherCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  subtitle?: string;
  gradient: string;
  iconBg: string;
  // Visual indicators
  showProgress?: boolean;
  progressValue?: number;
  progressMax?: number;
  statusLabel?: string;
  statusColor?: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'purple';
}

const statusColors = {
  green: 'bg-green-400 text-green-900',
  yellow: 'bg-yellow-400 text-yellow-900',
  orange: 'bg-orange-400 text-orange-900',
  red: 'bg-red-400 text-red-900',
  blue: 'bg-blue-300 text-blue-900',
  purple: 'bg-purple-400 text-purple-900'
};

export function WeatherCard({
  title,
  value,
  unit,
  icon,
  subtitle,
  gradient,
  iconBg,
  showProgress,
  progressValue,
  progressMax = 100,
  statusLabel,
  statusColor = 'green'
}: WeatherCardProps) {
  const progressPercent = showProgress && progressValue !== undefined ?
  Math.min(100, Math.max(0, progressValue / progressMax * 100)) :
  0;

  return (
    <div data-ev-id="ev_8d506cfdfa" className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      {/* Background decoration */}
      <div data-ev-id="ev_aa80c8e6e7" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
      <div data-ev-id="ev_74eb1593da" className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
      
      <div data-ev-id="ev_be1e711155" className="relative z-10">
        <div data-ev-id="ev_8c19d38330" className="flex items-start justify-between mb-4">
          <div data-ev-id="ev_dfb3c396c2" className={`p-3 rounded-xl ${iconBg}`}>
            {icon}
          </div>
          {statusLabel &&
          <span data-ev-id="ev_4d5278c945" className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[statusColor]}`}>
              {statusLabel}
            </span>
          }
        </div>
        
        <p data-ev-id="ev_45f619ac5b" className="text-white/80 text-sm font-medium mb-1">{title}</p>
        
        <div data-ev-id="ev_bc5d6159d3" className="flex items-baseline gap-1">
          <span data-ev-id="ev_d94eb171d6" className="text-4xl font-bold text-white tracking-tight">
            {value ?? '--'}
          </span>
          {unit && <span data-ev-id="ev_605581531b" className="text-xl text-white/70 font-medium">{unit}</span>}
        </div>
        
        {showProgress &&
        <div data-ev-id="ev_c02e37a5c0" className="mt-3">
            <div data-ev-id="ev_7c43172ee4" className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div data-ev-id="ev_2f3edae7ed"
            className="h-full bg-white/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }} />

            </div>
          </div>
        }
        
        {subtitle &&
        <p data-ev-id="ev_dc4bf860cd" className="text-white/60 text-sm mt-2">{subtitle}</p>
        }
      </div>
    </div>);
}