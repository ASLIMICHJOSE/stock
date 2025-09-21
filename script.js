let stocks = [
  { name: "APPLE", price: 175 },
  { name: "GOOGLE", price: 2800 },
  { name: "AMAZON", price: 3450 },
  { name: "MICROSOFT", price: 300 },
  { name: "TESLA", price: 750 }
];

const container = document.getElementById('stocksContainer');
const updatesFeed = document.getElementById('updatesList');

// Render stock cards
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

// Update prices and show updates
function updatePrices() {
  stocks.forEach(stock => {
    const change = (Math.random() * 10 - 5);
    stock.price += change;

    const priceEl = document.getElementById(`price-${stock.name}`);
    const changeEl = document.getElementById(`change-${stock.name}`);

    priceEl.innerText = stock.price.toFixed(2);
    changeEl.innerText = change.toFixed(2);
    changeEl.className = 'stock-change ' + (change >= 0 ? 'up' : 'down');

    // Add update card
    const div = document.createElement('div');
    div.className = 'update-card ' + (change >=0 ? 'up' : 'down');
    div.innerText = `${stock.name} price ${change >=0 ? 'increased' : 'decreased'} by ${change.toFixed(2)}`;
    updatesFeed.prepend(div);

    // Limit last 10 updates
    if(updatesFeed.childElementCount > 10){
      updatesFeed.removeChild(updatesFeed.lastChild);
    }
  });
}

// Function to add new stock
function addStock() {
  const name = document.getElementById('newStockName').value.trim();
  const price = parseFloat(document.getElementById('newStockPrice').value);

  if(!name || isNaN(price)){
    alert("Please enter valid stock name and price!");
    return;
  }

  // Check for duplicate stock
  if(stocks.some(s => s.name.toUpperCase() === name.toUpperCase())){
    alert("Stock already exists!");
    return;
  }

  stocks.push({ name: name.toUpperCase(), price });
  renderStocks();

  // Clear inputs
  document.getElementById('newStockName').value = '';
  document.getElementById('newStockPrice').value = '';
}

// Initial render
renderStocks();
setInterval(updatePrices, 2000);
