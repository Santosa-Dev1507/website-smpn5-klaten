"use client";
import { useState } from "react";
import Header from "../../components/Header";
import styles from "./daftar.module.css";

// Data ekskul statis — digunakan saat memilih
const ekskulList = [
  { id: "pramuka",      nama: "Pramuka",          emoji: "⚜️", kategori: "Kepanduan"    },
  { id: "pmr",          nama: "PMR / UKS",         emoji: "🏥", kategori: "Sosial"       },
  { id: "pbb",          nama: "PBB / Tata Upacara", emoji: "🎖️", kategori: "Kedisiplinan" },
  { id: "btq",          nama: "BTQ",               emoji: "📖", kategori: "Keagamaan"   },
  { id: "osn-mat",      nama: "OSN Matematika",    emoji: "📐", kategori: "Akademik"    },
  { id: "osn-ips",      nama: "OSN IPS",           emoji: "🌍", kategori: "Akademik"    },
  { id: "osn-ipa",      nama: "OSN IPA",           emoji: "🔬", kategori: "Akademik"    },
  { id: "seni-tari",    nama: "Seni Tari",         emoji: "💃", kategori: "Seni"        },
  { id: "paduan-suara", nama: "Paduan Suara",      emoji: "🎵", kategori: "Seni"        },
  { id: "futsal",       nama: "Futsal",             emoji: "⚽", kategori: "Olahraga"   },
  { id: "jiu-jitsu",   nama: "Jiu Jitsu",          emoji: "🥋", kategori: "Olahraga"   },
];

type Step = "login" | "pilih" | "sukses";

interface UserData {
  nama: string;
  user_id: string;
  token: string;
  username: string;
}

export default function DaftarEkskulPage() {
  const [step, setStep]         = useState<Step>("login");
  const [nis, setNis]           = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser]         = useState<UserData | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [info, setInfo]         = useState("");

  // ── Step 1: Login ──
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
      setUser({ nama: data.nama, user_id: data.user_id, token: data.token, username: data.username });
      setStep("pilih");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Pilih & Daftar ──
  function toggleEkskul(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleDaftar(e: React.FormEvent) {
    e.preventDefault();
    if (selected.length === 0) { setError("Pilih minimal 1 ekstrakurikuler."); return; }
    setError("");
    setLoading(true);
    try {
      // Daftarkan satu per satu
      for (const ekskulId of selected) {
        const res = await fetch("/api/ekstrakurikuler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "daftarEkskul", token: user?.token, ekskulId }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
      }
      setInfo(`Berhasil mendaftar ${selected.length} ekstrakurikuler!`);
      setStep("sukses");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Header activePage="Ekskul" />

      <div className={styles.wrapper}>

        {/* ── Step Indicator ── */}
        <div className={styles.stepBar}>
          {["Login NIS", "Pilih Ekskul", "Selesai"].map((label, i) => {
            const stepNum = i + 1;
            const active = step === ["login","pilih","sukses"][i];
            const done   = (step === "pilih" && i === 0) || (step === "sukses" && i <= 1);
            return (
              <div key={label} className={`${styles.step} ${active ? styles.stepActive : ""} ${done ? styles.stepDone : ""}`}>
                <div className={styles.stepCircle}>{done ? "✓" : stepNum}</div>
                <span className={styles.stepLabel}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* ── Step 1: Login ── */}
        {step === "login" && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>👤</div>
            <h1 className={styles.cardTitle}>Login Siswa</h1>
            <p className={styles.cardDesc}>Masukkan NIS dan password untuk melanjutkan pendaftaran ekskul.</p>

            {error && <div className={styles.alertError} role="alert">{error}</div>}

            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="input-nis" className={styles.label}>NIS (Nomor Induk Siswa)</label>
                <input
                  id="input-nis"
                  type="text"
                  className={styles.input}
                  placeholder="Contoh: 12345"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="input-password" className={styles.label}>Password</label>
                <input
                  id="input-password"
                  type="password"
                  className={styles.input}
                  placeholder="Password akun siswa"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className={styles.btnSubmit} disabled={loading} id="btn-login-siswa">
                {loading ? <span className={styles.spinner} /> : "Masuk →"}
              </button>
            </form>
            <p className={styles.hint}>Belum punya akun? Hubungi wali kelas atau TU.</p>
          </div>
        )}

        {/* ── Step 2: Pilih Ekskul ── */}
        {step === "pilih" && user && (
          <div className={styles.card}>
            <div className={styles.welcomeBanner}>
              <span className={styles.welcomeAvatar}>{user.nama.charAt(0)}</span>
              <div>
                <p className={styles.welcomeName}>Halo, {user.nama}! 👋</p>
                <p className={styles.welcomeSub}>NIS: {user.username}</p>
              </div>
            </div>
            <h2 className={styles.cardTitle}>Pilih Ekstrakurikuler</h2>
            <p className={styles.cardDesc}>Pilih ekskul yang ingin kamu ikuti. Pendaftaran akan menunggu persetujuan pembina.</p>

            {error && <div className={styles.alertError} role="alert">{error}</div>}

            <form onSubmit={handleDaftar}>
              <div className={styles.ekskulCheckGrid}>
                {ekskulList.map((ekskul) => {
                  const isSelected = selected.includes(ekskul.id);
                  return (
                    <label
                      key={ekskul.id}
                      htmlFor={`check-${ekskul.id}`}
                      className={`${styles.ekskulCheck} ${isSelected ? styles.ekskulCheckSelected : ""}`}
                    >
                      <input
                        id={`check-${ekskul.id}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleEkskul(ekskul.id)}
                        className={styles.checkboxHidden}
                      />
                      <span className={styles.checkEmoji}>{ekskul.emoji}</span>
                      <span className={styles.checkName}>{ekskul.nama}</span>
                      <span className={styles.checkKategori}>{ekskul.kategori}</span>
                      {isSelected && <span className={styles.checkMark}>✓</span>}
                    </label>
                  );
                })}
              </div>

              <div className={styles.selectedInfo}>
                {selected.length > 0
                  ? `${selected.length} ekskul dipilih`
                  : "Belum ada yang dipilih"}
              </div>

              <button type="submit" className={styles.btnSubmit} disabled={loading || selected.length === 0} id="btn-daftar-submit">
                {loading ? <span className={styles.spinner} /> : `Daftar Sekarang (${selected.length})`}
              </button>
            </form>
          </div>
        )}

        {/* ── Step 3: Sukses ── */}
        {step === "sukses" && (
          <div className={`${styles.card} ${styles.cardSukses}`}>
            <div className={styles.suksesIcon}>🎉</div>
            <h2 className={styles.cardTitle}>Pendaftaran Berhasil!</h2>
            <p className={styles.cardDesc}>{info}</p>
            <p className={styles.cardDesc}>
              Pendaftaranmu sedang menunggu persetujuan pembina. Cek kembali secara berkala atau tanyakan langsung ke pembina ekskul.
            </p>
            <div className={styles.suksesActions}>
              <a href="/ekstrakurikuler" className={styles.btnBack} id="btn-kembali-ekskul">← Kembali ke Daftar Ekskul</a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
