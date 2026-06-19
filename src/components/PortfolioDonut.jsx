import { useState } from 'react';

export default function PortfolioDonut({ stocks, holdings }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Compute portfolio values
  const portfolioItems = stocks.map((stock) => {
    const qty = holdings[stock.symbol] || 0;
    const value = stock.price * qty;
    return {
      symbol: stock.symbol,
      qty,
      value,
    };
  });

  const totalValue = portfolioItems.reduce((acc, item) => acc + item.value, 0);

  // Predefined beautiful colors for the chart segments
  const colors = [
    '#6366f1', // Indigo
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
  ];

  // Circle properties
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~314.16
  const center = 64;

  let accumulatedPercent = 0;

  const segments = portfolioItems
    .filter(item => item.value > 0)
    .map((item, index) => {
      const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
      const strokeLength = (percentage / 100) * circumference;
      const strokeOffset = circumference - ((accumulatedPercent / 100) * circumference) + circumference / 4; // Start from top
      
      accumulatedPercent += percentage;

      return {
        ...item,
        percentage,
        strokeLength,
        strokeOffset,
        color: colors[index % colors.length],
      };
    });

  // Active display info
  const activeItem = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
      <h3 className="font-heading font-bold text-sm text-gray-200 tracking-wide uppercase border-b border-white/5 pb-3">
        Asset Allocations
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* SVG Donut */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg viewBox="0 0 128 128" className="w-full h-full transform -rotate-90">
            {/* Background trace circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.03)"
              strokeWidth={strokeWidth}
            />
            {segments.map((seg, idx) => (
              <circle
                key={seg.symbol}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={hoveredIndex === idx ? strokeWidth + 2 : strokeWidth}
                strokeDasharray={`${seg.strokeLength} ${circumference}`}
                strokeDashoffset={seg.strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transformOrigin: 'center',
                  opacity: hoveredIndex === null || hoveredIndex === idx ? 1 : 0.4,
                }}
              />
            ))}
          </svg>

          {/* Central content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {activeItem ? (
              <>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  {activeItem.symbol}
                </span>
                <span className="text-xs font-heading font-extrabold text-white">
                  {activeItem.percentage.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-xs font-heading font-extrabold text-indigo-300">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {segments.map((seg, idx) => (
            <div
              key={seg.symbol}
              className={`flex items-center justify-between text-xs px-2 py-1 rounded-lg transition-all cursor-pointer ${
                hoveredIndex === idx ? 'bg-white/5 border border-white/10' : 'border border-transparent'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-bold text-white">{seg.symbol}</span>
                <span className="text-[10px] text-gray-500 font-semibold">{seg.qty} shrs</span>
              </div>
              <span className="text-gray-300 font-medium">${seg.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
