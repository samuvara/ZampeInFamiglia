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
                <li>Minimo 2 ore per visita</li>
                <li>Ideale per gatti, cani anziani o animali ansiosi</li>
                <li>Possibilità di visite multiple al giorno</li>
                <li>Aggiornamenti via foto dopo ogni visita</li>
            </ul>
            ${adviceForPet}
        `
    }
};

// Initialize the menu
document.addEventListener('DOMContentLoaded', function() {
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
        category.addEventListener('click', function() {
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
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('serviceModal');
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServiceDetails();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServiceDetails();
        }
    });
});
