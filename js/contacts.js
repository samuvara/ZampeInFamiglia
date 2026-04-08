/**
 * contacts.js  —  Pagina Contatti
 * =====================================
 * Configurazione centralizzata e logica
 * per le card contatti e i social embed.
 * =====================================
 *
 * CONFIGURAZIONE
 */

const CONTACTS_CONFIG = {

    /* ─── TELEFONO ──────────────────────────────────────
       Inserisci il numero nel formato internazionale.
       Esempio: '+39 055 1234567'
       ─────────────────────────────────────────────────── */
    phone: {
        display: '+39 331 407 0796',
        href: '+393314070796',
    },

    /* ─── WHATSAPP ───────────────────────────────────────
       Come ottenere il link WhatsApp Business:
       1. Vai su https://wa.me/   e aggiungi il tuo numero
          nel formato internazionale SENZA spazi o +
          Es: numero italiano 055 123456  →  3914123456  (39 = prefisso IT, poi il numero)
       2. Il link diventa: https://wa.me/39TUONUMERO
       Testo del messaggio preimpostato: modificalo in `message`
       ─────────────────────────────────────────────────── */
    whatsapp: {
        number: '393314070796',
        message: 'Ciao! Vorrei avere informazioni sui vostri servizi 🐾',
    },

    /* ─── INSTAGRAM ──────────────────────────────────────
       Sostituisci 'zampeinfamiglia' con il tuo @username
       ─────────────────────────────────────────────────── */
    instagram: {
        username: 'zampeinfamiglia_firenze',
        url: 'https://www.instagram.com/zampeinfamiglia_firenze?igsh=bno2OWNqN2w1aWUz',
    },

    /* ─── FACEBOOK ─────────────────────────────────────────
       Sostituisci 'zampeinfamiglia' con il tuo @username
       ─────────────────────────────────────────────────── */
    facebook: {
        username: 'zampeinfamiglia_firenze',
        url: 'https://www.facebook.com/profile.php?id=61574328130205',
    },
};


/* ======================================================
   INIZIALIZZAZIONE — NON MODIFICARE SOTTO QUESTA RIGA
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
    _applyPhoneConfig();
    _applyWhatsAppConfig();
    _applyInstagramConfig();
    _applyFacebookConfig();
    _initHoverRipple();
});


/* ── Telefono ── */
function _applyPhoneConfig() {
    const card       = document.getElementById('phoneCard');
    const numberSpan = document.getElementById('phoneNumber');
    if (!card || !numberSpan) return;

    const { display, href } = CONTACTS_CONFIG.phone;
    numberSpan.textContent = display;
    card.href = `tel:${href}`;
}


/* ── WhatsApp ── */
function _applyWhatsAppConfig() {
    const card = document.getElementById('whatsappCard');
    if (!card) return;

    const { number, message } = CONTACTS_CONFIG.whatsapp;
    const encodedMsg = encodeURIComponent(message);
    card.href = `https://wa.me/${number}?text=${encodedMsg}`;
}


/* ── Instagram ── */
function _applyInstagramConfig() {
    const { username, url } = CONTACTS_CONFIG.instagram;
    // Aggiorna tutti gli elementi Instagram
    document.querySelectorAll('[data-ig-username]').forEach(el => {
        el.textContent = '@' + username;
    });
    document.querySelectorAll('[data-ig-url]').forEach(el => {
        el.href = url;
    });
    // Fallback: aggiorna il link direttamente nel frame
    const igLink = document.querySelector('.social-frame--instagram .social-frame__link');
    if (igLink) igLink.href = url;
    document.querySelectorAll('.social-frame--instagram .social-frame__username').forEach(el => {
        el.textContent = '@' + username;
    });
}


/* ── Facebook ── */
function _applyFacebookConfig() {
    const { username, url } = CONTACTS_CONFIG.facebook;
    const ttLink = document.querySelector('.social-frame--facebook .social-frame__link');
    if (ttLink) ttLink.href = url;
    document.querySelectorAll('.social-frame--facebook .social-frame__username').forEach(el => {
        el.textContent = '@' + username;
    });
}


/* ── Micro-interazione: ripple sulle card ── */
function _initHoverRipple() {
    document.querySelectorAll('.contact-card').forEach(card => {
        card.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'ct-ripple';
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.5;
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,.35);
                width: ${size}px;
                height: ${size}px;
                top: ${e.clientY - rect.top - size/2}px;
                left: ${e.clientX - rect.left - size/2}px;
                pointer-events: none;
                animation: ct-ripple-anim .5s ease-out forwards;
            `;
            card.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Aggiungi keyframe ripple dinamicamente
    if (!document.getElementById('ct-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ct-ripple-style';
        style.textContent = `
            @keyframes ct-ripple-anim {
                from { transform: scale(0); opacity: 1; }
                to   { transform: scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}