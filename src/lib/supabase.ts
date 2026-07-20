// src/lib/supabase.ts
// Supabase client untuk browser (anon key) dan server (service role)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// ── Browser client (gunakan di "use client" pages) ──────────
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Server/Admin client (hanya gunakan di server-side / API routes) ──
// Jangan ekspos ke browser!
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-secret";
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ── Database Types ────────────────────────────────────────────
export type Role = "admin" | "siswa" | "pembina" | "walikelas";
export type StatusPendaftaran = "menunggu" | "disetujui" | "ditolak";
export type StatusAbsensi = "hadir" | "izin" | "alpa";
export type HasilLomba = "juara_1" | "juara_2" | "juara_3" | "harapan_1" | "harapan_2" | "harapan_3" | "peserta";
export type JenisLaporan = "daftar_hadir_siswa" | "jurnal_kegiatan" | "daftar_hadir_pelatih" | "bulanan" | "semester" | "tahunan" | "insidental";
export type StatusLaporan = "draft" | "terkirim" | "disetujui";

export interface UserProfile {
  id: string;
  nis_nip: string | null;
  nama_lengkap: string;
  role: Role;
  kelas_id: string | null;
  foto_url: string | null;
  created_at: string;
  kelas?: { nama_kelas: string; tingkat: number };
}

export interface Ekskul {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  jenis: "wajib" | "pilihan";
  jadwal: string;
  waktu: string;
  lokasi: string;
  emoji: string;
  deskripsi: string;
  pembina_id: string | null;
  nama_pelatih: string | null;
  kontak_pelatih: string | null;
  aktif: boolean;
}

export interface PeriodePendaftaran {
  id: string;
  ekskul_id: string | null;
  nama_periode: string;
  tanggal_buka: string;
  tanggal_tutup: string;
  aktif: boolean;
}

export interface Pendaftaran {
  id: string;
  siswa_id: string;
  ekskul_id: string;
  periode_id: string | null;
  status: StatusPendaftaran;
  catatan_pembina: string | null;
  tanggal_daftar: string;
  ekskul?: Ekskul;
  siswa?: UserProfile;
}

export interface SesiAbsensi {
  id: string;
  ekskul_id: string;
  pembina_id: string | null;
  tanggal: string;
  materi: string | null;
  pembina_hadir: boolean;
  pelatih_hadir: boolean;
  nama_pelatih_sesi: string | null;
}

export interface Absensi {
  id: string;
  sesi_id: string;
  siswa_id: string;
  ekskul_id: string;
  status: StatusAbsensi;
  keterangan: string | null;
  sesi?: SesiAbsensi;
  siswa?: UserProfile;
}

export interface Perlombaan {
  id: string;
  ekskul_id: string;
  nama_lomba: string;
  tingkat: string;
  penyelenggara: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  lokasi: string | null;
  nama_pelatih_lomba: string | null;
  pembina_id: string | null;
  created_at: string;
  ekskul?: Ekskul;
  peserta?: PesertaLomba[];
}

export interface PesertaLomba {
  id: string;
  lomba_id: string;
  siswa_id: string;
  hasil: HasilLomba;
  keterangan: string | null;
  siswa?: UserProfile;
}

export interface LaporanKegiatan {
  id: string;
  ekskul_id: string;
  pembina_id: string;
  nama_pelatih: string | null;
  jenis_laporan: JenisLaporan;
  periode_laporan: string;
  judul: string;
  isi_laporan: string | null;
  capaian: string | null;
  kendala: string | null;
  rencana_tindak_lanjut: string | null;
  jumlah_pertemuan: number;
  rata_kehadiran: number;
  status: StatusLaporan;
  disetujui_oleh: string | null;
  disetujui_at: string | null;
  created_at: string;
  updated_at: string;
  ekskul?: Ekskul;
  pembina?: UserProfile;
}

export interface FotoKegiatan {
  id: string;
  ekskul_id: string;
  sesi_id: string | null;
  lomba_id: string | null;
  storage_path: string;
  storage_url: string;
  keterangan: string | null;
  uploaded_by: string | null;
  created_at: string;
}
