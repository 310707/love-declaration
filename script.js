// ============================================
// FLOATING HEARTS ANIMATION
// ============================================
function createHearts() {
    const container = document.querySelector('.floating-hearts');
    const heartCount = window.innerWidth < 768 ? 5 : 10;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        
        const leftPosition = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 3 + 3;
        const size = Math.random() * 20 + 20;

        heart.style.left = leftPosition + '%';
        heart.style.animation = `heartFall ${duration}s linear ${delay}s infinite, heartFloat 3s ease-in-out infinite`;
        heart.style.fontSize = size + 'px';

        container.appendChild(heart);
    }
}

// Recreate hearts when window is resized
window.addEventListener('resize', () => {
    document.querySelector('.floating-hearts').innerHTML = '';
    createHearts();
});

// Initial heart creation
document.addEventListener('DOMContentLoaded', createHearts);

// ============================================
// SMOOTH SCROLL TO SECTION
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// MUSIC PLAYER FUNCTIONALITY
// ============================================
let isPlaying = false;
const audio = document.getElementById('bgMusic');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const volumeSlider = document.getElementById('volumeSlider');

// Toggle music play/pause
function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<span class="play-icon">▶</span>';
        playBtn.classList.remove('playing');
        isPlaying = false;
    } else {
        audio.play().catch(() => {
            // Fallback jika URL tidak valid
            playDemoAudio();
        });
        playBtn.innerHTML = '<span class="play-icon">⏸</span>';
        playBtn.classList.add('playing');
        isPlaying = true;
    }
}

// Change volume
function changeVolume(value) {
    audio.volume = value / 100;
}

// Update progress bar
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = progressPercent + '%';
    }
});

// Reset when song ends
audio.addEventListener('ended', () => {
    playBtn.innerHTML = '<span class="play-icon">▶</span>';
    playBtn.classList.remove('playing');
    isPlaying = false;
});

// Click on progress bar to seek
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    if (audio.src && !audio.src.includes('bunga-abadi')) {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    }
});

// ============================================
// DEMO AUDIO FUNCTION (untuk testing)
// ============================================
function playDemoAudio() {
    // Ini adalah fungsi demo yang memberikan feedback visual
    playBtn.innerHTML = '<span class="play-icon">⏸</span>';
    playBtn.classList.add('playing');
    isPlaying = true;

    // Simulasi progress bar movement
    let fakeTime = 0;
    const fakeInterval = setInterval(() => {
        fakeTime += 0.1;
        progress.style.width = (fakeTime % 100) + '%';
        
        if (!isPlaying) {
            clearInterval(fakeInterval);
            progress.style.width = '0%';
        }
    }, 100);

    // Auto stop after 30 seconds
    setTimeout(() => {
        if (isPlaying) {
            toggleMusic();
        }
    }, 30000);
}

// ============================================
// PHOTO UPLOAD FUNCTIONALITY
// ============================================
document.querySelectorAll('.photo-placeholder').forEach((placeholder) => {
    placeholder.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.style.backgroundImage = `url('${event.target.result}')`;
                    this.style.backgroundSize = 'cover';
                    this.style.backgroundPosition = 'center';
                    this.innerHTML = '';
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    });
});

// ============================================
// ADD MORE HEARTS ON CLICK
// ============================================
document.addEventListener('click', (e) => {
    // Jangan buat hearts untuk button clicks
    if (e.target.tagName !== 'BUTTON') {
        createClickHearts(e.clientX, e.clientY);
    }
});

function createClickHearts(x, y) {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        
        const angle = (Math.PI * 2 * i) / 5;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 2;

        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '20px';
        heart.style.position = 'fixed';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '999';

        document.body.appendChild(heart);

        let posX = x;
        let posY = y;
        let velocityY = vy;

        const animate = () => {
            posX += vx;
            posY += velocityY;
            velocityY += 0.1; // gravity

            heart.style.left = posX + 'px';
            heart.style.top = posY + 'px';
            heart.style.opacity = Math.max(0, 1 - (velocityY + 2) / 10);

            if (posY < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                heart.remove();
            }
        };

        animate();
    }
}

// ============================================
// PARALLAX EFFECT (Optional - for desktop)
// ============================================
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section');
        
        parallaxElements.forEach((element, index) => {
            if (index % 2 === 0) {
                element.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
            }
        });
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Spacebar untuk play/pause musik
    if (e.code === 'Space') {
        e.preventDefault();
        toggleMusic();
    }
    
    // Arrow keys untuk navigate sections
    if (e.key === 'ArrowDown') {
        const current = document.querySelector('.section:in-viewport');
        const next = current?.nextElementSibling;
        if (next) {
            next.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    if (e.key === 'ArrowUp') {
        const current = document.querySelector('.section:in-viewport');
        const prev = current?.previousElementSibling;
        if (prev) {
            prev.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ============================================
// COPY MESSAGE TO CLIPBOARD
// ============================================
document.querySelector('.love-message')?.addEventListener('dblclick', () => {
    const text = document.querySelector('.love-message').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Pesan sayang telah disalin! 💕');
    });
});

// ============================================
// RESPONSIVE HEARTS ADJUSTMENT
// ============================================
window.addEventListener('load', () => {
    if (window.innerWidth < 768) {
        // Reduce animations on mobile for better performance
        document.querySelectorAll('.heart').forEach(heart => {
            heart.style.animationDuration = '6s';
        });
    }
});

// ============================================
// CONFETTI EFFECT ON SPECIAL ACTIONS
// ============================================
function createConfetti() {
    const colors = ['❤️', '💕', '💖', '💗', '💘'];
    const confettiCount = 30;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.innerHTML = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-50px';
        confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '999';
        confetti.style.animation = `heartFall ${Math.random() * 2 + 2}s linear forwards`;

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2000);
    }
}

// Trigger confetti pada scroll ke message section
let messageShown = false;
window.addEventListener('scroll', () => {
    const messageSection = document.querySelector('.message-section');
    if (messageSection && !messageShown) {
        const rect = messageSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.7) {
            createConfetti();
            messageShown = true;
        }
    }
});

// ============================================
// ADD TEXT CUSTOMIZATION (Optional)
// ============================================
// Uncomment untuk enable editing text
/*
document.querySelectorAll('.declaration-text p, .love-message p').forEach(element => {
    element.addEventListener('click', function() {
        const originalText = this.innerText;
        const newText = prompt('Edit teks:', originalText);
        if (newText) {
            this.innerText = newText;
        }
    });
});
*/

// ============================================
// PAGE VISIBILITY - PAUSE MUSIC WHEN TAB HIDDEN
// ============================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<span class="play-icon">▶</span>';
        playBtn.classList.remove('playing');
    }
});

// ============================================
// AUTOPLAY MUSIC - FIRST USER INTERACTION
// ============================================
let musicStarted = false;

function autoPlayMusic() {
    if (!musicStarted && audio.src) {
        audio.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = '<span class="play-icon">⏸</span>';
            playBtn.classList.add('playing');
            musicStarted = true;
        }).catch(() => {
            console.log('Autoplay musik tidak didukung browser');
        });
        // Hapus listener setelah pertama kali dijalankan
        document.removeEventListener('click', autoPlayMusic);
        document.removeEventListener('touchstart', autoPlayMusic);
    }
}

// Trigger autoplay on first user interaction
document.addEventListener('click', autoPlayMusic, { once: true });
document.addEventListener('touchstart', autoPlayMusic, { once: true });

console.log('💕 Love Declaration website loaded successfully! 💕');
