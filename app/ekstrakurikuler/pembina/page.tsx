"use client";
import { useState } from "react";
import Header from "../../components/Header";
import styles from "./pembina.module.css";

type Step = "login" | "dashboard";

interface UserData {
  id: string;
  nama: string;
  role: string;
  token: string;
  username: string;
  ekskulKu?: string[];
}

interface AbsenItem {
  siswa_id: string;
  siswa_nama: string;
  status: "hadir" | "tidak_hadir" | "izin";
  keterangan: string;
}

const ekskulList = [
  { id: "pramuka",      nama: "Pramuka",           emoji: "⚜️", pendaftaran: "terbuka" },
  { id: "pmr",          nama: "PMR / UKS",          emoji: "🏥", pendaftaran: "terbuka" },
  { id: "pbb",          nama: "PBB / Tata Upacara", emoji: "🎖️", pendaftaran: "terbuka" },
  { id: "tbq",          nama: "TBQ (Tuntas Baca Quran)", emoji: "📖", pendaftaran: "tertutup" },
  { id: "osn-mat",      nama: "OSN Matematika",     emoji: "📐", pendaftaran: "tertutup" },
  { id: "osn-ips",      nama: "OSN IPS",            emoji: "🌍", pendaftaran: "tertutup" },
  { id: "osn-ipa",      nama: "OSN IPA",            emoji: "🔬", pendaftaran: "tertutup" },
  { id: "seni-tari",    nama: "Seni Tari",          emoji: "💃", pendaftaran: "terbuka" },
  { id: "paduan-suara", nama: "Paduan Suara",       emoji: "🎵", pendaftaran: "terbuka" },
  { id: "futsal",       nama: "Futsal",              emoji: "⚽", pendaftaran: "terbuka" },
  { id: "jiu-jitsu",   nama: "Jiu Jitsu",           emoji: "🥋", pendaftaran: "terbuka" },
];

export default function PembinaPage() {
  const [step, setStep]               = useState<Step>("login");
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [user, setUser]               = useState<UserData | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  // Absensi state
  const [ekskulId, setEkskulId]       = useState("");
  const [tanggal, setTanggal]         = useState(new Date().toISOString().split("T")[0]);
  const [siswaDaftar, setSiswaDaftar] = useState<AbsenItem[]>([]);
  const [absenLoading, setAbsenLoading] = useState(false);
  const [absenMsg, setAbsenMsg]       = useState("");

  // Laporan state
  const [laporan, setLaporan]         = useState<Record<string, unknown> | null>(null);
  const [lapLoading, setLapLoading]   = useState(false);

  // Undangan state
  const [undangEkskul, setUndangEkskul] = useState("");
  const [undangNis, setUndangNis]       = useState("");
  const [undangLoading, setUndangLoading] = useState(false);
  const [undangMsg, setUndangMsg]       = useState("");

  // Verifikasi state
  const [verifikasiList, setVerifikasiList] = useState<any[]>([]);
  const [verifLoading, setVerifLoading] = useState(false);
  const [verifMsg, setVerifMsg] = useState("");
  const [verifEkskul, setVerifEkskul] = useState("");

  // Prestasi & Lomba state
  const [prestasiList, setPrestasiList] = useState<any[]>([]);
  const [prestasiLoading, setPrestasiLoading] = useState(false);
  const [prestasiMsg, setPrestasiMsg] = useState("");
  const [prestasiForm, setPrestasiForm] = useState({ ekskulId: "", lombaId: "", tingkat: "Kabupaten", juara: "Juara 1", tanggal: "", namaSiswa: "" });

  const [lombaList, setLombaList] = useState<any[]>([]);
  const [lombaLoading, setLombaLoading] = useState(false);
  const [lombaMsg, setLombaMsg] = useState("");

  // Mobile Tab State (Stitch UI)
  const [activeTab, setActiveTab] = useState("absen");

  // Filter ekskul berdasarkan hak akses pembina
  const allowedEkskul = user?.role === "admin" 
    ? ekskulList 
    : ekskulList.filter(e => (user?.ekskulKu || []).includes(e.id));

  // ── Login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const role = username.toLowerCase() === "admin" ? "admin" : "pembina";
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username, password, role }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Login gagal.");
      setUser({ id: data.user_id, nama: data.nama, role: data.role, token: data.token, username: data.username, ekskulKu: data.ekskulKu });
      setStep("dashboard");
      handleMuatLombaList(data.token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  // ── Ambil Daftar Lomba ──
  async function handleMuatLombaList(token?: string) {
    const t = token || user?.token;
    if (!t) return;
    setLombaLoading(true);
    setLombaMsg("");
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getLombaList", token: t })
      });
      const data = await res.json();
      if (data.success) {
        setLombaList(data.data || []);
      } else {
        setLombaMsg("⚠️ Gagal memuat lomba: " + data.message);
      }
    } catch (e: any) {
      setLombaMsg("❌ Error: " + e.message);
    } finally {
      setLombaLoading(false);
    }
  }

  // ── Ambil Daftar Siswa untuk Absensi ──
  async function handleMuatAbsensi() {
    if (!ekskulId) { setAbsenMsg("Pilih ekskul terlebih dahulu."); return; }
    setAbsenLoading(true);
    setAbsenMsg("");
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getSesiAbsensi", token: user?.token, ekskulId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      // Jika ada siswa terdaftar
      if (data.siswaList && data.siswaList.length > 0) {
        setSiswaDaftar(data.siswaList.map((s: {siswa_id: string; siswa_nama: string}) => ({
          siswa_id: s.siswa_id,
          siswa_nama: s.siswa_nama,
          status: "hadir" as const,
          keterangan: "",
        })));
      } else {
        // Demo: tampilkan siswa dummy jika belum ada pendaftaran
        setSiswaDaftar([
          { siswa_id: "demo-1", siswa_nama: "Ahmad Fauzi", status: "hadir", keterangan: "" },
          { siswa_id: "demo-2", siswa_nama: "Raditya Pratama", status: "hadir", keterangan: "" },
        ]);
        setAbsenMsg("ℹ️ Menampilkan data demo. Belum ada siswa yang mendaftar ekskul ini.");
      }
    } catch (err: unknown) {
      setAbsenMsg(err instanceof Error ? err.message : "Gagal memuat data.");
    } finally {
      setAbsenLoading(false);
    }
  }

  function updateAbsen(idx: number, field: keyof AbsenItem, val: string) {
    setSiswaDaftar((prev) => prev.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item
    ));
  }

  async function handleSimpanAbsensi() {
    if (siswaDaftar.length === 0) return;
    setAbsenLoading(true);
    setAbsenMsg("");
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simpanAbsensi",
          token: user?.token,
          ekskulId,
          absensiData: siswaDaftar,
          tanggal,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAbsenMsg("✅ " + data.message);
    } catch (err: unknown) {
      setAbsenMsg("❌ " + (err instanceof Error ? err.message : "Gagal menyimpan."));
    } finally {
      setAbsenLoading(false);
    }
  }

  async function handleMuatLaporan() {
    setLapLoading(true);
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getLaporanRekap", token: user?.token }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setLaporan(data.data);
    } catch (err: unknown) {
      setLaporan({ error: err instanceof Error ? err.message : "Gagal memuat." });
    } finally {
      setLapLoading(false);
    }
  }

  async function handleUndangSiswa(e: React.FormEvent) {
    e.preventDefault();
    if (!undangEkskul || !undangNis) return;
    setUndangLoading(true);
    setUndangMsg("");
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "tambahSiswaUndangan", token: user?.token, ekskulId: undangEkskul, nisSiswa: undangNis }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setUndangMsg("✅ " + data.message);
      setUndangNis(""); // reset NIS setelah sukses
    } catch (err: unknown) {
      setUndangMsg("❌ " + (err instanceof Error ? err.message : "Gagal menambahkan siswa."));
    } finally {
      setUndangLoading(false);
    }
  }

  async function handleMuatVerifikasi() {
    if (!verifEkskul) { setVerifMsg("Pilih ekskul dulu."); return; }
    setVerifLoading(true); setVerifMsg("");
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getPendaftarMenunggu", token: user?.token, ekskulId: verifEkskul })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setVerifikasiList(data.data || []);
      if (data.data.length === 0) setVerifMsg("ℹ️ Tidak ada pendaftar baru yang menunggu.");
    } catch (e: any) { setVerifMsg("❌ " + e.message); }
    finally { setVerifLoading(false); }
  }

  async function handleVerifikasi(pendaftaranId: string, status: string) {
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatusPendaftaran", token: user?.token, pendaftaranId, status })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setVerifikasiList(prev => prev.filter(p => p.id !== pendaftaranId));
    } catch (e: any) { alert("Error: " + e.message); }
  }

  async function handleMuatPrestasi(eId: string) {
    setPrestasiForm({ ...prestasiForm, ekskulId: eId });
    if(!eId) { setPrestasiList([]); return; }
    setPrestasiLoading(true);
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getPrestasiEkskul", token: user?.token, ekskulId: eId })
      });
      const data = await res.json();
      if (data.success) setPrestasiList(data.data || []);
    } catch (e) { console.error(e); }
    finally { setPrestasiLoading(false); }
  }

  async function handleSimpanPrestasi(e: React.FormEvent) {
    e.preventDefault();
    if (!prestasiForm.ekskulId || !prestasiForm.lombaId || !prestasiForm.tanggal) return;
    setPrestasiLoading(true); setPrestasiMsg("");
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tambahPrestasi", token: user?.token,
          data: {
            siswa_nama: prestasiForm.namaSiswa,
            lomba_id: prestasiForm.lombaId,
            hasil: prestasiForm.juara,
            tingkat: prestasiForm.tingkat,
            tanggal: prestasiForm.tanggal,
            ekskul_id: prestasiForm.ekskulId
          }
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPrestasiMsg("✅ Prestasi berhasil ditambahkan!");
      handleMuatPrestasi(prestasiForm.ekskulId);
      setPrestasiForm({ ...prestasiForm, lombaId: "", tanggal: "", namaSiswa: "" }); // reset
    } catch (e: any) { setPrestasiMsg("❌ " + e.message); }
    finally { setPrestasiLoading(false); }
  }

  return (
    <main>
      <Header activePage="Ekskul" />

      <div className={styles.wrapper}>

        {/* ── Login ── */}
        {step === "login" && (
          <div className={styles.loginContainer}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
            <h1 className={styles.loginTitle}>Area Pembina</h1>
            <p className={styles.loginDesc}>Login menggunakan NIP dan password untuk mengakses dashboard pembina.</p>

            {error && <div className={styles.errorMsg} role="alert">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className={styles.inputGroup}>
                <label htmlFor="input-nip" className={styles.label}>NIP / Username</label>
                <input
                  id="input-nip"
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: NIP001 atau admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required autoFocus
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="input-pass" className={styles.label}>Password</label>
                <input
                  id="input-pass"
                  type="password"
                  className={styles.input}
                  placeholder="Password akun pembina"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.btnPrimary} disabled={loading} id="btn-login-pembina">
                {loading ? "Memuat..." : "Masuk ke Dashboard →"}
              </button>
            </form>
            <div style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
              <a href="/ekstrakurikuler" style={{ color: "#944535", textDecoration: "none", fontWeight: "600" }}>← Kembali ke Halaman Ekskul</a>
            </div>
          </div>
        )}

        {/* ── Dashboard ── */}
        {step === "dashboard" && user && (
          <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.dashboardHeader}>
              <div>
                <h2 className={styles.dashboardTitle}>Ringkasan Ekstrakurikuler</h2>
                <p className={styles.dashboardSubtitle}>Selamat datang kembali, {user.nama} ({user.role === "admin" ? "Admin" : "Pembina"})</p>
              </div>
              <button
                className={styles.btnSecondary}
                onClick={() => { setStep("login"); setUser(null); setSiswaDaftar([]); setLaporan(null); }}
              >
                Keluar
              </button>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.statCardTeal}`}>
                <div className={styles.statHeader}>
                  <span className={styles.statIcon}>👥</span>
                  <span className={`${styles.statBadge} ${styles.bgTeal}`}>Siswa Aktif</span>
                </div>
                <div className={styles.statValue}>1,248</div>
                <div className={styles.statDesc}>Total terdaftar semester ini</div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardNavy}`}>
                <div className={styles.statHeader}>
                  <span className={styles.statIcon}>🏅</span>
                  <span className={`${styles.statBadge} ${styles.bgNavy}`}>Unit Ekskul</span>
                </div>
                <div className={styles.statValue}>24</div>
                <div className={styles.statDesc}>Kesenian, Olahraga, & Sains</div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardBlue}`}>
                <div className={styles.statHeader}>
                  <span className={styles.statIcon}>🏆</span>
                  <span className={`${styles.statBadge} ${styles.bgBlue}`}>Prestasi</span>
                </div>
                <div className={styles.statValue}>15</div>
                <div className={styles.statDesc}>Penghargaan bulan ini</div>
              </div>
            </div>

            {/* Content Grid (Stitch Responsive Tab Layout) */}
            <div className={styles.contentGrid}>
              
              {/* ── Left Column: Absensi ── */}
              <div className={`${styles.card} ${activeTab !== "absen" ? styles.mobileTabHidden : ""}`}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>📋 Absensi Kegiatan</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.absenFilter}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Pilih Ekskul</label>
                      <select className={styles.input} value={ekskulId} onChange={(e) => setEkskulId(e.target.value)} id="select-ekskul-absen">
                        <option value="">-- Pilih Ekskul --</option>
                        {allowedEkskul.map((e) => (
                          <option key={e.id} value={e.id}>{e.emoji} {e.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Tanggal</label>
                      <input type="date" className={styles.input} value={tanggal} onChange={(e) => setTanggal(e.target.value)} id="input-tanggal-absen" />
                    </div>
                    <button className={styles.btnMuat} onClick={handleMuatAbsensi} disabled={absenLoading} id="btn-muat-absensi">
                      {absenLoading ? <span className={styles.spinner} /> : "Muat Daftar Siswa"}
                    </button>
                  </div>

                  {absenMsg && (
                    <div className={absenMsg.startsWith("✅") ? styles.alertSuccess : absenMsg.startsWith("ℹ️") ? styles.alertInfo : styles.alertError}>
                      {absenMsg}
                    </div>
                  )}

                  {siswaDaftar.length > 0 && (
                    <>
                      <div className={styles.tableContainer}>
                        <table className={styles.stitchTable}>
                          <thead>
                            <tr>
                              <th className={styles.stitchTh}>Nama Siswa</th>
                              <th className={styles.stitchTh} style={{ textAlign: "center" }}>Kehadiran</th>
                              <th className={styles.stitchTh}>Keterangan</th>
                            </tr>
                          </thead>
                          <tbody>
                            {siswaDaftar.map((item, idx) => (
                              <tr key={item.siswa_id} className={styles.stitchTr}>
                                <td className={styles.stitchTd}>
                                  <div className={styles.siswaProfil}>
                                    <div className={styles.avatar}>{item.siswa_nama.substring(0,2).toUpperCase()}</div>
                                    <div className={styles.siswaDetail}>
                                      <span className={styles.siswaNamaText}>{item.siswa_nama}</span>
                                      <span className={styles.siswaNisn}>ID: {item.siswa_id}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className={styles.stitchTd}>
                                  <div className={styles.radioContainer}>
                                    {(["hadir", "tidak_hadir", "izin"] as const).map((s) => {
                                      const isActive = item.status === s;
                                      const isHadir = s === "hadir";
                                      const isIzin = s === "izin";
                                      const labelClass = isHadir ? styles.labelHadir : isIzin ? styles.labelIzin : styles.labelSakit;
                                      const inputClass = isHadir ? styles.inputHadir : isIzin ? styles.inputIzin : styles.inputSakit;
                                      return (
                                        <label key={s} htmlFor={`radio-${idx}-${s}`} className={`${styles.radioLabel} ${labelClass}`}>
                                          <input
                                            id={`radio-${idx}-${s}`}
                                            type="radio"
                                            name={`status-${idx}`}
                                            value={s}
                                            checked={isActive}
                                            onChange={() => updateAbsen(idx, "status", s)}
                                            className={`${styles.radioInput} ${inputClass}`}
                                          />
                                          {s === "hadir" ? "Hadir" : s === "tidak_hadir" ? "Tidak" : "Izin"}
                                        </label>
                                      );
                                    })}
                                  </div>
                                </td>
                                <td className={styles.stitchTd}>
                                  <input
                                    type="text"
                                    className={styles.inputKet}
                                    placeholder="Tambahkan keterangan..."
                                    value={item.keterangan}
                                    onChange={(e) => updateAbsen(idx, "keterangan", e.target.value)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button className={styles.btnSimpan} onClick={handleSimpanAbsensi} disabled={absenLoading} id="btn-simpan-absensi" style={{ width: "100%", marginTop: "1rem" }}>
                        {absenLoading ? <span className={styles.spinner} /> : "💾 Simpan Absensi"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* ── Verifikasi Pendaftar Card ── */}
              <div className={`${styles.card} ${activeTab !== "verifikasi" ? styles.mobileTabHidden : ""}`} style={{ marginTop: "1.5rem" }}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>⏳ Verifikasi Pendaftar</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.absenFilter}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Pilih Ekskul (Khusus Terbuka)</label>
                      <select className={styles.input} value={verifEkskul} onChange={(e) => setVerifEkskul(e.target.value)}>
                        <option value="">-- Pilih Ekskul --</option>
                        {allowedEkskul.filter(e => e.pendaftaran === "terbuka").map(e => (
                          <option key={e.id} value={e.id}>{e.emoji} {e.nama}</option>
                        ))}
                      </select>
                    </div>
                    <button className={styles.btnMuat} onClick={handleMuatVerifikasi} disabled={verifLoading}>
                      {verifLoading ? <span className={styles.spinner} /> : "Cek Pendaftar"}
                    </button>
                  </div>
                  {verifMsg && <div style={{ marginBottom: "1rem", color: "#454652" }}>{verifMsg}</div>}
                  
                  {verifikasiList.length > 0 && (
                    <div className={styles.verifList}>
                      <div className={styles.verifHeader}>
                        <span>Nama Siswa</span>
                        <span>Tanggal Daftar</span>
                        <span>Aksi</span>
                      </div>
                      {verifikasiList.map(v => (
                        <div key={v.id} className={styles.verifRow}>
                          <span style={{ fontWeight: "600" }}>{v.siswa_nama}</span>
                          <span style={{ fontSize: "0.85rem", color: "#767683" }}>{new Date(v.tanggal).toLocaleDateString("id-ID")}</span>
                          <div className={styles.verifAction}>
                            <button onClick={() => handleVerifikasi(v.id, "disetujui")} className={styles.btnApprove}>✅ Terima</button>
                            <button onClick={() => handleVerifikasi(v.id, "ditolak")} className={styles.btnReject}>❌ Tolak</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Right Column ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* ── Laporan Card ── */}
                <div className={`${styles.card} ${activeTab !== "laporan" ? styles.mobileTabHidden : ""}`}>
                  <div className={styles.cardHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className={styles.cardTitle}>📊 Rekap Laporan</h3>
                    <button className={styles.btnSecondary} onClick={handleMuatLaporan} disabled={lapLoading} style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                      {lapLoading ? "Memuat..." : "Muat Ulang"}
                    </button>
                  </div>
                  <div className={styles.cardBody}>
                    {!laporan && !lapLoading && (
                      <div style={{ textAlign: "center", color: "#767683", marginTop: "1rem" }}>
                        <p>Klik tombol muat ulang untuk melihat statistik ekskul terbaru.</p>
                        <button className={styles.btnMuat} onClick={handleMuatLaporan}>Muat Data Laporan</button>
                      </div>
                    )}
                    {lapLoading && <div className={styles.loadingText}>Menghubungkan ke database...</div>}
                    {laporan && !("error" in laporan) && (
                      <div className={styles.laporanGrid}>
                        {(laporan.rekapEkskul as Array<{nama: string; jumlahSiswa: number; totalSesi: number; persenKehadiran: number}>)?.map((e) => (
                          <div key={e.nama} className={styles.laporanCard}>
                            <h3 className={styles.laporanNama}>{e.nama}</h3>
                            <div className={styles.laporanStats}>
                              <div><span className={styles.laporanNum}>{e.jumlahSiswa}</span><span className={styles.laporanLabel}>Siswa</span></div>
                              <div><span className={styles.laporanNum}>{e.totalSesi}</span><span className={styles.laporanLabel}>Sesi</span></div>
                              <div><span className={styles.laporanNum}>{e.persenKehadiran}%</span><span className={styles.laporanLabel}>Hadir</span></div>
                            </div>
                          </div>
                        ))}
                        {(!laporan.rekapEkskul || (laporan.rekapEkskul as any[]).length === 0) && (
                          <p style={{ color: "#767683" }}>Belum ada data laporan ekskul.</p>
                        )}
                      </div>
                    )}
                    {laporan && "error" in laporan && (
                      <div className={styles.alertError}>{String(laporan.error)}</div>
                    )}
                  </div>
                </div>

                {/* ── Jalur Undangan Card ── */}
                <div className={`${styles.card} ${activeTab !== "verifikasi" ? styles.mobileTabHidden : ""}`}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>✉️ Jalur Undangan</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <form onSubmit={handleUndangSiswa}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Pilih Ekskul (Khusus Tertutup)</label>
                        <select className={styles.input} value={undangEkskul} onChange={(e) => setUndangEkskul(e.target.value)} required>
                          <option value="">-- Pilih Ekskul --</option>
                          {allowedEkskul.filter(e => e.pendaftaran === "tertutup").map(e => (
                            <option key={e.id} value={e.id}>{e.emoji} {e.nama}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>NIS Siswa</label>
                        <input type="text" className={styles.input} placeholder="Masukkan NIS..." value={undangNis} onChange={(e) => setUndangNis(e.target.value)} required />
                      </div>
                      <button type="submit" className={styles.btnSimpan} disabled={undangLoading} style={{width: "100%"}}>
                        {undangLoading ? <span className={styles.spinner} /> : "Tambahkan Siswa"}
                      </button>
                      {undangMsg && (
                        <div style={{
                          marginTop: "1rem", 
                          fontSize: "0.85rem", 
                          fontWeight: "500",
                          padding: "0.75rem",
                          borderRadius: "6px",
                          backgroundColor: undangMsg.startsWith("✅") ? "#dcfce7" : "#fee2e2",
                          color: undangMsg.startsWith("✅") ? "#166534" : "#991b1b"
                        }}>
                          {undangMsg}
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* ── Jadwal Lomba Card ── */}
                <div className={`${styles.card} ${activeTab !== "prestasi" ? styles.mobileTabHidden : ""}`} style={{ marginBottom: "1.5rem" }}>
                  <div className={styles.cardHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 className={styles.cardTitle}>📅 Jadwal Lomba</h3>
                    <button className={styles.btnSecondary} onClick={() => handleMuatLombaList()} disabled={lombaLoading} style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                      {lombaLoading ? "Memuat..." : "Muat Ulang"}
                    </button>
                  </div>
                  <div className={styles.cardBody}>
                    {lombaMsg && <div style={{ color: "#ba1a1a", marginBottom: "1rem", fontSize: "0.85rem", padding: "0.5rem", background: "#ffdad6", borderRadius: "6px" }}>{lombaMsg}</div>}
                    {lombaLoading ? <div className={styles.loadingText}>Memuat jadwal lomba...</div> : (
                      lombaList.length > 0 ? (
                        <div className={styles.tableContainer}>
                          <table className={styles.stitchTable}>
                            <thead>
                              <tr>
                                <th className={styles.stitchTh}>Nama Lomba</th>
                                <th className={styles.stitchTh}>Tingkat</th>
                                <th className={styles.stitchTh}>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lombaList.map(l => (
                                <tr key={l.id} className={styles.stitchTr}>
                                  <td className={styles.stitchTd}>
                                    <div style={{ fontWeight: 600 }}>{l.nama}</div>
                                    <div style={{ fontSize: "0.8rem", color: "#767683" }}>{new Date(l.tanggal).toLocaleDateString("id-ID")} - {l.lokasi}</div>
                                  </td>
                                  <td className={styles.stitchTd}>{l.tingkat}</td>
                                  <td className={styles.stitchTd}>
                                    <span style={{
                                      padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold",
                                      backgroundColor: l.status === "TERDAFTAR" ? "#dcfce7" : "#fef9c3",
                                      color: l.status === "TERDAFTAR" ? "#166534" : "#a16207"
                                    }}>{l.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p style={{ color: "#767683" }}>Belum ada jadwal lomba terdaftar.</p>
                      )
                    )}
                  </div>
                </div>

                {/* ── Kelola Prestasi Card ── */}
                <div className={`${styles.card} ${activeTab !== "prestasi" ? styles.mobileTabHidden : ""}`}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>🏆 Riwayat Lomba & Prestasi</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <form onSubmit={handleSimpanPrestasi}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Pilih Ekskul</label>
                        <select className={styles.input} value={prestasiForm.ekskulId} onChange={(e) => handleMuatPrestasi(e.target.value)} required>
                          <option value="">-- Pilih Ekskul --</option>
                          {allowedEkskul.map(e => <option key={e.id} value={e.id}>{e.emoji} {e.nama}</option>)}
                        </select>
                      </div>
                      {prestasiForm.ekskulId && (
                        <>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Pilih Lomba</label>
                            <select className={styles.input} value={prestasiForm.lombaId} onChange={e => setPrestasiForm({...prestasiForm, lombaId: e.target.value})} required>
                              <option value="">-- Pilih Lomba --</option>
                              {lombaList.map(l => (
                                <option key={l.id} value={l.id}>{l.nama} ({l.tingkat})</option>
                              ))}
                            </select>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Nama Siswa / Tim</label>
                            <input type="text" className={styles.input} placeholder="Misal: Budi (atau kosongkan untuk tim)" value={prestasiForm.namaSiswa} onChange={e => setPrestasiForm({...prestasiForm, namaSiswa: e.target.value})} />
                          </div>
                          <div className={styles.twoColGrid}>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>Tingkat</label>
                              <select className={styles.input} value={prestasiForm.tingkat} onChange={e => setPrestasiForm({...prestasiForm, tingkat: e.target.value})}>
                                <option>Sekolah</option>
                                <option>Kecamatan</option>
                                <option>Kabupaten</option>
                                <option>Provinsi</option>
                                <option>Nasional</option>
                              </select>
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.label}>Predikat</label>
                              <select className={styles.input} value={prestasiForm.juara} onChange={e => setPrestasiForm({...prestasiForm, juara: e.target.value})}>
                                <option>Juara 1</option><option>Juara 2</option><option>Juara 3</option><option>Harapan</option><option>Peserta</option>
                              </select>
                            </div>
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.label}>Tanggal</label>
                            <input type="date" className={styles.input} value={prestasiForm.tanggal} onChange={e => setPrestasiForm({...prestasiForm, tanggal: e.target.value})} required />
                          </div>
                          <button type="submit" className={styles.btnSimpan} disabled={prestasiLoading} style={{width: "100%"}}>
                            {prestasiLoading ? <span className={styles.spinner} /> : "Simpan Riwayat"}
                          </button>
                          {prestasiMsg && <div style={{ marginTop: "1rem", color: prestasiMsg.startsWith("✅") ? "#166534" : "#991b1b" }}>{prestasiMsg}</div>}
                        </>
                      )}
                    </form>

                    {/* Riwayat Prestasi */}
                    {prestasiList.length > 0 && (
                      <div style={{ marginTop: "2rem" }}>
                        <h4 style={{ fontSize: "0.9rem", color: "#454652", marginBottom: "0.5rem" }}>Riwayat Prestasi:</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          {prestasiList.map(p => (
                            <li key={p.id} style={{ padding: "0.75rem", background: "#f9f9fb", border: "1px solid #e2e2e4", borderRadius: "6px", marginBottom: "0.5rem" }}>
                              <div style={{ fontWeight: "bold", color: "#944535" }}>{p.nama_lomba}</div>
                              <div style={{ fontSize: "0.85rem", color: "#767683", marginTop: "4px" }}>
                                {p.juara} • Tingkat {p.tingkat} • {new Date(p.tanggal).getFullYear()}
                                {p.siswa_terlibat && <span><br/>👤 {p.siswa_terlibat}</span>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── STITCH UI: Bottom Navigation Bar ── */}
      {user && (
        <nav className={styles.bottomNav}>
          <button className={`${styles.navItem} ${activeTab === "absen" ? styles.navActive : ""}`} onClick={() => setActiveTab("absen")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>fact_check</span>
            <span>Absen</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === "verifikasi" ? styles.navActive : ""}`} onClick={() => setActiveTab("verifikasi")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>how_to_reg</span>
            <span>Verifikasi</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === "prestasi" ? styles.navActive : ""}`} onClick={() => setActiveTab("prestasi")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>emoji_events</span>
            <span>Prestasi</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === "laporan" ? styles.navActive : ""}`} onClick={() => setActiveTab("laporan")}>
            <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>bar_chart</span>
            <span>Laporan</span>
          </button>
        </nav>
      )}
    </main>
  );
}
