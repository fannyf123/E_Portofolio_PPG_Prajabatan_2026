# 🤝 Panduan Kontribusi

Terima kasih telah tertarik untuk berkontribusi pada E-Portfolio PPG Prajabatan 2026!

---

## 📋 Sebelum Berkontribusi

1. **Fork** repository ini ke akun GitHub Anda
2. **Clone** fork Anda ke lokal:
   ```bash
   git clone https://github.com/<username-anda>/E_Portofolio_PPG_Prajabatan_2026.git
   ```
3. Buat **branch baru** untuk perubahan Anda:
   ```bash
   git checkout -b fix/nama-perubahan
   ```

---

## 🗂️ Struktur Kode

Proyek ini menggunakan arsitektur **CSS & JS modular**:

| Folder | Isi |
|--------|-----|
| `css/` | Satu file CSS per section (`base.css`, `nav.css`, `profil.css`, dst.) |
| `js/`  | Modul JavaScript terpisah (`main.js`, `artefak.js`, `particles.js`) |
| `assets/img/` | Gambar dan aset media |

**Panduan saat mengedit:**
- Ubah style satu section → edit file `css/` yang sesuai saja
- Ubah logika navigasi → edit `js/main.js`
- Ubah logika artefak/modal → edit `js/artefak.js`
- Ubah animasi partikel → edit `js/particles.js`

---

## ✍️ Konvensi Penulisan

### CSS
- Gunakan **CSS Custom Properties** (variabel) dari `css/base.css` (contoh: `var(--coral)`, `var(--shadow-md)`)
- Ikuti format komentar section: `/* ============= NAMA SECTION ============= */`
- Gunakan satuan `rem` untuk typography, `px` untuk border/shadow kecil

### JavaScript
- Gunakan **vanilla JavaScript** (tanpa framework/library eksternal)
- Bungkus kode dalam `document.addEventListener('DOMContentLoaded', ...)` jika mengakses DOM
- Tambahkan komentar `// ---------- Nama Fungsi ----------` sebelum setiap blok fungsi utama

### HTML
- Pertahankan komentar section `<!-- === NAMA SECTION === -->` di `index.html`
- Gunakan atribut `aria-label` pada elemen interaktif (button, link icon)
- Gunakan class `reveal`, `reveal-left`, atau `reveal-right` untuk animasi scroll

---

## 🚀 Alur Kontribusi

1. Lakukan perubahan di branch Anda
2. Test di browser (buka `index.html` langsung)
3. Pastikan tampilan responsif di mobile (gunakan DevTools)
4. Pastikan dark mode berfungsi dengan benar
5. Commit dengan pesan yang jelas:
   ```bash
   git commit -m "fix: perbaiki tampilan nav di mobile"
   git commit -m "feat: tambah animasi hover pada skill card"
   git commit -m "docs: update README dengan instruksi baru"
   ```
6. Push ke fork Anda dan buat **Pull Request**

---

## 📝 Format Pesan Commit

Gunakan format **Conventional Commits**:

| Prefix | Kegunaan |
|--------|----------|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Perubahan dokumentasi |
| `style:` | Perubahan CSS/style (bukan logika) |
| `refactor:` | Refactoring kode tanpa mengubah fungsionalitas |
| `chore:` | Perubahan build/config (`.gitignore`, dll) |

---

## 🐛 Melaporkan Bug

Jika menemukan bug, buat **Issue** dengan:
- Deskripsi masalah yang jelas
- Langkah-langkah untuk mereproduksi
- Screenshot (jika berkaitan dengan tampilan)
- Browser dan versi yang digunakan

---

*Dibuat dengan ❤️ untuk PPG Prajabatan 2026*
