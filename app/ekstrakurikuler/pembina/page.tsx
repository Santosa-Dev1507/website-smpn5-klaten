"use client";
import { useState } from "react";
import Header from "../../components/Header";
import styles from "./pembina.module.css";

type Step = "login" | "dashboard";

interface SessionUser {
  nama: string;
  role: string;
  token: string;
  username: string;
}

interface AbsenItem {
  siswa_id: string;
  siswa_nama: string;
  status: "hadir" | "tidak_hadir" | "izin";
  keterangan: string;
}

const ekskulList = [
  { id: "pramuka",      nama: "Pramuka",           emoji: "⚜️" },
  { id: "pmr",          nama: "PMR / UKS",          emoji: "🏥" },
  { id: "pbb",          nama: "PBB / Tata Upacara", emoji: "🎖️" },
  { id: "btq",          nama: "BTQ",                emoji: "📖" },
  { id: "osn-mat",      nama: "OSN Matematika",     emoji: "📐" },
  { id: "osn-ips",      nama: "OSN IPS",            emoji: "🌍" },
  { id: "osn-ipa",      nama: "OSN IPA",            emoji: "🔬" },
  { id: "seni-tari",    nama: "Seni Tari",          emoji: "💃" },
  { id: "paduan-suara", nama: "Paduan Suara",       emoji: "🎵" },
  { id: "futsal",       nama: "Futsal",              emoji: "⚽" },
  { id: "jiu-jitsu",   nama: "Jiu Jitsu",           emoji: "🥋" },
];

export default function PembinaPage() {
  const [step, setStep]               = useState<Step>("login");
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [user, setUser]               = useState<SessionUser | null>(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  // Absensi state
  const [activeTab, setActiveTab]     = useState<"absen" | "laporan">("absen");
  const [ekskulId, setEkskulId]       = useState("");
  const [tanggal, setTanggal]         = useState(new Date().toISOString().split("T")[0]);
  const [siswaDaftar, setSiswaDaftar] = useState<AbsenItem[]>([]);
  const [absenLoading, setAbsenLoading] = useState(false);
  const [absenMsg, setAbsenMsg]       = useState("");

  // Laporan state
  const [laporan, setLaporan]         = useState<Record<string, unknown> | null>(null);
  const [lapLoading, setLapLoading]   = useState(false);

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
      setUser({ nama: data.nama, role: data.role, token: data.token, username: data.username });
      setStep("dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
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

  return (
    <main>
      <Header activePage="Ekskul" />

      <div className={styles.wrapper}>

        {/* ── Login ── */}
        {step === "login" && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>🔐</div>
            <h1 className={styles.cardTitle}>Area Pembina</h1>
            <p className={styles.cardDesc}>Login menggunakan NIP dan password untuk mengakses dashboard pembina.</p>

            {error && <div className={styles.alertError} role="alert">{error}</div>}

            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.formGroup}>
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
              <div className={styles.formGroup}>
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
              <button type="submit" className={styles.btnSubmit} disabled={loading} id="btn-login-pembina">
                {loading ? <span className={styles.spinner} /> : "Masuk ke Dashboard →"}
              </button>
            </form>
            <div className={styles.backLink}>
              <a href="/ekstrakurikuler">← Kembali ke Halaman Ekskul</a>
            </div>
          </div>
        )}

        {/* ── Dashboard ── */}
        {step === "dashboard" && user && (
          <div className={styles.dashboard}>
            {/* Header */}
            <div className={styles.dashHeader}>
              <div className={styles.dashUser}>
                <span className={styles.dashAvatar}>{user.nama.charAt(0)}</span>
                <div>
                  <p className={styles.dashName}>{user.nama}</p>
                  <p className={styles.dashRole}>{user.role === "admin" ? "👑 Administrator" : "📋 Pembina Ekskul"}</p>
                </div>
              </div>
              <button
                className={styles.btnLogout}
                onClick={() => { setStep("login"); setUser(null); setSiswaDaftar([]); setLaporan(null); }}
                id="btn-logout-pembina"
              >
                Logout
              </button>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === "absen" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("absen")}
                id="tab-absensi"
              >
                📋 Absensi
              </button>
              <button
                className={`${styles.tab} ${activeTab === "laporan" ? styles.tabActive : ""}`}
                onClick={() => { setActiveTab("laporan"); if (!laporan) handleMuatLaporan(); }}
                id="tab-laporan"
              >
                📊 Laporan
              </button>
            </div>

            {/* Tab: Absensi */}
            {activeTab === "absen" && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Absensi Kegiatan</h2>

                <div className={styles.absenFilter}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Pilih Ekskul</label>
                    <select className={styles.input} value={ekskulId} onChange={(e) => setEkskulId(e.target.value)} id="select-ekskul-absen">
                      <option value="">-- Pilih Ekskul --</option>
                      {ekskulList.map((e) => (
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
                    <div className={styles.absenTable}>
                      <div className={styles.absenHeader}>
                        <span>Nama Siswa</span>
                        <span>Status Kehadiran</span>
                        <span>Keterangan</span>
                      </div>
                      {siswaDaftar.map((item, idx) => (
                        <div key={item.siswa_id} className={styles.absenRow}>
                          <span className={styles.siswaNama}>{item.siswa_nama}</span>
                          <div className={styles.statusGroup}>
                            {(["hadir", "tidak_hadir", "izin"] as const).map((s) => {
                              const statusColors: Record<string, string> = {
                                hadir: "#16a34a",
                                tidak_hadir: "#dc2626",
                                izin: "#d97706",
                              };
                              const isActive = item.status === s;
                              return (
                                <label
                                  key={s}
                                  htmlFor={`radio-${idx}-${s}`}
                                  className={styles.statusBtn}
                                  style={isActive ? { borderColor: statusColors[s], background: `${statusColors[s]}15`, color: statusColors[s] } : {}}
                                >
                                  <input
                                    id={`radio-${idx}-${s}`}
                                    type="radio"
                                    name={`status-${idx}`}
                                    value={s}
                                    checked={isActive}
                                    onChange={() => updateAbsen(idx, "status", s)}
                                    className={styles.radioHidden}
                                  />
                                  {s === "hadir" ? "✅ Hadir" : s === "tidak_hadir" ? "❌ Tidak" : "📝 Izin"}
                                </label>
                              );
                            })}
                          </div>
                          <input
                            type="text"
                            className={styles.inputKet}
                            placeholder="Keterangan (opsional)"
                            value={item.keterangan}
                            onChange={(e) => updateAbsen(idx, "keterangan", e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                    <button className={styles.btnSimpan} onClick={handleSimpanAbsensi} disabled={absenLoading} id="btn-simpan-absensi">
                      {absenLoading ? <span className={styles.spinner} /> : "💾 Simpan Absensi"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Tab: Laporan */}
            {activeTab === "laporan" && (
              <div className={styles.tabContent}>
                <h2 className={styles.sectionTitle}>Rekap Laporan</h2>
                {lapLoading && <div className={styles.loadingText}>Memuat laporan...</div>}
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
                  </div>
                )}
                {laporan && "error" in laporan && (
                  <div className={styles.alertError}>{String(laporan.error)}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
