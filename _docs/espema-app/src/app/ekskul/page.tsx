"use client";

import { useState } from "react";
import { TopAppBar, Sidebar, AdminBottomNavBar } from "@/components/Navigation";

const filters = [
  { label: "Semua", icon: null },
  { label: "Olahraga", icon: "sports_soccer" },
  { label: "Seni", icon: "palette" },
  { label: "Sains", icon: "psychology" },
  { label: "Sosial", icon: "diversity_3" },
];

const ekskulList = [
  {
    category: "Olahraga",
    title: "Klub Basket (Bimasakti)",
    description: "Pelatihan teknik dasar hingga strategi kompetisi profesional bersama pelatih berpengalaman.",
    schedule: "Setiap Selasa & Kamis",
    time: "15:30 - 17:00 WIB",
    rating: "4.9",
    border: "border-[var(--color-secondary)]",
    icon: "sports_basketball",
    iconBg: "bg-[var(--color-secondary)]",
    primary: true,
  },
  {
    category: "Seni",
    title: "Paduan Suara (Gita Swara)",
    description: "Mengembangkan teknik vokal harmonis untuk performa panggung dan kompetisi nasional.",
    schedule: "Setiap Rabu & Jumat",
    time: "15:00 - 16:30 WIB",
    rating: "4.8",
    border: "border-[var(--color-on-tertiary-container)]",
    icon: "music_note",
    iconBg: "bg-[var(--color-tertiary-container)]",
    primary: false,
  },
  {
    category: "Sains",
    title: "Klub Robotik (RoboTech)",
    description: "Eksplorasi teknologi masa depan melalui pemrograman dan perakitan robotika cerdas.",
    schedule: "Setiap Senin",
    time: "15:30 - 17:30 WIB",
    rating: "5.0",
    border: "border-[var(--color-on-tertiary-fixed-variant)]",
    icon: "precision_manufacturing",
    iconBg: "bg-[var(--color-primary)]",
    primary: true,
  },
  {
    category: "Sosial",
    title: "Palang Merah Remaja",
    description: "Pelajari pertolongan pertama dan kembangkan jiwa kemanusiaan melalui aksi sosial nyata.",
    schedule: "Setiap Kamis",
    time: "15:00 - 16:30 WIB",
    rating: "4.7",
    border: "border-[var(--color-error)]",
    icon: "favorite",
    iconBg: "bg-[var(--color-error)]",
    primary: false,
  },
  {
    category: "Olahraga",
    title: "Paskibra",
    description: "Latihan baris berbaris dan kepemimpinan untuk kompetisi tingkat kota dan provinsi.",
    schedule: "Setiap Sabtu",
    time: "07:00 - 10:00 WIB",
    rating: "4.8",
    border: "border-[var(--color-primary)]",
    icon: "flag",
    iconBg: "bg-[var(--color-tertiary)]",
    primary: true,
  },
  {
    category: "Seni",
    title: "Karawitan",
    description: "Melestarikan seni gamelan Jawa dalam lingkungan sekolah modern SMPN 5 Klaten.",
    schedule: "Setiap Jumat",
    time: "14:00 - 16:00 WIB",
    rating: "4.6",
    border: "border-[var(--color-surface-tint)]",
    icon: "music_video",
    iconBg: "bg-[var(--color-surface-tint)]",
    primary: false,
  },
];

const categoryColors: Record<string, string> = {
  Olahraga: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  Seni: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  Sains: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  Sosial: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
};

export default function EkskulPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = ekskulList.filter((e) => {
    const matchFilter = activeFilter === "Semua" || e.category === activeFilter;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      <TopAppBar title="SMPN Manajemen" isAdmin />
      <Sidebar />

      <div className="flex pt-16 pb-20 md:pb-0 min-h-screen">
        <main className="flex-1 lg:ml-72 p-4 md:p-6">
          <div className="max-w-[1280px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold text-[var(--color-primary)]">Ekstrakurikuler</h2>
              <p className="text-base text-[var(--color-on-surface-variant)] max-w-2xl">
                Temukan potensi dan bakatmu melalui berbagai program ekstrakurikuler unggulan di SMPN 5 Klaten. Daftarkan diri segera untuk semester ini.
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-3 flex overflow-x-auto pb-2 no-scrollbar gap-2">
                {filters.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setActiveFilter(f.label)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeFilter === f.label
                        ? "bg-[var(--color-primary)] text-white shadow-md"
                        : "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]"
                    }`}
                  >
                    {f.icon && <span className="material-symbols-outlined text-base">{f.icon}</span>}
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-base">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-container-low)] border-none rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary-container)] outline-none"
                  placeholder="Cari kegiatan..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((ekskul, i) => (
                <div key={i} className="bg-[var(--color-surface-container-lowest)] rounded-xl overflow-hidden card-level-1 hover:shadow-lg transition-all border border-[var(--color-outline-variant)]/30 flex flex-col h-full">
                  {/* Card Header Visual */}
                  <div className={`relative h-48 w-full overflow-hidden bg-gradient-to-br ${ekskul.iconBg === "bg-[var(--color-secondary)]" ? "from-[var(--color-secondary)] to-teal-800" : "from-[var(--color-primary)] to-blue-900"}`}>
                    <div className={`absolute inset-0 ${ekskul.iconBg} opacity-80`} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-15">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: "100px", fontVariationSettings: "'FILL' 1" }}>{ekskul.icon}</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`${categoryColors[ekskul.category] ?? "bg-white/20 text-white"} px-3 py-1 rounded-lg text-xs font-semibold`}>{ekskul.category}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className={`p-6 flex flex-col flex-1 border-l-4 ${ekskul.border}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-[var(--color-primary)] flex-1 pr-2">{ekskul.title}</h3>
                      <div className="flex items-center gap-1 text-[var(--color-secondary)]">
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-xs font-semibold">{ekskul.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mb-4 flex-1">{ekskul.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-outline)]">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span>{ekskul.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-outline)]">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{ekskul.time}</span>
                      </div>
                    </div>
                    <button
                      className={`w-full font-bold py-3 rounded-xl active:scale-95 transition-all text-sm ${
                        ekskul.primary
                          ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-container)]"
                          : "border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] hover:bg-[var(--color-secondary-container)]"
                      }`}
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-[var(--color-on-surface-variant)]">
                <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
                <p className="text-base font-semibold">Tidak ada ekskul yang ditemukan</p>
              </div>
            )}

            {/* Load More */}
            <div className="flex justify-center py-6">
              <button className="flex items-center gap-2 text-[var(--color-primary)] font-bold hover:underline text-sm">
                <span>Lihat Semua Kegiatan</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <AdminBottomNavBar />
    </div>
  );
}
