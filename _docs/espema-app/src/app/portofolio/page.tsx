import { TopAppBar, Sidebar, AdminBottomNavBar } from "@/components/Navigation";

const ekskulSummary = [
  { icon: "sports_soccer", bg: "bg-[var(--color-secondary-container)]", iconColor: "text-[var(--color-on-secondary-container)]", border: "border-[var(--color-secondary)]", name: "Sepak Bola", pct: 92, color: "bg-[var(--color-secondary)]", textColor: "text-[var(--color-secondary)]" },
  { icon: "architecture", bg: "bg-[var(--color-primary-container)]", iconColor: "text-[var(--color-on-primary-container)]", border: "border-[var(--color-primary)]", name: "Pramuka (Wajib)", pct: 100, color: "bg-[var(--color-primary)]", textColor: "text-[var(--color-primary)]" },
  { icon: "translate", bg: "bg-[var(--color-tertiary-fixed)]", iconColor: "text-[var(--color-on-tertiary-fixed)]", border: "border-[var(--color-tertiary-container)]", name: "English Club", pct: 85, color: "bg-[var(--color-tertiary-container)]", textColor: "text-[var(--color-tertiary)]" },
];

const achievements = [
  { rank: "Juara 1", level: "Kabupaten", rankClass: "text-[var(--color-on-secondary-fixed-variant)] bg-[var(--color-secondary-container)]", title: "Lomba Futsal Antar SMP", date: "12 November 2023" },
  { rank: "Harapan 3", level: "Provinsi", rankClass: "text-[var(--color-on-primary-fixed-variant)] bg-[var(--color-primary-fixed)]", title: "Olimpiade Bahasa Inggris", date: "05 Oktober 2023" },
  { rank: "Peserta", level: "Nasional", rankClass: "text-[var(--color-on-tertiary-fixed-variant)] bg-[var(--color-tertiary-fixed)]", title: "Jamboree Pramuka Nasional", date: "20 Agustus 2023" },
];

export default function PortofolioPage() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen pb-24 lg:pb-0">
      <TopAppBar title="SMPN Manajemen" isAdmin />
      <Sidebar />

      <div className="flex max-w-[1280px] mx-auto min-h-[calc(100vh-64px)]">
        <main className="flex-1 lg:ml-72 p-4 lg:p-6 w-full pt-20 lg:pt-24">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--color-primary)]">Portofolio Siswa Digital</h2>
              <p className="text-base text-[var(--color-on-surface-variant)]">SIM Ekstrakurikuler SMPN 5 Klaten</p>
            </div>
            <button className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 text-sm">
              <span className="material-symbols-outlined text-base">download</span>
              <span>Download Rapor Ekskul</span>
            </button>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Student Profile */}
            <div className="col-span-12 lg:col-span-4 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 card-level-1 border-l-4 border-[var(--color-primary)]">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-[var(--color-secondary-container)] p-1 bg-[var(--color-surface-container-high)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: "60px" }}>person</span>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-[var(--color-secondary)] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-on-surface)]">Raditya Pratama</h3>
                <p className="text-xs text-[var(--color-on-surface-variant)]">Kelas 8B • NISN: 0092384102</p>
                <div className="grid grid-cols-2 gap-4 mt-6 w-full">
                  <div className="bg-[var(--color-surface-container-low)] p-3 rounded-lg">
                    <span className="block text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Total Ekskul</span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">3</span>
                  </div>
                  <div className="bg-[var(--color-surface-container-low)] p-3 rounded-lg">
                    <span className="block text-[10px] font-semibold text-[var(--color-on-surface-variant)]">Prestasi</span>
                    <span className="text-lg font-bold text-[var(--color-secondary)]">5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ekskul Summary */}
            <div className="col-span-12 lg:col-span-8 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 card-level-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--color-primary)]">groups</span>
                  Ringkasan Ekskul
                </h3>
                <span className="text-[10px] font-semibold bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-2 py-1 rounded-full">Semester Ganjil 2023/2024</span>
              </div>
              <div className="space-y-4">
                {ekskulSummary.map((e, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-container-low)] border-l-4 ${e.border} hover:bg-[var(--color-surface-container-high)] transition-all`}>
                    <div className={`w-12 h-12 rounded-xl ${e.bg} flex items-center justify-center ${e.iconColor}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{e.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-sm">{e.name}</span>
                        <span className={`font-bold text-sm ${e.textColor}`}>{e.pct}% Kehadiran</span>
                      </div>
                      <div className="w-full bg-[var(--color-outline-variant)] h-2 rounded-full overflow-hidden">
                        <div className={`${e.color} h-full rounded-full transition-all`} style={{ width: `${e.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Gallery */}
            <div className="col-span-12 bg-[var(--color-surface-container-lowest)] rounded-xl p-6 card-level-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                <h3 className="text-base font-semibold">Galeri Prestasi & Sertifikat</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {achievements.map((a, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl border border-[var(--color-outline-variant)] bg-white hover:shadow-lg transition-all duration-300">
                    <div className="h-40 overflow-hidden bg-gradient-to-br from-[var(--color-primary-fixed)] to-[var(--color-tertiary-fixed)] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: "60px", fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-semibold ${a.rankClass} px-2 py-0.5 rounded-full`}>{a.rank}</span>
                        <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)]">{a.level}</span>
                      </div>
                      <h4 className="font-bold text-[var(--color-on-surface)] text-sm line-clamp-1">{a.title}</h4>
                      <p className="text-xs text-[var(--color-on-surface-variant)]">{a.date}</p>
                    </div>
                  </div>
                ))}

                {/* Upload placeholder */}
                <button className="flex flex-col items-center justify-center min-h-[220px] rounded-xl border-2 border-dashed border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] hover:border-[var(--color-primary)] transition-all">
                  <span className="material-symbols-outlined text-[var(--color-primary)]" style={{ fontSize: "40px" }}>add_circle</span>
                  <span className="text-sm font-bold text-[var(--color-primary)] mt-2">Upload Prestasi Baru</span>
                  <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] mt-1">Maksimal 5MB (JPG/PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AdminBottomNavBar />
    </div>
  );
}
