"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Header from "../../components/Header";
import styles from "./admin.module.css";
import { supabase } from "@/lib/supabase";
import { loginWithEmail, logout } from "@/lib/auth-helpers";
import type { UserProfile, Ekskul, PeriodePendaftaran, LaporanKegiatan } from "@/lib/supabase";
import {
  BarChart2, Trophy, Calendar, Users, FileText, Settings,
  Check, X, Clock, Plus, Edit, Power, ArrowRight, User,
  Upload, Download, AlertCircle, CheckCircle2, Trash2
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

interface ImportRow {
  nis: string; nama: string; kelas: string;
  status?: "pending" | "ok" | "err"; msg?: string;
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
  const [kelasList, setKelasList]   = useState<{ id: string; nama_kelas: string; tingkat: number }[]>([]);
  const [dataLoad, setDataLoad]     = useState(false);
  const [msg, setMsg]               = useState("");
  const [msgType, setMsgType]       = useState<"ok"|"err">("ok");

  // Forms Ekskul
  const [showFormEkskul, setShowFormEkskul] = useState(false);
  const [formEkskul, setFormEkskul] = useState<Partial<Ekskul>>({
    kode:"", nama:"", kategori:"Olahraga", jenis:"pilihan", jadwal:"", waktu:"", lokasi:"", emoji:"⭐", deskripsi:"", nama_pelatih:"", kontak_pelatih:"", aktif:true
  });
  const [editEkskulId, setEditEkskulId] = useState<string|null>(null);

  // Forms Periode
  const [showFormPeriode, setShowFormPeriode] = useState(false);
  const [editPeriodeId, setEditPeriodeId] = useState<string|null>(null);
  const [formPeriode, setFormPeriode] = useState({ nama_periode:"", tanggal_buka:"", tanggal_tutup:"", aktif: true });
  const [periodeEkskulPilihan, setPeriodeEkskulPilihan] = useState<string[]>([]);
  const [semuaEkskul, setSemuaEkskul] = useState(true);
  const [periodeEkskulMap, setPeriodeEkskulMap] = useState<Record<string, string[]>>({});
  const [periodeEkskulIdsMap, setPeriodeEkskulIdsMap] = useState<Record<string, string[]>>({});

  // Forms User
  const [showFormUser, setShowFormUser] = useState(false);
  const [formUser, setFormUser] = useState({ nis_nip:"", nama_lengkap:"", role:"siswa" as const, kelas_id:"", email_internal:"", password:"" });

  // Import CSV
  const [showImport, setShowImport] = useState(false);
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importProgress, setImportProgress] = useState<number>(-1);
  const [importDone, setImportDone] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function showMsg(text: string, type: "ok"|"err" = "ok") {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 4000);
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single();
      if (profile?.role === "admin") setUser(profile as UserProfile);
      setLoading(false);
    });
  }, []);

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

  const loadEkskul = useCallback(async () => {
    setDataLoad(true);
    const [{ data: eks }, { data: pem }, { data: kel }] = await Promise.all([
      supabase.from("ekskul").select("*, pembina:pembina_id(nama_lengkap)").order("nama"),
      supabase.from("users").select("id,nama_lengkap").eq("role","pembina"),
      supabase.from("kelas").select("id,nama_kelas,tingkat").order("tingkat").order("nama_kelas"),
    ]);
    setEkskulList((eks ?? []) as unknown as Ekskul[]);
    setPembinas((pem ?? []) as unknown as UserProfile[]);
    setKelasList(((kel ?? []) as any[]).filter(k => k.tingkat <= 8));
    setDataLoad(false);
  }, []);

  const loadPeriode = useCallback(async () => {
    setDataLoad(true);
    const { data: periodes } = await supabase
      .from("periode_pendaftaran").select("*").order("tanggal_buka", { ascending: false });
    setPeriodeList((periodes ?? []) as PeriodePendaftaran[]);
    if (periodes && periodes.length > 0) {
      const ids = periodes.map((p: any) => p.id);
      const { data: pe } = await supabase
        .from("periode_ekskul").select("periode_id, ekskul_id, ekskul:ekskul_id(nama,emoji)")
        .in("periode_id", ids);
      const map: Record<string, string[]> = {};
      const mapIds: Record<string, string[]> = {};
      for (const row of (pe ?? [])) {
        if (!map[row.periode_id]) map[row.periode_id] = [];
        if (!mapIds[row.periode_id]) mapIds[row.periode_id] = [];
        const eks = (row as any).ekskul;
        map[row.periode_id].push(`${eks?.emoji ?? ""} ${eks?.nama ?? ""}`);
        mapIds[row.periode_id].push(row.ekskul_id);
      }
      setPeriodeEkskulMap(map);
      setPeriodeEkskulIdsMap(mapIds);
    }
    setDataLoad(false);
  }, []);

  const loadUsers = useCallback(async () => {
    setDataLoad(true);
    const { data } = await supabase
      .from("users").select("*, kelas(nama_kelas)").order("nama_lengkap").limit(200);
    setUserList((data ?? []) as unknown as UserProfile[]);
    setDataLoad(false);
  }, []);

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
    if (activeTab === "dashboard") loadStats();
    if (activeTab === "ekskul") loadEkskul();
    if (activeTab === "periode") { loadEkskul(); loadPeriode(); }
    if (activeTab === "users") { loadUsers(); loadEkskul(); }
    if (activeTab === "laporan") loadLaporan();
  }, [activeTab, user, loadStats, loadEkskul, loadPeriode, loadUsers, loadLaporan]);

  async function simpanEkskul() {
    if (!formEkskul.kode || !formEkskul.nama) { showMsg("Kode dan nama ekskul wajib diisi.", "err"); return; }
    
    // Hapus field relational (pembina) dan id agar tidak error "schema cache"
    const payload = { ...formEkskul };
    delete (payload as any).pembina;
    delete payload.id;

    if (editEkskulId) {
      const { error } = await supabase.from("ekskul").update(payload).eq("id", editEkskulId);
      if (error) { showMsg("❌ "+error.message, "err"); return; }
    } else {
      const { error } = await supabase.from("ekskul").insert(payload);
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

  async function simpanPeriode() {
    if (!formPeriode.nama_periode || !formPeriode.tanggal_buka || !formPeriode.tanggal_tutup) {
      showMsg("Lengkapi semua field periode.", "err"); return;
    }
    
    // Konversi string "YYYY-MM-DDThh:mm" (local) ke ISO 8601 (UTC)
    const payloadPeriode = {
      ...formPeriode,
      tanggal_buka: new Date(formPeriode.tanggal_buka).toISOString(),
      tanggal_tutup: new Date(formPeriode.tanggal_tutup).toISOString(),
    };
    
    if (editPeriodeId) {
      const { error } = await supabase.from("periode_pendaftaran").update(payloadPeriode).eq("id", editPeriodeId);
      if (error) { showMsg("❌ "+error.message, "err"); return; }
      
      await supabase.from("periode_ekskul").delete().eq("periode_id", editPeriodeId);
      if (!semuaEkskul && periodeEkskulPilihan.length > 0) {
        const rows = periodeEkskulPilihan.map(eid => ({ periode_id: editPeriodeId, ekskul_id: eid }));
        await supabase.from("periode_ekskul").insert(rows);
      }
      showMsg(`✅ Periode "${formPeriode.nama_periode}" berhasil diupdate!`);
    } else {
      const { data: newPeriode, error } = await supabase
        .from("periode_pendaftaran")
        .insert({ ...payloadPeriode, dibuat_oleh: user!.id })
        .select().single();
      if (error || !newPeriode) { showMsg("❌ "+(error?.message ?? "Gagal"), "err"); return; }
      if (!semuaEkskul && periodeEkskulPilihan.length > 0) {
        const rows = periodeEkskulPilihan.map(eid => ({ periode_id: newPeriode.id, ekskul_id: eid }));
        await supabase.from("periode_ekskul").insert(rows);
      }
      showMsg(`✅ Periode "${formPeriode.nama_periode}" berhasil disimpan!`);
    }
    
    setShowFormPeriode(false); setEditPeriodeId(null);
    setFormPeriode({ nama_periode:"", tanggal_buka:"", tanggal_tutup:"", aktif: true });
    setPeriodeEkskulPilihan([]); setSemuaEkskul(true);
    loadPeriode();
  }

  async function hapusPeriode(id: string) {
    if (!window.confirm("Yakin ingin menghapus periode ini? Tindakan ini tidak bisa dibatalkan.")) return;
    const { error } = await supabase.from("periode_pendaftaran").delete().eq("id", id);
    if (error) { showMsg("❌ "+error.message, "err"); return; }
    showMsg("✅ Periode berhasil dihapus.");
    loadPeriode();
  }

  async function toggleAktifPeriode(id: string, aktif: boolean) {
    await supabase.from("periode_pendaftaran").update({ aktif: !aktif }).eq("id", id);
    showMsg(`✅ Periode ${!aktif?"dibuka":"ditutup"}.`);
    loadPeriode();
  }

  async function createUser() {
    if (!formUser.nis_nip || !formUser.nama_lengkap || !formUser.password) {
      showMsg("NIS/NIP, nama, dan password wajib diisi.", "err"); return;
    }
    const emailInt = `${formUser.nis_nip.trim()}@sim.smpn5klaten`;
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

  function parseCSV(text: string): ImportRow[] {
    const lines = text.replace(/\r/g, "").split("\n").filter(l => l.trim());
    const start = /^\d/.test(lines[0]) ? 0 : 1;
    return lines.slice(start).map(line => {
      const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      return { nis: cols[0] ?? "", nama: cols[1] ?? "", kelas: cols[2] ?? "", status: "pending" as const };
    }).filter(r => r.nis && r.nama);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const rows = parseCSV(ev.target?.result as string);
      setImportRows(rows); setImportProgress(-1); setImportDone(false);
    };
    reader.readAsText(file, "UTF-8");
  }

  async function jalankanImport() {
    if (importRows.length === 0) return;
    setImportProgress(0); setImportDone(false);
    const updated = [...importRows];
    for (let i = 0; i < updated.length; i++) {
      const row = updated[i];
      const kelasObj = kelasList.find(k => k.nama_kelas.toLowerCase() === row.kelas.toLowerCase());
      
      try {
        const res = await fetch("/api/admin/create-user", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nis_nip: row.nis, nama_lengkap: row.nama, role: "siswa",
            kelas_id: kelasObj?.id ?? null,
            email: `${row.nis}@sim.smpn5klaten`,
            password: row.nis,
          }),
        });
        
        const data = await res.json();
        updated[i] = { ...row, status: data.success ? "ok" : "err", msg: data.success ? undefined : data.message };
      } catch (err: any) {
        updated[i] = { ...row, status: "err", msg: err.message || "Gagal terhubung ke API (Server Error/Timeout)" };
      }
      
      setImportRows([...updated]);
      setImportProgress(i + 1);
    }
    setImportDone(true);
    loadUsers(); loadStats();
  }

  async function approveLaporan(id: string) {
    const { error } = await supabase.from("laporan_kegiatan").update({
      status: "disetujui", disetujui_oleh: user!.id, disetujui_at: new Date().toISOString()
    }).eq("id", id);
    if (error) { showMsg("❌ "+error.message, "err"); return; }
    showMsg("✅ Laporan disetujui!");
    loadLaporan(); loadStats();
  }

  const importOk  = importRows.filter(r => r.status === "ok").length;
  const importErr = importRows.filter(r => r.status === "err").length;

  function getLocalDatetimeString(isoString: string) {
    if (!isoString) return "";
    const d = new Date(isoString);
    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  }

  if (loading) return (<main><Header activePage="Ekskul" /><div className={styles.loadingWrap}><div className={styles.spinner} /></div></main>);

  // --- Render ---
  if (dataLoad && activeTab !== "dashboard" && userList.length === 0 && ekskulList.length === 0 && periodeList.length === 0) {
    return <div className={styles.loadingState}><div className={styles.spinner} /></div>;
  }

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

        {msg && <div className={`${styles.toast} ${msgType==="err" ? styles.toastErr : styles.toastOk}`}>{msg}</div>}

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

          {activeTab === "dashboard" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><BarChart2 size={22} /> Ringkasan Sistem</h2>
              <div className={styles.statsGrid}>
                {[
                  { Icon: Users,    num:stats?.totalSiswa??"...",          label:"Total Siswa" },
                  { Icon: User,     num:stats?.totalPembina??"...",        label:"Pembina Aktif" },
                  { Icon: Trophy,   num:stats?.totalEkskul??"...",         label:"Ekskul Aktif" },
                  { Icon: Clock,    num:stats?.pendaftaranMenunggu??"...", label:"Pendaftaran Menunggu", danger:(stats?.pendaftaranMenunggu??0)>0 },
                  { Icon: FileText, num:stats?.laporanMenunggu??"...",     label:"Laporan Perlu Review", danger:(stats?.laporanMenunggu??0)>0 },
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
                  <button className={styles.quickBtn} onClick={() => setActiveTab("users")} style={{display:"inline-flex",alignItems:"center",gap:6}}><Users size={16} /> Import / Tambah Pengguna</button>
                  <button className={styles.quickBtn} onClick={() => setActiveTab("laporan")} style={{display:"inline-flex",alignItems:"center",gap:6}}><FileText size={16} /> Review Laporan</button>
                </div>
              </div>
            </div>
          )}

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
                    <div className={styles.formGroup}><label className={styles.label}>Waktu</label><input className={styles.input} value={formEkskul.waktu??""} onChange={e=>setFormEkskul(p=>({...p,waktu:e.target.value}))} placeholder="07:00-09:00" /></div>
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
                          <td className={styles.subText}>{(e as any).pembina?.nama_lengkap ?? <i>Belum ditentukan</i>}</td>
                          <td><span className={`${styles.badge} ${e.aktif ? styles.badgeOk : styles.badgeOff}`}>{e.aktif ? "Aktif" : "Nonaktif"}</span></td>
                          <td>
                            <button className={styles.btnAction} onClick={() => { setEditEkskulId(e.id); setFormEkskul(e); setShowFormEkskul(true); }} title="Edit"><Edit size={14} /></button>
                            <button className={styles.btnAction} onClick={() => toggleAktifEkskul(e.id, e.aktif)} title={e.aktif?"Nonaktifkan":"Aktifkan"}><Power size={14} color={e.aktif?"#ba1a1a":"#006b5f"} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "periode" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><Calendar size={22} /> Periode Pendaftaran</h2>
                <button className={styles.btnPrimary} onClick={() => { setEditPeriodeId(null); setFormPeriode({ nama_periode:"", tanggal_buka:"", tanggal_tutup:"", aktif:true }); setShowFormPeriode(true); setSemuaEkskul(true); setPeriodeEkskulPilihan([]); }} style={{display:"inline-flex",alignItems:"center",gap:6}}><Plus size={16} /> Buat Periode</button>
              </div>

              {showFormPeriode && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>Buat Periode Pendaftaran Baru</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}>
                      <label className={styles.label}>Nama Periode *</label>
                      <input className={styles.input} value={formPeriode.nama_periode} onChange={e=>setFormPeriode(p=>({...p,nama_periode:e.target.value}))} placeholder="Pendaftaran Ekskul Semester 1 2025/2026" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tanggal Buka *</label>
                      <input type="datetime-local" className={styles.input} value={formPeriode.tanggal_buka} onChange={e=>setFormPeriode(p=>({...p,tanggal_buka:e.target.value}))} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tanggal Tutup *</label>
                      <input type="datetime-local" className={styles.input} value={formPeriode.tanggal_tutup} onChange={e=>setFormPeriode(p=>({...p,tanggal_tutup:e.target.value}))} />
                    </div>
                    <div className={styles.formGroup} style={{gridColumn:"1/-1"}}>
                      <label className={styles.label}>Ekskul yang Dibuka untuk Pendaftaran</label>
                      <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                          <input type="radio" checked={semuaEkskul} onChange={() => { setSemuaEkskul(true); setPeriodeEkskulPilihan([]); }} />
                          <span>Semua ekskul aktif (default)</span>
                        </label>
                        <label className={styles.radioLabel}>
                          <input type="radio" checked={!semuaEkskul} onChange={() => setSemuaEkskul(false)} />
                          <span>Pilih ekskul tertentu saja</span>
                        </label>
                      </div>
                      {!semuaEkskul && (
                        <div className={styles.ekskulCheckGrid}>
                          {ekskulList.filter(e => e.aktif).map(e => {
                            const dipilih = periodeEkskulPilihan.includes(e.id);
                            return (
                              <label key={e.id} className={`${styles.ekskulCheckItem} ${dipilih ? styles.ekskulCheckItemOn : ""}`}>
                                <input type="checkbox" checked={dipilih}
                                  onChange={() => setPeriodeEkskulPilihan(prev =>
                                    dipilih ? prev.filter(x => x !== e.id) : [...prev, e.id]
                                  )} />
                                <span>{e.emoji} {e.nama}</span>
                                {e.jenis === "wajib" && <span className={styles.wajibBadge}>WAJIB</span>}
                              </label>
                            );
                          })}
                          <div className={styles.subText} style={{marginTop:8,gridColumn:"1/-1"}}>
                            {periodeEkskulPilihan.length === 0 ? "⚠️ Belum ada yang dipilih" : `✅ ${periodeEkskulPilihan.length} ekskul dipilih`}
                          </div>
                        </div>
                      )}
                    </div>
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
                    const ekskulDibuka = periodeEkskulMap[p.id];
                    return (
                      <div key={p.id} className={`${styles.periodeCard} ${isActive ? styles.periodeCardActive : ""}`}>
                        <div className={styles.periodeCardTop}>
                          <div style={{flex:1}}>
                            <div className={styles.periodeNama}>{p.nama_periode}</div>
                            <div className={styles.periodeMeta} style={{display:"flex",alignItems:"center",gap:6}}>
                              <Calendar size={14} /> {new Date(p.tanggal_buka).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}
                              {" — "}{new Date(p.tanggal_tutup).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})}
                            </div>
                            <div className={styles.periodeEkskulTags}>
                              {ekskulDibuka && ekskulDibuka.length > 0
                                ? ekskulDibuka.map((nama, i) => <span key={i} className={styles.ekskulTag}>{nama}</span>)
                                : <span className={styles.ekskulTagAll}>🔓 Semua ekskul aktif</span>}
                            </div>
                          </div>
                          <div className={styles.periodeActions}>
                            <span className={`${styles.badge} ${isActive ? styles.badgeOk : p.aktif ? styles.badgeWarning : styles.badgeOff}`} style={{display:"inline-flex",alignItems:"center",gap:4}}>
                              {isActive ? <><Check size={14} /> Buka</> : p.aktif ? <><Clock size={14} /> Dijadwalkan</> : <><X size={14} /> Tutup</>}
                            </span>
                            <div style={{display:"flex",gap:4}}>
                              <button className={styles.btnAction} onClick={() => {
                                setEditPeriodeId(p.id);
                                setFormPeriode({ nama_periode: p.nama_periode, tanggal_buka: getLocalDatetimeString(p.tanggal_buka), tanggal_tutup: getLocalDatetimeString(p.tanggal_tutup), aktif: p.aktif });
                                const eks = periodeEkskulIdsMap[p.id];
                                if (eks && eks.length > 0) { setSemuaEkskul(false); setPeriodeEkskulPilihan(eks); } else { setSemuaEkskul(true); setPeriodeEkskulPilihan([]); }
                                setShowFormPeriode(true);
                              }} title="Edit"><Edit size={14} /></button>
                              <button className={styles.btnAction} onClick={() => hapusPeriode(p.id)} title="Hapus"><Trash2 size={14} color="#ba1a1a" /></button>
                              <button className={styles.btnAction} onClick={() => toggleAktifPeriode(p.id, p.aktif)} title={p.aktif ? "Tutup Periode" : "Buka Periode"}>
                                {p.aktif ? <Power size={14} /> : <Check size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}><Users size={22} /> Manajemen Pengguna</h2>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button className={styles.btnSecondary} onClick={() => { setShowImport(true); setImportRows([]); setImportProgress(-1); setImportDone(false); }} style={{display:"inline-flex",alignItems:"center",gap:6}} id="btn-import-csv">
                    <Upload size={16} /> Import CSV
                  </button>
                  <button className={styles.btnPrimary} onClick={() => setShowFormUser(true)} style={{display:"inline-flex",alignItems:"center",gap:6}} id="btn-tambah-user">
                    <Plus size={16} /> Tambah Pengguna
                  </button>
                </div>
              </div>

              {showFormUser && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle}>Buat Pengguna Baru</h3>
                  <p className={styles.formHint}>Email login otomatis: <code>{formUser.nis_nip||"[NIS/NIP]"}@sim.smpn5klaten</code></p>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label className={styles.label}>NIS / NIP *</label><input className={styles.input} value={formUser.nis_nip} onChange={e=>setFormUser(p=>({...p,nis_nip:e.target.value}))} placeholder="12345" /></div>
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

              {showImport && (
                <div className={styles.formCard}>
                  <h3 className={styles.formCardTitle} style={{display:"flex",alignItems:"center",gap:8}}><Upload size={18} /> Import Siswa dari CSV</h3>
                  <div className={styles.importGuide}>
                    <p><strong>Format CSV yang diterima:</strong></p>
                    <code className={styles.csvExample}>NIS,Nama Lengkap,Kelas<br/>12301,Ahmad Fauzi,7A<br/>12302,Siti Rahayu,8B</code>
                    <p className={styles.importNote}>
                      &#8226; Password otomatis = <strong>NIS siswa</strong><br/>
                      &#8226; Email login = <strong>NIS@sim.smpn5klaten</strong><br/>
                      &#8226; Baris header boleh ada atau tidak<br/>
                      &#8226; Nama kelas harus persis: 7A, 7B, 8A, dll
                    </p>
                    <a href="data:text/csv;charset=utf-8,NIS%2CNama%20Lengkap%2CKelas%0A12301%2CAhmad%20Fauzi%2C7A%0A12302%2CSiti%20Rahayu%2C7B"
                      download="template_siswa.csv" className={styles.btnSecondary}
                      style={{display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none",fontSize:13}}>
                      <Download size={14} /> Download Template CSV
                    </a>
                  </div>
                  <div className={styles.formGroup} style={{marginTop:12}}>
                    <label className={styles.label}>Pilih File CSV</label>
                    <input ref={fileRef} type="file" accept=".csv,.txt" className={styles.input} onChange={handleFileChange} id="input-csv-file" />
                  </div>
                  {importRows.length > 0 && (
                    <div style={{marginTop:12}}>
                      <div className={styles.importSummaryBar}>
                        <span><strong>{importRows.length}</strong> siswa terdeteksi</span>
                        {importDone && <>
                          <span className={styles.importOk}><CheckCircle2 size={14} /> {importOk} berhasil</span>
                          {importErr > 0 && <span className={styles.importErr}><AlertCircle size={14} /> {importErr} gagal</span>}
                        </>}
                      </div>
                      {importProgress >= 0 && !importDone && (
                        <div className={styles.progressWrap}>
                          <div className={styles.progressBar} style={{width:`${Math.round((importProgress/importRows.length)*100)}%`}} />
                          <span className={styles.progressLabel}>Memproses {importProgress}/{importRows.length}...</span>
                        </div>
                      )}
                      <div className={styles.tableWrap} style={{maxHeight:260,overflowY:"auto",marginTop:8}}>
                        <table className={styles.table}>
                          <thead><tr><th>#</th><th>NIS</th><th>Nama</th><th>Kelas</th><th>Status</th></tr></thead>
                          <tbody>
                            {importRows.map((r, i) => (
                              <tr key={i}>
                                <td className={styles.subText}>{i+1}</td>
                                <td>{r.nis}</td><td>{r.nama}</td><td>{r.kelas}</td>
                                <td>
                                  {r.status === "ok"  && <span style={{color:"#006b5f",display:"inline-flex",alignItems:"center",gap:4,fontSize:12}}><CheckCircle2 size={12}/> OK</span>}
                                  {r.status === "err" && <span style={{color:"#ba1a1a",display:"inline-flex",alignItems:"center",gap:4,fontSize:12}} title={r.msg}><AlertCircle size={12}/> {r.msg?.slice(0,30)}</span>}
                                  {r.status === "pending" && <span className={styles.subText}>-</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  <div className={styles.formActions} style={{marginTop:12}}>
                    {!importDone ? (
                      <button className={styles.btnPrimary} onClick={jalankanImport}
                        disabled={importRows.length === 0 || importProgress >= 0} id="btn-proses-import"
                        style={{display:"inline-flex",alignItems:"center",gap:6}}>
                        {importProgress >= 0
                          ? <><span className={styles.spinnerSm}/> Memproses...</>
                          : <><Upload size={16}/> Proses Import ({importRows.length} siswa)</>}
                      </button>
                    ) : (
                      <button className={styles.btnPrimary} onClick={() => { setShowImport(false); setImportRows([]); }} style={{display:"inline-flex",alignItems:"center",gap:6}}><Check size={16}/> Selesai</button>
                    )}
                    <button className={styles.btnSecondary} onClick={() => { setShowImport(false); setImportRows([]); }} disabled={importProgress >= 0 && !importDone}>Tutup</button>
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
                          <td className={styles.subText}>{u.nis_nip??"- "}</td>
                          <td><span className={`${styles.badge} ${styles["roleChip_"+u.role]}`}>{u.role}</span></td>
                          <td className={styles.subText}>{(u as any).kelas?.nama_kelas??"- "}</td>
                          <td className={styles.subText}>{new Date(u.created_at).toLocaleDateString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

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
                          <div className={styles.laporanMeta}>{(l as any).pembina?.nama_lengkap} &#183; {l.periode_laporan} &#183; {l.jenis_laporan}</div>
                          <div className={styles.laporanMeta} style={{display:"flex",alignItems:"center",gap:6}}><BarChart2 size={14} /> {l.jumlah_pertemuan} pertemuan &#183; {l.rata_kehadiran}% kehadiran</div>
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
