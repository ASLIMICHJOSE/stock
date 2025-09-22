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

