// src/lib/hasil-asesmen.ts
// Types, konstanta, dan engine 5 lapisan untuk halaman Hasil Asesmen
// SMPN 5 Klaten · TA 2026/2027

// ── Types ────────────────────────────────────────────────────
export type JenisAsesmen =
  | 'ASTS_Gasal'
  | 'ASAS_Gasal'
  | 'ASTS_Genap'
  | 'ASAS_Genap'
  | 'ASAJ';

export type Predikat = 'A' | 'B' | 'C' | 'D';
export type TrendNilai = 'naik' | 'turun' | 'stabil' | 'pertama';
export type PosisiKelas = 'di_atas' | 'rata_rata' | 'di_bawah';
export type ConfettiLevel = 'besar' | 'sedang' | 'kecil' | 'motivasi';

export interface NilaiAsesmen {
  nilai: number;
  predikat: Predikat;
  kktp: number;
  statusTuntas: boolean;
  tanggal: string | null;
  rataKelas: number | null;
  nilaiSebelumnya: number | null;
}

export interface HasilSiswa {
  nis: string;
  nama: string;
  kelas: string;        // '7A', '8B', '9C'
  tingkat: number;      // 7, 8, 9
  mapel: string;        // 'PAI'
  ta: string;           // '2627'
  activeTa: string;
  taList: string[];
  mapelAktif: string[];
  hasil: Partial<Record<JenisAsesmen, NilaiAsesmen>>;
}

export interface MotivasiIslam {
  judul: string;
  subjudul?: string;
  pesan: string;
  callout: string;
  nilaiIslam: string;
}

export const PESAN_PENUTUP_BERSAMA = {
  judul: 'Ingat, ya!',
  pesan: 'Nilai bukan ukuran kemuliaan seseorang. Ilmu, akhlak, kejujuran, dan kesungguhan juga penting. Syukuri hasilmu, perbaiki kekuranganmu, dan jangan berhenti menjadi pribadi yang lebih baik.',
  subpesan: 'Belajar adalah ikhtiar, berdoa adalah penguat, dan tawakal adalah berserah diri kepada Allah.',
};

export interface AnalisisNilai extends NilaiAsesmen {
  trendNilai: TrendNilai;
  posisiKelas: PosisiKelas;
  selisihRata: number;    // positif = di atas rata
  selisihPrev: number;    // positif = naik
  refleksi: string;
  tindakan: string[];
  pesan: string;
  konfeti: ConfettiLevel;
  konfetiEmoji: string;
  motivasiIslam: MotivasiIslam;
}

// ── Konstanta Mapel ──────────────────────────────────────────
export const DAFTAR_MAPEL = [
  { kode: 'PAI',    nama: 'Pend. Agama Islam',   aktif: true  },
  { kode: 'PKN',    nama: 'PKn',                 aktif: false },
  { kode: 'BIND',   nama: 'Bahasa Indonesia',     aktif: false },
  { kode: 'MTK',    nama: 'Matematika',           aktif: false },
  { kode: 'IPA',    nama: 'IPA',                  aktif: false },
  { kode: 'IPS',    nama: 'IPS',                  aktif: false },
  { kode: 'BING',   nama: 'Bahasa Inggris',        aktif: false },
  { kode: 'PJOK',   nama: 'PJOK',                 aktif: false },
  { kode: 'SENIBD', nama: 'Seni Budaya',           aktif: false },
  { kode: 'PRAKAR', nama: 'Prakarya',              aktif: false },
  { kode: 'MULOK',  nama: 'Bahasa Jawa',           aktif: false },
  { kode: 'BK',     nama: 'Bimb. Konseling',       aktif: false },
] as const;

export const URUTAN_ASESMEN: JenisAsesmen[] = [
  'ASTS_Gasal', 'ASAS_Gasal', 'ASTS_Genap', 'ASAS_Genap', 'ASAJ',
];

export const LABEL_ASESMEN: Record<JenisAsesmen, string> = {
  ASTS_Gasal: 'ASTS Gasal',
  ASAS_Gasal: 'ASAS Gasal',
  ASTS_Genap: 'ASTS Genap',
  ASAS_Genap: 'ASAS Genap',
  ASAJ:       'ASAJ',
};

export const LABEL_ASESMEN_PENDEK: Record<JenisAsesmen, string> = {
  ASTS_Gasal: 'Gasal Tengah',
  ASAS_Gasal: 'Gasal Akhir',
  ASTS_Genap: 'Genap Tengah',
  ASAS_Genap: 'Genap Akhir',
  ASAJ:       'Akhir Jenjang',
};

// ── Engine 5 Lapisan ─────────────────────────────────────────

// Teks refleksi berdasarkan kondisi — dipilih acak dari array
const BANK_REFLEKSI: Record<string, string[]> = {
  // Predikat A
  'A_tuntas_naik': [
    'Nilaimu terus meningkat dan kamu benar-benar menguasai materi ini. Pencapaian luar biasa!',
    'Kamu tumbuh dengan pesat. Pemahaman yang kamu tunjukkan sangat membanggakan.',
  ],
  'A_tuntas_pertama': [
    'Awal yang sangat impresif! Kamu langsung menunjukkan kemampuan terbaik sejak asesmen pertama.',
    'Langsung meraih predikat A — ini bukan kebetulan, ini hasil kerja keras yang nyata.',
  ],
  'A_tuntas_stabil': [
    'Konsisten di level teratas adalah pencapaian tersendiri. Kamu mempertahankan yang terbaik!',
    'Stabil di predikat A — kamu sudah menjadi benchmark bagi dirimu sendiri.',
  ],
  'A_tuntas_turun': [
    'Masih predikat A meski ada sedikit penurunan — nilaimu tetap sangat baik. Evaluasi kecil bisa membuatnya kembali naik.',
  ],
  // Predikat B
  'B_tuntas_naik': [
    'Nilaimu naik dan predikat B adalah capaian yang membanggakan. Kerja kerasmu terbayar!',
    'Ada progres nyata yang kamu tunjukkan. Semangat itu yang akan membawamu lebih tinggi lagi.',
  ],
  'B_tuntas_pertama': [
    'Predikat B di asesmen pertama — fondasi yang solid untuk terus berkembang!',
    'Awal yang baik. Kamu sudah menunjukkan pemahaman yang kuat atas materi ini.',
  ],
  'B_tuntas_stabil': [
    'Konsisten di predikat B adalah hal yang positif. Sekarang saatnya bidik predikat A!',
    'Kamu stabil dan sudah tuntas — tantangan selanjutnya adalah naik satu tingkat lagi.',
  ],
  'B_tuntas_turun': [
    'Kamu masih tuntas dan masih di predikat B. Ada penurunan kecil — yuk identifikasi bagian mana yang perlu lebih banyak latihan.',
  ],
  // Predikat C
  'C_tuntas_naik': [
    'Ada peningkatan yang terlihat jelas! Kamu sudah melampaui batas ketuntasan dan masih terus naik.',
    'Progresmu nyata — dari sebelumnya ke sekarang kamu sudah tumbuh.',
  ],
  'C_tuntas_pertama': [
    'Tuntas di asesmen pertama — ini sudah langkah yang tepat. Terus asah kemampuanmu!',
  ],
  'C_tuntas_stabil': [
    'Kamu konsisten melampaui KKTP. Stabilitas ini adalah modal bagus untuk terus naik.',
  ],
  'C_tuntas_turun': [
    'Ada penurunan kecil tapi kamu masih tuntas. Fokus pada bagian yang terasa sulit dan evaluasi cara belajarmu.',
  ],
  // Belum tuntas
  'default_belum_tuntas_naik': [
    'Ada progres yang terlihat — nilaimu naik! Ini sinyal positif bahwa kamu sudah di jalan yang benar.',
    'Meski belum tuntas, arah kamu sudah benar. Terus dengan semangat yang sama!',
  ],
  'default_belum_tuntas_pertama': [
    'Nilai ini bukan penilaian tentang dirimu, tapi tentang materi yang butuh lebih banyak latihan.',
    'Setiap orang punya ritme belajar berbeda. Yang penting kamu tidak berhenti mencoba.',
  ],
  'default_belum_tuntas': [
    'Setiap langkah belajar itu berharga, termasuk yang terasa belum sempurna. Mari evaluasi bersama.',
    'Ini bukan akhir — ini adalah data untuk strategi belajar yang lebih baik ke depan.',
  ],
  // Default fallback
  'default': [
    'Terus semangat belajar dan berikan yang terbaik di setiap langkah.',
    'Proses belajar adalah perjalanan, bukan tujuan. Kamu sudah melangkah!',
  ],
};

const BANK_TINDAKAN_TUNTAS = [
  'Bantu temanmu yang masih kesulitan — mengajari orang lain justru memperkuat pemahamanmu sendiri.',
  'Coba kerjakan soal-soal tingkat lebih tinggi untuk mempertajam kemampuanmu.',
  'Diskusikan materi ini lebih dalam dengan gurumu untuk mendapatkan perspektif baru.',
  'Jadikan pencapaian ini sebagai fondasi untuk menghadapi materi selanjutnya dengan percaya diri.',
];

const BANK_TINDAKAN_BELUM_TUNTAS: Record<string, string[]> = {
  PAI: [
    'Baca ulang materi yang menjadi fokus asesmen ini secara perlahan.',
    'Coba jelaskan konsep utamanya dengan kata-katamu sendiri untuk mengecek pemahamanmu.',
    'Tanyakan langsung ke guru PAI bagian mana yang masih terasa sulit.',
    'Ikuti program remedial jika tersedia — ini kesempatan, bukan hukuman.',
  ],
  DEFAULT: [
    'Identifikasi bagian materi mana yang paling sulit dan fokuskan latihan di sana.',
    'Kerjakan soal-soal latihan dari bab ini secara bertahap.',
    'Konsultasikan kesulitanmu dengan guru mapel — mereka siap membantu.',
    'Jadwalkan waktu belajar rutin agar materi bisa lebih terserap.',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function analisisNilai(data: NilaiAsesmen, mapel = 'PAI'): AnalisisNilai {
  // ── Lapisan 2: Posisi ──────────────────────────────────────
  const selisihRata = data.rataKelas !== null ? data.nilai - data.rataKelas : 0;
  const posisiKelas: PosisiKelas =
    data.rataKelas === null   ? 'rata_rata' :
    selisihRata > 5           ? 'di_atas'   :
    selisihRata < -5          ? 'di_bawah'  : 'rata_rata';

  const selisihPrev = data.nilaiSebelumnya !== null ? data.nilai - data.nilaiSebelumnya : 0;
  const trendNilai: TrendNilai =
    data.nilaiSebelumnya === null ? 'pertama' :
    selisihPrev > 0               ? 'naik'    :
    selisihPrev < 0               ? 'turun'   : 'stabil';

  // ── Lapisan 3: Refleksi ───────────────────────────────────
  const kondisiKey = data.statusTuntas
    ? `${data.predikat}_tuntas_${trendNilai}`
    : `default_belum_tuntas_${trendNilai}`;
  const refleksiArr =
    BANK_REFLEKSI[kondisiKey] ??
    BANK_REFLEKSI[`${data.predikat}_tuntas_stabil`] ??
    (data.statusTuntas ? undefined : BANK_REFLEKSI['default_belum_tuntas']) ??
    BANK_REFLEKSI['default']!;
  const refleksi = pickRandom(refleksiArr);

  // ── Lapisan 4: Tindakan ───────────────────────────────────
  const tindakanPool = data.statusTuntas
    ? BANK_TINDAKAN_TUNTAS
    : (BANK_TINDAKAN_BELUM_TUNTAS[mapel] ?? BANK_TINDAKAN_BELUM_TUNTAS['DEFAULT']!);
  // Ambil 2 saran acak tanpa duplikat
  const shuffled = [...tindakanPool].sort(() => Math.random() - 0.5);
  const tindakan = shuffled.slice(0, 2);

  // ── Lapisan 5: Motivasi & Konfeti Berdasarkan Rentang Nilai Islam ──
  let motivasiIslam: MotivasiIslam;
  let konfeti: ConfettiLevel;
  let konfetiEmoji: string;

  if (data.nilai >= 90) {
    motivasiIslam = {
      judul: 'MASYAALLAH, KEREN!',
      subjudul: 'Nilaimu luar biasa!',
      pesan: 'Alhamdulillah, hasil dari ikhtiarmu terlihat! Tetap tawaduk, jangan sombong, dan jadilah inspirasi bagi teman-temanmu.',
      callout: 'Syukuri prestasimu, terus tebarkan manfaat!',
      nilaiIslam: 'Syukur • Tawaduk • Berbagi',
    };
    konfeti = 'besar';
    konfetiEmoji = '';
  } else if (data.nilai >= 80) {
    motivasiIslam = {
      judul: 'ALHAMDULILLAH, MANTAP!',
      pesan: 'Kamu sudah berusaha dan hasilnya patut disyukuri. Jangan cepat puas, ya! Terus belajar dan istiqamah meningkatkan diri.',
      callout: 'Sedikit lagi, yuk naik level dengan ikhtiar!',
      nilaiIslam: 'Syukur • Istiqamah',
    };
    konfeti = 'sedang';
    konfetiEmoji = '';
  } else if (data.nilai >= 70) {
    motivasiIslam = {
      judul: 'NICE! TERUS BERPROSES!',
      pesan: 'Alhamdulillah, kamu sudah punya bekal yang baik. Jangan berhenti berikhtiar. Ilmu akan semakin bermanfaat kalau dipelajari dan diamalkan.',
      callout: 'Yuk, tambah semangat menuntut ilmu!',
      nilaiIslam: 'Menuntut ilmu • Istiqamah',
    };
    konfeti = 'kecil';
    konfetiEmoji = '';
  } else if (data.nilai >= 55) {
    motivasiIslam = {
      judul: 'SEMANGAT, PEJUANG ILMU!',
      pesan: 'Hasilmu masih bisa ditingkatkan. Jangan berkecil hati! Jadikan hasil ini bahan muhasabah. Perbaiki ikhtiar, tambah doa, dan coba lagi.',
      callout: 'Prosesmu belum selesai. Terus bertumbuh!',
      nilaiIslam: 'Muhasabah • Ikhtiar • Sabar',
    };
    konfeti = 'motivasi';
    konfetiEmoji = '';
  } else {
    motivasiIslam = {
      judul: 'JANGAN MENYERAH!',
      pesan: 'Belum sesuai harapan? Yuk, muhasabah! Allah mencintai hamba yang terus berusaha melakukan kebaikan. Jangan putus asa, perbaiki cara belajarmu dan bangkit lagi!',
      callout: 'Bismillah, saatnya bangkit dengan ikhtiar baru!',
      nilaiIslam: 'Muhasabah • Ikhtiar • Doa • Tawakal',
    };
    konfeti = 'motivasi';
    konfetiEmoji = '';
  }

  const pesan = motivasiIslam.pesan;

  return {
    ...data,
    trendNilai,
    posisiKelas,
    selisihRata,
    selisihPrev,
    refleksi,
    tindakan,
    pesan,
    konfeti,
    konfetiEmoji,
    motivasiIslam,
  };
}

// ── Format tanggal ISO → readable ───────────────────────────
export function formatTanggal(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  const bulan = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember',
  ];
  return `${d} ${bulan[(m ?? 1) - 1]} ${y}`;
}

// ── Format kode TA → label ───────────────────────────────────
export function labelTA(kode: string): string {
  if (kode.length === 4) {
    return `20${kode.slice(0,2)}/20${kode.slice(2)}`;
  }
  return kode;
}
