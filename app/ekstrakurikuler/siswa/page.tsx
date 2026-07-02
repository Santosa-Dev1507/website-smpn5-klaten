"use client";
import { useState } from "react";
import Header from "../../components/Header";
import styles from "./siswa.module.css";

type Step = "login" | "dashboard";

interface UserData {
  nama: string;
  user_id: string;
  token: string;
  username: string;
}

export default function SiswaDashboardPage() {
  const [step, setStep]         = useState<Step>("login");
  const [activeTab, setActiveTab] = useState("beranda");
  const [nis, setNis]           = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser]         = useState<UserData | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

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
      setStep("dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ paddingBottom: step === "dashboard" ? "80px" : "0" }}>
      {step === "login" && <Header activePage="Ekskul" />}

      <div className={styles.wrapper} style={step === "dashboard" ? { padding: "1.5rem 1rem", alignItems: "stretch", background: "#f9f9fb", minHeight: "100vh" } : {}}>
        
        {/* ── Step 1: Login ── */}
        {step === "login" && (
          <div className={styles.card} style={{ margin: "0 auto" }}>
            <div className={styles.cardIcon}>👤</div>
            <h1 className={styles.cardTitle}>Login Dashboard Siswa</h1>
            <p className={styles.cardDesc}>Masukkan NIS dan password untuk melihat jadwal ekskul & prestasimu.</p>

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
        )}

        {/* ── Step 2: Dashboard ── */}
        {step === "dashboard" && user && (
          <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
            
            {/* Header Dashboard */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
               <div>
                 <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#944535", textTransform: "uppercase", letterSpacing: "0.05em" }}>Selamat Datang</p>
                 <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a1c1d" }}>Halo, {user.nama}</h1>
                 <p style={{ fontSize: "0.85rem", color: "#555" }}>NIS: {user.username}</p>
               </div>
               <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#944535", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem" }}>
                 {user.nama.charAt(0)}
               </div>
            </div>

            {/* TAB: BERANDA */}
            {activeTab === "beranda" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {/* Jadwal Hari Ini */}
                <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", borderLeft: "4px solid #944535" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Jadwal Ekskul Hari Ini</h3>
                    <span style={{ fontSize: "0.75rem", background: "#FAD6A6", color: "#944535", padding: "4px 8px", borderRadius: "20px", fontWeight: "bold" }}>Ekskul Aktif</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {/* Dummy Schedule items */}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.75rem", background: "#f9f9fb", borderRadius: "8px", border: "1px solid #eaeaea" }}>
                      <div style={{ width: "48px", height: "48px", background: "#944535", color: "#fff", borderRadius: "8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <span style={{ fontSize: "10px", fontWeight: "bold" }}>15:00</span><span style={{ fontSize: "10px" }}>17:00</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Pramuka (Wajib)</h4>
                        <p style={{ fontSize: "0.8rem", color: "#767683" }}>Lapangan Utama • Kak Budi</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prestasi */}
                <div style={{ background: "#944535", color: "#fff", padding: "1.5rem", borderRadius: "16px", position: "relative", overflow: "hidden" }}>
                  <span className="material-symbols-outlined" style={{ position: "absolute", right: "-20px", top: "-20px", fontSize: "8rem", opacity: 0.1 }}>emoji_events</span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", position: "relative", zIndex: 1 }}>Prestasi Terbaru</h3>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", position: "relative", zIndex: 1 }}>
                     <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FAD6A6", color: "#944535", display: "flex", alignItems: "center", justifyContent: "center" }}>
                       <span className="material-symbols-outlined">emoji_events</span>
                     </div>
                     <div>
                       <h4 style={{ fontWeight: "bold" }}>Juara 1 Lomba Sains</h4>
                       <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>Tingkat Kota Jakarta</p>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EKSKUL (Daftar Ekskul yang Diikuti) */}
            {activeTab === "ekskul" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Ekskul yang Diikuti</h3>
                    <a href="/ekstrakurikuler/daftar" style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#944535", textDecoration: "none" }}>+ Tambah Ekskul</a>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    
                    {/* Dummy Data Ekskul */}
                    <div style={{ background: "#000666", color: "#fff", padding: "1.25rem", borderRadius: "16px", position: "relative", overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <span style={{ position: "absolute", right: "-10px", top: "-10px", fontSize: "6rem", opacity: 0.15 }}>🏕️</span>
                       <div style={{ position: "relative", zIndex: 1 }}>
                         <h4 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Pramuka</h4>
                         <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Wajib • Aktif</p>
                       </div>
                       <button style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", position: "relative", zIndex: 1 }}>
                         Detail
                       </button>
                    </div>

                    <div style={{ background: "#006b5f", color: "#fff", padding: "1.25rem", borderRadius: "16px", position: "relative", overflow: "hidden", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <span style={{ position: "absolute", right: "-10px", top: "-10px", fontSize: "6rem", opacity: 0.15 }}>⚽</span>
                       <div style={{ position: "relative", zIndex: 1 }}>
                         <h4 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Futsal</h4>
                         <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Pilihan • Menunggu Persetujuan</p>
                       </div>
                       <button style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", position: "relative", zIndex: 1 }}>
                         Detail
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB LAIN (Lomba, Absen, Profil) */}
            {["lomba", "absen", "profil"].includes(activeTab) && (
              <div style={{ background: "#fff", padding: "3rem 1rem", borderRadius: "16px", textAlign: "center", color: "#767683" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "#c6c5d4", marginBottom: "1rem" }}>construction</span>
                <p>Fitur {activeTab} sedang dalam pengembangan.</p>
              </div>
            )}

            {/* ── Bottom Navigation ── */}
            <nav style={{ position: "fixed", bottom: 0, left: 0, width: "100%", background: "#fff", display: "flex", justifyContent: "space-around", padding: "0.75rem 0", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)", zIndex: 50, borderTop: "1px solid #eaeaea" }}>
              <button onClick={() => setActiveTab("beranda")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "none", border: "none", color: activeTab === "beranda" ? "#944535" : "#767683" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>home</span>
                <span style={{ fontSize: "0.7rem", fontWeight: activeTab === "beranda" ? 700 : 500 }}>Beranda</span>
              </button>
              <button onClick={() => setActiveTab("ekskul")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "none", border: "none", color: activeTab === "ekskul" ? "#944535" : "#767683" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>groups</span>
                <span style={{ fontSize: "0.7rem", fontWeight: activeTab === "ekskul" ? 700 : 500 }}>Ekskul</span>
              </button>
              <button onClick={() => setActiveTab("lomba")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "none", border: "none", color: activeTab === "lomba" ? "#944535" : "#767683" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>emoji_events</span>
                <span style={{ fontSize: "0.7rem", fontWeight: activeTab === "lomba" ? 700 : 500 }}>Lomba</span>
              </button>
              <button onClick={() => setActiveTab("absen")} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "none", border: "none", color: activeTab === "absen" ? "#944535" : "#767683" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>fact_check</span>
                <span style={{ fontSize: "0.7rem", fontWeight: activeTab === "absen" ? 700 : 500 }}>Absen</span>
              </button>
              <button onClick={() => { setActiveTab("beranda"); setStep("login"); setUser(null); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "none", border: "none", color: "#767683" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>logout</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>Keluar</span>
              </button>
            </nav>

          </div>
        )}

      </div>
    </main>
  );
}
