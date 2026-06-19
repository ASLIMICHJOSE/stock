import { useState } from 'react';
import { Bell, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function AlertsManager({ stocks, alerts, onAddAlert, onDeleteAlert }) {
  const [symbol, setSymbol] = useState(stocks[0]?.symbol || '');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('above');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol || !price || isNaN(price)) return;
    
    onAddAlert({
      symbol,
      targetPrice: parseFloat(price),
      condition,
    });
    setPrice('');
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
      <h3 className="font-heading font-bold text-sm text-gray-200 tracking-wide uppercase border-b border-white/5 pb-3 flex items-center gap-2">
        <Bell className="w-4 h-4 text-indigo-400" /> Price Target Alerts
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Asset</label>
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-lg py-1.5 px-2 text-xs outline-none text-white transition-all"
            >
              {stocks.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Trigger</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-lg py-1.5 px-2 text-xs outline-none text-white transition-all"
            >
              <option value="above">Goes Above (≥)</option>
              <option value="below">Goes Below (≤)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="number"
              step="any"
              placeholder="Target Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/15 focus:border-indigo-500/80 rounded-xl px-3 py-2 text-xs outline-none text-white placeholder-gray-500 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-black font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center shadow-md active:scale-95 border border-indigo-400/20"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
          </button>
        </div>
      </form>

      {/* Alerts list */}
      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <p className="text-[10px] text-gray-500 italic text-center py-2">No active price alerts set.</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] font-medium transition-all ${
                alert.triggered
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-white/5 border-white/5 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white">{alert.symbol}</span>
                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                  {alert.condition === 'above' ? (
                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-rose-400" />
                  )}
                  {alert.condition === 'above' ? '≥' : '≤'}
                </span>
                <span className="text-white font-bold">${alert.targetPrice.toFixed(2)}</span>
                {alert.triggered && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded animate-pulse">
                    Triggered
                  </span>
                )}
              </div>
              <button
                onClick={() => onDeleteAlert(alert.id)}
                className="p-1 text-gray-500 hover:text-rose-400 rounded transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
