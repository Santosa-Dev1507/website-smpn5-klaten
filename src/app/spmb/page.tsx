import type { Metadata } from "next";
import Image from "next/image";
import YoutubeEmbed from "@/components/YoutubeEmbed";

export const metadata: Metadata = {
  title: "SPMB 2025/2026 — SMPN 5 Klaten",
  description:
    "Informasi Penerimaan Murid Baru (SPMB) SMPN 5 Klaten Tahun Pelajaran 2025/2026. Lihat flyer, panduan, dan video tutorial pendaftaran.",
};

const TUTORIAL_VIDEO_ID = "96ErfkToIwQ";

export default function SpmbPage() {
  return (
    <main className="spmb-page">
      {/* ── Header ── */}
      <header className="spmb-hero">
        <div className="spmb-hero-inner">
          <span className="spmb-badge">Tahun Pelajaran 2025 / 2026</span>
          <h1 className="spmb-hero-title">
            Penerimaan Murid Baru
            <span className="spmb-hero-accent"> SMPN 5 Klaten</span>
          </h1>
          <p className="spmb-hero-sub">
            Selamat datang, calon siswa baru! Simak informasi lengkap dan video
            panduan pendaftaran di bawah ini.
          </p>
        </div>
      </header>

      <div className="spmb-content">
        {/* ── Flyer ── */}
        <section className="spmb-section" id="flyer">
          <h2 className="spmb-section-title">📋 Flyer SPMB</h2>
          <div className="spmb-flyer-wrapper">
            <Image
              src="/flyer-spmb.png"
              alt="Flyer SPMB SMPN 5 Klaten 2025/2026"
              width={800}
              height={1000}
              className="spmb-flyer-img"
              priority
            />
          </div>
        </section>

        {/* ── Video Tutorial ── */}
        <section className="spmb-section" id="tutorial">
          <h2 className="spmb-section-title">🎬 Video Tutorial Pendaftaran</h2>
          <p className="spmb-section-desc">
            Tonton video berikut untuk panduan lengkap cara mendaftar secara
            online. Ikuti setiap langkah dengan seksama agar proses pendaftaran
            berjalan lancar.
          </p>
          <YoutubeEmbed
            videoId={TUTORIAL_VIDEO_ID}
            title="Tutorial Pendaftaran SPMB SMPN 5 Klaten 2025/2026"
          />
        </section>

        {/* ── CTA ── */}
        <section className="spmb-cta-section">
          <a
            href="https://spmb.klatenkab.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="spmb-btn spmb-btn-primary"
            id="btn-daftar-online"
          >
            Daftar Online →
          </a>
          <a href="/" className="spmb-btn spmb-btn-secondary" id="btn-kembali">
            ← Kembali ke Beranda
          </a>
        </section>
      </div>
    </main>
  );
}
