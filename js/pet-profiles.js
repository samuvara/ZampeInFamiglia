/**
 * pet-profiles.js  —  Zampe da Ricordare
 * ========================================
 * Classe PetProfiles che gestisce:
 *  - Dati dei pet (array di oggetti)
 *  - Rendering delle card
 *  - Filtro per tipo animale
 *  - Modal di dettaglio
 *
 * Inserire DOPO script.js e booking.js.
 * ========================================
 */

class PetProfiles {

    /**
     * @param {string} gridSelector    - Selettore del contenitore delle card
     * @param {string} filterSelector  - Selettore della barra filtri
     * @param {string} modalSelector   - Selettore dell'overlay modal
     */
    constructor(gridSelector = '#profilesGrid',
                filterSelector = '#profilesFilter',
                modalSelector = '#petModal') {

        this.grid   = document.querySelector(gridSelector);
        this.filter = document.querySelector(filterSelector);
        this.modal  = document.querySelector(modalSelector);
        this.modalContent = document.querySelector('#modalContent');
        this.modalClose   = document.querySelector('#modalClose');

        this.currentFilter = 'all';
        this.pets = [];
        this._idCounter = 1;
        this._historyPushed = false;

        // Touch/swipe state
        this._touchStartY = 0;
        this._touchCurrentY = 0;
        this._isDragging = false;

        this._bindFilterButtons();
        this._bindModal();
        this._bindBackButton();
    }

    /* ─────────────────────────────────────────
       DATI
       ───────────────────────────────────────── */

    setPets(petsArray) {
        this.pets = petsArray.map((p, i) => ({ _id: i + 1, ...p }));
        this._idCounter = this.pets.length + 1;
        this.render();
    }

    addPet(petData) {
        this.pets.push({ _id: this._idCounter++, ...petData });
        this.render();
    }

    /* ─────────────────────────────────────────
       RENDER
       ───────────────────────────────────────── */

    render() {
        if (!this.grid) return;
        this.grid.innerHTML = '';

        const filtered = this.currentFilter === 'all'
            ? this.pets
            : this.pets.filter(p => p.tipo === this.currentFilter);

        if (filtered.length === 0) {
            this.grid.innerHTML = `<div class="profiles-empty">Nessun amico peloso trovato 🐾</div>`;
            return;
        }

        filtered.forEach((pet, idx) => {
            const card = this._buildCard(pet);
            card.style.animationDelay = `${idx * 0.08}s`;
            this.grid.appendChild(card);
        });
    }

    /* ─────────────────────────────────────────
       BUILD CARD
       ───────────────────────────────────────── */

    _buildCard(pet) {
        const card = document.createElement('article');
        card.className = 'pet-card';
        card.dataset.tipo = pet.tipo || 'altro';
        card.dataset.petId = pet._id;

        const photoHTML = pet.foto
            ? `<img src="${pet.foto}" alt="Foto di ${pet.nome}" loading="lazy">`
            : `<span>${pet.emoji || this._defaultEmoji(pet.tipo)}</span>`;

        const badgesHTML = (pet.badges || [])
            .map(b => `<span class="badge badge--${b.tipo || 'special'}">${b.etichetta}</span>`)
            .join('');

        const infoItems = [
            { label: '🐾 Specie',   value: this._capitalize(pet.tipo)   },
            { label: '🧬 Razza',    value: pet.razza  || '—'            },
            { label: '🎂 Età',      value: pet.eta    || '—'            },
            { label: '⚤ Sesso',     value: pet.sesso  || '—'            },
        ];

        const infoHTML = infoItems.map(i => `
            <div class="card-info-item">
                <div class="card-info-label">${i.label}</div>
                <div class="card-info-value">${i.value}</div>
            </div>`).join('');

        const tagsHTML = (pet.caratteristiche || [])
            .map(t => `<span class="card-tag">${t}</span>`)
            .join('');

        card.innerHTML = `
            <div class="card-stripe"></div>
            <div class="card-photo-wrap">
                <div class="card-photo">${photoHTML}</div>
                <div class="card-badge">${badgesHTML}</div>
            </div>
            <div class="card-body">
                <div class="card-id">N° ${String(pet._id).padStart(3,'0')}</div>
                <h2 class="card-name">${pet.nome}</h2>
                <div class="card-razza">${pet.razza || ''}</div>
                <div class="card-info-grid">${infoHTML}</div>
                <div class="card-tags">${tagsHTML}</div>
                ${pet.bio ? `<p class="card-bio">"${pet.bio}"</p>` : ''}
                <div class="card-cta">Scopri di più →</div>
            </div>`;

        card.addEventListener('click', () => this._openModal(pet));
        return card;
    }

    /* ─────────────────────────────────────────
       MODAL
       ───────────────────────────────────────── */

    _openModal(pet) {
        if (!this.modal || !this.modalContent) return;

        // Push uno stato nella history per intercettare il tasto Back del browser
        history.pushState({ petModal: true }, '', '#pet-' + (pet.nome || '').toLowerCase().replace(/\s+/g, '-'));
        this._historyPushed = true;

        const photoHTML = pet.foto
            ? `<img src="${pet.foto}" alt="Foto di ${pet.nome}">`
            : `<span>${pet.emoji || this._defaultEmoji(pet.tipo)}</span>`;

        const badgesHTML = (pet.badges || [])
            .map(b => `<span class="badge badge--${b.tipo || 'special'}">${b.etichetta}</span>`)
            .join('');

        const allInfo = [
            { label: '🐾 Specie',   value: this._capitalize(pet.tipo)       },
            { label: '🧬 Razza',    value: pet.razza    || '—'              },
            { label: '🎂 Età',      value: pet.eta      || '—'              },
            { label: '⚤ Sesso',     value: pet.sesso    || '—'              },
            { label: '🩺 Salute',   value: pet.salute   || '—'              },
            { label: '🍗 Dieta',    value: pet.dieta    || '—'              },
        ].filter(i => i.value !== '—');

        const infoHTML = allInfo.map(i => `
            <div class="modal-info-item">
                <div class="card-info-label">${i.label}</div>
                <div class="card-info-value">${i.value}</div>
            </div>`).join('');

        const tagsHTML = (pet.caratteristiche || [])
            .map(t => `<span class="card-tag">${t}</span>`)
            .join('');

        this.modalContent.innerHTML = `
            <div class="modal-header">
                <div class="modal-photo">${photoHTML}</div>
                <div>
                    <h2 class="modal-name" id="modalPetName">${pet.nome}</h2>
                    <div class="modal-razza">${pet.razza || ''}</div>
                    <div class="modal-badges">${badgesHTML}</div>
                </div>
            </div>

            <div class="modal-section-title">📋 Carta d'Identità</div>
            <div class="modal-info-grid">${infoHTML}</div>

            ${tagsHTML ? `<div class="modal-section-title">✨ Caratteristiche</div>
            <div class="modal-tags">${tagsHTML}</div>` : ''}

            ${pet.bio ? `<div class="modal-section-title">💬 La sua storia</div>
            <p class="modal-bio">"${pet.bio}"</p>` : ''}

            <div class="modal-keyboard-hint">
                <kbd>Esc</kbd> per chiudere &nbsp;·&nbsp; o clicca fuori
            </div>
        `;

        this.modal.classList.add('open');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Attiva gesture swipe-to-close su mobile
        this._bindSwipeToClose();
    }

    _closeModal() {
        if (!this.modal) return;

        // Se abbiamo pushato uno stato, torna indietro nella history
        // senza triggerare di nuovo il popstate
        if (this._historyPushed) {
            this._historyPushed = false;
            history.back();
            // Il popstate si occuperà di chiamare _doCloseModal()
            return;
        }

        this._doCloseModal();
    }

    _doCloseModal() {
        if (!this.modal) return;
        const petModal = document.querySelector('.pet-modal');

        // Animazione di uscita
        petModal.classList.add('closing');

        setTimeout(() => {
            this.modal.classList.remove('open');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            petModal.classList.remove('closing');
            petModal.style.transform = '';
        }, 280);

        this._unbindSwipeToClose();
    }

    _bindModal() {
        if (!this.modal) return;

        // Pulsante X
        this.modalClose?.addEventListener('click', () => this._closeModal());

        // Click sull'overlay esterno
        this.modal.addEventListener('click', e => {
            if (e.target === this.modal) this._closeModal();
        });

        // Tasto Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.modal.classList.contains('open')) {
                this._closeModal();
            }
        });
    }

    /* ─────────────────────────────────────────
       TASTO BACK DEL BROWSER
       ───────────────────────────────────────── */

    _bindBackButton() {
        window.addEventListener('popstate', (e) => {
            // Se il modal è aperto e si preme Back, chiudiamo il modal
            if (this.modal && this.modal.classList.contains('open')) {
                this._historyPushed = false; // evita loop
                this._doCloseModal();
            }
        });
    }

    /* ─────────────────────────────────────────
       SWIPE TO CLOSE (mobile)
       ───────────────────────────────────────── */

    _bindSwipeToClose() {
        const petModal = document.querySelector('.pet-modal');
        if (!petModal) return;

        this._onTouchStart = (e) => {
            // Solo se siamo in cima al modal (scroll = 0)
            if (petModal.scrollTop > 10) return;
            this._touchStartY = e.touches[0].clientY;
            this._isDragging = true;
            petModal.style.transition = 'none';
        };

        this._onTouchMove = (e) => {
            if (!this._isDragging) return;
            if (petModal.scrollTop > 10) {
                this._isDragging = false;
                petModal.style.transition = '';
                petModal.style.transform = '';
                return;
            }
            const delta = e.touches[0].clientY - this._touchStartY;
            if (delta < 0) return; // non permettere swipe verso l'alto
            this._touchCurrentY = delta;

            // Resistenza visiva: rallenta la trascinata
            const resistance = delta / (delta + 120);
            const translateY = delta * resistance * 1.8;
            const opacity = Math.max(0.3, 1 - delta / 400);
            petModal.style.transform = `translateY(${translateY}px) scale(${1 - delta * 0.0003})`;
            document.querySelector('.pet-modal-overlay').style.background = `rgba(0,0,0,${opacity * 0.52})`;
        };

        this._onTouchEnd = (e) => {
            if (!this._isDragging) return;
            this._isDragging = false;
            petModal.style.transition = '';

            const delta = this._touchCurrentY;

            if (delta > 100) {
                // Swipe sufficiente → chiudi
                petModal.style.transform = `translateY(110%)`;
                document.querySelector('.pet-modal-overlay').style.background = 'rgba(0,0,0,0)';
                setTimeout(() => {
                    petModal.style.transform = '';
                    document.querySelector('.pet-modal-overlay').style.background = '';
                    this._closeModal();
                }, 280);
            } else {
                // Rimbalzo indietro
                petModal.style.transform = 'translateY(0) scale(1)';
                document.querySelector('.pet-modal-overlay').style.background = '';
            }

            this._touchCurrentY = 0;
        };

        petModal.addEventListener('touchstart', this._onTouchStart, { passive: true });
        petModal.addEventListener('touchmove',  this._onTouchMove,  { passive: true });
        petModal.addEventListener('touchend',   this._onTouchEnd);
    }

    _unbindSwipeToClose() {
        const petModal = document.querySelector('.pet-modal');
        if (!petModal || !this._onTouchStart) return;
        petModal.removeEventListener('touchstart', this._onTouchStart);
        petModal.removeEventListener('touchmove',  this._onTouchMove);
        petModal.removeEventListener('touchend',   this._onTouchEnd);
    }

    /* ─────────────────────────────────────────
       FILTRI
       ───────────────────────────────────────── */

    _bindFilterButtons() {
        if (!this.filter) return;
        this.filter.addEventListener('click', e => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;
            this.filter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.currentFilter = btn.dataset.filter || 'all';
            this.render();
        });
    }

    /* ─────────────────────────────────────────
       HELPERS
       ───────────────────────────────────────── */

    _capitalize(str) {
        if (!str) return '—';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    _defaultEmoji(tipo) {
        const map = { cane: '🐶', gatto: '🐱', coniglio: '🐰', criceto: '🐹', uccello: '🦜', tartaruga: '🐢' };
        return map[tipo] || '🐾';
    }
}

/* ==============================================
   DATI DEI PET
   ============================================== */

const petData = [
    {
        nome: 'Axel',
        tipo: 'cane',
        razza: 'Maltipoo',
        eta: '9 anni',
        sesso: 'Maschio',
        salute: 'Ottima',
        dieta: 'Mix umido e secco',
        caratteristiche: ['Curioso', 'Giocherellone', 'Pigro', 'Coccolosissimo'],
        badges: [],
        bio: 'Axel è un coccolone, si farebbe coccolare per ore senza mai averne abbastanaza! È un mangione e se la giornata è bella vuole rimanere fuori per ore, altrimenti bisognini e via. È un po` scemotto ma se la cosa gli interessa diventa furbissimo!',
        emoji: '🐕',
        foto: '../images/pet_photo/axel.webp'
    },
    {
        nome: 'Maggy',
        tipo: 'cane',
        razza: 'Jack Russel',
        eta: '15 anni',
        sesso: 'Femmina',
        salute: 'Non vedente al 100%',
        dieta: 'Un po` di tutto',
        caratteristiche: ['Dolcissima', 'Ama le coccole', 'Non vede benissimo', 'Obbediente'],
        badges: [
            { etichetta: '👁️ Non vedente', tipo: 'blind' },
            { etichetta: '🌟 Speciale',    tipo: 'special' }
        ],
        bio: 'Maggy ha avuto un incidente per cui ha parzialmente perso la visto ma non ha mai perso il sorriso. È molto vivace e coccolosa e come piace dire al padrone, è un Carro Armato!',
        emoji: '🐶',
        foto: '../images/pet_photo/maggy.jpeg'
    },
    {
        nome: 'Tommy',
        tipo: 'cane',
        razza: 'Barboncino',
        eta: '12',
        sesso: 'Maschio',
        salute: 'Perfetta salute',
        dieta: 'Dieta secca per senior',
        caratteristiche: ['Coccoloso', 'Attivo', 'Curioso', 'Intelligente'],
        badges: [
            { etichetta: '🔎 Ricercatore', tipo: 'mid-senior' },
            { etichetta: '🫂 Sindrome Abbandono', tipo: 'special' }
        ],
        bio: 'Tommy è un curiosone, ama le persone ma un po` meno gli altri cani e quando si esce camminerebbe per ore! È molto intelligente, capisce ciò che gli viene detto ed è addestrato per la ricerca in superficie, un ricercatore!',
        emoji: '🐕',
        foto: '../images/pet_photo/tommy.jpeg'
    },
    {
        nome: 'Chloe',
        tipo: 'cane',
        razza: 'Barboncino Toy',
        eta: '1',
        sesso: 'Femmina',
        salute: 'Perfetta salute',
        dieta: '',
        caratteristiche: ['Coccolosa', 'Iperattiva', 'Giocherellona'],
        badges: [],
        bio: 'Chloe è un piccolo uragano, ha tantissime energie e vuole sempre giocare! Ama molto le persone ed è una coccolona, a spasso poi non si fermerebbe mai!',
        emoji: '🐕',
        foto: '../images/pet_photo/chloe.jpeg'
    },
    {
        nome: 'Fiore',
        tipo: 'cane',
        razza: 'Setter',
        eta: '10 circa',
        sesso: 'Femmina',
        salute: 'Perfetta salute',
        dieta: '',
        caratteristiche: ['Coccolosa', 'Golosona', 'Affettuosa'],
        badges: [],
        bio: 'Fiore è una patatona, si farebbe coccolare tutto il giorno ma c`è solo una cosa che le farebbe fare tutto... il cibo! È una golosona, ama farsi accarezzare dalle persone e per lei è sempre un buon momento per sedersi!',
        emoji: '🐕',
        foto: '../images/pet_photo/fiore.jpeg'
    },
    {
        nome: 'Tommy',
        tipo: 'cane',
        razza: 'Labrador',
        eta: '15 circa',
        sesso: 'Maschio',
        salute: 'Zoppica un po` e sente l`età',
        dieta: '',
        caratteristiche: ['Dormiglione', 'Coccoloso', 'Golosone'],
        badges: [
            { etichetta: '🌟 Speciale', tipo: 'special'},
            { etichetta: '🦽 Problemi Motori', tipo: 'special'},
        ],
        bio: 'Tommy è un cucciolone, è dolcissimo e ha uno sguardo che intenerirebbe chiunque, purtroppo ha da poco visto il suo padrone andare in cielo ma è una forza della natura! Gli piace molto dormire e mangiare e quando siamo fuori non tornerebbe mai se non fosse che per l`età che ha si stanca dopo un po`',
        emoji: '🐕',
        foto: '../images/pet_photo/tommy_big.jpeg'
    },
    /* {
        nome: 'Schizzo & Lola',
        tipo: 'cane',
        razza: 'Ragdoll',
        eta: '6 anni',
        sesso: 'Femmina',
        salute: 'Ottima',
        dieta: 'Solo cibo premium umido',
        caratteristiche: ['Coccolona', 'Pigra', 'Silenziosa', 'Elegante'],
        badges: [
            { etichetta: '👑 Principessa', tipo: 'special' }
        ],
        bio: 'Margherita ha deciso che il divano è suo per diritto divino. Non si discute.',
        emoji: '🐕',
        foto: ''
    }, */

    /* {
        nome: 'Fiocco',
        tipo: 'altro',
        razza: 'Coniglio Nano',
        eta: '2 anni',
        sesso: 'Maschio',
        salute: 'Ottima',
        dieta: 'Fieno, verdure fresche',
        caratteristiche: ['Timido', 'Curioso', 'Ama il fieno', 'Saltellante'],
        badges: [],
        bio: 'Fiocco ci ha messo una settimana a fidarsi, poi non se n\'è più andato dal grembo.',
        emoji: '🐰',
        foto: ''
    } */
];

/* ── INIZIALIZZAZIONE ── */
document.addEventListener('DOMContentLoaded', () => {
    const profiles = new PetProfiles('#profilesGrid', '#profilesFilter', '#petModal');
    profiles.setPets(petData);
    window.petProfilesInstance = profiles;
});