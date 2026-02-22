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
    async function exportDeklarasi() {
        // Kumpulkan semua data foto
        const deklarasiFotos = {};
        let hasPhoto = false;
        for (let i = 0; i < 4; i++) {
            const foto = getPhoto(i);
            if (foto) {
                deklarasiFotos[i] = foto;
                hasPhoto = true;
            }
        }

        if (!hasPhoto) {
            alert('⚠️ Tidak ada foto yang tersimpan. Tambahkan foto terlebih dahulu!');
            return;
        }

        // Ambil CSS untuk embed (fallback kosong jika gagal)
        let cssText = '';
        try {
            const resp = await fetch('style.css');
            if (resp.ok) cssText = await resp.text();
        } catch (e) {
            console.warn('Tidak dapat mengambil style.css untuk embed:', e);
        }

        // Coba embed audio sebagai data URL jika memungkinkan
        let audioDataUrl = '';
        try {
            if (audio && audio.src) {
                const resp = await fetch(audio.src);
                if (resp.ok) {
                    const blob = await resp.blob();
                    const reader = new FileReader();
                    audioDataUrl = await new Promise((resolve) => {
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                }
            }
        } catch (e) {
            console.warn('Gagal embed audio:', e);
            audioDataUrl = audio ? audio.src : '';
        }

        // Buat HTML yang self-contained (embed CSS + script untuk me-load foto)
        const htmlContent = `<!DOCTYPE html>\n<html lang="id">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Pernyataan Cinta Untukmu ❤️</title>\n    <style>${cssText}</style>\n    <script>\n        // Embedded photos data\n        const DEKLARASI_PHOTOS = ${JSON.stringify(deklarasiFotos)};\n        const EMBEDDED_AUDIO = ${JSON.stringify(audioDataUrl)};\n\n        window.addEventListener('DOMContentLoaded', () => {\n            // Set photos langsung ke placeholder (jika ada)\n            try {\n                Object.keys(DEKLARASI_PHOTOS).forEach(key => {\n                    const index = parseInt(key);\n                    const photoData = DEKLARASI_PHOTOS[key];\n                    // simpan ke localStorage juga untuk konsistensi\n                    try { localStorage.setItem('loveDeclaration_photo_' + index, photoData); } catch(e){}\n                    const placeholder = document.querySelectorAll('.photo-placeholder')[index];\n                    if (placeholder) {\n                        placeholder.style.backgroundImage = 'url("' + photoData + '")';\n                        placeholder.style.backgroundSize = 'cover';\n                        placeholder.style.backgroundPosition = 'center';\n                        placeholder.innerHTML = '';\n                    }\n                });\n            } catch (e) { console.warn('Error restore photos:', e); }\n\n            // Set audio src jika embedded\n            try {\n                if (EMBEDDED_AUDIO) {\n                    const audioEl = document.getElementById('bgMusic');\n                    if (audioEl) {\n                        audioEl.src = EMBEDDED_AUDIO;\n                        // Try to play muted then unmute after user interaction\n                        audioEl.muted = true;\n                        audioEl.play().then(() => {\n                            setTimeout(() => { audioEl.muted = false; }, 800);\n                        }).catch(() => {\n                            // ignore\n                        });\n                    }\n                }\n            } catch (e) { console.warn('Error set audio:', e); }\n        });\n    </script>\n</head>\n<body>\n    ${getCurrentPageHTML()}\n</body>\n</html>`;

        // Download file
        const link = document.createElement('a');
        link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
        link.download = 'Deklarasi-Cinta-' + new Date().getTime() + '.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('✅ Deklarasi berhasil di-unduh! File include semua foto dan (jika memungkinkan) audio embedded.');
    }
            audio.muted = false;
            console.log('🔊 Volume slider clicked - unmuting');
        }
    });
}

// Setup play button click
if (playBtn) {
    playBtn.addEventListener('click', () => {
        console.log('🎵 Play button clicked');
    });
}

// Toggle music play/pause
function toggleMusic() {
    if (!audio) {
        console.error('❌ Audio element not found');
        return;
    }
    
    try {
        if (isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<span class="play-icon">▶</span>';
            playBtn.classList.remove('playing');
            isPlaying = false;
            console.log('⏸️ Music paused');
        } else {
            // Pastikan tidak muted dan volume ada
            audio.muted = false;
            audio.volume = 0.7;
            
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    playBtn.innerHTML = '<span class="play-icon">⏸</span>';
                    playBtn.classList.add('playing');
                    isPlaying = true;
                    console.log('▶️ Music playing');
                }).catch((error) => {
                    console.log('❌ Play error:', error.message);
                    playDemoAudio();
                });
            } else {
                // Older browser yang tidak support Promise
                playBtn.innerHTML = '<span class="play-icon">⏸</span>';
                playBtn.classList.add('playing');
                isPlaying = true;
            }
        }
    } catch (error) {
        console.error('❌ Error in toggleMusic:', error);
    }
}

// Change volume
function changeVolume(value) {
    if (!audio) return;
    
    // Force unmute saat volume diubah
    audio.muted = false;
    audio.volume = value / 100;
    
    // Jika volume > 0 dan audio sedang paused, coba play
    if (value > 0 && audio.paused && !isPlaying) {
        console.log('🎵 Volume changed to:', Math.round(value) + '% - attempting to play');
        audio.play().catch(err => console.log('Auto-play failed:', err));
    } else {
        console.log('🔊 Volume changed to:', Math.round(value) + '%');
    }
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
// PHOTO UPLOAD & STORAGE FUNCTIONALITY
// ============================================

// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        console.warn('⚠️ localStorage tidak tersedia');
        return false;
    }
}

// Store photos in memory jika localStorage tidak available
let photoStorage = {};
const useLocalStorage = isLocalStorageAvailable();

function getPhoto(index) {
    const key = `loveDeclaration_photo_${index}`;
    if (useLocalStorage) {
        return localStorage.getItem(key);
    } else {
        return photoStorage[key];
    }
}

function setPhoto(index, data) {
    const key = `loveDeclaration_photo_${index}`;
    try {
        if (useLocalStorage) {
            localStorage.setItem(key, data);
        } else {
            photoStorage[key] = data;
        }
        return true;
    } catch(e) {
        console.error('Error saving photo:', e);
        alert('Gagal menyimpan foto. Ukuran foto terlalu besar atau storage penuh.');
        return false;
    }
}

function removePhoto(index) {
    const key = `loveDeclaration_photo_${index}`;
    if (useLocalStorage) {
        localStorage.removeItem(key);
    } else {
        delete photoStorage[key];
    }
}

// Initialize dan setup photos
function initializePhotos() {
    const placeholders = document.querySelectorAll('.photo-placeholder');
    
    placeholders.forEach((placeholder, index) => {
        const savedPhoto = getPhoto(index);
        
        if (savedPhoto) {
            // Jika ada foto tersimpan, tampilkan
            placeholder.style.backgroundImage = `url('${savedPhoto}')`;
            placeholder.style.backgroundSize = 'cover';
            placeholder.style.backgroundPosition = 'center';
            placeholder.style.position = 'relative';
            placeholder.innerHTML = '';
            
            // Setup delete button untuk foto yang sudah ada
            setupDeleteButton(placeholder, index);
        }
        
        // Setup click listener untuk upload/edit foto
        placeholder.addEventListener('click', function(e) {
            if (e.target.classList.contains('photo-delete-btn')) {
                return; // Jangan trigger upload jika klik delete button
            }
            e.stopPropagation();
            uploadPhoto(placeholder, index);
        });
    });
}

function setupDeleteButton(placeholder, index) {
    // Remove existing delete button
    const existingBtn = placeholder.querySelector('.photo-delete-btn');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Create delete button
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'photo-delete-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.style.display = 'none';
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Hapus foto ini?`)) {
            removePhoto(index);
            placeholder.style.backgroundImage = 'none';
            placeholder.innerHTML = `<span>📸 Foto ${index + 1}</span>`;
            placeholder.style.position = 'relative';
            initializePhotos();
        }
    });
    
    placeholder.appendChild(deleteBtn);
    
    // Show/hide delete button on hover
    placeholder.addEventListener('mouseenter', () => {
        const btn = placeholder.querySelector('.photo-delete-btn');
        if (btn) btn.style.display = 'flex';
    });
    
    placeholder.addEventListener('mouseleave', () => {
        const btn = placeholder.querySelector('.photo-delete-btn');
        if (btn) btn.style.display = 'none';
    });
}

function uploadPhoto(placeholder, index) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check ukuran file (max 1MB untuk lebih aman)
        if (file.size > 1 * 1024 * 1024) {
            alert('Ukuran foto terlalu besar! Max 1MB. Coba kompresi foto atau pilih ukuran lebih kecil.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const photoData = event.target.result;
            
            // Save to storage
            if (setPhoto(index, photoData)) {
                // Update tampilan
                placeholder.style.backgroundImage = `url('${photoData}')`;
                placeholder.style.backgroundSize = 'cover';
                placeholder.style.backgroundPosition = 'center';
                placeholder.style.position = 'relative';
                placeholder.innerHTML = '';
                
                setupDeleteButton(placeholder, index);
                console.log(`✅ Foto ${index + 1} berhasil disimpan!`);
            }
        };
        reader.readAsDataURL(file);
    });
    
    input.click();
}

// Initialize photos saat DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePhotos);
} else {
    setTimeout(initializePhotos, 100);
}

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
// AUTOPLAY MUSIC - PAGE LOAD
// ============================================
let musicStarted = false;

function startAutoPlay() {
    if (!audio) {
        console.warn('❌ Audio element tidak ditemukan');
        return;
    }
    
    if (!audio.src) {
        console.warn('❌ Audio src tidak ada');
        return;
    }
    
    if (musicStarted) {
        return; // Prevent multiple attempts
    }
    
    console.log('🎵 Memulai autoplay musik...');
    console.log('Audio src:', audio.src);
    console.log('Audio muted:', audio.muted);
    
    // Set volume
    audio.volume = 0.7;
    audio.muted = true;
    
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('✅ Play berhasil dimulai');
            isPlaying = true;
            playBtn.innerHTML = '<span class="play-icon">⏸</span>';
            playBtn.classList.add('playing');
            musicStarted = true;
            
            // Unmute music setelah play berhasil
            setTimeout(() => {
                audio.muted = false;
                console.log('✅ Audio unmuted - musik seharusnya terdengar!');
                console.log('Volume:', audio.volume);
            }, 800);
        }).catch((error) => {
            console.log('ℹ️ Autoplay musik dibatasi browser, tunggu user interaksi...');
            console.log('Error detail:', error.message);
            
            // Fallback: tunggu user click untuk play
            const handleUserInteraction = () => {
                if (!musicStarted && audio.src) {
                    console.log('🎵 User click detected - playing musik...');
                    audio.muted = false;
                    audio.volume = 0.7;
                    audio.play().then(() => {
                        isPlaying = true;
                        playBtn.innerHTML = '<span class="play-icon">⏸</span>';
                        playBtn.classList.add('playing');
                        musicStarted = true;
                        console.log('✅ Musik dimulai setelah user interaksi!');
                    }).catch((e) => {
                        console.log('❌ Error play:', e.message);
                    });
                }
                document.removeEventListener('click', handleUserInteraction);
                document.removeEventListener('touchstart', handleUserInteraction);
            };
            
            document.addEventListener('click', handleUserInteraction);
            document.addEventListener('touchstart', handleUserInteraction);
        });
    }
}

// Jalankan autoplay saat DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(startAutoPlay, 500);
    });
} else {
    setTimeout(startAutoPlay, 500);
}

// ============================================
// EXPORT & IMPORT DEKLARASI
// ============================================

function exportDeklarasi() {
    // Kumpulkan semua data foto
    const deklarasiData = {
        timestamp: new Date().toISOString(),
        fotos: {}
    };
    
    // Ambil semua foto dari storage
    let hasPhoto = false;
    for (let i = 0; i < 4; i++) {
        const foto = getPhoto(i);
        if (foto) {
            deklarasiData.fotos[i] = foto;
            hasPhoto = true;
        }
    }
    
    if (!hasPhoto) {
        alert('⚠️ Tidak ada foto yang tersimpan. Tambahkan foto terlebih dahulu!');
        return;
    }
    
    // Create HTML file dengan data embedded
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pernyataan Cinta Untukmu ❤️</title>
    <link rel="stylesheet" href="style.css">
    <script>
        // Data deklarasi embedded dalam file ini
        const DEKLARASI_PHOTOS = ${JSON.stringify(deklarasiData.fotos)};
        
        // Load foto saat page load
        window.addEventListener('load', () => {
            for (const index in DEKLARASI_PHOTOS) {
                localStorage.setItem('loveDeclaration_photo_' + index, DEKLARASI_PHOTOS[index]);
            }
            console.log('✅ Foto berhasil di-load dari file deklarasi!');
        });
    </script>
</head>
<body>
    ${getCurrentPageHTML()}
</body>
</html>`;
    
    // Download file
    const link = document.createElement('a');
    link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    link.download = 'Deklarasi-Cinta-' + new Date().getTime() + '.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('✅ Deklarasi berhasil di-unduh!\\n\\nFile include semua foto. Bagikan ke orang terkasih - saat mereka buka file, foto-foto akan otomatis muncul!');
}

function importDeklarasi(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            
            // Cari data foto dalam file
            const match = content.match(/const DEKLARASI_PHOTOS = ({[^}]+:[^}]+});/);
            if (match) {
                const photosData = JSON.parse(match[1]);
                
                // Save semua foto ke localStorage
                let count = 0;
                for (const index in photosData) {
                    localStorage.setItem('loveDeclaration_photo_' + index, photosData[index]);
                    count++;
                }
                
                // Refresh halaman untuk tampilkan foto
                initializePhotos();
                alert('✅ Deklarasi berhasil di-import!\\n' + count + ' foto berhasil dimuat.\\n\\nScroll ke atas untuk melihat foto-foto!');
            } else {
                alert('❌ File tidak valid. Pastikan file adalah deklarasi yang di-export dari sini.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error saat import file. Detail: ' + error.message);
        }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
}

function getCurrentPageHTML() {
    // Ambil seluruh body content kecuali script
    let html = document.body.innerHTML;
    
    // Remove semua script tag
    html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
    
    // Remove import file input
    html = html.replace(/<input[^>]*id="importFile"[^>]*>/g, '');
    
    return html;
}

console.log('💕 Love Declaration website loaded successfully! 💕');

// Comprehensive debug info
console.log('=== LOVE DECLARATION DEBUG INFO ===');
console.log('Audio Element:', {
    found: !!audio,
    id: audio ? audio.id : 'N/A',
    src: audio ? audio.src : 'N/A',
    volume: audio ? audio.volume : 'N/A',
    muted: audio ? audio.muted : 'N/A',
    paused: audio ? audio.paused : 'N/A',
    duration: audio ? audio.duration : 'N/A'
});

console.log('UI Elements:', {
    playBtn: !!playBtn ? '✅' : '❌',
    progress: !!progress ? '✅' : '❌',
    volumeSlider: !!volumeSlider ? '✅' : '❌'
});

console.log('Music State:', {
    isPlaying: isPlaying,
    musicStarted: musicStarted
});

console.log('Tips untuk Debug:');
console.log('1. Buka DevTools (F12) dan cek Console');
console.log('2. Klik tombol Play (▶) di musik player');
console.log('3. Cek apakah volume slider berfungsi');
console.log('4. Jika masih tidak ada suara, cek:');
console.log('   - Speaker device sudah unmuted?');
console.log('   - Volume browser sudah di-set?');
console.log('   - File musik ada di assets folder?');
