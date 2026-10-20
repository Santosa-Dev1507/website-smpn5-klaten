"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import {
  daftarSiswaOsis,
  totalSiswa,
  totalCalonKetua,
  totalCalonPengurus,
  type SiswaOsis,
} from "./osis-pengumuman-data";
import styles from "./osis-pengumuman.module.css";
import {
  Users,
  Award,
  Vote,
  Search,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Home,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";

/**
 * Tautan grup WhatsApp Calon Pengurus OSIS.
 * Isi dengan link resmi saat sudah tersedia (contoh: "https://chat.whatsapp.com/XXXXXXX").
 */
export const WA_GROUP_URL: string = "";

type FilterTab = "ALL" | "KETUA" | "PENGURUS" | "VII" | "VIII";

export default function OsisPengumumanClient() {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Daftar calon ketua (6 siswa)
  const calonKetuaList = useMemo(
    () => daftarSiswaOsis.filter((s) => s.kategori === "Calon Ketua"),
    []
  );

  // Filter tabel berdasarkan tab dan pencarian
  const filteredList = useMemo(() => {
    return daftarSiswaOsis.filter((item) => {
      // Filter kategori / kelas
      if (activeTab === "KETUA" && item.kategori !== "Calon Ketua") return false;
      if (activeTab === "PENGURUS" && item.kategori !== "Calon Pengurus") return false;
      if (activeTab === "VII" && !item.kelas.startsWith("VII ")) return false;
      if (activeTab === "VIII" && !item.kelas.startsWith("VIII ")) return false;

      // Filter search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.nama.toLowerCase().includes(q) ||
          item.kelas.toLowerCase().includes(q) ||
          item.kategori.toLowerCase().includes(q) ||
          item.no.toString().includes(q)
        );
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className={styles.page}>
      <Header activePage="Pengumuman Seleksi OSIS" />

      {/* ── Hero Section ─────────────────────────────── */}
      <section className={styles.hero}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs text-white/80 mb-3">
            <Link href="/" className="hover:underline flex items-center gap-1">
              <Home size={13} />
              <span>Beranda</span>
            </Link>
            <ChevronRight size={13} />
            <Link href="/osis/daftar" className="hover:underline">
              OSIS
            </Link>
            <ChevronRight size={13} />
            <span className="text-amber-200 font-semibold">Pengumuman</span>
          </div>

          <span className={styles.heroEyebrow}>
            Hasil Seleksi OSIS Periode 2026/2027
          </span>

          <h1 className={styles.heroTitle}>
            Pengumuman Hasil Seleksi Calon Pengurus & Calon Ketua OSIS
          </h1>

          <p className={styles.heroSub}>
            Selamat kepada peserta didik yang dinyatakan lolos seleksi OSIS SMP Negeri 5 Klaten.
            Mari berkontribusi aktif mewujudkan Generasi JUARA yang amanah, kreatif, dan berintegritas.
          </p>
        </div>
      </section>

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{totalSiswa}</span>
          <span className={styles.statLabel}>Total Lolos</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{totalCalonKetua}</span>
          <span className={styles.statLabel}>Calon Ketua</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{totalCalonPengurus}</span>
          <span className={styles.statLabel}>Calon Pengurus</span>
        </div>
      </div>

      <div className={styles.section}>
        {/* ── WhatsApp Group Banner ───────────────────── */}
        <div className={styles.waBanner}>
          <div className={styles.waBannerIcon}>
            <MessageCircle size={28} />
          </div>
          <div className={styles.waBannerBody}>
            <h2 className={styles.waBannerTitle}>
              Grup WhatsApp Resmi Calon Pengurus OSIS
            </h2>
            <p className={styles.waBannerDesc}>
              Seluruh siswa yang terpilih wajib bergabung ke dalam grup koordinasi WhatsApp untuk menerima arahan teknis dan jadwal pembekalan pengurus.
            </p>
          </div>
          {WA_GROUP_URL ? (
            <a
              href={WA_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waBannerBtn}
            >
              <MessageCircle size={18} />
              <span>Gabung Grup WA</span>
              <ExternalLink size={14} />
            </a>
          ) : (
            <button
              type="button"
              className={styles.waBannerBtn}
              onClick={() => {
                alert(
                  "Tautan grup WhatsApp resmi calon pengurus OSIS akan segera dibagikan oleh Pembina OSIS. Silakan pantau berkala halaman ini."
                );
              }}
              title="Tautan akan aktif segera setelah dipublikasikan"
            >
              <MessageCircle size={18} />
              <span>Tautan Segera Dibagikan</span>
            </button>
          )}
        </div>

        {/* ── Section 1: Calon Ketua OSIS ─────────────── */}
        <div style={{ marginTop: "3.5rem" }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>
              <Award size={15} />
              <span>Tahap Pemilihan Ketua</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Kandidat Calon Ketua OSIS (6 Siswa)
            </h2>
            <p className="text-sm text-[#5a4a44] mt-1 max-w-2xl">
              Berikut 6 siswa terbaik yang lolos ke tahap Pemilihan Ketua OSIS secara langsung melalui bilik suara digital (E-Voting).
            </p>
            <div className={styles.sectionDivider} />
          </div>

          <div className={styles.ketuaGrid}>
            {calonKetuaList.map((kandidat) => (
              <div key={kandidat.no} className={styles.ketuaCard}>
                <div className="flex items-center justify-between">
                  <div className={styles.ketuaNomorBadge}>{kandidat.no}</div>
                  <span className={`${styles.badge} ${styles.badgeKetua}`}>
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
              </div>
            ))}
          </div>

          {/* Banner Menuju E-Voting */}
          <div className={styles.evoteBanner}>
            <div className={styles.evoteBannerBody}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-[#fde68a]" />
                <span className="text-xs uppercase font-bold tracking-wider text-[#fde68a]">
                  Bilik Suara Digital
                </span>
              </div>
              <h3 className={styles.evoteBannerTitle}>
                Portal E-Voting Pemilihan Ketua OSIS
              </h3>
              <p className={styles.evoteBannerDesc}>
                Gunakan hak suaramu secara Luber Jurdil (Langsung, Umum, Bebas, Rahasia, Jujur, dan Adil) melalui sistem pemungutan suara elektronik SMPN 5 Klaten.
              </p>
            </div>
            <Link href="/osis/evote" className={styles.evoteBannerBtn}>
              <Vote size={18} />
              <span>Masuk Bilik E-Voting</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* ── Section 2: Tabel Lengkap 35 Siswa ─────────── */}
        <div style={{ marginTop: "4rem" }}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>
              <Users size={15} />
              <span>Daftar Lengkap</span>
            </div>
            <h2 className={styles.sectionTitle}>
              Daftar 35 Siswa Terpilih Seleksi OSIS
            </h2>
            <div className={styles.sectionDivider} />
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
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

            <input
              type="text"
              placeholder="Cari nama atau kelas..."
              className={styles.searchBox}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabel */}
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>No</th>
                  <th>Nama Lengkap Siswa</th>
                  <th>Kelas</th>
                  <th style={{ width: "80px", textAlign: "center" }}>L / P</th>
                  <th>Kategori Lolos</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr className={styles.emptyRow}>
                    <td colSpan={5}>
                      Tidak ada data siswa yang cocok dengan filter atau kata kunci &quot;{searchQuery}&quot;.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((siswa) => (
                    <tr key={siswa.no}>
                      <td className={styles.tdNo}>{siswa.no}</td>
                      <td className={styles.tdNama}>
                        <div className="flex items-center gap-2">
                          <span>{siswa.nama}</span>
                          {siswa.kategori === "Calon Ketua" && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800"
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

          {/* Footer Note */}
          <div className="mt-4 flex items-start gap-2 text-xs text-[#5a4a44]">
            <Info size={16} className="text-[#944535] shrink-0 mt-0.5" />
            <p>
              Keputusan panitia seleksi bersifat final. Apabila terdapat kekeliruan penulisan nama atau identitas kelas, silakan konfirmasi langsung ke Pembina OSIS SMP Negeri 5 Klaten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
