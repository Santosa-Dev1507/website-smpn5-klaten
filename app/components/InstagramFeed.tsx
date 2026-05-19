"use client";

import { useEffect, useRef } from "react";
import styles from "./InstagramFeed.module.css";

export default function InstagramFeed() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Load Elfsight platform script
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      try { document.body.removeChild(script); } catch { /* ignore */ }
    };
  }, []);

  return (
    <section className={styles.section} id="instagram">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.badge}>Media Sosial</div>
        <h2>
          Lihat keseharian <span className={styles.highlight}>ESPEMA</span> dari
          dekat
        </h2>
        <p>
          Prestasi, kegiatan seru, dan momen tak terlupakan para siswa —
          semuanya ada di Instagram kami.
        </p>
      </div>

      {/* Elfsight Instagram Feed Widget */}
      <div
        className="elfsight-app-f8469f58-0a8d-4835-b1eb-2bb6dbfe92a5"
        data-elfsight-app-lazy
      />

      {/* Follow Button */}
      <div className={styles.followWrap}>
        <a
          href="https://www.instagram.com/espema_klaten"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Ikuti @espema_klaten
        </a>
      </div>
    </section>
  );
}
