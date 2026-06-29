"use client";

import Link from "next/link";
import { useState } from "react";
import { TopAppBar, Sidebar, AdminBottomNavBar } from "@/components/Navigation";

const filterButtons = ["Semua", "Akademik", "Seni", "Olahraga", "Pramuka"];

const calendarDays = [
  { num: 27, prev: true }, { num: 28, prev: true }, { num: 29, prev: true },
  { num: 30, prev: true }, { num: 31, prev: true },
  ...Array.from({ length: 23 }, (_, i) => ({
    num: i + 1,
    prev: false,
    event: [6, 19].includes(i + 1) ? (i + 1 === 6 ? "secondary" : "error") : null,
    today: i + 1 === 14,
  })),
];

const upcomingCompetitions = [
  {
    level: "Nasional",
    levelClass: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
    borderClass: "border-[var(--color-secondary)]",
    date: "19 Sep 2023",
    title: "Olimpiade Matematika Nasional",
    category: "Kategori: Akademik",
  },
  {
    level: "Provinsi",
    levelClass: "bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed-variant)]",
    borderClass: "border-[var(--color-on-tertiary-fixed-variant)]",
    date: "25 Sep 2023",
    title: "FLS2N Seni Tari",
    category: "Kategori: Seni & Budaya",
  },
  {
    level: "Kecamatan",
    levelClass: "bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]",
    borderClass: "border-[var(--color-primary)]",
    date: "02 Okt 2023",
    title: "Lomba Gerak Jalan Klaten",
    category: "Kategori: Olahraga",
  },
];

export default function JadwalPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      <TopAppBar title="SMPN Manajemen" isAdmin />
      <Sidebar />

      <div className="flex max-w-[1440px] mx-auto min-h-[calc(100vh-64px)]">
        <main className="flex-1 lg:ml-72 p-6 md:p-8 pb-32">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-on-background)] mb-1">Jadwal Kompetisi</h1>
            <p className="text-base text-[var(--color-on-surface-variant)]">Pantau agenda lomba siswa SMPN 5 Klaten bulan ini.</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Filter Bar */}
            <div className="col-span-12 flex flex-wrap gap-3 items-center bg-[var(--color-surface-container-lowest)] p-4 rounded-xl card-level-1 border border-[var(--color-outline-variant)]/30">
              <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Filter Kategori:</span>
              {filterButtons.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === f
                      ? "bg-[var(--color-primary)] text-white shadow-md"
                      : "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-outline-variant)]/30"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div className="col-span-12 lg:col-span-8 bg-[var(--color-surface-container-lowest)] p-6 rounded-xl card-level-1 border border-[var(--color-outline-variant)]/30">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-semibold text-[var(--color-on-surface)]">September 2023</h2>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-[var(--color-surface-container-high)] rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-base">chevron_left</span>
                    </button>
                    <button className="p-1 hover:bg-[var(--color-surface-container-high)] rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-base">chevron_right</span>
                    </button>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-[var(--color-secondary)] font-semibold text-sm hover:underline">
                  <span className="material-symbols-outlined text-sm">event</span>
                  Lihat Full Calendar
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center border-b border-[var(--color-outline-variant)] pb-2 mb-2">
                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
                  <div key={d} className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">{d}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1" style={{ minHeight: 340 }}>
                {calendarDays.map((day, i) => {
                  if (day.today) {
                    return (
                      <div key={i} className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] p-2 rounded-lg text-xs ring-2 ring-[var(--color-primary)] relative">
                        <span className="font-bold">{day.num}</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-on-primary-container)] rounded-full" />
                      </div>
                    );
                  }
                  if ((day as any).event === "secondary") {
                    return (
                      <div key={i} className="bg-[var(--color-secondary-container)]/20 p-2 rounded-lg text-xs border-2 border-[var(--color-secondary)] relative">
                        <span className="font-bold text-[var(--color-secondary)]">{day.num}</span>
                        <div className="mt-1 bg-[var(--color-secondary)] w-full h-1 rounded-full" />
                      </div>
                    );
                  }
                  if ((day as any).event === "error") {
                    return (
                      <div key={i} className="bg-[var(--color-error-container)]/30 p-2 rounded-lg text-xs border-2 border-[var(--color-error)] relative">
                        <span className="font-bold text-[var(--color-error)]">{day.num}</span>
                        <div className="mt-1 bg-[var(--color-error)] w-full h-1 rounded-full" />
                      </div>
                    );
                  }
                  return (
                    <div key={i} className={`bg-[var(--color-surface)] p-2 rounded-lg text-xs ${day.prev ? "opacity-40" : "hover:bg-[var(--color-surface-container)] cursor-pointer transition-colors"}`}>
                      {day.num}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Competitions */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <div className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl card-level-1 border border-[var(--color-outline-variant)]/30 flex-1">
                <h2 className="text-base font-semibold text-[var(--color-on-surface)] mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-primary)]">rocket_launch</span>
                  Lomba Terdekat
                </h2>
                <div className="space-y-4">
                  {upcomingCompetitions.map((c, i) => (
                    <div key={i} className={`group bg-[var(--color-surface)] rounded-xl p-4 border-l-4 ${c.borderClass} hover:shadow-md transition-all`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 ${c.levelClass} rounded text-[10px] font-bold uppercase tracking-widest`}>{c.level}</span>
                        <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">{c.date}</span>
                      </div>
                      <h3 className="font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors mb-1 text-sm">{c.title}</h3>
                      <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">{c.category}</p>
                      <button className="w-full py-2 bg-[var(--color-surface-container-highest)] text-[var(--color-primary)] font-bold rounded-lg text-xs group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors active:scale-95">
                        Lihat Detail
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Card */}
              <div className="relative overflow-hidden rounded-xl bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] p-6 flex flex-col justify-end min-h-[180px]">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: "120px", fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-80">Info Kompetisi</p>
                  <h3 className="text-base font-bold mb-4 leading-tight">Daftarkan Tim Ekskul Anda Sekarang!</h3>
                  <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Ajukan Lomba
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminBottomNavBar />
    </div>
  );
}
