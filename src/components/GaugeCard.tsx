import { ReactNode } from 'react';

interface GaugeCardProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  icon: ReactNode;
  gradient: string;
  zones?: {from: number;to: number;color: string;}[];
  subtitle?: string;
}

export function GaugeCard({ title, value, unit, min, max, icon, gradient, zones, subtitle }: GaugeCardProps) {
  const percentage = Math.min(100, Math.max(0, (value - min) / (max - min) * 100));
  const angle = percentage / 100 * 180 - 90; // -90 to 90 degrees

  // Generate tick marks
  const ticks = [];
  const tickCount = 10;
  for (let i = 0; i <= tickCount; i++) {
    const tickAngle = i / tickCount * 180 - 90;
    const tickValue = min + i / tickCount * (max - min);
    const isMain = i % 2 === 0;
    ticks.push({ angle: tickAngle, value: tickValue, isMain });
  }

  return (
    <div data-ev-id="ev_b3ffd35b95" className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div data-ev-id="ev_b7c00c7e67" className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
      
      <div data-ev-id="ev_fd7b1a4ac8" className="relative z-10">
        <div data-ev-id="ev_06c68e4b1f" className="flex items-center gap-2 mb-4">
          <div data-ev-id="ev_10a9d44c7d" className="p-2 rounded-lg bg-white/20">
            {icon}
          </div>
          <span data-ev-id="ev_d0ff6fde4a" className="text-white/80 text-sm font-medium">{title}</span>
        </div>
        
        {/* Gauge */}
        <div data-ev-id="ev_678ea7caf0" className="relative w-full h-32 flex items-end justify-center">
          <svg data-ev-id="ev_cdcf96edee" viewBox="0 0 200 110" className="w-full max-w-[200px]">
            {/* Background arc */}
            <path data-ev-id="ev_2fcb819691"
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="12"
            strokeLinecap="round" />

            
            {/* Colored zones */}
            {zones?.map((zone, i) => {
              const startPercent = (zone.from - min) / (max - min) * 100;
              const endPercent = (zone.to - min) / (max - min) * 100;
              const startAngle = startPercent / 100 * 180;
              const endAngle = endPercent / 100 * 180;
              const largeArc = endAngle - startAngle > 180 ? 1 : 0;

              const startX = 100 + 80 * Math.cos((180 - startAngle) * Math.PI / 180);
              const startY = 100 - 80 * Math.sin((180 - startAngle) * Math.PI / 180);
              const endX = 100 + 80 * Math.cos((180 - endAngle) * Math.PI / 180);
              const endY = 100 - 80 * Math.sin((180 - endAngle) * Math.PI / 180);

              return (
                <path data-ev-id="ev_23c8e80f1d"
                key={i}
                d={`M ${startX} ${startY} A 80 80 0 ${largeArc} 0 ${endX} ${endY}`}
                fill="none"
                stroke={zone.color}
                strokeWidth="12"
                strokeLinecap="round"
                opacity="0.6" />);


            })}
            
            {/* Tick marks */}
            {ticks.map((tick, i) => {
              const tickRad = (180 - (tick.angle + 90)) * Math.PI / 180;
              const innerR = tick.isMain ? 65 : 70;
              const outerR = 78;
              const x1 = 100 + innerR * Math.cos(tickRad);
              const y1 = 100 - innerR * Math.sin(tickRad);
              const x2 = 100 + outerR * Math.cos(tickRad);
              const y2 = 100 - outerR * Math.sin(tickRad);

              return (
                <g data-ev-id="ev_4743227253" key={i}>
                  <line data-ev-id="ev_e85c7d7f78"
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth={tick.isMain ? 2 : 1} />

                  {tick.isMain &&
                  <text data-ev-id="ev_42e1343006"
                  x={100 + 52 * Math.cos(tickRad)}
                  y={100 - 52 * Math.sin(tickRad)}
                  fill="rgba(255,255,255,0.7)"
                  fontSize="8"
                  textAnchor="middle"
                  dominantBaseline="middle">

                      {Math.round(tick.value)}
                    </text>
                  }
                </g>);

            })}
            
            {/* Needle */}
            <g data-ev-id="ev_82cc0e709b" transform={`rotate(${angle}, 100, 100)`}>
              <polygon data-ev-id="ev_5f6703a27f"
              points="100,30 95,100 105,100"
              fill="white"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />

              <circle data-ev-id="ev_597dc0e27f" cx="100" cy="100" r="8" fill="white" />
              <circle data-ev-id="ev_08713d23f6" cx="100" cy="100" r="4" fill="rgba(0,0,0,0.3)" />
            </g>
          </svg>
        </div>
        
        {/* Value display */}
        <div data-ev-id="ev_24e158806b" className="text-center mt-2">
          <span data-ev-id="ev_ad76108b1d" className="text-3xl font-bold text-white">{value}</span>
          <span data-ev-id="ev_603f61b968" className="text-lg text-white/70 mr-1">{unit}</span>
        </div>
        
        {subtitle &&
        <p data-ev-id="ev_cfc09b26be" className="text-center text-white/60 text-sm mt-1">{subtitle}</p>
        }
      </div>
    </div>);

}