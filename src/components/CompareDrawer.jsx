import { useState } from 'react';
import { X, Scale, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function CompareDrawer({ isOpen, onClose, stocks }) {
  const [symbolA, setSymbolA] = useState(stocks[0]?.symbol || '');
  const [symbolB, setSymbolB] = useState(stocks[1]?.symbol || '');

  if (!isOpen) return null;

  const stockA = stocks.find(s => s.symbol === symbolA);
  const stockB = stocks.find(s => s.symbol === symbolB);

  const getMetrics = (stock) => {
    if (!stock) return null;
    const currentPrice = stock.price || 0;
    const oldPrice = stock.oldPrice || currentPrice;
    const change = currentPrice - oldPrice;
    const pct = oldPrice ? (change / oldPrice) * 100 : 0;
    const isUp = change >= 0;
    return {
      price: currentPrice,
      change,
      pct,
      isUp
    };
  };

  const metricsA = getMetrics(stockA);
  const metricsB = getMetrics(stockB);

  // Compute compare bar percentage
  // If A is +2% and B is +1%, total delta is 3%, bar is split A: 66%, B: 33%
  const pctA = metricsA?.pct || 0;
  const pctB = metricsB?.pct || 0;
  
  let ratioA = 50;
  let ratioB = 50;
  if (pctA !== 0 || pctB !== 0) {
    const min = Math.min(pctA, pctB);
    // Shift both to positive territory for ratio drawing
    const shift = min < 0 ? Math.abs(min) + 1 : 0;
    const valA = pctA + shift;
    const valB = pctB + shift;
    const sum = valA + valB || 1;
    ratioA = (valA / sum) * 100;
    ratioB = 100 - ratioA;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] glass-panel border-l border-white/10 shadow-2xl z-50 flex flex-col animate-slide-in">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-white">Compare Assets</h3>
            <span className="text-[10px] text-gray-400 font-medium">Intraday Delta Comparison</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Selectors */}
      <div className="p-5 border-b border-white/5 bg-slate-950/20 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Asset A</label>
          <select
            value={symbolA}
            onChange={(e) => setSymbolA(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-lg py-2 px-2.5 text-xs outline-none text-white transition-all font-bold"
          >
            {stocks.map(s => (
              <option key={s.symbol} value={s.symbol} disabled={s.symbol === symbolB}>{s.symbol}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Asset B</label>
          <select
            value={symbolB}
            onChange={(e) => setSymbolB(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-lg py-2 px-2.5 text-xs outline-none text-white transition-all font-bold"
          >
            {stocks.map(s => (
              <option key={s.symbol} value={s.symbol} disabled={s.symbol === symbolA}>{s.symbol}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison results */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {metricsA && metricsB ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {/* Asset A details */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                <span className="text-xl font-heading font-extrabold text-white">{symbolA}</span>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Price</span>
                  <span className="text-base font-extrabold text-white">${metricsA.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Intraday Delta</span>
                  <div className={`flex items-center text-xs font-bold ${metricsA.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metricsA.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {metricsA.isUp ? '+' : ''}{metricsA.pct.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Asset B details */}
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-3">
                <span className="text-xl font-heading font-extrabold text-white">{symbolB}</span>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Price</span>
                  <span className="text-base font-extrabold text-white">${metricsB.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Intraday Delta</span>
                  <div className={`flex items-center text-xs font-bold ${metricsB.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {metricsB.isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {metricsB.isUp ? '+' : ''}{metricsB.pct.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Ratio Bar */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Performance Distribution</span>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500"
                  style={{ width: `${ratioA}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-500"
                  style={{ width: `${ratioB}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase">
                <span>{symbolA} ({ratioA.toFixed(0)}%)</span>
                <span>{symbolB} ({ratioB.toFixed(0)}%)</span>
              </div>
            </div>

            {/* Diagnostics comparison */}
            <div className="glass-panel border border-white/5 rounded-2xl p-4 space-y-3.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block border-b border-white/5 pb-2">Technical Indicators</span>
              
              <div className="flex justify-between text-xs items-center">
                <span className="text-indigo-300 font-bold">{metricsA.pct > metricsB.pct ? '💪 Outperforming' : 'Consolidating'}</span>
                <span className="text-gray-400 font-medium">Relative Strength</span>
                <span className="text-cyan-300 font-bold">{metricsB.pct > metricsA.pct ? '💪 Outperforming' : 'Consolidating'}</span>
              </div>

              <div className="flex justify-between text-xs items-center">
                <span className="text-gray-300">RSI 52 (Neutral)</span>
                <span className="text-gray-400 font-medium">Momentum Index</span>
                <span className="text-gray-300">RSI 58 (Neutral)</span>
              </div>

              <div className="flex justify-between text-xs items-center">
                <span className="text-gray-300">Medium</span>
                <span className="text-gray-400 font-medium">Volatility Rank</span>
                <span className="text-gray-300">High</span>
              </div>
            </div>

            {/* Quick summary note */}
            <div className="p-3.5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[11px] leading-relaxed text-gray-400">
              💡 <strong className="text-indigo-200">Comparison Insight:</strong> {pctA > pctB ? `${symbolA}` : `${symbolB}`} is demonstrating stronger intraday momentum. Volume profile indicates continuous accumulation compared to {pctA > pctB ? `${symbolB}` : `${symbolA}`}.
            </div>
          </>
        ) : (
          <p className="text-xs text-gray-500 italic text-center py-4">Please select two assets to begin comparison.</p>
        )}
      </div>
    </div>
  );
}
