/* ============================================
   REVIEWS SYSTEM - reviews.js

   Modalità operativa:
   1. MOCK (default): usa dati di esempio statici
   2. GOOGLE PLACES API: da abilitare configurando GOOGLE_CONFIG

   ============================================ */

const GOOGLE_CONFIG = {
    enabled: false, // da mettere a true se si vuole pagare l'API e sincronizzarlo ai servizi google
    apiKey: '',
    placeId: 'ChIJx0h0eN0xDgQRwxfKYvvzfg8',
    reviewUrl: 'https://g.page/r/CcMXymL7834PEBM/review'
};

class ReviewsCarousel {

    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.reviews = [];
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.isAnimating = false;
        this.touchStartX = 0;

        this.init();
    }

    async init() {
        this.renderSkeleton();

        if (GOOGLE_CONFIG.enabled) {
            await this.loadGoogleReviews();
        } else {
            this.reviews = REVIEWS_DATA;
        }

        if (this.reviews.length === 0) {
            this.renderEmpty();
            return;
        }

        this.render();
        this.bindEvents();
        this.startAutoPlay();
    }

    async loadGoogleReviews() {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_CONFIG.placeId}&fields=reviews,rating,user_ratings_total&key=${GOOGLE_CONFIG.apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.result && data.result.reviews) {
                this.totalRating = data.result.rating;
                this.totalCount = data.result.user_ratings_total;
                this.reviews = data.result.reviews.map(r => ({
                    author: r.author_name,
                    avatar: '⭐',
                    rating: r.rating,
                    text: r.text,
                    service: 'Servizio',
                    date: r.relative_time_description
                }));
            }
        } catch (err) {
            console.warn('[Reviews] Google API non disponibile, uso dati mock.', err);
            this.reviews = MOCK_REVIEWS;
        }
    }

    getAverageRating() {
        if (this.totalRating) return this.totalRating.toFixed(1);
        const avg = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length;
        return avg.toFixed(1);
    }

    getTotalCount() {
        return this.totalCount || this.reviews.length;
    }

    renderStars(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return '⭐'.repeat(full) + (half ? '✨' : '') + '☆'.repeat(empty);
    }

    getReviewUrl() {
        if (GOOGLE_CONFIG.enabled && GOOGLE_CONFIG.reviewUrl) {
            return GOOGLE_CONFIG.reviewUrl;
        }
        return 'https://search.google.com/local/writereview?placeid=' + GOOGLE_CONFIG.placeId;
    }

    renderSkeleton() {
        this.container.innerHTML = `
            <div class="reviews-loading">
                <div class="reviews-spinner"></div>
                <span>Caricamento recensioni…</span>
            </div>`;
    }

    renderEmpty() {
        this.container.innerHTML = `
            <div class="reviews-loading">
                <span style="font-size:2rem">🐾</span>
                <span>Nessuna recensione ancora. Sii il primo!</span>
            </div>`;
    }

    render() {
        const avg = this.getAverageRating();
        const count = this.getTotalCount();

        const cardsHTML = this.reviews.map(r => `
            <div class="review-card" data-hold-pause>
                <div class="review-card-header">
                    <div class="review-avatar">${this._escape(r.avatar)}</div>
                    <div class="review-meta">
                        <div class="review-author">${this._escape(r.author)}</div>
                        <div class="review-service">${this._escape(r.service)}</div>
                    </div>
                </div>
                <div class="review-stars">${this.renderStars(r.rating)}</div>
                <p class="review-text">${this._escape(r.text)}</p>
                <div class="review-date">${this._escape(r.date)}</div>
            </div>`).join('');

        const dotsHTML = this.reviews.map((_, i) => `
            <div class="reviews-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
        `).join('');

        this.container.innerHTML = `
            <h2 class="reviews-title">❤️ Le vostre parole</h2>
            <p class="reviews-subtitle">Cosa dicono i proprietari che ci hanno affidato i loro animali</p>

            <div class="reviews-average">
                <div class="reviews-average-score">${avg}</div>
                <div class="reviews-stars-avg">${this.renderStars(parseFloat(avg))}</div>
                <div class="reviews-count">${count} recension${count === 1 ? 'e' : 'i'} verificat${count === 1 ? 'a' : 'e'}</div>
            </div>

            <div class="reviews-progress">
                <div class="reviews-progress-bar" id="reviewsProgressBar"></div>
            </div>

            <div class="reviews-pause-hint">⏸ Puoi leggere con calma — rilascia per riprendere</div>

            <div class="reviews-carousel-wrapper" id="reviewsCarouselWrapper">
                <div class="reviews-carousel-track" id="reviewsCarouselTrack">
                    ${cardsHTML}
                </div>
            </div>

            <div class="reviews-nav">
                <button class="reviews-nav-btn" id="reviewsPrev">&#10094;</button>
                <div class="reviews-dots" id="reviewsDots">${dotsHTML}</div>
                <button class="reviews-nav-btn" id="reviewsNext">&#10095;</button>
            </div>

            <div class="reviews-cta-wrapper">
                <a href="${this.getReviewUrl()}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="reviews-cta-btn">
                    <span class="reviews-cta-icon">⭐</span>
                    Lascia la tua recensione
                </a>
                <span class="reviews-cta-note">Ci vuole meno di un minuto 🐾</span>
            </div>`;

        this.track = document.getElementById('reviewsCarouselTrack');
        this.progressBar = document.getElementById('reviewsProgressBar');
    }

    goTo(index) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.currentIndex = (index + this.reviews.length) % this.reviews.length;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        document.querySelectorAll('.reviews-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
        setTimeout(() => { this.isAnimating = false; }, 550);
        this.resetProgressBar();
    }

    next() { this.goTo(this.currentIndex + 1); }
    prev() { this.goTo(this.currentIndex - 1); }

    startAutoPlay() {
        this.stopAutoPlay();
        this.resetProgressBar();
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
        if (this.progressBar) {
            const frozen = getComputedStyle(this.progressBar).width;
            const total = getComputedStyle(this.progressBar.parentElement).width;
            const pct = (parseFloat(frozen) / parseFloat(total) * 100).toFixed(1);
            this.progressBar.style.transition = 'none';
            this.progressBar.style.width = pct + '%';
        }
    }

    resetProgressBar() {
        if (!this.progressBar) return;
        this.progressBar.style.transition = 'none';
        this.progressBar.style.width = '0%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.progressBar.style.transition = `width ${this.autoPlayDelay}ms linear`;
                this.progressBar.style.width = '100%';
            });
        });
    }

    bindEvents() {
        document.getElementById('reviewsPrev')?.addEventListener('click', () => {
            this.prev();
            this.startAutoPlay();
        });
        document.getElementById('reviewsNext')?.addEventListener('click', () => {
            this.next();
            this.startAutoPlay();
        });

        document.getElementById('reviewsDots')?.addEventListener('click', (e) => {
            const dot = e.target.closest('.reviews-dot');
            if (dot) {
                this.goTo(parseInt(dot.dataset.index));
                this.startAutoPlay();
            }
        });

        // --- Tieni premuto per mettere in pausa ---
        this.container.addEventListener('mousedown', (e) => {
            if (e.target.closest('[data-hold-pause]')) {
                this.stopAutoPlay();
                this._showPauseHint(true);
            }
        });
        document.addEventListener('mouseup', () => {
            if (!this.autoPlayInterval) {
                this.startAutoPlay();
                this._showPauseHint(false);
            }
        });
        this.container.addEventListener('touchstart', (e) => {
            if (e.target.closest('[data-hold-pause]')) {
                this.stopAutoPlay();
                this._showPauseHint(true);
            }
        }, { passive: true });
        this.container.addEventListener('touchend', () => {
            if (!this.autoPlayInterval) {
                this.startAutoPlay();
                this._showPauseHint(false);
            }
        }, { passive: true });
        this.container.addEventListener('touchcancel', () => {
            if (!this.autoPlayInterval) {
                this.startAutoPlay();
                this._showPauseHint(false);
            }
        }, { passive: true });

        const wrapper = document.getElementById('reviewsCarouselWrapper');
        if (wrapper) {
            wrapper.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
            }, { passive: true });
            wrapper.addEventListener('touchend', (e) => {
                const diff = this.touchStartX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.next() : this.prev();
                    this.startAutoPlay();
                }
            }, { passive: true });
            wrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
            wrapper.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    _showPauseHint(visible) {
        const hint = this.container.querySelector('.reviews-pause-hint');
        if (hint) hint.classList.toggle('active', visible);
    }

    _escape(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

/* Avvio */
document.addEventListener('DOMContentLoaded', () => {
    window.reviewsCarousel = new ReviewsCarousel('reviewsSection');
});