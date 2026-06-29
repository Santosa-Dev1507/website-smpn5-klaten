import Link from "next/link";
import { TopAppBar, Sidebar, AdminBottomNavBar } from "@/components/Navigation";

const stats = [
  {
    icon: "groups",
    color: "secondary",
    label: "Siswa Aktif",
    value: "1,248",
    sub: "+12% dari semester lalu",
    border: "border-[var(--color-secondary)]",
    iconColor: "text-[var(--color-secondary)]",
    badge: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  },
  {
    icon: "category",
    color: "primary",
    label: "Unit Ekskul",
    value: "24",
    sub: "Kesenian, Olahraga, & Sains",
    border: "border-[var(--color-primary)]",
    iconColor: "text-[var(--color-primary)]",
    badge: "bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]",
  },
  {
    icon: "emoji_events",
    color: "tertiary",
    label: "Prestasi",
    value: "15",
    sub: "Penghargaan bulan ini",
    border: "border-[var(--color-tertiary-fixed)]",
    iconColor: "text-[var(--color-on-tertiary-container)]",
    badge: "bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed-variant)]",
  },
];

const competitions = [
  { name: "Olimpiade Sains Nasional", ekskul: "Klub Sains", date: "15 Okt 2023", status: "TERDAFTAR", statusClass: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]" },
  { name: "Lomba Baris Berbaris Klaten", ekskul: "Paskibra", date: "22 Okt 2023", status: "PERSIAPAN", statusClass: "bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed-variant)]" },
  { name: "Turnamen Futsal Cup V", ekskul: "Futsal", date: "05 Nov 2023", status: "MENUNGGU", statusClass: "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]" },
  { name: "Festival Karawitan Jateng", ekskul: "Seni Musik", date: "12 Nov 2023", status: "TERDAFTAR", statusClass: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]" },
];

const activities = [
  { icon: "check_circle", bg: "bg-[var(--color-secondary-container)]", iconColor: "text-[var(--color-secondary)]", title: "Absensi Pramuka selesai", time: "2 jam yang lalu" },
  { icon: "person_add", bg: "bg-[var(--color-primary-container)]", iconColor: "text-[var(--color-on-primary-container)]", title: "5 Siswa baru di Ekskul Basket", time: "5 jam yang lalu" },
  { icon: "warning", bg: "bg-[var(--color-error-container)]", iconColor: "text-[var(--color-error)]", title: "Laporan Keuangan Perlu TTD", time: "Kemarin" },
];

export default function AdminDashboardPage() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      <TopAppBar title="SMPN Manajemen" isAdmin />
      <Sidebar />

      <main className="lg:ml-72 pt-24 pb-28 px-4 lg:px-6 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">Ringkasan Ekstrakurikuler</h2>
            <p className="text-base text-[var(--color-on-surface-variant)] mt-1">Selamat datang kembali di panel administrasi SMPN 5 Klaten.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/jadwal/tambah"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-surface-bright)] border border-[var(--color-secondary)] text-[var(--color-secondary)] font-bold rounded-xl hover:bg-[var(--color-surface-container-low)] active:scale-95 transition-all text-sm">
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Tambah Lomba</span>
            </Link>
            <Link href="/laporan"
              className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm">
              <span className="material-symbols-outlined text-base">description</span>
              <span>Generate Laporan BOS</span>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((s) => (
            <div key={s.label} className={`bg-[var(--color-surface-container-lowest)] p-6 rounded-xl border-l-4 ${s.border} card-level-1`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`material-symbols-outlined ${s.iconColor} text-4xl`}>{s.icon}</span>
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${s.badge} px-2 py-1 rounded-full`}>{s.label}</span>
              </div>
              <div className="text-3xl font-bold text-[var(--color-on-surface)]">{s.value}</div>
              <div className="text-xs text-[var(--color-on-surface-variant)] mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Competition Table + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Competition Table */}
          <div className="lg:col-span-2 bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden card-level-1">
            <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center">
              <h3 className="text-base font-semibold text-[var(--color-primary)]">Kompetisi Mendatang</h3>
              <Link href="/jadwal" className="text-sm text-[var(--color-secondary)] hover:underline font-semibold">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--color-surface-container-low)]">
                  <tr>
                    {["Nama Kompetisi", "Cabang Ekskul", "Tanggal", "Status"].map((h) => (
                      <th key={h} className="p-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {competitions.map((c, i) => (
                    <tr key={i} className="border-b border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] transition-colors">
                      <td className="p-4 font-semibold">{c.name}</td>
                      <td className="p-4 text-[var(--color-on-surface-variant)]">{c.ekskul}</td>
                      <td className="p-4 text-[var(--color-on-surface-variant)]">{c.date}</td>
                      <td className="p-4">
                        <span className={`${c.statusClass} px-2 py-1 rounded-full text-[10px] font-bold`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="flex flex-col gap-6">
            {/* Recent Activity */}
            <div className="bg-[var(--color-surface-container-lowest)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden card-level-1">
              <div className="p-6 border-b border-[var(--color-outline-variant)]">
                <h3 className="text-base font-semibold text-[var(--color-primary)]">Aktivitas Terbaru</h3>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {activities.map((a, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full ${a.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className={`material-symbols-outlined ${a.iconColor} text-base`}>{a.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-on-surface)]">{a.title}</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)]">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Card */}
            <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer card-level-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 opacity-10 flex items-center justify-end pr-4">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "120px", fontVariationSettings: "'FILL' 1" }}>school</span>
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-white font-bold text-base">Dokumentasi Sekolah</p>
                <p className="text-white/70 text-sm">Lihat galeri kegiatan ekskul terbaru</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AdminBottomNavBar />
    </div>
  );
}
