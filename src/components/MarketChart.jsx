import React, { useEffect, useRef, useState } from 'react';
import { createChart, AreaSeries } from 'lightweight-charts';
import { AreaChart, Info, AlertTriangle } from 'lucide-react';

export default function MarketChart({ symbol, stocks }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [dataPoints, setDataPoints] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const activeStock = (stocks && stocks.find((s) => s.symbol === symbol)) || (stocks && stocks[0]);

  // Keep track of real-time price updates for plotting
  useEffect(() => {
    try {
      if (!activeStock || !activeStock.price) return;

      const time = Math.floor(Date.now() / 1000);
      setDataPoints((prev) => {
        const symbolData = prev[activeStock.symbol] || [];
        
        // Avoid duplicate timestamps
        if (symbolData.length > 0 && symbolData[symbolData.length - 1].time === time) {
          return prev;
        }

        const updated = [...symbolData, { time, value: activeStock.price }];
        
        // Keep last 40 points to avoid memory bloat and keep chart readable
        if (updated.length > 40) {
          updated.shift();
        }

        return {
          ...prev,
          [activeStock.symbol]: updated,
        };
      });
    } catch (e) {
      console.error("Error in MarketChart data tracker:", e);
      setErrorMsg(`Data tracker error: ${e.message}`);
    }
  }, [activeStock?.price, activeStock?.symbol]);

  // Initialize and update chart structure
  useEffect(() => {
    if (!containerRef.current) return;

    let chart;
    try {
      // Create chart instance
      chart = createChart(containerRef.current, {
        layout: {
          background: { type: 'solid', color: 'transparent' },
          textColor: '#94a3b8',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
        },
        crosshair: {
          mode: 0, // Normal crosshair (Normal=0)
          vertLine: {
            color: 'rgba(99, 102, 241, 0.4)',
            width: 1,
            style: 3, // Dashed
          },
          horzLine: {
            color: 'rgba(99, 102, 241, 0.4)',
            width: 1,
            style: 3, // Dashed
          },
        },
        rightPriceScale: {
          borderVisible: false,
          textColor: '#64748b',
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
        },
        width: containerRef.current.clientWidth || 500,
        height: 280,
      });

      chartRef.current = chart;

      // Add Area series using unified lightweight-charts v5 API
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: '#6366f1',
        topColor: 'rgba(99, 102, 241, 0.25)',
        bottomColor: 'rgba(99, 102, 241, 0.00)',
        lineWidth: 2,
      });
      seriesRef.current = areaSeries;
    } catch (e) {
      console.error("Error creating chart:", e);
      setErrorMsg(`Chart init error: ${e.message}`);
      return;
    }

    // Resize handler
    const handleResize = () => {
      try {
        if (chartRef.current && containerRef.current) {
          chartRef.current.applyOptions({ width: containerRef.current.clientWidth || 500 });
        }
      } catch (e) {
        console.warn("Resize error:", e);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      try {
        window.removeEventListener('resize', handleResize);
        if (chart) chart.remove();
      } catch (e) {
        console.warn("Clean up error:", e);
      }
    };
  }, []);

  // Update chart data whenever active symbol or data points update
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;

    try {
      const currentSymbolData = dataPoints[symbol] || [];

      // Fallback: If no history exists yet, seed with current price
      if (currentSymbolData.length === 0 && activeStock?.price) {
        const now = Math.floor(Date.now() / 1000);
        const fallbackData = [
          { time: now - 30, value: activeStock.price * 0.995 },
          { time: now - 20, value: activeStock.price * 0.998 },
          { time: now - 10, value: activeStock.price * 1.002 },
          { time: now, value: activeStock.price },
        ];
        seriesRef.current.setData(fallbackData);
      } else {
        // Ensure data is sorted by time and has no duplicates
        const uniqueSortedData = [];
        const seenTimes = new Set();
        currentSymbolData.forEach(pt => {
          if (!seenTimes.has(pt.time)) {
            seenTimes.add(pt.time);
            uniqueSortedData.push(pt);
          }
        });
        uniqueSortedData.sort((a, b) => a.time - b.time);
        seriesRef.current.setData(uniqueSortedData);
      }

      // Adapt color based on positive or negative movement
      const change = activeStock?.price - (activeStock?.oldPrice || activeStock?.price);
      const isUp = change >= 0;

      seriesRef.current.applyOptions({
        lineColor: isUp ? '#10b981' : '#ef4444',
        topColor: isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
      });

      chartRef.current.timeScale().fitContent();
    } catch (e) {
      console.error("Error setting chart data:", e);
      setErrorMsg(`Data binding error: ${e.message}`);
    }
  }, [symbol, dataPoints, activeStock?.price, activeStock?.oldPrice]);

  if (errorMsg) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 bg-rose-500/5 shadow-lg flex flex-col items-center justify-center text-center h-full">
        <AlertTriangle className="w-8 h-8 text-rose-400 mb-2" />
        <h3 className="font-heading font-bold text-sm text-rose-300">Chart Error</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg flex flex-col h-full relative overflow-hidden group">
      {/* Dynamic top orb glow */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/10 blur-[60px] pointer-events-none rounded-full" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-xl">
            <AreaChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-sm text-gray-200 tracking-wide uppercase flex items-center gap-1.5">
              Live Chart: {symbol}
            </h3>
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
              {activeStock?.name || 'Asset View'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
            <Info className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px] text-gray-400 font-semibold">Updating every 5s</span>
          </div>
        </div>
      </div>

      {/* Ticker values */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-heading font-extrabold text-2xl text-white">
          ${(activeStock?.price || 0).toFixed(2)}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            ((activeStock?.price || 0) - (activeStock?.oldPrice || activeStock?.price || 0)) >= 0
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-rose-500/10 text-rose-400'
          }`}
        >
          {(((activeStock?.price || 0) - (activeStock?.oldPrice || activeStock?.price || 0)) >= 0 ? '+' : '')}
          {(((activeStock?.price || 0) - (activeStock?.oldPrice || activeStock?.price || 0)) || 0).toFixed(2)}
        </span>
      </div>

      {/* Chart container */}
      <div ref={containerRef} className="w-full flex-1 min-h-[220px]" />
    </div>
  );
}
