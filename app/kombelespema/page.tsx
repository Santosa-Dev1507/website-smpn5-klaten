"use client";

import styles from "./kombel.module.css";
import Head from "next/head";
import Image from "next/image";

export default function KombelPage() {
  return (
    <div className={styles.main}>
      <Head>
        <title>Komunitas Belajar SMPN 5 Klaten</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <img src="/logo_smpn5.png" alt="Logo SMPN 5 Klaten" className={styles.logo} />
          <h1>SMPN 5 Klaten</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#">Beranda</a>
          <a href="#">Program</a>
          <a href="#">Kegiatan</a>
          <a href="#">Kontak</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h2>Belajar Bersama, <br /> Tumbuh Bersama, <br /> <span>Menginspirasi Siswa</span></h2>
          <p>Wadah kolaborasi guru SMPN 5 Klaten untuk berbagi praktik baik dan meningkatkan kualitas pembelajaran.</p>
        </div>
        <img src="https://images.unsplash.com/photo-1588072432836-e10032774350" alt="guru" className={styles.heroImg} />
      </section>

      <section className={styles.features}>
        <div className={styles.featureBox}>Kolaborasi Guru</div>
        <div className={styles.featureBox}>Berbagi Praktik Baik</div>
        <div className={styles.featureBox}>Pengembangan Diri</div>
        <div className={styles.featureBox}>Berorientasi Siswa</div>
      </section>

      <section className={styles.about}>
        <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754" alt="kegiatan" className={styles.aboutImg} />
        <div className={styles.aboutText}>
          <h2>Komunitas Belajar Guru</h2>
          <p>Komunitas ini menjadi ruang bagi guru untuk belajar bersama, berbagi, dan berinovasi dalam pembelajaran.</p>
        </div>
      </section>

      <section className={styles.program}>
        <h2>Program Unggulan</h2>
        <div className={styles.programGrid}>
          <div className={styles.card}>Diskusi & Sharing</div>
          <div className={styles.card}>Praktik Baik</div>
          <div className={styles.card}>Workshop</div>
          <div className={styles.card}>Sumber Belajar</div>
        </div>
      </section>

      <section className={styles.stats}>
        <div>
          <h2>60+</h2>
          <p>Guru Aktif</p>
        </div>
        <div>
          <h2>100+</h2>
          <p>Praktik Dibagikan</p>
        </div>
        <div>
          <h2>50+</h2>
          <p>Kegiatan</p>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Bersama Mewujudkan Pendidikan Terbaik</h2>
        <p>Jadilah bagian dari perubahan pendidikan di SMPN 5 Klaten.</p>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 Komunitas Belajar SMPN 5 Klaten</p>
      </footer>
    </div>
  );
}
