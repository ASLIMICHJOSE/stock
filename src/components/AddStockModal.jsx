import React, { useState } from 'react';
import { X, Plus, Hash, Tag } from 'lucide-react';

export default function AddStockModal({ isOpen, onClose, onAddStock }) {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedSymbol = symbol.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedSymbol || !trimmedName) {
      setError('Please fill in both name and symbol.');
      return;
    }

    if (trimmedSymbol.length > 10) {
      setError('Symbol must be 10 characters or less.');
      return;
    }

    onAddStock(trimmedName, trimmedSymbol);
    setName('');
    setSymbol('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4">
      <div className="glass-panel w-full max-w-md rounded-2xl shadow-2xl p-6 relative border border-white/10 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white rounded-full p-1.5 hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
            <Plus className="w-5 h-5" />
          </div>
          <h2 className="font-heading text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Add New Asset
          </h2>
        </div>

        {error && (
          <div className="mb-4 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
              Asset Name
            </label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apple Inc."
                required
                className="w-full bg-slate-900/60 border border-white/10 focus:border-indigo-500/80 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none text-white transition-all shadow-inner placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
              Ticker Symbol
            </label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. AAPL"
                required
                maxLength={10}
                className="w-full bg-slate-900/60 border border-white/10 focus:border-indigo-500/80 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none text-white transition-all shadow-inner placeholder-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold font-heading py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/25 transition-all text-sm border border-indigo-400/20 active:scale-98"
          >
            Add Asset
          </button>
        </form>
      </div>
    </div>
  );
}
