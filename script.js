// Sample stock data
let stocks = [
  { name: "AAPL", price: 175 },
  { name: "GOOGL", price: 2800 },
  { name: "AMZN", price: 3450 },
  { name: "MSFT", price: 300 },
  { name: "TSLA", price: 750 }
];

const container = document.getElementById('stocksContainer');

// Function to create stock cards
function renderStocks() {
  container.innerHTML = '';
  stocks.forEach(stock => {
    const card = document.createElement('div');
    card.className = 'stock-card';
    card.innerHTML = `
      <div class="stock-name">${stock.name}</div>
      <div class="stock-price" id="price-${stock.name}">${stock.price.toFixed(2)}</div>
      <div class="stock-change" id="change-${stock.name}">0.00</div>
    `;
    container.appendChild(card);
  });
}

// Function to update prices
function updatePrices() {
  stocks.forEach(stock => {
    const change = (Math.random() * 10 - 5); // -5 to +5
    stock.price += change;

    const priceEl = document.getElementById(`price-${stock.name}`);
    const changeEl = document.getElementById(`change-${stock.name}`);

    priceEl.innerText = stock.price.toFixed(2);
    changeEl.innerText = change.toFixed(2);
    changeEl.className = 'stock-change ' + (change >= 0 ? 'up' : 'down');
  });
}

// Initial render
renderStocks();

// Update prices every 2 seconds
setInterval(updatePrices, 2000);
