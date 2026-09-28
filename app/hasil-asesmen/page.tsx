"use client";
// app/hasil-asesmen/page.tsx
// Halaman login NIS — Hasil Asesmen SMPN 5 Klaten

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { labelTA } from "@/lib/hasil-asesmen";
import styles from "./hasil-asesmen.module.css";

export default function HasilAsesmenPage() {
  const [nis, setNis] = useState("");
  const [selectedTa, setSelectedTa] = useState("2627");
  const [taList, setTaList] = useState<string[]>(["2627"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Auto-focus pada input setelah mount
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nis.trim();
    if (!trimmed || trimmed.length < 4) {
      setError("NIS minimal 4 digit.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        nis: trimmed,
        mapel: "PAI",
      });
      if (selectedTa) queryParams.set("ta", selectedTa);

      const res = await fetch(`/api/hasil-asesmen/nilai?${queryParams.toString()}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "NIS tidak ditemukan. Pastikan nomor yang kamu masukkan benar.");
        setLoading(false);
        return;
      }

      if (data.taList && Array.isArray(data.taList) && data.taList.length > 0) {
        setTaList(data.taList);
      }

      // Simpan session singkat di sessionStorage
      sessionStorage.setItem("ha_nis", trimmed);
      sessionStorage.setItem("ha_nama", data.nama ?? "");
      const targetTa = selectedTa || data.activeTa || "2627";

      // Redirect ke dashboard
      router.push(`/hasil-asesmen/${encodeURIComponent(trimmed)}?ta=${encodeURIComponent(targetTa)}`);
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet kamu.");
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className={styles.header}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://iili.io/FntumI2.md.png"
          alt="Logo SMPN 5 Klaten"
          className={styles.logo}
          width={80}
          height={80}
        />
        <p className={styles.headerSub}>SMP NEGERI 5 KLATEN</p>
        <h1 className={styles.headerTitle}>Hasil Asesmen</h1>
        <p className={styles.headerTagline}>
          Portal Resmi Capaian Asesmen Sumatif Siswa SMP Negeri 5 Klaten.
        </p>
        <div className={styles.taBadgeHeader}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Tahun Ajaran {labelTA(selectedTa)}
        </div>
      </header>

      {/* ── CARD FORM ─────────────────────────────────────── */}
      <div className={styles.content}>
        <div className={`${styles.card} ${mounted ? styles.cardVisible : ""}`}>
          <h2 className={styles.cardTitle}>Masukkan NIS Kamu</h2>
          <p className={styles.cardDesc}>
            Nomor Induk Siswa tercantum di kartu pelajar atau buku laporan.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="ta" className={styles.label}>
                Tahun Ajaran
              </label>
              <select
                id="ta"
                value={selectedTa}
                onChange={(e) => setSelectedTa(e.target.value)}
                className={styles.selectTA}
              >
                {taList.map((t) => (
                  <option key={t} value={t}>
                    Tahun Ajaran {labelTA(t)} {t === "2627" ? "(Terbaru)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="nis" className={styles.label}>
                Nomor Induk Siswa (NIS)
              </label>
              <input
                ref={inputRef}
                id="nis"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Contoh: 2627001"
                value={nis}
                onChange={(e) => {
                  setNis(e.target.value.replace(/\D/g, ""));
                  if (error) setError("");
                }}
                className={`${styles.input} ${error ? styles.inputError : ""}`}
                maxLength={12}
                autoComplete="off"
                required
                aria-describedby={error ? "nis-error" : undefined}
              />
              {error && (
                <p id="nis-error" className={styles.errorText} role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading || nis.length < 4}
              aria-live="polite"
            >
              {loading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Memuat data…
                </>
              ) : (
                <>
                  Lihat Nilai Saya
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Keterangan mapel aktif */}
          <p className={styles.mapelNote}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Saat ini tersedia: <strong>Pendidikan Agama Islam (PAI)</strong>. Mapel lain menyusul.
          </p>
        </div>
      </div>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>© 2026 SMP Negeri 5 Klaten</p>
        <a href="/">← Kembali ke Beranda</a>
      </footer>
    </main>
  );
}
