// 🔑 Replace with your own Finnhub API key
const API_KEY = "d36mn8hr01qtvbtibm9gd36mn8hr01qtvbtibma0";

let stocks = [
  { symbol: "AAPL", name: "APPLE", price: 0 },
  { symbol: "GOOGL", name: "GOOGLE", price: 0 },
  { symbol: "AMZN", name: "AMAZON", price: 0 },
  { symbol: "MSFT", name: "MICROSOFT", price: 0 },
  { symbol: "TSLA", name: "TESLA", price: 0 },
  { symbol: "NVDA", name: "NVIDIA", price: 0 }
];

const container = document.getElementById('stocksContainer');
const updatesFeed = document.getElementById('updatesList');

// RENDER STOCK CARDS
function renderStocks() {
  container.innerHTML = '';
  stocks.forEach(stock => {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.innerHTML = `
      <div class="stock-name">${stock.name}</div>
      <div class="stock-price" id="price-${stock.symbol}">Loading...</div>
      <div class="stock-change" id="change-${stock.symbol}">--</div>
    `;
    container.appendChild(card);
  });
}

// FETCH PRICE FROM FINNHUB
async function fetchStockPrice(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (data && data.c) {   // `c` = current price
      return parseFloat(data.c);
    }
  } catch (err) {
    console.error("Error fetching price for", symbol, err);
  }
  return null;
}

// UPDATE ALL STOCKS
async function updatePricesReal() {
  for (const stock of stocks) {
    const oldPrice = stock.price;
    const newPrice = await fetchStockPrice(stock.symbol);

    if (newPrice !== null) {
      stock.price = newPrice;

      const priceEl = document.getElementById(`price-${stock.symbol}`);
      const changeEl = document.getElementById(`change-${stock.symbol}`);

      if (priceEl && changeEl) {
        priceEl.innerText = newPrice.toFixed(2);

        const change = oldPrice ? newPrice - oldPrice : 0;
        changeEl.innerText = change.toFixed(2);
        changeEl.className = 'stock-change ' + (change >= 0 ? 'up' : 'down');
      }

      // Add update feed entry
      const div = document.createElement('div');
      div.className = 'update-card ' + (newPrice >= oldPrice ? 'up' : 'down');
      div.innerText = `${stock.name} price ${newPrice >= oldPrice ? 'increased' : 'decreased'} to ${newPrice.toFixed(2)}`;
      updatesFeed.prepend(div);

      if (updatesFeed.childElementCount > 10) {
        updatesFeed.removeChild(updatesFeed.lastChild);
      }
    }
  }
}

// ADD NEW STOCK
function addStock() {
  const name = document.getElementById('newStockName').value.trim();
  const symbol = document.getElementById('newStockSymbol').value.trim().toUpperCase();

  if (!name || !symbol) {
    alert("Please enter valid stock name and symbol!");
    return;
  }
  if (stocks.some(s => s.symbol === symbol)) {
    alert("Stock already exists!");
    return;
  }

  stocks.push({ symbol, name, price: 0 });
  renderStocks();
  updatePricesReal(); // fetch immediately

  document.getElementById('newStockName').value = '';
  document.getElementById('newStockSymbol').value = '';
}

// INITIALIZE
renderStocks();
setInterval(updatePricesReal, 5000); // update every 5 sec
updatePricesReal();


// === ADVANCED MARKET OVERVIEW CHART ===
const chartContainer = document.getElementById('chartContainer');
const chart = LightweightCharts.createChart(chartContainer, {
  layout: {
    background: { color: 'transparent' },
    textColor: '#e0e0e0',
    fontFamily: 'Segoe UI',
  },
  grid: {
    vertLines: { color: 'rgba(255,255,255,0.1)' },
    horzLines: { color: 'rgba(255,255,255,0.1)' },
  },
  crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
  rightPriceScale: {
    borderVisible: false,
  },
  timeScale: {
    borderVisible: false,
  },
  width: chartContainer.clientWidth,
  height: 320,
});

// Assign each stock a series & color
const colors = ['#00ccff', '#00ff99', '#ffcc00', '#ff4d4d', '#9b59b6', '#f39c12'];
const seriesMap = {};
stocks.forEach((stock, i) => {
  seriesMap[stock.symbol] = chart.addLineSeries({
    color: colors[i % colors.length],
    lineWidth: 2,
    title: stock.symbol,
  });
});

// Data storage
const stockData = {};
stocks.forEach(s => (stockData[s.symbol] = []));

function updateMarketChart() {
  const now = Math.floor(Date.now() / 1000);
  stocks.forEach(stock => {
    if (stock.price) {
      stockData[stock.symbol].push({ time: now, value: stock.price });
      seriesMap[stock.symbol].setData(stockData[stock.symbol].slice(-50));
    }
  });
}

const legendEl = document.getElementById('legend');
function updateLegend() {
  legendEl.innerHTML = '';
  stocks.forEach((stock, i) => {
    if (stock.price) {
      const span = document.createElement('span');
      span.innerHTML = `<div class="dot" style="background:${colors[i % colors.length]}"></div> 
        <b>${stock.symbol}</b>: ${stock.price.toFixed(2)}`;
      legendEl.appendChild(span);
    }
  });
}

// Resize dynamically
window.addEventListener('resize', () => {
  chart.applyOptions({ width: chartContainer.clientWidth });
});

// Modal controls
function openAddStockModal() {
  document.getElementById('addStockModal').style.display = 'flex';
}
function closeAddStockModal() {
  document.getElementById('addStockModal').style.display = 'none';
}
// Inject custom styles for the Add Stock button
const addStockBtnStyles = `
  .open-modal-btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    font-size: 1.05rem;
    font-weight: bold;
    background: linear-gradient(135deg, #00ff99, #00ccff);
    color: #000;
    cursor: pointer;
    transition: all 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 6px 18px rgba(0, 255, 200, 0.3);
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
  }
  .open-modal-btn::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(0,255,200,0.25), transparent 70%);
    transform: rotate(25deg);
    transition: opacity 0.4s;
    opacity: 0;
  }
  .open-modal-btn:hover::before {
    opacity: 1;
  }
  .open-modal-btn:hover {
    transform: translateY(-4px) scale(1.04);
    box-shadow: 0 0 25px rgba(0, 255, 200, 0.6), 
                0 0 35px rgba(0, 204, 255, 0.4);
  }
`;

// Append to document
const styleEl = document.createElement("style");
styleEl.innerText = addStockBtnStyles;
document.head.appendChild(styleEl);

// Create notification dropdown
const notifPanel = document.createElement("div");
notifPanel.id = "notifPanel";
notifPanel.innerHTML = `
  <h3>🔔 Notifications</h3>
  <ul>
    <li>No new alerts</li>
  </ul>
`;
notifPanel.style.cssText = `
  position: absolute;
  top: 60px;
  right: 80px;
  background: rgba(25,35,45,0.95);
  color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  display: none;
  width: 220px;
`;

// Add to body
document.body.appendChild(notifPanel);

// Toggle on click
document.querySelector(".icon:nth-child(1)").addEventListener("click", () => {
  notifPanel.style.display = notifPanel.style.display === "block" ? "none" : "block";
});

const settingsPanel = document.createElement("div");
settingsPanel.id = "settingsPanel";
settingsPanel.innerHTML = `
  <h3>⚙️ Settings</h3>
  <label>
    ⏱ Refresh:
    <select id="refreshRate">
      <option value="5000">5 sec</option>
      <option value="10000">10 sec</option>
      <option value="30000">30 sec</option>
    </select>
  </label>
`;
settingsPanel.style.cssText = `
  position: absolute;
  top: 60px;
  right: 40px;
  background: rgba(25,35,45,0.95);
  color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  display: none;
  width: 200px;
`;

document.body.appendChild(settingsPanel);

// Toggle
document.querySelector(".icon:nth-child(2)").addEventListener("click", () => {
  settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
});

// Apply refresh rate
document.getElementById("refreshRate").addEventListener("change", (e) => {
  clearInterval(window.refreshInterval);
  window.refreshInterval = setInterval(updatePricesReal, parseInt(e.target.value));
});

const profilePanel = document.createElement("div");
profilePanel.id = "profilePanel";
profilePanel.innerHTML = `
  <h3>👤 Profile</h3>
  <ul style="list-style:none;padding:0;margin:0;">
    <li><a href="#">My Account</a></li>
    <li><a href="#">Logout</a></li>
  </ul>
`;
profilePanel.style.cssText = `
  position: absolute;
  top: 60px;
  right: 10px;
  background: rgba(25,35,45,0.95);
  color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  display: none;
  width: 180px;
`;

document.body.appendChild(profilePanel);

// Toggle
document.querySelector(".profile").addEventListener("click", () => {
  profilePanel.style.display = profilePanel.style.display === "block" ? "none" : "block";
});
// ========== PANELS ========== //

// Notification Panel
const notifPanel = document.createElement("div");
notifPanel.id = "notifPanel";
notifPanel.innerHTML = `
  <h3>🔔 Notifications</h3>
  <ul style="list-style:none; padding:0; margin:0;">
    <li>No new alerts</li>
  </ul>
`;
notifPanel.style.cssText = `
  position: absolute;
  top: 60px;
  right: 140px;
  background: rgba(25,35,45,0.95);
  color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  display: none;
  width: 220px;
  z-index: 3000;
`;
document.body.appendChild(notifPanel);

// Settings Panel
const settingsPanel = document.createElement("div");
settingsPanel.id = "settingsPanel";
settingsPanel.innerHTML = `
  <h3>⚙️ Settings</h3>
  <label>
    ⏱ Refresh:
    <select id="refreshRate">
      <option value="5000">5 sec</option>
      <option value="10000">10 sec</option>
      <option value="30000">30 sec</option>
    </select>
  </label>
`;
settingsPanel.style.cssText = `
  position: absolute;
  top: 60px;
  right: 90px;
  background: rgba(25,35,45,0.95);
  color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  display: none;
  width: 200px;
  z-index: 3000;
`;
document.body.appendChild(settingsPanel);

// Profile Panel
const profilePanel = document.createElement("div");
profilePanel.id = "profilePanel";
profilePanel.innerHTML = `
  <h3>👤 Profile</h3>
  <ul style="list-style:none;padding:0;margin:0;">
    <li><a href="#">My Account</a></li>
    <li><a href="#">Logout</a></li>
  </ul>
`;
profilePanel.style.cssText = `
  position: absolute;
  top: 60px;
  right: 40px;
  background: rgba(25,35,45,0.95);
  color: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
  display: none;
  width: 180px;
  z-index: 3000;
`;
document.body.appendChild(profilePanel);

// ========== EVENT LISTENERS ========== //
document.querySelector(".header-icons .icon:nth-child(1)")
  .addEventListener("click", () => {
    notifPanel.style.display = notifPanel.style.display === "block" ? "none" : "block";
    settingsPanel.style.display = "none";
    profilePanel.style.display = "none";
  });

document.querySelector(".header-icons .icon:nth-child(2)")
  .addEventListener("click", () => {
    settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
    notifPanel.style.display = "none";
    profilePanel.style.display = "none";
  });

document.querySelector(".header-icons .profile")
  .addEventListener("click", () => {
    profilePanel.style.display = profilePanel.style.display === "block" ? "none" : "block";
    notifPanel.style.display = "none";
    settingsPanel.style.display = "none";
  });
