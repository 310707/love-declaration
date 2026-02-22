# 🚀 PANDUAN SETUP CEPAT

## Langkah 1: Buka Website

1. Buka folder `love-declaration` di komputer Anda
2. Double-click file `index.html`
3. Website akan terbuka di browser default

## Langkah 2: Tambah Foto

Cara termudah:
1. Buka website
2. Klik pada placeholder foto (bagian yang bertuliskan 📸)
3. Pilih foto dari komputer
4. Foto akan langsung tampil ✓

## Langkah 3: Tambah Musik (Opsional)

**Cara 1: Upload musik ke folder**
1. Siapkan file musik (MP3, WAV, atau OGG)
2. Simpan di folder: `love-declaration/assets/romantic-music.mp3`
3. Reload website - musik sudah siap diputar

**Cara 2: Gunakan musik online**
1. Buka note app, cari musik favorit online (Spotify, YouTube, dll)
2. Copy link musik yang bisa di-stream
3. Edit file `index.html` line ke-220:
   ```html
   <source src="GANTI_DENGAN_LINK_MUSIK" type="audio/mpeg">
   ```

**Cara 3: Gunakan musik gratis**
- Dari Pixabay: pixabay.com/music
- Dari Bensound: bensound.com
- Dari YouTube Audio Library: youtube.com/audiolibrary

## Langkah 4: Kustomisasi Teks

### Edit Judul
File: `index.html` (Semua file dalam satu folder)
Cari: `<h1 class="title">Pernyataan Cintaku Untukmu 💕</h1>`
Ubah ke teks favorit Anda

### Edit Pernyataan Cinta
File: `index.html`
Cari section: `id="declaration"`
Ubah teks di dalam `<div class="declaration-text">`

### Edit Puisi
File: `index.html`
Cari section: `id="poetry"`
Ubah teks di dalam `<p class="poetry-text">`

### Edit Pesan Spesial
File: `index.html`
Cari section: `id="message"`
Ubah teks di dalam `<div class="love-message">`

## Langkah 5: Kustomisasi Warna & Tema

File: `style.css`

**Contoh mengubah warna:**

Cari `.welcome-section`:
```css
.welcome-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Ubah 2 warna hex (#) di atas */
}
```

**Warna yang bagus untuk kombinasi gradient:**
- Pink-Red: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
- Blue-Purple: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Green-Teal: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`
- Orange-Pink: `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`
- Purple-Pink: `linear-gradient(135deg, #ba55d3 0%, #cd5ff8 100%)`

## Langkah 6: Share ke Teman

### Hosting Gratis:
1. **GitHub Pages** (Gratis)
   - Upload folder ke GitHub
   - Aktifkan GitHub Pages
   - Dapatkan URL publik

2. **Netlify** (Gratis)
   - Drag & drop folder ke Netlify
   - Dapatkan URL instant

3. **Vercel** (Gratis)
   - Sama seperti Netlify
   - Cepat dan mudah

4. **Firebase Hosting** (Gratis)
   - Google Firebase
   - Reliable dan cepat

### Local Sharing:
- Copy folder ke phone/laptop teman
- Buka file `index.html` di browser
- Sudah bisa diakses!

## 📱 Testing di Mobile

Cara cek apakah responsif:

**Desktop Browser:**
1. Buka website di browser
2. Tekan F12 (buka Developer Tools)
3. Klik icon phone/tablet di atas
4. Test berbagai ukuran

**Langsung di Phone:**
1. Buka folder file di Windows Explorer
2. Copy folder ke phone via USB
3. Buka file HTML di browser phone
4. Seharusnya tampil sempurna

## 🎮 Kontrol:

- **Spacebar** = Play/Pause musik
- **Scroll/Swipe** = Lihat section berikutnya
- **Klik foto** = Upload foto baru
- **Klik di mana saja** = Munculkan hati mini

## ✅ Checklist Sebelum Share:

- [ ] Foto sudah ditambahkan
- [ ] Teks pernyataan cinta sudah diedit
- [ ] Musik sudah ditambahkan (atau dihapus jika tidak perlu)
- [ ] Puisi sudah disesuaikan
- [ ] Pesan spesial sudah ditulis
- [ ] Warna sudah sesuai keinginan
- [ ] Tested di mobile
- [ ] Tested di browser lain
- [ ] Tested dengan musik diputar

## 🆘 Masalah Umum:

**Website tampil blank**
→ Cek apakah path file benar, clear cache (Ctrl+F5)

**Musik tidak terdengar**
→ Pastikan file musik ada, atau gunakan link musik online

**Foto tidak muncul**
→ Pastikan format benar (JPG, PNG), ukuran tidak terlalu besar

**Animasi tidak lancar di mobile**
→ Normal, bisa disable beberapa animasi di CSS untuk performa lebih baik

## 📞 Tips Tambahan:

1. **Backup** - Selalu backup file sebelum diedit
2. **Test** - Test di berbagai browser sebelum share
3. **Proofread** - Cek typo dan grammar sebelum share
4. **Customize** - Jangan ragu untuk customize sesuai keinginan
5. **Creative** - Tambah elemen sendiri untuk lebih personal

---

**Selesai! Sekarang Anda sudah siap menyampaikan pernyataan cinta! 💕**

Good luck! 🍀✨
