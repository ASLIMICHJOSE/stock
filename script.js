// Show login form
function showLogin() {
  document.getElementById("auth-box").innerHTML = `
    <h2>Welcome Back</h2>
    <input type="text" id="loginUser" placeholder="Username" required>
    <input type="password" id="loginPass" placeholder="Password" required>
    <button class="submit-btn" onclick="login()">Login</button>
  `;
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
}

// Show register form
function showRegister() {
  document.getElementById("auth-box").innerHTML = `
    <h2>Create Account</h2>
    <input type="text" id="regUser" placeholder="Username" required>
    <input type="email" id="regEmail" placeholder="Email" required>
    <input type="password" id="regPass" placeholder="Password" required>
    <button class="submit-btn" onclick="register()">Register</button>
  `;
  document.getElementById("registerTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
}

// Register function
function register() {
  const user = document.getElementById("regUser").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPass").value.trim();

  if (user && email && pass) {
    localStorage.setItem("stockpulseUser", JSON.stringify({ user, email, pass }));
    alert("✅ Registration successful! Please login.");
    showLogin();
  } else {
    alert("⚠️ Please fill in all fields.");
  }
}

// Login function
function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const stored = JSON.parse(localStorage.getItem("stockpulseUser"));

  if (stored && stored.user === user && stored.pass === pass) {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("❌ Invalid credentials.");
  }
}

// Logout function (used in dashboard)
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

// Default tab on index.html
if (document.getElementById("auth-box")) {
  showLogin();
}
