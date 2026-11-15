# RuangTumbuh

RuangTumbuh adalah aplikasi React Native sederhana untuk membantu mahasiswa merawat kebiasaan sehat: fokus belajar, minum air, mengambil jeda, dan menulis refleksi harian. Tampilannya memakai tema malam ungu gelap dengan aksen neon, bintang yang berkelap-kelip dan melintas, chip membulat, kartu berwarna, serta navigasi mengambang yang terinspirasi dari referensi.

## Menjalankan aplikasi

1. Pasang Node.js versi LTS.
2. Buka folder proyek di terminal, lalu jalankan `npm install`.
3. Jalankan `npm start`.
4. Pindai QR dengan Expo Go, atau tekan `w` untuk membuka versi web.

Perintah lain: `npm run android` untuk emulator Android, `npm run ios` untuk iOS di macOS.

## Isi aplikasi

- **Beranda** menampilkan progres dan tiga kebiasaan yang bisa ditandai selesai.
- **Jurnal** menerima catatan syukur hingga 500 karakter dan mengirimkannya ke state utama.
- **Profil** merangkum kebiasaan dan catatan yang tersimpan selama sesi aplikasi.
- Navigasi bawah berpindah antartiga layar.

`App.js` memuat komponen `HomeScreen`, `JournalScreen`, `ProfileScreen`, `ProgressCard`, `HabitCard`, `PageHeading`, dan `BottomNavigation`. State utama berada di `App` dan dikirim ke layar melalui props. `useState`, `useEffect`, dan `useMemo` digunakan untuk state, jam/tanggal, serta format tanggal.

## Panduan dan presentasi

- Panduan pembuatan langkah demi langkah: [PANDUAN_RUANGTUMBUH.pdf](./PANDUAN_RUANGTUMBUH.pdf)
- Template lembar jawaban (isi identitas dan tautan video sendiri): [LEMBAR_JAWABAN.md](./LEMBAR_JAWABAN.md)
- Jika panduan PDF perlu dibuat ulang, jalankan `npm run guide:pdf`.

Data aplikasi disimpan sementara di state, sehingga akan kembali ke kondisi awal saat aplikasi ditutup. Tautan YouTube tidak dibuat otomatis; unggah presentasi milik sendiri dan ganti placeholder di lembar jawaban.
