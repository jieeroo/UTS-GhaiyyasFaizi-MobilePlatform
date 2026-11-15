const fs = require('node:fs');
const path = require('node:path');

const outputPath = path.join(__dirname, '..', 'PANDUAN_RUANGTUMBUH.pdf');
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const LEFT = 52;

const pages = [
  {
    title: 'RuangTumbuh',
    subtitle: 'Panduan pembuatan aplikasi React Native',
    sections: [
      {
        heading: '1. Ide dan tujuan',
        lines: [
          'RuangTumbuh membantu mahasiswa menjaga rutinitas harian yang seimbang.',
          'Pengguna dapat menandai sesi fokus, minum air, dan waktu jeda, lalu',
          'menulis satu refleksi singkat tentang hal baik yang dialami hari ini.',
          'Aplikasi dibuat dengan React Native dan Expo agar mudah dicoba di ponsel',
          'Android maupun browser.',
          'Antarmuka memakai tema malam ungu, kartu neon, navigasi mengambang,',
          'serta dekorasi bintang yang bergerak dan berkelap-kelip.',
        ],
      },
      {
        heading: '2. Persiapan proyek',
        lines: [
          '1. Pasang Node.js versi LTS dan Expo Go pada ponsel.',
          '2. Buka folder proyek, lalu jalankan: npm install',
          '3. Mulai server pengembangan: npm start',
          '4. Pindai QR di terminal dengan Expo Go, atau tekan tombol w untuk web.',
          '   Emulator Android dapat dijalankan dengan: npm run android',
        ],
      },
      {
        heading: '3. Rancangan halaman',
        lines: [
          'Beranda menampilkan progres, daftar kebiasaan, dan pintasan ke jurnal.',
          'Jurnal menyediakan kolom refleksi dengan batas 500 karakter.',
          'Profil merangkum aktivitas selama sesi aplikasi.',
          'Navigasi bawah menghubungkan ketiga halaman tersebut.',
        ],
      },
    ],
  },
  {
    title: 'Komponen dan state',
    subtitle: 'Bagaimana data mengalir di dalam aplikasi',
    sections: [
      {
        heading: '4. Komponen React Native',
        lines: [
          'App menjadi komponen induk dan mengatur layar yang sedang aktif.',
          'HomeScreen, JournalScreen, dan ProfileScreen adalah tiga halaman.',
          'HabitCard, ProgressCard, PageHeading, dan BottomNavigation adalah',
          'komponen pendukung yang dapat digunakan kembali.',
          'Komponen tampilan menggunakan View, Text, Pressable, ScrollView,',
          'dan TextInput dari React Native.',
        ],
      },
      {
        heading: '5. State, props, dan Hooks',
        lines: [
          'useState menyimpan tab aktif, status kebiasaan, dan catatan jurnal.',
          'App mengirim state dan fungsi penanganan ke halaman melalui props.',
          'JournalScreen memanggil onSave untuk mengirim catatan ke App; beranda',
          'dan profil lalu menampilkan data yang sama.',
          'useEffect menyegarkan jam setiap menit dan menyelaraskan draft jurnal',
          'ketika catatan tersimpan berubah.',
          'useMemo memformat tanggal agar tidak dihitung ulang tanpa perubahan jam.',
        ],
      },
      {
        heading: '6. Menguji aplikasi',
        lines: [
          '1. Tandai dan batalkan beberapa kebiasaan; periksa progres berubah.',
          '2. Buka Jurnal, tulis refleksi, lalu tekan Simpan refleksi.',
          '3. Kembali ke Beranda dan pastikan catatan tampil pada kartu jurnal.',
          '4. Buka Profil dan periksa ringkasan aktivitas.',
          'State masih tersimpan selama aplikasi terbuka; belum memakai basis data.',
        ],
      },
    ],
  },
  {
    title: 'Pengumpulan dan presentasi',
    subtitle: 'Checklist sebelum mengumpulkan tugas',
    sections: [
      {
        heading: '7. Struktur dan perintah',
        lines: [
          'App.js                  Komponen, navigasi, state, dan tampilan',
          'app.json                Nama dan pengaturan Expo',
          'README.md               Ringkasan proyek dan cara menjalankan',
          'LEMBAR_JAWABAN.md       Template jawaban dan tautan presentasi',
          'PANDUAN_RUANGTUMBUH.pdf  Panduan pembuatan aplikasi',
          'npm start               Menjalankan Expo',
          'npm run guide:pdf       Membuat ulang panduan PDF',
        ],
      },
      {
        heading: '8. Rekam dan serahkan',
        lines: [
          '1. Jalankan aplikasi dan siapkan demo singkat untuk tiga halaman.',
          '2. Jelaskan manfaat aplikasi, state dan props, Hooks, serta navigasi.',
          '3. Rekam presentasi, unggah sendiri ke YouTube, lalu atur akses video',
          '   sesuai arahan dosen atau LMS.',
          '4. Ganti placeholder tautan YouTube di LEMBAR_JAWABAN.md dengan URL',
          '   video yang benar. Jangan mengumpulkan placeholder sebagai tautan.',
          '5. Kumpulkan PDF panduan dan lembar jawaban melalui LMS.',
        ],
      },
      {
        heading: 'Catatan',
        lines: [
          'Status kebiasaan dan jurnal disimpan di memori aplikasi untuk contoh',
          'pembelajaran. Menutup aplikasi akan mengembalikannya ke kondisi awal.',
          'Tambahkan identitas dan tautan video sendiri sebelum pengumpulan.',
        ],
      },
    ],
  },
];

function escapePdfText(value) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function textCommand(text, x, y, fontSize, font = 'F1', color = '0.12 0.20 0.17') {
  return `BT ${color} rg /${font} ${fontSize} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(text)}) Tj ET\n`;
}

function buildPage(page, pageNumber) {
  let stream = 'q 0.24 0.17 0.40 rg 0 754 595 88 re f Q\n';
  stream += textCommand(page.title, LEFT, 801, 25, 'F2', '1 1 1');
  stream += textCommand(page.subtitle, LEFT, 778, 11, 'F1', '0.89 0.85 0.97');
  let y = 723;

  for (const section of page.sections) {
    stream += textCommand(section.heading, LEFT, y, 14, 'F2', '0.39 0.28 0.67');
    y -= 23;
    for (const line of section.lines) {
      stream += textCommand(line, LEFT, y, 10.5);
      y -= 16;
    }
    y -= 15;
  }

  stream += `0.88 0.91 0.88 RG 0.7 w ${LEFT} 43 m ${PAGE_WIDTH - LEFT} 43 l S\n`;
  stream += textCommand('RuangTumbuh | Panduan tugas React Native', LEFT, 27, 8, 'F1', '0.48 0.54 0.50');
  stream += textCommand(`${pageNumber} / ${pages.length}`, PAGE_WIDTH - LEFT - 30, 27, 8, 'F1', '0.48 0.54 0.50');
  return stream;
}

const objects = [];
function addObject(content) {
  objects.push(content);
  return objects.length;
}

const catalogId = addObject('');
const pagesId = addObject('');
const regularFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
const boldFontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
const pageIds = [];

for (let index = 0; index < pages.length; index += 1) {
  const stream = buildPage(pages[index], index + 1);
  const streamId = addObject(`<< /Length ${Buffer.byteLength(stream, 'ascii')} >>\nstream\n${stream}endstream`);
  const pageId = addObject(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      `/Resources << /Font << /F1 ${regularFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${streamId} 0 R >>`,
  );
  pageIds.push(pageId);
}

objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;

let pdf = '%PDF-1.4\n';
const offsets = [0];
for (let index = 0; index < objects.length; index += 1) {
  offsets.push(Buffer.byteLength(pdf, 'ascii'));
  pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
}

const xrefOffset = Buffer.byteLength(pdf, 'ascii');
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets.slice(1)) {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

fs.writeFileSync(outputPath, Buffer.from(pdf, 'ascii'));
console.log(`Created ${outputPath}`);
