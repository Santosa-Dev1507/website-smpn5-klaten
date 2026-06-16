"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SpmbPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check local storage so it only shows once
    const hasSeenPopup = localStorage.getItem("spmb_popup_seen");
    
    if (!hasSeenPopup) {
      // Delay slightly for a smoother experience
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Set to local storage after closing so it doesn't appear again
    localStorage.setItem("spmb_popup_seen", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose} aria-label="Close popup">
          &times;
        </button>
        {/* We use standard img for simplicity or next/image if image is local */}
        <div className="popup-image-wrapper">
          <Image
            src="/flyer-spmb.jpeg"
            alt="Pengumuman SPMB"
            width={800}
            height={1000}
            className="popup-image"
            priority
          />
        </div>
      </div>
    </div>
  );
}
