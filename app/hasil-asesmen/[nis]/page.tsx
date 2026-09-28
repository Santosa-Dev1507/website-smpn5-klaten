"use client";
// app/hasil-asesmen/[nis]/page.tsx
// Dashboard hasil asesmen siswa — 5 Lapisan: Nilai → Posisi → Refleksi → Tindakan → Motivasi

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import type { HasilSiswa, JenisAsesmen, AnalisisNilai } from "@/lib/hasil-asesmen";
import {
  analisisNilai,
  DAFTAR_MAPEL,
  URUTAN_ASESMEN,
  LABEL_ASESMEN,
  LABEL_ASESMEN_PENDEK,
  formatTanggal,
  labelTA,
  PESAN_PENUTUP_BERSAMA,
} from "@/lib/hasil-asesmen";
import styles from "./dashboard.module.css";

// ── Count-up hook ───────────────────────────────────────────
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return value;
}

// ── Mapel SVG Icons (100% SVG, Tanpa Emoji) ─────────────────
function MapelIcon({ kode }: { kode: string }) {
  switch (kode) {
    case "PAI":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      );
    case "PKN":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      );
    case "BIND":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      );
    case "MTK":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="4" y1="9" x2="20" y2="9"/>
          <line x1="4" y1="15" x2="20" y2="15"/>
          <line x1="10" y1="3" x2="8" y2="21"/>
          <line x1="16" y1="3" x2="14" y2="21"/>
        </svg>
      );
    case "IPA":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 2v7.31L4.1 19.34A2 2 0 0 0 5.82 22h12.36a2 2 0 0 0 1.72-2.66L14 9.31V2"/>
          <line x1="8" y1="2" x2="16" y2="2"/>
          <line x1="6.8" y1="15" x2="17.2" y2="15"/>
        </svg>
      );
    case "IPS":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    case "BING":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8"/>
          <path d="M12 8v8"/>
        </svg>
      );
    case "PJOK":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      );
    case "SENIBD":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>
        </svg>
      );
    case "PRAKAR":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      );
    case "MULOK":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="3" y1="22" x2="21" y2="22"/>
          <line x1="6" y1="18" x2="6" y2="11"/>
          <line x1="10" y1="18" x2="10" y2="11"/>
          <line x1="14" y1="18" x2="14" y2="11"/>
          <line x1="18" y1="18" x2="18" y2="11"/>
          <polygon points="12 2 20 7 4 7"/>
        </svg>
      );
    case "BK":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      );
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      );
  }
}

// ── Nilai Hero Display (Flat, tanpa card-in-card) ────────────
function NilaiHero({
  data,
  mapelNama,
  jenisNama,
}: {
  data: AnalisisNilai;
  mapelNama: string;
  jenisNama: string;
}) {
  const animated = useCountUp(data.nilai, 1000, 300);
  const isGreen = data.statusTuntas;

  return (
    <section
      className={`${styles.nilaiHero} ${isGreen ? styles.nilaiGreen : styles.nilaiAmber} reveal`}
      aria-label={`Nilai ${mapelNama}`}
    >
      <div className={styles.nilaiHeroHeader}>
        <span className={styles.nilaiHeroMapel}>{mapelNama}</span>
        <span className={styles.nilaiHeroPeriod}>{jenisNama}</span>
      </div>
      <div className={styles.nilaiAngka}>{animated}</div>
      <div className={styles.nilaiPredikat}>Predikat {data.predikat}</div>
      <div className={`${styles.nilaiStatus} ${isGreen ? styles.statusTuntas : styles.statusBelum}`}>
        {isGreen ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Tuntas KKTP
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            Belum Tuntas KKTP
          </>
        )}
      </div>
      <div className={styles.nilaiMetaRow}>
        <span className={styles.nilaiMetaItem}>KKTP: <strong>{data.kktp}</strong></span>
        {data.tanggal && (
          <span className={styles.nilaiMetaItem}>Pelaksanaan: <strong>{formatTanggal(data.tanggal)}</strong></span>
        )}
      </div>
    </section>
  );
}

// ── Progress Bar ────────────────────────────────────────────
function ProgressSemester({ hasil, activeJenis }: { hasil: Partial<Record<JenisAsesmen, AnalisisNilai>>, activeJenis: JenisAsesmen }) {
  return (
    <div className={styles.progressWrap}>
      <h3 className={styles.progressTitle}>Progress Semester</h3>
      <div className={styles.progressList}>
        {URUTAN_ASESMEN.map((j) => {
          const d = hasil[j];
          const isActive = j === activeJenis;
          const pct = d ? (d.nilai / 100) * 100 : 0;
          return (
            <div key={j} className={`${styles.progressRow} ${isActive ? styles.progressRowActive : ""}`}>
              <span className={styles.progressLabel}>{LABEL_ASESMEN_PENDEK[j]}</span>
              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressFill} ${d?.statusTuntas ? styles.progressGreen : d ? styles.progressAmber : styles.progressEmpty}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={styles.progressNilai}>
                {d ? d.nilai : <span className={styles.progressDash}>—</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTa = searchParams.get("ta") || "";

  const rawNis = params?.nis as string | undefined;
  const nis = rawNis ? decodeURIComponent(rawNis) : "";

  const [hasilSiswa, setHasilSiswa] = useState<HasilSiswa | null>(null);
  const [selectedTa, setSelectedTa] = useState(initialTa);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeMapel, setActiveMapel] = useState("PAI");
  const [activeJenis, setActiveJenis] = useState<JenisAsesmen>("ASTS_Gasal");
  const [analisis, setAnalisis] = useState<AnalisisNilai | null>(null);
  const confettiFired = useRef(false);

  // ── Fetch data ─────────────────────────────────────────
  const fetchData = useCallback(async (mapel: string, taOverride?: string) => {
    if (!nis) return;
    setLoading(true);
    setError("");
    confettiFired.current = false;
    try {
      const q = new URLSearchParams({
        nis,
        mapel,
      });
      const activeTaParam = taOverride !== undefined ? taOverride : selectedTa;
      if (activeTaParam) q.set("ta", activeTaParam);

      const res = await fetch(`/api/hasil-asesmen/nilai?${q.toString()}`);
      const data: HasilSiswa & { error?: string } = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Data tidak ditemukan.");
        setLoading(false);
        return;
      }
      setHasilSiswa(data);
      if (!selectedTa && data.ta) setSelectedTa(data.ta);
      // Tentukan tab aktif default: asesmen pertama yang ada datanya
      const firstAvail = URUTAN_ASESMEN.find(j => data.hasil[j]?.nilai !== null && data.hasil[j]?.nilai !== undefined);
      if (firstAvail) setActiveJenis(firstAvail);
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [nis, selectedTa]);

  useEffect(() => { fetchData(activeMapel); }, [fetchData, activeMapel]);

  // ── Analisis saat data / tab berubah ──────────────────
  useEffect(() => {
    if (!hasilSiswa) return;
    const nilaiData = hasilSiswa.hasil[activeJenis];
    if (!nilaiData || nilaiData.nilai === null) {
      setAnalisis(null);
      return;
    }
    setAnalisis(analisisNilai(nilaiData, activeMapel));
  }, [hasilSiswa, activeJenis, activeMapel]);

  // ── Confetti saat analisis ready ──────────────────────
  useEffect(() => {
    if (!analisis || confettiFired.current) return;
    confettiFired.current = true;

    const delay = 900; // setelah count-up selesai
    const level = analisis.konfeti;

    setTimeout(() => {
      if (level === "besar") {
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.55 }, colors: ["#944535", "#FAD6A6", "#fff", "#f9c74f"] });
        setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.4 }, startVelocity: 35 }), 300);
      } else if (level === "sedang") {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ["#944535", "#FAD6A6", "#fff"] });
      } else if (level === "kecil") {
        confetti({ particleCount: 40, spread: 55, origin: { y: 0.65 }, scalar: 0.85 });
      } else {
        // motivasi: bukan confetti, pakai emoji cannon ringan
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 }, scalar: 0.6, gravity: 0.6 });
      }
    }, delay);
  }, [analisis]);

  // ── Mapel yang aktif berdasarkan _CONFIG ──────────────
  const mapelAktifList = hasilSiswa?.mapelAktif ?? ["PAI"];

  // ── Render ────────────────────────────────────────────
  if (loading) {
    return (
      <main className={styles.main}>
        <div className={styles.loadingWrap}>
          <div className={styles.loadingSpinner} aria-label="Memuat data…" />
          <p className={styles.loadingText}>Mengambil data nilaimu…</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.errorWrap}>
          <div className={styles.errorIcon} aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className={styles.errorTitle}>Tidak Ditemukan</h2>
          <p className={styles.errorDesc}>{error}</p>
          <button onClick={() => router.push("/hasil-asesmen")} className={styles.btnKembali}>
            ← Coba NIS Lain
          </button>
        </div>
      </main>
    );
  }

  if (!hasilSiswa) return null;

  const nilaiAktif = hasilSiswa.hasil[activeJenis];
  const adaNilai = nilaiAktif?.nilai !== null && nilaiAktif?.nilai !== undefined;

  return (
    <main className={styles.main}>
      {/* ── HEADER ──────────────────────────────────────── */}
      <header className={styles.header}>
        <button onClick={() => router.push("/hasil-asesmen")} className={styles.btnBack} aria-label="Kembali ke halaman login">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className={styles.headerInfo}>
          <p className={styles.headerGreet}>Halo, <strong>{hasilSiswa.nama}</strong>!</p>
          <p className={styles.headerMeta}>
            Kelas {hasilSiswa.kelas} &middot; NIS {nis}
          </p>
        </div>
        <div className={styles.headerTA}>
          <span className={styles.taBadge} title={`Tahun Ajaran: ${labelTA(hasilSiswa.ta)}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ verticalAlign: "-1px", marginRight: "4px" }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            TA {labelTA(hasilSiswa.ta)}
          </span>
        </div>
      </header>

      <div className={styles.body}>
        {/* ── MULTI-TA SWITCHER (JIKA ADA > 1 TA) ──────── */}
        {hasilSiswa.taList && hasilSiswa.taList.length > 1 && (
          <div className={styles.taSwitcherBar}>
            <span className={styles.taSwitcherLabel}>Tahun Ajaran:</span>
            <div className={styles.taSwitcherPills}>
              {hasilSiswa.taList.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTa(t);
                    fetchData(activeMapel, t);
                  }}
                  className={`${styles.taPillBtn} ${hasilSiswa.ta === t ? styles.taPillBtnActive : ""}`}
                >
                  TA {labelTA(t)}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* ── MAPEL CHIPS (12 MAPEL) ──────────────────── */}
        <section className={styles.mapelSection} aria-label="Pilih Mata Pelajaran">
          <div className={styles.chipScroll}>
            {DAFTAR_MAPEL.map((m) => {
              const isAvailable = mapelAktifList.includes(m.kode) || m.kode === "PAI";
              const isSelected = activeMapel === m.kode;

              return (
                <button
                  key={m.kode}
                  onClick={() => {
                    if (isAvailable) {
                      setActiveMapel(m.kode);
                    }
                  }}
                  className={`${styles.chip} ${isSelected ? styles.chipActive : ""} ${!isAvailable ? styles.chipDisabled : ""}`}
                  aria-pressed={isSelected}
                  disabled={!isAvailable}
                  title={isAvailable ? m.nama : `${m.nama} (Belum dibuka)`}
                >
                  <MapelIcon kode={m.kode} /> {m.nama}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── TABS ASESMEN ────────────────────────────── */}
        <section className={styles.tabSection} aria-label="Jenis Asesmen">
          <div className={styles.tabList} role="tablist">
            {URUTAN_ASESMEN.map((j) => {
              const ada = hasilSiswa.hasil[j]?.nilai !== null && hasilSiswa.hasil[j]?.nilai !== undefined;
              return (
                <button
                  key={j}
                  role="tab"
                  aria-selected={activeJenis === j}
                  onClick={() => setActiveJenis(j)}
                  className={`${styles.tab} ${activeJenis === j ? styles.tabActive : ""} ${!ada ? styles.tabEmpty : ""}`}
                >
                  {LABEL_ASESMEN[j]}
                  {ada && <span className={styles.tabDot} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── KONTEN NILAI ────────────────────────────── */}
        {!adaNilai ? (
          <div className={styles.belumTersedia}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <p>Nilai <strong>{LABEL_ASESMEN[activeJenis]}</strong> belum tersedia.</p>
            <p className={styles.belumSub}>Cek kembali setelah asesmen dilaksanakan.</p>
          </div>
        ) : analisis ? (
          <div className={styles.layersWrap}>

            {/* ── L1: NILAI HERO (Flat, tanpa card-in-card) ──── */}
            <NilaiHero
              data={analisis}
              mapelNama={DAFTAR_MAPEL.find((m) => m.kode === activeMapel)?.nama ?? activeMapel}
              jenisNama={LABEL_ASESMEN[activeJenis]}
            />

            {/* ── L2: POSISI ────────────────────────── */}
            <section className={`${styles.layer} reveal`} aria-label="Posisi dalam kelas">
              <div className={styles.layerHeader}>
                <h2 className={styles.layerTitle}>Posisi Capaian di Kelas</h2>
              </div>
              <div className={styles.posisiWrap}>
                {/* Posisi relatif */}
                {analisis.rataKelas !== null && (
                  <div className={styles.posisiBar}>
                    {/* Ringkasan Skor Langsung */}
                    <div className={styles.posisiStatRow}>
                      <div className={`${styles.posisiStatPill} ${styles.posisiStatNilai}`}>
                        <span className={styles.posisiStatLabel}>Nilai Siswa:</span>
                        <strong className={styles.posisiStatVal}>{analisis.nilai}</strong>
                      </div>
                      <div className={`${styles.posisiStatPill} ${styles.posisiStatRata}`}>
                        <span className={styles.posisiStatLabel}>Rata-rata Kelas:</span>
                        <strong className={styles.posisiStatVal}>{analisis.rataKelas}</strong>
                      </div>
                    </div>

                    <div className={styles.posisiTrack}>
                      {/* Marker nilai siswa (DI ATAS BAR) */}
                      <div
                        className={styles.markerNilai}
                        style={{ left: `${Math.min(Math.max(analisis.nilai, 6), 94)}%` }}
                      >
                        <span className={styles.markerLabelNilai}>Nilaimu {analisis.nilai}</span>
                      </div>

                      {/* Marker rata-rata kelas (DI BAWAH BAR) */}
                      <div
                        className={styles.markerRata}
                        style={{ left: `${Math.min(Math.max(analisis.rataKelas, 6), 94)}%` }}
                      >
                        <span className={styles.markerLabel}>Rata-rata {analisis.rataKelas}</span>
                      </div>

                      <div className={styles.posisiFill} style={{ width: `${Math.min(analisis.nilai, 100)}%` }} />
                    </div>

                    <p className={styles.posisiKet}>
                      {analisis.posisiKelas === "di_atas"
                        ? `Kamu berada ${analisis.selisihRata} poin di atas rata-rata kelas.`
                        : analisis.posisiKelas === "di_bawah"
                        ? `Kamu berada ${Math.abs(analisis.selisihRata)} poin di bawah rata-rata kelas.`
                        : "Kamu berada setara dengan rata-rata capaian kelas."}
                    </p>
                  </div>
                )}
                {/* Tren */}
                <div className={`${styles.trendChip} ${
                  analisis.trendNilai === "naik" ? styles.trendNaik :
                  analisis.trendNilai === "turun" ? styles.trendTurun :
                  analisis.trendNilai === "pertama" ? styles.trendPertama : styles.trendStabil
                }`}>
                  {analisis.trendNilai === "naik"     && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> Naik {analisis.selisihPrev} poin dari sebelumnya</>}
                  {analisis.trendNilai === "turun"    && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg> Turun {Math.abs(analisis.selisihPrev)} poin dari sebelumnya</>}
                  {analisis.trendNilai === "stabil"   && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg> Stabil dari asesmen sebelumnya</>}
                  {analisis.trendNilai === "pertama"  && <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Asesmen pertama kamu</>}
                </div>
              </div>
              {/* Progress Semester di sini */}
              <ProgressSemester hasil={Object.fromEntries(
                URUTAN_ASESMEN.map(j => [j, hasilSiswa.hasil[j] ? analisisNilai(hasilSiswa.hasil[j]!, activeMapel) : undefined]).filter(([,v]) => v)
              ) as Partial<Record<JenisAsesmen, AnalisisNilai>>} activeJenis={activeJenis} />
            </section>

            {/* ── L4: TINDAKAN ──────────────────────── */}
            <section className={`${styles.layer} reveal`} aria-label="Langkah tindak lanjut">
              <div className={styles.layerHeader}>
                <h2 className={styles.layerTitle}>
                  {analisis.statusTuntas ? "Rekomendasi Tindak Lanjut" : "Langkah Peningkatan Belajar"}
                </h2>
              </div>
              <ul className={styles.tindakanList}>
                {analisis.tindakan.map((t, i) => (
                  <li key={i} className={styles.tindakanItem}>
                    <span className={styles.tindakanNum} aria-hidden="true">{i + 1}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── L5: MOTIVASI DENGAN NILAI ISLAM ────── */}
            <section className={`${styles.layer} ${styles.layerMotivasi} reveal`} aria-label="Pesan Motivasi">
              <div className={styles.motivasiBadge} aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3 className={styles.motivasiHeading}>{analisis.motivasiIslam.judul}</h3>
              {analisis.motivasiIslam.subjudul && (
                <p className={styles.motivasiSubheading}>{analisis.motivasiIslam.subjudul}</p>
              )}
              <p className={styles.motivasiPesan}>{analisis.motivasiIslam.pesan}</p>
              {analisis.motivasiIslam.callout && (
                <div className={styles.motivasiCallout}>{analisis.motivasiIslam.callout}</div>
              )}
            </section>

            {/* ── PESAN PENUTUP BERSAMA ──────────────── */}
            <section className={`${styles.layerPenutup} reveal`} aria-label="Pesan Penutup">
              <div className={styles.penutupHeaderRow}>
                <span className={styles.penutupIcon} aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </span>
                <h3 className={styles.penutupJudul}>{PESAN_PENUTUP_BERSAMA.judul}</h3>
              </div>
              <p className={styles.penutupPesan}>{PESAN_PENUTUP_BERSAMA.pesan}</p>
            </section>

          </div>
        ) : null}
      </div>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className={styles.footer}>
        <p>© 2026 SMP Negeri 5 Klaten</p>
        <a href="/">← Kembali ke Beranda</a>
      </footer>
    </main>
  );
}
