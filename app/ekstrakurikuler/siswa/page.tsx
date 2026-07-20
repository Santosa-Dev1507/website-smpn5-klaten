"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import styles from "./siswa.module.css";
import { supabase } from "@/lib/supabase";
import { loginWithNisNip, logout } from "@/lib/auth-helpers";
import type { UserProfile, Pendaftaran, Perlombaan } from "@/lib/supabase";
import { GraduationCap, Home, Calendar, BarChart2, Trophy, Clock, MapPin, Check, Info, X, AlertTriangle, ArrowRight, ArrowLeft, Plus, Award } from "lucide-react";

type Tab = "beranda" | "jadwal" | "absensi" | "prestasi";

const HARI_ORDER = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const HARI_TODAY = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

const HASIL_LABEL: Record<string, { label: string; Icon: any }> = {
  juara_1: { label: "Juara 1", Icon: Trophy },
  juara_2: { label: "Juara 2", Icon: Trophy },
  juara_3: { label: "Juara 3", Icon: Trophy },
  harapan_1: { label: "Harapan 1", Icon: Award },
  harapan_2: { label: "Harapan 2", Icon: Award },
  harapan_3: { label: "Harapan 3", Icon: Award },
  peserta: { label: "Peserta", Icon: Award },
};

interface EkskulData {
  pendaftaran_id: string;
  ekskul_id: string;
  nama: string;
  emoji: string;
  jadwal: string;
  waktu: string;
  lokasi: string;
  kategori: string;
  status: string;
}

interface AbsensiRekap {
  ekskul_id: string;
  ekskul_nama: string;
  ekskul_emoji: string;
  hadir: number;
  izin: number;
  alpa: number;
  persen: number;
}

interface PrestasiData {
  lomba_id: string;
  nama_lomba: string;
  tingkat: string;
  tanggal: string | null;
  penyelenggara: string | null;
  hasil: string;
  ekskul_nama: string;
  ekskul_emoji: string;
}

export default function SiswaPage() {
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [nis, setNis]         = useState("");
  const [pass, setPass]       = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoad, setLoginLoad] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("beranda");
  const [ekskulList, setEkskulList] = useState<EkskulData[]>([]);
  const [absensiRekap, setAbsensiRekap] = useState<AbsensiRekap[]>([]);
  const [prestasi, setPrestasi] = useState<PrestasiData[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // ── Cek session saat load ──
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase
        .from("users")
        .select("*, kelas(nama_kelas, tingkat)")
        .eq("id", authUser.id)
        .single();
      // Ekskul hanya untuk kelas 7 dan 8
      const tingkat = (profile as any)?.kelas?.tingkat;
      if (profile?.role === "siswa" && tingkat <= 8) setUser(profile as UserProfile);
      setLoading(false);
    });
  }, []);

  // ── Login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr(""); setLoginLoad(true);
    try {
      await loginWithNisNip(nis, pass);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Login gagal.");
      const { data: profile } = await supabase
        .from("users")
        .select("*, kelas(nama_kelas, tingkat)")
        .eq("id", authUser.id).single();
      if (!profile || profile.role !== "siswa") {
        await logout();
        throw new Error("Akun ini bukan siswa. Gunakan halaman yang sesuai.");
      }
      // Ekskul hanya untuk kelas 7 dan 8 — kelas 9 tidak bisa akses
      const tingkat = (profile as any).kelas?.tingkat;
      if (tingkat && tingkat > 8) {
        await logout();
        throw new Error("Kelas 9 tidak mengikuti kegiatan ekstrakurikuler.");
      }
      setUser(profile as UserProfile);
    } catch (err: unknown) {
      setLoginErr(err instanceof Error ? err.message : "Login gagal.");
    } finally { setLoginLoad(false); }
  }

  // ── Load ekskul yang diikuti ──
  const loadEkskul = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    const { data } = await supabase
      .from("pendaftaran")
      .select("id, status, ekskul:ekskul_id(id, nama, emoji, jadwal, waktu, lokasi, kategori)")
      .eq("siswa_id", user.id);
    const list: EkskulData[] = (data ?? []).map((p: any) => ({
      pendaftaran_id: p.id,
      ekskul_id: p.ekskul.id,
      nama: p.ekskul.nama,
      emoji: p.ekskul.emoji,
      jadwal: p.ekskul.jadwal,
      waktu: p.ekskul.waktu,
      lokasi: p.ekskul.lokasi,
      kategori: p.ekskul.kategori,
      status: p.status,
    }));
    setEkskulList(list);
    setDataLoading(false);
  }, [user]);

  // ── Load absensi rekap ──
  const loadAbsensi = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    const { data } = await supabase
      .from("absensi")
      .select("status, ekskul:ekskul_id(id, nama, emoji)")
      .eq("siswa_id", user.id);
    const map = new Map<string, AbsensiRekap>();
    for (const a of (data ?? [])) {
      const ek = (a as any).ekskul;
      if (!map.has(ek.id)) map.set(ek.id, { ekskul_id: ek.id, ekskul_nama: ek.nama, ekskul_emoji: ek.emoji, hadir: 0, izin: 0, alpa: 0, persen: 0 });
      const rec = map.get(ek.id)!;
      if (a.status === "hadir") rec.hadir++;
      else if (a.status === "izin") rec.izin++;
      else rec.alpa++;
    }
    const result = Array.from(map.values()).map(r => {
      const total = r.hadir + r.izin + r.alpa;
      return { ...r, persen: total > 0 ? Math.round((r.hadir / total) * 100) : 0 };
    });
    setAbsensiRekap(result);
    setDataLoading(false);
  }, [user]);

  // ── Load prestasi ──
  const loadPrestasi = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    const { data } = await supabase
      .from("peserta_lomba")
      .select("hasil, lomba:lomba_id(id, nama_lomba, tingkat, tanggal_mulai, penyelenggara, ekskul:ekskul_id(nama, emoji))")
      .eq("siswa_id", user.id);
    const list: PrestasiData[] = (data ?? []).map((p: any) => ({
      lomba_id: p.lomba.id,
      nama_lomba: p.lomba.nama_lomba,
      tingkat: p.lomba.tingkat,
      tanggal: p.lomba.tanggal_mulai,
      penyelenggara: p.lomba.penyelenggara,
      hasil: p.hasil,
      ekskul_nama: p.lomba.ekskul.nama,
      ekskul_emoji: p.lomba.ekskul.emoji,
    }));
    setPrestasi(list);
    setDataLoading(false);
  }, [user]);

  // ── Load data saat tab berubah ──
  useEffect(() => {
    if (!user) return;
    if (activeTab === "beranda" || activeTab === "jadwal") loadEkskul();
    if (activeTab === "absensi") loadAbsensi();
    if (activeTab === "prestasi") loadPrestasi();
  }, [activeTab, user, loadEkskul, loadAbsensi, loadPrestasi]);

  // ── Jadwal minggu ini ──
  const hariIni = HARI_TODAY[new Date().getDay()];
  const ekskulDisetujui = ekskulList.filter(e => e.status === "disetujui");
  const jadwalHariIni = ekskulDisetujui.filter(e => e.jadwal?.includes(hariIni));

  if (loading) return (
    <main><Header activePage="Ekskul" />
      <div className={styles.loadingWrap}><div className={styles.spinner} /><p>Memuat...</p></div>
    </main>
  );

  // ── LOGIN ──
  if (!user) return (
    <main>
      <Header activePage="Ekskul" />
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <div className={styles.loginEmoji}><GraduationCap size={48} color="#944535" /></div>
          <h1 className={styles.loginTitle}>Dashboard Siswa</h1>
          <p className={styles.loginDesc}>Login dengan NIS dan password untuk melihat ekskul, jadwal, dan absensimu. <strong>Khusus siswa Kelas 7 &amp; 8.</strong></p>
          {loginErr && <div className={styles.alertError}>{loginErr}</div>}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="nis-input">NIS</label>
              <input id="nis-input" type="text" className={styles.input} placeholder="Nomor Induk Siswa" value={nis} onChange={e => setNis(e.target.value)} required autoFocus />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="pass-input">Password</label>
              <input id="pass-input" type="password" className={styles.input} placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
            </div>
            <button className={styles.btnSubmit} type="submit" disabled={loginLoad} id="btn-login-siswa">
              {loginLoad ? <span className={styles.spinner} style={{width:18,height:18,borderWidth:3}} /> : <span style={{display:"inline-flex",alignItems:"center",gap:6}}>Masuk <ArrowRight size={16} /></span>}
            </button>
          </form>
          <p className={styles.hint}>Lupa password? Hubungi wali kelas atau TU.</p>
          <div className={styles.loginLinks}>
            <a href="/ekstrakurikuler" className={styles.linkBack} style={{display:"inline-flex",alignItems:"center",gap:4}}><ArrowLeft size={16} /> Kembali ke Ekskul</a>
            <a href="/ekstrakurikuler/daftar" className={styles.linkDaftar} style={{display:"inline-flex",alignItems:"center",gap:4}}>Daftar Ekskul <ArrowRight size={16} /></a>
          </div>
        </div>
      </div>
    </main>
  );

  // ── DASHBOARD ──
  const kelas = (user as any).kelas?.nama_kelas ?? "-";
  const jumlahEkskul = ekskulDisetujui.length;
  const avgPersen = absensiRekap.length > 0 ? Math.round(absensiRekap.reduce((s, r) => s + r.persen, 0) / absensiRekap.length) : null;

  return (
    <main>
      <Header activePage="Ekskul" />
      <div className={styles.dashWrap}>

        {/* ── Hero User ── */}
        <div className={styles.heroUser}>
          <div className={styles.heroUserInner}>
            <div className={styles.avatarLg}>{user.nama_lengkap.charAt(0)}</div>
            <div>
              <div className={styles.heroGreet}>Halo, {user.nama_lengkap.split(" ")[0]}!</div>
              <div className={styles.heroMeta}>NIS: {user.nis_nip} · Kelas {kelas}</div>
            </div>
            <button className={styles.btnLogout} onClick={async () => { await logout(); setUser(null); }}>Keluar</button>
          </div>
          {/* Stats strip */}
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>{ekskulList.length}</span><span className={styles.heroStatLabel}>Ekskul Diikuti</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>{jumlahEkskul}</span><span className={styles.heroStatLabel}>Disetujui</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>{avgPersen !== null ? `${avgPersen}%` : "-"}</span><span className={styles.heroStatLabel}>Rata Hadir</span></div>
            <div className={styles.heroStat}><span className={styles.heroStatNum}>{prestasi.length}</span><span className={styles.heroStatLabel}>Prestasi</span></div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabBar}>
          {[
            { id: "beranda" as const, Icon: Home, label: "Beranda" },
            { id: "jadwal" as const, Icon: Calendar, label: "Jadwal" },
            { id: "absensi" as const, Icon: BarChart2, label: "Absensi" },
            { id: "prestasi" as const, Icon: Trophy, label: "Prestasi" },
          ].map(({ id, Icon, label }) => (
            <button key={id} className={`${styles.tabBtn} ${activeTab === id ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab(id)}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>

          {/* ─── BERANDA ─── */}
          {activeTab === "beranda" && (
            <div>
              {jadwalHariIni.length > 0 && (
                <div className={styles.todayBanner}>
                  <div className={styles.todayTitle} style={{display:"flex",alignItems:"center",gap:6}}><Calendar size={18} /> Ekskul Hari Ini — {hariIni}</div>
                  {jadwalHariIni.map(e => (
                    <div key={e.ekskul_id} className={styles.todayItem}>
                      <span className={styles.todayEmoji}>{e.emoji}</span>
                      <div>
                        <div className={styles.todayNama}>{e.nama}</div>
                        <div className={styles.todayMeta} style={{display:"flex",alignItems:"center",gap:8}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}><Clock size={14} /> {e.waktu}</span> · <span style={{display:"inline-flex",alignItems:"center",gap:4}}><MapPin size={14} /> {e.lokasi}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className={styles.sectionTitle}>Ekskul yang Kamu Ikuti</h2>
              {dataLoading ? <div className={styles.loadRow}>Memuat...</div> : (
                ekskulList.length === 0
                  ? <div className={styles.emptyState}>
                      Belum ada ekskul yang didaftarkan.<br />
                      <a href="/ekstrakurikuler/daftar" className={styles.linkCta} style={{display:"inline-flex",alignItems:"center",gap:4}}>Daftar Sekarang <ArrowRight size={16} /></a>
                    </div>
                  : <div className={styles.ekskulGrid}>
                      {ekskulList.map(e => (
                        <div key={e.ekskul_id} className={styles.ekskulCard}>
                          <div className={styles.ekskulCardEmoji}>{e.emoji}</div>
                          <div className={styles.ekskulCardBody}>
                            <div className={styles.ekskulCardNama}>{e.nama}</div>
                            <div className={styles.ekskulCardMeta} style={{display:"flex",alignItems:"center",gap:4}}><Calendar size={14} /> {e.jadwal} · <Clock size={14} /> {e.waktu}</div>
                            <div className={styles.ekskulCardMeta} style={{display:"flex",alignItems:"center",gap:4}}><MapPin size={14} /> {e.lokasi}</div>
                            <span className={`${styles.badge} ${styles["badge_"+e.status]}`}>{e.status}</span>
                          </div>
                        </div>
                      ))}
                      <a href="/ekstrakurikuler/daftar" className={`${styles.ekskulCard} ${styles.ekskulCardAdd}`}>
                        <div className={styles.addIcon}><Plus size={24} /></div>
                        <div className={styles.addLabel}>Tambah Ekskul</div>
                      </a>
                    </div>
              )}
            </div>
          )}

          {/* ─── JADWAL ─── */}
          {activeTab === "jadwal" && (
            <div>
              <h2 className={styles.sectionTitle}>Jadwal Ekskul Minggu Ini</h2>
              {dataLoading ? <div className={styles.loadRow}>Memuat jadwal...</div> : (
                ekskulDisetujui.length === 0
                  ? <div className={styles.emptyState}>Belum ada ekskul yang disetujui.<br />Tunggu konfirmasi dari pembina.</div>
                  : <div className={styles.jadwalList}>
                      {HARI_ORDER.map(hari => {
                        const items = ekskulDisetujui.filter(e => e.jadwal?.includes(hari));
                        if (items.length === 0) return null;
                        return (
                          <div key={hari} className={`${styles.jadwalDay} ${hari === hariIni ? styles.jadwalDayToday : ""}`}>
                            <div className={styles.jadwalDayHeader}>
                              <span className={styles.jadwalDayName}>{hari}</span>
                              {hari === hariIni && <span className={styles.todayChip}>Hari Ini</span>}
                            </div>
                            {items.map(e => (
                              <div key={e.ekskul_id} className={styles.jadwalItem}>
                                <span className={styles.jadwalEmoji}>{e.emoji}</span>
                                <div>
                                  <div className={styles.jadwalNama}>{e.nama}</div>
                                  <div className={styles.jadwalMeta} style={{display:"flex",alignItems:"center",gap:8}}><span style={{display:"inline-flex",alignItems:"center",gap:4}}><Clock size={14} /> {e.waktu}</span> · <span style={{display:"inline-flex",alignItems:"center",gap:4}}><MapPin size={14} /> {e.lokasi}</span></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
              )}
            </div>
          )}

          {/* ─── ABSENSI ─── */}
          {activeTab === "absensi" && (
            <div>
              <h2 className={styles.sectionTitle}>Rekap Absensi</h2>
              {dataLoading ? <div className={styles.loadRow}>Memuat absensi...</div> : (
                absensiRekap.length === 0
                  ? <div className={styles.emptyState}>Belum ada data absensi. Data akan muncul setelah pembina mengisi absensi.</div>
                  : <div className={styles.absensiList}>
                      {absensiRekap.map(r => (
                        <div key={r.ekskul_id} className={`${styles.absensiCard} ${r.persen < 75 ? styles.absensiCardDanger : ""}`}>
                          <div className={styles.absensiCardTop}>
                            <div className={styles.absensiEmoji}>{r.ekskul_emoji}</div>
                            <div className={styles.absensiNama}>{r.ekskul_nama}</div>
                            <div className={`${styles.absensiPct} ${r.persen < 75 ? styles.absensiPctDanger : r.persen >= 85 ? styles.absensiPctOk : ""}`}>{r.persen}%</div>
                          </div>
                          <div className={styles.absensiBar}>
                            <div className={styles.absensiBarFill} style={{ width: `${r.persen}%`, background: r.persen < 75 ? "#ba1a1a" : r.persen >= 85 ? "#006b5f" : "#944535" }} />
                          </div>
                          <div className={styles.absensiStats}>
                            <span className={styles.statHadir} style={{display:"inline-flex",alignItems:"center",gap:4}}><Check size={14} /> {r.hadir} Hadir</span>
                            <span className={styles.statIzin} style={{display:"inline-flex",alignItems:"center",gap:4}}><Info size={14} /> {r.izin} Izin</span>
                            <span className={styles.statAlpa} style={{display:"inline-flex",alignItems:"center",gap:4}}><X size={14} /> {r.alpa} Alpa</span>
                          </div>
                          {r.persen < 75 && <div className={styles.warningMsg} style={{display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={16} color="#ba1a1a" /> Kehadiran di bawah 75%, segera hubungi pembina.</div>}
                        </div>
                      ))}
                    </div>
              )}
            </div>
          )}

          {/* ─── PRESTASI ─── */}
          {activeTab === "prestasi" && (
            <div>
              <h2 className={styles.sectionTitle}>Prestasi Lombaku</h2>
              {dataLoading ? <div className={styles.loadRow}>Memuat prestasi...</div> : (
                prestasi.length === 0
                  ? <div className={styles.emptyState}>Belum ada data prestasi lomba. Data akan muncul setelah pembina menginput perlombaan.</div>
                  : <div className={styles.prestasiList}>
                      {prestasi.map(p => {
                        const info = HASIL_LABEL[p.hasil] || { label: p.hasil, Icon: Award };
                        const IconComp = info.Icon;
                        return (
                          <div key={p.lomba_id} className={`${styles.prestasiCard} ${p.hasil !== "peserta" ? styles.prestasiCardJuara : ""}`}>
                            <div className={styles.prestasiHasil} style={{display:"inline-flex",alignItems:"center",gap:6}}><IconComp size={16} /> {info.label}</div>
                            <div className={styles.prestasiNama}>{p.nama_lomba}</div>
                            <div className={styles.prestasiMeta} style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                              <span>{p.ekskul_emoji} {p.ekskul_nama}</span> · <span>Tingkat {p.tingkat}</span>
                              {p.penyelenggara && <span>· {p.penyelenggara}</span>}
                              {p.tanggal && <span>· {new Date(p.tanggal).toLocaleDateString("id-ID", { year:"numeric", month:"long" })}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
