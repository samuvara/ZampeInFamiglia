// Services Menu JavaScript

const adviceForPet = "<br><p><strong>ATTENZIONE! Dare sempre i riferimenti di veterinario di fiducia e libretto medico del pet in modo da poter gestire eventuali emergenze al meglio</strong></p>";

// Service details data
const serviceDetails = {
    'passeggiata-30': {
        title: 'Passeggiata Breve - 30 minuti',
        content: ` 
            <h3>Cosa Include:</h3>
            <ul>
                <li>Passeggiata di 30 minuti nel parco o nel quartiere</li>
                <li>Acqua fresca sempre disponibile</li>
                <li>Foto e aggiornamenti durante la passeggiata</li>
                <li>Attenzione personalizzata al tuo amico a quattro zampe</li>
            </ul>

            <p><strong>Perfetta per</strong> cani che necessitano di una breve pausa durante la giornata</p><br>
            
            <h3>Note Importanti:</h3>
            <ul>
                <li>Orari flessibili da concordare</li>
                <li>Possibilità di passeggiate di gruppo o individuali</li>
                <li>Prezzi speciali per pacchetti settimanali</li>
                <li>Rimborso spese dei viaggi oltre i 10km</li>
            </ul>
            ${adviceForPet}
        `
    },
    'passeggiata-60': {
        title: 'Passeggiata Standard - 1 ora',
        content: ` 
            <h3>Cosa Include:</h3>
            <ul>
                <li>Passeggiata di 1 ora in ambienti sicuri e stimolanti</li>
                <li>Tempo dedicato al gioco e alla socializzazione</li>
                <li>Acqua fresca e pause quando necessario</li>
                <li>Foto e video del vostro amico durante l'attività</li>
                <li>Report giornaliero via WhatsApp</li>
            </ul>

            <p><strong>Perfetta per</strong> la maggior parte dei cani che necessitano di esercizio quotidiano</p><br>
            
            <h3>Note Importanti:</h3>
            <ul>
                <li>Ideale per cani con media energia</li>
                <li>Include tempo di gioco al parco</li>
                <li>Sconti disponibili per abbonamenti mensili</li>
                <li>Rimborso spese dei viaggi oltre i 10km</li>
            </ul>
            ${adviceForPet}
        `
    },
    'passeggiata-90': {
        title: 'Passeggiata Lunga - 1 ora e 30 minuti',
        content: ` 
            <h3>Cosa Include:</h3>
            <ul>
                <li>Passeggiata estesa di 1 ora e 30 minuti</li>
                <li>Esplorazione di parchi e sentieri diversi</li>
                <li>Ampio tempo per gioco e socializzazione</li>
                <li>Acqua fresca e pause rilassanti</li>
                <li>Foto e video dell'avventura</li>
                <li>Report dettagliato dell'attività</li>
            </ul>

            <p><strong>Perfetta per</strong> cani ad alta energia che amano l'avventura</p><br>
            
            <h3>Note Importanti:</h3>
            <ul>
                <li>Consigliata per razze attive (Border Collie, Husky, ecc.)</li>
                <li>Percorsi variati per stimolare il cane</li>
                <li>Possibilità di attività specifiche su richiesta</li>
                <li>Rimborso spese dei viaggi oltre i 10km</li>
            </ul>
            ${adviceForPet}
        `
    },
    'giorno': {
        title: 'Giorno Con Noi - Minimo 2 ore',
        content: `
            <h3>Cosa Include:</h3>
            <ul>
                <li>Cura completa per le ore richieste diurne</li>
                <li>Diverse passeggiate durante la giornata</li>
                <li>Pasti secondo le tue indicazioni</li>
                <li>Tempo di gioco e relax</li>
                <li>Somministrazione eventuali farmaci</li>
                <li>Aggiornamenti foto/video durante la giornata</li>
            </ul>

            <p><strong>Perfetto per</strong> quando devi lavorare o sei impegnato durante il giorno</p><br>
            
            <h3>Note Importanti:</h3>
            <ul>
                <li>Porta il cibo abituale del tuo pet</li>
                <li>Orario tipico: 8:00 - 16:00 (flessibile)</li>
                <li>Ambiente sicuro e familiare</li>
                <li>Prezzi speciali per più giorni consecutivi</li>
            </ul>
            ${adviceForPet}
        `
    },
    'giorno-notte': {
        title: 'Giorno e Notte Con Noi - 24 ore',
        content: ` 
            <h3>Cosa Include:</h3>
            <ul>
                <li>Cura completa 24 ore su 24</li>
                <li>Passeggiate multiple durante il giorno</li>
                <li>Tutti i pasti secondo routine abituale (da specificare)</li>
                <li>Sistemazione notturna confortevole</li>
                <li>Compagnia costante e attenzioni</li>
                <li>Somministrazione farmaci se necessario</li>
                <li>Aggiornamenti regolari con foto e video</li>
            </ul>

            <p><strong>Perfetto per</strong> weekend fuori, viaggi o impegni che durano tutto il giorno</p><br>
            
            <h3>Note Importanti:</h3>
            <ul>
                <li>Porta tutto il necessario (cibo, cuccia, giochi preferiti, medicine)</li>
                <li>Ambiente casalingo e accogliente</li>
                <li>Sconti per soggiorni da più di 3 giorni</li>
            </ul>
            ${adviceForPet}
        `
    },
    'compagnia-dom': {
        title: 'Compagnia A Domicilio',
        content: `
            <h3>Cosa Include:</h3>
            <ul>
                <li>Visita a domicilio di minimo 2 ore</li>
                <li>Compagnia e coccole al tuo animale</li>
                <li>Pasti e acqua fresca</li>
                <li>Pulizia lettiera (per gatti)</li>
                <li>Breve passeggiata se cane</li>
                <li>Cura delle piante su richiesta</li>
                <li>Ritiro posta/controllo casa</li>
            </ul>

            <p><strong>Perfetto per</strong> pet che preferiscono restare nel loro ambiente familiare</p><br>
            
            <h3>Note Importanti:</h3>
            <ul>
                <li>Minimo 2 ore divisibili nella giornata</li>
                <li>Ideale per gatti, cani anziani o animali ansiosi</li>
                <li>Possibilità di visite multiple al giorno</li>
                <li>Aggiornamenti via foto dopo ogni visita</li>
                <li>Rimborso spese dei viaggi oltre i 10km</li>
            </ul>
            ${adviceForPet}
        `
    },
    'matrimoni-eventi': {
        title: '💍 Matrimoni & Eventi Speciali',
        content: `
        <h3>Il tuo pet, protagonista del giorno più bello</h3>
        <p>Gestiamo il tuo cane durante tutto l'evento, garantendo la sua serenità e la tua tranquillità.
        Ci dedichiamo completamente a lui, così tu puoi goderti ogni momento senza pensieri.</p>

        <h3>Cosa Include:</h3>
        <ul>
            <li>🐾 <strong>Gestione completa</strong> dell'aspetto fisico e psicologico del cane per tutta la durata dell'evento</li>
            <li>😌 <strong>Nessuna fonte di stress</strong> — il cane è sempre sotto controllo in un ambiente sereno e sicuro</li>
            <li>📸 <strong>Collaborazione con gli sposi</strong> — disponibili per foto, momenti speciali o qualsiasi richiesta</li>
            <li>🎽 <strong>Dotazione sempre con noi:</strong> guinzaglio e collare di riserva, ciotola e acqua fresca</li>
            <li>🔒 Il cane <strong>non viene mai lasciato incustodito</strong>, né sciolto, né affidato ad altri se non su esplicita indicazione degli sposi</li>
        </ul>

        <h3>Note Importanti:</h3>
        <ul>
            <li>Sopralluogo preventivo consigliato per conoscere location e routine del cane</li>
            <li>Porta il cibo abituale, giochi preferiti e qualsiasi presidio sanitario necessario</li>
            <li>Fornisci sempre i riferimenti del veterinario di fiducia e il libretto medico</li>
            <li>Servizio personalizzabile in base alle esigenze dell'evento</li>
        </ul>

        <div class="event-cta">
            <p class="event-cta__text">📩 Il prezzo varia in base alla durata e alle esigenze dell'evento.<br>
            <strong>Contattaci per un preventivo personalizzato e gratuito!</strong></p>

            <div class="event-cta__buttons">

                <!-- WhatsApp -->
                <a href="https://wa.me/393314070796?text=Ciao!%20Vorrei%20un%20preventivo%20per%20il%20servizio%20Matrimoni%20%26%20Eventi%20🐾"
                    class="event-btn event-btn--whatsapp"
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Scrivici su WhatsApp per un preventivo">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="wa-logo-small">
                        <circle cx="24" cy="24" r="24" fill="#25D366"/>
                        <path d="M34.507 13.453C32.07 11.01 28.72 9.5 25.02 9.5c-7.62 0-13.82 6.2-13.82 13.82 0 2.44.64 4.82 1.86 6.92L11 38.5l8.46-2.22c2.02 1.1 4.3 1.68 6.62 1.68h.01c7.62 0 13.82-6.2 13.82-13.82 0-3.69-1.44-7.16-4.41-10.7zm-9.49 21.26h-.01c-2.07 0-4.1-.56-5.87-1.61l-.42-.25-4.36 1.14 1.16-4.24-.27-.44c-1.16-1.84-1.77-3.97-1.77-6.16 0-6.38 5.19-11.57 11.57-11.57 3.09 0 5.99 1.2 8.17 3.39 2.18 2.18 3.38 5.09 3.38 8.18-.01 6.38-5.2 11.56-11.58 11.56zm6.35-8.67c-.35-.17-2.05-1.01-2.37-1.13-.32-.12-.55-.17-.78.17-.23.35-.89 1.13-1.09 1.36-.2.23-.4.26-.75.09-.35-.17-1.47-.54-2.8-1.73-1.03-.92-1.73-2.06-1.93-2.41-.2-.35-.02-.54.15-.71.15-.15.35-.4.52-.6.17-.2.23-.35.35-.58.12-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.57-.58-.78-.59-.2-.01-.43-.01-.66-.01-.23 0-.6.09-.91.43-.32.35-1.2 1.17-1.2 2.86s1.23 3.31 1.4 3.54c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.05-.84 2.34-1.65.29-.81.29-1.5.2-1.65-.09-.14-.32-.23-.67-.4z" fill="white"/>
                    </svg>
                    Scrivici su WhatsApp
                </a>

                <!-- Email -->
                <a href="mailto:zampeinfamiglia.firenze@gmail.com?subject=Preventivo%20Matrimoni%20%26%20Eventi&body=Ciao!%20Vorrei%20un%20preventivo%20per%20il%20servizio%20Matrimoni%20%26%20Eventi%20🐾"
                    class="event-btn event-btn--email"
                    aria-label="Scrivici una email per un preventivo">
                    ✉️ Scrivici una Email
                </a>

            </div>
        </div>
    `
    }
};

// Initialize the menu
document.addEventListener('DOMContentLoaded', function () {
    initializeServicesMenu();
});

function initializeServicesMenu() {
    const categories = document.querySelectorAll('.service-category');

    // Set first category as active by default
    if (categories.length > 0) {
        categories[0].classList.add('active');
    }

    // Add click event to categories
    categories.forEach(category => {
        category.addEventListener('click', function () {
            const categoryName = this.getAttribute('data-category');
            switchCategory(categoryName, this);
        });
    });
}

function switchCategory(categoryName, clickedElement) {
    // Remove active class from all categories
    document.querySelectorAll('.service-category').forEach(cat => {
        cat.classList.remove('active');
    });

    // Add active class to clicked category
    clickedElement.classList.add('active');

    // Hide all service groups
    document.querySelectorAll('.service-group').forEach(group => {
        group.classList.add('hidden');
    });

    // Show selected service group
    const selectedGroup = document.querySelector(`[data-group="${categoryName}"]`);
    if (selectedGroup) {
        selectedGroup.classList.remove('hidden');
    }
}

function showServiceDetails(serviceId) {
    const modal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    const service = serviceDetails[serviceId];

    if (service) {
        modalTitle.textContent = service.title;
        modalBody.innerHTML = service.content;
        modal.classList.add('active');

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceDetails() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('active');

    // Re-enable body scroll
    document.body.style.overflow = '';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('serviceModal');

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeServiceDetails();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeServiceDetails();
        }
    });
});
