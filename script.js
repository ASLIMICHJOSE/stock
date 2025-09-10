document.getElementById('menu-btn').addEventListener('click', function () {
  this.classList.toggle('active');   // toggles hamburger animation
  document.getElementById('menu').classList.toggle('active'); // toggles menu
});
