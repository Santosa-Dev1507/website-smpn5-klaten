"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SpmbPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("spmb_popup_seen_v3");

    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("spmb_popup_seen_v3", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="spmb-info-overlay" onClick={handleClose}>
      <div className="spmb-info-content" onClick={(e) => e.stopPropagation()}>
        <button className="spmb-info-close" onClick={handleClose} aria-label="Tutup pengumuman">
          &times;
        </button>
        <div className="spmb-info-image-wrapper">
          <Image
            src="/flyer-spmb.jpeg"
            alt="Pengumuman SPMB SMP Negeri 5 Klaten TA 2026/2027"
            width={800}
            height={1000}
            className="spmb-info-image"
            priority
          />
        </div>
      </div>
    </div>
  );
}
