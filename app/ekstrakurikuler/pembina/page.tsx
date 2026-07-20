"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import styles from "./pembina.module.css";
import { supabase } from "@/lib/supabase";
import { loginWithNisNip, logout, getEkskulPembina, getStatsForLaporan } from "@/lib/auth-helpers";
import {
  generateDaftarHadirSiswa,
  generateJurnalKegiatan,
  generateDaftarHadirPelatih,
  generateLaporanKegiatanPdf,
  printHtml,
} from "@/lib/pdf-laporan";
import type {
  UserProfile, Ekskul, Pendaftaran, SesiAbsensi,
  Perlombaan, LaporanKegiatan, JenisLaporan
} from "@/lib/supabase";
import {
  ClipboardList, CheckSquare, BarChart2, Trophy, FileText, Camera,
  Award, BookOpen, UserCheck, Calendar, School, Clock, MapPin, User,
  Check, X, AlertCircle, Save, Send, RefreshCw, Printer, Upload, Plus, ArrowRight
} from "lucide-react";

type Tab = "pendaftaran" | "absensi" | "rekap" | "lomba" | "laporan" | "foto";

const TABS: { id: Tab; label: string; Icon: any }[] = [
  { id: "pendaftaran", label: "Pendaftaran", Icon: ClipboardList },
  { id: "absensi",     label: "Absensi",     Icon: CheckSquare },
  { id: "rekap",       label: "Rekap",        Icon: BarChart2 },
  { id: "lomba",       label: "Perlombaan",   Icon: Trophy },
  { id: "laporan",     label: "Laporan",      Icon: FileText },
  { id: "foto",        label: "Foto",         Icon: Camera },
];

const HASIL_LOMBA = [
  { value: "juara_1",    label: "Juara 1", Icon: Trophy },
  { value: "juara_2",    label: "Juara 2", Icon: Trophy },
  { value: "juara_3",    label: "Juara 3", Icon: Trophy },
  { value: "harapan_1",  label: "Harapan 1", Icon: Award },
  { value: "harapan_2",  label: "Harapan 2", Icon: Award },
  { value: "harapan_3",  label: "Harapan 3", Icon: Award },
  { value: "peserta",    label: "Peserta", Icon: Award },
];

const JENIS_LAPORAN: { value: JenisLaporan; label: string }[] = [
  { value: "daftar_hadir_siswa",   label: "Daftar Hadir Siswa" },
  { value: "jurnal_kegiatan",      label: "Jurnal Kegiatan" },
  { value: "daftar_hadir_pelatih", label: "Daftar Hadir Pelatih & Pembina" },
  { value: "bulanan",              label: "Laporan Bulanan (Naratif)" },
  { value: "semester",             label: "Laporan Semester" },
];

export default function PembinaPage() {
  const [user, setUser]             = useState<UserProfile | null>(null);
  const [loading, setLoading]       = useState(true);
  const [loginNip, setLoginNip]     = useState("");
  const [loginPass, setLoginPass]   = useState("");
  const [loginErr, setLoginErr]     = useState("");
  const [loginLoad, setLoginLoad]   = useState(false);

  const [activeTab, setActiveTab]   = useState<Tab>("absensi");
  const [myEkskul, setMyEkskul]     = useState<Ekskul[]>([]);
  const [selEkskulId, setSelEkskulId] = useState("");

  // ── Pendaftaran state ──
  const [pendaftaran, setPendaftaran]   = useState<Pendaftaran[]>([]);
  const [pendLoad, setPendLoad]         = useState(false);
  const [pendMsg, setPendMsg]           = useState("");

  // ── Absensi state ──
  const [absenTanggal, setAbsenTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [absenMateri, setAbsenMateri]   = useState("");
  const [absenPelatih, setAbsenPelatih] = useState("");
  const [absenPelatihHadir, setAbsenPelatihHadir] = useState(false);
  const [siswaDaftar, setSiswaDaftar]   = useState<{ id: string; nama: string; kelas: string; status: "hadir"|"izin"|"alpa"; ket: string }[]>([]);
  const [absenLoad, setAbsenLoad]       = useState(false);
  const [absenMsg, setAbsenMsg]         = useState("");

  // ── Rekap state ──
  const [rekapBulan, setRekapBulan]     = useState(new Date().toISOString().slice(0, 7));
  const [rekapData, setRekapData]       = useState<{ siswa: UserProfile; hadir: number; izin: number; alpa: number; persen: number }[]>([]);
  const [rekapLoad, setRekapLoad]       = useState(false);

  // ── Lomba state ──
  const [lombaList, setLombaList]       = useState<Perlombaan[]>([]);
  const [lombaLoad, setLombaLoad]       = useState(false);
  const [showFormLomba, setShowFormLomba] = useState(false);
  const [formLomba, setFormLomba]       = useState({ nama_lomba: "", tingkat: "kota", penyelenggara: "", tanggal_mulai: "", tanggal_selesai: "", lokasi: "", nama_pelatih_lomba: "" });
  const [newLombaId, setNewLombaId]     = useState<string | null>(null);
  const [siswaPeserta, setSiswaPeserta] = useState<{ siswa_id: string; nama: string; hasil: string; ket: string; checked: boolean }[]>([]);
  const [lombaMsg, setLombaMsg]         = useState("");

  // ── Laporan state ──
  const [laporanList, setLaporanList]   = useState<LaporanKegiatan[]>([]);
  const [laporanLoad, setLaporanLoad]   = useState(false);
  const [showFormLap, setShowFormLap]   = useState(false);
  const [formLap, setFormLap]           = useState<Partial<LaporanKegiatan>>({
    jenis_laporan: "jurnal_kegiatan",
    periode_laporan: "",
    judul: "",
    nama_pelatih: "",
    isi_laporan: "",
    capaian: "",
    kendala: "",
    rencana_tindak_lanjut: "",
    status: "draft",
  });
  const [lapMsg, setLapMsg]             = useState("");
  const [rekapBulanLap, setRekapBulanLap] = useState(new Date().toISOString().slice(0, 7));

  // ── Foto state ──
  const [fotoList, setFotoList]         = useState<{ url: string; ket: string; id: string }[]>([]);
  const [fotoLoad, setFotoLoad]         = useState(false);
  const [fotoMsg, setFotoMsg]           = useState("");
  const [uploading, setUploading]       = useState(false);
  const [fotoKet, setFotoKet]           = useState("");

  // ────────────────────────────────────────────────────────────
  // INIT: Cek session
  // ────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase
        .from("users")
        .select("*, kelas(nama_kelas,tingkat)")
        .eq("id", authUser.id)
        .single();
      if (profile && (profile.role === "pembina" || profile.role === "admin")) {
        setUser(profile as UserProfile);
        const ekskul = await getEkskulPembina(authUser.id);
        setMyEkskul(ekskul as Ekskul[]);
        if (ekskul.length > 0) setSelEkskulId(ekskul[0].id);
      }
      setLoading(false);
    });
  }, []);

  // ────────────────────────────────────────────────────────────
  // LOGIN
  // ────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr(""); setLoginLoad(true);
    try {
      await loginWithNisNip(loginNip, loginPass);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Login gagal.");
      const { data: profile } = await supabase
        .from("users")
        .select("*, kelas(nama_kelas,tingkat)")
        .eq("id", authUser.id)
        .single();
      if (!profile || (profile.role !== "pembina" && profile.role !== "admin")) {
        await logout();
        throw new Error("Akun ini bukan pembina. Gunakan halaman yang sesuai.");
      }
      setUser(profile as UserProfile);
      const ekskul = await getEkskulPembina(authUser.id);
      setMyEkskul(ekskul as Ekskul[]);
      if (ekskul.length > 0) setSelEkskulId(ekskul[0].id);
    } catch (err: unknown) {
      setLoginErr(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoginLoad(false);
    }
  }

  // ────────────────────────────────────────────────────────────
  // PENDAFTARAN
  // ────────────────────────────────────────────────────────────
  const loadPendaftaran = useCallback(async () => {
    if (!selEkskulId) return;
    setPendLoad(true);
    const { data } = await supabase
      .from("pendaftaran")
      .select("*, siswa:siswa_id(id,nama_lengkap,nis_nip,kelas:kelas_id(nama_kelas))")
      .eq("ekskul_id", selEkskulId)
      .order("tanggal_daftar", { ascending: false });
    setPendaftaran((data ?? []) as unknown as Pendaftaran[]);
    setPendLoad(false);
  }, [selEkskulId]);

  async function updateStatusPendaftaran(id: string, status: "disetujui"|"ditolak", catatan: string) {
    setPendMsg("");
    const { error } = await supabase
      .from("pendaftaran")
      .update({ status, catatan_pembina: catatan })
      .eq("id", id);
    if (error) { setPendMsg("Gagal update: " + error.message); return; }
    setPendMsg(`Pendaftaran ${status === "disetujui" ? "disetujui" : "ditolak"}.`);
    loadPendaftaran();
  }

  // ────────────────────────────────────────────────────────────
  // ABSENSI
  // ────────────────────────────────────────────────────────────
  const loadSiswaUntukAbsensi = useCallback(async () => {
    if (!selEkskulId) return;
    setAbsenLoad(true); setAbsenMsg("");
    const { data } = await supabase
      .from("pendaftaran")
      .select("siswa:siswa_id(id,nama_lengkap,kelas:kelas_id(nama_kelas))")
      .eq("ekskul_id", selEkskulId)
      .eq("status", "disetujui");
    const list = (data ?? []).map((d: any) => ({
      id: d.siswa.id,
      nama: d.siswa.nama_lengkap,
      kelas: d.siswa.kelas?.nama_kelas ?? "-",
      status: "hadir" as const,
      ket: "",
    }));
    setSiswaDaftar(list);
    setAbsenLoad(false);
    if (list.length === 0) setAbsenMsg("Belum ada siswa yang disetujui di ekskul ini.");
  }, [selEkskulId]);

  async function simpanAbsensi() {
    if (!selEkskulId || siswaDaftar.length === 0) return;
    setAbsenLoad(true); setAbsenMsg("");
    // 1. Buat sesi
    const { data: sesi, error: sesiErr } = await supabase
      .from("sesi_absensi")
      .insert({
        ekskul_id: selEkskulId,
        pembina_id: user!.id,
        tanggal: absenTanggal,
        materi: absenMateri,
        pembina_hadir: true,
        pelatih_hadir: absenPelatihHadir,
        nama_pelatih_sesi: absenPelatih || null,
      })
      .select()
      .single();
    if (sesiErr) { setAbsenMsg("Gagal buat sesi: " + sesiErr.message); setAbsenLoad(false); return; }
    // 2. Simpan absensi siswa
    const rows = siswaDaftar.map(s => ({
      sesi_id: sesi.id,
      siswa_id: s.id,
      ekskul_id: selEkskulId,
      status: s.status,
      keterangan: s.ket || null,
    }));
    const { error: absenErr } = await supabase.from("absensi").insert(rows);
    if (absenErr) { setAbsenMsg("Gagal simpan absensi: " + absenErr.message); setAbsenLoad(false); return; }
    setAbsenMsg(`Absensi ${absenTanggal} berhasil disimpan! ${siswaDaftar.filter(s=>s.status==="hadir").length} hadir.`);
    setAbsenLoad(false);
  }

  // ────────────────────────────────────────────────────────────
  // REKAP KEHADIRAN
  // ────────────────────────────────────────────────────────────
  const loadRekap = useCallback(async () => {
    if (!selEkskulId) return;
    setRekapLoad(true);
    const mulai = `${rekapBulan}-01`;
    const akhir = `${rekapBulan}-31`;
    // Ambil semua sesi bulan ini
    const { data: sesiData } = await supabase
      .from("sesi_absensi")
      .select("id")
      .eq("ekskul_id", selEkskulId)
      .gte("tanggal", mulai).lte("tanggal", akhir);
    const sesiIds = (sesiData ?? []).map(s => s.id);
    if (sesiIds.length === 0) { setRekapData([]); setRekapLoad(false); return; }
    // Ambil absensi
    const { data: absenData } = await supabase
      .from("absensi")
      .select("siswa_id, status, siswa:siswa_id(id,nama_lengkap,kelas:kelas_id(nama_kelas))")
      .in("sesi_id", sesiIds);
    // Group by siswa
    const map = new Map<string, { siswa: UserProfile; hadir: number; izin: number; alpa: number }>();
    for (const a of (absenData ?? [])) {
      const key = (a as any).siswa_id;
      if (!map.has(key)) map.set(key, { siswa: (a as any).siswa, hadir: 0, izin: 0, alpa: 0 });
      const rec = map.get(key)!;
      if (a.status === "hadir") rec.hadir++;
      else if (a.status === "izin") rec.izin++;
      else rec.alpa++;
    }
    const result = Array.from(map.values()).map(r => {
      const total = r.hadir + r.izin + r.alpa;
      return { ...r, persen: total > 0 ? Math.round((r.hadir / total) * 100) : 0 };
    });
    result.sort((a, b) => b.persen - a.persen);
    setRekapData(result);
    setRekapLoad(false);
  }, [selEkskulId, rekapBulan]);

  // ────────────────────────────────────────────────────────────
  // LOMBA
  // ────────────────────────────────────────────────────────────
  const loadLomba = useCallback(async () => {
    if (!selEkskulId) return;
    setLombaLoad(true);
    const { data } = await supabase
      .from("perlombaan")
      .select("*, peserta_lomba(*, siswa:siswa_id(nama_lengkap))")
      .eq("ekskul_id", selEkskulId)
      .order("tanggal_mulai", { ascending: false });
    setLombaList((data ?? []) as unknown as Perlombaan[]);
    setLombaLoad(false);
  }, [selEkskulId]);

  async function simpanLomba() {
    if (!formLomba.nama_lomba) { setLombaMsg("Isi nama lomba."); return; }
    setLombaMsg("");
    const { data: lomba, error } = await supabase
      .from("perlombaan")
      .insert({ ...formLomba, ekskul_id: selEkskulId, pembina_id: user!.id })
      .select().single();
    if (error) { setLombaMsg("❌ " + error.message); return; }
    setNewLombaId(lomba.id);
    // Load siswa disetujui sebagai calon peserta
    const { data: pend } = await supabase
      .from("pendaftaran")
      .select("siswa:siswa_id(id,nama_lengkap)")
      .eq("ekskul_id", selEkskulId).eq("status", "disetujui");
    setSiswaPeserta((pend ?? []).map((p: any) => ({
      siswa_id: p.siswa.id,
      nama: p.siswa.nama_lengkap,
      hasil: "peserta",
      ket: "",
      checked: false,
    })));
    setLombaMsg("✅ Lomba tersimpan. Pilih peserta di bawah:");
    loadLomba();
  }

  async function simpanPeserta() {
    if (!newLombaId) return;
    const peserta = siswaPeserta.filter(s => s.checked);
    if (peserta.length === 0) { setLombaMsg("Centang minimal 1 siswa peserta."); return; }
    const rows = peserta.map(p => ({ lomba_id: newLombaId, siswa_id: p.siswa_id, hasil: p.hasil, keterangan: p.ket || null }));
    const { error } = await supabase.from("peserta_lomba").insert(rows);
    if (error) { setLombaMsg("❌ " + error.message); return; }
    setLombaMsg(`✅ ${peserta.length} peserta berhasil disimpan!`);
    setNewLombaId(null);
    setShowFormLomba(false);
    loadLomba();
  }

  // ────────────────────────────────────────────────────────────
  // LAPORAN
  // ────────────────────────────────────────────────────────────
  const loadLaporan = useCallback(async () => {
    if (!selEkskulId) return;
    setLaporanLoad(true);
    const { data } = await supabase
      .from("laporan_kegiatan")
      .select("*, ekskul:ekskul_id(nama,emoji)")
      .eq("ekskul_id", selEkskulId)
      .order("created_at", { ascending: false });
    setLaporanList((data ?? []) as unknown as LaporanKegiatan[]);
    setLaporanLoad(false);
  }, [selEkskulId]);

  async function autoFillStats() {
    if (!selEkskulId) return;
    const { jumlahPertemuan, rataKehadiran } = await getStatsForLaporan(selEkskulId, rekapBulanLap);
    setFormLap(prev => ({ ...prev, jumlah_pertemuan: jumlahPertemuan, rata_kehadiran: rataKehadiran }));
  }

  async function simpanLaporan(status: "draft"|"terkirim") {
    if (!formLap.judul || !formLap.periode_laporan) { setLapMsg("Isi judul dan periode laporan."); return; }
    setLapMsg("");
    const payload = {
      ...formLap,
      ekskul_id: selEkskulId,
      pembina_id: user!.id,
      status,
    };
    const { error } = await supabase.from("laporan_kegiatan").insert(payload);
    if (error) { setLapMsg("Gagal menyimpan: " + error.message); return; }
    setLapMsg(status === "draft" ? "Tersimpan sebagai draft." : "Laporan terkirim ke admin.");
    setShowFormLap(false);
    loadLaporan();
  }

  async function printLaporan(jenis: JenisLaporan) {
    if (!selEkskulId) return;
    const ekskul = myEkskul.find(e => e.id === selEkskulId);
    if (!ekskul) return;
    const mulai = `${rekapBulanLap}-01`;
    const akhir = `${rekapBulanLap}-31`;
    const [bln, thn] = rekapBulanLap.split("-");
    const bulanNames = ["","Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const bulanStr = `${bulanNames[parseInt(bln)]} ${thn}`;

    const { data: sesiData } = await supabase
      .from("sesi_absensi")
      .select("*")
      .eq("ekskul_id", selEkskulId)
      .gte("tanggal", mulai).lte("tanggal", akhir)
      .order("tanggal");
    const sesi = (sesiData ?? []) as SesiAbsensi[];
    const namaPembina = user?.nama_lengkap ?? "Pembina";
    const nipPembina = "NIP. " + (user?.nis_nip ?? "-");
    const semester = parseInt(bln) <= 6 ? "Semester Genap" : "Semester Ganjil";
    const namaPelatih = formLap.nama_pelatih || ekskul.nama_pelatih || undefined;

    if (jenis === "daftar_hadir_siswa") {
      const sesiIds = sesi.map(s => s.id);
      const { data: siswaPend } = await supabase
        .from("pendaftaran")
        .select("siswa:siswa_id(id,nama_lengkap,kelas:kelas_id(nama_kelas))")
        .eq("ekskul_id", selEkskulId).eq("status", "disetujui");
      const siswaList = (siswaPend ?? []).map((p: any) => p.siswa) as UserProfile[];
      const { data: absenData } = await supabase.from("absensi").select("*").in("sesi_id", sesiIds);
      printHtml(generateDaftarHadirSiswa({ ekskul, bulan: bulanStr, tahunAjaran: "2025/2026", siswa: siswaList, sesi, absensi: absenData ?? [], namaPembina, nipPembina, namaPelatih }));
    } else if (jenis === "jurnal_kegiatan") {
      printHtml(generateJurnalKegiatan({ ekskul, bulan: bulanStr, semester, tahunAjaran: "2025/2026", sesi, namaPembina, nipPembina, namaPelatih }));
    } else if (jenis === "daftar_hadir_pelatih") {
      printHtml(generateDaftarHadirPelatih({ ekskul, bulan: bulanStr, semester, tahunAjaran: "2025/2026", sesi, namaPembina, nipPembina, namaPelatih }));
    }
  }

  function printLaporanKegiatan(l: LaporanKegiatan) {
    if (!selEkskulId) return;
    const ekskul = myEkskul.find(e => e.id === selEkskulId);
    if (!ekskul) return;
    const namaPembina = user?.nama_lengkap ?? "Pembina";
    const nipPembina = "NIP. " + (user?.nis_nip ?? "-");
    printHtml(generateLaporanKegiatanPdf({ ekskul, laporan: l, namaPembina, nipPembina }));
  }

  // ────────────────────────────────────────────────────────────
  // FOTO
  // ────────────────────────────────────────────────────────────
  const loadFoto = useCallback(async () => {
    if (!selEkskulId) return;
    setFotoLoad(true);
    const { data } = await supabase
      .from("foto_kegiatan")
      .select("id,storage_url,keterangan")
      .eq("ekskul_id", selEkskulId)
      .order("created_at", { ascending: false });
    setFotoList((data ?? []).map((f: any) => ({ id: f.id, url: f.storage_url, ket: f.keterangan ?? "" })));
    setFotoLoad(false);
  }, [selEkskulId]);

  async function uploadFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selEkskulId) return;
    setUploading(true); setFotoMsg("");
    const ext = file.name.split(".").pop();
    const path = `ekskul/${selEkskulId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("ekskul-foto").upload(path, file);
    if (upErr) { setFotoMsg("Upload gagal: " + upErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("ekskul-foto").getPublicUrl(path);
    const { error: dbErr } = await supabase.from("foto_kegiatan").insert({
      ekskul_id: selEkskulId,
      storage_path: path,
      storage_url: publicUrl,
      keterangan: fotoKet || null,
      uploaded_by: user!.id,
    });
    if (dbErr) { setFotoMsg("Simpan data gagal: " + dbErr.message); setUploading(false); return; }
    setFotoMsg("Foto berhasil diupload.");
    setFotoKet("");
    loadFoto();
    setUploading(false);
  }

  // ── Load data saat tab/ekskul berubah ──
  useEffect(() => {
    if (!user || !selEkskulId) return;
    if (activeTab === "pendaftaran") loadPendaftaran();
    if (activeTab === "absensi") loadSiswaUntukAbsensi();
    if (activeTab === "rekap") loadRekap();
    if (activeTab === "lomba") loadLomba();
    if (activeTab === "laporan") loadLaporan();
    if (activeTab === "foto") loadFoto();
  }, [activeTab, selEkskulId, user, loadPendaftaran, loadSiswaUntukAbsensi, loadRekap, loadLomba, loadLaporan, loadFoto]);

  // ────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────
  if (loading) return (
    <main><Header activePage="Ekskul" />
      <div className={styles.loadingWrap}><div className={styles.spinner} /><p>Memuat...</p></div>
    </main>
  );

  // ── LOGIN PAGE ──
  if (!user) return (
    <main>
      <Header activePage="Ekskul" />
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <div className={styles.loginIcon}><School size={48} color="#944535" /></div>
          <h1 className={styles.loginTitle}>Area Pembina</h1>
          <p className={styles.loginDesc}>Login dengan NIP dan password untuk mengelola ekskul.</p>
          {loginErr && <div className={styles.alertError}>{loginErr}</div>}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="nip">NIP</label>
              <input id="nip" type="text" className={styles.input} placeholder="Nomor Induk Pegawai" value={loginNip} onChange={e => setLoginNip(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pass">Password</label>
              <input id="pass" type="password" className={styles.input} placeholder="Password" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
            </div>
            <button className={styles.btnSubmit} type="submit" disabled={loginLoad} id="btn-login-pembina">
              {loginLoad ? <span className={styles.spinnerSm} /> : <span style={{display:"inline-flex",alignItems:"center",gap:6}}>Masuk <ArrowRight size={16} /></span>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );

  // ── DASHBOARD ──
  const ekskulAktif = myEkskul.find(e => e.id === selEkskulId);

  return (
    <main>
      <Header activePage="Ekskul" />
      <div className={styles.dashWrap}>

        {/* ── Top Bar ── */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.avatar}>{user.nama_lengkap.charAt(0)}</div>
            <div>
              <div className={styles.userName}>{user.nama_lengkap}</div>
              <div className={styles.userRole}>Pembina Ekstrakurikuler · NIP {user.nis_nip}</div>
            </div>
          </div>
          <div className={styles.topBarRight}>
            {myEkskul.length > 1 && (
              <select className={styles.ekskulSelect} value={selEkskulId} onChange={e => setSelEkskulId(e.target.value)}>
                {myEkskul.map(e => <option key={e.id} value={e.id}>{e.emoji} {e.nama}</option>)}
              </select>
            )}
            <button className={styles.btnLogout} onClick={async () => { await logout(); setUser(null); }}>Keluar</button>
          </div>
        </div>

        {/* ── Ekskul Info Strip ── */}
        {ekskulAktif && (
          <div className={styles.ekskulStrip}>
            <span className={styles.ekskulEmoji}>{ekskulAktif.emoji}</span>
            <div>
              <div className={styles.ekskulNama}>{ekskulAktif.nama}</div>
              <div className={styles.ekskulInfo} style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:4}}><Calendar size={14} /> {ekskulAktif.jadwal}</span> · <span style={{display:"inline-flex",alignItems:"center",gap:4}}><Clock size={14} /> {ekskulAktif.waktu}</span> · <span style={{display:"inline-flex",alignItems:"center",gap:4}}><MapPin size={14} /> {ekskulAktif.lokasi}</span>
                {ekskulAktif.nama_pelatih && <span style={{display:"inline-flex",alignItems:"center",gap:4}}>· <User size={14} /> Pelatih: {ekskulAktif.nama_pelatih}</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className={styles.tabBar}>
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} className={`${styles.tabBtn} ${activeTab === id ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab(id)}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>

          {/* ─────────── TAB: PENDAFTARAN ─────────── */}
          {activeTab === "pendaftaran" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><ClipboardList size={22} /> Kelola Pendaftaran</h2>
              {pendMsg && <div className={styles.alertInfo}>{pendMsg}</div>}
              <button className={styles.btnRefresh} onClick={loadPendaftaran} style={{display:"inline-flex",alignItems:"center",gap:6}}><RefreshCw size={14} /> Refresh</button>
              {pendLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr>
                      <th>Nama Siswa</th><th>Kelas</th><th>Tgl Daftar</th><th>Status</th><th>Aksi</th>
                    </tr></thead>
                    <tbody>
                      {pendaftaran.length === 0
                        ? <tr><td colSpan={5} className={styles.emptyRow}>Belum ada pendaftaran.</td></tr>
                        : pendaftaran.map(p => {
                          const siswa = (p as any).siswa;
                          return (
                            <tr key={p.id}>
                              <td>{siswa?.nama_lengkap ?? "-"}</td>
                              <td>{siswa?.kelas?.nama_kelas ?? "-"}</td>
                              <td>{new Date(p.tanggal_daftar).toLocaleDateString("id-ID")}</td>
                              <td><span className={`${styles.badge} ${styles["badge_" + p.status]}`}>{p.status}</span></td>
                              <td>
                                {p.status === "menunggu" && <>
                                  <button className={styles.btnSetujui} onClick={() => updateStatusPendaftaran(p.id, "disetujui", "")} style={{display:"inline-flex",alignItems:"center",gap:4}}><Check size={14} /> Setuju</button>
                                  <button className={styles.btnTolak} onClick={() => updateStatusPendaftaran(p.id, "ditolak", "")} style={{display:"inline-flex",alignItems:"center",gap:4}}><X size={14} /> Tolak</button>
                                </>}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ─────────── TAB: ABSENSI ─────────── */}
          {activeTab === "absensi" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><CheckSquare size={22} /> Input Absensi</h2>
              <div className={styles.absenForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tanggal Pertemuan</label>
                    <input type="date" className={styles.input} value={absenTanggal} onChange={e => setAbsenTanggal(e.target.value)} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Materi / Kegiatan</label>
                    <input type="text" className={styles.input} placeholder="Cth: Latihan dasar futsal" value={absenMateri} onChange={e => setAbsenMateri(e.target.value)} />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Nama Pelatih (opsional)</label>
                    <input type="text" className={styles.input} placeholder="Nama pelatih sesi ini" value={absenPelatih} onChange={e => setAbsenPelatih(e.target.value)} />
                  </div>
                  <div className={styles.formGroupCheck}>
                    <input type="checkbox" id="pelatih-hadir" checked={absenPelatihHadir} onChange={e => setAbsenPelatihHadir(e.target.checked)} />
                    <label htmlFor="pelatih-hadir" className={styles.label}>Pelatih hadir sesi ini</label>
                  </div>
                </div>
              </div>
              {absenMsg && <div className={`${styles.alertInfo} ${absenMsg.startsWith("Absensi") ? styles.alertSuccess : ""}`}>{absenMsg}</div>}
              {absenLoad ? <div className={styles.loadRow}>Memuat data siswa...</div> : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>No</th><th>Nama Siswa</th><th>Kelas</th><th>Status</th><th>Keterangan</th></tr></thead>
                    <tbody>
                      {siswaDaftar.length === 0
                        ? <tr><td colSpan={5} className={styles.emptyRow}>Tidak ada siswa. Pastikan pendaftaran sudah disetujui.</td></tr>
                        : siswaDaftar.map((s, i) => (
                          <tr key={s.id}>
                            <td>{i + 1}</td>
                            <td>{s.nama}</td>
                            <td>{s.kelas}</td>
                            <td>
                              <div className={styles.radioGroup}>
                                {(["hadir","izin","alpa"] as const).map(st => (
                                  <label key={st} className={`${styles.radioLabel} ${s.status === st ? styles["radio_"+st] : ""}`}>
                                    <input type="radio" name={`status-${s.id}`} value={st} checked={s.status === st}
                                      onChange={() => setSiswaDaftar(prev => prev.map((x,j) => j===i ? {...x,status:st} : x))} />
                                    {st}
                                  </label>
                                ))}
                              </div>
                            </td>
                            <td>
                              <input type="text" className={styles.inputSm} placeholder="Keterangan" value={s.ket}
                                onChange={e => setSiswaDaftar(prev => prev.map((x,j) => j===i ? {...x,ket:e.target.value} : x))} />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
              <button className={styles.btnPrimary} onClick={simpanAbsensi} disabled={absenLoad || siswaDaftar.length === 0} id="btn-simpan-absensi" style={{display:"inline-flex",alignItems:"center",gap:6}}>
                <Save size={16} /> Simpan Absensi
              </button>
            </div>
          )}

          {/* ─────────── TAB: REKAP ─────────── */}
          {activeTab === "rekap" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><BarChart2 size={22} /> Rekap Kehadiran</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Pilih Bulan</label>
                  <input type="month" className={styles.input} value={rekapBulan} onChange={e => setRekapBulan(e.target.value)} />
                </div>
                <button className={styles.btnSecondary} onClick={loadRekap}>Tampilkan</button>
              </div>
              {rekapLoad ? <div className={styles.loadRow}>Memuat rekap...</div> : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Nama</th><th>Kelas</th><th>Hadir</th><th>Izin</th><th>Alpa</th><th>%</th><th>Status</th></tr></thead>
                    <tbody>
                      {rekapData.length === 0
                        ? <tr><td colSpan={7} className={styles.emptyRow}>Belum ada data absensi bulan ini.</td></tr>
                        : rekapData.map(r => (
                          <tr key={r.siswa.id} className={r.persen < 75 ? styles.rowDanger : ""}>
                            <td>{r.siswa.nama_lengkap}</td>
                            <td>{(r.siswa as any).kelas?.nama_kelas ?? "-"}</td>
                            <td className={styles.tdHadir}>{r.hadir}</td>
                            <td className={styles.tdIzin}>{r.izin}</td>
                            <td className={styles.tdAlpa}>{r.alpa}</td>
                            <td>
                              <div className={styles.progressWrap}>
                                <div className={styles.progressBar} style={{ width: `${r.persen}%`, background: r.persen < 75 ? "#ba1a1a" : r.persen >= 85 ? "#006b5f" : "#944535" }} />
                              </div>
                              <span className={r.persen < 75 ? styles.pctDanger : styles.pctOk}>{r.persen}%</span>
                            </td>
                            <td><span className={`${styles.badge} ${r.persen < 75 ? styles.badge_ditolak : styles.badge_disetujui}`} style={{display:"inline-flex",alignItems:"center",gap:4}}>{r.persen < 75 ? <><AlertCircle size={14} /> Rendah</> : <><Check size={14} /> Baik</>}</span></td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ─────────── TAB: LOMBA ─────────── */}
          {activeTab === "lomba" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><Trophy size={22} /> Perlombaan</h2>
                <button className={styles.btnPrimary} onClick={() => { setShowFormLomba(true); setNewLombaId(null); setFormLomba({ nama_lomba:"",tingkat:"kota",penyelenggara:"",tanggal_mulai:"",tanggal_selesai:"",lokasi:"",nama_pelatih_lomba:"" }); }} style={{display:"inline-flex",alignItems:"center",gap:6}}>
                  <Plus size={16} /> Tambah Lomba
                </button>
              </div>
              {lombaMsg && <div className={styles.alertInfo}>{lombaMsg}</div>}
              {showFormLomba && !newLombaId && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>Form Perlombaan Baru</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>Nama Lomba *</label><input className={styles.input} value={formLomba.nama_lomba} onChange={e=>setFormLomba(p=>({...p,nama_lomba:e.target.value}))} placeholder="Futsal Liga Pelajar 2025" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Tingkat *</label>
                      <select className={styles.input} value={formLomba.tingkat} onChange={e=>setFormLomba(p=>({...p,tingkat:e.target.value}))}>
                        {["sekolah","kecamatan","kota","provinsi","nasional","internasional"].map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className={styles.formGroup}><label className={styles.label}>Penyelenggara</label><input className={styles.input} value={formLomba.penyelenggara} onChange={e=>setFormLomba(p=>({...p,penyelenggara:e.target.value}))} placeholder="Diknas Klaten" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Nama Pelatih Pendamping</label><input className={styles.input} value={formLomba.nama_pelatih_lomba} onChange={e=>setFormLomba(p=>({...p,nama_pelatih_lomba:e.target.value}))} placeholder="Nama pelatih yang mendampingi" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Tanggal Mulai</label><input type="date" className={styles.input} value={formLomba.tanggal_mulai} onChange={e=>setFormLomba(p=>({...p,tanggal_mulai:e.target.value}))} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Tanggal Selesai</label><input type="date" className={styles.input} value={formLomba.tanggal_selesai} onChange={e=>setFormLomba(p=>({...p,tanggal_selesai:e.target.value}))} /></div>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}><label className={styles.label}>Lokasi</label><input className={styles.input} value={formLomba.lokasi} onChange={e=>setFormLomba(p=>({...p,lokasi:e.target.value}))} placeholder="Lapangan / Gedung / Kota" /></div>
                  </div>
                  <div className={styles.formActions}>
                    <button className={styles.btnPrimary} onClick={simpanLomba} id="btn-simpan-lomba" style={{display:"inline-flex",alignItems:"center",gap:6}}>Simpan & Pilih Peserta <ArrowRight size={16} /></button>
                    <button className={styles.btnSecondary} onClick={() => setShowFormLomba(false)}>Batal</button>
                  </div>
                </div>
              )}
              {/* Pilih peserta */}
              {newLombaId && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>Pilih Siswa Peserta & Hasil</h3>
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead><tr><th>✓</th><th>Nama</th><th>Hasil</th><th>Keterangan</th></tr></thead>
                      <tbody>
                        {siswaPeserta.map((s,i) => (
                          <tr key={s.siswa_id}>
                            <td><input type="checkbox" checked={s.checked} onChange={e=>setSiswaPeserta(p=>p.map((x,j)=>j===i?{...x,checked:e.target.checked}:x))} /></td>
                            <td>{s.nama}</td>
                            <td>
                              <select className={styles.inputSm} value={s.hasil} onChange={e=>setSiswaPeserta(p=>p.map((x,j)=>j===i?{...x,hasil:e.target.value}:x))}>
                                {HASIL_LOMBA.map(h=><option key={h.value} value={h.value}>{h.label}</option>)}
                              </select>
                            </td>
                            <td><input type="text" className={styles.inputSm} value={s.ket} onChange={e=>setSiswaPeserta(p=>p.map((x,j)=>j===i?{...x,ket:e.target.value}:x))} placeholder="Medali, catatan, dll" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button className={styles.btnPrimary} onClick={simpanPeserta} id="btn-simpan-peserta" style={{display:"inline-flex",alignItems:"center",gap:6}}><Save size={16} /> Simpan Peserta</button>
                </div>
              )}
              {/* Daftar Lomba */}
              {lombaLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.lombaList}>
                  {lombaList.length === 0 && <div className={styles.emptyState}>Belum ada data perlombaan. Klik "+ Tambah Lomba" untuk memulai.</div>}
                  {lombaList.map(l => (
                    <div key={l.id} className={styles.lombaCard}>
                      <div className={styles.lombaCardHeader}>
                        <div>
                          <div className={styles.lombaNama}>{l.nama_lomba}</div>
                          <div className={styles.lombaInfo} style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}><Award size={14} /> {l.tingkat}</span> · <span style={{display:"inline-flex",alignItems:"center",gap:4}}><MapPin size={14} /> {l.lokasi ?? "-"}</span> · <span style={{display:"inline-flex",alignItems:"center",gap:4}}><Calendar size={14} /> {l.tanggal_mulai ?? "-"}</span></div>
                          {l.nama_pelatih_lomba && <div className={styles.lombaInfo} style={{display:"inline-flex",alignItems:"center",gap:4}}><User size={14} /> Pelatih: {l.nama_pelatih_lomba}</div>}
                        </div>
                        <span className={styles.badge} style={{background:"#FAD6A6",color:"#7a382a"}}>{l.penyelenggara}</span>
                      </div>
                      {(l as any).peserta_lomba?.length > 0 && (
                        <div className={styles.pesertaWrap}>
                          {(l as any).peserta_lomba.map((p: any) => (
                            <span key={p.id} className={styles.pesertaBadge}>
                              {HASIL_LOMBA.find(h=>h.value===p.hasil)?.label.split(" ")[0]} {p.siswa?.nama_lengkap}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─────────── TAB: LAPORAN ─────────── */}
          {activeTab === "laporan" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><FileText size={22} /> Laporan Kegiatan</h2>
                <button className={styles.btnPrimary} onClick={() => setShowFormLap(true)} style={{display:"inline-flex",alignItems:"center",gap:6}}><Plus size={16} /> Buat Laporan</button>
              </div>
              {lapMsg && <div className={styles.alertInfo}>{lapMsg}</div>}

              {/* Cetak 3 Format Resmi */}
              <div className={styles.printSection}>
                <h3 className={styles.printTitle} style={{display:"flex",alignItems:"center",gap:8}}><Printer size={20} /> Cetak Dokumen Resmi</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Periode (bulan)</label>
                    <input type="month" className={styles.input} value={rekapBulanLap} onChange={e => setRekapBulanLap(e.target.value)} />
                  </div>
                </div>
                <div className={styles.printBtns}>
                  <button className={styles.btnPrint} onClick={() => printLaporan("daftar_hadir_siswa")} id="btn-print-hadir-siswa" style={{display:"inline-flex",alignItems:"center",gap:6}}><ClipboardList size={16} /> Daftar Hadir Siswa</button>
                  <button className={styles.btnPrint} onClick={() => printLaporan("jurnal_kegiatan")} id="btn-print-jurnal" style={{display:"inline-flex",alignItems:"center",gap:6}}><BookOpen size={16} /> Jurnal Kegiatan</button>
                  <button className={styles.btnPrint} onClick={() => printLaporan("daftar_hadir_pelatih")} id="btn-print-hadir-pelatih" style={{display:"inline-flex",alignItems:"center",gap:6}}><UserCheck size={16} /> Daftar Hadir Pelatih</button>
                </div>
              </div>

              {/* Form Laporan Naratif */}
              {showFormLap && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>Buat Laporan Kegiatan</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Jenis Laporan *</label>
                      <select className={styles.input} value={formLap.jenis_laporan} onChange={e=>setFormLap(p=>({...p,jenis_laporan:e.target.value as JenisLaporan}))}>
                        {JENIS_LAPORAN.map(j=><option key={j.value} value={j.value}>{j.label}</option>)}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Periode *</label>
                      <input className={styles.input} value={formLap.periode_laporan} onChange={e=>setFormLap(p=>({...p,periode_laporan:e.target.value}))} placeholder="April 2026 / Semester 1 2025/2026" />
                    </div>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}>
                      <label className={styles.label}>Judul Laporan *</label>
                      <input className={styles.input} value={formLap.judul} onChange={e=>setFormLap(p=>({...p,judul:e.target.value}))} placeholder="Laporan Bulanan Futsal April 2026" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nama Pelatih</label>
                      <input className={styles.input} value={formLap.nama_pelatih ?? ""} onChange={e=>setFormLap(p=>({...p,nama_pelatih:e.target.value}))} placeholder="Nama pelatih yang mendampingi" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Statistik Otomatis</label>
                      <div className={styles.statAutoRow}>
                        <span>Pertemuan: {(formLap as any).jumlah_pertemuan ?? 0} · Kehadiran: {(formLap as any).rata_kehadiran ?? 0}%</span>
                        <button type="button" className={styles.btnSecondary} onClick={autoFillStats} style={{display:"inline-flex",alignItems:"center",gap:4}}><RefreshCw size={14} /> Hitung dari data</button>
                      </div>
                    </div>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}><label className={styles.label}>Narasi Kegiatan</label><textarea className={styles.textarea} rows={4} value={formLap.isi_laporan ?? ""} onChange={e=>setFormLap(p=>({...p,isi_laporan:e.target.value}))} placeholder="Uraikan kegiatan yang dilakukan selama periode ini..." /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Capaian</label><textarea className={styles.textarea} rows={2} value={formLap.capaian ?? ""} onChange={e=>setFormLap(p=>({...p,capaian:e.target.value}))} placeholder="Prestasi dan pencapaian..." /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Kendala</label><textarea className={styles.textarea} rows={2} value={formLap.kendala ?? ""} onChange={e=>setFormLap(p=>({...p,kendala:e.target.value}))} placeholder="Hambatan yang dihadapi..." /></div>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}><label className={styles.label}>Rencana Tindak Lanjut</label><textarea className={styles.textarea} rows={2} value={formLap.rencana_tindak_lanjut ?? ""} onChange={e=>setFormLap(p=>({...p,rencana_tindak_lanjut:e.target.value}))} placeholder="Langkah ke depan..." /></div>
                  </div>
                  <div className={styles.formActions}>
                    <button className={styles.btnSecondary} onClick={() => simpanLaporan("draft")} id="btn-simpan-draft" style={{display:"inline-flex",alignItems:"center",gap:6}}><Save size={16} /> Simpan Draft</button>
                    <button className={styles.btnPrimary} onClick={() => simpanLaporan("terkirim")} id="btn-kirim-laporan" style={{display:"inline-flex",alignItems:"center",gap:6}}><Send size={16} /> Kirim ke Admin</button>
                    <button className={styles.btnLogout} onClick={() => setShowFormLap(false)}>Batal</button>
                  </div>
                </div>
              )}

              {/* Riwayat Laporan */}
              {laporanLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.laporanList}>
                  <h3 className={styles.subTitle}>Riwayat Laporan</h3>
                  {laporanList.length === 0 && <div className={styles.emptyState}>Belum ada laporan dibuat.</div>}
                  {laporanList.map(l => (
                    <div key={l.id} className={styles.laporanCard}>
                      <div className={styles.laporanCardTop}>
                        <div>
                          <div className={styles.laporanJudul}>{l.judul}</div>
                          <div className={styles.laporanMeta}>{l.jenis_laporan} · {l.periode_laporan} · {l.jumlah_pertemuan} pertemuan · {l.rata_kehadiran}% hadir</div>
                          {l.nama_pelatih && <div className={styles.laporanMeta} style={{display:"inline-flex",alignItems:"center",gap:4}}><User size={14} /> {l.nama_pelatih}</div>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <button type="button" className={styles.btnSecondary} onClick={() => printLaporanKegiatan(l)} title="Cetak Resmi ke PDF" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",fontSize:"0.8rem"}}>
                            <Printer size={14} /> Cetak
                          </button>
                          <span className={`${styles.badge} ${l.status === "disetujui" ? styles.badge_disetujui : l.status === "terkirim" ? styles.badge_menunggu : styles.badge_draft}`}>{l.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─────────── TAB: FOTO ─────────── */}
          {activeTab === "foto" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><Camera size={22} /> Foto Kegiatan</h2>
              <div className={styles.fotoUploadBox}>
                <label className={styles.label}>Keterangan Foto</label>
                <input className={styles.input} value={fotoKet} onChange={e => setFotoKet(e.target.value)} placeholder="Latihan rutin / lomba / dll" />
                <label className={styles.btnUpload} htmlFor="foto-input" style={{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                  {uploading ? <><Clock size={16} /> Mengupload...</> : <><Upload size={16} /> Pilih & Upload Foto</>}
                  <input id="foto-input" type="file" accept="image/*" style={{display:"none"}} onChange={uploadFoto} disabled={uploading} />
                </label>
                {fotoMsg && <div className={styles.alertInfo}>{fotoMsg}</div>}
              </div>
              {fotoLoad ? <div className={styles.loadRow}>Memuat foto...</div> : (
                <div className={styles.fotoGrid}>
                  {fotoList.length === 0 && <div className={styles.emptyState}>Belum ada foto kegiatan.</div>}
                  {fotoList.map(f => (
                    <div key={f.id} className={styles.fotoCard}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.url} alt={f.ket} className={styles.fotoImg} />
                      {f.ket && <div className={styles.fotoKet}>{f.ket}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
