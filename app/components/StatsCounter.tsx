"use client";

import { useEffect, useState, useRef } from "react";
import styles from "../page.module.css";

function CountUpItem({ 
  endValue, 
  startValue = 0, 
  duration = 2000, 
  suffix = "" 
}: { 
  endValue: number, 
  startValue?: number, 
  duration?: number, 
  suffix?: string 
}) {
  const [count, setCount] = useState(startValue);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // easeOutQuart formula for smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeProgress * (endValue - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, endValue, startValue, duration]);

  // Use type casting to any to bypass strict React element type checks if necessary, but strong is fine
  return <strong ref={ref as any}>{count}{suffix}</strong>;
}

export default function StatsCounter() {
  const stats = [
    { target: 42, start: 0, suffix: "+", label: "Tahun Berdiri", sub: "Berdiri sejak 1984" },
    { target: 768, start: 0, suffix: "", label: "Siswa Aktif", sub: "Tahun ajaran 2025/2026" },
    { target: 40, start: 0, suffix: "", label: "Tenaga Pengajar", sub: "Guru profesional & berdedikasi" },
    { target: 2025, start: 1990, suffix: "", label: "Adiwiyata Nasional", sub: "Penghargaan lingkungan hidup" },
  ];

  return (
    <section className={styles.stats}>
      <div className={styles.statsInner}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <CountUpItem endValue={s.target} startValue={s.start} suffix={s.suffix} />
            <span>{s.label}</span>
            <small>{s.sub}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
