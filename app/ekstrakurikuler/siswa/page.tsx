"use client";
import { useState, useEffect, useCallback } from "react";
import Header from "../../components/Header";
import styles from "./siswa.module.css";

type Step = "login" | "dashboard";
type Tab = "beranda" | "absen" | "keluar";

interface UserData {
  nama: string;
  user_id: string;
  token: string;
  username: string;
  ekskul?: string[];
}

interface AbsensiData {
  totalSesi: number;
  hadir: number;
  tidakHadir: number;
  persentase: number;
}

const ekskulJadwal = [
  { nama: 'Pramuka', jadwal: 'Sabtu', waktu: '07:00–09:00', lokasi: 'Lapangan Sekolah', emoji: '⚜️' },
  { nama: 'PMR / UKS', jadwal: 'Kamis', waktu: '15:00–16:30', lokasi: 'Ruang PMR', emoji: '🏥' },
  { nama: 'PBB / Tata Upacara', jadwal: 'Jumat', waktu: '15:00–16:30', lokasi: 'Lapangan Upacara', emoji: '🎖️' },
  { nama: 'BTQ', jadwal: 'Rabu', waktu: '15:00–16:00', lokasi: 'Masjid Sekolah', emoji: '📖' },
  { nama: 'OSN Matematika', jadwal: 'Selasa', waktu: '14:30–16:00', lokasi: 'Ruang Kelas', emoji: '📐' },
  { nama: 'OSN IPS', jadwal: 'Senin', waktu: '14:30–16:00', lokasi: 'Ruang Kelas', emoji: '🌍' },
  { nama: 'OSN IPA', jadwal: 'Kamis', waktu: '14:30–16:00', lokasi: 'Laboratorium IPA', emoji: '🔬' },
  { nama: 'Seni Tari', jadwal: 'Rabu', waktu: '14:00–15:30', lokasi: 'Aula Sekolah', emoji: '💃' },
  { nama: 'Paduan Suara', jadwal: 'Jumat', waktu: '14:00–15:30', lokasi: 'Aula Sekolah', emoji: '🎵' },
  { nama: 'Futsal', jadwal: 'Selasa & Kamis', waktu: '15:30–17:00', lokasi: 'Lapangan Futsal', emoji: '⚽' },
  { nama: 'Jiu Jitsu', jadwal: 'Sabtu', waktu: '08:00–10:00', lokasi: 'Lapangan Sekolah', emoji: '🥋' },
];

const hariOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;
const hariIcons: Record<string, string> = {
  Senin: '📅', Selasa: '📅', Rabu: '📅', Kamis: '📅', Jumat: '📅', Sabtu: '📅',
};

function groupByHari() {
  const grouped: Record<string, typeof ekskulJadwal> = {};
  for (const hari of hariOrder) {
    grouped[hari] = [];
  }
  for (const item of ekskulJadwal) {
    // Handle "Selasa & Kamis" etc.
    for (const hari of hariOrder) {
      if (item.jadwal.includes(hari)) {
        grouped[hari].push(item);
      }
    }
  }
  return grouped;
}

const jadwalGrouped = groupByHari();

export default function SiswaDashboardPage() {
  const [step, setStep]           = useState<Step>("login");
  const [activeTab, setActiveTab] = useState<Tab>("beranda");
  const [nis, setNis]             = useState("");
  const [password, setPassword]   = useState("");
  const [user, setUser]           = useState<UserData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // Absensi state
  const [absensi, setAbsensi]         = useState<AbsensiData | null>(null);
  const [absenLoading, setAbsenLoading] = useState(false);
  const [absenError, setAbsenError]   = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);

  // ── Login ──
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username: nis, password, role: "siswa" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Login gagal.");
      setUser({ nama: data.nama, user_id: data.user_id, token: data.token, username: data.username, ekskul: data.ekskul || ["Pramuka", "Futsal"] });
      setStep("dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  // ── Fetch Absensi ──
  const fetchAbsensi = useCallback(async () => {
    if (!user) return;
    setAbsenLoading(true);
    setAbsenError("");
    try {
      const res = await fetch("/api/ekstrakurikuler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAbsensiSiswa", token: user.token }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Gagal memuat data absensi.");
      const totalSesi = Number(data.totalSesi) || 0;
      const hadir = Number(data.hadir) || 0;
      const tidakHadir = totalSesi - hadir;
      const persentase = totalSesi > 0 ? Math.round((hadir / totalSesi) * 100) : 0;
      setAbsensi({ totalSesi, hadir, tidakHadir, persentase });
      if (tidakHadir >= 2) {
        setShowWarningModal(true);
      }
    } catch {
      setAbsenError("Belum ada data absensi.");
      setAbsensi(null);
    } finally {
      setAbsenLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !absensi && !absenLoading && !absenError) {
      fetchAbsensi();
    }
  }, [user, absensi, absenLoading, absenError, fetchAbsensi]);

  // ── Logout ──
  function handleLogout() {
    setUser(null);
    setStep("login");
    setActiveTab("beranda");
    setAbsensi(null);
    setAbsenError("");
    setNis("");
    setPassword("");
    setShowWarningModal(false);
  }

  return (
    <main className={`${styles.main} ${step === "dashboard" ? styles.mainDashboard : ""}`}>
      {/* ── WARNING MODAL ── */}
      {showWarningModal && (
        <div className={styles.warningModalOverlay}>
          <div className={styles.warningModalCard}>
            <div className={styles.warningModalHeader}>
              <span className={styles.warningModalIcon}>⚠️</span>
              <h2 className={styles.warningModalTitle}>Peringatan Kehadiran!</h2>
            </div>
            <div className={styles.warningModalBody}>
              <p>Anda telah tidak hadir ekstrakurikuler sebanyak <strong>{absensi?.tidakHadir} kali</strong>.</p>
              <p>Jika mencapai 3 kali tanpa keterangan, nilai ekskul Anda akan dikurangi dan surat pemanggilan otomatis akan diteruskan ke Wali Kelas.</p>
              <button className={styles.btnUnderstand} onClick={() => setShowWarningModal(false)}>
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "login" && <Header activePage="Ekskul" />}

      {/* ── LOGIN STEP ── */}
      {step === "login" && (
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>👤</div>
            <h1 className={styles.cardTitle}>Login Dashboard Siswa</h1>
            <p className={styles.cardDesc}>Masukkan NIS dan password untuk melihat jadwal ekskul &amp; prestasimu.</p>

            {error && <div className={styles.alertError} role="alert">{error}</div>}

            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="input-nis" className={styles.label}>NIS (Nomor Induk Siswa)</label>
                <input id="input-nis" type="text" className={styles.input} placeholder="Contoh: 12345" value={nis} onChange={(e) => setNis(e.target.value)} required autoFocus />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="input-password" className={styles.label}>Password</label>
                <input id="input-password" type="password" className={styles.input} placeholder="Password akun siswa" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className={styles.btnSubmit} disabled={loading} id="btn-login-siswa">
                {loading ? <span className={styles.spinner} /> : "Masuk →"}
              </button>
            </form>
            <p className={styles.hint}>Belum punya akun? Hubungi wali kelas atau TU.</p>
          </div>
        </div>
      )}

      {/* ── DASHBOARD STEP ── */}
      {step === "dashboard" && user && (
        <div className={styles.dashboardWrapper}>

          {/* Header */}
          <div className={styles.dashHeader}>
            <div className={styles.dashHeaderInfo}>
              <p className={styles.dashLabel}>Selamat Datang</p>
              <h1 className={styles.dashName}>Halo, {user.nama}</h1>
              <p className={styles.dashNis}>NIS: {user.username}</p>
            </div>
            <div className={styles.dashAvatar}>
              {user.nama.charAt(0)}
            </div>
          </div>

          {/* ── WARNING BANNER ── */}
          {absensi && absensi.tidakHadir >= 2 && (
            <div className={styles.warningBanner}>
              <span className={styles.warningBannerIcon}>⚠️</span>
              <div className={styles.warningBannerContent}>
                <h4>PERINGATAN TINGKAT 1</h4>
                <p>Anda telah absen {absensi.tidakHadir} kali. Hindari absen ke-3 agar tidak ada pemanggilan orang tua.</p>
              </div>
            </div>
          )}

          {/* ─── TAB: BERANDA ─── */}
          {activeTab === "beranda" && (
            <div className={styles.berandaContent}>
              {hariOrder.map((hari) => {
                const myEkskul = user.ekskul || ["Pramuka", "Futsal"];
                const items = jadwalGrouped[hari].filter(item => myEkskul.includes(item.nama));
                if (items.length === 0) return null;
                return (
                  <div key={hari} className={styles.dayGroup}>
                    <div className={styles.dayHeader}>
                      <span className={styles.dayHeaderIcon}>{hariIcons[hari]}</span>
                      {hari}
                    </div>
                    <div className={styles.dayItems}>
                      {items.map((ekskul) => (
                        <div key={`${hari}-${ekskul.nama}`} className={styles.scheduleItem}>
                          <div className={styles.scheduleEmoji}>{ekskul.emoji}</div>
                          <div className={styles.scheduleInfo}>
                            <p className={styles.scheduleName}>{ekskul.nama}</p>
                            <p className={styles.scheduleMeta}>
                              <span>{ekskul.lokasi}</span>
                            </p>
                          </div>
                          <span className={styles.scheduleTime}>{ekskul.waktu}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── TAB: ABSEN ─── */}
          {activeTab === "absen" && (
            <div className={styles.absenContent}>
              <div>
                <h2 className={styles.absenTitle}>Rekap Absensi</h2>
                <p className={styles.absenSubtitle}>Ringkasan kehadiran kegiatan ekskul kamu</p>
              </div>

              {absenLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner} />
                  <p className={styles.loadingText}>Memuat data absensi...</p>
                </div>
              )}

              {!absenLoading && absenError && (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>📋</span>
                  <p className={styles.emptyTitle}>Belum Ada Data</p>
                  <p className={styles.emptyText}>{absenError}</p>
                </div>
              )}

              {!absenLoading && !absenError && absensi && (
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconTotal}`}>📊</div>
                    <span className={styles.statValue}>{absensi.totalSesi}</span>
                    <span className={styles.statLabel}>Total Sesi</span>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconHadir}`}>✅</div>
                    <span className={styles.statValue}>{absensi.hadir}</span>
                    <span className={styles.statLabel}>Hadir</span>
                  </div>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.statIconAbsen}`}>❌</div>
                    <span className={styles.statValue}>{absensi.tidakHadir}</span>
                    <span className={styles.statLabel}>Tidak Hadir</span>
                  </div>
                  <div className={`${styles.statCard} ${styles.percentCard}`}>
                    <div className={`${styles.statIcon} ${styles.statIconPersen}`}>📈</div>
                    <span className={styles.statValue}>{absensi.persentase}%</span>
                    <span className={styles.statLabel}>Persentase Kehadiran</span>
                    <span className={styles.percentDecor}>📊</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── TAB: KELUAR ─── */}
          {activeTab === "keluar" && (
            <div className={styles.keluarContent}>
              <div className={styles.keluarCard}>
                <span className={styles.keluarIcon}>👋</span>
                <h2 className={styles.keluarTitle}>Keluar dari Dashboard</h2>
                <p className={styles.keluarDesc}>
                  Kamu akan keluar dari sesi ini. Data tidak akan hilang, kamu bisa login kembali kapan saja.
                </p>
                <button className={styles.btnLogout} onClick={handleLogout}>
                  Keluar Sekarang
                </button>
              </div>
            </div>
          )}

          {/* ── Bottom Navigation ── */}
          <nav className={styles.bottomNav}>
            <button
              onClick={() => setActiveTab("beranda")}
              className={`${styles.navBtn} ${activeTab === "beranda" ? styles.navBtnActive : ""}`}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>home</span>
              <span className={`${styles.navLabel} ${activeTab === "beranda" ? styles.navLabelActive : ""}`}>Beranda</span>
            </button>
            <button
              onClick={() => setActiveTab("absen")}
              className={`${styles.navBtn} ${activeTab === "absen" ? styles.navBtnActive : ""}`}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>fact_check</span>
              <span className={`${styles.navLabel} ${activeTab === "absen" ? styles.navLabelActive : ""}`}>Absen</span>
            </button>
            <button
              onClick={() => setActiveTab("keluar")}
              className={`${styles.navBtn} ${activeTab === "keluar" ? styles.navBtnActive : ""}`}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>logout</span>
              <span className={`${styles.navLabel} ${activeTab === "keluar" ? styles.navLabelActive : ""}`}>Keluar</span>
            </button>
          </nav>

        </div>
      )}
    </main>
  );
}
