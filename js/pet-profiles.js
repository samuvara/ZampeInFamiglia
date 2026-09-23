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

        this.grid = document.querySelector(gridSelector);
        this.filter = document.querySelector(filterSelector);
        this.modal = document.querySelector(modalSelector);
        this.modalContent = document.querySelector('#modalContent');
        this.modalClose = document.querySelector('#modalClose');

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
            { label: '🐾 Specie', value: this._capitalize(pet.tipo) },
            { label: '🧬 Razza', value: pet.razza || '—' },
            { label: '🎂 Età', value: pet.eta || '—' },
            { label: '⚤ Sesso', value: pet.sesso || '—' },
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
                <div class="card-id">N° ${String(pet._id).padStart(3, '0')}</div>
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
            { label: '🐾 Specie', value: this._capitalize(pet.tipo) },
            { label: '🧬 Razza', value: pet.razza || '—' },
            { label: '🎂 Età', value: pet.eta || '—' },
            { label: '⚤ Sesso', value: pet.sesso || '—' },
            { label: '🩺 Salute', value: pet.salute || '—' },
            { label: '🍗 Dieta', value: pet.dieta || '—' },
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
        petModal.addEventListener('touchmove', this._onTouchMove, { passive: true });
        petModal.addEventListener('touchend', this._onTouchEnd);
    }

    _unbindSwipeToClose() {
        const petModal = document.querySelector('.pet-modal');
        if (!petModal || !this._onTouchStart) return;
        petModal.removeEventListener('touchstart', this._onTouchStart);
        petModal.removeEventListener('touchmove', this._onTouchMove);
        petModal.removeEventListener('touchend', this._onTouchEnd);
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
        const map = { cane: '🐶', gatto: '🐱', pollo: '🐔', coniglio: '🐰', criceto: '🐹', uccello: '🦜', tartaruga: '🐢' };
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
            { etichetta: '🌟 Speciale', tipo: 'special' }
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
        foto: '../images/pet_photo/chloe_dog.jpeg'
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
        eta: '12 circa',
        sesso: 'Maschio',
        salute: 'Zoppica un po` e sente l`età',
        dieta: '',
        caratteristiche: ['Dormiglione', 'Coccoloso', 'Golosone'],
        badges: [
            { etichetta: '🌟 Speciale', tipo: 'special' },
            { etichetta: '🦽 Problemi Motori', tipo: 'special' },
        ],
        bio: 'Tommy è un cucciolone, è dolcissimo e ha uno sguardo che intenerirebbe chiunque, purtroppo ha da poco visto il suo padrone andare in cielo ma è una forza della natura! Gli piace molto dormire e mangiare e quando siamo fuori non tornerebbe mai se non fosse che per l`età che ha si stanca dopo un po`',
        emoji: '🐕',
        foto: '../images/pet_photo/tommy_big_new.jpeg'
    },
    {
        nome: 'Willy',
        tipo: 'cane',
        razza: 'Meticcio',
        eta: '16',
        sesso: 'Maschio',
        salute: 'Sente l`età',
        dieta: '',
        caratteristiche: ['Camminatore', 'Curioso'],
        badges: [
            { etichetta: '🌟 Speciale', tipo: 'special' },
        ],
        bio: 'Willy ha degli occhioni dolcissimi, vuole sempre uscire e quando stiamo fuori camminerebbe tutto il giorno! Sente un po` l`età perché spesso si vuole riposare ma è ancora un giovanotto!',
        emoji: '🐕',
        foto: '../images/pet_photo/willy.jpeg'
    },
    {
        nome: 'Maxi',
        tipo: 'cane',
        razza: 'Border Collie',
        eta: '7',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: '',
        caratteristiche: ['Iperattivo', 'Coccoloso', 'Giocherellone', 'Intelligentissimo'],
        badges: [
            { etichetta: '🕵️ Cinofilo', tipo: 'senior' },
        ],
        bio: 'Maxi è un cucciolone favoloso e super bravo, è intelligentissimo e quando siamo fuori è un piacere fare le passeggiate. E` in super forma e conosce anche il tedesco!',
        emoji: '🐕',
        foto: '../images/pet_photo/maxi.jpeg'
    },
    {
        nome: 'Mauricìo',
        tipo: 'altro',
        razza: 'Bionda Piemontese',
        eta: '2 mesi e mezzo',
        sesso: 'Maschio',
        salute: 'Zoppica un po`',
        dieta: 'Mangime',
        caratteristiche: ['Cresta rossa'],
        badges: [],
        bio: 'Mauricio è un gallo di 2 mesi e mezzo abituato a stare in casa ma a cui piace stare fuori, ha una gallina come amica per cui sono inseparabili! Rimane con noi finchè il nuovo pollaio per lui e la sua amica non sarà pronto!',
        emoji: '🐔',
        foto: '../images/pet_photo/mauricio.jpeg'
    },
    {
        nome: 'Mirtilla',
        tipo: 'cane',
        razza: 'Cavalier King',
        eta: '1 e mezzo',
        sesso: 'Femmina',
        salute: 'Soffre di stress',
        dieta: 'secco',
        caratteristiche: ['Ipercoccolosa', 'Cozza', 'Golosona', 'Iperattiva'],
        badges: [],
        bio: 'Mirtilla è una cagnolina a cui piacciono molto gli umani, qualsiasi persona incontra per strada gli fa le feste e chiede sempre coccole! è molto coccolosa e il suo nome è dovuto al suo essere golosissima di mirtilli! è educatissima ed abituata a stare in casa e le piace dormire sui cuscini.',
        emoji: '🐕',
        foto: '../images/pet_photo/mirtilla.jpeg'
    },
    {
        nome: 'Leo & Sansa',
        tipo: 'cane',
        razza: 'Spitz di Pomerania',
        eta: '',
        sesso: 'Maschio e Femmina',
        salute: 'Perfetta',
        dieta: '',
        caratteristiche: ['Iperattivi', 'Paurosi', 'Coccoloni'],
        badges: [],
        bio: 'Sansa e Leo sono due cagnolini iperattivi, sempre pronti ad abbaiare a qualcuno ma con uno sguardo dolcissimo, sono un po` diffidenti ma dopo poco si sono messi a giocare a più non posso con noi!',
        emoji: '🐕',
        foto: '../images/pet_photo/sansaeleo.jpeg'
    },
    {
        nome: 'Carla',
        tipo: 'cane',
        razza: 'Meticcio',
        eta: '12',
        sesso: 'Femmina',
        salute: '',
        dieta: 'Spezzatino di carne',
        caratteristiche: ['Golosa', 'Abitudinaria', 'Pigra', 'Dolce'],
        badges: [
            { etichetta: '🌟 Speciale', tipo: 'special' },
        ],
        bio: 'Carla è stata maltrattata prima di finire al canile e per questo è un po` diffidente ma da tempo ormai è la regina della sua "nuova" casa! E` un po` pigra ma è molto dolce ed è una golosona!',
        emoji: '🐕',
        foto: '../images/pet_photo/carla.jpeg'
    },
    {
        nome: 'Bilbo',
        tipo: 'gatto',
        razza: 'Maine Coon',
        eta: '12',
        sesso: 'Maschio',
        salute: 'Ha una protesi',
        dieta: '',
        caratteristiche: ['Pigro', 'Dormiglione', 'Coccolone', 'Highlander'],
        badges: [
            { etichetta: '🌟 Speciale', tipo: 'special' },
        ],
        bio: 'Bilbo è un gattone dallo sguardo prepotente ma è di un dolce che pochi gatti sono, si fa coccolare ed accarezza ovunque e non dice pio! Ha avuto un incidente cadendo dal terzo piano per il quale adesso ha una protesi alla zampa posteriore destra ma quando cammina è super stealt, silenzioso e veloce!',
        emoji: '🐈',
        foto: '../images/pet_photo/bilbo.jpeg'
    },
    {
        nome: 'Vasco',
        tipo: 'cane',
        razza: 'Cane Galgo',
        eta: '7 circa',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: 'Croccantini',
        caratteristiche: ['Timoroso', 'Coccoloso', 'Diffidente', 'Dolce'],
        bio: 'Vasco è stato sfruttato per tanti anni per fare le corse, essendo un levriero spagnolo. Per fortuna un`associazione l`ha salvato e dopo è stato adottato dalla sua attuale famiglia che lo tratta con cura e amore. Ancora però gli è rimasta una forte paura verso gli umani',
        emoji: '🐕',
        foto: '../images/pet_photo/vasco.jpeg'
    },
    {
        nome: 'Alice, Ada e Agata',
        tipo: 'cane',
        razza: 'Barboncini',
        eta: '',
        sesso: 'Femmine',
        salute: 'Perfetta',
        dieta: 'Croccantini',
        caratteristiche: ['Iperattive', 'Coccolose', 'Giocherellone', 'Dolcissime'],
        bio: 'Alice (quella marroncina) è la mamma di Ada e Agatha e sono tutte e tre delle giocherellone, sempre alla ricerca di coccole ed iperattive! Ada è quella un po` più docile mentre Agatha piange spesso, Alice invece sembra della loro stessa età in quanto cerca sempre le coccole e sale spesso sopra il nostro pancale. Insomma, tre bellissime pestifere!',
        emoji: '🐕',
        foto: '../images/pet_photo/barboncineA.jpeg'
    },
    {
        nome: 'Alvarino',
        tipo: 'altro',
        razza: 'Bionda Piemontese',
        eta: '4 mesi',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: 'Mangime',
        caratteristiche: ['Cresta rossa'],
        badges: [],
        bio: 'Alvarino è il fratellino di Mauricio che per bisogno del padrone è stato con noi per dei giorni. E` un po` più agitato di Mauricio e sembra non aver paura di nulla, dorme in una cuccetta ed è sempre in movimento!',
        emoji: '🐔',
        foto: '../images/pet_photo/alvarino.jpeg'
    },
    {
        nome: 'Cecco',
        tipo: 'cane',
        razza: 'Labrador',
        eta: '10',
        sesso: 'Maschio',
        salute: 'Sovrappeso',
        dieta: 'Tutto',
        caratteristiche: ['Mangione', 'Coccoloso', 'Dolce'],
        bio: 'Cecco è un labrador che ha un solo problema, mangerebbe in continuazione e qualsiasi cosa! Per il resto, è un cane super educato, bravo, ubbidiente e molto coccoloso. Lo abbiamo conosciuto per il battesimo del suo fratellino umano ed è stato bravissimo!',
        emoji: '🐕',
        foto: '../images/pet_photo/cecco.jpeg'
    },
    {
        nome: 'Bord',
        tipo: 'cane',
        razza: 'Meticcio',
        eta: '5',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: 'Mista',
        caratteristiche: ['Supercoccolone', 'Iperattivo', 'Affettuoso', 'Giocherellone'],
        bio: 'Bord è il cane più affettuoso e dolce che abbiamo mai conosciuto, già al primo incontro ci ha riempito di bacini e faceva le feste come se fosse sempre stato con noi. Si è abituato subito alla nostra routine nonostante sia stato solo due giorni! Ama giocare ed il contatto fisico con le persone, quando poi è in un giardino è proprio nel suo habitat!',
        emoji: '🐕',
        foto: '../images/pet_photo/bord.jpeg'
    },
    {
        nome: 'Zoro',
        tipo: 'cane',
        razza: 'Meticcio',
        eta: '9 mesi',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: 'Mista',
        caratteristiche: ['Giocherellone', 'Curiosone', 'Coccoloso'],
        bio: `Cane meticcio di 9 mesi un po pauroso delle novità, ottima salute, ma si conquista subito con un biscottino! Giocherebbe dalla mattina alla sera correndo in su e giù, è veramente instancabile e super curioso di ciò che c'è intorno a lui`,
        emoji: '🐕',
        foto: '../images/pet_photo/zoro.jpeg'
    },
    {
        nome: 'Bia',
        tipo: 'gatto',
        razza: 'Gatta Tartarugata a pelo corto',
        eta: '7',
        sesso: 'Femmina',
        salute: 'Perfetta',
        dieta: 'Secco',
        caratteristiche: ['Supercoccolosa', 'Giocherellona', 'Socievole'],
        badges: [],
        bio: 'Gatta tartarugata a pelo corto, ottima salute, molto socievole e coccolosa anche con gli estranei. Lei è la regina delle casa e controlla i suoi fratellini Oscar e Morgana, è anche la più grande dei tre e tiene sempre tutto d`occhio ma e veramente dolce.',
        emoji: '🐈',
        foto: '../images/pet_photo/bia.jpeg'
    },
    {
        nome: 'Oscar',
        tipo: 'gatto',
        razza: 'Gatto Tuxedo a pelo corto',
        eta: '5',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: 'Secco',
        caratteristiche: ['Testa fra le nuvole', 'Osservatore'],
        badges: [],
        bio: `Gatto tuxedo a pelo lungo, il maschietto della casa, con la testa sempre fra le nuvole. Fratello di Bia e Morgana si fa spesso gli affari suoi ma non dice mai di no ad un po' di coccole`,
        emoji: '🐈',
        foto: '../images/pet_photo/oscar.jpeg'
    },
    {
        nome: 'Morgana',
        tipo: 'gatto',
        razza: 'Gatta Nera Europea',
        eta: '4',
        sesso: 'Femmina',
        salute: '',
        dieta: 'Secco',
        caratteristiche: ['Diffidente', 'Furtiva', 'Void', 'Curiosa'],
        badges: [],
        bio: `Gatta nera europea, ottima salute, diffidente e un po' timida ma sempre dolce. Una ninja furtiva, è molto diffidente con gli estranei e quando decide di nascondersi diventa invisibile! È anche la più piccola dei suoi fratelli anche se timida molto dolce.`,
        emoji: '🐈',
        foto: '../images/pet_photo/morgana.jpeg'
    },
    {
        nome: 'Milo',
        tipo: 'gatto',
        razza: 'Gatto Rosso Europeo',
        eta: '',
        sesso: 'Maschio',
        salute: '',
        dieta: 'Misto',
        caratteristiche: ['Golosone', 'Bulletto', 'Coccolone', 'Curioso'],
        badges: [],
        bio: 'Gatto rosso europeo di ottima salute, è un mangione, davvero vorace, ama le altezze. Se potesse non smetterebbe mai di mangiare e cerca sempre di rubarlo ai fratelli. Re della casa e soprattuto della terrazza, dove si arrampica in punti alti.',
        emoji: '🐈',
        foto: '../images/pet_photo/milo.jpeg'
    },
    {
        nome: 'Voody',
        tipo: 'gatto',
        razza: 'Gatto Nero Europeo',
        eta: '',
        sesso: 'Maschio',
        salute: '',
        dieta: 'Misto',
        caratteristiche: ['Distratto', 'Affettuoso', 'Tontolone'],
        badges: [
            { etichetta: '🌟 Speciale', tipo: 'special' },
        ],
        bio: 'Fatto nero europeo, ogni tanto ha qualche problemi di salute ma di base sta bene, ha la testa fra le nuvole e mangia mooolto lentamente. Viene un po` bullizzato dagli altri due fratellini perché non si oppone quando gli rubano il cibo ma quando si fida di te è molto coccoloso e divertente !',
        emoji: '🐈',
        foto: '../images/pet_photo/vuudy.jpeg'
    },
    {
        nome: 'Shanti',
        tipo: 'gatto',
        razza: 'Gatto Tigrato Europeo',
        eta: '',
        sesso: 'Femmina',
        salute: '',
        dieta: 'Misto',
        caratteristiche: ['Diffidente', 'Golosona', 'Paurosa'],
        badges: [],
        bio: 'Gatto tigrato europeo, ottima salute, molto diffidente e paurosa. Sorellina di Voody e Milo si avvicinava a noi solo per mangiare e neanche sempre, è molto diffidente degli estranei ma questo non le vieta di rubare il cibo a Voody!',
        emoji: '🐈',
        foto: '../images/pet_photo/shanti.jpeg'
    },
    {
        nome: 'Eolo',
        tipo: 'gatto',
        razza: '',
        eta: '2 circa',
        sesso: 'Maschio',
        salute: '',
        dieta: '',
        caratteristiche: ['Iperattivo', 'Coccolone', 'Bulletto', 'Midnight Zoomer'],
        badges: [],
        bio: 'Gatto tigrato europeo, un trovatello di circa 2 anni, molto coccoloso e giocherellone, ma anche testardo e molto forte. Eolo ha cambiato diverse case prima di assentarsi e ama andare fuori, ma comunque è davvero super coccoloso, si abitua subito a nuove situazioni e ama giocare soprattuto con la plastica che adora distruggere !',
        emoji: '🐈',
        foto: '../images/pet_photo/eolo.jpeg'
    },
    {
        nome: 'Chloe',
        tipo: 'gatto',
        razza: '',
        eta: '5 mesi',
        sesso: 'Femmina',
        salute: 'Perfetta',
        dieta: '',
        caratteristiche: ['Casinista', 'Coccolona', 'Giocherellona', 'Pazzerella'],
        badges: [],
        bio: 'Gattina calico a pelo corto di 5 mesi, ottima salute, dieta con umido e secco, è una instancabile giocherellona ma anche molto coccolosa. Fin da subito anche se eravamo estranei ci ha sempre dato molto affetto, vuole giocare continuamente vista la tenera età e adora guardare fuori dalla sua finestra e cacciare le mosche. Se facciamo qualcosa che non le va a genio però, ci punisce facendo un dispetto in casa.',
        emoji: '🐈',
        foto: '../images/pet_photo/chloe.jpeg'
    },
    {
        nome: 'Seoul',
        tipo: 'gatto',
        razza: 'Rosso Europeo',
        eta: '2 anni',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: 'Umido e secco',
        caratteristiche: ['Giocherellone', 'Mordace', 'Demonietto'],
        badges: [],
        bio: 'Seoul è un gattino che ama giocare e mordere le mani, è iperattivo e non si stanca mai di giocare! Spesso si mette ad osservare dalla finestra ed ogni tanto cerca anche le coccole!',
        emoji: '🐈',
        foto: '../images/pet_photo/seoul.jpg'
    },
    {
        nome: 'Semola',
        tipo: 'gatto',
        razza: 'Rosso Europeo',
        eta: '5 mesi',
        sesso: 'Maschio',
        salute: 'Perfetta',
        dieta: 'Secco',
        caratteristiche: ['Pasticcere', 'Coccolone', 'Giocherellone'],
        badges: [],
        bio: 'Semola ci ha accolti dal primo giorno con amore cercando sempre tante coccole ancora prima del cibo! Ci ha mostrato sin da subito le sue doti da panettiere facendoci il pane addosso ogni volta che ci vedeva. Gli piace giocare ma attenzione ai lacci, sono tutti suoi...',
        emoji: '🐈',
        foto: '../images/pet_photo/semola.jpg'
    },
    {
        nome: 'Merlino e Circe',
        tipo: 'gatto',
        razza: 'Persiano e British Long Hair',
        eta: '8 e 9',
        sesso: 'Maschio e Femmina',
        salute: 'Ottima',
        dieta: 'Misto',
        caratteristiche: ['Dormiglioni', 'Coccolosoni', 'Curiosoni'],
        badges: [],
        bio: 'Merlino è un gatto persiano di 8 anni ha sofferto di cistite in passato ma ora sta meglio! Dormiglione, se fosse per lui passerebbe tutto il giorno sul letto, ma e tanto coccoloso e ci fa sapere sempre quello che pensa miagolandocelo. Circe è una gatta british longhair di 9 anni, un po` diffidente ma super coccolosa adora farsi le unghie sugli oggetti!',
        emoji: '🐈',
        foto: '../images/pet_photo/merlinocirce.jpeg'
    },
    {
        nome: 'Tigro e Nina',
        tipo: 'gatto',
        razza: 'Tigrati',
        eta: '7 e 8',
        sesso: 'Maschio e Femmina',
        salute: 'Ottima',
        dieta: 'Misto',
        caratteristiche: ['Dormiglioni', 'Coccolosoni', 'Curiosoni', 'Esploratori'],
        badges: [],
        bio: "Tigro e Nina si sono ambientati quasi subito in casa andando in men che non si dica all'esplorazione, trovando svariati posti in cui poi sono rimasti e hanno usato come cuccia per il resto del tempo (sopra la maglietta di Letizia ci stava sempre Nina mentre sopra i panni sportivi di Samuel ci stava sempre Tigro).",
        emoji: '🐈',
        foto: '../images/pet_photo/tigroenina.jpg'
    },
    {
        nome: 'Spillo',
        tipo: 'cane',
        razza: 'Meticcio',
        eta: '3 anni',
        sesso: 'Maschio',
        salute: 'Ottima',
        dieta: 'Misto',
        caratteristiche: ['Coccolone', 'Cozzetta', 'Fifone'],
        badges: [],
        bio: "Spilletto è un fifone che ha paura di un sacco di cose anche se un motivi vero non c'è, appena entrato aveva paura anche di Samuel ma poco dopo gli è diventato una cozza che lo seguiva ovunque. Abituato a dormire con noi, la mattina si avvicinava per prendersi le coccole e in generale, le cercava sempre!",
        emoji: '🐕',
        foto: '../images/pet_photo/spillo.jpg'
    },
    {
        nome: 'Honey',
        tipo: 'cane',
        razza: 'Barboncino Toy',
        eta: '7 anni',
        sesso: 'Maschio',
        salute: 'Ottima',
        dieta: '',
        caratteristiche: ['Coccolosone', 'Giocherellone', 'Diffidente'],
        badges: [],
        bio: "Honey è un piccolo barboncino a cui piace tantissimo giocare con la pallina e ricevere delle coccole!",
        emoji: '🐕',
        foto: '../images/pet_photo/honey.jpg'
    },


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