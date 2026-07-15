import styles from "./alumni.module.css";
import Header from "../components/Header";
import AlumniForm from "./AlumniForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni ESPEMA — SMPN 5 Klaten",
  description:
    "Halaman resmi alumni SMP Negeri 5 Klaten (ESPEMA). Unduh dokumen kelulusan, tetap terhubung, dan berkontribusi untuk almamater tercinta.",
};

const milestones = [
  {
    tahun: "1987",
    label: "Angkatan Pertama Lulus",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    tahun: "2000",
    label: "Jaringan Alumni Mulai Terbentuk",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    tahun: "2014",
    label: "Reuni Besar Pertama",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
      </svg>
    ),
  },
  {
    tahun: "2025",
    label: "Alumni Tersebar di Seluruh Indonesia",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

const manfaat = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Tetap Terhubung",
    desc: "Bergabung dalam komunitas alumni ESPEMA dan tetap terhubung dengan teman-teman lama lintas angkatan.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    title: "Jaringan Profesional",
    desc: "Manfaatkan jaringan alumni yang tersebar di berbagai bidang untuk pengembangan karier dan usaha.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    title: "Kontribusi untuk Adik Kelas",
    desc: "Berbagi pengalaman, motivasi, dan inspirasi kepada siswa aktif SMPN 5 Klaten sebagai role model.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: "Dukung Almamater",
    desc: "Bersama memajukan SMPN 5 Klaten melalui program beasiswa, donasi buku, atau kegiatan sosial sekolah.",
  },
];

const stories = [
  {
    foto: "/alumni-1.png",
    nama: "Rizal Kurniawan",
    angkatan: "Angkatan 2018",
    profesi: "Software Engineer — Shopee Indonesia",
    kutipan:
      "ESPEMA mengajarkan saya tentang disiplin dan kerja keras. Nilai-nilai itu yang terus saya bawa hingga hari ini dan menjadi fondasi karier saya.",
  },
  {
    foto: "/alumni-2.png",
    nama: "Sari Dewi Pratiwi",
    angkatan: "Angkatan 2019",
    profesi: "Dokter Muda — RSUD Klaten",
    kutipan:
      "Guru-guru ESPEMA yang luar biasa menanamkan rasa ingin tahu yang tinggi. Itulah yang mendorong saya untuk terus belajar dan akhirnya bisa menjadi dokter.",
  },
  {
    foto: "/alumni-3.png",
    nama: "Fadhil Ananda",
    angkatan: "Angkatan 2020",
    profesi: "Mahasiswa Teknik — Universitas Gadjah Mada",
    kutipan:
      "Masa SMP di ESPEMA adalah masa paling berkesan. Di sinilah saya belajar arti persahabatan sejati dan semangat pantang menyerah.",
  },
];

export default function AlumniPage() {
  return (
    <main className={styles.main} id="main-content">
      <a href="#main-content" className={styles.skipLink}>
        Lewati ke konten utama
      </a>
      <Header activePage="Alumni" />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            Selamat Datang, Alumni ESPEMA
          </div>
          <h1>
            Satu Almamater,<br />
            Selamanya <span className={styles.highlight}>ESPEMA JUARA</span>
          </h1>
          <p>
            Jarak memisahkan, tapi ikatan almamater tidak pernah putus.
            Lengkapi data Anda dan unduh dokumen kelulusan — kontribusi kecil
            Anda sangat berarti untuk kemajuan SMPN 5 Klaten.
          </p>
          <div className={styles.heroActions}>
            <a href="#pendataan" className={styles.btnPrimary} aria-label="Ambil dokumen kelulusan saya">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Ambil Dokumenku
            </a>
            <a
              href="https://instagram.com/espema_klaten"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
              aria-label="Ikuti Instagram resmi ESPEMA Klaten"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", marginRight: "6px" }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Ikuti Instagram Kami
            </a>
          </div>
        </div>
        <div className={styles.heroDecor} aria-hidden="true">
          <div className={styles.heroCard}>
            <div className={styles.heroCardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <strong>SMPN 5 Klaten</strong>
            <span>Berdiri sejak 1984</span>
          </div>
          <div className={styles.heroCardAlt}>
            <div className={styles.heroCardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <strong>38+ Angkatan</strong>
            <span>Alumni Berprestasi</span>
          </div>
        </div>
      </section>

      {/* ── MILESTONE STRIP ── */}
      <section className={styles.milestoneSection} aria-label="Jejak sejarah alumni ESPEMA">
        <div className={styles.milestoneInner}>
          {milestones.map((m, i) => (
            <div key={i} className={styles.milestoneItem}>
              <div className={styles.milestoneIcon}>{m.icon}</div>
              <strong>{m.tahun}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRACER STUDY & DOKUMEN ALUMNI (PRIORITAS UTAMA) ── */}
      <section className={styles.formSection} id="pendataan" aria-labelledby="pendataan-heading">
        <div className={styles.formSectionInner}>
          <div className={styles.formSectionLeft}>
            <div className={styles.badge}>Dokumen Kelulusan</div>
            <h2 id="pendataan-heading">
              Unduh <span className={styles.highlight}>Ijazah, Transkrip Nilai<br />& SH TKA</span><br />Milik Anda
            </h2>
            <p>
              Masukkan NISN dan lengkapi profil singkat Anda. Data ini membantu
              sekolah dalam program tracer study alumni. Sebagai apresiasi, Anda
              akan langsung dapat mengakses dokumen kelulusan Anda.
            </p>
            <ul className={styles.formBenefitList} aria-label="Keuntungan mengisi form">
              {[
                "Akses langsung file PDF Ijazah, Transkrip Nilai & SH TKA",
                "Data Anda membantu akreditasi sekolah",
                "Bergabung otomatis ke komunitas alumni",
              ].map((b, i) => (
                <li key={i}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.formSectionRight}>
            <AlumniForm />
          </div>
        </div>
      </section>

      {/* ── MANFAAT ── */}
      <section className={styles.section} aria-labelledby="manfaat-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Komunitas Alumni</div>
          <h2 id="manfaat-heading">Kenapa Harus <span className={styles.highlight}>Bergabung?</span></h2>
          <p>Menjadi bagian dari komunitas alumni ESPEMA bukan sekadar kenangan — ini tentang masa depan bersama.</p>
        </div>
        <div className={styles.manfaatGrid}>
          {manfaat.map((m, i) => (
            <div key={i} className={styles.manfaatCard} style={{ animationDelay: `${i * 80}ms` }}>
              <div className={styles.manfaatIcon}>{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CERITA ALUMNI ── */}
      <section className={styles.sectionAlt} id="cerita" aria-labelledby="cerita-heading">
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Inspirasi Alumni</div>
          <h2 id="cerita-heading">Cerita <span className={styles.highlight}>Para JUARA</span></h2>
          <p>Alumni ESPEMA yang telah menorehkan prestasi dan menginspirasi generasi berikutnya.</p>
        </div>
        <div className={styles.storyGrid}>
          {stories.map((s, i) => (
            <article key={i} className={styles.storyCard} style={{ animationDelay: `${i * 100}ms` }}>
              <div className={styles.storyPhoto}>
                <img src={s.foto} alt={`Foto alumni ${s.nama}`} loading="lazy" />
              </div>
              <div className={styles.storyContent}>
                <div className={styles.storyAngkatan}>{s.angkatan}</div>
                <h3>{s.nama}</h3>
                <p className={styles.storyJob}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  {s.profesi}
                </p>
                <blockquote className={styles.storyQuote}>
                  &ldquo;{s.kutipan}&rdquo;
                </blockquote>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.storyNote}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#944535" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }}>
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
          </svg>
          <strong>Punya cerita inspiratif?</strong> Kirimkan profil dan foto Anda ke{" "}
          <a href="mailto:smp5negeriklaten@gmail.com">smp5negeriklaten@gmail.com</a>{" "}
          dan kami akan tampilkan di sini.
        </p>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className={styles.ctaInner}>
          <h2 id="cta-heading">Bangga Jadi <span className={styles.highlightPeach}>Alumni ESPEMA?</span></h2>
          <p>
            Tunjukkan dengan mengikuti media sosial resmi kami. Bersama kita terus jaga
            semangat JUARA yang dulu ditanamkan di bangku SMPN 5 Klaten.
          </p>
          <div className={styles.ctaActions}>
            <a
              href="https://instagram.com/espema_klaten"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnCtaPrimary}
              aria-label="Ikuti Instagram resmi ESPEMA Klaten"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", marginRight: "6px" }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              Ikuti @espema_klaten
            </a>
            <a href="/" className={styles.btnCtaSecondary} aria-label="Kembali ke halaman beranda">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", marginRight: "4px" }}>
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER MINI ── */}
      <footer className={styles.footerMini}>
        <div className={styles.footerMiniInner}>
          <p>© 2026 SMPN 5 Klaten — Tempat Tumbuhnya Generasi JUARA.</p>
          <a href="/" aria-label="Kembali ke halaman beranda">← Kembali ke Beranda</a>
        </div>
      </footer>
    </main>
  );
}
