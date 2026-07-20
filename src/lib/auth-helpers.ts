// src/lib/auth-helpers.ts
// Helper functions untuk autentikasi dan manajemen session

import { supabase } from "./supabase";
import type { UserProfile, Role } from "./supabase";

// ── Ambil user yang sedang login beserta profilnya ──────────
export async function getCurrentUser(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*, kelas(nama_kelas, tingkat)")
    .eq("id", user.id)
    .single();

  return profile as UserProfile | null;
}

// ── Login dengan NIS/NIP (dikonversi ke format email internal) ──
export async function loginWithNisNip(nisNip: string, password: string) {
  // Format email internal: [NIS/NIP]@sim.smpn5klaten
  const email = `${nisNip.trim()}@sim.smpn5klaten`;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

// ── Login dengan email langsung (untuk admin) ──────────────
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

// ── Logout ─────────────────────────────────────────────────
export async function logout() {
  await supabase.auth.signOut();
}

// ── Cek apakah user punya role tertentu ────────────────────
export async function requireRole(allowedRoles: Role[]): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Belum login");
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Akses ditolak. Role diperlukan: ${allowedRoles.join(" / ")}`);
  }
  return user;
}

// ── Cek apakah ada periode pendaftaran aktif ───────────────
export async function getPeriodeAktif(ekskulId?: string) {
  const now = new Date().toISOString();
  let query = supabase
    .from("periode_pendaftaran")
    .select("*")
    .eq("aktif", true)
    .lte("tanggal_buka", now)
    .gte("tanggal_tutup", now);

  if (ekskulId) {
    query = query.or(`ekskul_id.eq.${ekskulId},ekskul_id.is.null`);
  } else {
    query = query.is("ekskul_id", null);
  }

  const { data } = await query.limit(1).single();
  return data;
}

// ── Ambil ekskul milik pembina yang login ──────────────────
export async function getEkskulPembina(pembinaId: string) {
  const { data } = await supabase
    .from("ekskul")
    .select("*")
    .eq("pembina_id", pembinaId)
    .eq("aktif", true);
  return data ?? [];
}

// ── Hitung statistik absensi siswa per ekskul ──────────────
export async function getStatistikAbsensi(siswaId: string, ekskulId: string) {
  const { data } = await supabase
    .from("absensi")
    .select("status")
    .eq("siswa_id", siswaId)
    .eq("ekskul_id", ekskulId);

  const total = data?.length ?? 0;
  const hadir = data?.filter(a => a.status === "hadir").length ?? 0;
  const izin  = data?.filter(a => a.status === "izin").length ?? 0;
  const alpa  = data?.filter(a => a.status === "alpa").length ?? 0;
  const persen = total > 0 ? Math.round((hadir / total) * 100) : 0;

  return { total, hadir, izin, alpa, persen };
}

// ── Auto-hitung statistik untuk laporan (dari data absensi) ──
export async function getStatsForLaporan(ekskulId: string, bulan: string) {
  // bulan format: "2026-04" (YYYY-MM)
  const mulai = `${bulan}-01`;
  const akhir = `${bulan}-31`;

  const { data: sesi } = await supabase
    .from("sesi_absensi")
    .select("id")
    .eq("ekskul_id", ekskulId)
    .gte("tanggal", mulai)
    .lte("tanggal", akhir);

  const jumlahPertemuan = sesi?.length ?? 0;

  if (jumlahPertemuan === 0) return { jumlahPertemuan: 0, rataKehadiran: 0 };

  const sesiIds = sesi!.map(s => s.id);
  const { data: absenData } = await supabase
    .from("absensi")
    .select("status")
    .in("sesi_id", sesiIds);

  const total  = absenData?.length ?? 0;
  const hadir  = absenData?.filter(a => a.status === "hadir").length ?? 0;
  const rataKehadiran = total > 0 ? Math.round((hadir / total) * 100) : 0;

  return { jumlahPertemuan, rataKehadiran };
}
