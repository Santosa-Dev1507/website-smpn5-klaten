"use client";

import { useState } from "react";
import styles from "./hasiltka.module.css";

interface TkaResult {
  nisn: string;
  nama: string;
  kelas: string;
  bhsIndonesia: number | null;
  matematika: number | null;
  rataRata: number | null;
}

export default function HasilTkaPage() {
  const [nisn, setNisn] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TkaResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisn || !tanggalLahir) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/hasiltka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nisn: nisn.trim(), tanggalLahir: tanggalLahir.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Terjadi kesalahan. Silakan coba lagi.");
        return;
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet kamu.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setNisn("");
    setTanggalLahir("");
    setError("");
  };

  const renderScore = (value: number | null) =>
    value === null ? <span className={styles.scoreEmpty}>—</span> : value;

  return (
    <main className={styles.main}>
      {/* HEADER */}
      <header className={styles.header}>
        <img
          src="https://iili.io/FntumI2.md.png"
          alt="Logo SMPN 5 Klaten"
          className={styles.logo}
        />
        <p className={styles.headerSub}>HASIL TES KEMAMPUAN AKADEMIK</p>
        <h1 className={styles.headerTitle}>Pengumuman Hasil TKA</h1>
        <p className={styles.headerTagline}>
          <em>
            &quot;Bekal terakhir dari ESPEMA — bawalah ke jenjang berikutnya
            dengan kepala tegak, JUARA.&quot;
          </em>
        </p>
      </header>

      <div className={styles.content}>
        <div className={styles.card}>
          {!result ? (
            <>
              <h2 className={styles.cardTitle}>Masuk untuk Lihat Nilai</h2>
              <p className={styles.cardDesc}>
                Masukkan <strong>NISN</strong> dan <strong>tanggal lahir</strong>{" "}
                kamu untuk melihat hasil Tes Kemampuan Akademik (TKA).
              </p>

              <form onSubmit={handleSearch} className={styles.formGroup}>
                <div className={styles.field}>
                  <label htmlFor="nisn" className={styles.label}>
                    NISN
                  </label>
                  <input
                    id="nisn"
                    type="text"
                    inputMode="numeric"
                    placeholder="Contoh: 0123456789"
                    value={nisn}
                    onChange={(e) =>
                      setNisn(e.target.value.replace(/\D/g, ""))
                    }
                    className={styles.input}
                    maxLength={15}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="tanggal" className={styles.label}>
                    Tanggal Lahir
                  </label>
                  <input
                    id="tanggal"
                    type="date"
                    value={tanggalLahir}
                    onChange={(e) => setTanggalLahir(e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={loading || !nisn || !tanggalLahir}
                >
                  {loading ? "Memuat data..." : "Lihat Hasil TKA"}
                </button>
              </form>

              {error && <p className={styles.errorText}>{error}</p>}
            </>
          ) : (
            <div className={styles.resultBox}>
              <div className={styles.resultHeader}>
                <span className={styles.resultBadge}>HASIL TKA 2026</span>
                <h2 className={styles.resultName}>{result.nama}</h2>
                <div className={styles.resultMeta}>
                  <span>
                    <strong>NISN:</strong> {result.nisn}
                  </span>
                  <span>
                    <strong>Kelas:</strong> {result.kelas}
                  </span>
                </div>
              </div>

              <div className={styles.scoreGrid}>
                <div className={styles.scoreCard}>
                  <span className={styles.scoreLabel}>Bahasa Indonesia</span>
                  <span className={styles.scoreValue}>
                    {renderScore(result.bhsIndonesia)}
                  </span>
                </div>
                <div className={styles.scoreCard}>
                  <span className={styles.scoreLabel}>Matematika</span>
                  <span className={styles.scoreValue}>
                    {renderScore(result.matematika)}
                  </span>
                </div>
                <div className={`${styles.scoreCard} ${styles.scoreCardAvg}`}>
                  <span className={styles.scoreLabel}>Rata-rata</span>
                  <span className={styles.scoreValue}>
                    {renderScore(result.rataRata)}
                  </span>
                </div>
              </div>

              {result.bhsIndonesia === null || result.matematika === null ? (
                <p className={styles.resultMessage}>
                  Nilai belum tersedia saat ini. Silakan cek kembali nanti.
                </p>
              ) : (
                <p className={styles.resultMessage}>
                  Selamat menempuh babak baru, <strong>JUARA</strong>. Apa pun
                  angkanya, ESPEMA selalu bangga padamu.
                </p>
              )}

              <button onClick={handleReset} className={styles.btnReset}>
                ← Cek NISN Lain
              </button>
            </div>
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
