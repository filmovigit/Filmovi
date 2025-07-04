// Enhanced TV Movies Interface Script
document.addEventListener('DOMContentLoaded', function() {
    let currentFocus = 0;
    const focusableElements = document.querySelectorAll('[tabindex="0"]');
    
    // Movie database with vidfast.net integration
    const movies = {
        1: { title: "Action Hero", url: "action-hero-2024", genre: "Action" },
        2: { title: "Adventure Quest", url: "adventure-quest-2024", genre: "Adventure" },
        3: { title: "Comedy Gold", url: "comedy-gold-2024", genre: "Comedy" },
        4: { title: "Drama Special", url: "drama-special-2024", genre: "Drama" },
        5: { title: "Thriller Night", url: "thriller-night-2024", genre: "Thriller" },
        6: { title: "Romance Story", url: "romance-story-2024", genre: "Romance" }
    };

    // Initialize focus management
    initializeFocus();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize focus on first element
    function initializeFocus() {
        if (focusableElements.length > 0) {
            focusableElements[currentFocus].focus();
            console.log('TV Interface initialized with', focusableElements.length, 'focusable elements');
        }
    }

    // Setup all event listeners
    function setupEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyNavigation);
        
        // Click handlers
        document.getElementById('search-button').addEventListener('click', performSearch);
        document.getElementById('close-video').addEventListener('click', closeVideo);
        
        // Search input enter key
        document.getElementById('search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Focus management for all focusable elements
        focusableElements.forEach((element, index) => {
            element.addEventListener('focus', () => {
                currentFocus = index;
                console.log('Focus changed to element', index);
            });
            
            // Add click handlers for movie items
            if (element.classList.contains('movie-item')) {
                element.addEventListener('click', function() {
                    const movieId = this.getAttribute('data-movie-id');
                    playMovie(movieId);
                });
            }
        });
    }

    // Enhanced keyboard navigation for TV remote
    function handleKeyNavigation(event) {
        const activeElement = document.activeElement;
        let handled = false;
        
        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                navigateLeft();
                handled = true;
                break;
                
            case 'ArrowRight':
                event.preventDefault();
                navigateRight();
                handled = true;
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                navigateUp();
                handled = true;
                break;
                
            case 'ArrowDown':
                event.preventDefault();
                navigateDown();
                handled = true;
                break;
                
            case 'Enter':
                event.preventDefault();
                handleEnterKey(activeElement);
                handled = true;
                break;
                
            case 'Escape':
                event.preventDefault();
                closeVideo();
                handled = true;
                break;
                
            case 'Backspace':
                event.preventDefault();
                goBack();
                handled = true;
                break;
        }
        
        if (handled) {
            // Update currentFocus based on actual focused element
            const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
            if (focusedIndex !== -1) {
                currentFocus = focusedIndex;
            }
        }
    }

    // Navigation functions
    function navigateLeft() {
        if (currentFocus > 0) {
            currentFocus--;
            focusableElements[currentFocus].focus();
        }
    }

    function navigateRight() {
        if (currentFocus < focusableElements.length - 1) {
            currentFocus++;
            focusableElements[currentFocus].focus();
        }
    }

    function navigateUp() {
        // Smart grid navigation - move up in the current section
        const currentElement = focusableElements[currentFocus];
        const currentSection = getCurrentSection(currentElement);
        
        if (currentSection === 'navbar') {
            // Stay in navbar
            return;
        } else if (currentSection === 'movies') {
            // Move to navbar
            currentFocus = 0;
            focusableElements[currentFocus].focus();
        } else if (currentSection === 'search') {
            // Move to movies section
            const movieElements = document.querySelectorAll('.movie-item[tabindex="0"]');
            if (movieElements.length > 0) {
                const movieIndex = Array.from(focusableElements).indexOf(movieElements[movieElements.length - 1]);
                if (movieIndex !== -1) {
                    currentFocus = movieIndex;
                    focusableElements[currentFocus].focus();
                }
            }
        }
    }

    function navigateDown() {
        const currentElement = focusableElements[currentFocus];
        const currentSection = getCurrentSection(currentElement);
        
        if (currentSection === 'navbar') {
            // Move to movies section
            const movieElements = document.querySelectorAll('.movie-item[tabindex="0"]');
            if (movieElements.length > 0) {
                const movieIndex = Array.from(focusableElements).indexOf(movieElements[0]);
                if (movieIndex !== -1) {
                    currentFocus = movieIndex;
                    focusableElements[currentFocus].focus();
                }
            }
        } else if (currentSection === 'movies') {
            // Move to search section
            const searchInput = document.getElementById('search-input');
            const searchIndex = Array.from(focusableElements).indexOf(searchInput);
            if (searchIndex !== -1) {
                currentFocus = searchIndex;
                focusableElements[currentFocus].focus();
            }
        }
        // If in search, stay in search
    }

    // Get current section of focused element
    function getCurrentSection(element) {
        if (element.closest('.navbar')) return 'navbar';
        if (element.closest('.content-categories')) return 'movies';
        if (element.closest('.search')) return 'search';
        return 'other';
    }

    // Handle Enter key press
    function handleEnterKey(element) {
        console.log('Enter pressed on:', element);
        
        if (element.classList.contains('movie-item')) {
            const movieId = element.getAttribute('data-movie-id');
            playMovie(movieId);
        } else if (element.id === 'search-button') {
            performSearch();
        } else if (element.id === 'close-video') {
            closeVideo();
        } else if (element.getAttribute('data-section')) {
            navigateToSection(element.getAttribute('data-section'));
        } else if (element.id === 'search-input') {
            performSearch();
        }
    }

    // Play movie using vidfast.net API
    function playMovie(movieId) {
        const movie = movies[movieId];
        if (!movie) {
            console.error('Movie not found:', movieId);
            return;
        }
        
        console.log('Playing movie:', movie.title);
        showLoading();
        
        // Construct vidfast.net stream URL
        const streamUrl = `https://vidfast.net/embed/${movie.url}`;
        
        // Simulate loading time
        setTimeout(() => {
            hideLoading();
            
            const videoContainer = document.getElementById('video-container');
            const videoPlayer = document.getElementById('video-player');
            
            // Hide default video player
            videoPlayer.style.display = 'none';
            
            // Create or update iframe for vidfast.net player
            let iframe = document.getElementById('stream-iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'stream-iframe';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.allowFullscreen = true;
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                videoContainer.appendChild(iframe);
            }
            
            // Set the stream URL
            iframe.src = streamUrl;
            
            // Show video container
            videoContainer.style.display = 'block';
            
            // Focus on close button for easy exit
            document.getElementById('close-video').focus();
            
            console.log('Movie player opened:', streamUrl);
        }, 1500);
    }

    // Enhanced search functionality
    function performSearch() {
        const searchTerm = document.getElementById('search-input').value.trim();
        if (!searchTerm) {
            alert('Please enter a search term');
            document.getElementById('search-input').focus();
            return;
        }
        
        console.log('Searching for:', searchTerm);
        showLoading();
        
        // Simulate search with vidfast.net API
        setTimeout(() => {
            hideLoading();
            
            // In a real implementation, you would make an API call to vidfast.net
            const searchResults = simulateSearch(searchTerm);
            
            if (searchResults.length > 0) {
                displaySearchResults(searchResults);
            } else {
                alert(`No results found for "${searchTerm}"\n\nTry searching for: Action, Comedy, Drama, Thriller, Romance`);
            }
        }, 1000);
    }

    // Simulate search results
    function simulateSearch(term) {
        const results = [];
        const lowerTerm = term.toLowerCase();
        
        Object.values(movies).forEach(movie => {
            if (movie.title.toLowerCase().includes(lowerTerm) || 
                movie.genre.toLowerCase().includes(lowerTerm)) {
                results.push(movie);
            }
        });
        
        return results;
    }

    // Display search results
    function displaySearchResults(results) {
        const resultsText = results.map(movie => `${movie.title} (${movie.genre})`).join('\n');
        alert(`Search Results:\n\n${resultsText}\n\nPress Enter on any movie to play it!`);
    }

    // Navigation between sections
    function navigateToSection(section) {
        console.log('Navigating to section:', section);
        
        const sections = {
            'home': () => {
                window.scrollTo(0, 0);
                focusableElements[0].focus();
            },
            'movies': () => {
                document.querySelector('.content-categories').scrollIntoView();
                const movieElements = document.querySelectorAll('.movie-item[tabindex="0"]');
                if (movieElements.length > 0) {
                    const movieIndex = Array.from(focusableElements).indexOf(movieElements[0]);
                    if (movieIndex !== -1) {
                        currentFocus = movieIndex;
                        focusableElements[currentFocus].focus();
                    }
                }
            },
            'series': () => {
                alert('Series section\n\nThis would integrate with vidfast.net TV series API');
            },
            'search': () => {
                document.querySelector('.search').scrollIntoView();
                document.getElementById('search-input').focus();
            }
        };
        
        if (sections[section]) {
            sections[section]();
        }
    }

    // Close video player
    function closeVideo() {
        console.log('Closing video player');
        
        const videoContainer = document.getElementById('video-container');
        const iframe = document.getElementById('stream-iframe');
        
        if (iframe) {
            iframe.src = '';
        }
        
        videoContainer.style.display = 'none';
        
        // Return focus to the previously focused element
        if (focusableElements[currentFocus] && !focusableElements[currentFocus].closest('.video-container')) {
            focusableElements[currentFocus].focus();
        } else {
            // Default to first movie item
            const movieElements = document.querySelectorAll('.movie-item[tabindex="0"]');
            if (movieElements.length > 0) {
                movieElements[0].focus();
            }
        }
    }

    // Go back function for TV remote back button
    function goBack() {
        const videoContainer = document.getElementById('video-container');
        if (videoContainer.style.display === 'block') {
            closeVideo();
        } else {
            // Navigate back to home
            navigateToSection('home');
        }
    }

    // Loading indicator functions
    function showLoading() {
        document.getElementById('loading').style.display = 'block';
        console.log('Loading...');
    }

    function hideLoading() {
        document.getElementById('loading').style.display = 'none';
        console.log('Loading complete');
    }

    // Add some TV-specific enhancements
    function addTVEnhancements() {
        // Disable context menu on right-click (common on TV browsers)
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        // Add support for TV remote color buttons (if available)
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'F1': // Red button
                case 'Red':
                    e.preventDefault();
                    navigateToSection('home');
                    break;
                case 'F2': // Green button  
                case 'Green':
                    e.preventDefault();
                    navigateToSection('movies');
                    break;
                case 'F3': // Yellow button
                case 'Yellow':
                    e.preventDefault();
                    navigateToSection('search');
                    break;
                case 'F4': // Blue button
                case 'Blue':
                    e.preventDefault();
                    performSearch();
                    break;
            }
        });
    }

    // Initialize TV enhancements
    addTVEnhancements();
    
    // Debug information
    console.log('TV Movies Interface loaded successfully');
    console.log('Movies available:', Object.keys(movies).length);
    console.log('Focusable elements:', focusableElements.length);
});