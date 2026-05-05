"use client";

import { useState, useEffect } from "react";
import styles from "./pengumuman.module.css";
import confetti from "canvas-confetti";

interface StudentResult {
  nisn: string;
  name: string;
  status: "LULUS" | "TIDAK LULUS";
  message?: string;
}

export default function PengumumanPage() {
  const [isReady, setIsReady] = useState(false);
  const [nisn, setNisn] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [error, setError] = useState("");

  // Waktu pengumuman: 2 Juni 2026, 17:00 WIB
  const releaseDate = new Date("2026-06-02T17:00:00+07:00");

  useEffect(() => {
    // Cek apakah waktu saat ini sudah melewati waktu rilis
    const checkDate = () => {
      const now = new Date();
      if (now >= releaseDate) {
        setIsReady(true);
      } else {
        setIsReady(false);
      }
    };

    checkDate();
    // Update setiap detik jika belum waktunya
    const interval = setInterval(checkDate, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisn) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQhIzrdJAeM8mnVCKmUrmBk8KmfoE_S7gXLJD1s9SZsl1PuLSu7pOX7CsneW8hQVmDy3Bmm3uaB2PVn/pub?output=csv", { cache: "no-store" });
      const csvText = await response.text();
      
      // Parsing sederhana CSV per baris
      const rows = csvText.split("\n").map(row => row.split(","));
      
      // Cari data berdasarkan NISN (kolom index ke-2)
      const foundRow = rows.find(row => row.length > 2 && row[2].trim() === nisn);

      if (foundRow) {
        const studentStatus = foundRow[4] ? foundRow[4].trim().toUpperCase() : "TIDAK LULUS";
        
        const student: StudentResult = {
          nisn: foundRow[2].trim(),
          name: foundRow[1].trim(),
          status: studentStatus === "LULUS" ? "LULUS" : "TIDAK LULUS",
        };
        
        setResult(student);
        
        if (student.status === "LULUS") {
          triggerConfetti();
        }
      } else {
        setError("Data dengan NISN tersebut tidak ditemukan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    // Custom colors matching the website theme
    const colors = ["#944535", "#FAD6A6", "#2D7D46"];

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
  };

  return (
    <main className={styles.main}>
      {/* HEADER */}
      <header className={styles.header}>
        <img src="https://iili.io/FntumI2.md.png" alt="Logo SMPN 5 Klaten" className={styles.logo} />
        <p className={styles.headerSub}>🎓 LANGKAH BARU SANG JUARA</p>
        <h1 className={styles.headerTitle}>Pengumuman Kelulusan</h1>
        <p className={styles.headerTagline}>
          <em>&quot;Tiga tahun kamu tempuh dengan tekun — kini saatnya dunia menyaksikan karakter <strong>JUARA</strong>-mu.&quot;</em>
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.card}>
          {!isReady ? (
            <div className={styles.countdownBox}>
              <h2 className={styles.countdownTitle}>⏳ Sebentar Lagi, JUARA!</h2>
              <p className={styles.cardDesc}>
                Hari besar itu semakin dekat. Pengumuman kelulusan generasi JUARA SMPN 5 Klaten akan resmi dibuka pada:
                <br /><br />
                📅 <strong>Selasa, 2 Juni 2026 pukul 17.00 WIB</strong>
                <br /><br />
                <em>Istirahat sejenak — kamu sudah berjuang keras untuk ini.</em>
              </p>
            </div>
          ) : (
            <>
              <h2 className={styles.cardTitle}>🔍 Temukan Hasil Perjuanganmu</h2>
              <p className={styles.cardDesc}>
                Masukkan NISN-mu dan lihat hasil akhir dari setiap langkah, setiap belajar malam, dan setiap doa yang kamu panjatkan selama di SMPN 5 Klaten.
              </p>

              <form onSubmit={handleSearch} className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Masukkan NISN..."
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className={styles.input}
                  maxLength={10}
                  pattern="\d*"
                  title="NISN harus berupa angka"
                  required
                />
                <button type="submit" className={styles.btnSubmit} disabled={loading || !nisn}>
                  {loading ? "Mencari Data..." : "Cek Kelulusan"}
                </button>
              </form>

              {error && <p className={styles.errorText}>{error}</p>}

              {result && (
                <div className={`${styles.resultBox} ${result.status === "LULUS" ? styles.lulus : styles.tidakLulus}`}>
                  <div className={styles.studentInfo}>
                    <h3>{result.name}</h3>
                    <p>NISN: {result.nisn}</p>
                  </div>
                  <div>
                    <p className={styles.statusLabel}>Dinyatakan:</p>
                    <div className={`${styles.statusValue} ${result.status === "LULUS" ? styles.lulus : styles.tidakLulus}`}>
                      {result.status}
                    </div>
                    {result.status === "LULUS" ? (
                      <div style={{ marginTop: "1.5rem", color: "var(--text-main)", lineHeight: "1.6", fontSize: "1.1rem" }}>
                        <p style={{ marginBottom: "0.5rem" }}>Selamat, <strong>JUARA</strong>! 🎉</p>
                        <p style={{ marginBottom: "0.5rem" }}>Kamu resmi menaklukkan babak ini.</p>
                        <p style={{ marginBottom: "0.5rem" }}>Bawa terus nilai <strong>Jujur, Unggul, Amanah, Religius, dan Aktif</strong> ke mana pun langkahmu membawa — karena JUARA sejati tidak berhenti di sini.</p>
                        <p><em>Terbanglah lebih tinggi. Dunia menunggumu.</em></p>
                      </div>
                    ) : (
                      <div style={{ marginTop: "1.5rem", color: "var(--text-main)", lineHeight: "1.6", fontSize: "1.1rem" }}>
                        <p style={{ marginBottom: "0.5rem" }}>Ini bukan akhir ceritamu. 🤍</p>
                        <p style={{ marginBottom: "0.5rem" }}>Seorang <strong>JUARA</strong> dikenal bukan dari seberapa mulus jalannya — tetapi dari seberapa berani ia bangkit dan mencoba lagi.</p>
                        <p><em>Tetap pegang nilai-nilaimu. Perjalananmu masih panjang, dan yang terbaik belum datang.</em></p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2026 SMP Negeri 5 Klaten</p>
        <a href="/">← Kembali ke Beranda</a>
      </footer>
    </main>
  );
}
