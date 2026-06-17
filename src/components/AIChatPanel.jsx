import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, ChevronRight, CornerDownLeft, RefreshCcw } from 'lucide-react';

export default function AIChatPanel({ isOpen, onClose, stocks, updates }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello, I am **Claude**, your real-time AI Market Analyst. I can analyze your portfolio, track market changes, and answer financial questions. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const suggestions = [
    "Analyze Apple's current position",
    "Which stock has the highest growth?",
    "Generate a summary of today's updates",
    "Is it a good time to buy Tesla?",
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Trigger AI typing
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateAIResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  // Helper logic to simulate a highly responsive Claude Analyst
  const generateAIResponse = (query) => {
    const q = query.toLowerCase();

    // Check if query is about a specific stock in active list
    const foundStock = stocks.find(
      (s) => q.includes(s.symbol.toLowerCase()) || q.includes(s.name.toLowerCase())
    );

    if (foundStock) {
      const price = foundStock.price || 0;
      const change = foundStock.price - (foundStock.oldPrice || foundStock.price);
      const isUp = change >= 0;
      const pct = foundStock.oldPrice ? ((change / foundStock.oldPrice) * 100).toFixed(2) : '0.00';

      let advice = "";
      if (pct > 2) {
        advice = `**Recommendation: HOLD/ACCUMULATE.** ${foundStock.name} exhibits positive momentum (+${pct}%). Strong relative volume indicates institutional support.`;
      } else if (pct < -2) {
        advice = `**Recommendation: BUY THE DIP / CAUTIOUS.** ${foundStock.name} has dropped by ${pct}%. While technically oversold, waiting for support level consolidation is advised before entering fresh longs.`;
      } else {
        advice = `**Recommendation: NEUTRAL.** ${foundStock.name} is consolidating within a narrow intraday range. Excellent opportunity to write covered calls or wait for a breakout.`;
      }

      return `### 📊 Deep-Dive: **${foundStock.name} (${foundStock.symbol})**
- **Current Price:** $${price.toFixed(2)}
- **Intraday Change:** ${isUp ? '📈 +' : '📉 '}$${change.toFixed(2)} (${pct}%)
- **Technical Indicator:** RSI currently hovering around 52, indicating stable neutral momentum.

---

${advice}

*Disclaimer: Mock analysis. For educational purposes only.*`;
    }

    if (q.includes('highest') || q.includes('best') || q.includes('top') || q.includes('grow')) {
      // Find highest percentage growth stock
      let best = null;
      let maxPct = -9999;
      stocks.forEach((s) => {
        const change = s.price - (s.oldPrice || s.price);
        const pct = s.oldPrice ? (change / s.oldPrice) * 100 : 0;
        if (pct > maxPct) {
          maxPct = pct;
          best = s;
        }
      });

      if (best && maxPct > 0) {
        return `### 🏆 Top Performer: **${best.name} (${best.symbol})**
Currently leading the board with a gain of **+${maxPct.toFixed(2)}%** (trading at **$${best.price.toFixed(2)}**). 

**Catalyst Analysis:**
1. Robust buying activity at session opening.
2. Short covering rally triggered past key resistance.
3. Sentiment shift across the tech/sector benchmark index.`;
      } else {
        return `Currently, all active assets are consolidating without any major breakouts. Keep an eye on high beta stocks like **TSLA** and **NVDA** for sharp momentum shifts.`;
      }
    }

    if (q.includes('summary') || q.includes('update') || q.includes('today')) {
      if (updates.length === 0) {
        return `### 📰 Market Updates Summary
Currently, no price changes have registered. Once the feeds begin streaming prices, I will compile a live report on intraday breakouts and market shifts.`;
      }
      const lastThree = updates.slice(0, 3).map((up) => `* ${up.text}`).join('\n');
      return `### 📰 Real-Time Activity Briefing
Based on the latest ticker streaming, here is a summary of major events:

${lastThree}

---

**Analyst Sentiment:** The market is demonstrating rapid sector-rotation patterns. High-volatility tickers are experiencing short-duration liquidity sweeps. Maintain strict risk-management parameters.`;
    }

    if (q.includes('buy') || q.includes('sell') || q.includes('trade')) {
      return `### 💸 Trading Strategy & Risk Framework
When planning trades, consider the following checklist:

1. **Market Context:** Trade in alignment with the broader index direction (e.g., SPY, QQQ).
2. **Key Levels:** Identify support and resistance. Do not chase breakouts near extended moving averages.
3. **Risk Management:** Never allocate more than 1-2% of total capital per single trade setup.
4. **Volume Profile:** Look for volume spikes to validate the legitimacy of price movements.

Which specific ticker from your dashboard (e.g., **AAPL**, **TSLA**, **NVDA**) are you analyzing? I can run a custom technical setup for you.`;
    }

    // Default response
    return `I've analyzed your query regarding *"${query}"*. As your virtual Claude analyst, here are my core findings:

1. **Intraday Market Sentiment:** Mildly bullish structure as key large-caps hold support.
2. **Volatile Assets:** The standard deviation across dashboard listings is moderate.
3. **Action Plan:** Focus on high relative volume assets.

Ask me about any active ticker (e.g., **AAPL**, **TSLA**, **GOOGL**) or type **"summary"** for a recap of recent updates!`;
  };

  const renderMarkdown = (text) => {
    // Simple mock markdown parsing
    return text.split('\n').map((line, idx) => {
      let formatted = line;

      // Handle headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="font-heading font-bold text-white text-base mt-3 mb-1.5">{line.replace('### ', '')}</h4>;
      }
      
      // Handle bold
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(formatted)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formatted.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="text-indigo-300 font-semibold">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < formatted.length) {
        parts.push(formatted.substring(lastIndex));
      }

      const finalContent = parts.length > 0 ? parts : formatted;

      // Handle bullets
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-gray-300 my-0.5 text-xs">
            {typeof finalContent === 'string' ? finalContent.substring(2) : finalContent}
          </li>
        );
      }

      // Handle horizontal rule
      if (line === '---') {
        return <hr key={idx} className="border-white/10 my-3" />;
      }

      return <p key={idx} className="text-gray-300 text-xs my-1 leading-relaxed">{finalContent}</p>;
    });
  };

  return (
    <div
      className={`fixed top-[73px] right-0 bottom-0 z-40 w-full md:w-[420px] glass-panel border-l border-white/10 shadow-2xl transition-all duration-300 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 relative">
            <Bot className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950"></span>
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-white flex items-center gap-1.5">
              Claude Analyst
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            </h3>
            <span className="text-[10px] text-gray-400 font-medium">Free Client-Side Intelligence</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md transition-all ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900/80 border border-white/5 text-gray-200 rounded-tl-none'
              }`}
            >
              {msg.sender === 'bot' ? (
                <div className="space-y-1">{renderMarkdown(msg.text)}</div>
              ) : (
                <p className="text-xs">{msg.text}</p>
              )}
              <span className="block text-[9px] text-gray-500 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-900/80 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-400 flex items-center gap-2">
              <RefreshCcw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span className="text-xs">Claude is analyzing market metrics...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="px-5 py-2.5 border-t border-white/5 bg-slate-950/20">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">Suggestions</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="text-[10px] font-semibold bg-white/5 hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/20 text-gray-300 hover:text-indigo-200 rounded-full px-2.5 py-1.5 transition-all text-left cursor-pointer active:scale-95"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-white/10 bg-slate-900/50 flex gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Claude about AAPL, TSLA, top performers..."
          className="flex-1 bg-slate-950/80 border border-white/15 focus:border-indigo-500/80 rounded-xl px-4 py-2.5 text-xs outline-none text-white placeholder-gray-500 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-500 text-black font-bold transition-all shadow-md shadow-indigo-500/10 cursor-pointer flex items-center justify-center active:scale-95"
        >
          <Send className="w-4 h-4 text-black" />
        </button>
      </form>
    </div>
  );
}
