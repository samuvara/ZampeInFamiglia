// ============================================
// PALETTE, TEMA E MENU - SCRIPT DI INTERFACCIA
// ============================================
// Questo file gestisce le piccole funzionalità di UI:
// - Selezione della palette di colori (modalità visuale)
// - Attivazione/disattivazione del tema chiaro/scuro
// - Notifiche visive temporanee
// - Controllo del comportamento del menu hamburger
// I commenti seguono la logica passo-passo per facilitarne la manutenzione.

// ----------------------------
// Funzione: changePalette(palette)
// Descrizione:
// Cambia la "palette" (set di variabili CSS) dell'intera pagina.
// - Imposta l'attributo `data-palette` sull'elemento `:root` (document.documentElement)
// - Salva la scelta in `localStorage` per persistenza fra le visite
// - Aggiorna l'aspetto del pulsante attivo nella UI
// - Mostra una notifica di feedback all'utente
// Parametri:
// - palette (string): la chiave della palette desiderata (es. 'human', 'dog')
function changePalette(palette) {
    // Applica la palette come attributo del documento; il CSS usa questo attributo
    document.documentElement.setAttribute('data-palette', palette);

    // Salva la scelta in localStorage per ricordarla alle visite successive
    // Nota: localStorage salva solo stringhe
    localStorage.setItem('preferred-palette', palette);
    
    // Aggiorna lo stato visuale dei pulsanti nella palette-switcher
    updateActiveButton(palette);
    
    // Mostra un piccolo messaggio che conferma il cambio di palette
    showNotification(`Modalità ${getPaletteName(palette)} attivata! 🎨`);
}

function toggleThemeSwitcher() {
    const column = document.getElementById('theme-column');
    const mainToggle = document.getElementById('main-theme-toggle');
    column.classList.toggle('active');
    mainToggle.classList.toggle('active');
}

// ----------------------------
// Funzione: toggleTheme()
// Descrizione:
// Alterna tra tema 'light' e 'dark'.
// - Legge l'attributo corrente `data-theme` su <html>
// - Imposta l'attributo al valore opposto
// - Salva la preferenza in localStorage
// - Aggiorna l'icona del pulsante che attiva il tema
function toggleTheme() {
    const html = document.documentElement;

    // Se non è impostato, assume 'light' come default
    const currentTheme = html.getAttribute('data-theme') || 'light';

    // Calcola il nuovo tema: se era 'light' diventa 'dark', altrimenti 'light'
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Applica il nuovo tema e salva la preferenza
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('preferred-theme', newTheme);

    // Aggiorna l'icona del bottone (se esiste) per dare feedback immediato
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        // Icona sole per tema scuro (così l'utente può tornare al chiaro), luna per tema chiaro
        btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    // Notifica breve per confermare l'azione
    showNotification(`Modalità ${newTheme === 'dark' ? 'scura' : 'chiara'} attivata!`);
}


function changePalette(palette) {
    document.documentElement.setAttribute('data-palette', palette);
    localStorage.setItem('preferred-palette', palette);

    /* Evidenzia il bottone palette attivo */
    document.querySelectorAll('[data-palette]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-palette') === palette);
    });

    showNotification(`Modalità ${getPaletteName(palette)} attivata! 🎨`);

    /* Chiude il pannello dopo la selezione, come il lang switcher */
    setTimeout(() => {
        document.getElementById('theme-column').classList.remove('active');
        document.getElementById('main-theme-toggle').classList.remove('active');
    }, 250);
}

// ----------------------------
// Funzione: updateActiveButton(palette)
// Descrizione:
// Aggiorna la classe CSS 'active' sui bottoni della palette-switcher.
// - Rimuove 'active' da tutti i bottoni
// - Aggiunge 'active' al bottone corrispondente alla palette selezionata
// Dettagli implementativi:
// - Usa selettori semplici basati su attributi onclick presenti nell'HTML
function updateActiveButton(palette) {
    // Rimuove lo stato 'active' da ogni pulsante dentro .palette-switcher
    document.querySelectorAll('.palette-switcher button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Cerca il pulsante che invoca changePalette con il valore corrispondente
    // NB: questa tecnica funziona con l'HTML attuale dove i button usano inline onclick
    const activeBtn = document.querySelector(`[onclick="changePalette('${palette}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// ----------------------------
// Inizializzazione all'avvio della pagina
// - Carica le preferenze salvate in localStorage e le applica
// - Aggiorna icone e bottoni per rispecchiare le preferenze
window.addEventListener('DOMContentLoaded', () => {
    // Recupera la palette e il tema salvati; se mancanti usa valori di default
    const savedPalette = localStorage.getItem('preferred-palette') || 'human';
    const savedTheme = localStorage.getItem('preferred-theme') || 'light';
    
    // Applica gli attributi al documento in modo che il CSS li legga subito
    document.documentElement.setAttribute('data-palette', savedPalette);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Aggiorna l'icona del toggle del tema (coerente con lo stato attuale)
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
    
    // Aggiorna lo stato dei pulsanti delle palette
    updateActiveButton(savedPalette);
});

// ----------------------------
// Funzione: getPaletteName(palette)
// Descrizione:
// Ritorna un'etichetta umana per una palette interna
// - Utile per messaggi all'utente (showNotification)
function getPaletteName(palette) {
    const names = {
        'human': 'Umano Friendly',
        'dog': 'Visione Cane',
        'cat': 'Visione Gatto',
        'pet': 'Pet Friendly'
    };
    return names[palette] || palette;
}

/* Chiudi cliccando fuori dal theme switcher */
window.addEventListener('click', function (e) {
    const themeSwitcher = document.querySelector('.theme-switcher-compact');
    if (themeSwitcher && !themeSwitcher.contains(e.target)) {
        document.getElementById('theme-column')?.classList.remove('active');
        document.getElementById('main-theme-toggle')?.classList.remove('active');
    }
});


// ----------------------------
// Funzione: showNotification(message)
// Descrizione:
// Mostra una notifica temporanea in basso allo schermo.
// Comportamento:
// 1) Rimuove eventuali notifiche già presenti per evitare sovrapposizioni
// 2) Crea un div con classe 'notification' e lo inserisce nel DOM
// 3) Attiva la transizione che lo fa comparire
// 4) Dopo un periodo rimuove la classe e poi l'elemento dal DOM
// Note:
// - La durata e le classi CSS sono gestite dal file CSS
function showNotification(message) {
    // Se esiste già una notifica la rimuoviamo immediatamente
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Creazione dell'elemento di notifica
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Piccolo delay per permettere al browser di applicare le transizioni
    setTimeout(() => notification.classList.add('show'), 10);

    // Dopo 2.5s nascondiamo la notifica e poi la rimuoviamo dal DOM
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 400); // lascia il tempo alla transizione di chiusura
    }, 2500);
}

// ============================================
// MENU HAMBURGER
// ============================================
// Questo blocco gestisce l'apertura/chiusura della navigazione laterale
// tramite il pulsante hamburger e chiude il menu quando l'utente clicca su un link.

// Selezione degli elementi interessati nel DOM
const menuToggle = document.querySelector('.menu-toggle');
const sideNav = document.querySelector('.side-nav');

// Verifica che gli elementi esistano prima di aggiungere gli event listener
if (menuToggle && sideNav) {
    // Click sul pulsante hamburger: toggla classi 'active'
    // - Sul pulsante per la trasformazione grafica
    // - Sulla side-nav per farla entrare/uscire
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        sideNav.classList.toggle('active');
    });

    // Chiudi il menu quando si clicca su uno dei link interni
    // Questo migliora l'usabilità su dispositivi mobili
    const navLinks = sideNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sideNav.classList.remove('active');
        });
    });
}

// ======================================================================================================
//  LANGUAGE SWITCHER
// ======================================================================================================

/**
 * Apre/chiude il pannello di selezione lingua
 */
function toggleLangSwitcher() {
  const column = document.getElementById('lang-column');
  const mainBtn = document.getElementById('lang-main-toggle');
  column.classList.toggle('active');
  mainBtn.classList.toggle('active');
}

/**
 * Cambia lingua con un solo tap:
 * 1. Carica il JSON
 * 2. Applica le traduzioni
 * 3. Aggiorna UI (flag attivo, bottone principale)
 * 4. Salva preferenza
 * 5. Chiude il pannello
 */
function switchLanguage(lang, flag) {
  loadLanguageFile(lang);
  localStorage.setItem('selectedLanguage', lang);

  /* Aggiorna il flag sul bottone principale */
  const mainBtn = document.getElementById('lang-main-toggle');
  if (mainBtn) mainBtn.textContent = flag;

  /* Evidenzia il bottone della lingua selezionata */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-code') === lang);
  });

  /* Chiude il pannello dopo la selezione */
  setTimeout(() => {
    document.getElementById('lang-column').classList.remove('active');
    mainBtn.classList.remove('active');
  }, 250);
}

/**
 * Carica il file JSON della lingua e applica le traduzioni
 */
function loadLanguageFile(lang) {
  const filePath = `/languages/${lang}.json`;
  fetch(filePath)
    .then(response => {
      if (!response.ok) throw new Error(`File non trovato: ${filePath}`);
      return response.json();
    })
    .then(data => applyTranslations(data))
    .catch(error => console.error('Errore caricamento lingua:', error));
}

/**
 * Applica le traduzioni a tutti gli elementi con data-lang
 */
function applyTranslations(translations) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (translations[key]) {
      el.textContent = translations[key];
    } else {
      console.warn(`Chiave non trovata: ${key}`);
    }
  });
}

/**
 * Inizializzazione: ripristina la lingua salvata
 */
function initializeLanguage() {
  const saved = localStorage.getItem('selectedLanguage') || 'it';
  const flags = { it: '🇮🇹', en: '🇬🇧', es: '🇪🇸' };

  /* Aggiorna il flag del bottone principale senza riaprire il pannello */
  const mainBtn = document.getElementById('lang-main-toggle');
  if (mainBtn && flags[saved]) mainBtn.textContent = flags[saved];

  /* Evidenzia il bottone corretto */
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-code') === saved);
  });

  /* Carica le traduzioni */
  loadLanguageFile(saved);
}

/* Chiudi cliccando fuori dal pannello */
window.addEventListener('click', function (e) {
  const switcher = document.querySelector('.lang-switcher');
  if (switcher && !switcher.contains(e.target)) {
    document.getElementById('lang-column').classList.remove('active');
    document.getElementById('lang-main-toggle').classList.remove('active');
  }
});

/* Avvio */
document.addEventListener('DOMContentLoaded', initializeLanguage);