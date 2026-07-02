"use client";

import { useEffect, useState } from "react";

export default function PengumumanCta({
  primaryClassName,
  outlineClassName,
}: {
  primaryClassName: string;
  outlineClassName?: string;
}) {
  const [isLive, setIsLive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Target: 4 Juli 2026 00:00:00 WIB (UTC+7)
    const targetDate = new Date("2026-07-04T00:00:00+07:00").getTime();

    const checkStatus = () => {
      setIsLive(Date.now() >= targetDate);
    };

    checkStatus();
    const id = setInterval(checkStatus, 1000);
    return () => clearInterval(id);
  }, []);

  // Hindari hydration mismatch dengan me-render fallback atau null di server
  if (!mounted) {
    return (
      <a href="#" className={outlineClassName || primaryClassName} style={{ opacity: 0.5, cursor: "not-allowed" }}>
        Memuat...
      </a>
    );
  }

  if (isLive) {
    return (
      <a href="/spmb/hasil" className={primaryClassName}>
        Cek Hasil Kelulusan SPMB
      </a>
    );
  }

  return (
    <a
      href="#"
      className={outlineClassName || primaryClassName}
      style={{ opacity: 0.8, cursor: "not-allowed" }}
      onClick={(e) => {
        e.preventDefault();
        alert("Pengumuman kelulusan SPMB baru akan dibuka pada 4 Juli 2026 pukul 00:00 WIB.");
      }}
    >
      🔒 Pengumuman Dibuka 4 Juli
    </a>
  );
}
