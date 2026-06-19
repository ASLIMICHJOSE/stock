import { LayoutGrid, TrendingUp, TrendingDown } from 'lucide-react';

export default function Heatmap({ stocks, onSelectSymbol, activeSymbol }) {
  const getPerformanceStyle = (stock) => {
    const change = stock.price - (stock.oldPrice || stock.price);
    const pct = stock.oldPrice ? (change / stock.oldPrice) * 100 : 0;

    if (pct > 0.01) {
      // Scale green intensity up to 90% opacity based on % change (cap at 3%)
      const alpha = Math.min(0.85, Math.max(0.15, pct / 3));
      return {
        backgroundColor: `rgba(16, 185, 129, ${alpha})`,
        border: `1px solid rgba(16, 185, 129, ${alpha + 0.15})`,
        textColor: '#ffffff',
        changeStr: `+${pct.toFixed(2)}%`,
        icon: <TrendingUp className="w-3.5 h-3.5" />,
      };
    } else if (pct < -0.01) {
      // Scale red intensity based on negative percentage (cap at 3%)
      const alpha = Math.min(0.85, Math.max(0.15, Math.abs(pct) / 3));
      return {
        backgroundColor: `rgba(239, 68, 68, ${alpha})`,
        border: `1px solid rgba(239, 68, 68, ${alpha + 0.15})`,
        textColor: '#ffffff',
        changeStr: `${pct.toFixed(2)}%`,
        icon: <TrendingDown className="w-3.5 h-3.5" />,
      };
    } else {
      return {
        backgroundColor: 'rgba(51, 65, 85, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        textColor: '#94a3b8',
        changeStr: '0.00%',
        icon: null,
      };
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-indigo-400" />
          <h3 className="font-heading font-bold text-sm text-gray-200 tracking-wide uppercase">
            Market Heatmap
          </h3>
        </div>
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
          Size by Volatility
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 flex-1 min-h-[160px]">
        {stocks.map((stock) => {
          const styleInfo = getPerformanceStyle(stock);
          const isSelected = activeSymbol === stock.symbol;

          return (
            <button
              key={stock.symbol}
              onClick={() => onSelectSymbol(stock.symbol)}
              style={{ backgroundColor: styleInfo.backgroundColor }}
              className={`rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none active:scale-95 group relative overflow-hidden ${
                isSelected ? 'ring-2 ring-indigo-400/80 scale-[1.02] z-10' : 'hover:scale-[1.02]'
              }`}
            >
              {/* Glossy shine effect on hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-20deg] -translate-x-full group-hover:animate-shine" />

              <span className="font-heading font-extrabold text-sm tracking-wider text-white">
                {stock.symbol}
              </span>
              <span className="text-xs font-semibold text-white/90 mt-1">
                ${(stock.price || 0).toFixed(2)}
              </span>

              <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-white/90 bg-black/25 px-2 py-0.5 rounded-full">
                {styleInfo.icon}
                {styleInfo.changeStr}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
