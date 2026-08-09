"use client";

import { useState } from "react";
import styles from "../page.module.css";

export interface Achievement {
  year: string;
  title: string;
  level: string;
  cat: string;
}

interface Props {
  achievements: Achievement[];
}

export default function AchievementsTab({ achievements }: Props) {
  const [selectedYear, setSelectedYear] = useState<string>("Semua");

  // Ekstrak tahun unik terurut dari terbaru
  const years = Array.from(new Set(achievements.map((a) => a.year))).sort(
    (a, b) => Number(b) - Number(a)
  );
  const filterTabs = ["Semua", ...years];

  // Filter list berdasarkan tab tahun yang dipilih
  const filteredAchievements =
    selectedYear === "Semua"
      ? achievements
      : achievements.filter((a) => a.year === selectedYear);

  return (
    <div className={styles.achievementsRight}>
      {/* Tab Filter Tahun */}
      <div className={styles.yearTabNav} role="tablist" aria-label="Filter prestasi per tahun">
        {filterTabs.map((tab) => {
          const count =
            tab === "Semua"
              ? achievements.length
              : achievements.filter((a) => a.year === tab).length;
          const isActive = selectedYear === tab;

          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              className={`${styles.yearTabBtn} ${isActive ? styles.yearTabActive : ""}`}
              onClick={() => setSelectedYear(tab)}
            >
              <span>{tab === "Semua" ? "Semua Tahun" : `Tahun ${tab}`}</span>
              <span className={styles.yearTabCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Daftar Item Prestasi */}
      <div className={styles.achievementListWrap}>
        {filteredAchievements.map((a, i) => (
          <div key={`${a.year}-${i}`} className={styles.achievementItem}>
            <div className={styles.achievementYear}>{a.year}</div>
            <div className={styles.achievementInfo}>
              <strong>{a.title}</strong>
              <span>{a.level}</span>
            </div>
            {a.cat && (
              <span className={styles.achievementCategoryBadge}>{a.cat}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
