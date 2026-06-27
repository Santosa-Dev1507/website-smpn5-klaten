"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import styles from "./hasil.module.css";

// ─── PLACEHOLDER DATA (ganti dengan Google Sheets API nanti) ───────────────
const DUMMY_DATA = [
  { nisn: "1234567890", nama: "Ahmad Fauzi", jalur: "Zonasi", status: "DITERIMA" },
  { nisn: "0987654321", nama: "Budi Santoso", jalur: "Prestasi", status: "DITERIMA" },
  { nisn: "1122334455", nama: "Citra Dewi", jalur: "Afirmasi", status: "DITERIMA" },
  { nisn: "5544332211", nama: "Dian Rahayu", jalur: "Mutasi", status: "DITERIMA" },
  { nisn: "6677889900", nama: "Eko Prasetyo", jalur: "Zonasi", status: "DITERIMA" },
];

// ─── PETUNJUK DAFTAR ULANG ─────────────────────────────────────────────────
const JADWAL_DAFTAR_ULANG = "30 Juni – 2 Juli 2026, pukul 08.00–14.00 WIB";
const DOKUMEN_DAFTAR_ULANG = [
  "Kartu peserta SPMB (asli)",
  "Ijazah / Surat Keterangan Lulus SD/MI (asli + fotokopi 2 lembar)",
  "Akta kelahiran (fotokopi 2 lembar)",
  "Kartu Keluarga (fotokopi 2 lembar)",
  "Pas foto 3×4 berwarna sebanyak 4 lembar",
  "Formulir daftar ulang yang telah diisi (ambil di sekolah)",
];

// ─── LINK (isi nanti) ──────────────────────────────────────────────────────
const PDF_DAFTAR_LENGKAP_URL = "#";
const PDF_DAFTAR_ULANG_URL = "#";

type Siswa = { nisn: string; nama: string; jalur: string; status: string };
type SearchStatus = "idle" | "loading" | "found" | "not-found";

export default function HasilSpmbClient() {
  const [query, setQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [result, setResult] = useState<Siswa | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchStatus("loading");
    setResult(null);
    // Simulasi delay (nanti diganti fetch ke Google Sheets)
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const found = DUMMY_DATA.find(
        (s) => s.nisn === q || s.nama.toLowerCase().includes(q)
      );
      if (found) { setResult(found); setSearchStatus("found"); }
      else { setSearchStatus("not-found"); }
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleReset = () => {
    setQuery(""); setSearchStatus("idle"); setResult(null);
  };

  return (
    <>
      <Header />
      <main className={styles.page}>

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.badge}>Tahun Pelajaran 2026 / 2027</span>
            <h1 className={styles.heroTitle}>
              Pengumuman Hasil Seleksi
              <span className={styles.heroAccent}> SPMB SMPN 5 Klaten</span>
            </h1>
            <p className={styles.heroSub}>
              Masukkan NISN atau nama lengkap untuk mengetahui status penerimaan Anda.
            </p>
          </div>
        </section>

        <div className={styles.content}>

          {/* ── Search Card ── */}
          <section className={styles.searchCard} id="cek-hasil">
            <h2 className={styles.sectionTitle}>Cek Status Penerimaan</h2>
            <p className={styles.sectionDesc}>
              Ketik NISN (10 digit) atau nama lengkap peserta, lalu klik{" "}
              <strong>Cek Kelulusan</strong>.
            </p>
            <div className={styles.inputRow}>
              <input
                id="input-nisn-nama"
                type="text"
                className={styles.input}
                placeholder="Contoh: 1234567890 atau Ahmad Fauzi"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={searchStatus === "loading"}
                aria-label="Masukkan NISN atau nama lengkap"
              />
              <button
                id="btn-cek-kelulusan"
                className={`${styles.btnCek}${!query.trim() || searchStatus === "loading" ? " " + styles.btnDisabled : ""}`}
                onClick={handleSearch}
                disabled={!query.trim() || searchStatus === "loading"}
              >
                {searchStatus === "loading"
                  ? <span className={styles.spinner} aria-hidden="true" />
                  : "Cek Kelulusan"}
              </button>
            </div>
          </section>

          {/* ── Hasil DITERIMA ── */}
          {searchStatus === "found" && result && (
            <section className={`${styles.resultCard} ${styles.resultDiterima}`} id="result-diterima" aria-live="polite">
              <div className={styles.resultHeader}>
                <div className={styles.resultIcon} aria-hidden="true">✅</div>
                <div>
                  <div className={styles.resultStatus}>DITERIMA</div>
                  <div className={styles.resultName}>{result.nama}</div>
                </div>
              </div>
              <div className={styles.resultDetail}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>NISN</span>
                  <span className={styles.detailValue}>{result.nisn}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Jalur Seleksi</span>
                  <span className={styles.detailValue}>{result.jalur}</span>
                </div>
              </div>

              {/* Petunjuk Daftar Ulang */}
              <div className={styles.daftarUlang}>
                <h3 className={styles.daftarTitle}>Petunjuk Daftar Ulang</h3>
                <div className={styles.jadwalBox}>
                  <span className={styles.jadwalIcon} aria-hidden="true">📅</span>
                  <div>
                    <div className={styles.jadwalLabel}>Jadwal Daftar Ulang</div>
                    <div className={styles.jadwalValue}>{JADWAL_DAFTAR_ULANG}</div>
                  </div>
                </div>
                <p className={styles.dokumenLabel}>Dokumen yang harus dibawa:</p>
                <ul className={styles.dokumenList}>
                  {DOKUMEN_DAFTAR_ULANG.map((doc, i) => (
                    <li key={i} className={styles.dokumenItem}>
                      <span className={styles.dokumenCheck} aria-hidden="true">✓</span>
                      {doc}
                    </li>
                  ))}
                </ul>
                <a
                  href={PDF_DAFTAR_ULANG_URL}
                  id="btn-download-panduan"
                  className={`${styles.btnPdf} ${styles.btnPdfOutline}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Unduh Panduan Daftar Ulang
                </a>
              </div>

              <button id="btn-cek-lagi" className={styles.btnReset} onClick={handleReset}>
                ← Cek Peserta Lain
              </button>
            </section>
          )}

          {/* ── Tidak Ditemukan ── */}
          {searchStatus === "not-found" && (
            <section className={`${styles.resultCard} ${styles.resultTidak}`} id="result-tidak-ditemukan" aria-live="polite">
              <div className={styles.resultHeader}>
                <div className={styles.resultIcon} aria-hidden="true">❌</div>
                <div>
                  <div className={`${styles.resultStatus} ${styles.statusTidak}`}>TIDAK DITEMUKAN</div>
                  <div className={styles.resultName}>{query}</div>
                </div>
              </div>
              <p className={styles.notFoundDesc}>
                Data tidak ditemukan dalam sistem kami. Pastikan NISN atau nama yang dimasukkan sudah benar.
                Jika masih mengalami kendala, silakan hubungi langsung pihak sekolah.
              </p>
              <p className={styles.notFoundKontak}>
                📞 Hubungi sekolah atau kunjungi langsung SMPN 5 Klaten untuk konfirmasi.
              </p>
              <button id="btn-cek-lagi-tidak" className={styles.btnReset} onClick={handleReset}>
                ← Cek Ulang
              </button>
            </section>
          )}

          {/* ── Divider + PDF Lengkap ── */}
          <div className={styles.dividerSection}>
            <div className={styles.divider}>
              <span className={styles.dividerText}>atau</span>
            </div>
            <div className={styles.pdfBox}>
              <div className={styles.pdfInfo}>
                <span className={styles.pdfIcon} aria-hidden="true">📄</span>
                <div>
                  <div className={styles.pdfTitle}>Daftar Lengkap Peserta Diterima</div>
                  <div className={styles.pdfDesc}>
                    Lihat seluruh daftar nama peserta yang dinyatakan diterima dalam format PDF.
                  </div>
                </div>
              </div>
              <a
                href={PDF_DAFTAR_LENGKAP_URL}
                id="btn-lihat-pdf-lengkap"
                className={styles.btnPdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat PDF Lengkap →
              </a>
            </div>
          </div>

          {/* ── Navigasi ── */}
          <div className={styles.navButtons}>
            <Link href="/spmb" className={styles.btnNav} id="btn-kembali-spmb">
              ← Info SPMB
            </Link>
            <Link href="/" className={styles.btnNav} id="btn-kembali-beranda">
              ← Beranda
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
