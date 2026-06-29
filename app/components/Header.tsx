"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Header.module.css";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Ekskul", href: "/ekstrakurikuler" },
  { label: "Alumni", href: "/alumni" },
  { label: "Prestasi", href: "/#prestasi" },
];

export default function Header({ activePage = "" }: { activePage?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup menu saat resize ke desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cegah scroll saat menu terbuka
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className={styles.header}>
        <a href="/" className={styles.logoContainer}>
          <Image
            src="/logo_smpn5.png"
            alt="Logo SMPN 5 Klaten"
            width={46}
            height={46}
            priority
          />
          <div>
            <span className={styles.schoolName}>SMPN 5 KLATEN</span>
            <span className={styles.schoolTagline}>Generasi JUARA</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={activePage === link.label ? styles.navActive : ""}
            >
              {link.label}
            </a>
          ))}
          <a href="/spmb" className={`${styles.navCta} ${activePage === "SPMB" ? styles.navCtaActive : ""}`}>
            Info SPMB
          </a>
        </nav>

        {/* Hamburger Button */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <nav className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileMenuHeader}>
          <div className={styles.mobileLogoArea}>
            <Image src="/logo_smpn5.png" alt="Logo" width={40} height={40} />
            <div>
              <span className={styles.schoolName}>SMPN 5 KLATEN</span>
              <span className={styles.schoolTagline}>Generasi JUARA</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setMenuOpen(false)} aria-label="Tutup Menu">✕</button>
        </div>

        <div className={styles.mobileLinks}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${activePage === link.label ? styles.mobileLinkActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
              <span className={styles.mobileLinkArrow}>→</span>
            </a>
          ))}
          <a
            href="/spmb"
            className={styles.mobileCta}
            onClick={() => setMenuOpen(false)}
          >
            Daftar SPMB Sekarang
          </a>
        </div>

        <div className={styles.mobileFooter}>
          <p>📍 Jalan Kendali Sodo, Jomboran, Klaten Tengah</p>
        </div>
      </nav>
    </>
  );
}
