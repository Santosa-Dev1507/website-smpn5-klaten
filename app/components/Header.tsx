"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Header.module.css";

type NavChild = { label: string; href: string };
type NavLink =
  | { label: string; href: string; children?: undefined }
  | { label: string; href?: undefined; children: NavChild[] };

const navLinks: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  {
    label: "Layanan",
    children: [
      { label: "Layanan Publik", href: "/layanan-publik" },
      { label: "Hasil Try Out TKA", href: "/tryout-tka" },
      { label: "Hasil Asesmen", href: "/hasil-asesmen" },
    ],
  },
  {
    label: "Ekskul",
    children: [
      { label: "Ekstrakurikuler", href: "/ekstrakurikuler" },
      { label: "Daftar Ekskul", href: "/ekstrakurikuler/daftar" },
      { label: "Pendaftaran OSIS", href: "/osis/daftar" },
      { label: "E-Voting OSIS", href: "/osis/evote" },
      { label: "Pengumuman Seleksi OSIS", href: "/osis/pengumuman" },
    ],
  },
  { label: "Kokurikuler", href: "/kokurikuler" },
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
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className={styles.dropdown}>
                <button
                  className={`${styles.dropdownTrigger} ${
                    link.children.some((c) => activePage === c.label)
                      ? styles.navActive
                      : ""
                  }`}
                  aria-haspopup="true"
                >
                  {link.label}
                  <span className={styles.dropdownArrow} aria-hidden="true">▾</span>
                </button>
                <div className={styles.dropdownMenu} role="menu">
                  {link.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className={`${styles.dropdownItem} ${
                        activePage === child.label ? styles.dropdownItemActive : ""
                      }`}
                      role="menuitem"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className={activePage === link.label ? styles.navActive : ""}
              >
                {link.label}
              </a>
            )
          )}
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
      <MobileDrawer
        navLinks={navLinks}
        activePage={activePage}
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}

/** Drawer mobile dengan accordion untuk item ber-children */
function MobileDrawer({
  navLinks,
  activePage,
  menuOpen,
  onClose,
}: {
  navLinks: NavLink[];
  activePage: string;
  menuOpen: boolean;
  onClose: () => void;
}) {
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  return (
    <nav className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
      <div className={styles.mobileMenuHeader}>
        <div className={styles.mobileLogoArea}>
          <Image src="/logo_smpn5.png" alt="Logo" width={40} height={40} />
          <div>
            <span className={styles.schoolName}>SMPN 5 KLATEN</span>
            <span className={styles.schoolTagline}>Generasi JUARA</span>
          </div>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Tutup Menu">✕</button>
      </div>

      <div className={styles.mobileLinks}>
        {navLinks.map((link) =>
          link.children ? (
            <div key={link.label}>
              <button
                className={`${styles.mobileLink} ${styles.mobileLinkAccordion} ${
                  link.children.some((c) => activePage === c.label)
                    ? styles.mobileLinkActive
                    : ""
                }`}
                onClick={() =>
                  setExpandedLabel((prev) => prev === link.label ? null : link.label)
                }
                aria-expanded={expandedLabel === link.label}
              >
                {link.label}
                <span
                  className={styles.mobileLinkArrow}
                  style={{ transform: expandedLabel === link.label ? "rotate(90deg)" : "none" }}
                >
                  →
                </span>
              </button>
              {expandedLabel === link.label && (
                <div className={styles.mobileSubLinks}>
                  {link.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      className={`${styles.mobileSubLink} ${
                        activePage === child.label ? styles.mobileLinkActive : ""
                      }`}
                      onClick={onClose}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <a
              key={link.href}
              href={link.href}
              className={`${styles.mobileLink} ${
                activePage === link.label ? styles.mobileLinkActive : ""
              }`}
              onClick={onClose}
            >
              {link.label}
              <span className={styles.mobileLinkArrow}>→</span>
            </a>
          )
        )}
        <a href="/spmb" className={styles.mobileCta} onClick={onClose}>
          Daftar SPMB Sekarang
        </a>
      </div>

      <div className={styles.mobileFooter}>
        <p>Jl. Kendali Sodo, Jomboran, Klaten Tengah</p>
      </div>
    </nav>
  );
}

