"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  BookOpen,
  Calculator,
  Award,
  ArrowLeft,
  AlertCircle,
  Clock,
} from "lucide-react";
import styles from "./tryout.module.css";

interface StudentResult {
  nisn: string;
  nama: string;
  kelas: string;
  bhsIndonesia: number | null;
  matematika: number | null;
  rataRata: number | null;
  toIndex: number;
  toLabel: string;
}

interface TOHistoryItem {
  toIndex: number;
  toLabel: string;
  isAvailable: boolean;
  rataRata: number | null;
  bhsIndonesia: number | null;
  matematika: number | null;
}

interface AvailableTO {
  to: number;
  label: string;
  isAvailable: boolean;
}

export default function TryOutTKAPage() {
  const [nisn, setNisn] = useState("");
  const [selectedTo, setSelectedTo] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [history, setHistory] = useState<TOHistoryItem[]>([]);
  const [availableTOs, setAvailableTOs] = useState<AvailableTO[]>([
    { to: 1, label: "Try Out 1", isAvailable: true },
    { to: 2, label: "Try Out 2", isAvailable: false },
    { to: 3, label: "Try Out 3", isAvailable: false },
    { to: 4, label: "Try Out 4", isAvailable: false },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount and check active TOs
  useEffect(() => {
    inputRef.current?.focus();

    async function checkTOStatus() {
      try {
        const res = await fetch("/api/tryout-tka");
        if (res.ok) {
          const data = await res.json();
          if (data.availableTOs && Array.isArray(data.availableTOs)) {
            setAvailableTOs(data.availableTOs);
          }
        }
      } catch (err) {
        console.error("Gagal memeriksa status TO:", err);
      }
    }

    checkTOStatus();
  }, []);

  // Handler pencarian data nilai siswa
  const handleSearch = async (
    e?: React.FormEvent,
    overrideTo?: number,
    overrideNisn?: string
  ) => {
    if (e) e.preventDefault();

    const targetNisn = (overrideNisn ?? nisn).trim().replace(/\D/g, "");
    if (!targetNisn) {
      setError("Silakan masukkan NISN.");
      inputRef.current?.focus();
      return;
    }

    if (targetNisn.length < 5) {
      setError("NISN minimal terdiri dari 5 digit angka.");
      return;
    }

    const toIndex = overrideTo ?? selectedTo;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/tryout-tka?nisn=${encodeURIComponent(targetNisn)}&to=${toIndex}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Data hasil Try Out tidak ditemukan.");
        setResult(null);
        return;
      }

      setResult(data.data);
      if (data.history) setHistory(data.history);
      if (data.availableTOs) setAvailableTOs(data.availableTOs);
      setSelectedTo(toIndex);
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Handler berpindah tab Try Out (1 s.d. 4)
  const handleSwitchTO = (toNum: number) => {
    setSelectedTo(toNum);
    setError("");

    // Jika siswa sudah login, langsung ambil nilai untuk TO yang dipilih
    if (result && nisn) {
      const isTargetAvailable = availableTOs.find((t) => t.to === toNum)?.isAvailable;
      if (isTargetAvailable) {
        handleSearch(undefined, toNum);
      } else {
        // Tab belum dibuka link-nya
        setResult((prev) =>
          prev
            ? {
                ...prev,
                toIndex: toNum,
                toLabel: `Try Out ${toNum}`,
                bhsIndonesia: null,
                matematika: null,
                rataRata: null,
              }
            : null
        );
      }
    }
  };

  // Reset form untuk cek NISN siswa lain
  const handleReset = () => {
    setResult(null);
    setNisn("");
    setError("");
    setSelectedTo(1);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const renderScore = (score: number | null) => {
    if (score === null || score === undefined) {
      return "—";
    }
    return score.toFixed(1).replace(".0", "");
  };

  return (
    <div className={styles.container}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerTopRow}>
            <div className={styles.schoolBadge}>SMP NEGERI 5 KLATEN</div>
            <div className={styles.academicYearTag}>Tahun Ajaran 2026/2027</div>
          </div>

          <div className={styles.headerMainRow}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo_smpn5.png"
                alt="Logo SMPN 5 Klaten"
                width={64}
                height={64}
                className={styles.logo}
                priority
              />
            </div>
            <div className={styles.headerTextCol}>
              <h1 className={styles.title}>Hasil Try Out TKA</h1>
              <p className={styles.subtitle}>
                Portal Resmi Capaian Simulasi Tes Kemampuan Akademik Siswa Kelas IX.
              </p>
            </div>
          </div>

          {/* ── TAB PILIHAN TRY OUT (1 - 4) ──────────────────── */}
          <nav className={styles.toNavWrapper} aria-label="Pilihan Seri Try Out">
            <span className={styles.toNavLabel}>Seri Try Out:</span>
            {availableTOs.map((item) => {
              const isActive = selectedTo === item.to;
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => handleSwitchTO(item.to)}
                  className={`${styles.toTab} ${isActive ? styles.toTabActive : ""} ${
                    !item.isAvailable ? styles.toTabDisabled : ""
                  }`}
                  aria-pressed={isActive}
                >
                  <span>{item.label}</span>
                  {!item.isAvailable && (
                    <span className={styles.toBadgeUpcoming}>Segera</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main className={styles.mainContent}>
        {!result ? (
          /* ── LAYAR 1: FORM LOGIN NISN ─────────────────────── */
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Masuk untuk Melihat Nilai</h2>
              <p className={styles.cardDesc}>
                Silakan masukkan <strong>NISN</strong> (Nomor Induk Siswa
                Nasional) kamu untuk melihat hasil nilai <strong>Try Out {selectedTo}</strong>.
              </p>
            </div>

            <form onSubmit={handleSearch} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="nisnInput" className={styles.label}>
                  <span>Nomor Induk Siswa Nasional (NISN)</span>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Wajib diisi
                  </span>
                </label>
                <div className={styles.inputWrapper}>
                  <Search className={styles.inputIcon} size={18} />
                  <input
                    id="nisnInput"
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={15}
                    placeholder="Contoh: 0091234567"
                    value={nisn}
                    onChange={(e) =>
                      setNisn(e.target.value.replace(/\D/g, ""))
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <p className={styles.inputHelper}>
                  Masukkan nomor NISN tanpa spasi atau tanda hubung.
                </p>
              </div>

              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={loading || !nisn.trim()}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner} />
                    <span>Mencari Data...</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Lihat Nilai Try Out {selectedTo}</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className={styles.errorBox} role="alert">
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Perhatian:</strong> {error}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── LAYAR 2: DASHBOARD HASIL SISWA ────────────────── */
          <div className={styles.resultCard}>
            {/* Banner Identitas Siswa */}
            <div className={styles.studentBanner}>
              <div className={styles.studentInfoMain}>
                <div className={styles.studentAvatar}>
                  {result.nama.charAt(0).toUpperCase()}
                </div>
                <div className={styles.studentNameCol}>
                  <h2 className={styles.studentName}>{result.nama}</h2>
                  <span className={styles.toTag}>
                    Hasil {result.toLabel} TKA 2026/2027
                  </span>
                </div>
              </div>

              <div className={styles.studentMetaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>NISN</span>
                  <span className={styles.metaValue}>{result.nisn}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Kelas</span>
                  <span className={styles.metaValue}>{result.kelas || "—"}</span>
                </div>
              </div>
            </div>

            {/* Jika TO yang dipilih nilainya belum ada */}
            {result.bhsIndonesia === null && result.matematika === null ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2.5rem 1rem",
                  background: "#f8fafc",
                  borderRadius: 16,
                  border: "1px dashed #cbd5e1",
                  marginBottom: "1.5rem",
                }}
              >
                <Clock
                  size={36}
                  style={{ color: "#94a3b8", marginBottom: "0.5rem" }}
                />
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "0.25rem",
                  }}
                >
                  Nilai {result.toLabel} Belum Tersedia
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Pelaksanaan {result.toLabel} belum selesai atau data belum
                  diunggah oleh panitia sekolah.
                </p>
              </div>
            ) : (
              <>
                {/* Judul Bagian Nilai */}
                <h3 className={styles.scoreSectionTitle}>
                  <Award size={20} color="var(--primary)" />
                  Rincian Nilai Mata Pelajaran
                </h3>

                {/* Grid 2 Mapel: Bahasa Indonesia & Matematika */}
                <div className={styles.scoreGrid}>
                  {/* Bahasa Indonesia */}
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreCardHeader}>
                      <span className={styles.subjectName}>Bahasa Indonesia</span>
                      <div className={styles.subjectIcon}>
                        <BookOpen size={18} />
                      </div>
                    </div>
                    <div className={styles.scoreValue}>
                      {renderScore(result.bhsIndonesia)}
                    </div>
                  </div>

                  {/* Matematika */}
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreCardHeader}>
                      <span className={styles.subjectName}>Matematika</span>
                      <div className={styles.subjectIcon}>
                        <Calculator size={18} />
                      </div>
                    </div>
                    <div className={styles.scoreValue}>
                      {renderScore(result.matematika)}
                    </div>
                  </div>
                </div>

                {/* Highlight Nilai Rata-Rata */}
                <div className={styles.avgHighlightCard}>
                  <div className={styles.avgLeft}>
                    <span className={styles.avgTitle}>Nilai Rata-Rata</span>
                    <span className={styles.avgDesc}>
                      Akumulasi 2 Mata Pelajaran {result.toLabel}
                    </span>
                  </div>
                  <div className={styles.avgNumber}>
                    {renderScore(result.rataRata)}
                  </div>
                </div>
              </>
            )}

            {/* ── ROADMAP 4 SERI TRY OUT ─────────────────────── */}
            <div className={styles.roadmapSection}>
              <div className={styles.roadmapHeader}>
                <span className={styles.roadmapTitle}>
                  Rekapitulasi 4 Seri Try Out TKA
                </span>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Target: 4 Seri
                </span>
              </div>

              <div className={styles.roadmapGrid}>
                {[1, 2, 3, 4].map((toNum) => {
                  const hist = history.find((h) => h.toIndex === toNum);
                  const isCurrent = selectedTo === toNum;
                  const isAvailable = availableTOs.find((a) => a.to === toNum)
                    ?.isAvailable;

                  return (
                    <div
                      key={toNum}
                      className={`${styles.roadmapItem} ${
                        isCurrent ? styles.roadmapItemActive : ""
                      }`}
                    >
                      <span className={styles.roadmapToLabel}>TO {toNum}</span>
                      {hist?.rataRata !== null && hist?.rataRata !== undefined ? (
                        <span className={styles.roadmapScore}>
                          {hist.rataRata.toFixed(1).replace(".0", "")}
                        </span>
                      ) : (
                        <span className={styles.roadmapPending}>
                          {isAvailable ? "—" : "Segera"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catatan Penting & Pesan Motivasi */}
            <div className={styles.noteBox}>
              <div className={styles.noteTitle}>Catatan Panitia TKA:</div>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                <li>
                  Hasil Try Out ini merupakan sarana evaluasi dan latihan bagi
                  siswa kelas IX menuju Tes Kemampuan Akademik (TKA) resmi.
                </li>
                <li>
                  Terus pertahankan motivasi belajar dan konsultasikan materi
                  yang belum dipahami bersama Bapak/Ibu guru pengampu.
                </li>
              </ul>
            </div>

            {/* Tombol Aksi */}
            <div className={styles.actionRow}>
              <button
                type="button"
                onClick={handleReset}
                className={styles.btnReset}
              >
                <ArrowLeft size={18} />
                <span>Cari NISN Lain</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>© 2026 SMP Negeri 5 Klaten · Generasi JUARA</p>
        <a href="/" className={styles.footerLink}>
          ← Kembali ke Beranda Sekolah
        </a>
      </footer>
    </div>
  );
}
