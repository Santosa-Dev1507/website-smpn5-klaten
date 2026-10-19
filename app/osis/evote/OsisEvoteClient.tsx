"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import styles from "./osis-evote.module.css";
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCw,
  Vote,
  ShieldCheck,
  ChevronRight,
  Home,
} from "lucide-react";

// URL deployment Firebase Hosting
const PRODUCTION_EVOTE_URL =
  process.env.NEXT_PUBLIC_EVOTE_URL ||
  "https://evote-osis-smpn5klaten.web.app/";

export default function OsisEvoteClient() {
  const [evoteUrl, setEvoteUrl] = useState(PRODUCTION_EVOTE_URL);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenExit, setShowFullscreenExit] = useState(true);
  const [iframeKey, setIframeKey] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Jika sedang dijalankan di localhost, otomatis gunakan server e-vote lokal port 5173
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      if (isLocal && !process.env.NEXT_PUBLIC_EVOTE_URL) {
        setEvoteUrl("http://localhost:5173");
      }
    }
  }, []);

  // Timer auto-hide tombol keluar layar penuh setelah 3.5 detik tidak ada aktivitas
  const resetHideTimer = () => {
    setShowFullscreenExit(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setShowFullscreenExit(false);
    }, 3500);
  };

  useEffect(() => {
    if (isFullscreen) {
      resetHideTimer();
      const onUserActivity = () => resetHideTimer();

      window.addEventListener("mousemove", onUserActivity, { passive: true });
      window.addEventListener("touchstart", onUserActivity, { passive: true });
      window.addEventListener("keydown", onUserActivity, { passive: true });

      return () => {
        window.removeEventListener("mousemove", onUserActivity);
        window.removeEventListener("touchstart", onUserActivity);
        window.removeEventListener("keydown", onUserActivity);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      };
    } else {
      setShowFullscreenExit(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [isFullscreen]);

  // Tangani tombol ESC untuk keluar dari fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className={styles.wrapper}>
      {!isFullscreen && <Header activePage="Ekskul" />}

      <main className={styles.main}>
        {/* Breadcrumb & Header Bar */}
        {!isFullscreen && (
          <div className={styles.headerSection}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/" className={styles.breadcrumbLink}>
                <Home size={14} className="inline mr-1 -mt-0.5" />
                Beranda
              </Link>
              <span className={styles.breadcrumbSep}>
                <ChevronRight size={14} />
              </span>
              <span className={styles.breadcrumbLink}>Ekskul</span>
              <span className={styles.breadcrumbSep}>
                <ChevronRight size={14} />
              </span>
              <span className={styles.breadcrumbCurrent}>E-Voting OSIS</span>
            </nav>

            <div className={styles.bannerCard}>
              <div className={styles.bannerInfo}>
                <div className={styles.bannerBadge}>
                  <span className={styles.badgePulse}></span>
                  Pemilihan Umum Calon Ketua OSIS 2026/2027
                </div>
                <h1>Bilik Suara Digital SMPN 5 Klaten</h1>
                <p>
                  Silakan masuk menggunakan 10 digit NISN (Siswa) atau Nomor Urut DPT (Guru/Karyawan) untuk memberikan hak suara Anda.
                </p>
              </div>

              <div className={styles.toolbarActions}>
                <button
                  type="button"
                  onClick={handleReload}
                  className={styles.btnAction}
                  title="Muat Ulang Bilik Suara"
                >
                  <RotateCw size={15} />
                  <span>Segarkan</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className={`${styles.btnAction} ${styles.btnPrimary}`}
                  title="Tampilkan Layar Penuh"
                >
                  <Maximize2 size={15} />
                  <span>Layar Penuh</span>
                </button>

                <a
                  href={evoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnAction}
                  title="Buka Aplikasi di Tab Baru"
                >
                  <ExternalLink size={15} />
                  <span>Buka Tab Baru</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Kontainer Iframe Responsif */}
        <div
          ref={containerRef}
          className={`${styles.iframeContainer} ${
            isFullscreen ? styles.iframeFullscreen : ""
          }`}
        >
          {isFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              onMouseEnter={() => {
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                setShowFullscreenExit(true);
              }}
              onMouseLeave={resetHideTimer}
              className={`${styles.fullscreenExitBar} ${
                showFullscreenExit
                  ? styles.fullscreenExitBarVisible
                  : styles.fullscreenExitBarHidden
              }`}
              title="Keluar dari Layar Penuh (Tekan ESC)"
            >
              <Minimize2 size={14} />
              <span>Keluar dari Layar Penuh (ESC)</span>
            </button>
          )}

          {isLoading && (
            <div className={styles.skeleton}>
              <div className={styles.spinner}></div>
              <p>Menghubungkan ke Server Bilik Suara Digital...</p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={evoteUrl}
            title="Bilik Suara E-Voting Calon Ketua OSIS SMP Negeri 5 Klaten"
            className={styles.iframe}
            onLoad={() => setIsLoading(false)}
            allow="clipboard-write"
          />
        </div>

        {/* Petunjuk Penggunaan & Keamanan */}
        {!isFullscreen && (
          <div className={styles.helpCard}>
            <div className="flex items-center gap-2 font-bold text-[#1e293b]">
              <ShieldCheck size={18} className="text-[#944535]" />
              <span>Jaminan Kerahasiaan & Keamanan Pemilihan</span>
            </div>
            <p>
              Sistem E-Voting terhubung langsung ke basis data terenkripsi. Hak suara yang telah digunakan tersimpan secara anonim dan tidak dapat diubah oleh pihak manapun.
            </p>
            <p className="text-[11px] text-[#64748b]">
              Kendala saat pemilihan? Hubungi Panitia Pemilihan OSIS atau Pembina OSIS SMP Negeri 5 Klaten.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
