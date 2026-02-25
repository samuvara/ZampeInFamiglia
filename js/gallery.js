// ============================================
// GALLERY SLIDER FUNCTIONALITY
// ============================================
// Questo script gestisce la galleria fotografica interattiva:
// - Carica le foto da images/photo_gallery/gallery.json
// - Implementa uno slider automatico/manuale
// - Fornisce navigazione con frecce e dots
// - Permette di visualizzare foto in lightbox (grande schermo)
// - Conta automaticamente le foto presenti nel JSON (nessun numero fisso)

// ============================================
// VARIABILI GLOBALI
// ============================================

let photos = [];
let currentIndex = 0;
let autoScrollInterval = null;
const AUTO_SCROLL_DURATION = 5000;

// ============================================
// INIZIALIZZAZIONE
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
});

// ============================================
// FUNZIONE: initializeGallery()
// ============================================
// Carica il JSON e poi inizializza tutto lo slider.
// Il JSON si trova in: images/photo_gallery/gallery.json
// Per aggiungere o rimuovere foto basta modificare quel file —
// il contatore, i dots e lo slider si aggiornano automaticamente.

async function initializeGallery() {
    const loaded = await loadPhotosFromJSON();

    if (!loaded || photos.length === 0) {
        showGalleryError();
        return;
    }

    buildSlider();
    createDots();
    setupEventListeners();
    updatePhotoCounter();
    startAutoScroll();
}

// ============================================
// FUNZIONE: loadPhotosFromJSON()
// ============================================
// Legge images/photo_gallery/gallery.json e popola l'array photos.
// Restituisce true se il caricamento è andato a buon fine, false altrimenti.

async function loadPhotosFromJSON() {
    try {
        const response = await fetch('images/photo_gallery/gallery.json');

        if (!response.ok) {
            console.error(`Impossibile caricare gallery.json: HTTP ${response.status}`);
            return false;
        }

        const data = await response.json();

        if (!Array.isArray(data.photos) || data.photos.length === 0) {
            console.warn('gallery.json non contiene foto o ha formato errato.');
            return false;
        }

        // Filtra eventuali voci prive di src
        photos = data.photos.filter(p => p.src && p.src.trim() !== '');
        return true;

    } catch (err) {
        console.error('Errore durante il caricamento di gallery.json:', err);
        return false;
    }
}

// ============================================
// FUNZIONE: buildSlider()
// ============================================
// Crea dinamicamente gli elementi <img> nel track dello slider.
// Il numero di foto dipende esclusivamente da ciò che è presente in gallery.json.

function buildSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    sliderTrack.innerHTML = ''; // Pulisce eventuali contenuti residui

    photos.forEach((photo, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'slider-photo';

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption || `Foto ${index + 1}`;
        img.loading = 'lazy';

        img.addEventListener('click', () => openLightbox(index));

        photoDiv.appendChild(img);
        sliderTrack.appendChild(photoDiv);
    });

    // Aggiorna il totale visibile nel contatore (es. "1 / 13")
    const totalEl = document.getElementById('totalPhotos');
    if (totalEl) totalEl.textContent = photos.length;
}

// ============================================
// FUNZIONE: showGalleryError()
// ============================================
// Mostra un messaggio nell'area dello slider se il JSON non è disponibile.

function showGalleryError() {
    const sliderTrack = document.getElementById('sliderTrack');
    if (sliderTrack) {
        sliderTrack.innerHTML = `
            <div class="slider-photo" style="display:flex;align-items:center;justify-content:center;height:100%;min-height:300px;">
                <p style="color:#888;font-size:1rem;text-align:center;padding:2rem;">
                    📷 Nessuna foto trovata.<br>
                    <small>Controlla che <em>images/photo_gallery/gallery.json</em> esista e sia correttamente compilato.</small>
                </p>
            </div>`;
    }
    const totalEl = document.getElementById('totalPhotos');
    if (totalEl) totalEl.textContent = 0;
}

// ============================================
// FUNZIONE: createDots()
// ============================================
// Crea i puntini indicatori: uno per ogni foto nel JSON.

function createDots() {
    const dotsContainer = document.getElementById('sliderDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    photos.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (index === 0 ? ' active' : '');

        dot.addEventListener('click', () => {
            stopAutoScroll();
            goToPhoto(index);
            startAutoScroll();
        });

        dotsContainer.appendChild(dot);
    });
}

// ============================================
// FUNZIONE: setupEventListeners()
// ============================================

function setupEventListeners() {
    const prevBtn = document.getElementById('sliderPrev');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            previousPhoto();
            startAutoScroll();
        });
    }

    const nextBtn = document.getElementById('sliderNext');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            nextPhoto();
            startAutoScroll();
        });
    }

    const closeLightboxBtn = document.getElementById('lightboxClose');
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        const lb = document.getElementById('photoLightbox');
        if (lb && lb.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
        } else {
            if (e.key === 'ArrowLeft') { stopAutoScroll(); previousPhoto(); startAutoScroll(); }
            else if (e.key === 'ArrowRight') { stopAutoScroll(); nextPhoto(); startAutoScroll(); }
        }
    });
}

// ============================================
// NAVIGAZIONE SLIDER
// ============================================

function goToPhoto(index) {
    if (index < 0 || index >= photos.length) return;
    currentIndex = index;
    const sliderTrack = document.getElementById('sliderTrack');
    if (sliderTrack) sliderTrack.style.transform = `translateX(${-currentIndex * 100}%)`;
    updateDots();
    updatePhotoCounter();
}

function nextPhoto() {
    goToPhoto((currentIndex + 1) % photos.length);
}

function previousPhoto() {
    goToPhoto((currentIndex - 1 + photos.length) % photos.length);
}

function updateDots() {
    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function updatePhotoCounter() {
    const el = document.getElementById('currentPhotoIndex');
    if (el) el.textContent = currentIndex + 1;
}

// ============================================
// AUTO-SCROLL
// ============================================

function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(nextPhoto, AUTO_SCROLL_DURATION);
}

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// ============================================
// LIGHTBOX
// ============================================

function openLightbox(index) {
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = photos[index].src;
    if (lightboxCaption) lightboxCaption.textContent = photos[index].caption || '';

    lightbox.classList.add('active');
    stopAutoScroll();
}

function closeLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) lightbox.classList.remove('active');
    startAutoScroll();
}