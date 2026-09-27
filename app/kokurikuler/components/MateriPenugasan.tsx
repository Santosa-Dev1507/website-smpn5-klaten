"use client";

import { FileText, Download, FolderOpen, AlertCircle } from "lucide-react";
import styles from "./panduan.module.css";

export default function MateriPenugasan() {
  const DRIVE_FOLDER_ID = "1hi6RCbOJYeHslaWncYX_hmRaLMC0AQqZ";
  const EMBED_URL = `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#list`;
  const DIRECT_LINK = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}?usp=sharing`;

  return (
    <section className={styles.section} id="materi-penugasan">
      <div className={styles.sectionHeader}>
        <div className={styles.iconBox}>
          <FolderOpen size={24} />
        </div>
        <div>
          <h2 className={styles.sectionTitle}>Materi &amp; Bahan Penugasan</h2>
          <p className={styles.sectionSubtitle}>
            Kumpulan dokumen panduan, Lembar Kerja Peserta Didik (LKPD), dan referensi tugas.
          </p>
        </div>
      </div>

      <div className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
        {/* Drive Iframe Container */}
        <div style={{ width: "100%", height: "450px", position: "relative" }}>
          <iframe
            src={EMBED_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay"
            title="Google Drive Folder - Materi Kokurikuler"
            style={{ border: "none" }}
          ></iframe>
        </div>

        {/* Footer/Action area */}
        <div style={{ 
          padding: "16px 24px", 
          background: "#f8fafc", 
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#64748b", fontSize: "14px" }}>
            <AlertCircle size={16} />
            <span>Jika folder tidak muncul, klik tombol di samping.</span>
          </div>
          <a 
            href={DIRECT_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#0f172a",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#334155")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#0f172a")}
          >
            <Download size={16} />
            Buka di Google Drive
          </a>
        </div>
      </div>
    </section>
  );
}
