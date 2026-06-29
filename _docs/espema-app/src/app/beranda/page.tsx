import Link from "next/link";
import { TopAppBar, BottomNavBar } from "@/components/Navigation";

const schedule = [
  { time: "07:30", end: "09:00", subject: "Matematika", room: "Ruang 204", teacher: "Bp. Hendra", active: true },
  { time: "09:15", end: "10:45", subject: "Bahasa Indonesia", room: "Ruang 102", teacher: "Ibu Sari", active: false },
  { time: "11:00", end: "12:30", subject: "IPA Terpadu", room: "Lab Biologi", teacher: "Bp. Anwar", active: false },
];

const achievements = [
  {
    icon: "emoji_events",
    title: "Juara 1 Lomba Sains",
    sub: "Tingkat Kota Klaten",
    date: "12 Mei 2024",
  },
  {
    icon: "military_tech",
    title: "Siswa Teladan Mei",
    sub: "Kehadiran 100%",
    date: "1 Mei 2024",
  },
];

const ekskulCards = [
  {
    name: "Basket",
    schedule: "Selasa, 15:30",
    bg: "from-[var(--color-primary)] to-blue-800",
    icon: "sports_basketball",
  },
  {
    name: "Musik",
    schedule: "Kamis, 15:30",
    bg: "from-[var(--color-secondary)] to-teal-800",
    icon: "music_note",
  },
];

const attendanceWeeks = [90, 100, 85, 95];

export default function BerandaSiswaPage() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen pb-32">
      <TopAppBar title="SMPN Manajemen" />

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 mt-20">
        {/* Greeting */}
        <section className="mb-8">
          <div className="flex flex-col gap-1 mb-6">
            <span className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-widest">Selamat Datang</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-on-surface)]">Halo, Ahmad Fauzi</h2>
            <p className="text-sm text-[var(--color-on-surface-variant)]">Senin, 24 Mei 2024 • Semester Genap</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="md:col-span-8 flex flex-col gap-6">
              {/* Today's Schedule */}
              <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 card-level-1 border-l-4 border-[var(--color-primary)]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold text-[var(--color-on-surface)]">Jadwal Hari Ini</h3>
                  <span className="text-[10px] font-semibold text-[var(--color-secondary)] bg-[var(--color-secondary-container)] px-2 py-1 rounded-full">3 Mata Pelajaran</span>
                </div>
                <div className="space-y-3">
                  {schedule.map((s, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] transition-colors ${s.active ? "bg-[var(--color-surface-container-low)]" : "bg-[var(--color-surface-container-lowest)]"}`}>
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${s.active ? "bg-[var(--color-primary)]" : "bg-[var(--color-surface-container-high)]"}`}>
                        <span className={`text-[10px] font-bold ${s.active ? "text-white" : "text-[var(--color-on-surface)]"}`}>{s.time}</span>
                        <span className={`text-[10px] ${s.active ? "text-white/80" : "text-[var(--color-on-surface-variant)]"}`}>{s.end}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[var(--color-on-surface)] text-sm">{s.subject}</h4>
                        <p className="text-xs text-[var(--color-on-surface-variant)]">{s.room} • {s.teacher}</p>
                      </div>
                      <span className={`material-symbols-outlined text-sm ${s.active ? "text-[var(--color-primary)]" : "text-[var(--color-outline)]"}`}>
                        {s.active ? "arrow_forward_ios" : "schedule"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ekskul Cards */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-semibold text-[var(--color-on-surface)]">Ekskul Saya</h3>
                  <Link href="/ekskul" className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">Lihat Semua</Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {ekskulCards.map((e, i) => (
                    <div key={i} className="relative overflow-hidden rounded-xl h-40 group cursor-pointer card-level-1">
                      <div className={`absolute inset-0 bg-gradient-to-br ${e.bg}`} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span className="material-symbols-outlined text-white" style={{ fontSize: "80px", fontVariationSettings: "'FILL' 1" }}>{e.icon}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-white font-bold text-sm block">{e.name}</span>
                        <span className="text-white/80 text-xs">{e.schedule}</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-[var(--color-secondary)] text-white text-[10px] font-bold px-2 py-0.5 rounded">AKTIF</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Achievement Card */}
              <div className="bg-[var(--color-primary)] text-white rounded-xl p-6 card-level-2 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <span className="material-symbols-outlined text-white" style={{ fontSize: "120px", fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                </div>
                <h3 className="text-base font-semibold mb-4 relative z-10">Prestasi Terbaru</h3>
                <div className="space-y-4 relative z-10">
                  {achievements.map((a, i) => (
                    <div key={i} className={`flex gap-4 ${i < achievements.length - 1 ? "border-b border-white/10 pb-4" : ""}`}>
                      <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[var(--color-on-secondary-container)] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{a.title}</h4>
                        <p className="text-white/70 text-xs">{a.sub}</p>
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded mt-1 inline-block">{a.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/portofolio" className="block w-full mt-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg font-bold text-xs text-center uppercase tracking-wider hover:opacity-90">
                  Lihat Semua Sertifikat
                </Link>
              </div>

              {/* Attendance Stats */}
              <div className="bg-[var(--color-surface-container-low)] rounded-xl p-6 border border-[var(--color-outline-variant)] card-level-1">
                <h3 className="text-base font-semibold text-[var(--color-on-surface)] mb-4">Statistik Kehadiran</h3>
                <div className="flex items-end justify-between gap-2 h-32 mb-4 px-2">
                  {attendanceWeeks.map((pct, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-full bg-[var(--color-secondary)] rounded-t-sm transition-all"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[10px] text-[var(--color-on-surface-variant)]">M{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-[var(--color-outline-variant)]">
                  <span className="text-[var(--color-on-surface-variant)]">Kehadiran Bulan Ini</span>
                  <span className="font-bold text-[var(--color-secondary)]">92.5%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNavBar />
    </div>
  );
}
