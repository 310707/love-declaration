# 💕 Pernyataan Cinta Web - Love Declaration Website 💕

Sebuah website interaktif yang indah untuk menyatakan cinta dengan animasi, musik, puisi, dan fitur-fitur romantis.

## 🎯 Fitur Utama

✨ **Animasi Hati Jatuh** - Hati-hati yang indah jatuh dari langit
📸 **Galeri Foto** - Tampilkan foto-foto kenangan indah bersama
💌 **Pernyataan Cinta** - Tuliskan pesan cinta yang menyentuh hati
✍️ **Puisi Romantis** - Puisi indah untuk orang terkasih
🎵 **Musik Latar** - Musik romantis untuk menemani
📱 **Responsif** - Berfungsi sempurna di semua perangkat (mobile, tablet, desktop)
🎨 **Animasi Interaktif** - Efek visual yang menawan
💫 **Konfetti Hati** - Kejutan hati pada bagian pesan spesial

## 📋 Struktur File

```
love-declaration/
├── index.html          # File HTML utama
├── style.css           # Styling dan animasi
├── script.js           # Fungsi interaktif
├── assets/             # Folder untuk aset
│   └── romantic-music.mp3  # File musik (opsional)
└── README.md           # File ini
```

## 🚀 Cara Menggunakan

### 1. **Buka di Browser**
   - Cukup buka file `index.html` di browser favorit Anda
   - Atau host di server dan akses via URL

### 2. **Kustomisasi Teks**
   Edit file `index.html` dan ubah teks berikut:
   
   - **Judul**: Ubah "Pernyataan Cintaku Untukmu"
   - **Pernyataan Cinta**: Ubah teks di section `.declaration-section`
   - **Puisi**: Ubah puisi di section `.poetry-section`
   - **Pesan Spesial**: Ubah pesan di section `.message-section`
   - **Deskripsi Foto**: Ubah teks di galeri

### 3. **Tambah Musik**
   
   Opsi A: Tambah file musik di folder `assets/`
   ```
   1. Simpan file musik (mp3, wav, ogg) di folder assets
   2. Edit line berikut di index.html:
      <source src="assets/romantic-music.mp3" type="audio/mpeg">
      Ganti dengan nama file musik Anda
   ```
   
   Opsi B: Link musik dari URL
   ```
   <source src="https://url-musik.com/lagu.mp3" type="audio/mpeg">
   ```

### 4. **Tambah Foto**
   
   Ada 2 cara:
   
   **Cara 1: Upload Langsung (Rekomendasi)**
   - Buka website
   - Klik pada placeholder foto (📸)
   - Pilih foto dari device
   - Foto akan tampil langsung

   **Cara 2: Ganti HTML**
   - Edit file `index.html`
   - Ganti placeholder dengan img tag:
   ```html
   <div class="photo-placeholder">
       <img src="assets/foto1.jpg" alt="Foto 1" style="width: 100%; height: 100%; object-fit: cover;">
   </div>
   ```

### 5. **Ganti Warna dan Tema**
   
   Edit di `style.css`:
   ```css
   /* Warna gradient utama */
   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   
   /* Warna tombol */
   background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
   
   /* Warna teks */
   color: #e74c3c;
   ```

## 🎮 Kontrol Interaktif

### Keyboard Shortcuts:
- **Spacebar** - Play/Pause musik
- **Arrow Down** - Scroll ke section berikutnya
- **Arrow Up** - Scroll ke section sebelumnya
- **Double Click** pada pesan - Copy ke clipboard

### Mouse:
- **Klik foto** - Upload foto baru
- **Klik tombol** - Navigasi ke section
- **Klik di background** - Ledakan hati mini ❤️

## 📱 Responsive Design

Website ini sudah dioptimalkan untuk:
- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (480px - 767px)
- ✅ Small Mobile (320px - 479px)

## 🎨 Customization Tips

### Mengubah Puisi:
```html
<p class="poetry-text">
    Baris puisi 1<br>
    Baris puisi 2<br>
    <br>
    Baris puisi 3<br>
</p>
```

### Mengubah Warna Section:
Setiap section memiliki warna berbeda:
- Welcome: Purple gradient
- Declaration: Pink-Red gradient
- Gallery: Peach gradient
- Poetry: Light Blue-Pink gradient
- Music: Purple gradient
- Message: Yellow-Orange gradient

Edit di CSS:
```css
.welcome-section {
    background: linear-gradient(135deg, warna1 0%, warna2 100%);
}
```

### Menambah Section Baru:
```html
<section class="section new-section" id="new-section">
    <h2>Judul Section</h2>
    <div class="content">
        <!-- Konten Anda -->
    </div>
</section>
```

```css
.new-section {
    background: linear-gradient(135deg, warna1 0%, warna2 100%);
}
```

## 🎵 Rekomendasi Musik

Situs penyedia musik bebas royalti:
- **Pixabay Music** - pixabay.com/music
- **Bensound** - bensound.com
- **Free Music Archive** - freemusicarchive.org
- **YouTube Audio Library** - youtube.com/audiolibrary
- **Komponis Lokal** - cari musik Indonesia di platform lokal

## ⚠️ Troubleshooting

### Musik tidak terdengar?
- Pastikan file musik ada di folder `assets/`
- Atau gunakan URL musik yang valid
- Cek browser console untuk error (F12)

### Foto tidak muncul?
- Pastikan format file benar (JPG, PNG, GIF)
- Ukuran file tidak terlalu besar
- Path file benar di HTML

### Animasi terlalu lambat?
- Kurangi jumlah hati di `script.js`
- Matikan beberapa animasi di CSS pada mobile

### Website tidak responsive?
- Pastikan meta viewport ada di HTML
- Clear browser cache
- Gunakan browser terbaru

## 🔧 Tips Teknis

### Untuk Developer:
- Semua kode sudah commented dengan baik
- Mudah di-customize dan di-extend
- Mobile-first design approach
- No external dependencies (pure CSS & JavaScript)

### Performance:
- Minimal file size
- Optimized animations
- Lazy loading ready
- Low memory impact

## 📝 Contoh Customization

### Contoh 1: Ubah Pernyataan Cinta
Cari di `index.html`:
```html
<div class="declaration-text">
    <p>Sejak aku mengenalmu, hidupku menjadi lebih berwarna.</p>
    <!-- Edit teks di sini -->
</div>
```

### Contoh 2: Ubah Nama di Pesan
Cari di `index.html`:
```html
<p class="closing">
    Selamanya milikmu, 💕<br>
    <strong>Pribadi yang mencintaimu</strong>
</p>
```

Ubah menjadi:
```html
<p class="closing">
    Selamanya milikmu, 💕<br>
    <strong>[Nama Anda]</strong>
</p>
```

## 🎁 Bonus Features Untuk Dikembangkan

- [ ] Tambah countdown timer untuk special date
- [ ] Tambah guest book untuk pesan balasan
- [ ] Tambah video atau slide show
- [ ] Tambah easter eggs
- [ ] Tambah share to social media
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Background blur effect

## 📞 Support

Jika ada pertanyaan atau bug, hubungi developer atau baca dokumentasi CSS & JavaScript yang sudah tersedia di file.

## 📄 Lisensi

Website ini bebas digunakan untuk keperluan pribadi dan komersial. Nikmati! 💕

---

**Dibuat dengan cinta ❤️ untuk orang terkasih**

Happy coding dan semoga pernyataan cintamu diterima! 💕✨
