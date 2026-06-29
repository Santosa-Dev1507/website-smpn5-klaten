"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SpmbPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Always show popup on every visit — no localStorage check
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="spmb-info-overlay" onClick={handleClose}>
      <div className="spmb-info-content" onClick={(e) => e.stopPropagation()}>
        <button className="spmb-info-close" onClick={handleClose} aria-label="Close popup">
          &times;
        </button>
        <div className="spmb-info-image-wrapper">
          <Image
            src="/flyer-spmb.jpg"
            alt="Pengumuman SPMB"
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
