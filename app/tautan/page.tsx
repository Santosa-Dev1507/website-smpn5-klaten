import styles from "./tautan.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tautan Penting — ESPEMA 5 Klaten",
  description: "Portal tautan penting aplikasi pembelajaran dan manajemen sekolah SMP Negeri 5 Klaten.",
};

const quickLinks = [
  { label: "Web Sekolah", href: "/", color: "#944535" },
  { label: "Info SPMB", href: "/spmb", color: "#2D7D46" },
  { label: "Instagram", href: "https://instagram.com/espema_klaten", color: "#C13584" },
  { label: "Email Sekolah", href: "mailto:smp5negeriklaten@gmail.com", color: "#1A56A0" },
];

const pembelajaran = [
  { icon: "💻", name: "E-Learning ESPEMA", desc: "Platform pembelajaran digital resmi SMP Negeri 5 Klaten.", href: "#", color: "#944535" },
  { icon: "🎓", name: "Google Classroom", desc: "Ruang kelas digital untuk penugasan dan materi pelajaran.", href: "https://classroom.google.com", color: "#1A73E8" },
  { icon: "📝", name: "AKM Online", desc: "Asesmen Kompetensi Minimum — Pusat Asesmen Kemdikbud.", href: "https://akm.kemdikbud.go.id", color: "#F29900" },
  { icon: "📚", name: "Bank Soal", desc: "Kumpulan soal dan materi evaluasi siswa.", href: "#", color: "#2D7D46" },
  { icon: "🎮", name: "Quizizz", desc: "Kuis interaktif dan menyenangkan untuk belajar.", href: "https://quizizz.com", color: "#8854D0" },
  { icon: "🌐", name: "Khan Academy", desc: "Materi pembelajaran gratis berbagai mata pelajaran.", href: "https://id.khanacademy.org", color: "#14BF96" },
];

const manajemen = [
  { icon: "📊", name: "DAPODIK", desc: "Aplikasi Data Pokok Pendidikan Kemdikbud.", href: "https://dapo.kemdikbud.go.id", color: "#F59E0B" },
  { icon: "📋", name: "E-Rapor", desc: "Sistem Rapor Elektronik untuk penilaian siswa.", href: "#", color: "#EF4444" },
  { icon: "📅", name: "SPMB ESPEMA", desc: "Sistem Penerimaan Murid Baru SMP Negeri 5 Klaten.", href: "/spmb", color: "#944535" },
  { icon: "💰", name: "SIP Penggajian", desc: "Sistem Informasi Penggajian & Potongan Guru.", href: "#", color: "#1A56A0" },
  { icon: "📖", name: "Jurnal Mengajar", desc: "Pencatatan jurnal kegiatan belajar mengajar harian.", href: "#", color: "#2D7D46" },
  { icon: "🏛️", name: "Perpustakaan Digital", desc: "Katalog dan koleksi buku perpustakaan sekolah.", href: "#", color: "#8854D0" },
  { icon: "✅", name: "Absensi Digital", desc: "Sistem informasi kehadiran siswa dan guru.", href: "#", color: "#14BF96" },
  { icon: "📣", name: "PPKB / PMM", desc: "Platform Merdeka Mengajar untuk pengembangan guru.", href: "https://guru.kemdikbud.go.id", color: "#F29900" },
  { icon: "✉️", name: "Email Sekolah", desc: "smp5negeriklaten@gmail.com — komunikasi resmi.", href: "mailto:smp5negeriklaten@gmail.com", color: "#EA4335" },
];

const referensi = [
  { icon: "🏛️", name: "Kemendikbud RI", desc: "Portal resmi Kementerian Pendidikan dan Kebudayaan.", href: "https://kemdikbud.go.id", color: "#1A56A0" },
  { icon: "🌿", name: "Adiwiyata Nasional", desc: "Program sekolah peduli dan berbudaya lingkungan.", href: "https://klhk.go.id", color: "#2D7D46" },
  { icon: "📜", name: "Permendikbud", desc: "Referensi regulasi dan peraturan pendidikan nasional.", href: "https://jdih.kemdikbud.go.id", color: "#944535" },
];

export default function TautanPage() {
  return (
    <main className={styles.main}>

      {/* HEADER KHUSUS */}
      <header className={styles.header}>
        <img src="https://iili.io/FntumI2.md.png" alt="Logo SMPN 5 Klaten" className={styles.logo} />
        <p className={styles.headerSub}>Portal Tautan Penting</p>
        <h1 className={styles.headerTitle}>ESPEMA 5 KLATEN</h1>
        <p className={styles.headerTagline}>SMP Negeri 5 Klaten — Jujur · Unggul · Amanah · Religius · Aktif</p>

        <div className={styles.quickLinks}>
          {quickLinks.map((q, i) => (
            <a
              key={i}
              href={q.href}
              className={styles.quickLink}
              style={{ background: q.color }}
              target={q.href.startsWith("http") ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              {q.label}
            </a>
          ))}
        </div>
      </header>

      <div className={styles.content}>

        {/* APLIKASI PEMBELAJARAN */}
        <section className={styles.category}>
          <h2 className={styles.categoryTitle}>
            <span className={styles.categoryLine}></span>
            📚 APLIKASI PEMBELAJARAN
            <span className={styles.categoryLine}></span>
          </h2>
          <div className={styles.appGrid}>
            {pembelajaran.map((app, i) => (
              <div key={i} className={styles.appCard}>
                <div className={styles.appIcon} style={{ background: `${app.color}18`, color: app.color }}>
                  {app.icon}
                </div>
                <h3>{app.name}</h3>
                <p>{app.desc}</p>
                <a
                  href={app.href}
                  className={styles.appBtn}
                  style={{ background: app.color }}
                  target={app.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                >
                  Buka Aplikasi
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* APLIKASI MANAJEMEN */}
        <section className={styles.category}>
          <h2 className={styles.categoryTitle}>
            <span className={styles.categoryLine}></span>
            🏫 APLIKASI MANAJEMEN SEKOLAH
            <span className={styles.categoryLine}></span>
          </h2>
          <div className={styles.appGrid}>
            {manajemen.map((app, i) => (
              <div key={i} className={styles.appCard}>
                <div className={styles.appIcon} style={{ background: `${app.color}18`, color: app.color }}>
                  {app.icon}
                </div>
                <h3>{app.name}</h3>
                <p>{app.desc}</p>
                <a
                  href={app.href}
                  className={styles.appBtn}
                  style={{ background: app.color }}
                  target={app.href.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                >
                  Buka Aplikasi
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* REFERENSI */}
        <section className={styles.category}>
          <h2 className={styles.categoryTitle}>
            <span className={styles.categoryLine}></span>
            🔗 REFERENSI & REGULASI
            <span className={styles.categoryLine}></span>
          </h2>
          <div className={styles.appGrid}>
            {referensi.map((app, i) => (
              <div key={i} className={styles.appCard}>
                <div className={styles.appIcon} style={{ background: `${app.color}18`, color: app.color }}>
                  {app.icon}
                </div>
                <h3>{app.name}</h3>
                <p>{app.desc}</p>
                <a
                  href={app.href}
                  className={styles.appBtn}
                  style={{ background: app.color }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka Tautan
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2026 SMP Negeri 5 Klaten — Jalan Kendali Sodo, Jomboran, Klaten Tengah</p>
        <p>WA: 0895377815555 · smp5negeriklaten@gmail.com</p>
        <a href="/">← Kembali ke Beranda</a>
      </footer>

    </main>
  );
}
