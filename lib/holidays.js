// Tanggal merah + hari nasional untuk poster ucapan di /admin/poster.
// Libur 2027 dari SKB 3 Menteri (Menag 1205/2026, Menaker 3/2026, MenPANRB 2/2026), daftar resmi:
// https://www.kemenkopmk.go.id/pemerintah-tetapkan-18-hari-libur-nasional-dan-8-cuti-bersama-tahun-2027
// Cuti bersama tidak dibuatkan poster. Kalau pemerintah mengubah tanggal, ubah di sini.
// Untuk 2028: tambahkan baris baru setelah SKB 2028 terbit (biasanya September/Oktober 2027).

// Warna aksen [acc, acc2] per suasana (sama dengan poster lama di my-video/out/print/hari-besar).
export const THEMES = {
  merahputih: ['#C8102E', '#F2B705'],
  islam: ['#1F7A4D', '#D4A72C'],
  natal: ['#B3202A', '#2E6B3F'],
  paskah: ['#6B5BA8', '#E9C46A'],
  imlek: ['#C8102E', '#E8B54A'],
  nyepi: ['#2F2F2F', '#C9A227'],
  waisak: ['#E0892B', '#F2C94C'],
  perempuan: ['#C2507A', '#F2B5C8'],
  pendidikan: ['#2C21C4', '#F2B705'],
  batik: ['#8A4B2A', '#D9A441'],
  buruh: ['#D9472B', '#2B2B2B'],
};

// date = hari pertama, end = hari terakhir (kalau lebih dari sehari). merah = tanggal merah.
// title / msg: | = ganti baris. caption = usulan teks posting (tanpa jualan).
const H = (date, tag, title, msg, theme, caption, opt = {}) => ({ date, tag, title, msg, theme, caption, merah: true, ...opt });
const N = (date, tag, title, msg, theme, caption) => H(date, tag, title, msg, theme, caption, { merah: false });

export const HOLIDAYS = [
  // 2026 (sisa tahun)
  N('2026-11-10', 'HARI PAHLAWAN', 'Selamat|Hari Pahlawan', 'Terima kasih untuk mereka yang|berjuang demi negeri ini.', 'merahputih', 'Selamat Hari Pahlawan. Mari terus berkarya dan saling menguatkan, sekecil apa pun langkahnya.'),
  N('2026-11-25', 'HARI GURU NASIONAL', 'Selamat|Hari Guru', 'Terima kasih untuk setiap guru|yang sabar mengajar dan menginspirasi.', 'pendidikan', 'Selamat Hari Guru Nasional. Terima kasih untuk semua guru yang sudah membentuk kita.'),
  N('2026-12-22', 'HARI IBU', 'Selamat|Hari Ibu', 'Untuk ibu yang selalu ada,|terima kasih atas segalanya.', 'perempuan', 'Selamat Hari Ibu untuk semua ibu hebat. Terima kasih atas kasih yang tidak pernah habis.'),
  H('2026-12-25', 'HARI NATAL', 'Selamat|Hari Natal', 'Semoga damai dan sukacita Natal|menyertai kita semua.', 'natal', 'Selamat Hari Natal bagi yang merayakan. Semoga damai dan sukacita selalu menyertai.'),

  // 2027
  H('2027-01-01', 'TAHUN BARU 2027', 'Selamat|Tahun Baru 2027', 'Semoga tahun ini membawa|semangat dan kebaikan baru.', 'pendidikan', 'Selamat Tahun Baru 2027. Semoga tahun ini penuh semangat dan kebaikan untuk kita semua.'),
  H('2027-01-05', 'ISRA MIKRAJ 1448 H', 'Selamat Memperingati|Isra Mikraj', 'Isra Mikraj Nabi Muhammad SAW.|Semoga kita makin dekat dengan-Nya.', 'islam', 'Selamat memperingati Isra Mikraj Nabi Muhammad SAW bagi yang memperingati.'),
  H('2027-02-06', 'TAHUN BARU IMLEK 2578', 'Selamat|Tahun Baru Imlek', 'Gong Xi Fa Cai.|Semoga sehat, damai, dan sejahtera.', 'imlek', 'Selamat Tahun Baru Imlek 2578 bagi yang merayakan. Gong Xi Fa Cai.'),
  H('2027-03-08', 'HARI SUCI NYEPI', 'Selamat Hari Raya|Nyepi', 'Tahun Baru Saka 1949.|Semoga damai menyertai kita semua.', 'nyepi', 'Selamat Hari Raya Nyepi, Tahun Baru Saka 1949, bagi yang merayakan.'),
  H('2027-03-10', 'IDUL FITRI 1448 H', 'Selamat Hari Raya|Idul Fitri', 'Mohon maaf lahir dan batin.|Taqabbalallahu minna wa minkum.', 'islam', 'Selamat Hari Raya Idul Fitri 1448 H. Mohon maaf lahir dan batin.', { end: '2027-03-11' }),
  H('2027-03-26', 'WAFAT YESUS KRISTUS', 'Memperingati|Jumat Agung', 'Wafat Yesus Kristus.|Semoga damai menyertai kita semua.', 'paskah', 'Selamat memperingati Jumat Agung bagi yang memperingati.'),
  H('2027-03-28', 'PASKAH', 'Selamat|Hari Paskah', 'Semoga sukacita dan harapan baru|menyertai kita semua.', 'paskah', 'Selamat Hari Paskah bagi yang merayakan. Semoga penuh sukacita dan harapan baru.'),
  N('2027-04-21', 'HARI KARTINI', 'Selamat|Hari Kartini', 'Untuk semua perempuan hebat|yang terus berkarya.', 'perempuan', 'Selamat Hari Kartini untuk semua perempuan hebat yang terus berkarya.'),
  H('2027-05-01', 'HARI BURUH', 'Selamat|Hari Buruh', 'Terima kasih untuk setiap tangan|yang bekerja keras setiap hari.', 'buruh', 'Selamat Hari Buruh Internasional. Terima kasih untuk semua yang bekerja keras setiap hari.'),
  N('2027-05-02', 'HARI PENDIDIKAN NASIONAL', 'Selamat Hari|Pendidikan Nasional', 'Belajar tidak pernah selesai.|Terus tumbuh, terus berkarya.', 'pendidikan', 'Selamat Hari Pendidikan Nasional. Belajar tidak pernah selesai.'),
  H('2027-05-06', 'KENAIKAN YESUS KRISTUS', 'Selamat Memperingati|Kenaikan Yesus Kristus', 'Semoga damai dan kasih|menyertai kita semua.', 'paskah', 'Selamat memperingati Kenaikan Yesus Kristus bagi yang memperingati.'),
  H('2027-05-17', 'IDUL ADHA 1448 H', 'Selamat Hari Raya|Idul Adha', 'Semoga semangat berbagi|selalu ada di hati kita.', 'islam', 'Selamat Hari Raya Idul Adha 1448 H bagi yang merayakan.'),
  H('2027-05-20', 'HARI RAYA WAISAK 2571 BE', 'Selamat Hari Raya|Waisak', 'Semoga semua makhluk|hidup berbahagia.', 'waisak', 'Selamat Hari Raya Waisak 2571 BE bagi yang merayakan. Semoga semua makhluk berbahagia.'),
  H('2027-06-01', 'HARI LAHIR PANCASILA', 'Selamat Hari Lahir|Pancasila', 'Berbeda-beda tetapi tetap satu.', 'merahputih', 'Selamat Hari Lahir Pancasila. Berbeda-beda tetapi tetap satu.'),
  H('2027-06-06', 'TAHUN BARU ISLAM 1449 H', 'Selamat|Tahun Baru Islam', '1 Muharam 1449 Hijriah.|Semoga tahun ini penuh berkah.', 'islam', 'Selamat Tahun Baru Islam 1449 H. Semoga penuh berkah.'),
  H('2027-08-15', 'MAULID NABI', 'Selamat Memperingati|Maulid Nabi', 'Maulid Nabi Muhammad SAW.|Semoga kita meneladani akhlaknya.', 'islam', 'Selamat memperingati Maulid Nabi Muhammad SAW bagi yang memperingati.'),
  H('2027-08-17', 'HUT RI KE-82', 'Dirgahayu|Republik Indonesia', 'Merdeka! Terus maju bersama|untuk Indonesia.', 'merahputih', 'Dirgahayu Republik Indonesia ke-82. Merdeka!'),
  N('2027-10-02', 'HARI BATIK NASIONAL', 'Selamat Hari|Batik Nasional', 'Bangga memakai dan|menjaga warisan Indonesia.', 'batik', 'Selamat Hari Batik Nasional. Yuk pakai batik hari ini.'),
  N('2027-10-28', 'SUMPAH PEMUDA', 'Selamat Hari|Sumpah Pemuda', 'Satu nusa, satu bangsa,|satu bahasa: Indonesia.', 'merahputih', 'Selamat Hari Sumpah Pemuda. Satu nusa, satu bangsa, satu bahasa.'),
  N('2027-11-10', 'HARI PAHLAWAN', 'Selamat|Hari Pahlawan', 'Terima kasih untuk mereka yang|berjuang demi negeri ini.', 'merahputih', 'Selamat Hari Pahlawan. Mari terus berkarya dan saling menguatkan.'),
  N('2027-11-25', 'HARI GURU NASIONAL', 'Selamat|Hari Guru', 'Terima kasih untuk setiap guru|yang sabar mengajar dan menginspirasi.', 'pendidikan', 'Selamat Hari Guru Nasional. Terima kasih untuk semua guru yang sudah membentuk kita.'),
  N('2027-12-22', 'HARI IBU', 'Selamat|Hari Ibu', 'Untuk ibu yang selalu ada,|terima kasih atas segalanya.', 'perempuan', 'Selamat Hari Ibu untuk semua ibu hebat.'),
  H('2027-12-25', 'HARI NATAL', 'Selamat|Hari Natal', 'Semoga damai dan sukacita Natal|menyertai kita semua.', 'natal', 'Selamat Hari Natal bagi yang merayakan. Semoga damai dan sukacita selalu menyertai.'),
  H('2027-12-26', 'ISRA MIKRAJ 1449 H', 'Selamat Memperingati|Isra Mikraj', 'Isra Mikraj Nabi Muhammad SAW.|Semoga kita makin dekat dengan-Nya.', 'islam', 'Selamat memperingati Isra Mikraj Nabi Muhammad SAW bagi yang memperingati.'),
  H('2028-01-01', 'TAHUN BARU 2028', 'Selamat|Tahun Baru 2028', 'Semoga tahun ini membawa|semangat dan kebaikan baru.', 'pendidikan', 'Selamat Tahun Baru 2028. Semoga penuh semangat dan kebaikan.'),
];

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// '2027-03-10' + '2027-03-11' -> '10–11 Maret 2027'
export function holidayDate(h) {
  const [y, m, d] = h.date.split('-').map(Number);
  if (!h.end) return `${d} ${MONTHS[m - 1]} ${y}`;
  const [y2, m2, d2] = h.end.split('-').map(Number);
  if (m === m2 && y === y2) return `${d}–${d2} ${MONTHS[m - 1]} ${y}`;
  return `${d} ${MONTHS[m - 1]} – ${d2} ${MONTHS[m2 - 1]} ${y2}`;
}

export const slugOf = (h) => `${h.date}-${h.tag.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
