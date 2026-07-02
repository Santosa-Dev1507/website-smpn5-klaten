"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import styles from "./hasil.module.css";
import { fetchCsvData } from "./actions";

// ─── DATA LIVES DARI GOOGLE SHEETS ───────────────────────────────────────────
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ7nE9KlBTfssUnafcO8lqZ7befp3YHQi3prkyOQHZpJI4Hx5iEEuJVlxoiUt81vdIk2Utdwoz9DHU/pub?output=csv";

// ─── PETUNJUK DAFTAR ULANG ─────────────────────────────────────────────────
const JADWAL_DAFTAR_ULANG = "Senin, 06 Juli 2026 (Offline pukul 07.30 WIB, & Online dibantu admin sekolah)";

const getDokumenDaftarUlang = (jalur: string) => {
  const baseDocs = [
    "Bukti Pendaftaran Online (ASLI)",
    "Fotokopi Kartu Keluarga (KK)",
    "Fotokopi Akta Kelahiran",
    "Formulir Isian Buku Induk (sudah ditempel pas foto 3x4 sebanyak 3 lembar)",
    "Sudah mengisi Formulir Dapodik (Pengecekan oleh admin)",
  ];

  if (jalur.toLowerCase().includes("prestasi")) {
    return [
      ...baseDocs,
      "Fotokopi Surat Keterangan SPMB, SHTKA, dan Surat Keterangan Lulus (SKL) / Ijazah SD",
      "Surat Keterangan Konversi Nilai Piagam dari Dinas Pendidikan (jika ada)",
      "Fotokopi Piagam (jika ada)"
    ];
  } else if (jalur.toLowerCase().includes("afirmasi")) {
    return [
      ...baseDocs,
      "Fotokopi Surat Keterangan SPMB dan Surat Keterangan Lulus (SKL) / Ijazah SD",
      "Fotokopi KIP / KKS",
      "Surat Pernyataan Kebenaran Dokumen Persyaratan SPMB Jalur Afirmasi (ASLI)"
    ];
  } else if (jalur.toLowerCase().includes("mutasi")) {
    return [
      ...baseDocs,
      "Fotokopi Surat Keterangan SPMB dan Surat Keterangan Lulus (SKL) / Ijazah SD",
      "Surat Keterangan Pindah Tugas dari instansi, Kepala Sekolah dan Rekomendasi Dinas Pendidikan (bagi anak guru)"
    ];
  } else {
    // Domisili
    return [
      ...baseDocs,
      "Fotokopi Surat Keterangan SPMB dan Surat Keterangan Lulus (SKL) / Ijazah SD",
    ];
  }
};

// ─── LINK (isi nanti) ──────────────────────────────────────────────────────
const PDF_DAFTAR_LENGKAP_URL = "https://bit.ly/DaftarUlangSPMBEspema";
const PDF_DAFTAR_ULANG_URL = "https://bit.ly/DaftarUlangSPMBEspema";

type Siswa = {
  nisn: string;
  nama: string;
  jalur: string;
  kelompok: string;
  ruang: string;
  status: string;
};
type SearchStatus = "idle" | "loading" | "found" | "not-found";

export default function HasilSpmbClient() {
  const [query, setQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("idle");
  const [result, setResult] = useState<Siswa | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearchStatus("loading");
    setResult(null);
    
    try {
      const res = await fetchCsvData(CSV_URL);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Gagal mengambil data dari server");
      }
      
      const csvText = res.data;
      // Gunakan regex untuk menangani \r\n maupun \n
      const rows = csvText.split(/\r?\n/).map(row => row.split(","));
      const q = query.trim().toLowerCase();
      
      const foundRow = rows.find((row, idx) => {
        if (idx === 0 || row.length < 4) return false; // Skip header
        const nisn = row[1]?.trim()?.toLowerCase() || "";
        const nama = row[2]?.trim()?.toLowerCase() || "";
        return nisn === q || nama.includes(q);
      });

      if (foundRow) {
        setResult({
          nisn: foundRow[1]?.trim() || "",
          nama: foundRow[2]?.trim() || "",
          jalur: foundRow[3]?.trim() || "Tidak diketahui",
          kelompok: foundRow[4]?.trim() || "-",
          ruang: foundRow[5]?.trim() || "-",
          status: "DITERIMA",
        });
        setSearchStatus("found");
      } else {
        setSearchStatus("not-found");
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setSearchStatus("not-found");
    }
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

          {/* ── Himbauan ── */}
          <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "1rem", marginBottom: "2rem", color: "#1E3A8A", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.2rem", lineHeight: "1", display: "flex", alignItems: "center" }} aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </span>
            <div>
              <strong style={{ display: "block", marginBottom: "4px" }}>Himbauan Panitia SPMB</strong>
              <span style={{ fontSize: "0.95rem" }}>
                Pengumuman hasil seleksi dapat diakses sepenuhnya melalui halaman ini. Bapak/Ibu orang tua serta calon peserta didik <strong>tidak perlu datang ke sekolah</strong> untuk melihat hasil pengumuman, guna menghindari kerumunan.
              </span>
            </div>
          </div>

          {/* ── Search Card ── */}
          <section className={styles.searchCard} id="cek-hasil">
            <h2 className={styles.sectionTitle}>Cek Status Penerimaan</h2>
            <label htmlFor="nisn-input" className={styles.sectionDesc}>
              Ketik NISN (10 digit) atau nama lengkap peserta, lalu klik <strong>Cek Kelulusan</strong>.
            </label>
            <div className={styles.inputRow}>
              <input
                id="nisn-input"
                type="text"
                inputMode="search"
                className={styles.input}
                placeholder="Contoh: 1234567890"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={searchStatus === "loading"}
                autoComplete="off"
                spellCheck="false"
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
                <div className={styles.resultIcon} aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#16a34a'}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
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
                {result.kelompok && result.kelompok !== "-" && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Kelompok Daftar Ulang</span>
                    <span className={styles.detailValue}>{result.kelompok}</span>
                  </div>
                )}
                {result.ruang && result.ruang !== "-" && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Ruang</span>
                    <span className={styles.detailValue}>{result.ruang}</span>
                  </div>
                )}
              </div>

              {/* Petunjuk Daftar Ulang */}
              <div className={styles.daftarUlang}>
                <h3 className={styles.daftarTitle}>Petunjuk Daftar Ulang</h3>
                
                <div className={styles.jadwalBox}>
                  <span className={styles.jadwalIcon} aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)'}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </span>
                  <div>
                    <div className={styles.jadwalLabel}>Jadwal Daftar Ulang</div>
                    <div className={styles.jadwalValue}>{JADWAL_DAFTAR_ULANG}</div>
                    <div style={{ fontSize: "0.85rem", marginTop: "4px", color: "var(--text-light)" }}>
                      *Siswa wajib hadir ke SMP N 5 Klaten bersama orang tua menggunakan seragam SD sesuai harinya.
                      <br/>
                      <strong style={{ color: "var(--primary-color)" }}>*Jika tidak bisa hadir ditunggu hingga Selasa, 07 Juli 2026 pukul 07.30 WIB</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.persiapanBox} style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "var(--bg-alt)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--primary-color)" }}>Persiapan Sebelum Hadir (Wajib):</h4>
                  <ol style={{ margin: "0", paddingLeft: "1.2rem", fontSize: "0.9rem", color: "var(--text-main)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <li>Mengisi data Dapodik di: <a href="https://forms.gle/p9ZbzTJ3dm1UmnKj8" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-color)", textDecoration: "underline", fontWeight: "bold" }}>Isian Dapodik</a></li>
                    <li>Mengunduh, mencetak & mengisi Formulir Buku Induk: <a href="https://drive.google.com/file/d/1Yv-XQGdrIFJPSHsgJZG6hwceY7jzWGMa/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary-color)", textDecoration: "underline", fontWeight: "bold" }}>Isian Buku Induk</a></li>
                  </ol>
                </div>

                <p className={styles.dokumenLabel} style={{ marginTop: "1.5rem" }}>
                  Dokumen yang harus dibawa (Jalur {result.jalur}):
                  <br/>
                  <span style={{ fontSize: "0.85rem", fontWeight: "normal", color: "var(--text-light)" }}>WAJIB menunjukkan Berkas ASLI saat daftar ulang.</span>
                </p>
                
                <ul className={styles.dokumenList}>
                  {getDokumenDaftarUlang(result.jalur).map((doc, i) => (
                    <li key={i} className={styles.dokumenItem}>
                      <span className={styles.dokumenCheck} aria-hidden="true">✓</span>
                      {doc}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "1rem", padding: "0.8rem", backgroundColor: "#FEF3C7", color: "#92400E", borderRadius: "6px", fontSize: "0.85rem", display: "flex", gap: "8px" }}>
                  <span aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                  </span>
                  <div>
                    <strong>Penting:</strong> Masukkan berkas ke dalam Map (<strong>Kuning</strong> untuk Laki-laki, <strong>Merah</strong> untuk Perempuan). Tempel Form A di bagian depan Map, dan berikan Form B terpisah kepada Panitia. Form bisa diperoleh dengan mengunduh panduan daftar ulang dibawah ini.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem", flexWrap: "wrap" }}>
                  <a
                    href={PDF_DAFTAR_ULANG_URL}
                    id="btn-download-panduan"
                    className={`${styles.btnPdf} ${styles.btnPdfOutline}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Unduh Panduan Daftar Ulang
                  </a>

                  <a
                    href="https://chat.whatsapp.com/KH5EB8afUjhFCCbYIPW66y?s=cl&p=a&mlu=2"
                    id="btn-join-wa"
                    className={styles.btnWa}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ margin: "0" }}
                  >
                    <span aria-hidden="true" style={{ fontSize: "1.2rem", display: "flex", alignItems: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    </span>
                    Gabung Grup WA Calon Siswa
                  </a>
                </div>

                {/* ── Placeholder Denah ── */}
                <div className={styles.denahPlaceholder}>
                  <span className={styles.denahIcon} aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)'}}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
                  </span>
                  <div className={styles.denahText}>
                    <strong>Denah Lokasi Daftar Ulang</strong>
                    <span>Buka dokumen untuk melihat detail ruangan</span>
                  </div>
                  <a 
                    href="/denah-daftar-ulang.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.btnDenah}
                  >
                    Lihat Denah Ruangan
                  </a>
                </div>
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
                <div className={styles.resultIcon} aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#dc2626'}}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                </div>
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
                <span className={styles.pdfIcon} aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary)'}}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </span>
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
