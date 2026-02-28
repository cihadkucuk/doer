// Function to show main content (Home, Products, About)
function showContent(contentId) {
    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });
    // Hide all category pages
    document.querySelectorAll('.category-page').forEach(page => {
        page.style.display = 'none';
    });
    // Show selected content
    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

// Function to show category page
function showCategory(category) {
    const pages = ['originals', 'scenes', 'advertisements'];
    pages.forEach(page => {
        document.getElementById(page + '-page').style.display = (page === category) ? 'block' : 'none';
    });
    // Hide all content sections
    document.querySelectorAll('.content').forEach(content => {
        content.classList.remove('active');
    });
    closeDropdown();
}

function closeDropdown() {
    document.getElementById('categoriesDropdown').classList.remove('open');
}

// Dropdown open/close on click/hover
function setupDropdown() {
    const dropdown = document.getElementById('categoriesDropdown');
    const toggle = dropdown.querySelector('.dropdown-toggle');
    toggle.onclick = function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    };
    dropdown.onmouseenter = function() {
        dropdown.classList.add('open');
    };
    dropdown.onmouseleave = function() {
        dropdown.classList.remove('open');
    };
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

// Function to return to Products page
function showProducts() {
    const pages = ['originals', 'scenes', 'advertisements'];
    pages.forEach(page => {
        document.getElementById(page + '-page').style.display = 'none';
    });
    document.getElementById('products').style.display = 'block';
}

// Video Modal Functions
function createVideoPlayer(videoId) {
    const iframe = document.createElement('iframe');
    iframe.id = 'videoPlayer';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    return iframe;
}

function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const container = document.getElementById('videoContainer');
    
    if (!modal || !container || !videoId) return;

    // Container'ı temizle
    container.innerHTML = '';
    
    // Yeni iframe oluştur
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    
    // iframe'i ekle
    container.appendChild(iframe);
    
    // Modal'ı göster
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Arka plan müziğini durdur
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const container = document.getElementById('videoContainer');
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (container) {
        // Videoyu durdur ve iframe'i temizle
        container.innerHTML = '';
    }
    
    document.body.style.overflow = 'auto';
}

// Music Control Functions
let isMusicPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    
    if (isMusicPlaying) {
        audio.pause();
        musicControl.classList.remove('playing');
    } else {
        audio.play();
        musicControl.classList.add('playing');
    }
    
    isMusicPlaying = !isMusicPlaying;
}

// Music Modal Functions
function openMusicModal(trackUrl) {
    const modal = document.getElementById('musicModal');
    const musicPlayer = document.getElementById('musicPlayer');
    
    // Convert SoundCloud URL to embed URL
    let embedUrl = trackUrl;
    if (trackUrl.includes('soundcloud.com')) {
        // For the specific track URL: https://soundcloud.com/user-692631946/orca
        // We know the track ID is 2121573336 from the WordPress embed code
        let trackId;
        
        if (trackUrl.includes('user-692631946/orca')) {
            trackId = '2121573336'; // Known track ID for ORCA
        } else {
            // For other tracks, try to extract from URL
            trackId = trackUrl.split('/').pop().split('?')[0];
        }
        
        // Create embed URL with the track ID
        embedUrl = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${trackId}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
    }
    
    // Set the music source
    musicPlayer.src = embedUrl;
    
    // Show the modal
    modal.classList.add('active');
    
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';

    // Pause background music if it's playing
    if (isMusicPlaying) {
        const audio = document.getElementById('background-music');
        audio.pause();
        document.getElementById('music-control').classList.remove('playing');
    }
}

function closeMusicModal() {
    const modal = document.getElementById('musicModal');
    const musicPlayer = document.getElementById('musicPlayer');
    
    // Hide the modal
    modal.classList.remove('active');
    
    // Stop the music
    musicPlayer.src = '';
    
    // Re-enable scrolling
    document.body.style.overflow = '';

    // Resume background music if it was playing
    if (isMusicPlaying) {
        const audio = document.getElementById('background-music');
        audio.play();
        document.getElementById('music-control').classList.add('playing');
    }
}

function initializeVideoPlayers() {
    // Video thumbnail'larına click event listener ekle
    document.querySelectorAll('.video-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', handleVideoClick);
    });
}

function handleVideoClick(event) {
    event.preventDefault();
    const thumbnail = event.currentTarget;
    const videoId = thumbnail.getAttribute('data-video-id');
    
    if (videoId) {
        openVideoModal(videoId);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show home page by default
    showContent('home');
    setupDropdown();

    // Audio handling
    const audio = document.getElementById('background-music');
    audio.volume = 0.5; // Set volume to 50%
    
    // Start playing music automatically
    audio.play().then(() => {
        isMusicPlaying = true;
        document.getElementById('music-control').classList.add('playing');
    }).catch(error => {
        console.log('Auto-play failed:', error);
        // If auto-play fails, try to play on first user interaction
        function playAudio() {
            if (!isMusicPlaying) {
                toggleMusic();
            }
        }
        document.addEventListener('click', playAudio, { once: true });
        document.addEventListener('keydown', playAudio, { once: true });
        document.addEventListener('touchstart', playAudio, { once: true });
    });

    
    // Video thumbnail ve play button click handler'ları güncelleme
    document.querySelectorAll('.video-thumbnail, .play-overlay, .play-icon').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Video ID'sini bul
            let videoRef = this.getAttribute('data-video-id');
            
            // Eğer tıklanan element play overlay veya icon ise, parent video thumbnail'dan ID'yi al
            if (!videoRef) {
                const videoThumbnail = this.closest('.video-thumbnail');
                if (videoThumbnail) {
                    videoRef = videoThumbnail.getAttribute('data-video-id');
                }
            }

            if (videoRef) {
                openVideoModal(videoRef);
            } else {
                console.error('Video ID bulunamadı:', this);
            }
        });
    });

    // Add click handlers for music thumbnails
    document.querySelectorAll('.music-thumbnail').forEach(thumbnail => {
        thumbnail.onclick = function(e) {
            e.preventDefault();
            const trackUrl = this.getAttribute('data-track-url');
            if (trackUrl) {
                openMusicModal(trackUrl);
            }
        };
    });

    initializeVideoPlayers();
    
    // Modal dışına tıklandığında kapat
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }
});

// Sayfa yüklendiğinde ve yenilendiğinde modal'ı sıfırla
document.addEventListener('DOMContentLoaded', () => {
    closeVideoModal();
    
    // Modal dışına tıklandığında kapat
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeVideoModal();
            }
        });
    }
    
    // Sayfa kapatılırken veya yenilenirken modal'ı temizle
    window.addEventListener('beforeunload', () => {
        closeVideoModal();
    });
});