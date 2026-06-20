// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    highlightActiveLink();
    initScrollAnimations();
    initBackToTop();
    initAsciiStream();
    initBackgroundWave();
});


// Ambient ASCII stream (drifting code characters)
function initAsciiStream() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const chars = '01{}[]<>/\\!@#$%^&*()_+-=;:,.~`|';
    const streamCount = 50;
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

            for (let x = 0; x < canvas.width; x += 5) {
                const freq = 0.002 + (j * 0.001);
                const amp = 80 + (j * 30);
                const y = (canvas.height / 1.5) + Math.sin(x * freq + offset + (j * 2)) * amp;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        offset += 0.01;
        requestAnimationFrame(draw);
    }

    draw();
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
const projectData = {
    cooperlink: {
        title: "CooperLink",
        date: "May 2026",
        description: "Fullstack web app connecting Cooper Union students with alumni mentors and career opportunities. Built Spring Boot backend with PostgreSQL and React frontend with Firebase authentication. Containerized with Docker Compose and deployed on Azure. Collaborated with the Cooper Union Alumni Association to refine platform requirements and deployment goals.",
        tags: ["Java", "React", "Azure"],
        media: "",
        link: null
    },
    mri: {
        title: "MRI Compressed Sensing Reconstruction",
        date: "May 2026",
        description: "Developed an MRI reconstruction pipeline using compressed sensing and wavelet-domain sparsity techniques. Implemented Fourier analysis, multilevel wavelet decompositions across different wavelet bases. Built an iterative gradient descent reconstruction algorithm with random undersampling to simulate MRI scans and evaluate reconstruction error.",
        tags: ["MATLAB", "Image Processing"],
        media: ["assets/mri.png"],
        link: { url: "assets/Medical_Imaging_3.pdf", text: "View Full Report (PDF)", icon: "fas fa-file-pdf" }
    },
    video2ascii: {
        title: "Real-Time ASCII Video Renderer (Video2ASCII)",
        date: "December 2025",
        description: "Built a configurable ASCII rendering engine that converts images, videos, and live webcam input into grayscale or true-color ASCII output in real time. Implemented configurable rendering options for color modes, resolution scaling, and multiple input sources.",
        tags: ["Python", "OpenCV"],
        media: "",
        link: { url: "https://github.com/bakhchi/Video2ASCII", text: "View GitHub Repo", icon: "fab fa-github" }
    },
    fifo: {
        title: "FIFO Library",
        date: "November 2025",
        description: "A simple FIFO library implemented in C. Built off of semaphore structures that are built off of primitive spin locks. The program is meant to solve the problem of concurrent access to shared data structures in a multi-threaded environment, dealing with multiple readers and writers.",
        tags: ["C", "Linux"],
        media: "",
        link: { url: "https://github.com/bakhchi/FIFO-Library", text: "View GitHub Repo", icon: "fab fa-github" }
    },
    shell: {
        title: "Homemade Linux Shell",
        date: "October 2025",
        description: "Minimal Unix-like shell supporting command parsing, pipelines, I/O redirection, background jobs, and basic scripting. Makes use of the basic system calls. Made for my operating systems class at Cooper Union.",
        tags: ["C", "Linux"],
        media: "",
        link: { url: "https://github.com/bakhchi/MyShell", text: "View GitHub Repo", icon: "fab fa-github" }
    },
    mosfet: {
        title: "MOSFET Amplifier",
        date: "May 2025",
        description: "Designed and built a MOSFET amplifier in industry-grade software. Simulated performance, and met all specs.",
        tags: ["Electrical Engineering"],
        media: "",
        link: { url: "assets/amplifier.pdf", text: "View Full Report (PDF)", icon: "fas fa-file-pdf" }
    },
    asktcb: {
        title: "AI-Chatbot for The Conference Board (AskTCB)",
        date: "April 2025",
        description: "Developed an AI-powered enterprise chatbot for The Conference Board using Azure OpenAI and retrieval-augmented generation (RAG) pipeline. Integrated Azure AI Search, Bing Search APIs, and automated email support workflows into the chatbot platform. Regularly discussed and presented proof of concept to CTO and other relevant stakeholders.",
        tags: ["Python", "NodeJS", "Azure"],
        media: "",
        link: { url: "https://www.conference-board.org/us", text: "Visit AskTCB Site", icon: "fas fa-external-link-alt" }
    },
    portscanner: {
        title: "Multi-Threaded Port Scanner",
        date: "February 2025",
        description: "A project made for Communication Networks, a class at Cooper Union. Project requirements included scans based on an input file, outputting results to a file, and having the options to specify hosts and ports to scan. Threading was implemented to make the program run scans in parallel and was able to increase overall speed of the program. The program utilizes socket, threading, and argparse libraries from Python.",
        tags: ["Python"],
        media: "",
        link: { url: "https://github.com/bakhchi/SimplePortScanner", text: "View GitHub Repo", icon: "fab fa-github" }
    },
    physics: {
        title: "Physics with Python",
        date: "December 2024",
        description: "This experiment, part of Intro to Physics Lab at Cooper Union, used Python to create basic plots demonstrating wave interference and diffraction, phenomena first explored by Thomas Young. Simulations, created with Python's matplotlib and numpy libraries, provided a clearer visualization of his findings.",
        tags: ["Python"],
        media: ["assets/Young Simulation.png", "assets/Young Simulation2.png"],
        link: { url: "https://colab.research.google.com/drive/14mXbHAESHEIYYbYnd5RwzLsJKyd0RtdK?usp=sharing", text: "Open Google Colab", icon: "fas fa-code" }
    },
    theremin: {
        title: "Theremin",
        date: "December 2024",
        description: "Sophomore Electrical Engineering Projects included reverse engineering and building a Theremin, a musical instrument that produces notes based on proximity to an antenna. Over the semester, components were assembled on breadboards, culminating in a functional Theremin for hands-on demonstration.",
        tags: ["Electrical Engineering"],
        media: "assets/theremin.jpg",
        link: null
    },
    games: {
        title: "Game Portfolio",
        date: "May 2024",
        description: "Made games in Programming for Electrical Engineers, a basic computer science class at Cooper Union. Developed SOS, a game like Tic Tac Toe but with a greater degree of difficulty, programmed in C. Created Uno, the popular card game where friendships are destroyed, programmed in Python. Designed Wheel of Fortune, the well-known TV game show, programmed in Python.",
        tags: ["C", "Python", "Git"],
        media: "",
        link: null
    },
    network: {
        title: "Network Diagram",
        date: "July 2023",
        description: "Compiled documentation of network infrastructure at one of Ana's mid-sized clients. Learned how each part of the client's environment interacted with the others. Utilized the diagram as a map whenever there is any potential internet outage.",
        tags: ["Microsoft Visio"],
        media: "assets/networkdiagram.png",
        link: null
    }
};

function openProjectModal(id) {
    const project = projectData[id];
    if (!project) return;

    const overlay = document.getElementById('project-modal');
    const content = document.getElementById('modal-content-area');
    if (!overlay || !content) return;

    let mediaHtml = '';
    if (project.media) {
        const mediaList = Array.isArray(project.media) ? project.media : [project.media];
        if (mediaList.length > 0 && mediaList[0] !== '') {
            mediaHtml = `
                <div class="modal-media-container">
                    ${mediaList.map(imgSrc => `
                        <div class="modal-media">
                            <img src="${imgSrc}" alt="${project.title}">
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    let footerHtml = '';
    if (project.link || (project.tags && project.tags.length > 0)) {
        const tagsHtml = project.tags && project.tags.length > 0
            ? `<div class="modal-tags">${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>`
            : '';
        const linkHtml = project.link
            ? `<a href="${project.link.url}" target="_blank" class="modal-link"><i class="${project.link.icon}"></i> ${project.link.text}</a>`
            : '';
        footerHtml = `<div class="modal-footer">${tagsHtml}${linkHtml}</div>`;
    }

    content.innerHTML = `
        <div class="modal-header">
            <h2>${project.title}</h2>
            <div class="modal-meta">${project.date}</div>
        </div>
        <div class="modal-body">
            <p>${project.description}</p>
            ${mediaHtml}
        </div>
        ${footerHtml}
    `;

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
