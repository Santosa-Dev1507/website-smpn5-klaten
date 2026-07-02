import type { Metadata } from "next";
import Header from "../components/Header";
import ScrollReveal from "../components/ScrollReveal";
import styles from "./ekstrakurikuler.module.css";

export const metadata: Metadata = {
  title: "Ekstrakurikuler — SMPN 5 Klaten",
  description:
    "Temukan dan daftarkan diri ke kegiatan ekstrakurikuler SMPN 5 Klaten. 11 ekskul pilihan untuk mengembangkan bakat, karakter, dan prestasi siswa.",
  alternates: { canonical: "/ekstrakurikuler" },
  openGraph: {
    title: "Ekstrakurikuler SMPN 5 Klaten",
    description: "11 ekskul pilihan untuk mengembangkan bakat dan prestasi siswa SMPN 5 Klaten.",
    url: "https://www.smpn5klaten.sch.id/ekstrakurikuler",
  },
};

const ekskulData = [
  {
    nama: "Pramuka",
    kategori: "Kepanduan",
    emoji: "⚜️",
    desc: "Membentuk karakter mandiri, tangguh, dan berjiwa kepemimpinan melalui kegiatan kepramukaan.",
    jadwal: "Sabtu",
    waktu: "07:00–09:00",
    lokasi: "Lapangan Sekolah",
    pembina: "Sindi Anggono, S.S. & Tim",
  },
  {
    nama: "PMR / UKS",
    kategori: "Sosial",
    emoji: "🏥",
    desc: "Melatih keterampilan pertolongan pertama dan menumbuhkan kepedulian sosial (Palang Merah Remaja).",
    jadwal: "Kamis",
    waktu: "15:00–16:30",
    lokasi: "Ruang PMR",
    pembina: "Annisa Nabilla Awalim, S.Pd.",
  },
  {
    nama: "PBB / Tata Upacara",
    kategori: "Kedisiplinan",
    emoji: "🎖️",
    desc: "Melatih kedisiplinan, ketertiban, dan jiwa korsa melalui baris-berbaris dan tata upacara.",
    jadwal: "Jumat",
    waktu: "15:00–16:30",
    lokasi: "Lapangan Upacara",
    pembina: "Muhammad Thoyibun Nomi, S.Or",
  },
  {
    nama: "BTQ",
    kategori: "Keagamaan",
    emoji: "📖",
    desc: "Membangun kemampuan membaca Al-Qur'an dengan tartil dan benar (Tuntas Baca Al-Qur'an).",
    jadwal: "Rabu",
    waktu: "15:00–16:00",
    lokasi: "Masjid Sekolah",
    pembina: "Budi Santosa, S.Pd.I",
  },
  {
    nama: "OSN Matematika",
    kategori: "Akademik",
    emoji: "📐",
    desc: "Persiapan olimpiade sains nasional bidang matematika untuk siswa berprestasi.",
    jadwal: "Selasa",
    waktu: "14:30–16:00",
    lokasi: "Ruang Kelas",
    pembina: "Dewi Imawati, S.Pd.",
  },
  {
    nama: "OSN IPS",
    kategori: "Akademik",
    emoji: "🌍",
    desc: "Persiapan olimpiade sains nasional bidang Ilmu Pengetahuan Sosial.",
    jadwal: "Senin",
    waktu: "14:30–16:00",
    lokasi: "Ruang Kelas",
    pembina: "Rizka Fitri Prasetyaningsah, S.Pd.",
  },
  {
    nama: "OSN IPA",
    kategori: "Akademik",
    emoji: "🔬",
    desc: "Persiapan olimpiade sains nasional bidang Ilmu Pengetahuan Alam.",
    jadwal: "Kamis",
    waktu: "14:30–16:00",
    lokasi: "Laboratorium IPA",
    pembina: "Nurma Kartikasari, S.Pd.",
  },
  {
    nama: "Seni Tari",
    kategori: "Seni",
    emoji: "💃",
    desc: "Mengembangkan bakat seni dan kecintaan terhadap budaya Indonesia melalui tari tradisional.",
    jadwal: "Rabu",
    waktu: "14:00–15:30",
    lokasi: "Aula Sekolah",
    pembina: "Dini Wahyu Susanti, S.Sn.",
  },
  {
    nama: "Paduan Suara",
    kategori: "Seni",
    emoji: "🎵",
    desc: "Mengembangkan teknik vokal harmonis untuk kompetisi dan penampilan sekolah.",
    jadwal: "Jumat",
    waktu: "14:00–15:30",
    lokasi: "Aula Sekolah",
    pembina: "Fatina Lestiyningsih, S.Pd.",
  },
  {
    nama: "Futsal",
    kategori: "Olahraga",
    emoji: "⚽",
    desc: "Melatih teknik dan strategi futsal serta mempersiapkan tim untuk kompetisi antar sekolah.",
    jadwal: "Selasa & Kamis",
    waktu: "15:30–17:00",
    lokasi: "Lapangan Futsal",
    pembina: "Taufik Dian Pramudita, S.Pd.",
  },
  {
    nama: "Jiu Jitsu",
    kategori: "Olahraga",
    emoji: "🥋",
    desc: "Olahraga bela diri yang melatih disiplin, ketangkasan, kepercayaan diri, dan mental juara.",
    jadwal: "Sabtu",
    waktu: "08:00–10:00",
    lokasi: "Lapangan Sekolah",
    pembina: "Evi Julianah, S.Pd.",
  },
];

const kategoriColor: Record<string, string> = {
  Kepanduan: "#006b5f", /* secondary */
  Sosial: "#ba1a1a", /* error */
  Kedisiplinan: "#1a237e", /* primary-container */
  Keagamaan: "#6b95f3", /* tertiary-container */
  Akademik: "#00429c", /* tertiary-fixed-variant */
  Seni: "#007165", /* secondary-container text */
  Olahraga: "#005048", /* secondary-fixed-variant text */
};

export default function EkstrakulikulerPage() {
  return (
    <main>
      <ScrollReveal />
      <Header activePage="Ekskul" />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <span className={styles.heroBadge}>🏫 ESPEMA — Generasi JUARA</span>
        <h1 className={styles.heroTitle}>
          Kembangkan Bakat &amp; <span>Prestasi</span>mu
        </h1>
        <p className={styles.heroDesc}>
          SMPN 5 Klaten menghadirkan <strong>11 kegiatan ekstrakurikuler</strong> untuk
          mengasah potensi, membangun karakter, dan mencetak prestasi siswa di berbagai bidang.
        </p>
        <div className={styles.heroActions}>
          <a href="/ekstrakurikuler/daftar" className={styles.btnPrimary} id="btn-daftar-ekskul">
            ✏️ Daftar Ekskul
          </a>
          <a href="/ekstrakurikuler/pembina" className={styles.btnSecondary} id="btn-area-pembina">
            👤 Area Pembina
          </a>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className={styles.statsBar}>
        {[
          { num: "11", label: "Ekstrakurikuler" },
          { num: "12", label: "Pembina Aktif" },
          { num: "500+", label: "Siswa Terdaftar" },
          { num: "25+", label: "Prestasi Diraih" },
        ].map((s) => (
          <div key={s.label} className={styles.statItem}>
            <span className={styles.statNum}>{s.num}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Filter Bar ── */}
      <div className={styles.filterBar}>
        <button className={`${styles.filterChip} ${styles.filterChipActive}`}>Semua</button>
        <button className={styles.filterChip}>⚽ Olahraga</button>
        <button className={styles.filterChip}>🎨 Seni</button>
        <button className={styles.filterChip}>🔬 Sains & Akademik</button>
        <button className={styles.filterChip}>🤝 Sosial & Kepanduan</button>
      </div>

      {/* ── Daftar Ekskul ── */}
      <section className={styles.section}>
        <div className={styles.ekskulGrid}>
          {ekskulData.map((ekskul) => (
            <div key={ekskul.nama} className={`${styles.ekskulCard} reveal`} id={`ekskul-${ekskul.nama.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className={styles.ekskulImgPlaceholder} aria-hidden>
                  <span className={styles.ekskulCategory} style={{ color: kategoriColor[ekskul.kategori], background: `${kategoriColor[ekskul.kategori]}20` }}>
                    {ekskul.kategori}
                  </span>
                  {ekskul.emoji}
                </div>
                <div className={styles.ekskulBody} style={{ borderLeftColor: kategoriColor[ekskul.kategori] }}>
                  <div className={styles.ekskulHeader}>
                    <h3 className={styles.ekskulName}>{ekskul.nama}</h3>
                    <div className={styles.ekskulRating}>
                      <span>⭐</span> 4.9
                    </div>
                  </div>
                  <p className={styles.ekskulDesc}>{ekskul.desc}</p>
                  <div className={styles.ekskulMeta}>
                    <div className={styles.ekskulMetaItem}>
                      <span>📅</span>
                      <span>{ekskul.jadwal}, {ekskul.waktu}</span>
                    </div>
                    <div className={styles.ekskulMetaItem}>
                      <span>📍</span>
                      <span>{ekskul.lokasi}</span>
                    </div>
                  </div>
                  <a href="/ekstrakurikuler/daftar" className={styles.ekskulBtn}>
                    Daftar Sekarang
                  </a>
                </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaBanner}>
        <h2 className={styles.ctaTitle}>Siap Bergabung?</h2>
        <p className={styles.ctaDesc}>
          Daftarkan diri sekarang dan mulai perjalananmu bersama ekskul SMPN 5 Klaten.
          Butuh informasi? Hubungi pembina masing-masing ekskul.
        </p>
        <div className={styles.ctaActions}>
          <a href="/ekstrakurikuler/daftar" className={styles.ctaBtnPrimary} id="btn-daftar-ekskul-cta">
            ✏️ Daftar Sekarang
          </a>
          <a href="/ekstrakurikuler/pembina" className={styles.ctaBtnSecondary} id="btn-pembina-cta">
            👤 Login Pembina
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} SMPN 5 Klaten — Sistem Manajemen Ekstrakurikuler</p>
      </footer>
    </main>
  );
}
