// !!!!! ALL THE FUNCTIONALITY ARE USED IN THE HOME PAGE AND NOT ANYMORE IN THE GALLERY PAGE !!!!!

// ============================================
// GALLERY SLIDER FUNCTIONALITY
// ============================================
// Questo script gestisce la galleria fotografica interattiva:
// - Carica le foto da una cartella
// - Implementa uno slider automatico/manuale
// - Fornisce navigazione con frecce e dots
// - Permette di visualizzare foto in lightbox (grande schermo)

// ============================================
// VARIABILI GLOBALI
// ============================================

// Carica tutte le foto dalla cartella photo_gallery/
let photos = [];

// Indice della foto attualmente visualizzata nello slider
let currentIndex = 0;

// Intervallo per l'auto-scroll automatico (se abilitato)
let autoScrollInterval = null;

// Durata dell'auto-scroll in millisecondi (5 secondi)
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
// Scopo:
// Inizializza la galleria caricando le foto e impostando gli event listener
function initializeGallery() {
    // Carica le foto da simulazione (vedi funzione loadPhotos())
    loadPhotos();
    
    // Crea i dots indicatori (puntini in basso nello slider)
    createDots();
    
    // Aggiunge event listener ai bottoni di navigazione
    setupEventListeners();
    
    // Aggiorna il contatore foto
    updatePhotoCounter();
    
    // Avvia lo scroll automatico
    startAutoScroll();
}

// ============================================
// FUNZIONE: loadPhotos()
// ============================================
// Scopo:
// Carica tutte le foto dalla cartella ../images/photo_gallery/
// Nota: Poiché non possiamo accedere direttamente al filesystem dal browser,
// usiamo un approccio alternativo che permette all'utente di aggiungere foto
// attraverso una struttura dati o da un server.
// Attualmente, genera una lista di foto di placeholder.

function loadPhotos() {
    const sliderTrack = document.getElementById('sliderTrack');
    
    // In un'applicazione reale, questi dati verrebbero da un server
    // Per ora, gli sviluppatori possono aggiungere le foto manualmente
    // creando elementi img o modificando questa funzione
    
    // Esempio di struttura foto (aggiorna con i tuoi file reali):
    const photoFiles = [
        { src: 'images/photo_gallery/cane1.jpg', caption: 'Foto 1 - Cani felici' },
        { src: 'images/photo_gallery/cane2.jpg', caption: 'Foto 2 - Momento di gioco' },
        { src: 'images/photo_gallery/cane3.jpg', caption: 'Foto 3 - Relax' },
        { src: 'images/photo_gallery/cane4.jpg', caption: 'Foto 4 - Doggo' },
        { src: 'images/photo_gallery/cane5.png', caption: 'Foto 5 - Passeggiata' },
        // Aggiungi le tue foto qui: { src: 'path/to/image.jpg', caption: 'Descrizione' }
    ];
    
    // Popola l'array globale photos
    photos = photoFiles;
    
    // Crea gli elementi img per ogni foto nel slider
    photos.forEach((photo, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'slider-photo';
        
        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.caption;
        img.loading = 'lazy'; // Caricamento pigro per prestazioni
        
        // Click sulla foto apre il lightbox
        img.addEventListener('click', () => openLightbox(index));
        
        photoDiv.appendChild(img);
        sliderTrack.appendChild(photoDiv);
    });
    
    // Aggiorna il totale delle foto nel contatore
    document.getElementById('totalPhotos').textContent = photos.length;
}

// ============================================
// FUNZIONE: createDots()
// ============================================
// Scopo:
// Crea i puntini indicatori (dots) in basso nello slider
// Uno per ogni foto, cliccabili per saltare a quella foto

function createDots() {
    const dotsContainer = document.getElementById('sliderDots');
    
    // Per ogni foto, crea un dot
    photos.forEach((photo, index) => {
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        
        // Il primo dot è attivo di default
        if (index === 0) {
            dot.classList.add('active');
        }
        
        // Click sul dot sposta lo slider a quella foto
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
// Scopo:
// Aggiunge event listener ai bottoni di navigazione e al lightbox

function setupEventListeners() {
    // Bottone "Foto Precedente"
    const prevBtn = document.getElementById('sliderPrev');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoScroll();
            previousPhoto();
            startAutoScroll();
        });
    }
    
    // Bottone "Foto Successiva"
    const nextBtn = document.getElementById('sliderNext');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoScroll();
            nextPhoto();
            startAutoScroll();
        });
    }
    
    // Bottone Chiudi nel lightbox
    const closeLightboxBtn = document.getElementById('lightboxClose');
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }
    
    // Click fuori dall'immagine nel lightbox per chiuderlo
    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Navigazione con tastiera
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('photoLightbox');
        
        if (lightbox.classList.contains('active')) {
            // Se il lightbox è aperto
            if (e.key === 'Escape') {
                closeLightbox();
            }
        } else {
            // Se il lightbox è chiuso
            if (e.key === 'ArrowLeft') {
                stopAutoScroll();
                previousPhoto();
                startAutoScroll();
            } else if (e.key === 'ArrowRight') {
                stopAutoScroll();
                nextPhoto();
                startAutoScroll();
            }
        }
    });
}

// ============================================
// FUNZIONE: goToPhoto(index)
// ============================================
// Scopo:
// Sposta lo slider alla foto specificata dall'indice
// Parametri:
// - index (number): indice della foto da visualizzare (0-based)

function goToPhoto(index) {
    // Assicura che l'indice sia valido (fra 0 e numero di foto - 1)
    if (index < 0 || index >= photos.length) {
        return;
    }
    
    currentIndex = index;
    
    // Calcola quanto scorrere il track (-100% per ogni foto)
    const offset = -currentIndex * 100;
    
    // Applica la trasformazione al track
    const sliderTrack = document.getElementById('sliderTrack');
    sliderTrack.style.transform = `translateX(${offset}%)`;
    
    // Aggiorna i dots per evidenziare quello attivo
    updateDots();
    
    // Aggiorna il contatore
    updatePhotoCounter();
}

// ============================================
// FUNZIONE: nextPhoto()
// ============================================
// Scopo:
// Sposta lo slider alla foto successiva
// Se è l'ultima foto, torna alla prima (loop)

function nextPhoto() {
    let nextIndex = currentIndex + 1;
    
    // Se siamo all'ultima foto, torna alla prima
    if (nextIndex >= photos.length) {
        nextIndex = 0;
    }
    
    goToPhoto(nextIndex);
}

// ============================================
// FUNZIONE: previousPhoto()
// ============================================
// Scopo:
// Sposta lo slider alla foto precedente
// Se è la prima foto, va all'ultima (loop)

function previousPhoto() {
    let prevIndex = currentIndex - 1;
    
    // Se siamo alla prima foto, vai all'ultima
    if (prevIndex < 0) {
        prevIndex = photos.length - 1;
    }
    
    goToPhoto(prevIndex);
}

// ============================================
// FUNZIONE: updateDots()
// ============================================
// Scopo:
// Aggiorna lo stato attivo dei dots
// Rimuove 'active' da tutti e lo aggiunge a quello corrente

function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ============================================
// FUNZIONE: updatePhotoCounter()
// ============================================
// Scopo:
// Aggiorna il testo del contatore foto ("1 / 5" ad esempio)

function updatePhotoCounter() {
    document.getElementById('currentPhotoIndex').textContent = currentIndex + 1;
}

// ============================================
// FUNZIONE: startAutoScroll()
// ============================================
// Scopo:
// Avvia lo scorrimento automatico dello slider
// Ogni 5 secondi passa alla foto successiva

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        nextPhoto();
    }, AUTO_SCROLL_DURATION);
}

// ============================================
// FUNZIONE: stopAutoScroll()
// ============================================
// Scopo:
// Ferma lo scorrimento automatico
// Utile quando l'utente interagisce manualmente con lo slider

function stopAutoScroll() {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }
}

// ============================================
// FUNZIONE: openLightbox(index)
// ============================================
// Scopo:
// Apre il lightbox mostrando la foto ingrandita
// Parametri:
// - index (number): indice della foto da mostrare

function openLightbox(index) {
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    // Imposta l'immagine e la didascalia
    lightboxImage.src = photos[index].src;
    lightboxCaption.textContent = photos[index].caption;
    
    // Mostra il lightbox
    lightbox.classList.add('active');
    
    // Ferma l'auto-scroll mentre il lightbox è aperto
    stopAutoScroll();
}

// ============================================
// FUNZIONE: closeLightbox()
// ============================================
// Scopo:
// Chiude il lightbox e ricomincia l'auto-scroll

function closeLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    lightbox.classList.remove('active');
    
    // Ricomincia l'auto-scroll
    startAutoScroll();
}
