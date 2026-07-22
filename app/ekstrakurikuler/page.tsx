"use client";

import { useState } from "react";
import Header from "../components/Header";
import ScrollReveal from "../components/ScrollReveal";
import styles from "./ekstrakurikuler.module.css";
import {
  Trophy, Users, Star, MapPin, Clock, ChevronRight,
  Dumbbell, Palette, FlaskConical, Heart, BookOpen,
  Music, Swords, Target, Globe, Microscope, Calculator,
} from "lucide-react";

const ekskulData = [
  {
    nama: "Pramuka",
    kategori: "Kepanduan",
    icon: Target,
    desc: "Membentuk karakter mandiri, tangguh, dan berjiwa kepemimpinan melalui kegiatan kepramukaan.",
    jadwal: "Sabtu",
    waktu: "07:00–09:00",
    lokasi: "Lapangan Sekolah",
    pembina: "Sindi Anggono, S.S.",
    warna: "#2d6a4f",
  },
  {
    nama: "PMR / UKS",
    kategori: "Sosial",
    icon: Heart,
    desc: "Melatih keterampilan pertolongan pertama dan menumbuhkan kepedulian sosial (Palang Merah Remaja).",
    jadwal: "Kamis",
    waktu: "15:00–16:30",
    lokasi: "Ruang PMR",
    pembina: "Annisa Nabilla Awalim, S.Pd.",
    warna: "#c0392b",
  },
  {
    nama: "PBB / Tata Upacara",
    kategori: "Kedisiplinan",
    icon: Users,
    desc: "Melatih kedisiplinan, ketertiban, dan jiwa korsa melalui baris-berbaris dan tata upacara.",
    jadwal: "Jumat",
    waktu: "15:00–16:30",
    lokasi: "Lapangan Upacara",
    pembina: "Muhammad Thoyibun Nomi, S.Or",
    warna: "#1a237e",
  },
  {
    nama: "BTQ",
    kategori: "Keagamaan",
    icon: BookOpen,
    desc: "Membangun kemampuan membaca Al-Qur'an dengan tartil dan benar (Tuntas Baca Al-Qur'an).",
    jadwal: "Rabu",
    waktu: "15:00–16:00",
    lokasi: "Masjid Sekolah",
    pembina: "Budi Santosa, S.Pd.I",
    warna: "#5c3317",
  },
  {
    nama: "OSN Matematika",
    kategori: "Akademik",
    icon: Calculator,
    desc: "Persiapan olimpiade sains nasional bidang matematika untuk siswa berprestasi.",
    jadwal: "Selasa",
    waktu: "14:30–16:00",
    lokasi: "Ruang Kelas",
    pembina: "Dewi Imawati, S.Pd.",
    warna: "#00429c",
  },
  {
    nama: "OSN IPS",
    kategori: "Akademik",
    icon: Globe,
    desc: "Persiapan olimpiade sains nasional bidang Ilmu Pengetahuan Sosial.",
    jadwal: "Senin",
    waktu: "14:30–16:00",
    lokasi: "Ruang Kelas",
    pembina: "Rizka Fitri Prasetyaningsah, S.Pd.",
    warna: "#00429c",
  },
  {
    nama: "OSN IPA",
    kategori: "Akademik",
    icon: Microscope,
    desc: "Persiapan olimpiade sains nasional bidang Ilmu Pengetahuan Alam.",
    jadwal: "Kamis",
    waktu: "14:30–16:00",
    lokasi: "Laboratorium IPA",
    pembina: "Nurma Kartikasari, S.Pd.",
    warna: "#00429c",
  },
  {
    nama: "Seni Tari",
    kategori: "Seni",
    icon: Music,
    desc: "Mengembangkan bakat seni dan kecintaan terhadap budaya Indonesia melalui tari tradisional.",
    jadwal: "Rabu",
    waktu: "14:00–15:30",
    lokasi: "Aula Sekolah",
    pembina: "Dini Wahyu Susanti, S.Sn.",
    warna: "#7b2d8b",
  },
  {
    nama: "Paduan Suara",
    kategori: "Seni",
    icon: Music,
    desc: "Mengembangkan teknik vokal harmonis untuk kompetisi dan penampilan sekolah.",
    jadwal: "Jumat",
    waktu: "14:00–15:30",
    lokasi: "Aula Sekolah",
    pembina: "Fatina Lestiyningsih, S.Pd.",
    warna: "#7b2d8b",
  },
  {
    nama: "Futsal",
    kategori: "Olahraga",
    icon: Dumbbell,
    desc: "Melatih teknik dan strategi futsal serta mempersiapkan tim untuk kompetisi antar sekolah.",
    jadwal: "Selasa & Kamis",
    waktu: "15:30–17:00",
    lokasi: "Lapangan Futsal",
    pembina: "Taufik Dian Pramudita, S.Pd.",
    warna: "#006b5f",
  },
  {
    nama: "Jiu Jitsu",
    kategori: "Olahraga",
    icon: Swords,
    desc: "Olahraga bela diri yang melatih disiplin, ketangkasan, kepercayaan diri, dan mental juara.",
    jadwal: "Sabtu",
    waktu: "08:00–10:00",
    lokasi: "Lapangan Sekolah",
    pembina: "Evi Julianah, S.Pd.",
    warna: "#006b5f",
  },
];

type FilterKey = "Semua" | "Olahraga" | "Seni" | "Akademik" | "Lainnya";

const filters: { label: FilterKey; Icon: typeof Trophy; kategoriList: string[] | null }[] = [
  { label: "Semua",     Icon: Trophy,       kategoriList: null },
  { label: "Olahraga", Icon: Dumbbell,      kategoriList: ["Olahraga"] },
  { label: "Seni",     Icon: Palette,       kategoriList: ["Seni"] },
  { label: "Akademik", Icon: FlaskConical,  kategoriList: ["Akademik"] },
  { label: "Lainnya",  Icon: Heart,         kategoriList: ["Sosial", "Kepanduan", "Kedisiplinan", "Keagamaan"] },
];

export default function EkstrakulikulerPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("Semua");

  const activeKategoriList = filters.find((f) => f.label === activeFilter)?.kategoriList;
  const filteredEkskul = activeKategoriList
    ? ekskulData.filter((e) => activeKategoriList.includes(e.kategori))
    : ekskulData;

  return (
    <main>
      <ScrollReveal />
      <Header activePage="Ekskul" />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge} aria-label="Jumlah ekskul tersedia">
              <Trophy size={13} aria-hidden />
              11 Ekstrakurikuler Aktif
            </div>
            <h1 className={styles.heroTitle}>
              Kembangkan Bakat &amp;{" "}
              <span className={styles.heroTitleAccent}>Prestasi</span>mu
            </h1>
            <p className={styles.heroDesc}>
              SMPN 5 Klaten menghadirkan kegiatan ekstrakurikuler unggulan untuk mengasah
              potensi, membangun karakter, dan mencetak prestasi siswa di berbagai bidang.
            </p>
            <div className={styles.heroActions}>
              <a
                href="/ekstrakurikuler/daftar"
                className={styles.btnPrimary}
                id="btn-daftar-ekskul"
              >
                Daftar Ekskul
                <ChevronRight size={18} aria-hidden />
              </a>
              <a
                href="/ekstrakurikuler/siswa"
                className={styles.btnSecondary}
                id="btn-dashboard-siswa"
              >
                Dashboard Siswa
              </a>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden>
            <div className={styles.heroOrb} />
            <div className={styles.heroStats}>
              {[
                { num: "11", label: "Ekskul" },
                { num: "500+", label: "Siswa" },
                { num: "25+", label: "Prestasi" },
              ].map((s) => (
                <div key={s.label} className={styles.heroStatPill}>
                  <span className={styles.heroStatNum}>{s.num}</span>
                  <span className={styles.heroStatLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className={styles.filterSection}>
        <div className={styles.filterBar} role="tablist" aria-label="Filter kategori ekskul">
          {filters.map(({ label, Icon }) => (
            <button
              key={label}
              role="tab"
              aria-selected={activeFilter === label}
              className={`${styles.filterChip} ${activeFilter === label ? styles.filterChipActive : ""}`}
              onClick={() => setActiveFilter(label)}
            >
              <Icon size={14} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Daftar Ekskul ── */}
      <section className={styles.section} aria-label="Daftar ekstrakurikuler">
        <div className={styles.ekskulGrid}>
          {filteredEkskul.map((ekskul) => {
            const IconComp = ekskul.icon;
            return (
              <article
                key={ekskul.nama}
                className={`${styles.ekskulCard} reveal`}
                id={`ekskul-${ekskul.nama.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className={styles.ekskulCardHeader}
                  style={{ "--card-color": ekskul.warna } as React.CSSProperties}
                >
                  <div className={styles.ekskulIconWrap}>
                    <IconComp size={28} aria-hidden />
                  </div>
                  <span className={styles.ekskulCategory}>{ekskul.kategori}</span>
                </div>
                <div className={styles.ekskulBody}>
                  <h2 className={styles.ekskulName}>{ekskul.nama}</h2>
                  <p className={styles.ekskulDesc}>{ekskul.desc}</p>
                  <div className={styles.ekskulMeta}>
                    <div className={styles.ekskulMetaItem}>
                      <Clock size={13} aria-hidden />
                      <span>{ekskul.jadwal}, {ekskul.waktu}</span>
                    </div>
                    <div className={styles.ekskulMetaItem}>
                      <MapPin size={13} aria-hidden />
                      <span>{ekskul.lokasi}</span>
                    </div>
                    <div className={styles.ekskulMetaItem}>
                      <Users size={13} aria-hidden />
                      <span>{ekskul.pembina}</span>
                    </div>
                  </div>
                  <a
                    href="/ekstrakurikuler/daftar"
                    className={styles.ekskulBtn}
                    aria-label={`Daftar ekskul ${ekskul.nama}`}
                  >
                    Daftar Sekarang
                    <ChevronRight size={15} aria-hidden />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaBanner} aria-labelledby="cta-heading">
        <div className={styles.ctaInner}>
          <Trophy size={40} className={styles.ctaIcon} aria-hidden />
          <h2 id="cta-heading" className={styles.ctaTitle}>Siap Bergabung?</h2>
          <p className={styles.ctaDesc}>
            Daftarkan diri sekarang dan mulai perjalananmu bersama ekskul SMPN 5 Klaten.
          </p>
          <a href="/ekstrakurikuler/daftar" className={styles.ctaBtnPrimary} id="btn-daftar-ekskul-cta">
            Daftar Sekarang
            <ChevronRight size={18} aria-hidden />
          </a>
          <div className={styles.ctaLinks}>
            <a href="/ekstrakurikuler/siswa" className={styles.ctaLink} id="btn-siswa-cta">Dashboard Siswa</a>
            <span className={styles.ctaSep} aria-hidden>·</span>
            <a href="/ekstrakurikuler/pembina" className={styles.ctaLink} id="btn-pembina-cta">Login Pembina</a>
            <span className={styles.ctaSep} aria-hidden>·</span>
            <a href="/ekstrakurikuler/walikelas" className={styles.ctaLink} id="btn-walikelas-cta">Wali Kelas</a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} SMPN 5 Klaten — Sistem Manajemen Ekstrakurikuler</p>
        <a href="/ekstrakurikuler/admin" className={styles.footerAdminLink} id="btn-admin-footer">
          Admin
        </a>
      </footer>
    </main>
  );
}
