import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StockCard({ stock, isSelected, onClick, history = [] }) {
  const currentPrice = stock.price || 0;
  const oldPrice = stock.oldPrice || currentPrice;
  const change = currentPrice - oldPrice;
  const isUp = change >= 0;
  const pctChange = oldPrice ? (change / oldPrice) * 100 : 0;

  // Render SVG Sparkline
  const renderSparkline = () => {
    const points = history.length > 0 ? history : [currentPrice * 0.99, currentPrice * 1.01, currentPrice * 0.995, currentPrice];
    const width = 100;
    const height = 30;

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      // Invert Y because SVG coordinate 0 starts at top
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    const pathData = `M ${coords.join(' L ')}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke={isUp ? '#10b981' : '#ef4444'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-4.5 cursor-pointer transition-all duration-300 relative overflow-hidden group select-none active:scale-[0.98] ${
        isSelected
          ? 'ring-2 ring-indigo-500/80 shadow-indigo-500/10'
          : 'hover:border-white/20 hover:bg-slate-900/60'
      }`}
    >
      {/* Background soft glow when selected */}
      {isSelected && (
        <div className="absolute inset-0 bg-indigo-500/5 -z-10 pointer-events-none" />
      )}

      <div className="flex items-start justify-between">
        <div>
          <span className="font-heading font-extrabold text-white text-base tracking-wide">
            {stock.symbol}
          </span>
          <p className="text-[10px] text-gray-400 font-semibold truncate max-w-[120px] uppercase">
            {stock.name}
          </p>
        </div>

        <div
          className={`p-1 rounded-lg ${
            isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div>
          <span className="font-heading font-extrabold text-lg text-white">
            ${currentPrice.toFixed(2)}
          </span>
          <div
            className={`text-[10px] font-bold mt-0.5 ${
              isUp ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isUp ? '+' : ''}
            {change.toFixed(2)} ({isUp ? '+' : ''}
            {pctChange.toFixed(2)}%)
          </div>
        </div>

        {/* Sparkline chart */}
        <div className="h-8 flex items-end pl-2">
          {renderSparkline()}
        </div>
      </div>
    </div>
  );
}
