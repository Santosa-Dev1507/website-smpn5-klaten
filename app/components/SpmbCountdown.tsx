"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

const TARGET = new Date("2026-06-29T07:00:00+07:00").getTime();

function calcTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return null;
  return {
    hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
    jam: Math.floor((diff / (1000 * 60 * 60)) % 24),
    menit: Math.floor((diff / (1000 * 60)) % 60),
    detik: Math.floor((diff / 1000) % 60),
  };
}

export default function SpmbCountdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calcTimeLeft>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft());
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Jangan render apapun di server (SSR) — hindari hydration mismatch
  if (!mounted) return null;

  // Jika sudah lewat tanggal, tampilkan pesan pendaftaran dibuka
  if (timeLeft === null) {
    return (
      <div className={styles.countdownWrapper}>
        <div className={styles.countdownOpen}>
          🎉 Pendaftaran SPMB Sudah Dibuka!
        </div>
      </div>
    );
  }

  const units = [
    { value: timeLeft.hari, label: "Hari" },
    { value: timeLeft.jam, label: "Jam" },
    { value: timeLeft.menit, label: "Menit" },
    { value: timeLeft.detik, label: "Detik" },
  ];

  return (
    <div className={styles.countdownWrapper}>
      <p className={styles.countdownLabel}>⏳ Pendaftaran dibuka dalam:</p>
      <div className={styles.countdownGrid}>
        {units.map(({ value, label }) => (
          <div key={label} className={styles.countdownUnit}>
            <span className={styles.countdownNumber}>
              {String(value).padStart(2, "0")}
            </span>
            <span className={styles.countdownUnitLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
