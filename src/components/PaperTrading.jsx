import { useState } from 'react';
import { Landmark, TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

export default function PaperTrading({
  activeSymbol,
  activeStock,
  cashBalance,
  holdings,
  transactions,
  onExecuteTrade,
}) {
  const [tradeQty, setTradeQty] = useState('1');

  if (!activeStock) return null;

  const currentPrice = activeStock.price;
  const currentHoldings = holdings[activeSymbol] || 0;

  const handleBuy = (e) => {
    e.preventDefault();
    const qty = parseInt(tradeQty);
    if (isNaN(qty) || qty <= 0) return;
    const totalCost = qty * currentPrice;
    if (totalCost > cashBalance) {
      alert(`Insufficient funds. Cost: $${totalCost.toFixed(2)}, Available: $${cashBalance.toFixed(2)}`);
      return;
    }
    onExecuteTrade('BUY', activeSymbol, qty, currentPrice);
  };

  const handleSell = (e) => {
    e.preventDefault();
    const qty = parseInt(tradeQty);
    if (isNaN(qty) || qty <= 0) return;
    if (qty > currentHoldings) {
      alert(`Insufficient shares. You own ${currentHoldings} shares of ${activeSymbol}.`);
      return;
    }
    onExecuteTrade('SELL', activeSymbol, qty, currentPrice);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
      <h3 className="font-heading font-bold text-sm text-gray-200 tracking-wide uppercase border-b border-white/5 pb-3 flex items-center gap-2">
        <Landmark className="w-4 h-4 text-indigo-400" /> Paper Trading Desk
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Available Cash</span>
          <span className="text-sm font-heading font-extrabold text-emerald-400">${cashBalance.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-white/5 border border-white/5 rounded-xl">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">{activeSymbol} Owned</span>
          <span className="text-sm font-heading font-extrabold text-indigo-400">{currentHoldings} shares</span>
        </div>
      </div>

      <form className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              min="1"
              value={tradeQty}
              onChange={(e) => setTradeQty(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/15 focus:border-indigo-500/80 rounded-xl px-3 py-2 text-xs outline-none text-white transition-all"
              placeholder="Shares quantity"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-semibold">QTY</span>
          </div>
          <span className="text-xs font-bold text-gray-400 self-center">@ ${currentPrice.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleBuy}
            className="w-full py-2 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 border border-emerald-400/20"
          >
            Buy {activeSymbol}
          </button>
          <button
            onClick={handleSell}
            className="w-full py-2 cursor-pointer bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 border border-rose-400/20"
          >
            Sell {activeSymbol}
          </button>
        </div>
      </form>

      {/* Transaction log */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Recent Activity</span>
        <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
          {transactions.length === 0 ? (
            <p className="text-[10px] text-gray-500 italic text-center py-2">No transaction logs available.</p>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="p-2 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between text-[10px] font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className={`p-0.5 rounded ${tx.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {tx.type === 'BUY' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  </span>
                  <span className="text-white">{tx.symbol}</span>
                  <span className="text-gray-400">{tx.qty} shrs</span>
                </div>
                <div className="text-right">
                  <span className="text-white">${(tx.qty * tx.price).toFixed(2)}</span>
                  <span className="block text-[8px] text-gray-500">{tx.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
