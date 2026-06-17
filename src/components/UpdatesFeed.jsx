import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, AlertCircle } from 'lucide-react';

export default function UpdatesFeed({ updates }) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <h3 className="font-heading font-bold text-sm text-gray-200 tracking-wide uppercase">
          Live Activity Feed
        </h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {updates.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
          <AlertCircle className="w-8 h-8 mb-2 stroke-1.5" />
          <p className="text-xs font-medium">Waiting for market data streams...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[300px] pr-1">
          {updates.map((item) => {
            const isUp = item.type === 'up';
            return (
              <div
                key={item.id}
                className={`flex items-start justify-between p-3 rounded-xl border transition-all hover:bg-white/5 cursor-pointer ${
                  isUp
                    ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20'
                    : 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-1.5 rounded-lg flex items-center justify-center ${
                      isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {item.symbol} <span className="font-normal text-gray-400">{item.action}</span>
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-gray-500 font-semibold bg-white/5 rounded px-1.5 py-0.5 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {item.time}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
