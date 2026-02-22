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
                async function exportDeklarasi() {
                    // Kumpulkan foto
                    const deklarasiFotos = {};
                    let hasPhoto = false;
                    const placeholders = document.querySelectorAll('.photo-placeholder');
                    for (let i = 0; i < placeholders.length; i++) {
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

                    // Ambil CSS utama via fetch terlebih dahulu (lebih andal)
                    let cssText = '';
                    try {
                        const r = await fetch('style.css');
                        if (r.ok) cssText = await r.text();
                    } catch (e) {
                        console.warn('Gagal fetch style.css:', e);
                    }

                    // Jika kosong, coba kumpulkan dari document.styleSheets
                    if (!cssText) {
                        try {
                            for (let i = 0; i < document.styleSheets.length; i++) {
                                const sheet = document.styleSheets[i];
                                try {
                                    const rules = sheet.cssRules || sheet.rules;
                                    for (let j = 0; j < rules.length; j++) cssText += rules[j].cssText + '\n';
                                } catch (e) {
                                    // cross-origin ignore
                                }
                            }
                        } catch (e) { console.warn('Gagal kumpulkan CSS dari styleSheets:', e); }
                    }

                    // Ambil script.js untuk embed agar exported file berfungsi sama
                    let scriptText = '';
                    try {
                        const r = await fetch('script.js');
                        if (r.ok) scriptText = await r.text();
                    } catch (e) { console.warn('Gagal fetch script.js:', e); }

                    // Embed audio sebagai data URL jika memungkinkan
                    let audioDataUrl = '';
                    try {
                        const src = audio ? (audio.currentSrc || audio.src) : '';
                        if (src) {
                            const r = await fetch(src);
                            if (r.ok) {
                                const blob = await r.blob();
                                const reader = new FileReader();
                                audioDataUrl = await new Promise((resolve) => {
                                    reader.onload = () => resolve(reader.result);
                                    reader.readAsDataURL(blob);
                                });
                            }
                        }
                    } catch (e) { console.warn('Gagal embed audio:', e); audioDataUrl = audio ? (audio.currentSrc || audio.src) : ''; }

                    // Build standalone HTML: inline CSS + body + JS that restores photos + inline small player init
                    const bodyHtmlRaw = getCurrentPageHTML();

                    // If we have embedded audio, replace the <audio> element source in the body HTML
                    let bodyHtml = bodyHtmlRaw;
                    if (audioDataUrl) {
                        // replace existing <audio ...>...</audio> with a version that has embedded src
                        bodyHtml = bodyHtml.replace(/<audio[\s\S]*?<\/audio>/i, `<audio id="bgMusic" preload="auto" controls>\n            <source src="${audioDataUrl}" type="audio/mpeg">\n            Browser Anda tidak mendukung audio element.\n        </audio>`);
                    }

                    // minimal restore script: restore photos & init simple player controls so exported file works offline
                    const restoreScript = `
                        (function(){
                            const DEKLARASI_PHOTOS = ${JSON.stringify(deklarasiFotos)};
                            try{
                                Object.keys(DEKLARASI_PHOTOS).forEach(key=>{
                                    const index = parseInt(key);
                                    const photoData = DEKLARASI_PHOTOS[key];
                                    try{ localStorage.setItem('loveDeclaration_photo_'+index, photoData); }catch(e){}
                                    const placeholder = document.querySelectorAll('.photo-placeholder')[index];
                                    if(placeholder){
                                        placeholder.style.backgroundImage = 'url("'+photoData+'")';
                                        placeholder.style.backgroundSize = 'cover';
                                        placeholder.style.backgroundPosition = 'center';
                                        placeholder.innerHTML = '';
                                    }
                                });
                            }catch(e){console.warn('Error restore photos',e)}

                            // init player controls
                            try{
                                const audioEl = document.getElementById('bgMusic');
                                const playBtn = document.getElementById('playBtn');
                                const volumeSlider = document.getElementById('volumeSlider');
                                if(volumeSlider && audioEl){
                                    volumeSlider.addEventListener('input', function(e){
                                        audioEl.muted = false;
                                        audioEl.volume = e.target.value/100;
                                        if(audioEl.paused) audioEl.play().catch(()=>{});
                                    });
                                }
                                if(playBtn && audioEl){
                                    playBtn.addEventListener('click', function(){
                                        if(audioEl.paused){ audioEl.play().catch(()=>{}); playBtn.innerHTML='<span class="play-icon">⏸</span>'; }
                                        else { audioEl.pause(); playBtn.innerHTML='<span class="play-icon">▶</span>'; }
                                    });
                                }
                            }catch(e){console.warn('Error init player',e)}
                        })();
                    `;

                    const htmlContent = `<!doctype html>
                <html lang="id">
                <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <title>Pernyataan Cinta Untukmu ❤️</title>
                <style>${cssText}</style>
                </head>
                <body>
                ${bodyHtml}
                <script>${restoreScript}</script>
                ${scriptText ? `<script>${scriptText}</script>` : ''}
                </body>
                </html>`;

                    const link = document.createElement('a');
                    link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
                    link.download = 'Deklarasi-Cinta-' + Date.now() + '.html';
                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                    alert('✅ Deklarasi berhasil di-unduh! File include semua foto, style, dan script.');
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

    // Kumpulkan CSS dari dokumen (lebih andal daripada fetch di beberapa environment)
    let cssText = '';
    try {
        for (let i = 0; i < document.styleSheets.length; i++) {
            const sheet = document.styleSheets[i];
            try {
                if (!sheet.href || sheet.href.indexOf(location.origin) === 0 || sheet.ownerNode && sheet.ownerNode.tagName === 'STYLE') {
                    const rules = sheet.cssRules || sheet.rules;
                    for (let j = 0; j < rules.length; j++) {
                        cssText += rules[j].cssText + '\n';
                    }
                }
            } catch (e) {
                // ignore cross-origin stylesheets
            }
        }
    } catch (e) {
        console.warn('Gagal mengumpulkan CSS dari document.styleSheets:', e);
    }

    // Jika cssText kosong, coba fetch style.css sebagai fallback
    if (!cssText) {
        try {
            const resp = await fetch('style.css');
            if (resp.ok) cssText = await resp.text();
        } catch (e) {
            console.warn('Gagal fetch style.css:', e);
        }
    }

    // Coba embed audio sebagai data URL jika memungkinkan
    let audioDataUrl = '';
    try {
        if (audio && audio.currentSrc) {
            const resp = await fetch(audio.currentSrc);
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
        audioDataUrl = audio ? (audio.currentSrc || audio.src) : '';
    }

    // Build standalone HTML
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pernyataan Cinta Untukmu ❤️</title>
    <style>${cssText.replace(/<\/style>/g, '<\\/style>')}</style>
    <script>
        const DEKLARASI_PHOTOS = ${JSON.stringify(deklarasiFotos)};
        const EMBEDDED_AUDIO = ${JSON.stringify(audioDataUrl)};
        window.addEventListener('DOMContentLoaded', () => {
            try {
                Object.keys(DEKLARASI_PHOTOS).forEach(key => {
                    const index = parseInt(key);
                    const photoData = DEKLARASI_PHOTOS[key];
                    try { localStorage.setItem('loveDeclaration_photo_' + index, photoData); } catch(e){}
                    const placeholder = document.querySelectorAll('.photo-placeholder')[index];
                    if (placeholder) {
                        placeholder.style.backgroundImage = 'url("' + photoData + '")';
                        placeholder.style.backgroundSize = 'cover';
                        placeholder.style.backgroundPosition = 'center';
                        placeholder.innerHTML = '';
                    }
                });
            } catch (e) { console.warn('Error restore photos:', e); }

            try {
                if (EMBEDDED_AUDIO) {
                    const audioEl = document.getElementById('bgMusic');
                    if (audioEl) {
                        audioEl.src = EMBEDDED_AUDIO;
                        audioEl.muted = true;
                        audioEl.play().then(() => { setTimeout(() => { audioEl.muted = false; }, 800); }).catch(()=>{});
                    }
                }
            } catch (e) { console.warn('Error set audio:', e); }
        });
    </script>
</head>
<body>
${getCurrentPageHTML()}
</body>
</html>`;

    const link = document.createElement('a');
    link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    link.download = 'Deklarasi-Cinta-' + new Date().getTime() + '.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('✅ Deklarasi berhasil di-unduh! File include semua foto dan style.');
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
