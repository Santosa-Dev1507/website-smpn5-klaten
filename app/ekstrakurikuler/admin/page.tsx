"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import styles from "./admin.module.css";
import { supabase } from "@/lib/supabase";
import { loginWithEmail, logout } from "@/lib/auth-helpers";
import type { UserProfile, Ekskul, PeriodePendaftaran, LaporanKegiatan } from "@/lib/supabase";
import {
  BarChart2, Trophy, Calendar, Users, FileText, Settings,
  Check, X, Clock, Plus, Edit, Power, ArrowRight, User
} from "lucide-react";

type Tab = "dashboard" | "ekskul" | "periode" | "users" | "laporan";

const TABS_DATA: { id: Tab; label: string; Icon: any; getBadge?: (stats: Stats | null) => number | undefined }[] = [
  { id: "dashboard", label: "Dashboard", Icon: BarChart2 },
  { id: "ekskul",    label: "Ekskul",    Icon: Trophy },
  { id: "periode",   label: "Periode",   Icon: Calendar, getBadge: s => s?.pendaftaranMenunggu },
  { id: "users",     label: "Pengguna",  Icon: Users },
  { id: "laporan",   label: "Laporan",   Icon: FileText, getBadge: s => s?.laporanMenunggu },
];

interface Stats {
  totalSiswa: number; totalPembina: number; totalEkskul: number;
  pendaftaranMenunggu: number; laporanMenunggu: number;
}

export default function AdminPage() {
  const [user, setUser]         = useState<UserProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoad, setLoginLoad] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [stats, setStats]         = useState<Stats | null>(null);
  const [ekskulList, setEkskulList] = useState<Ekskul[]>([]);
  const [periodeList, setPeriodeList] = useState<PeriodePendaftaran[]>([]);
  const [userList, setUserList]     = useState<UserProfile[]>([]);
  const [laporanList, setLaporanList] = useState<LaporanKegiatan[]>([]);
  const [pembinas, setPembinas]     = useState<UserProfile[]>([]);
  const [kelasList, setKelasList]   = useState<{ id: string; nama_kelas: string }[]>([]);
  const [dataLoad, setDataLoad]     = useState(false);
  const [msg, setMsg]               = useState("");
  const [msgType, setMsgType]       = useState<"ok"|"err">("ok");

  // ── Forms ──
  const [showFormEkskul, setShowFormEkskul] = useState(false);
  const [formEkskul, setFormEkskul] = useState<Partial<Ekskul>>({
    kode:"", nama:"", kategori:"Olahraga", jenis:"pilihan", jadwal:"", waktu:"", lokasi:"", emoji:"⭐", deskripsi:"", nama_pelatih:"", kontak_pelatih:"", aktif:true
  });
  const [editEkskulId, setEditEkskulId] = useState<string|null>(null);

  const [showFormPeriode, setShowFormPeriode] = useState(false);
  const [formPeriode, setFormPeriode] = useState({ nama_periode:"", tanggal_buka:"", tanggal_tutup:"", aktif: true });

  const [showFormUser, setShowFormUser] = useState(false);
  const [formUser, setFormUser] = useState({ nis_nip:"", nama_lengkap:"", role:"siswa" as const, kelas_id:"", email_internal:"", password:"" });

  function showMsg(text: string, type: "ok"|"err" = "ok") {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 4000);
  }

  // ── Cek session ──
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single();
      if (profile?.role === "admin") setUser(profile as UserProfile);
      setLoading(false);
    });
  }, []);

  // ── Login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr(""); setLoginLoad(true);
    try {
      await loginWithEmail(email, pass);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Login gagal.");
      const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single();
      if (!profile || profile.role !== "admin") { await logout(); throw new Error("Akun ini bukan admin."); }
      setUser(profile as UserProfile);
    } catch (err: unknown) { setLoginErr(err instanceof Error ? err.message : "Login gagal."); }
    finally { setLoginLoad(false); }
  }

  // ── Load Stats ──
  const loadStats = useCallback(async () => {
    const [
      { count: totalSiswa }, { count: totalPembina }, { count: totalEkskul },
      { count: pendaftaranMenunggu }, { count: laporanMenunggu }
    ] = await Promise.all([
      supabase.from("users").select("id", { count: "exact" }).eq("role","siswa"),
      supabase.from("users").select("id", { count: "exact" }).eq("role","pembina"),
      supabase.from("ekskul").select("id", { count: "exact" }).eq("aktif", true),
      supabase.from("pendaftaran").select("id", { count: "exact" }).eq("status","menunggu"),
      supabase.from("laporan_kegiatan").select("id", { count: "exact" }).eq("status","terkirim"),
    ]);
    setStats({ totalSiswa:totalSiswa??0, totalPembina:totalPembina??0, totalEkskul:totalEkskul??0, pendaftaranMenunggu:pendaftaranMenunggu??0, laporanMenunggu:laporanMenunggu??0 });
  }, []);

  // ── Load Ekskul ──
  const loadEkskul = useCallback(async () => {
    setDataLoad(true);
    const [{ data: eks }, { data: pem }, { data: kel }] = await Promise.all([
      supabase.from("ekskul").select("*, pembina:pembina_id(nama_lengkap)").order("nama"),
      supabase.from("users").select("id,nama_lengkap").eq("role","pembina"),
      supabase.from("kelas").select("id,nama_kelas").order("nama_kelas"),
    ]);
    setEkskulList((eks ?? []) as unknown as Ekskul[]);
    setPembinas((pem ?? []) as unknown as UserProfile[]);
    setKelasList((kel ?? []) as { id:string; nama_kelas:string }[]);
    setDataLoad(false);
  }, []);

  // ── Load Periode ──
  const loadPeriode = useCallback(async () => {
    setDataLoad(true);
    const { data } = await supabase.from("periode_pendaftaran").select("*").order("tanggal_buka", { ascending: false });
    setPeriodeList((data ?? []) as PeriodePendaftaran[]);
    setDataLoad(false);
  }, []);

  // ── Load Users ──
  const loadUsers = useCallback(async () => {
    setDataLoad(true);
    const { data } = await supabase
      .from("users").select("*, kelas(nama_kelas)").order("nama_lengkap").limit(100);
    setUserList((data ?? []) as unknown as UserProfile[]);
    setDataLoad(false);
  }, []);

  // ── Load Laporan ──
  const loadLaporan = useCallback(async () => {
    setDataLoad(true);
    const { data } = await supabase
      .from("laporan_kegiatan")
      .select("*, ekskul:ekskul_id(nama,emoji), pembina:pembina_id(nama_lengkap)")
      .order("created_at", { ascending: false }).limit(50);
    setLaporanList((data ?? []) as unknown as LaporanKegiatan[]);
    setDataLoad(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "dashboard") { loadStats(); }
    if (activeTab === "ekskul") loadEkskul();
    if (activeTab === "periode") loadPeriode();
    if (activeTab === "users") loadUsers();
    if (activeTab === "laporan") loadLaporan();
  }, [activeTab, user, loadStats, loadEkskul, loadPeriode, loadUsers, loadLaporan]);

  // ── CRUD Ekskul ──
  async function simpanEkskul() {
    if (!formEkskul.kode || !formEkskul.nama) { showMsg("Kode dan nama ekskul wajib diisi.", "err"); return; }
    if (editEkskulId) {
      const { error } = await supabase.from("ekskul").update(formEkskul).eq("id", editEkskulId);
      if (error) { showMsg("❌ "+error.message, "err"); return; }
    } else {
      const { error } = await supabase.from("ekskul").insert(formEkskul);
      if (error) { showMsg("❌ "+error.message, "err"); return; }
    }
    showMsg("✅ Ekskul berhasil disimpan!"); setShowFormEkskul(false); setEditEkskulId(null);
    setFormEkskul({ kode:"",nama:"",kategori:"Olahraga",jenis:"pilihan",jadwal:"",waktu:"",lokasi:"",emoji:"⭐",deskripsi:"",nama_pelatih:"",kontak_pelatih:"",aktif:true });
    loadEkskul();
  }

  async function toggleAktifEkskul(id: string, aktif: boolean) {
    await supabase.from("ekskul").update({ aktif: !aktif }).eq("id", id);
    showMsg(`✅ Ekskul ${!aktif ? "diaktifkan" : "dinonaktifkan"}.`);
    loadEkskul();
  }

  // ── CRUD Periode ──
  async function simpanPeriode() {
    if (!formPeriode.nama_periode || !formPeriode.tanggal_buka || !formPeriode.tanggal_tutup) {
      showMsg("Lengkapi semua field periode.", "err"); return;
    }
    const { error } = await supabase.from("periode_pendaftaran").insert({ ...formPeriode, dibuat_oleh: user!.id });
    if (error) { showMsg("❌ "+error.message, "err"); return; }
    showMsg("✅ Periode berhasil disimpan!"); setShowFormPeriode(false);
    setFormPeriode({ nama_periode:"", tanggal_buka:"", tanggal_tutup:"", aktif: true });
    loadPeriode();
  }

  async function toggleAktifPeriode(id: string, aktif: boolean) {
    await supabase.from("periode_pendaftaran").update({ aktif: !aktif }).eq("id", id);
    showMsg(`✅ Periode ${!aktif?"dibuka":"ditutup"}.`);
    loadPeriode();
  }

  // ── Buat User Manual ──
  async function createUser() {
    if (!formUser.nis_nip || !formUser.nama_lengkap || !formUser.password) {
      showMsg("NIS/NIP, nama, dan password wajib diisi.", "err"); return;
    }
    // Email internal format
    const emailInt = `${formUser.nis_nip.trim()}@sim.smpn5klaten`;
    // Panggil API route untuk create user via service role
    const res = await fetch("/api/admin/create-user", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ ...formUser, email: emailInt }),
    });
    const data = await res.json();
    if (!data.success) { showMsg("❌ "+data.message, "err"); return; }
    showMsg(`✅ Pengguna ${formUser.nama_lengkap} berhasil dibuat!`);
    setShowFormUser(false);
    setFormUser({ nis_nip:"",nama_lengkap:"",role:"siswa",kelas_id:"",email_internal:"",password:"" });
    loadUsers();
  }

  // ── Approve Laporan ──
  async function approveLaporan(id: string) {
    const { error } = await supabase.from("laporan_kegiatan").update({
      status: "disetujui", disetujui_oleh: user!.id, disetujui_at: new Date().toISOString()
    }).eq("id", id);
    if (error) { showMsg("❌ "+error.message, "err"); return; }
    showMsg("✅ Laporan disetujui!");
    loadLaporan(); loadStats();
  }

  if (loading) return (
    <main><Header activePage="Ekskul" />
      <div className={styles.loadingWrap}><div className={styles.spinner} /></div>
    </main>
  );

  if (!user) return (
    <main>
      <Header activePage="Ekskul" />
      <div className={styles.loginWrap}>
        <div className={styles.loginCard}>
          <div className={styles.loginEmoji}><Settings size={48} color="#944535" /></div>
          <h1 className={styles.loginTitle}>Admin Ekskul</h1>
          <p className={styles.loginDesc}>Login sebagai administrator untuk mengelola sistem ekskul SMPN 5 Klaten.</p>
          {loginErr && <div className={styles.alertError}>{loginErr}</div>}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="adm-email" className={styles.label}>Email Admin</label>
              <input id="adm-email" type="email" className={styles.input} placeholder="admin@smpn5klaten.sch.id" value={email} onChange={e=>setEmail(e.target.value)} required autoFocus />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="adm-pass" className={styles.label}>Password</label>
              <input id="adm-pass" type="password" className={styles.input} placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} required />
            </div>
            <button className={styles.btnSubmit} type="submit" disabled={loginLoad} id="btn-login-admin">
              {loginLoad ? <span className={styles.spinnerSm}/> : <span style={{display:"inline-flex",alignItems:"center",gap:6}}>Masuk sebagai Admin <ArrowRight size={16} /></span>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );

  return (
    <main>
      <Header activePage="Ekskul" />
      <div className={styles.dashWrap}>

        {/* ── Top Bar ── */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.avatar} style={{display:"flex",alignItems:"center",justifyContent:"center"}}><Settings size={20} color="#944535" /></div>
            <div>
              <div className={styles.userName}>{user.nama_lengkap}</div>
              <div className={styles.userSub}>Administrator Sistem Ekskul</div>
            </div>
          </div>
          <button className={styles.btnLogout} onClick={async () => { await logout(); setUser(null); }}>Keluar</button>
        </div>

        {/* ── Toast Message ── */}
        {msg && <div className={`${styles.toast} ${msgType==="err" ? styles.toastErr : styles.toastOk}`}>{msg}</div>}

        {/* ── Tabs ── */}
        <div className={styles.tabBar}>
          {TABS_DATA.map(({ id, label, Icon, getBadge }) => {
            const badge = getBadge?.(stats);
            return (
              <button key={id} className={`${styles.tabBtn} ${activeTab===id ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab(id)}>
                <Icon size={16} /> {label}
                {!!badge && <span className={styles.tabBadge}>{badge}</span>}
              </button>
            );
          })}
        </div>

        <div className={styles.tabContent}>

          {/* ── DASHBOARD ── */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><BarChart2 size={22} /> Ringkasan Sistem</h2>
              <div className={styles.statsGrid}>
                {[
                  { Icon: Users,    num:stats?.totalSiswa??"-",          label:"Total Siswa" },
                  { Icon: User,     num:stats?.totalPembina??"-",        label:"Pembina Aktif" },
                  { Icon: Trophy,   num:stats?.totalEkskul??"-",         label:"Ekskul Aktif" },
                  { Icon: Clock,    num:stats?.pendaftaranMenunggu??"-", label:"Pendaftaran Menunggu", danger:(stats?.pendaftaranMenunggu??0)>0 },
                  { Icon: FileText, num:stats?.laporanMenunggu??"-",     label:"Laporan Perlu Review", danger:(stats?.laporanMenunggu??0)>0 },
                ].map(s => (
                  <div key={s.label} className={`${styles.statCard} ${s.danger ? styles.statCardDanger : ""}`}>
                    <div className={styles.statIcon}><s.Icon size={24} color={s.danger ? "#ba1a1a" : "#944535"} /></div>
                    <div className={`${styles.statNum} ${s.danger ? styles.statNumDanger : ""}`}>{s.num}</div>
                    <div className={styles.statLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className={styles.quickLinks}>
                <h3 className={styles.subTitle}>Aksi Cepat</h3>
                <div className={styles.quickLinkGrid}>
                  <button className={styles.quickBtn} onClick={() => setActiveTab("periode")} style={{display:"inline-flex",alignItems:"center",gap:6}}><Calendar size={16} /> Buka Periode Pendaftaran</button>
                  <button className={styles.quickBtn} onClick={() => setActiveTab("ekskul")} style={{display:"inline-flex",alignItems:"center",gap:6}}><Trophy size={16} /> Kelola Ekskul</button>
                  <button className={styles.quickBtn} onClick={() => setActiveTab("users")} style={{display:"inline-flex",alignItems:"center",gap:6}}><Users size={16} /> Tambah Pengguna</button>
                  <button className={styles.quickBtn} onClick={() => setActiveTab("laporan")} style={{display:"inline-flex",alignItems:"center",gap:6}}><FileText size={16} /> Review Laporan</button>
                </div>
              </div>
            </div>
          )}

          {/* ── EKSKUL ── */}
          {activeTab === "ekskul" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><Trophy size={22} /> Manajemen Ekskul</h2>
                <button className={styles.btnPrimary} onClick={() => { setShowFormEkskul(true); setEditEkskulId(null); }} style={{display:"inline-flex",alignItems:"center",gap:6}}><Plus size={16} /> Tambah Ekskul</button>
              </div>
              {showFormEkskul && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>{editEkskulId ? "Edit" : "Tambah"} Ekskul</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>Kode *</label><input className={styles.input} value={formEkskul.kode??""} onChange={e=>setFormEkskul(p=>({...p,kode:e.target.value}))} placeholder="futsal" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Nama *</label><input className={styles.input} value={formEkskul.nama??""} onChange={e=>setFormEkskul(p=>({...p,nama:e.target.value}))} placeholder="Futsal" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Kategori</label>
                      <select className={styles.input} value={formEkskul.kategori??""} onChange={e=>setFormEkskul(p=>({...p,kategori:e.target.value}))}>
                        {["Olahraga","Seni","Akademik","Kepanduan","Sosial","Kedisiplinan","Keagamaan"].map(k=><option key={k}>{k}</option>)}
                      </select>
                    </div>
                    <div className={styles.formGroup}><label className={styles.label}>Jenis</label>
                      <select className={styles.input} value={formEkskul.jenis??""} onChange={e=>setFormEkskul(p=>({...p,jenis:e.target.value as "wajib"|"pilihan"}))}>
                        <option value="pilihan">Pilihan</option><option value="wajib">Wajib</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}><label className={styles.label}>Jadwal</label><input className={styles.input} value={formEkskul.jadwal??""} onChange={e=>setFormEkskul(p=>({...p,jadwal:e.target.value}))} placeholder="Sabtu" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Waktu</label><input className={styles.input} value={formEkskul.waktu??""} onChange={e=>setFormEkskul(p=>({...p,waktu:e.target.value}))} placeholder="07:00–09:00" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Lokasi</label><input className={styles.input} value={formEkskul.lokasi??""} onChange={e=>setFormEkskul(p=>({...p,lokasi:e.target.value}))} placeholder="Lapangan" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Emoji</label><input className={styles.input} value={formEkskul.emoji??""} onChange={e=>setFormEkskul(p=>({...p,emoji:e.target.value}))} placeholder="⚽" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Nama Pelatih</label><input className={styles.input} value={formEkskul.nama_pelatih??""} onChange={e=>setFormEkskul(p=>({...p,nama_pelatih:e.target.value}))} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Pembina</label>
                      <select className={styles.input} value={formEkskul.pembina_id??""} onChange={e=>setFormEkskul(p=>({...p,pembina_id:e.target.value||undefined}))}>
                        <option value="">-- Pilih Pembina --</option>
                        {pembinas.map(p=><option key={p.id} value={p.id}>{p.nama_lengkap}</option>)}
                      </select>
                    </div>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}><label className={styles.label}>Deskripsi</label><textarea className={styles.textarea} rows={3} value={formEkskul.deskripsi??""} onChange={e=>setFormEkskul(p=>({...p,deskripsi:e.target.value}))} /></div>
                  </div>
                  <div className={styles.formActions}>
                    <button className={styles.btnPrimary} onClick={simpanEkskul} id="btn-simpan-ekskul">💾 Simpan</button>
                    <button className={styles.btnSecondary} onClick={() => setShowFormEkskul(false)}>Batal</button>
                  </div>
                </div>
              )}
              {dataLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Ekskul</th><th>Kategori</th><th>Jadwal</th><th>Pembina</th><th>Status</th><th>Aksi</th></tr></thead>
                    <tbody>
                      {ekskulList.map(e => (
                        <tr key={e.id} className={!e.aktif ? styles.rowInaktif : ""}>
                          <td><strong>{e.emoji} {e.nama}</strong><br /><span className={styles.subText}>{e.kode}</span></td>
                          <td><span className={styles.kategoriChip}>{e.kategori}</span></td>
                          <td className={styles.subText}>{e.jadwal}<br />{e.waktu}</td>
                          <td className={styles.subText}>{(e as any).pembina?.nama_lengkap ?? <i>Belum ditentukan</i>}<br />{e.nama_pelatih && <span style={{display:"inline-flex",alignItems:"center",gap:4}}><User size={14} /> {e.nama_pelatih}</span>}</td>
                          <td><span className={`${styles.badge} ${e.aktif ? styles.badgeOk : styles.badgeOff}`}>{e.aktif ? "Aktif" : "Nonaktif"}</span></td>
                          <td>
                            <button className={styles.btnAction} onClick={() => { setEditEkskulId(e.id); setFormEkskul(e); setShowFormEkskul(true); }} title="Edit"><Edit size={14} /></button>
                            <button className={styles.btnAction} onClick={() => toggleAktifEkskul(e.id, e.aktif)} title={e.aktif ? "Nonaktifkan" : "Aktifkan"}><Power size={14} color={e.aktif ? "#ba1a1a" : "#006b5f"} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── PERIODE ── */}
          {activeTab === "periode" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><Calendar size={22} /> Periode Pendaftaran</h2>
                <button className={styles.btnPrimary} onClick={() => setShowFormPeriode(true)} style={{display:"inline-flex",alignItems:"center",gap:6}}><Plus size={16} /> Buat Periode</button>
              </div>
              {showFormPeriode && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>Buat Periode Pendaftaran Baru</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}><label className={styles.label}>Nama Periode *</label><input className={styles.input} value={formPeriode.nama_periode} onChange={e=>setFormPeriode(p=>({...p,nama_periode:e.target.value}))} placeholder="Pendaftaran Ekskul Semester 1 2025/2026" /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Tanggal Buka *</label><input type="datetime-local" className={styles.input} value={formPeriode.tanggal_buka} onChange={e=>setFormPeriode(p=>({...p,tanggal_buka:e.target.value}))} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Tanggal Tutup *</label><input type="datetime-local" className={styles.input} value={formPeriode.tanggal_tutup} onChange={e=>setFormPeriode(p=>({...p,tanggal_tutup:e.target.value}))} /></div>
                  </div>
                  <div className={styles.formActions}>
                    <button className={styles.btnPrimary} onClick={simpanPeriode} id="btn-simpan-periode">💾 Simpan Periode</button>
                    <button className={styles.btnSecondary} onClick={() => setShowFormPeriode(false)}>Batal</button>
                  </div>
                </div>
              )}
              {dataLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.periodeList}>
                  {periodeList.length === 0 && <div className={styles.emptyState}>Belum ada periode pendaftaran.</div>}
                  {periodeList.map(p => {
                    const now = new Date(); const buka = new Date(p.tanggal_buka); const tutup = new Date(p.tanggal_tutup);
                    const isActive = p.aktif && now >= buka && now <= tutup;
                    return (
                      <div key={p.id} className={`${styles.periodeCard} ${isActive ? styles.periodeCardActive : ""}`}>
                        <div className={styles.periodeCardTop}>
                          <div>
                            <div className={styles.periodeNama}>{p.nama_periode}</div>
                            <div className={styles.periodeMeta} style={{display:"flex",alignItems:"center",gap:6}}>
                              <Calendar size={14} /> {new Date(p.tanggal_buka).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}
                              {" → "}
                              {new Date(p.tanggal_tutup).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}
                            </div>
                          </div>
                          <div className={styles.periodeActions}>
                            <span className={`${styles.badge} ${isActive ? styles.badgeOk : p.aktif ? styles.badgeWarning : styles.badgeOff}`} style={{display:"inline-flex",alignItems:"center",gap:4}}>
                              {isActive ? <><Check size={14} /> Buka</> : p.aktif ? <><Clock size={14} /> Dijadwalkan</> : <><X size={14} /> Tutup</>}
                            </span>
                            <button className={styles.btnAction} onClick={() => toggleAktifPeriode(p.id, p.aktif)} style={{display:"inline-flex",alignItems:"center",gap:4}}>
                              {p.aktif ? <><Power size={14} /> Tutup</> : <><Check size={14} /> Buka</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === "users" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><Users size={22} /> Manajemen Pengguna</h2>
                <button className={styles.btnPrimary} onClick={() => setShowFormUser(true)} style={{display:"inline-flex",alignItems:"center",gap:6}}><Plus size={16} /> Tambah Pengguna</button>
              </div>
              {showFormUser && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>Buat Pengguna Baru</h3>
                  <p className={styles.formHint}>Email login akan dibuat otomatis: <code>{formUser.nis_nip||"[NIS/NIP]"}@sim.smpn5klaten</code></p>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>NIS / NIP *</label><input className={styles.input} value={formUser.nis_nip} onChange={e=>setFormUser(p=>({...p,nis_nip:e.target.value}))} placeholder="12345 / 196701..." /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Nama Lengkap *</label><input className={styles.input} value={formUser.nama_lengkap} onChange={e=>setFormUser(p=>({...p,nama_lengkap:e.target.value}))} /></div>
                    <div className={styles.formGroup}><label className={styles.label}>Role *</label>
                      <select className={styles.input} value={formUser.role} onChange={e=>setFormUser(p=>({...p,role:e.target.value as any}))}>
                        <option value="siswa">Siswa</option><option value="pembina">Pembina</option>
                        <option value="walikelas">Wali Kelas</option><option value="admin">Admin</option>
                      </select>
                    </div>
                    {(formUser.role === "siswa" || formUser.role === "walikelas") && (
                      <div className={styles.formGroup}><label className={styles.label}>Kelas</label>
                        <select className={styles.input} value={formUser.kelas_id} onChange={e=>setFormUser(p=>({...p,kelas_id:e.target.value}))}>
                          <option value="">-- Pilih Kelas --</option>
                          {kelasList.map(k=><option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                        </select>
                      </div>
                    )}
                    <div className={styles.formGroup}><label className={styles.label}>Password *</label><input type="password" className={styles.input} value={formUser.password} onChange={e=>setFormUser(p=>({...p,password:e.target.value}))} placeholder="Min. 8 karakter" /></div>
                  </div>
                  <div className={styles.formActions}>
                    <button className={styles.btnPrimary} onClick={createUser} id="btn-buat-user" style={{display:"inline-flex",alignItems:"center",gap:6}}><Check size={16} /> Buat Pengguna</button>
                    <button className={styles.btnSecondary} onClick={() => setShowFormUser(false)}>Batal</button>
                  </div>
                </div>
              )}
              {dataLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>Nama</th><th>NIS/NIP</th><th>Role</th><th>Kelas</th><th>Terdaftar</th></tr></thead>
                    <tbody>
                      {userList.map(u => (
                        <tr key={u.id}>
                          <td className={styles.tdNama}>{u.nama_lengkap}</td>
                          <td className={styles.subText}>{u.nis_nip??"-"}</td>
                          <td><span className={`${styles.badge} ${styles["roleChip_"+u.role]}`}>{u.role}</span></td>
                          <td className={styles.subText}>{(u as any).kelas?.nama_kelas??"-"}</td>
                          <td className={styles.subText}>{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── LAPORAN ── */}
          {activeTab === "laporan" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><FileText size={22} /> Review Laporan Kegiatan</h2>
              {dataLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.laporanList}>
                  {laporanList.length === 0 && <div className={styles.emptyState}>Belum ada laporan masuk.</div>}
                  {laporanList.map(l => (
                    <div key={l.id} className={`${styles.laporanCard} ${l.status==="terkirim" ? styles.laporanCardPending : ""}`}>
                      <div className={styles.laporanTop}>
                        <div>
                          <div className={styles.laporanJudul}>{(l as any).ekskul?.emoji} {l.judul}</div>
                          <div className={styles.laporanMeta}>
                            {(l as any).pembina?.nama_lengkap} · {l.periode_laporan} · {l.jenis_laporan}
                            {l.nama_pelatih && ` · Pelatih: ${l.nama_pelatih}`}
                          </div>
                          <div className={styles.laporanMeta} style={{display:"flex",alignItems:"center",gap:6}}><BarChart2 size={14} /> {l.jumlah_pertemuan} pertemuan · {l.rata_kehadiran}% kehadiran</div>
                          {l.isi_laporan && <div className={styles.laporanIsi}>{l.isi_laporan.slice(0,200)}...</div>}
                        </div>
                        <div className={styles.laporanActions}>
                          <span className={`${styles.badge} ${l.status==="disetujui" ? styles.badgeOk : l.status==="terkirim" ? styles.badgeWarning : styles.badgeOff}`}>{l.status}</span>
                          {l.status === "terkirim" && (
                            <button className={styles.btnApprove} onClick={() => approveLaporan(l.id)} id={`btn-approve-laporan-${l.id}`} style={{display:"inline-flex",alignItems:"center",gap:4}}><Check size={14} /> Setujui</button>
                          )}
                        </div>
                      </div>
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
