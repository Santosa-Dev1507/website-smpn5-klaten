"use client";

import { useState } from "react";
import { TopAppBar, AdminBottomNavBar } from "@/components/Navigation";

const generateHistory = [
  { date: "14 Mei 2024", period: "Apr - Mei 2024", admin: "Admin Utama", format: "PDF", formatClass: "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]" },
  { date: "02 Mei 2024", period: "Jan - Mar 2024", admin: "Admin Keuangan", format: "XLSX", formatClass: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]" },
];

export default function KonfigurasiLaporanBOSPage() {
  const [useRealData, setUseRealData] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = (type: string) => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      <header className="bg-[var(--color-surface-bright)] shadow-sm flex justify-between items-center w-full px-6 h-16 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-[var(--color-surface-container-low)] rounded-full transition-colors">
            <span className="material-symbols-outlined text-[var(--color-primary)]">arrow_back</span>
          </button>
          <h1 className="text-base font-bold text-[var(--color-primary)]">Konfigurasi Laporan BOS</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[var(--color-surface-container-low)] rounded-full transition-colors">
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-on-primary-container)]">person</span>
          </div>
        </div>
      </header>

      <div className="lg:flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col p-4 gap-2 fixed left-0 h-full w-72 border-r border-[var(--color-outline-variant)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-4 mb-8 p-2">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white">school</span>
            </div>
            <div>
              <p className="text-[var(--color-primary)] font-bold text-sm">SMPN 5 Klaten</p>
              <p className="text-[var(--color-on-surface-variant)] text-xs">Admin Sekolah</p>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { icon: "dashboard", label: "Dashboard", href: "/admin" },
              { icon: "assessment", label: "Laporan BOS", href: "/laporan/bos", active: true },
              { icon: "list_alt", label: "Daftar Ekskul", href: "/ekskul" },
              { icon: "calendar_month", label: "Jadwal Kompetisi", href: "/jadwal" },
              { icon: "settings", label: "Pengaturan", href: "/pengaturan" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-2 rounded-r-full transition-colors text-sm ${
                  item.active
                    ? "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] font-semibold"
                    : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]"
                }`}
              >
                <span className="material-symbols-outlined text-base">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        <main className="lg:ml-72 flex-1 p-6 mb-20 md:mb-0">
          <div className="max-w-4xl mx-auto space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 card-level-1 border border-[var(--color-outline-variant)]">
                  <h2 className="text-base font-bold text-[var(--color-primary)] mb-4">Parameter Laporan</h2>
                  <form className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[var(--color-on-surface)] font-semibold text-sm">Nama Pembina (Custom)</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-base">person</span>
                        <input
                          className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-sm"
                          placeholder="Masukkan nama pembina..."
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[var(--color-on-surface)] font-semibold text-sm">Jumlah Pertemuan</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-base">groups</span>
                          <input
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm"
                            placeholder="Contoh: 12"
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[var(--color-on-surface)] font-semibold text-sm">Jumlah Peserta</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-base">group_add</span>
                          <input
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm"
                            placeholder="Contoh: 45"
                            type="number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[var(--color-on-surface)] font-semibold text-sm">Periode Laporan (Rentang Tanggal)</label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-sm">calendar_today</span>
                          <input
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm"
                            type="date"
                          />
                        </div>
                        <span className="text-[var(--color-outline)] text-sm">s/d</span>
                        <div className="relative flex-1">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-sm">calendar_month</span>
                          <input
                            className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm"
                            type="date"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Toggle Real Data */}
                <div className="bg-[var(--color-primary-container)] rounded-xl p-6 flex items-center justify-between card-level-1">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[var(--color-primary)]">database</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Gunakan Data Real</p>
                      <p className="text-[var(--color-on-primary-container)] text-xs">Sinkronisasi otomatis dengan database absensi</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUseRealData(!useRealData)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      useRealData ? "bg-[var(--color-secondary)]" : "bg-[var(--color-on-primary-container)]"
                    }`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${useRealData ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                <div className="bg-[var(--color-surface-container-low)] border-l-4 border-[var(--color-secondary)] rounded-xl p-6 card-level-1">
                  <h3 className="font-bold text-[var(--color-primary)] mb-3 flex items-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-base">info</span>
                    Ringkasan Laporan
                  </h3>
                  <div className="space-y-3 text-[var(--color-on-surface-variant)] text-xs">
                    <div className="flex justify-between">
                      <span>Tipe Laporan:</span>
                      <span className="font-semibold text-[var(--color-on-surface)]">Eksternal (BOS)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status Data:</span>
                      <span className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {useRealData ? "Data Real" : "Disesuaikan"}
                      </span>
                    </div>
                    <hr className="border-[var(--color-outline-variant)]" />
                    <p className="italic text-[10px]">Pastikan semua parameter sesuai dengan Juknis BOS terbaru sebelum melakukan generate.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleGenerate("pdf")}
                    className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-sm"
                  >
                    <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                    {generating ? "Generating..." : "Generate PDF"}
                  </button>
                  <button
                    onClick={() => handleGenerate("xlsx")}
                    className="w-full border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[var(--color-secondary-container)] transition-all text-sm"
                  >
                    <span className="material-symbols-outlined text-base">table_view</span>
                    Ekspor Excel
                  </button>
                </div>

                {/* Preview image placeholder */}
                <div className="rounded-xl overflow-hidden card-level-1 aspect-video relative bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white opacity-30" style={{ fontSize: "80px" }}>description</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-semibold">Tinjauan Draft Laporan</p>
                  </div>
                </div>
              </aside>
            </section>

            {/* History Table */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden card-level-1">
              <div className="px-6 py-4 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container-low)]">
                <h3 className="font-bold text-[var(--color-primary)] text-sm">Riwayat Generate Laporan</h3>
                <button className="text-[var(--color-primary)] font-semibold text-xs flex items-center gap-1">
                  Lihat Semua <span className="material-symbols-outlined text-xs">chevron_right</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]">
                      {["Tanggal", "Periode", "Oleh", "Format", "Aksi"].map((h) => (
                        <th key={h} className="px-6 py-4 font-bold text-[var(--color-on-surface)] text-xs">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-outline-variant)]">
                    {generateHistory.map((r, i) => (
                      <tr key={i} className="hover:bg-[var(--color-surface-container-low)] transition-colors">
                        <td className="px-6 py-4 text-xs">{r.date}</td>
                        <td className="px-6 py-4 text-xs">{r.period}</td>
                        <td className="px-6 py-4 text-xs">{r.admin}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 ${r.formatClass} rounded-lg text-[10px] font-bold uppercase tracking-wider`}>{r.format}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-[var(--color-primary)] hover:underline font-semibold text-xs">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminBottomNavBar />
    </div>
  );
}
