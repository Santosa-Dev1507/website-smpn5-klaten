"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import styles from "./daftar.module.css";
import { supabase } from "@/lib/supabase";
import { loginWithNisNip, logout } from "@/lib/auth-helpers";
import type { UserProfile, Ekskul, PeriodePendaftaran } from "@/lib/supabase";
import {
  Calendar, CheckCircle2, ArrowLeft, BarChart2, Lightbulb, Volume2, Briefcase,
  School, ArrowRight, Lock, CheckCheck, CalendarDays, Timer, User as UserIcon
} from "lucide-react";

type Step = "cek" | "tutup" | "login" | "pilih" | "sukses";

export default function DaftarEkskulPage() {
  const [step, setStep]           = useState<Step>("cek");
  const [periode, setPeriode]     = useState<PeriodePendaftaran | null>(null);
  const [user, setUser]           = useState<UserProfile | null>(null);
  const [ekskulList, setEkskulList] = useState<Ekskul[]>([]);
  const [sudahDaftar, setSudahDaftar] = useState<string[]>([]); // ekskul_id yang sudah didaftar
  const [selected, setSelected]   = useState<string[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [nis, setNis]             = useState("");
  const [pass, setPass]           = useState("");
  const [error, setError]         = useState("");
  const [info, setInfo]           = useState("");

  // ── STEP 1: Cek periode & session ──
  useEffect(() => {
    async function init() {
      setLoading(true);
      // Cek periode aktif
      const now = new Date().toISOString();
      const { data: per } = await supabase
        .from("periode_pendaftaran")
        .select("*")
        .eq("aktif", true)
        .lte("tanggal_buka", now)
        .gte("tanggal_tutup", now)
        .limit(1)
        .maybeSingle();

      if (!per) { setStep("tutup"); setLoading(false); return; }
      setPeriode(per as PeriodePendaftaran);

      // Cek session
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("users").select("*, kelas(nama_kelas, tingkat)").eq("id", authUser.id).single();
        // Ekskul hanya untuk kelas 7 dan 8
        const tingkat = (profile as any)?.kelas?.tingkat;
        if (profile?.role === "siswa" && tingkat <= 8) {
          setUser(profile as UserProfile);
          await loadEkskulAndDaftar(authUser.id, per.id);
          return;
        }
      }
      // Load ekskul tanpa login (dengan filter periode)
      await loadEkskul(per.id);
      setStep("login");
      setLoading(false);
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadEkskul(periodeId?: string) {
    let query = supabase.from("ekskul").select("*").eq("aktif", true).order("nama");
    const { data } = await query;
    let filtered = (data ?? []) as Ekskul[];

    // Filter berdasarkan ekskul yang dibuka di periode ini
    if (periodeId) {
      const { data: pe } = await supabase
        .from("periode_ekskul").select("ekskul_id").eq("periode_id", periodeId);
      if (pe && pe.length > 0) {
        const allowed = pe.map((r: any) => r.ekskul_id);
        filtered = filtered.filter(e => allowed.includes(e.id));
      }
      // jika pe kosong = semua ekskul boleh (tidak perlu filter)
    }

    setEkskulList(filtered);
    // Auto-select yang wajib
    const wajib = filtered.filter((e: any) => e.jenis === "wajib").map((e: any) => e.id);
    setSelected(wajib);
  }

  async function loadEkskulAndDaftar(userId: string, periodeId: string) {
    const [{ data: eksAll }, { data: pend }, { data: pe }] = await Promise.all([
      supabase.from("ekskul").select("*").eq("aktif", true).order("nama"),
      supabase.from("pendaftaran").select("ekskul_id").eq("siswa_id", userId).eq("periode_id", periodeId),
      supabase.from("periode_ekskul").select("ekskul_id").eq("periode_id", periodeId),
    ]);
    // Filter ekskul berdasarkan periode_ekskul (jika ada)
    let eks = (eksAll ?? []) as Ekskul[];
    if (pe && pe.length > 0) {
      const allowed = pe.map((r: any) => r.ekskul_id);
      eks = eks.filter(e => allowed.includes(e.id));
    }
    setEkskulList(eks);
    const sudah = (pend ?? []).map((p: any) => p.ekskul_id);
    setSudahDaftar(sudah);
    // Auto-select yang wajib (belum pernah daftar)
    const wajib = (eks ?? []).filter((e: any) => e.jenis === "wajib" && !sudah.includes(e.id)).map((e: any) => e.id);
    setSelected(wajib);
    setStep("pilih");
    setLoading(false);
  }

  // ── Login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSubmitLoad(true);
    try {
      await loginWithNisNip(nis, pass);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Login gagal.");
      const { data: profile } = await supabase
        .from("users").select("*, kelas(nama_kelas, tingkat)").eq("id", authUser.id).single();
      if (!profile || profile.role !== "siswa") { await logout(); throw new Error("Akun ini bukan siswa."); }
      // Ekskul hanya untuk kelas 7 dan 8 — kelas 9 tidak bisa daftar
      const tingkat = (profile as any).kelas?.tingkat;
      if (tingkat && tingkat > 8) {
        await logout();
        throw new Error("Kelas 9 tidak mengikuti kegiatan ekstrakurikuler.");
      }
      setUser(profile as UserProfile);
      await loadEkskulAndDaftar(authUser.id, periode!.id);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Login gagal."); }
    finally { setSubmitLoad(false); }
  }

  // ── Toggle pilih ekskul ──
  function toggle(id: string, jenis: string) {
    if (jenis === "wajib" || sudahDaftar.includes(id)) return;
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  // ── Submit pendaftaran ──
  async function handleDaftar(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) { setError("Pilih minimal 1 ekskul."); return; }
    setError(""); setSubmitLoad(true);
    try {
      const rows = selected.map(ekskulId => ({
        siswa_id: user!.id,
        ekskul_id: ekskulId,
        periode_id: periode!.id,
        status: "menunggu",
      }));
      const { error: dbErr } = await supabase.from("pendaftaran").insert(rows);
      if (dbErr) throw new Error(dbErr.message);
      setInfo(`Berhasil mendaftar ${selected.length} ekstrakurikuler! Menunggu persetujuan pembina.`);
      setStep("sukses");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Gagal mendaftar."); }
    finally { setSubmitLoad(false); }
  }

  // ────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────
  if (loading) return (
    <main><Header activePage="Ekskul" />
      <div className={styles.loadingWrap}><div className={styles.spinner} /><p>Memeriksa jadwal pendaftaran...</p></div>
    </main>
  );

  return (
    <main>
      <Header activePage="Ekskul" />

      {/* ── Pendaftaran Ditutup ── */}
      {step === "tutup" && (
        <div className={styles.tutupWrap}>
          <div className={styles.tutupCard}>
            <div className={styles.tutupEmoji}><Calendar size={56} color="#944535" /></div>
            <h1 className={styles.tutupTitle}>Pendaftaran Belum Dibuka</h1>
            <p className={styles.tutupDesc}>
              Saat ini belum ada periode pendaftaran ekstrakurikuler yang aktif.
              Pantau informasi pembukaan dari guru atau wali kelas.
            </p>
            <div className={styles.tutupTips}>
              <div className={styles.tipItem} style={{display:"flex",alignItems:"center",gap:8}}><Lightbulb size={16} color="#944535" /> Pendaftaran dibuka oleh admin sekolah</div>
              <div className={styles.tipItem} style={{display:"flex",alignItems:"center",gap:8}}><Volume2 size={16} color="#944535" /> Informasi akan diumumkan melalui guru/wali kelas</div>
              <div className={styles.tipItem} style={{display:"flex",alignItems:"center",gap:8}}><Briefcase size={16} color="#944535" /> Kamu masih bisa lihat ekskul yang tersedia</div>
            </div>
            <div className={styles.tutupActions}>
              <a href="/ekstrakurikuler" className={styles.btnPrimary} style={{display:"inline-flex",alignItems:"center",gap:6}}><ArrowLeft size={16} /> Lihat Daftar Ekskul</a>
              <a href="/ekstrakurikuler/siswa" className={styles.btnSecondary} style={{display:"inline-flex",alignItems:"center",gap:6}}><BarChart2 size={16} /> Dashboard Saya</a>
            </div>
          </div>
        </div>
      )}

      {/* ── Login ── */}
      {step === "login" && (
        <div className={styles.wrapper}>
          <div className={`${styles.card} ${styles.cardSm}`}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
              <School size={48} color="#944535" />
            </div>
            <h2 className={styles.cardTitle}>Login Siswa</h2>
            <p className={styles.cardDesc}>Masuk dengan NIS dan password untuk mendaftar ekskul.</p>
            {error && <div className={styles.alertError}>{error}</div>}
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="nis">NIS</label>
                <input id="nis" type="text" className={styles.input} placeholder="Nomor Induk Siswa" value={nis} onChange={e => setNis(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="pass">Password</label>
                <input id="pass" type="password" className={styles.input} placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
              </div>
              <button className={styles.btnPrimary} type="submit" disabled={submitLoad} id="btn-login-daftar">
                {submitLoad ? <span className={styles.spinnerSm} /> : <span style={{display:"inline-flex",alignItems:"center",gap:6}}>Masuk <ArrowRight size={16} /></span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Pilih Ekskul ── */}
      {step === "pilih" && user && (
        <div className={styles.wrapper}>
          <div className={styles.periodeBanner}>
            <span className={styles.periodeActiveDot} aria-label="Pendaftaran aktif" />
            <div>
              <div className={styles.periodeNama}>{periode?.nama_periode}</div>
              <div className={styles.periodeDate}>Pendaftaran sedang aktif</div>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.welcomeBanner}>
              <div className={styles.welcomeAvatar}>{user.nama_lengkap.charAt(0)}</div>
              <div>
                <div className={styles.welcomeName}>Halo, {user.nama_lengkap}!</div>
                <div className={styles.welcomeSub}>NIS: {user.nis_nip} · Kelas {(user as any).kelas?.nama_kelas ?? "-"}</div>
              </div>
              <button className={styles.btnLogoutSm} onClick={async () => { await logout(); setUser(null); setStep("login"); }}>Keluar</button>
            </div>

            <h2 className={styles.cardTitle}>Pilih Ekskul</h2>
            <p className={styles.cardDesc}>Ekskul yang sudah didaftarkan sebelumnya tidak bisa dipilih ulang.</p>
            {error && <div className={styles.alertError}>{error}</div>}

            <form onSubmit={handleDaftar}>
              <div className={styles.ekskulGrid}>
                {ekskulList.map(e => {
                  const isSudah = sudahDaftar.includes(e.id);
                  const isWajib = e.jenis === "wajib";
                  const isSel   = selected.includes(e.id);
                  return (
                    <label key={e.id} htmlFor={`ek-${e.id}`}
                      className={`${styles.ekskulItem} ${isSel ? styles.ekskulItemSel : ""} ${isSudah ? styles.ekskulItemSudah : ""}`}
                      style={{ cursor: isSudah ? "default" : "pointer" }}>
                      <input id={`ek-${e.id}`} type="checkbox" className={styles.checkHidden}
                        checked={isSel || isSudah} disabled={isWajib || isSudah}
                        onChange={() => toggle(e.id, e.jenis)} />
                      <span className={styles.ekskulEmoji}>{e.emoji}</span>
                      <div className={styles.ekskulInfo}>
                        <div className={styles.ekskulNama}>
                          {e.nama}
                          {isWajib && <span className={styles.wajibBadge}>WAJIB</span>}
                          {isSudah && <span className={styles.sudahBadge}><CheckCheck size={10}/> Terdaftar</span>}
                        </div>
                        <div className={styles.ekskulJadwal}>
                          <CalendarDays size={11} aria-hidden /> {e.jadwal}
                          <Timer size={11} aria-hidden /> {e.waktu}
                        </div>
                        <div className={styles.ekskulKategori}>{e.kategori}</div>
                      </div>
                      {isSel && !isSudah && <span className={styles.checkMark}>✓</span>}
                    </label>
                  );
                })}
              </div>

              <div className={styles.selectedInfo}>
                {selected.length > 0 ? `${selected.length} ekskul dipilih` : "Belum ada yang dipilih"}
              </div>
              <button type="submit" className={styles.btnSubmit} disabled={submitLoad || selected.length === 0} id="btn-submit-daftar">
                {submitLoad ? <span className={styles.spinnerSm} /> : (
                  <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
                    Daftar Sekarang ({selected.length})
                    <ArrowRight size={16} aria-hidden />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Sukses ── */}
      {step === "sukses" && (
        <div className={styles.wrapper}>
          <div className={`${styles.card} ${styles.cardSukses}`}>
            <div className={styles.suksesEmoji}><CheckCircle2 size={56} color="#006b5f" /></div>
            <h2 className={styles.cardTitle}>Pendaftaran Berhasil!</h2>
            <p className={styles.cardDesc}>{info}</p>
            <p className={styles.cardDesc}>Cek status pendaftaranmu di dashboard siswa.</p>
            <div className={styles.suksesActions}>
              <a href="/ekstrakurikuler/siswa" className={styles.btnPrimary} id="btn-ke-dashboard" style={{display:"inline-flex",alignItems:"center",gap:6}}><BarChart2 size={16} /> Ke Dashboard Siswa</a>
              <a href="/ekstrakurikuler" className={styles.btnSecondary} style={{display:"inline-flex",alignItems:"center",gap:6}}><ArrowLeft size={16} /> Kembali ke Ekskul</a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
