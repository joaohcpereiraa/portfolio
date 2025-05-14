function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

const toggle = document.getElementById('dark-mode-toggle');
const body = document.body;

function setDarkMode(enabled) {
  if (enabled) {
    body.classList.add('dark');
    toggle.textContent = '☀️ Modo Claro';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    body.classList.remove('dark');
    toggle.textContent = '🌙 Modo Escuro';
    localStorage.setItem('darkMode', 'disabled');
  }
}

// Inicializa com base na preferência salva
setDarkMode(localStorage.getItem('darkMode') === 'enabled');

// Alterna dark mode ao clicar
toggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark');
  setDarkMode(!isDark);
});
