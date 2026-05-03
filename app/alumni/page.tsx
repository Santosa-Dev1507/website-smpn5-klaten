import styles from "./alumni.module.css";
import Header from "../components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni ESPEMA — SMPN 5 Klaten",
  description:
    "Halaman resmi alumni SMP Negeri 5 Klaten (ESPEMA). Tetap terhubung, berbagi cerita, dan berkontribusi untuk almamater tercinta.",
};

const milestones = [
  { tahun: "1987", label: "Angkatan Pertama Lulus", icon: "🎓" },
  { tahun: "2000", label: "Jaringan Alumni Mulai Terbentuk", icon: "🤝" },
  { tahun: "2014", label: "Reuni Besar Pertama", icon: "🎉" },
  { tahun: "2025", label: "Alumni Tersebar di Seluruh Indonesia", icon: "🌏" },
];

const manfaat = [
  {
    icon: "🔗",
    title: "Tetap Terhubung",
    desc: "Bergabung dalam komunitas alumni ESPEMA dan tetap terhubung dengan teman-teman lama lintas angkatan.",
  },
  {
    icon: "💼",
    title: "Jaringan Profesional",
    desc: "Manfaatkan jaringan alumni yang tersebar di berbagai bidang untuk pengembangan karier dan usaha.",
  },
  {
    icon: "🎓",
    title: "Kontribusi untuk Adik Kelas",
    desc: "Berbagi pengalaman, motivasi, dan inspirasi kepada siswa aktif SMPN 5 Klaten sebagai role model.",
  },
  {
    icon: "🏫",
    title: "Dukung Almamater",
    desc: "Bersama memajukan SMPN 5 Klaten melalui program beasiswa, donasi buku, atau kegiatan sosial sekolah.",
  },
];

export default function AlumniPage() {
  return (
    <main className={styles.main}>
      <Header activePage="Alumni" />

      {/* PAGE HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>👋 Selamat Datang, Alumni ESPEMA</div>
          <h1>
            Satu Almamater,<br />
            Selamanya <span className={styles.highlight}>ESPEMA JUARA</span>
          </h1>
          <p>
            Jarak memisahkan, tapi ikatan almamater tidak pernah putus.
            SMPN 5 Klaten bangga dengan setiap alumni yang telah melangkah jauh
            dan mengharumkan nama ESPEMA di mana pun berada.
          </p>
          <div className={styles.heroActions}>
            <a
              href="https://wa.me/6289537781555?text=Halo,%20saya%20alumni%20ESPEMA%20dan%20ingin%20bergabung%20ke%20grup%20alumni."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              💬 Gabung Grup Alumni
            </a>
            <a href="#cerita" className={styles.btnSecondary}>
              Baca Cerita Alumni
            </a>
          </div>
        </div>
        <div className={styles.heroDecor}>
          <div className={styles.heroCard}>
            <div className={styles.heroCardIcon}>🏫</div>
            <strong>SMPN 5 Klaten</strong>
            <span>Berdiri sejak 1984</span>
          </div>
          <div className={styles.heroCardAlt}>
            <div className={styles.heroCardIcon}>🎓</div>
            <strong>38+ Angkatan</strong>
            <span>Alumni Berprestasi</span>
          </div>
        </div>
      </section>

      {/* MILESTONE */}
      <section className={styles.milestoneSection}>
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

      {/* MANFAAT BERGABUNG */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Komunitas Alumni</div>
          <h2>Kenapa Harus <span className={styles.highlight}>Bergabung?</span></h2>
          <p>Menjadi bagian dari komunitas alumni ESPEMA bukan sekadar kenangan — ini tentang masa depan bersama.</p>
        </div>
        <div className={styles.manfaatGrid}>
          {manfaat.map((m, i) => (
            <div key={i} className={styles.manfaatCard}>
              <div className={styles.manfaatIcon}>{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CERITA ALUMNI PLACEHOLDER */}
      <section className={styles.sectionAlt} id="cerita">
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Inspirasi Alumni</div>
          <h2>Cerita <span className={styles.highlight}>Para JUARA</span></h2>
          <p>Alumni ESPEMA yang telah menorehkan prestasi dan menginspirasi.</p>
        </div>
        <div className={styles.storyGrid}>
          {[1, 2, 3].map((_, i) => (
            <div key={i} className={styles.storyCard}>
              <div className={styles.storyPhoto}>
                <img
                  src={`https://placehold.co/300x300/fdf8f2/944535?text=Foto+Alumni`}
                  alt="Foto Alumni"
                />
              </div>
              <div className={styles.storyContent}>
                <div className={styles.storyAngkatan}>Angkatan [Tahun]</div>
                <h4>[Nama Alumni]</h4>
                <p className={styles.storyJob}>🏢 [Profesi / Posisi saat ini]</p>
                <p className={styles.storyQuote}>
                  "ESPEMA mengajarkan saya tentang disiplin dan kerja keras. Nilai-nilai itu yang terus saya bawa hingga hari ini."
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.storyNote}>
          ✏️ <strong>Punya cerita inspiratif?</strong> Kirimkan profil dan foto Anda ke{" "}
          <a href="mailto:smp5negeriklaten@gmail.com">smp5negeriklaten@gmail.com</a>{" "}
          dan kami akan tampilkan di sini.
        </p>
      </section>

      {/* DAFTAR ANGKATAN PLACEHOLDER */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.badge}>Direktori Alumni</div>
          <h2>Cari <span className={styles.highlight}>Teman Lama</span></h2>
          <p>Direktori alumni ESPEMA sedang dalam pengembangan. Bergabunglah sekarang agar data Anda masuk!</p>
        </div>
        <div className={styles.direktoriPlaceholder}>
          <div className={styles.direktoriIcon}>🔍</div>
          <h3>Direktori Sedang Disiapkan</h3>
          <p>Kami sedang mengumpulkan data alumni dari seluruh angkatan. Daftarkan diri Anda sekarang dan jadilah yang pertama!</p>
          <a
            href="https://wa.me/6289537781555?text=Halo,%20saya%20alumni%20ESPEMA%20ingin%20mendaftarkan%20diri%20ke%20direktori%20alumni."
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            Daftarkan Diri Saya
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2>Bangga Jadi <span className={styles.highlightPeach}>Alumni ESPEMA?</span></h2>
          <p>
            Tunjukkan dengan bergabung ke komunitas resmi kami. Bersama kita terus jaga
            semangat JUARA yang dulu ditanamkan di bangku SMPN 5 Klaten.
          </p>
          <div className={styles.ctaActions}>
            <a
              href="https://wa.me/6289537781555?text=Halo,%20saya%20alumni%20ESPEMA%20dan%20ingin%20bergabung."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnCtaPrimary}
            >
              💬 Gabung WhatsApp Alumni
            </a>
            <a href="/" className={styles.btnCtaSecondary}>
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER MINI */}
      <footer className={styles.footerMini}>
        <div className={styles.footerMiniInner}>
          <p>© 2026 SMPN 5 Klaten — Tempat Tumbuhnya Generasi JUARA.</p>
          <a href="/">← Kembali ke Beranda</a>
        </div>
      </footer>
    </main>
  );
}
