"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FlaskConical,
  Globe2,
  Info,
  Languages,
  Link2,
  Monitor,
  Palette,
  RotateCcw,
  Scale,
  Search,
  SearchX,
  X,
} from "lucide-react";
import Header from "../components/Header";
import styles from "./kisi-kisi.module.css";
import type { Kelas, KisiKisiItem, KisiKisiResponse } from "./types";

const KELAS_OPTIONS: Array<{ value: "semua" | Kelas; label: string }> = [
  { value: "semua", label: "Semua Kelas" },
  { value: "VII", label: "Kelas VII" },
  { value: "VIII", label: "Kelas VIII" },
  { value: "IX", label: "Kelas IX" },
];

/** Pilih ikon Lucide yang relevan untuk tiap mata pelajaran */
function SubjectIcon({ mapel }: { mapel: string }) {
  const lower = mapel.toLowerCase();
  const iconProps = { size: 20, strokeWidth: 1.85, "aria-hidden": true as const };

  if (lower.includes("matematika")) return <Calculator {...iconProps} />;
  if (lower.includes("ipa") || lower.includes("alam")) return <FlaskConical {...iconProps} />;
  if (lower.includes("ips") || lower.includes("sosial")) return <Globe2 {...iconProps} />;
  if (lower.includes("inggris") || lower.includes("jawa")) return <Languages {...iconProps} />;
  if (lower.includes("koding") || lower.includes("artifisial") || lower.includes("kka")) {
    return <Cpu {...iconProps} />;
  }
  if (lower.includes("informatika") || lower.includes("tik")) return <Monitor {...iconProps} />;
  if (lower.includes("seni") || lower.includes("prakarya")) return <Palette {...iconProps} />;
  if (lower.includes("pancasila") || lower.includes("pkn")) return <Scale {...iconProps} />;
  if (lower.includes("pjok") || lower.includes("olahraga")) return <Activity {...iconProps} />;
  if (lower.includes("agama")) return <BookOpen {...iconProps} />;
  return <FileText {...iconProps} />;
}

function getKelasBadgeClass(kelas: Kelas): string {
  if (kelas === "VII") return styles.kelasVII;
  if (kelas === "VIII") return styles.kelasVIII;
  return styles.kelasIX;
}

export default function KisiKisiClient() {
  const searchParams = useSearchParams();

  // State data utama
  const [items, setItems] = useState<KisiKisiItem[]>([]);
  const [tahunList, setTahunList] = useState<string[]>([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State filter (inisialisasi dari URL query params untuk deep-linking)
  const initialPeriode = searchParams.get("periode") || searchParams.get("tahun") || "";
  const initialKelasRaw = (searchParams.get("kelas") || "semua").toUpperCase();
  const initialKelas: "semua" | Kelas =
    initialKelasRaw === "VII" || initialKelasRaw === "VIII" || initialKelasRaw === "IX"
      ? initialKelasRaw
      : "semua";
  const initialMapel = searchParams.get("mapel") || "";

  const [tahunAjaran, setTahunAjaran] = useState<string>(initialPeriode);
  const [kelas, setKelas] = useState<"semua" | Kelas>(initialKelas);
  const [searchInput, setSearchInput] = useState<string>(initialMapel);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialMapel);
  const [onlyReady, setOnlyReady] = useState<boolean>(false);

  // State modal pratinjau
  const [previewItem, setPreviewItem] = useState<KisiKisiItem | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const modalDialogRef = useRef<HTMLDivElement>(null);
  const closeModalBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // State salin tautan & toast
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch data dari API route
  const fetchKisiKisi = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/kisi-kisi");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Gagal memuat daftar kisi-kisi.");
      }
      const data: KisiKisiResponse = await res.json();
      setItems(data.items || []);
      setTahunList(data.tahunAjaranList || []);
      setIsDemo(Boolean(data.isDemo));

      // Pilih periode default (terbaru) jika URL belum menentukan periode valid
      setTahunAjaran((prev) => {
        if (prev && data.tahunAjaranList.includes(prev)) return prev;
        return data.tahunAjaranList[0] || "";
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat mengambil data. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKisiKisi();
  }, [fetchKisiKisi]);

  // Debounce pencarian instan 280ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 280);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sinkronkan filter ke URL tanpa menambah stack history
  useEffect(() => {
    if (typeof window === "undefined" || loading) return;
    const params = new URLSearchParams();
    if (tahunAjaran && tahunList.length > 0 && tahunAjaran !== tahunList[0]) {
      params.set("periode", tahunAjaran);
    }
    if (kelas !== "semua") {
      params.set("kelas", kelas);
    }
    if (debouncedSearch) {
      params.set("mapel", debouncedSearch);
    }
    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [tahunAjaran, kelas, debouncedSearch, tahunList, loading]);

  // Statistik nyata untuk periode yang sedang dipilih
  const periodStats = useMemo(() => {
    const inPeriod = items.filter((item) => !tahunAjaran || item.tahunAjaran === tahunAjaran);
    const readyCount = inPeriod.filter((item) => item.status === "tersedia").length;
    const pendingCount = inPeriod.length - readyCount;
    return {
      total: inPeriod.length,
      ready: readyCount,
      pending: pendingCount,
    };
  }, [items, tahunAjaran]);

  // Daftar kartu setelah filter + urutkan "tersedia" sebelum "segera"
  const filteredItems = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return items
      .filter((item) => {
        if (tahunAjaran && item.tahunAjaran !== tahunAjaran) return false;
        if (kelas !== "semua" && item.kelas !== kelas) return false;
        if (onlyReady && item.status !== "tersedia") return false;
        if (q && !item.mataPelajaran.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "tersedia" ? -1 : 1;
        const kelasOrder: Record<Kelas, number> = { VII: 1, VIII: 2, IX: 3 };
        if (a.kelas !== b.kelas) return kelasOrder[a.kelas] - kelasOrder[b.kelas];
        return a.mataPelajaran.localeCompare(b.mataPelajaran, "id");
      });
  }, [items, tahunAjaran, kelas, onlyReady, debouncedSearch]);

  const hasActiveFilter =
    kelas !== "semua" || debouncedSearch.length > 0 || onlyReady;

  const handleResetFilters = () => {
    setKelas("semua");
    setSearchInput("");
    setDebouncedSearch("");
    setOnlyReady(false);
  };

  // Buka & tutup modal dengan manajemen fokus yang aksesibel
  const openPreview = (item: KisiKisiItem) => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setIframeLoaded(false);
    setPreviewItem(item);
  };

  const closePreview = useCallback(() => {
    setPreviewItem(null);
    requestAnimationFrame(() => {
      lastFocusedRef.current?.focus();
    });
  }, []);

  // Lock body scroll, fokus awal, Escape, dan focus trap di modal
  useEffect(() => {
    if (!previewItem) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeModalBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePreview();
        return;
      }

      if (e.key === "Tab" && modalDialogRef.current) {
        const focusables = modalDialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewItem, closePreview]);

  // Salin tautan spesifik kartu untuk dibagikan ke grup WA kelas
  const handleShare = async (item: KisiKisiItem) => {
    const params = new URLSearchParams();
    params.set("periode", item.tahunAjaran);
    params.set("kelas", item.kelas);
    params.set("mapel", item.mataPelajaran);
    const shareUrl = `${window.location.origin}/kisi-kisi?${params.toString()}`;

    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        copied = true;
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
    }

    if (copied) {
      setCopiedId(item.id);
      setToastMessage(`Tautan ${item.mataPelajaran} (Kelas ${item.kelas}) tersalin.`);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToastMessage(null);
        setCopiedId(null);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <main className={styles.main}>
      <Header activePage="Kisi-Kisi Ujian" />

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link href="/">Beranda</Link>
              <span className={styles.breadcrumbSep} aria-hidden="true">
                /
              </span>
              <span aria-current="page">Kisi-Kisi Ujian</span>
            </nav>

            <div className={styles.heroGrid}>
              <div className={styles.heroText}>
                <span className={styles.heroBadge}>
                  <FileText size={14} strokeWidth={2} aria-hidden="true" />
                  Portal Akademik · SMPN 5 Klaten
                </span>
                <h1 className={styles.heroTitle}>
                  Kisi-Kisi <span className={styles.heroTitleAccent}>ASTS dan ASAS</span>
                </h1>
                <p className={styles.heroDesc}>SMPN 5 Klaten</p>
              </div>

              <div className={styles.statsRow} aria-label="Ringkasan ketersediaan kisi-kisi">
                <div className={styles.statBox}>
                  <span className={`${styles.statValue} ${styles.statValueReady}`}>
                    {loading ? "—" : periodStats.ready}
                  </span>
                  <span className={styles.statLabel}>Tersedia</span>
                </div>
                <div className={styles.statBox}>
                  <span className={`${styles.statValue} ${styles.statValuePending}`}>
                    {loading ? "—" : periodStats.pending}
                  </span>
                  <span className={styles.statLabel}>Menunggu</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statValue}>
                    {loading ? "—" : periodStats.total}
                  </span>
                  <span className={styles.statLabel}>Total Mapel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO NOTICE (hanya tampil jika KISIKISI_CSV_URL belum diisi) */}
      {isDemo && !loading && (
        <div className={styles.demoBanner} role="status">
          <div className={`${styles.container} ${styles.demoBannerInner}`}>
            <Info size={18} className={styles.demoBannerIcon} aria-hidden="true" />
            <span>
              <strong>Mode Pratinjau Data:</strong> Tautan Spreadsheet belum dihubungkan. Isi{" "}
              <code>KISIKISI_CSV_URL</code> di pengaturan lingkungan untuk menampilkan file
              kisi-kisi asli sekolah.
            </span>
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <section className={styles.filterWrap} aria-label="Filter kisi-kisi ujian">
        <div className={styles.container}>
          <div className={styles.filterStack}>
            <div className={styles.filterTopRow}>
              {/* Dropdown Tahun Ajaran / Periode Arsip */}
              <div className={styles.fieldGroup}>
                <label htmlFor="filter-periode" className={styles.fieldLabel}>
                  Tahun Ajaran / Periode
                </label>
                <div className={styles.selectWrap}>
                  <Calendar size={18} className={styles.selectIcon} aria-hidden="true" />
                  <select
                    id="filter-periode"
                    className={styles.selectInput}
                    value={tahunAjaran}
                    onChange={(e) => setTahunAjaran(e.target.value)}
                    disabled={loading || tahunList.length === 0}
                  >
                    {tahunList.length === 0 ? (
                      <option value="">Memuat periode...</option>
                    ) : (
                      tahunList.map((period) => (
                        <option key={period} value={period}>
                          {period}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown size={18} className={styles.selectChevron} aria-hidden="true" />
                </div>
              </div>

              {/* Pencarian Instan Mata Pelajaran */}
              <div className={styles.fieldGroup}>
                <label htmlFor="filter-search" className={styles.fieldLabel}>
                  Cari Mata Pelajaran
                </label>
                <div className={styles.searchWrap}>
                  <Search size={18} className={styles.searchIcon} aria-hidden="true" />
                  <input
                    id="filter-search"
                    type="search"
                    className={styles.searchInput}
                    placeholder="Ketik nama mapel, mis. Matematika atau IPA..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    autoComplete="off"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      className={styles.clearBtn}
                      onClick={() => {
                        setSearchInput("");
                        setDebouncedSearch("");
                      }}
                      aria-label="Hapus kata kunci pencarian"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Kelas (1 tap di HP) + Toggle Hanya Tersedia */}
            <div className={styles.filterBottomRow}>
              <div className={styles.kelasTabs} role="group" aria-label="Pilih tingkat kelas">
                {KELAS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={kelas === opt.value}
                    className={`${styles.kelasTab} ${
                      kelas === opt.value ? styles.kelasTabActive : ""
                    }`}
                    onClick={() => setKelas(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                aria-pressed={onlyReady}
                className={`${styles.onlyReadyToggle} ${
                  onlyReady ? styles.onlyReadyToggleActive : ""
                }`}
                onClick={() => setOnlyReady((prev) => !prev)}
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                Hanya yang Tersedia
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DAFTAR KARTU KISI-KISI */}
      <section className={styles.contentSection} aria-labelledby="daftar-kisi-heading">
        <div className={styles.container}>
          <div className={styles.resultBar}>
            <div>
              <h2 id="daftar-kisi-heading" className={styles.resultTitle}>
                {tahunAjaran ? `Daftar Kisi-Kisi · ${tahunAjaran}` : "Daftar Kisi-Kisi"}
              </h2>
              {!loading && !error && (
                <p className={styles.resultCount}>
                  Menampilkan {filteredItems.length} mata pelajaran
                </p>
              )}
            </div>

            {hasActiveFilter && !loading && (
              <button
                type="button"
                className={styles.resetInlineBtn}
                onClick={handleResetFilters}
              >
                <RotateCcw size={15} aria-hidden="true" />
                Reset Filter
              </button>
            )}
          </div>

          {/* SKELETON LOADING */}
          {loading && (
            <div className={styles.cardGrid} aria-busy="true" aria-label="Memuat daftar kisi-kisi">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className={styles.skeletonCard} aria-hidden="true">
                  <div className={styles.skeletonRow}>
                    <div className={styles.skeletonBlock} style={{ width: 42, height: 42 }} />
                    <div className={styles.skeletonBlock} style={{ width: 78, height: 26 }} />
                  </div>
                  <div className={styles.skeletonBlock} style={{ width: "75%", height: 22 }} />
                  <div className={styles.skeletonBlock} style={{ width: "42%", height: 18 }} />
                  <div className={styles.skeletonRow}>
                    <div className={styles.skeletonBlock} style={{ flex: 1, height: 44 }} />
                    <div className={styles.skeletonBlock} style={{ width: 96, height: 44 }} />
                    <div className={styles.skeletonBlock} style={{ width: 44, height: 44 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {!loading && error && (
            <div className={styles.stateCard} role="alert">
              <div className={styles.stateIconWrap}>
                <AlertCircle size={26} aria-hidden="true" />
              </div>
              <h3 className={styles.stateTitle}>Gagal Memuat Kisi-Kisi</h3>
              <p className={styles.stateDesc}>{error}</p>
              <button type="button" className={styles.stateBtn} onClick={fetchKisiKisi}>
                <RotateCcw size={16} aria-hidden="true" />
                Coba Lagi
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className={styles.stateCard} role="status">
              <div className={styles.stateIconWrap}>
                <SearchX size={26} aria-hidden="true" />
              </div>
              <h3 className={styles.stateTitle}>Kisi-Kisi Tidak Ditemukan</h3>
              <p className={styles.stateDesc}>
                Tidak ada mata pelajaran yang cocok dengan filter atau kata kunci pencarian saat
                ini.
              </p>
              {hasActiveFilter && (
                <button type="button" className={styles.stateBtn} onClick={handleResetFilters}>
                  <RotateCcw size={16} aria-hidden="true" />
                  Reset Semua Filter
                </button>
              )}
            </div>
          )}

          {/* CARD GRID */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className={styles.cardGrid}>
              {filteredItems.map((item) => {
                const isReady = item.status === "tersedia";
                const isCopied = copiedId === item.id;
                const isExactSearchHighlight =
                  debouncedSearch.length > 0 &&
                  filteredItems.length <= 3 &&
                  item.mataPelajaran.toLowerCase() === debouncedSearch.toLowerCase();

                return (
                  <article
                    key={item.id}
                    className={`${styles.card} ${!isReady ? styles.cardPending : ""} ${
                      isExactSearchHighlight ? styles.cardHighlight : ""
                    }`}
                  >
                    <div>
                      <div className={styles.cardHeader}>
                        <div className={styles.subjectIconWrap}>
                          <SubjectIcon mapel={item.mataPelajaran} />
                        </div>
                        <span className={`${styles.kelasBadge} ${getKelasBadgeClass(item.kelas)}`}>
                          Kelas {item.kelas}
                        </span>
                      </div>

                      <div className={styles.cardBody} style={{ marginTop: "0.95rem" }}>
                        <h3 className={styles.cardTitle}>{item.mataPelajaran}</h3>

                        {isReady ? (
                          <div className={`${styles.statusRow} ${styles.statusReady}`}>
                            <span className={styles.dotWrap} aria-hidden="true">
                              <span className={styles.dotReady} />
                            </span>
                            <span>Tersedia</span>
                          </div>
                        ) : (
                          <div className={`${styles.statusRow} ${styles.statusPending}`}>
                            <span className={styles.dotWrap} aria-hidden="true">
                              <span className={styles.dotPendingPulse} />
                              <span className={styles.dotPending} />
                            </span>
                            <span>Segera Hadir</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardActions}>
                      {isReady ? (
                        <>
                          <a
                            href={item.linkUnduh}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnDownload}
                          >
                            <Download size={16} strokeWidth={2.2} aria-hidden="true" />
                            Unduh
                          </a>

                          <button
                            type="button"
                            className={styles.btnPreview}
                            onClick={() => openPreview(item)}
                            aria-label={`Pratinjau kisi-kisi ${item.mataPelajaran} Kelas ${item.kelas}`}
                          >
                            <Eye size={16} strokeWidth={2} aria-hidden="true" />
                            Lihat
                          </button>

                          <button
                            type="button"
                            className={`${styles.btnShare} ${
                              isCopied ? styles.btnShareCopied : ""
                            }`}
                            onClick={() => handleShare(item)}
                            aria-label={`Salin tautan kisi-kisi ${item.mataPelajaran} Kelas ${item.kelas}`}
                            title="Salin tautan untuk dibagikan"
                          >
                            {isCopied ? (
                              <Check size={17} strokeWidth={2.2} aria-hidden="true" />
                            ) : (
                              <Link2 size={17} strokeWidth={2} aria-hidden="true" />
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          className={styles.btnPending}
                        >
                          <Clock size={16} strokeWidth={2} aria-hidden="true" />
                          Menunggu Pengunggahan
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* PREVIEW MODAL */}
      {previewItem && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePreview();
          }}
          role="presentation"
        >
          <div
            ref={modalDialogRef}
            className={styles.modalDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="preview-modal-title"
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <span
                  className={`${styles.kelasBadge} ${getKelasBadgeClass(previewItem.kelas)}`}
                >
                  Kelas {previewItem.kelas}
                </span>
                <h2 id="preview-modal-title" className={styles.modalTitle}>
                  {previewItem.mataPelajaran}
                </h2>
              </div>

              <button
                ref={closeModalBtnRef}
                type="button"
                className={styles.modalCloseBtn}
                onClick={closePreview}
                aria-label="Tutup pratinjau dokumen"
              >
                <X size={20} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.modalBody}>
              {!iframeLoaded && (
                <div className={styles.modalLoading} aria-live="polite">
                  <div className={styles.spinner} aria-hidden="true" />
                  <span>Memuat pratinjau dokumen...</span>
                </div>
              )}

              <iframe
                src={previewItem.linkPreview}
                title={`Pratinjau Kisi-Kisi ${previewItem.mataPelajaran} Kelas ${previewItem.kelas}`}
                className={styles.modalIframe}
                allow="autoplay"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            <div className={styles.modalFooter}>
              <span className={styles.modalHint}>
                Jika pratinjau tidak muncul di browser HP, klik Unduh atau Buka di Tab Baru.
              </span>
              <div className={styles.modalFooterActions}>
                <a
                  href={previewItem.linkPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalOpenTabBtn}
                >
                  <ExternalLink size={16} aria-hidden="true" />
                  Buka Tab Baru
                </a>
                <a
                  href={previewItem.linkUnduh}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalDownloadBtn}
                >
                  <Download size={16} strokeWidth={2.2} aria-hidden="true" />
                  Unduh File
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SALIN TAUTAN */}
      {toastMessage && (
        <div className={styles.toast} role="status" aria-live="polite">
          <CheckCircle2 size={18} className={styles.toastIcon} aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <p>© {new Date().getFullYear()} SMP Negeri 5 Klaten · Portal Kisi-Kisi Ujian</p>
          <Link href="/" className={styles.footerBackLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali ke Beranda
          </Link>
        </div>
      </footer>
    </main>
  );
}
