// src/lib/kokurikuler.ts
// Types dan fetcher untuk data Kokurikuler SMPN 5 Klaten
// Data source: Google Apps Script Web App → Google Sheets

// ── Types ──────────────────────────────────────────────────────────

export interface KokurikulerConfig {
  nama_kegiatan: string;
  tema: string;
  tahun_pelajaran: string;
  tanggal_kegiatan: string | null;
  destinasi_aktif: string;
  biaya: number;
  batas_pengumpulan_angket: string | null;
  kontak_nama: string;
  kontak_hp: string;
}

export interface Destinasi {
  nama_destinasi: string;
  tujuan_pembelajaran: string;
  dimensi_profil_lulusan: string;
  mapel_terkait: string;
  objek_kunjungan: string;
}

export interface RundownItem {
  waktu: string;
  kegiatan: string;
}

export interface FasilitasItem {
  kategori?: string;
  item_fasilitas: string;
}

export interface KursiSiswa {
  bus_id: string;
  nomor_kursi: string | number;
  nama_siswa: string;
  kelas: string;
}

export interface KelompokKerja {
  nama_kelompok: string;
  kelas: string;
  anggota: string; // koma-separated names
  sub_tema_objek_amatan: string;
  nama_pembimbing: string;
}

export interface TugasSiswa {
  tahap: 'Pra-Kegiatan' | 'Saat Pelaksanaan' | 'Pasca-Kegiatan';
  judul_tugas: string;
  deskripsi: string;
  kelompok_terkait: string | null;
}

export interface TataTertibItem {
  no: number;
  isi_tata_tertib: string;
}

export interface FaqItem {
  pertanyaan: string;
  jawaban: string;
}

export interface Penilaian {
  id?: string;
  nama_siswa: string;
  kelas: string;
  kelompok: string | null;
  dimensi: 'Penalaran Kritis' | 'Kolaborasi' | 'Komunikasi/Kreativitas';
  predikat: 'SB' | 'B' | 'C' | 'K';
  catatan?: string;
  dinilai_oleh: string;
  jenis_asesmen: 'Formatif' | 'Sumatif';
  tahun_kegiatan?: string;
  nama_kegiatan?: string;
  created_at?: string;
}

export interface KokurikulerData {
  config: KokurikulerConfig;
  destinasi: Destinasi[];
  rundown: RundownItem[];
  fasilitas: FasilitasItem[];
  tata_tertib: TataTertibItem[];
  faq: FaqItem[];
}

// ── Fetcher helpers ────────────────────────────────────────────────

const GAS_URL = process.env.GAS_KOKURIKULER_URL ?? '';

/** Fetch satu tab dari GAS dan kembalikan array data. */
async function fetchTab<T>(tab: string, revalidateSeconds = 120): Promise<T[]> {
  if (!GAS_URL || GAS_URL.includes('GANTI_SETELAH_DEPLOY')) {
    // GAS belum dikonfigurasi — kembalikan fallback kosong
    console.warn(`[kokurikuler] GAS_KOKURIKULER_URL belum diisi. Tab: ${tab}`);
    return [];
  }

  const url = `${GAS_URL}?tab=${encodeURIComponent(tab)}`;
  const res = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    console.error(`[kokurikuler] Gagal fetch tab "${tab}": HTTP ${res.status}`);
    return [];
  }

  const json = await res.json();
  return (json.data ?? []) as T[];
}

// ── Public fetchers ─────────────────────────────────────────────────

/** Fetch konfigurasi kegiatan (satu record dari tab config). */
export async function fetchKokurikulerConfig(): Promise<KokurikulerConfig | null> {
  const rows = await fetchTab<Record<string, string | number>>('config', 300);
  if (rows.length === 0) return null;

  // Tab config: key-value per baris (kolom A = nama_kolom, kolom B = nilai)
  // ATAU: satu header row + satu data row. Deteksi otomatis.
  const first = rows[0];
  if ('nama_kegiatan' in first) {
    // Format: header + 1 data row
    return first as unknown as KokurikulerConfig;
  }
  return null;
}

export async function fetchDestinasi(): Promise<Destinasi[]> {
  return fetchTab<Destinasi>('destinasi', 300);
}

export async function fetchRundown(): Promise<RundownItem[]> {
  return fetchTab<RundownItem>('rundown', 300);
}

export async function fetchFasilitas(): Promise<FasilitasItem[]> {
  return fetchTab<FasilitasItem>('fasilitas', 300);
}

export async function fetchKursi(): Promise<KursiSiswa[]> {
  return fetchTab<KursiSiswa>('kursi', 60);
}

export async function fetchKelompok(): Promise<KelompokKerja[]> {
  return fetchTab<KelompokKerja>('kelompok', 60);
}

export async function fetchTugasSiswa(): Promise<TugasSiswa[]> {
  return fetchTab<TugasSiswa>('tugas_siswa', 300);
}

export async function fetchTataTertib(): Promise<TataTertibItem[]> {
  return fetchTab<TataTertibItem>('tata_tertib', 3600);
}

export async function fetchFaq(): Promise<FaqItem[]> {
  return fetchTab<FaqItem>('faq', 3600);
}

/** Fetch semua data publik sekaligus (untuk halaman utama). */
export async function fetchAllKokurikulerData(): Promise<{
  config: KokurikulerConfig | null;
  destinasi: Destinasi[];
  rundown: RundownItem[];
  fasilitas: FasilitasItem[];
  tata_tertib: TataTertibItem[];
  faq: FaqItem[];
}> {
  const [config, destinasi, rundown, fasilitas, tata_tertib, faq] = await Promise.all([
    fetchKokurikulerConfig(),
    fetchDestinasi(),
    fetchRundown(),
    fetchFasilitas(),
    fetchTataTertib(),
    fetchFaq(),
  ]);

  return { config, destinasi, rundown, fasilitas, tata_tertib, faq };
}

// ── Label helpers ───────────────────────────────────────────────────

export const PREDIKAT_LABELS: Record<string, string> = {
  SB: 'Sangat Baik',
  B:  'Baik',
  C:  'Cukup',
  K:  'Kurang',
};

export const DIMENSI_LIST = [
  'Penalaran Kritis',
  'Kolaborasi',
  'Komunikasi/Kreativitas',
] as const;

export const RUBRIK: Record<string, Record<string, string>> = {
  'Penalaran Kritis': {
    SB: 'Analisis lengkap, logis, disertai contoh nyata',
    B:  'Analisis cukup logis, sebagian contoh nyata',
    C:  'Analisis mulai terlihat namun belum runtut',
    K:  'Belum menunjukkan analisis',
  },
  'Kolaborasi': {
    SB: 'Sangat aktif dan membantu anggota lain',
    B:  'Aktif menjalankan peran dalam kelompok',
    C:  'Terlibat namun perlu dorongan',
    K:  'Kurang terlibat dalam kelompok',
  },
  'Komunikasi/Kreativitas': {
    SB: 'Laporan/karya runtut, kreatif, mudah dipahami',
    B:  'Laporan/karya cukup runtut dan jelas',
    C:  'Laporan/karya mulai tersusun namun kurang jelas',
    K:  'Belum menyusun laporan/karya dengan baik',
  },
};
