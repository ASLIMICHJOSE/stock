import { useState, useEffect, useRef } from 'react';
import { Plus, Sliders, Bell, User, MessageSquareCode, Sparkles, LogOut, ShieldCheck } from 'lucide-react';
import Header from './components/Header';
import ParticleBackground from './components/ParticleBackground';
import GlowOrb from './components/GlowOrb';
import StockCard from './components/StockCard';
import MarketChart from './components/MarketChart';
import Heatmap from './components/Heatmap';
import UpdatesFeed from './components/UpdatesFeed';
import AddStockModal from './components/AddStockModal';
import AIChatPanel from './components/AIChatPanel';
import AlertsManager from './components/AlertsManager';
import PortfolioDonut from './components/PortfolioDonut';
import PaperTrading from './components/PaperTrading';
import CompareDrawer from './components/CompareDrawer';

const FINNHUB_API_KEY = "d36mn8hr01qtvbtibm9gd36mn8hr01qtvbtibma0";

const INITIAL_STOCKS = [
  { symbol: "AAPL", name: "APPLE INC.", price: 175.50 },
  { symbol: "GOOGL", name: "ALPHABET INC.", price: 152.30 },
  { symbol: "AMZN", name: "AMAZON.COM INC.", price: 178.15 },
  { symbol: "MSFT", name: "MICROSOFT CORP.", price: 415.60 },
  { symbol: "TSLA", name: "TESLA INC.", price: 171.05 },
  { symbol: "NVDA", name: "NVIDIA CORP.", price: 875.12 }
];

export default function App() {
  const [stocks, setStocks] = useState(INITIAL_STOCKS);
  const [activeSymbol, setActiveSymbol] = useState("AAPL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Toggles for modals / side panels
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Settings
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 sec
  const [useRealTimeAPI, setUseRealTimeAPI] = useState(true);

  // Feeds and history tracking
  const [updates, setUpdates] = useState([]);
  const [priceHistory, setPriceHistory] = useState({});
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to StockWatch PRO dashboard!", read: false },
    { id: 2, text: "AI Analyst is ready to analyze your assets.", read: false }
  ]);
  const [alerts, setAlerts] = useState([
    { id: 1, symbol: "AAPL", targetPrice: 180.00, condition: "above", triggered: false },
    { id: 2, symbol: "TSLA", targetPrice: 165.00, condition: "below", triggered: false }
  ]);
  const [activeToast, setActiveToast] = useState(null);
  const [holdings, setHoldings] = useState({
    AAPL: 15,
    GOOGL: 20,
    AMZN: 12,
    MSFT: 8,
    TSLA: 15,
    NVDA: 5
  });
  const [cashBalance, setCashBalance] = useState(10000.00);
  const [transactions, setTransactions] = useState([]);

  const handleExecuteTrade = (type, symbol, qty, price) => {
    const cost = qty * price;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const transactionId = Date.now() + Math.random();
    const notificationId = Date.now() + Math.random();

    if (type === 'BUY') {
      setCashBalance((prev) => prev - cost);
      setHoldings((prev) => ({
        ...prev,
        [symbol]: (prev[symbol] || 0) + qty,
      }));
    } else {
      setCashBalance((prev) => prev + cost);
      setHoldings((prev) => ({
        ...prev,
        [symbol]: Math.max(0, (prev[symbol] || 0) - qty),
      }));
    }

    setTransactions((prev) => [
      {
        id: transactionId,
        type,
        symbol,
        qty,
        price,
        time: timestamp,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: notificationId,
        text: `💼 Portfolio: ${type} ${qty} shares of ${symbol} at $${price.toFixed(2)}`,
        read: false,
      },
      ...prev,
    ]);
  };

  const totalHoldingsValue = stocks.reduce((acc, s) => acc + s.price * (holdings[s.symbol] || 0), 0);
  const totalPortfolioValue = cashBalance + totalHoldingsValue;

  const intervalRef = useRef(null);

  // Initialize history
  useEffect(() => {
    const initialHistory = {};
    INITIAL_STOCKS.forEach(s => {
      initialHistory[s.symbol] = [s.price * 0.98, s.price * 0.99, s.price * 0.995, s.price];
    });
    setPriceHistory(initialHistory);
  }, []);

  // Fetch prices from Finnhub API
  const fetchStockPrice = async (symbol) => {
    if (!useRealTimeAPI) return null;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      if (data && data.c !== undefined && data.c !== 0) {
        return parseFloat(data.c);
      }
    } catch (err) {
      console.warn(`Finnhub API limit or connection issue for ${symbol}, fallback used.`);
    }
    return null;
  };

  // Perform updates
  const updatePrices = async () => {
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const oldPrice = stock.price;
        let newPrice = await fetchStockPrice(stock.symbol);

        // Fallback: If API returned null, generate small realistic random walk
        if (newPrice === null) {
          const changePercent = (Math.random() * 0.8 - 0.4) / 100; // -0.4% to +0.4%
          newPrice = oldPrice * (1 + changePercent);
        }

        const priceDiff = newPrice - oldPrice;
        const changePct = oldPrice ? (priceDiff / oldPrice) * 100 : 0;

        // Only register updates if there is a noticeable price variation
        if (Math.abs(priceDiff) > 0.05) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const isUp = priceDiff >= 0;
          const updateId = Date.now() + Math.random();

          // Add to activity updates
          setUpdates((prev) => [
            {
              id: updateId,
              symbol: stock.symbol,
              type: isUp ? 'up' : 'down',
              action: isUp ? 'surged' : 'declined',
              message: `${isUp ? '📈' : '📉'} Price set at $${newPrice.toFixed(2)} (${isUp ? '+' : ''}${changePct.toFixed(2)}%)`,
              time: timestamp,
            },
            ...prev.slice(0, 19) // Keep last 20 updates
          ]);

          // Update sparkline history
          setPriceHistory((prev) => {
            const history = prev[stock.symbol] || [];
            const newHistory = [...history, newPrice];
            if (newHistory.length > 15) newHistory.shift();
            return { ...prev, [stock.symbol]: newHistory };
          });
        }

        return {
          ...stock,
          oldPrice: oldPrice,
          price: newPrice,
        };
      })
    );

    // Check price alerts
    updatedStocks.forEach((stock) => {
      setAlerts((prevAlerts) => {
        return prevAlerts.map((alert) => {
          if (alert.symbol === stock.symbol && !alert.triggered) {
            const conditionMet =
              alert.condition === 'above'
                ? stock.price >= alert.targetPrice
                : stock.price <= alert.targetPrice;

            if (conditionMet) {
              const alertId = Date.now() + Math.random();
              const toastId = Date.now() + Math.random();
              // Trigger notification
              setNotifications((prev) => [
                {
                  id: alertId,
                  text: `🚨 Alert: ${alert.symbol} target of $${alert.targetPrice.toFixed(2)} met (Current: $${stock.price.toFixed(2)})`,
                  read: false,
                },
                ...prev,
              ]);
              // Trigger toast alert
              setActiveToast({
                id: toastId,
                message: `Alert triggered: ${alert.symbol} reached $${stock.price.toFixed(2)}!`,
              });
              return { ...alert, triggered: true };
            }
          }
          return alert;
        });
      });
    });

    setStocks(updatedStocks);
  };

  // Set up interval loop
  useEffect(() => {
    updatePrices(); // Initial load

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updatePrices, refreshInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshInterval, stocks.length, useRealTimeAPI]);

  // Add a new stock symbol
  const handleAddStock = async (name, symbol) => {
    const upperSymbol = symbol.toUpperCase();
    if (stocks.some((s) => s.symbol === upperSymbol)) {
      alert("Asset already exists on your dashboard.");
      return;
    }

    // Attempt to fetch price or set default
    let startingPrice = 100.00;
    const fetched = await fetchStockPrice(upperSymbol);
    if (fetched) startingPrice = fetched;

    const newStock = { symbol: upperSymbol, name, price: startingPrice };
    
    // Add to list
    setStocks(prev => [...prev, newStock]);
    
    // Add default history
    setPriceHistory((prev) => ({
      ...prev,
      [upperSymbol]: [startingPrice * 0.99, startingPrice * 0.995, startingPrice],
    }));

    // Trigger notification
    setNotifications(prev => [
      { id: Date.now(), text: `Asset ${upperSymbol} successfully added.`, read: false },
      ...prev
    ]);

    // Set as active
    setActiveSymbol(upperSymbol);
  };

  // Filter stocks based on search query
  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative min-h-screen pb-12 overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Background visual components */}
      <ParticleBackground />
      <GlowOrb color="indigo" position="top-left" delay={0} />
      <GlowOrb color="cyan" position="bottom-right" delay={2} />
      <GlowOrb color="rose" position="top-right" delay={4} />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
        isChatOpen={isChatOpen}
        unreadNotifications={unreadNotifications}
        setNotificationsOpen={(val) => {
          setIsNotificationsOpen(val);
          if (val) markNotificationsRead();
        }}
        setSettingsOpen={setIsSettingsOpen}
        setProfileOpen={setIsProfileOpen}
      />

      {/* Dashboard container */}
      <main className={`max-w-7xl mx-auto px-4 md:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300 ${isChatOpen ? 'lg:pr-[440px]' : ''}`}>
        
        {/* Top overview metrics */}
        <section className="lg:col-span-12 flex flex-wrap items-center justify-between gap-4 p-4.5 glass-panel rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                Trading Desk
              </h2>
              <p className="text-xs text-gray-400 font-semibold uppercase">
                Real-Time Market Tracking & Predictive Analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 cursor-pointer bg-slate-900 border border-white/10 hover:border-indigo-400/40 text-gray-300 hover:text-white font-extrabold text-xs tracking-wider font-heading uppercase rounded-xl transition-all shadow-md active:scale-95"
            >
              Compare Assets
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 cursor-pointer bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-black font-extrabold text-xs tracking-wider font-heading uppercase rounded-xl transition-all shadow-md active:scale-95 border border-cyan-400/20"
            >
              <Plus className="w-4 h-4 text-black stroke-[3px]" />
              New Asset
            </button>
          </div>
        </section>

        {/* Live Tickers Grid */}
        <section className="lg:col-span-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
                isSelected={activeSymbol === stock.symbol}
                onClick={() => setActiveSymbol(stock.symbol)}
                history={priceHistory[stock.symbol]}
              />
            ))}
            {filteredStocks.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500 glass-panel rounded-xl">
                No active assets match your search query.
              </div>
            )}
          </div>
        </section>

        {/* Visual Charts & Heatmaps */}
        <section className="lg:col-span-8 space-y-6">
          <div className="h-[380px]">
            <MarketChart symbol={activeSymbol} stocks={stocks} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Heatmap
              stocks={stocks}
              onSelectSymbol={setActiveSymbol}
              activeSymbol={activeSymbol}
            />
            <UpdatesFeed updates={updates} />
          </div>
        </section>

        {/* Statistics & Quick Portfolio Summary */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-200 tracking-wide uppercase border-b border-white/5 pb-3">
              Portfolio Diagnostics
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Net Portfolio Value</span>
                <span className="text-white">${totalPortfolioValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Simulated Net Return</span>
                <span className={`font-bold ${totalPortfolioValue - 10000.00 >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {totalPortfolioValue - 10000.00 >= 0 ? '+' : ''}
                  {(((totalPortfolioValue - 10000.00) / 10000.00) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Cash Balance</span>
                <span className="text-white">${cashBalance.toFixed(2)}</span>
              </div>
            </div>

            <hr className="border-white/5" />

            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl flex items-start gap-2.5">
              <span className="text-xs">🤖</span>
              <div>
                <p className="text-[11px] font-bold text-indigo-200">Claude's Quick Note</p>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">
                  High concentration of technology large-caps detected. Consider diversifying into energy or defensive counters to mitigate market beta.
                </p>
              </div>
            </div>
          </div>

          <PortfolioDonut stocks={stocks} holdings={holdings} />

          <PaperTrading
            activeSymbol={activeSymbol}
            activeStock={stocks.find((s) => s.symbol === activeSymbol)}
            cashBalance={cashBalance}
            holdings={holdings}
            transactions={transactions}
            onExecuteTrade={handleExecuteTrade}
          />

          <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg space-y-3.5">
            <h3 className="font-heading font-bold text-sm text-gray-200 tracking-wide uppercase border-b border-white/5 pb-3">
              Intraday Market Overview
            </h3>
            <div className="space-y-2.5">
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-400">SPY S&P 505</span>
                <span className="text-emerald-400 font-bold">+0.42%</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-400">QQQ NASDAQ 100</span>
                <span className="text-emerald-400 font-bold">+0.88%</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-xs font-semibold">
                <span className="text-gray-400">IWM RUSSELL 2000</span>
                <span className="text-rose-400 font-bold">-0.15%</span>
              </div>
            </div>
          </div>

          <AlertsManager
            stocks={stocks}
            alerts={alerts}
            onAddAlert={(newAlert) => {
              setAlerts((prev) => [
                {
                  id: Date.now(),
                  ...newAlert,
                  triggered: false,
                },
                 ...prev,
              ]);
            }}
            onDeleteAlert={(id) => {
              setAlerts((prev) => prev.filter((a) => a.id !== id));
            }}
          />
        </section>

      </main>

      {/* Claude AI Assistant Panel */}
      <AIChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        stocks={stocks}
        updates={updates}
      />

      {/* Add Stock Modal */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStock={handleAddStock}
      />

      {/* Compare Drawer */}
      <CompareDrawer
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        stocks={stocks}
      />

      {/* Slide-out floating drawers for Action panels */}
      
      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <div className="fixed top-18 right-24 w-80 glass-panel border border-white/10 shadow-2xl rounded-2xl p-4.5 z-[100] animate-fade-in">
          <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-indigo-400" /> Notifications
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map(n => (
              <div key={n.id} className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-[11px] font-medium text-gray-300">
                {n.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed top-18 right-16 w-72 glass-panel border border-white/10 shadow-2xl rounded-2xl p-4.5 z-[100] animate-fade-in space-y-4">
          <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" /> Dashboard Settings
          </h4>
          
          <div className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Refresh Frequency
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 focus:border-indigo-500 rounded-lg py-1.5 px-2 text-xs outline-none text-white transition-all"
              >
                <option value={3000}>3 seconds</option>
                <option value={5000}>5 seconds (Default)</option>
                <option value={10000}>10 seconds</option>
                <option value={30000}>30 seconds</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                Live Data Fetch (Finnhub)
              </span>
              <input
                type="checkbox"
                checked={useRealTimeAPI}
                onChange={(e) => setUseRealTimeAPI(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 cursor-pointer"
              />
            </div>
            <div className="text-[9px] text-gray-500 leading-relaxed bg-black/20 p-2 rounded-lg border border-white/5">
              💡 Turn off "Live Data Fetch" to run locally generated simulation ticks and preserve API quota limit.
            </div>
          </div>
        </div>
      )}

      {/* Profile Drawer */}
      {isProfileOpen && (
        <div className="fixed top-18 right-6 w-56 glass-panel border border-white/10 shadow-2xl rounded-2xl p-4.5 z-[100] animate-fade-in space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-extrabold text-sm">
              JD
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">John Doe</h4>
              <span className="text-[9px] text-gray-400 font-semibold uppercase">Trader Level 1</span>
            </div>
          </div>
          <div className="space-y-1">
            <button className="w-full text-left text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 py-1.5 px-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Account Security
            </button>
            <button className="w-full text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/5 py-1.5 px-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {activeToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-indigo-500/50 text-white rounded-xl shadow-2xl p-4 z-[200] max-w-sm animate-fade-in flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-heading">🔔</span>
            <p className="text-xs font-semibold">{activeToast.message}</p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-xs font-bold text-gray-400 hover:text-white cursor-pointer px-1"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
