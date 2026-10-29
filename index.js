// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    highlightActiveLink();
    initScrollAnimations();
    initBackToTop();
    initNowPlaying();
});



// Ambient ASCII stream (drifting code characters)
function initAsciiStream() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const chars = '01{}[]<>/\\!@#$%^&*()_+-=;:,.~`|';
    const streamCount = 20;
    const streams = [];

    function createStream() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: 1.5 + Math.random() * 3.5,
            chars: Array(8 + Math.floor(Math.random() * 15)).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]),
            opacity: 0.1 + Math.random() * 0.15
        };
    }

    for (let i = 0; i < streamCount; i++) {
        streams.push(createStream());
    }

    function drawAscii() {
        const isLightMode = document.body.classList.contains('light-mode');
        ctx.font = '16px monospace';

        streams.forEach(stream => {
            // Navy Blue for light mode, Light Blue for dark mode
            ctx.fillStyle = isLightMode ?
                `rgba(15, 23, 42, ${stream.opacity + 0.15})` : 
                `rgba(56, 189, 248, ${stream.opacity})`;

            stream.chars.forEach((char, i) => {
                ctx.fillText(char, stream.x, stream.y + (i * 20));
            });

            stream.y += stream.speed;

            if (stream.y > canvas.height) {
                stream.y = -350;
                stream.x = Math.random() * canvas.width;
            }
        });
    }

    window.drawAsciiStreams = drawAscii;
}

// Full-screen background wave
function initBackgroundWave() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let offset = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (window.drawAsciiStreams) {
            window.drawAsciiStreams();
        }

        const isLightMode = document.body.classList.contains('light-mode');
        // Darker Navy for light mode, Light Blue for dark mode
        ctx.strokeStyle = isLightMode ? 'rgba(15, 23, 42, 0.2)' : 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 2;

        for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            ctx.strokeStyle = isLightMode ?
                `rgba(30, 41, 59, ${0.15 - j * 0.04})` : 
                `rgba(56, 189, 248, ${0.15 - j * 0.04})`;

            for (let x = 0; x < canvas.width; x += 20) {
                const freq = 0.002 + (j * 0.001);
                const amp = 80 + (j * 30);
                const y = (canvas.height / 1.5) + Math.sin(x * freq + offset + (j * 2)) * amp;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        offset += 0.02;
    }

    let lastTime = 0;
    const fpsInterval = 1000 / 24;

    function animate(time) {
        requestAnimationFrame(animate);
        const elapsed = time - lastTime;
        if (elapsed > fpsInterval) {
            lastTime = time - (elapsed % fpsInterval);
            draw();
        }
    }

    requestAnimationFrame(animate);
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeIcon('light');
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    const theme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    }
}

// Mobile Menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Active Link Highlighting
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html')) {
            link.classList.add('nav-active');
        } else {
            link.classList.remove('nav-active');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Back to Top Button
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (btn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Easter Egg
function shakeScreen() {
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 300);
}

// ==========================================================================
// Project Metadata & Modal
// ==========================================================================
const projectData = {}; // Keeping empty object in case anything else tries to access it, though it shouldn't be needed

function openProjectModal(id) {
    const projectCard = document.querySelector(`.project-row-card[onclick="openProjectModal('${id}')"]`);
    if (!projectCard) return;

    const overlay = document.getElementById('project-modal');
    const content = document.getElementById('modal-content-area');
    if (!overlay || !content) return;

    const staticData = projectCard.querySelector('.static-modal-data');
    if (!staticData) return;

    content.innerHTML = staticData.innerHTML;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const overlay = document.getElementById('project-modal');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('project-modal');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeProjectModal();
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
});

// Spotify/Last.fm Integration
function initNowPlaying() {
    const art = document.getElementById('now-playing-art');
    const status = document.getElementById('now-playing-status');
    const trackEl = document.getElementById('now-playing-track');
    const artistEl = document.getElementById('now-playing-artist');
    const bars = document.getElementById('now-playing-bars');

    if (!art || !status || !trackEl || !artistEl || !bars) return;

    const API_KEY = 'be34b1efeedb4fec0652c42af73ab3c2';
    const USERNAME = 'zbakhchi';
    const URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;

    async function updateWidget() {
        try {
            const res = await fetch(URL);
            if (!res.ok) throw new Error('Last.fm API request failed');
            
            const data = await res.json();
            const trackList = data.recenttracks?.track;
            
            if (!trackList || trackList.length === 0 || (Array.isArray(trackList) && trackList.length === 0)) {
                status.textContent = 'Offline';
                status.className = '';
                trackEl.textContent = 'Not listening';
                artistEl.textContent = 'Spotify';
                art.style.opacity = '0';
                bars.className = 'bars-idle';
                return;
            }

            // In some cases, Last.fm returns a single object instead of an array if there is only 1 scrobble,
            // but standard response structure for recenttracks is an array. Let's handle both.
            const track = Array.isArray(trackList) ? trackList[0] : trackList;
            if (!track) {
                status.textContent = 'Offline';
                status.className = '';
                trackEl.textContent = 'Not listening';
                artistEl.textContent = 'Spotify';
                art.style.opacity = '0';
                bars.className = 'bars-idle';
                return;
            }

            const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

            // Extract album artwork URL
            let artUrl = '';
            if (track.image && Array.isArray(track.image)) {
                // Last.fm yields multiple image sizes: small, medium, large, extralarge
                const largeImg = track.image.find(img => img.size === 'large' || img.size === 'extralarge');
                if (largeImg && largeImg['#text']) {
                    artUrl = largeImg['#text'];
                }
            }

            // Update UI elements
            if (artUrl) {
                art.src = artUrl;
                art.style.opacity = '1';
            } else {
                art.style.opacity = '0';
            }
            
            trackEl.textContent = track.name || 'Unknown Track';
            artistEl.textContent = track.artist?.['#text'] || 'Unknown Artist';

            if (isPlaying) {
                status.textContent = 'Now Playing';
                status.className = 'status-active';
                bars.className = 'bars-active';
            } else {
                status.textContent = 'Recently Played';
                status.className = '';
                bars.className = 'bars-idle';
            }
        } catch (err) {
            console.error('Error fetching Last.fm status:', err);
            status.textContent = 'Offline';
            status.className = '';
            trackEl.textContent = 'Unable to load status';
            artistEl.textContent = '';
            art.style.opacity = '0';
            bars.className = 'bars-idle';
        }
    }

    // Call immediately and schedule updates every 30 seconds
    updateWidget();
    setInterval(updateWidget, 30000);
}

