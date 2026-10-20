"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import {
  daftarSiswaOsis,
  totalSiswa,
  totalCalonKetua,
  totalCalonPengurus,
  getInitials,
} from "./osis-pengumuman-data";
import styles from "./osis-pengumuman.module.css";
import {
  Users,
  Award,
  Search,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";

/**
 * Tautan resmi WhatsApp Group Calon Pengurus OSIS SMP Negeri 5 Klaten
 */
export const WA_GROUP_URL: string =
  "https://chat.whatsapp.com/GA2Hh4wgHMKK7xAntCdmiK?s=cl&p=a&mlu=4&ilr=4";

/** Logo Resmi WhatsApp (SVG Vector) */
function WhatsAppLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

type FilterTab = "ALL" | "KETUA" | "PENGURUS" | "VII" | "VIII";

export default function OsisPengumumanClient() {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Daftar 6 calon ketua (ditampilkan tanpa nomor urut surat suara)
  const calonKetuaList = useMemo(
    () => daftarSiswaOsis.filter((s) => s.kategori === "Calon Ketua"),
    []
  );

  // Filter daftar siswa berdasarkan tab kategori dan kata kunci pencarian
  const filteredList = useMemo(() => {
    return daftarSiswaOsis.filter((item) => {
      // Filter kategori / tingkatan kelas
      if (activeTab === "KETUA" && item.kategori !== "Calon Ketua") return false;
      if (activeTab === "PENGURUS" && item.kategori !== "Calon Pengurus") return false;
      if (activeTab === "VII" && !item.kelas.startsWith("VII ")) return false;
      if (activeTab === "VIII" && !item.kelas.startsWith("VIII ")) return false;

      // Filter teks pencarian (nama, kelas, kategori)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.nama.toLowerCase().includes(q) ||
          item.kelas.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className={styles.page}>
      <Header activePage="Pengumuman Seleksi OSIS" />

      {/* ── 1. Hero Section ──────────────────────────── */}
      <section className={styles.hero} aria-labelledby="pengumuman-heading">
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>
            Hasil Resmi Seleksi Pengurus OSIS Periode 2026/2027
          </span>

          <h1 id="pengumuman-heading" className={styles.heroTitle}>
            Selamat & Sukses kepada 35 Murid Terpilih OSIS SMPN 5 Klaten
          </h1>

          <p className={styles.heroSub}>
            Berdasarkan hasil seleksi wawancara dan administrasi, berikut 35 murid berprestasi
            yang siap mengemban amanah sebagai Calon Pengurus & Calon Ketua OSIS Generasi JUARA.
          </p>
        </div>
      </section>

      <main className={styles.section}>
        {/* ── 2. Section 1: Daftar Calon Ketua OSIS (6 Siswa) ── */}
        <section aria-labelledby="calon-ketua-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>
              <Award size={15} aria-hidden />
              <span>Tahap Pemilihan Ketua</span>
            </div>
            <h2 id="calon-ketua-heading" className={styles.sectionTitle}>
              Kandidat Calon Ketua OSIS
            </h2>
            <p className={styles.sectionDescription}>
              6 Peserta didik terbaik yang lolos ke tahap pemilihan ketua. Nomor urut surat suara
              dan penyampaian visi-misi akan ditetapkan secara resmi pada sesi pembekalan.
            </p>
            <div className={styles.sectionDivider} aria-hidden />
          </div>

          <div className={styles.ketuaGrid}>
            {calonKetuaList.map((kandidat, index) => (
              <article
                key={kandidat.nama}
                className={styles.ketuaCard}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={styles.ketuaHeader}>
                  {/* Avatar Inisial (menggantikan nomor urut yang belum ditentukan) */}
                  <div
                    className={styles.ketuaAvatar}
                    aria-label={`Inisial ${kandidat.nama}`}
                  >
                    {getInitials(kandidat.nama)}
                  </div>
                  <span className={`${styles.badge} ${styles.badgeKandidat}`}>
                    Calon Ketua
                  </span>
                </div>

                <div>
                  <h3 className={styles.ketuaNama}>{kandidat.nama}</h3>
                </div>

                <div className={styles.ketuaMeta}>
                  <span className={`${styles.badge} ${styles.badgeKelas}`}>
                    Kelas {kandidat.kelas}
                  </span>
                  <span className={`${styles.badge} ${styles.badgeGender}`}>
                    {kandidat.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 3. Section 2: Daftar Lengkap 35 Siswa Terpilih ── */}
        <section
          aria-labelledby="daftar-lengkap-heading"
          style={{ marginTop: "3.5rem" }}
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>
              <Users size={15} aria-hidden />
              <span>Daftar Lengkap</span>
            </div>
            <h2 id="daftar-lengkap-heading" className={styles.sectionTitle}>
              Daftar Lengkap Kelulusan Calon Pengurus OSIS
            </h2>
            <p className={styles.sectionDescription}>
              Gunakan kotak pencarian atau filter kelas di bawah untuk memeriksa status kelulusan calon pengurus OSIS.
            </p>
            <div className={styles.sectionDivider} aria-hidden />
          </div>

          {/* Filter Bar & Search */}
          <div className={styles.filterBar} role="toolbar" aria-label="Filter tabel peserta">
            <div className={styles.filterBtnGroup} role="group" aria-label="Filter kategori">
              <button
                type="button"
                className={`${styles.filterBtn} ${
                  activeTab === "ALL" ? styles.filterBtnActive : ""
                }`}
                onClick={() => setActiveTab("ALL")}
              >
                Semua ({totalSiswa})
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${
                  activeTab === "KETUA" ? styles.filterBtnActive : ""
                }`}
                onClick={() => setActiveTab("KETUA")}
              >
                Calon Ketua ({totalCalonKetua})
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${
                  activeTab === "PENGURUS" ? styles.filterBtnActive : ""
                }`}
                onClick={() => setActiveTab("PENGURUS")}
              >
                Calon Pengurus ({totalCalonPengurus})
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${
                  activeTab === "VII" ? styles.filterBtnActive : ""
                }`}
                onClick={() => setActiveTab("VII")}
              >
                Kelas VII
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${
                  activeTab === "VIII" ? styles.filterBtnActive : ""
                }`}
                onClick={() => setActiveTab("VIII")}
              >
                Kelas VIII
              </button>
            </div>

            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} aria-hidden />
              <input
                type="text"
                placeholder="Ketik nama murid atau kelas..."
                className={styles.searchBox}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Cari nama atau kelas murid"
              />
            </div>
          </div>

          {/* Accessible Table */}
          <div className={styles.tableWrapper} tabIndex={0} role="region" aria-label="Tabel daftar murid terpilih">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" style={{ width: "56px", textAlign: "center" }}>
                    No.
                  </th>
                  <th scope="col">Nama Lengkap Murid</th>
                  <th scope="col">Kelas</th>
                  <th scope="col" style={{ width: "70px", textAlign: "center" }}>
                    L/P
                  </th>
                  <th scope="col">Keterangan Lolos</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr className={styles.emptyRow}>
                    <td colSpan={5}>
                      Tidak ditemukan murid dengan kata kunci &quot;{searchQuery}&quot; pada kategori ini.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((siswa, idx) => (
                    <tr key={siswa.nama}>
                      <td className={styles.tdNo}>{idx + 1}</td>
                      <td className={styles.tdNama}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>{siswa.nama}</span>
                          {siswa.kategori === "Calon Ketua" && (
                            <span
                              className={`${styles.badge} ${styles.badgeKandidat}`}
                              title="Kandidat Calon Ketua OSIS"
                            >
                              Kandidat
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeKelas}`}>
                          {siswa.kelas}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`${styles.badge} ${styles.badgeGender}`}>
                          {siswa.jenisKelamin}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            siswa.kategori === "Calon Ketua"
                              ? styles.badgeKetua
                              : styles.badgePengurus
                          }`}
                        >
                          {siswa.kategori}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.tableNotice}>
            <Info size={16} className={styles.tableNoticeIcon} aria-hidden />
            <p style={{ margin: 0 }}>
              Penomoran pada tabel diurutkan berdasarkan jenjang kelas untuk keperluan administrasi, 
              <strong> bukan nomor urut surat suara</strong> Calon Ketua OSIS.
            </p>
          </div>
        </section>

        {/* ── 4. WhatsApp Group Invitation (Sleek Compact Bar) ─ */}
        <section className={styles.waSection} aria-labelledby="wa-heading">
          <div className={styles.waCard}>
            <div className={styles.waCardLeft}>
              <div className={styles.waIconCircle}>
                <WhatsAppLogo size={24} />
              </div>
              <div className={styles.waTextWrap}>
                <h3 id="wa-heading" className={styles.waTitle}>
                  Langkah Selanjutnya: Bergabung ke Grup Koordinasi
                </h3>
                <p className={styles.waDesc}>
                  Khusus bagi 35 murid yang dinyatakan lolos, silakan masuk ke WhatsApp Group resmi untuk menerima pengarahan jadwal pembekalan dan persiapan kepengurusan dari Pembina OSIS.
                </p>
              </div>
            </div>

            <div>
              <a
                href={WA_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waBtn}
              >
                <WhatsAppLogo size={18} />
                <span>Masuk Grup WhatsApp Resmi</span>
                <ExternalLink size={14} aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
