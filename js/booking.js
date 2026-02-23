// ============================================
// TEMA E PALETTE
// ============================================

function toggleThemeSwitcher() {
    const column = document.getElementById('theme-column');
    const mainToggle = document.getElementById('main-theme-toggle');
    column.classList.toggle('active');
    mainToggle.classList.toggle('active');
}

function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = html.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'light');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

function changePalette(paletteName) {
    const html = document.documentElement;
    const paletteButtons = document.querySelectorAll('[data-palette]');

    html.setAttribute('data-palette', paletteName);

    paletteButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-palette') === paletteName);
    });

    localStorage.setItem('palette', paletteName);
}

// ============================================
// CALENDARIO
// ============================================

function initializeCalendar() {
    const calendarIframe = document.getElementById('google-calendar');
    const loadingCalendar = document.getElementById('loading-calendar');

    // Mostra il calendario dopo un breve ritardo per dare tempo all'iframe di caricarsi
    setTimeout(() => {
        loadingCalendar.style.display = 'none';
        calendarIframe.style.display = 'block';
        calendarIframe.classList.add('loaded');
    }, 1500);
}

// ============================================
// NOTIFICHE
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// INIT
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    // Tema e palette
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedPalette = localStorage.getItem('palette') || 'human';

    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    changePalette(savedPalette);

    // Calendario visibile subito, senza login
    initializeCalendar();
});