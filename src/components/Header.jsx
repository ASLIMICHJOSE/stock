import { TrendingUp, Search, Bell, Settings, User, MessageSquareCode } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  onToggleChat,
  isChatOpen,
  unreadNotifications,
  setNotificationsOpen,
  setSettingsOpen,
  setProfileOpen,
}) {
  return (
    <header className="glass-panel sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 shadow-lg backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-xl shadow-lg shadow-indigo-500/20">
          <TrendingUp className="w-6 h-6 text-black" />
        </div>
        <span className="font-heading text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">
          StockWatch<span className="text-indigo-400 font-extrabold">PRO</span>
        </span>
      </div>

      <div className="flex-1 max-w-md mx-8 relative group">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
        <input
          type="text"
          placeholder="Search stocks by symbol or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/60 border border-white/10 hover:border-white/20 focus:border-indigo-500/80 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium outline-none text-white transition-all shadow-inner placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Claude AI Assistant Toggle */}
        <button
          onClick={onToggleChat}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 relative group cursor-pointer ${
            isChatOpen
              ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-200 shadow-lg shadow-indigo-500/10'
              : 'bg-slate-900/60 border-white/10 text-gray-300 hover:border-indigo-400/40 hover:text-white'
          }`}
        >
          <MessageSquareCode className={`w-5 h-5 ${isChatOpen ? 'animate-pulse text-indigo-400' : 'text-gray-400 group-hover:text-indigo-400'}`} />
          <span className="text-xs font-semibold font-heading hidden md:inline">AI Analyst</span>
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          )}
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          {/* Notifications */}
          <button
            onClick={() => setNotificationsOpen(prev => !prev)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white leading-none">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(prev => !prev)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile */}
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
