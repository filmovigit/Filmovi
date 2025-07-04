// Modular Smart TV Streaming Site Script
// Author: AI Refactor for Netflix-style, TV-friendly UI
// ---

document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIG: Add your movies/series here ---
    const CONTENT = [
        // --- 2025 Releases ---
        {
            id: '101',
            title: "Wake Up Dead Man: A Knives Out Mystery",
            url: "wake-up-dead-man-a-knives-out-mystery",
            genre: "Crime",
            category: "Movies",
            year: 2025,
            description: "Detective Benoit Blanc returns to solve another mind-bending mystery.",
            poster: "",
            featured: true
        },
        {
            id: '102',
            title: "Troll 2",
            url: "troll-2-2025",
            genre: "Science Fiction",
            category: "Movies",
            year: 2025,
            description: "The trolls are back in this Norwegian fantasy adventure.",
            poster: "",
            featured: false
        },
        {
            id: '103',
            title: "Happy Gilmore 2",
            url: "happy-gilmore-2",
            genre: "Comedy",
            category: "Movies",
            year: 2025,
            description: "Adam Sandler returns in the hilarious sequel to the golf classic.",
            poster: "",
            featured: false
        },
        {
            id: '104',
            title: "The Old Guard 2",
            url: "the-old-guard-2",
            genre: "Superhero",
            category: "Movies",
            year: 2025,
            description: "The immortal warriors return for another action-packed adventure.",
            poster: "",
            featured: false
        },
        {
            id: '105',
            title: "My Oxford Year",
            url: "my-oxford-year",
            genre: "Romance",
            category: "Movies",
            year: 2025,
            description: "A heartfelt romance set in the historic halls of Oxford.",
            poster: "",
            featured: false
        },
        {
            id: '106',
            title: "Z-O-M-B-I-E-S 4: Dawn of the Vampires",
            url: "z-o-m-b-i-e-s-4-dawn-of-the-vampires",
            genre: "Comedy",
            category: "Family",
            year: 2025,
            description: "The musical monster franchise continues with a new supernatural twist.",
            poster: "",
            featured: false
        },
        {
            id: '107',
            title: "Dora and the Search for Sol Dorado",
            url: "dora-and-the-search-for-sol-dorado",
            genre: "Family",
            category: "Family",
            year: 2025,
            description: "Dora embarks on a new adventure to find the legendary city of gold.",
            poster: "",
            featured: false
        },
        {
            id: '108',
            title: "Gladiator II",
            url: "gladiator-ii",
            genre: "Action",
            category: "Movies",
            year: 2024,
            description: "The epic saga continues in ancient Rome.",
            poster: "",
            featured: false
        },
        {
            id: '109',
            title: "Echo Valley",
            url: "echo-valley",
            genre: "Thriller",
            category: "Movies",
            year: 2025,
            description: "A suspenseful thriller set in the mysterious Echo Valley.",
            poster: "",
            featured: false
        },
        // --- TV Shows ---
        {
            id: '201',
            title: "What We Do in the Shadows",
            url: "what-we-do-in-the-shadows",
            genre: "Comedy",
            category: "Series",
            year: 2019,
            description: "A mockumentary about vampire roommates navigating modern life.",
            poster: "",
            featured: false
        },
        {
            id: '202',
            title: "Law & Order: Special Victims Unit",
            url: "law-and-order-special-victims-unit",
            genre: "Crime",
            category: "Series",
            year: 1999,
            description: "The long-running crime drama following NYPD's Special Victims Unit.",
            poster: "",
            featured: false
        },
        {
            id: '203',
            title: "Tatort",
            url: "tatort",
            genre: "Crime",
            category: "Series",
            year: 1970,
            description: "A German anthology series following homicide detectives.",
            poster: "",
            featured: false
        },
        // --- Add more as needed ---
    ];

    // --- Utility: Get unique categories ---
    function getCategories() {
        const cats = new Set(CONTENT.map(item => item.category));
        return Array.from(cats);
    }

    // --- Utility: Get featured item ---
    function getFeatured() {
        return CONTENT.find(item => item.featured) || CONTENT[0];
    }

    // --- Utility: Get items by category ---
    function getByCategory(cat) {
        return CONTENT.filter(item => item.category === cat);
    }

    // --- Utility: Get item by ID ---
    function getById(id) {
        return CONTENT.find(item => item.id === id);
    }

    // --- Utility: Watch progress (localStorage) ---
    function getProgress(id) {
        return parseFloat(localStorage.getItem('progress_' + id)) || 0;
    }
    function setProgress(id, value) {
        localStorage.setItem('progress_' + id, value);
    }

    // --- Render Hero Section ---
    function renderHero() {
        const hero = document.getElementById('hero');
        const featured = getFeatured();
        hero.innerHTML = `
            <div class="hero-content">
                <div class="hero-title">${featured.title}</div>
                <div class="hero-meta">${featured.genre} • ${featured.year}</div>
                <div class="hero-desc">${featured.description}</div>
                <button class="hero-play-btn" tabindex="0" data-play-id="${featured.id}">▶ Play</button>
            </div>
        `;
    }

    // --- Render Categories & Grids ---
    function renderCategories() {
        const container = document.getElementById('content-categories');
        container.innerHTML = '';
        getCategories().forEach(cat => {
            const items = getByCategory(cat);
            const block = document.createElement('div');
            block.className = 'category-block';
            block.innerHTML = `
                <div class="category-title">${cat}</div>
                <div class="category-list" role="list">
                    ${items.map(item => `
                        <div class="movie-item" tabindex="0" data-movie-id="${item.id}" role="listitem">
                            <div class="movie-poster">${item.poster ? `<img src="${item.poster}" alt="${item.title} poster" style="width:100%;height:100%;object-fit:cover;border-radius:12px 12px 0 0;">` : '🎬'}</div>
                            <div class="movie-title">${item.title}</div>
                            <div class="movie-progress" style="width:${getProgress(item.id) * 100}%;display:${getProgress(item.id) > 0 ? 'block' : 'none'}"></div>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(block);
        });
    }

    // --- Focus Management ---
    function getFocusable() {
        return document.querySelectorAll('[tabindex="0"]');
    }
    let currentFocus = 0;
    function initializeFocus() {
        const focusable = getFocusable();
        if (focusable.length > 0) {
            focusable[0].focus();
            currentFocus = 0;
        }
    }

    // --- Navigation Logic (TV Remote) ---
    function setupNavigation() {
        document.addEventListener('keydown', function(event) {
            const focusable = Array.from(getFocusable());
            let handled = false;
            switch(event.key) {
                case 'ArrowLeft':
                    if (currentFocus > 0) {
                        currentFocus--;
                        focusable[currentFocus].focus();
                    }
                    handled = true;
                    break;
                case 'ArrowRight':
                    if (currentFocus < focusable.length - 1) {
                        currentFocus++;
                        focusable[currentFocus].focus();
                    }
                    handled = true;
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    // Try to move up/down by row in grid
                    // For simplicity, just move -4/+4 (assuming 4 per row)
                    const perRow = 4;
                    if (event.key === 'ArrowUp' && currentFocus - perRow >= 0) {
                        currentFocus -= perRow;
                        focusable[currentFocus].focus();
                        handled = true;
                    } else if (event.key === 'ArrowDown' && currentFocus + perRow < focusable.length) {
                        currentFocus += perRow;
                        focusable[currentFocus].focus();
                        handled = true;
                    }
                    break;
                case 'Enter':
                    focusable[currentFocus].click();
                    handled = true;
                    break;
                case 'Escape':
                    closePlayer();
                    handled = true;
                    break;
            }
            if (handled) event.preventDefault();
        });
    }

    // --- Event Delegation for Play/Select ---
    function setupEventDelegation() {
        document.body.addEventListener('click', function(e) {
            const playBtn = e.target.closest('[data-play-id]');
            if (playBtn) {
                playMovie(playBtn.getAttribute('data-play-id'));
                return;
            }
            const movieItem = e.target.closest('.movie-item');
            if (movieItem) {
                playMovie(movieItem.getAttribute('data-movie-id'));
                return;
            }
            const closeBtn = e.target.closest('#close-video');
            if (closeBtn) {
                closePlayer();
                return;
            }
        });
    }

    // --- Video Player Logic (VIDFAST embed) ---
    function playMovie(id) {
        const item = getById(id);
        if (!item) return;
        showLoading();
        setTimeout(() => {
            hideLoading();
            const videoContainer = document.getElementById('video-container');
            videoContainer.innerHTML = `<button class="close-button" id="close-video" tabindex="0" aria-label="Close player">✕ Close</button><iframe id="stream-iframe" src="https://vidfast.net/embed/${item.url}" allowfullscreen allow="autoplay; encrypted-media" style="width:90vw;height:60vh;max-width:1200px;max-height:80vh;border-radius:16px;background:#000;"></iframe>`;
            videoContainer.style.display = 'flex';
            document.getElementById('close-video').focus();
            // Track watch progress (simulate: set to 0.5 for demo)
            setProgress(id, 0.5); // In real use, update as user watches
            renderCategories(); // Update progress bars
        }, 1000);
    }
    function closePlayer() {
        const videoContainer = document.getElementById('video-container');
        videoContainer.style.display = 'none';
        videoContainer.innerHTML = '<button class="close-button" id="close-video" tabindex="0" aria-label="Close player">✕ Close</button>';
        initializeFocus();
    }

    // --- Loading Indicator ---
    function showLoading() {
        document.getElementById('loading').style.display = 'block';
    }
    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // --- Search Functionality ---
    function setupSearch() {
        document.getElementById('search-button').addEventListener('click', doSearch);
        document.getElementById('search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') doSearch();
        });
    }
    function doSearch() {
        const term = document.getElementById('search-input').value.trim().toLowerCase();
        if (!term) return;
        showLoading();
        setTimeout(() => {
            hideLoading();
            const results = CONTENT.filter(item => item.title.toLowerCase().includes(term) || item.genre.toLowerCase().includes(term) || item.description.toLowerCase().includes(term));
            if (results.length === 0) {
                alert('No results found.');
                return;
            }
            // Show results as a temporary category
            const container = document.getElementById('content-categories');
            container.innerHTML = `<div class="category-block"><div class="category-title">Search Results</div><div class="category-list">${results.map(item => `<div class=\"movie-item\" tabindex=\"0\" data-movie-id=\"${item.id}\" role=\"listitem\"><div class=\"movie-poster\">${item.poster ? `<img src=\"${item.poster}\" alt=\"${item.title} poster\" style=\"width:100%;height:100%;object-fit:cover;border-radius:12px 12px 0 0;\">` : '🎬'}</div><div class=\"movie-title\">${item.title}</div><div class=\"movie-progress\" style=\"width:${getProgress(item.id) * 100}%;display:${getProgress(item.id) > 0 ? 'block' : 'none'}\"></div></div>`).join('')}</div></div>`;
            initializeFocus();
        }, 700);
    }

    // --- TV Enhancements ---
    function addTVEnhancements() {
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'F1': case 'Red':
                    initializeFocus();
                    break;
                case 'F2': case 'Green':
                    // Focus first movie
                    const firstMovie = document.querySelector('.movie-item[tabindex="0"]');
                    if (firstMovie) firstMovie.focus();
                    break;
                case 'F3': case 'Yellow':
                    document.getElementById('search-input').focus();
                    break;
            }
        });
    }

    // --- Initialize All ---
    renderHero();
    renderCategories();
    initializeFocus();
    setupNavigation();
    setupEventDelegation();
    setupSearch();
    addTVEnhancements();
});
