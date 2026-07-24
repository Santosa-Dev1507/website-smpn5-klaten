"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import styles from "./walikelas.module.css";
import { supabase } from "@/lib/supabase";
import { loginWithEmail, logout } from "@/lib/auth-helpers";
import type { UserProfile } from "@/lib/supabase";
import { Home, Users, Target, BarChart2, AlertTriangle, Check, Trophy, Award, User, ArrowRight, AlertCircle } from "lucide-react";

type Tab = "siswa" | "absensi" | "prestasi" | "belum_ekskul";

interface SiswaRekap {
  id: string;
  nama: string;
  nis: string;
  ekskul: { nama: string; emoji: string; status: string }[];
  hadir: number;
  izin: number;
  alpa: number;
  persen: number;
}

interface PrestasiItem {
  nama_siswa: string;
  nama_lomba: string;
  tingkat: string;
  hasil: string;
  ekskul_nama: string;
  ekskul_emoji: string;
  tanggal: string | null;
}

const HASIL_LABEL: Record<string, { label: string; Icon: any }> = {
  juara_1: { label: "Juara 1", Icon: Trophy },
  juara_2: { label: "Juara 2", Icon: Trophy },
  juara_3: { label: "Juara 3", Icon: Trophy },
  harapan_1: { label: "Harapan 1", Icon: Award },
  harapan_2: { label: "Harapan 2", Icon: Award },
  harapan_3: { label: "Harapan 3", Icon: Award },
  peserta: { label: "Peserta", Icon: Award },
};

export default function WalikelasPage() {
  const [user, setUser]         = useState<UserProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [email, setEmail]       = useState("");
  const [pass, setPass]         = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoad, setLoginLoad] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("siswa");
  const [siswaRekap, setSiswaRekap] = useState<SiswaRekap[]>([]);
  const [prestasiList, setPrestasiList] = useState<PrestasiItem[]>([]);
  const [belumEkskulList, setBelumEkskulList] = useState<{ id: string; nama: string; nis: string }[]>([]);
  const [dataLoad, setDataLoad] = useState(false);
  const [filterEkskul, setFilterEkskul] = useState("");
  const [rekapBulan, setRekapBulan] = useState(new Date().toISOString().slice(0, 7));

  // Stats
  const totalSiswa = siswaRekap.length;
  const ikutEkskul = siswaRekap.filter(s => s.ekskul.some(e => e.status === "disetujui")).length;
  const avgPersen  = siswaRekap.length > 0
    ? Math.round(siswaRekap.filter(s=>s.persen>0).reduce((a,b) => a+b.persen, 0) / (siswaRekap.filter(s=>s.persen>0).length || 1))
    : 0;
  const rendahKehadiran = siswaRekap.filter(s => s.persen > 0 && s.persen < 75).length;

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (!authUser) { setLoading(false); return; }
      const { data: profile } = await supabase
        .from("users").select("*, kelas(nama_kelas,tingkat)").eq("id", authUser.id).single();
      if (profile?.role === "walikelas") setUser(profile as UserProfile);
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
      const { data: profile } = await supabase
        .from("users").select("*, kelas(nama_kelas,tingkat)").eq("id", authUser.id).single();
      if (!profile || profile.role !== "walikelas") { await logout(); throw new Error("Akun ini bukan wali kelas."); }
      setUser(profile as UserProfile);
    } catch (err: unknown) { setLoginErr(err instanceof Error ? err.message : "Login gagal."); }
    finally { setLoginLoad(false); }
  }

  const loadSiswaRekap = useCallback(async () => {
    if (!user?.kelas_id) return;
    setDataLoad(true);
    const mulai = `${rekapBulan}-01`;
    const akhir = `${rekapBulan}-31`;

    // Load siswa di kelas ini
    const { data: siswaData } = await supabase
      .from("users")
      .select("id, nama_lengkap, nis_nip, pendaftaran(status, ekskul:ekskul_id(nama, emoji))")
      .eq("kelas_id", user.kelas_id)
      .eq("role", "siswa")
      .order("nama_lengkap");

    // Load absensi bulan ini
    const siswaIds = (siswaData ?? []).map((s: any) => s.id);
    let absenMap = new Map<string, { hadir: number; izin: number; alpa: number }>();
    if (siswaIds.length > 0) {
      const { data: sesiData } = await supabase
        .from("sesi_absensi").select("id").gte("tanggal", mulai).lte("tanggal", akhir);
      const sesiIds = (sesiData ?? []).map(s => s.id);
      if (sesiIds.length > 0) {
        const { data: absenData } = await supabase
          .from("absensi").select("siswa_id, status").in("sesi_id", sesiIds).in("siswa_id", siswaIds);
        for (const a of (absenData ?? [])) {
          if (!absenMap.has(a.siswa_id)) absenMap.set(a.siswa_id, { hadir: 0, izin: 0, alpa: 0 });
          const rec = absenMap.get(a.siswa_id)!;
          if (a.status === "hadir") rec.hadir++;
          else if (a.status === "izin") rec.izin++;
          else rec.alpa++;
        }
      }
    }

    const result: SiswaRekap[] = (siswaData ?? []).map((s: any) => {
      const ab = absenMap.get(s.id) ?? { hadir: 0, izin: 0, alpa: 0 };
      const total = ab.hadir + ab.izin + ab.alpa;
      return {
        id: s.id, nama: s.nama_lengkap, nis: s.nis_nip ?? "-",
        ekskul: (s.pendaftaran ?? []).map((p: any) => ({ nama: p.ekskul.nama, emoji: p.ekskul.emoji, status: p.status })),
        ...ab, persen: total > 0 ? Math.round((ab.hadir / total) * 100) : 0,
      };
    });
    setSiswaRekap(result);
    setDataLoad(false);
  }, [user, rekapBulan]);

  const loadPrestasi = useCallback(async () => {
    if (!user?.kelas_id) return;
    setDataLoad(true);
    const { data: siswaData } = await supabase.from("users").select("id").eq("kelas_id", user.kelas_id).eq("role", "siswa");
    const ids = (siswaData ?? []).map(s => s.id);
    if (ids.length === 0) { setDataLoad(false); return; }
    const { data } = await supabase
      .from("peserta_lomba")
      .select("hasil, siswa:siswa_id(nama_lengkap), lomba:lomba_id(nama_lomba, tingkat, tanggal_mulai, ekskul:ekskul_id(nama, emoji))")
      .in("siswa_id", ids)
      .order("created_at", { ascending: false });
    setPrestasiList((data ?? []).map((p: any) => ({
      nama_siswa: p.siswa.nama_lengkap,
      nama_lomba: p.lomba.nama_lomba,
      tingkat: p.lomba.tingkat,
      hasil: p.hasil,
      ekskul_nama: p.lomba.ekskul.nama,
      ekskul_emoji: p.lomba.ekskul.emoji,
      tanggal: p.lomba.tanggal_mulai,
    })));
    setDataLoad(false);
  }, [user]);

  const loadBelumEkskul = useCallback(async () => {
    if (!user?.kelas_id) return;
    setDataLoad(true);
    // Cari periode aktif
    const { data: periodeData } = await supabase
      .from("periode_pendaftaran").select("id").eq("aktif", true).limit(1).single();
    const periodeId = periodeData?.id;
    // Ambil semua siswa di kelas ini
    const { data: siswaData } = await supabase
      .from("users").select("id, nama_lengkap, nis_nip")
      .eq("kelas_id", user.kelas_id).eq("role", "siswa").order("nama_lengkap");
    const allSiswa = (siswaData ?? []) as { id: string; nama_lengkap: string; nis_nip: string | null }[];
    if (allSiswa.length === 0) { setBelumEkskulList([]); setDataLoad(false); return; }
    // Ambil siswa yg sudah punya pendaftaran disetujui di ekskul PILIHAN dan periode aktif
    let sudahDaftar = new Set<string>();
    if (periodeId) {
      const { data: pend } = await supabase
        .from("pendaftaran")
        .select("siswa_id, ekskul:ekskul_id(jenis)")
        .eq("status", "disetujui")
        .eq("periode_id", periodeId)
        .in("siswa_id", allSiswa.map(s => s.id));
      for (const p of (pend ?? [])) {
        if ((p as any).ekskul?.jenis === "pilihan") sudahDaftar.add((p as any).siswa_id);
      }
    }
    setBelumEkskulList(
      allSiswa
        .filter(s => !sudahDaftar.has(s.id))
        .map(s => ({ id: s.id, nama: s.nama_lengkap, nis: s.nis_nip ?? "-" }))
    );
    setDataLoad(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === "siswa" || activeTab === "absensi") loadSiswaRekap();
    if (activeTab === "prestasi") loadPrestasi();
    if (activeTab === "belum_ekskul") loadBelumEkskul();
  }, [activeTab, user, loadSiswaRekap, loadPrestasi, loadBelumEkskul]);

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
          <div className={styles.loginEmoji}><Home size={48} color="#944535" /></div>
          <h1 className={styles.loginTitle}>Area Wali Kelas</h1>
          <p className={styles.loginDesc}>Login dengan email dan password untuk melihat rekap ekskul siswa di kelas Anda.</p>
          {loginErr && <div className={styles.alertError}>{loginErr}</div>}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="wk-email">Email</label>
              <input id="wk-email" type="email" className={styles.input} placeholder="email@smpn5klaten.sch.id" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="wk-pass">Password</label>
              <input id="wk-pass" type="password" className={styles.input} placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
            </div>
            <button className={styles.btnSubmit} type="submit" disabled={loginLoad} id="btn-login-walikelas">
              {loginLoad ? <span className={styles.spinnerSm} /> : <span style={{display:"inline-flex",alignItems:"center",gap:6}}>Masuk <ArrowRight size={16} /></span>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );

  const kelas = (user as any).kelas?.nama_kelas ?? "-";
  const filteredSiswa = filterEkskul
    ? siswaRekap.filter(s => s.ekskul.some(e => e.nama === filterEkskul))
    : siswaRekap;
  const allEkskul = Array.from(new Set(siswaRekap.flatMap(s => s.ekskul.map(e => e.nama))));

  return (
    <main>
      <Header activePage="Ekskul" />
      <div className={styles.dashWrap}>

        {/* ── Top Bar ── */}
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <div className={styles.avatar}>{user.nama_lengkap.charAt(0)}</div>
            <div>
              <div className={styles.userName}>Wali Kelas {kelas}</div>
              <div className={styles.userSub}>{user.nama_lengkap}</div>
            </div>
          </div>
          <button className={styles.btnLogout} onClick={async () => { await logout(); setUser(null); }}>Keluar</button>
        </div>

        {/* ── Stats ── */}
        <div className={styles.statsBar}>
          {[
            { num: totalSiswa, label: "Total Siswa", Icon: Users },
            { num: ikutEkskul, label: "Ikut Ekskul", Icon: Target },
            { num: `${avgPersen}%`, label: "Rata Kehadiran", Icon: BarChart2 },
            { num: rendahKehadiran, label: "< 75% Hadir", Icon: AlertTriangle, danger: rendahKehadiran > 0 },
          ].map(({ label, num, Icon, danger }) => (
            <div key={label} className={`${styles.statCard} ${danger ? styles.statCardDanger : ""}`}>
              <span className={styles.statIcon}><Icon size={24} color={danger ? "#ba1a1a" : "#944535"} /></span>
              <span className={`${styles.statNum} ${danger ? styles.statNumDanger : ""}`}>{num}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabBar}>
          {[
            { id: "siswa" as const, Icon: Users, label: "Daftar Siswa" },
            { id: "absensi" as const, Icon: BarChart2, label: "Rekap Absensi" },
            { id: "prestasi" as const, Icon: Trophy, label: "Prestasi Kelas" },
            { id: "belum_ekskul" as const, Icon: AlertCircle, label: `Belum Ekskul${belumEkskulList.length > 0 ? ` (${belumEkskulList.length})` : ""}`, badge: belumEkskulList.length > 0 },
          ].map(({ id, Icon, label, badge }) => (
            <button key={id} className={`${styles.tabBtn} ${activeTab === id ? styles.tabBtnActive : ""}`} onClick={() => setActiveTab(id)} style={badge ? {color: activeTab === id ? undefined : "#b45309"} : {}}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>

          {/* ── Tab Daftar Siswa ── */}
          {activeTab === "siswa" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle}>Daftar Siswa Kelas {kelas}</h2>
                <select className={styles.filterSelect} value={filterEkskul} onChange={e => setFilterEkskul(e.target.value)}>
                  <option value="">Semua Ekskul</option>
                  {allEkskul.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              {dataLoad ? <div className={styles.loadRow}>Memuat data...</div> : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>No</th><th>Nama Siswa</th><th>NIS</th><th>Ekskul Diikuti</th><th>Kehadiran</th></tr></thead>
                    <tbody>
                      {filteredSiswa.length === 0
                        ? <tr><td colSpan={5} className={styles.emptyRow}>Tidak ada data.</td></tr>
                        : filteredSiswa.map((s, i) => (
                          <tr key={s.id} className={s.persen > 0 && s.persen < 75 ? styles.rowDanger : ""}>
                            <td>{i+1}</td>
                            <td className={styles.tdNama}>{s.nama}</td>
                            <td className={styles.tdNis}>{s.nis}</td>
                            <td>
                              <div className={styles.ekskulTags}>
                                {s.ekskul.length === 0
                                  ? <span className={styles.noEkskul}>-</span>
                                  : s.ekskul.map((e, j) => (
                                    <span key={j} className={`${styles.ekskulTag} ${e.status === "disetujui" ? styles.ekskulTagOk : styles.ekskulTagPending}`}>
                                      {e.emoji} {e.nama}
                                    </span>
                                  ))}
                              </div>
                            </td>
                            <td>
                              {s.persen > 0 ? (
                                <div className={styles.pctCell}>
                                  <div className={styles.progressMini}>
                                    <div className={styles.progressMiniFill}
                                      style={{ width:`${s.persen}%`, background: s.persen<75?"#ba1a1a":s.persen>=85?"#006b5f":"#944535" }} />
                                  </div>
                                  <span className={s.persen < 75 ? styles.pctDanger : styles.pctOk}>{s.persen}%</span>
                                </div>
                              ) : <span className={styles.noData}>-</span>}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Tab Rekap Absensi ── */}
          {activeTab === "absensi" && (
            <div>
              <div className={styles.tabHeader}>
                <h2 className={styles.sectionTitle}>Rekap Absensi</h2>
                <div className={styles.filterRow}>
                  <input type="month" className={styles.inputMonth} value={rekapBulan} onChange={e => setRekapBulan(e.target.value)} />
                  <button className={styles.btnRefresh} onClick={loadSiswaRekap}>Tampilkan</button>
                </div>
              </div>
              <p className={styles.hint}>Baris merah = kehadiran di bawah 75%. Segera berikan perhatian khusus.</p>
              {dataLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead><tr><th>No</th><th>Nama Siswa</th><th>Hadir</th><th>Izin</th><th>Alpa</th><th>%</th><th>Status</th></tr></thead>
                    <tbody>
                      {siswaRekap.filter(s => s.hadir+s.izin+s.alpa > 0).length === 0
                        ? <tr><td colSpan={7} className={styles.emptyRow}>Belum ada data absensi bulan ini.</td></tr>
                        : siswaRekap
                            .filter(s => s.hadir+s.izin+s.alpa > 0)
                            .sort((a, b) => a.persen - b.persen)
                            .map((s, i) => (
                              <tr key={s.id} className={s.persen < 75 ? styles.rowDanger : ""}>
                                <td>{i+1}</td>
                                <td className={styles.tdNama}>{s.nama}</td>
                                <td className={styles.tdHadir}>{s.hadir}</td>
                                <td className={styles.tdIzin}>{s.izin}</td>
                                <td className={styles.tdAlpa}>{s.alpa}</td>
                                <td>
                                  <div className={styles.pctCell}>
                                    <div className={styles.progressMini}>
                                      <div className={styles.progressMiniFill}
                                        style={{ width:`${s.persen}%`, background:s.persen<75?"#ba1a1a":s.persen>=85?"#006b5f":"#944535" }} />
                                    </div>
                                    <span className={s.persen < 75 ? styles.pctDanger : styles.pctOk}>{s.persen}%</span>
                                  </div>
                                </td>
                                <td><span className={`${styles.badge} ${s.persen < 75 ? styles.badgeDanger : styles.badgeOk}`} style={{display:"inline-flex",alignItems:"center",gap:4}}>{s.persen < 75 ? <><AlertTriangle size={14} /> Rendah</> : <><Check size={14} /> Baik</>}</span></td>
                              </tr>
                            ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Tab Prestasi ── */}
          {activeTab === "prestasi" && (
            <div>
              <h2 className={styles.sectionTitle}>Prestasi Siswa Kelas {kelas}</h2>
              {dataLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                prestasiList.length === 0
                  ? <div className={styles.emptyState}>Belum ada data prestasi lomba untuk kelas ini.</div>
                  : <div className={styles.prestasiList}>
                      {prestasiList.map((p, i) => {
                        const info = HASIL_LABEL[p.hasil] || { label: p.hasil, Icon: Award };
                        const IconComp = info.Icon;
                        return (
                          <div key={i} className={`${styles.prestasiCard} ${p.hasil !== "peserta" ? styles.prestasiCardJuara : ""}`}>
                            <div className={styles.prestasiHasil} style={{display:"inline-flex",alignItems:"center",gap:6}}><IconComp size={16} /> {info.label}</div>
                            <div className={styles.prestasiNama}>{p.nama_lomba}</div>
                            <div className={styles.prestasiSiswa} style={{display:"flex",alignItems:"center",gap:6}}><User size={16} /> {p.nama_siswa}</div>
                            <div className={styles.prestasiMeta} style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                              <span>{p.ekskul_emoji} {p.ekskul_nama}</span> · <span>Tingkat {p.tingkat}</span>
                              {p.tanggal && <span>· {new Date(p.tanggal).toLocaleDateString("id-ID",{year:"numeric",month:"long"})}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
              )}
            </div>
          )}

          {/* ── Tab Belum Ekskul ── */}
          {activeTab === "belum_ekskul" && (
            <div>
              <h2 className={styles.sectionTitle} style={{display:"flex",alignItems:"center",gap:8}}>
                <AlertCircle size={22} color="#b45309" /> Siswa Belum Ikut Ekskul Pilihan
              </h2>
              {belumEkskulList.length > 0 && (
                <div className={styles.belumEkskulAlert}>
                  ⚠️ <strong>{belumEkskulList.length} siswa</strong> di kelas {kelas} belum mendaftar ekskul pilihan apapun pada periode aktif.
                </div>
              )}
              {dataLoad ? <div className={styles.loadRow}>Memuat...</div> : (
                belumEkskulList.length === 0
                  ? <div className={styles.emptyState}>🎉 Semua siswa di kelas {kelas} sudah ikut minimal 1 ekskul pilihan!</div>
                  : <div className={styles.belumEkskulWrap}>
                      {belumEkskulList.map((s, i) => (
                        <div key={s.id} className={styles.belumEkskulCard}>
                          <div>
                            <div className={styles.belumEkskulName}>{i + 1}. {s.nama}</div>
                            <div className={styles.belumEkskulNis}>NIS: {s.nis}</div>
                          </div>
                          <span className={styles.badgeDanger} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,fontSize:"0.75rem",fontWeight:700}}>
                            <AlertCircle size={13} /> Belum Daftar
                          </span>
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
