import Link from "next/link";
import { TopAppBar, Sidebar, AdminBottomNavBar } from "@/components/Navigation";

const reportTypes = [
  {
    icon: "analytics",
    bg: "bg-[var(--color-secondary-container)]",
    iconColor: "text-[var(--color-on-secondary-container)]",
    badgeClass: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
    border: "bg-[var(--color-secondary)]",
    badge: "Internal",
    title: "Laporan Real (Internal)",
    desc: "Laporan data lapangan yang mencerminkan kondisi aktual tanpa modifikasi. Digunakan untuk evaluasi manajemen internal sekolah.",
    btnLabel: "Pilih Laporan",
    btnIcon: "arrow_forward",
    href: "/laporan/real",
  },
  {
    icon: "fact_check",
    bg: "bg-[var(--color-tertiary-fixed)]",
    iconColor: "text-[var(--color-on-tertiary-fixed)]",
    badgeClass: "bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)]",
    border: "bg-[var(--color-on-tertiary-fixed-variant)]",
    badge: "Eksternal",
    title: "Laporan BOS (Eksternal)",
    desc: "Laporan yang dapat disesuaikan untuk kebutuhan kepatuhan administratif dan audit eksternal pemerintah sesuai regulasi BOS.",
    btnLabel: "Sesuaikan Laporan",
    btnIcon: "edit_note",
    href: "/laporan/bos",
  },
  {
    icon: "emoji_events",
    bg: "bg-[var(--color-primary-fixed)]",
    iconColor: "text-[var(--color-on-primary-fixed)]",
    badgeClass: "bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed)]",
    border: "bg-[var(--color-surface-tint)]",
    badge: "Prestasi",
    title: "Rekapitulasi Prestasi",
    desc: "Ringkasan komprehensif pencapaian akademik dan non-akademik siswa di berbagai kompetisi dan kegiatan ekskul.",
    btnLabel: "Lihat Rekap",
    btnIcon: "visibility",
    href: "/laporan/prestasi",
  },
];

const recentReports = [
  { type: "Laporan Real Semester Ganjil", date: "12 Okt 2023", admin: "Budi Santoso", statusClass: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]", status: "Selesai" },
  { type: "Laporan Dana BOS Triwulan III", date: "10 Okt 2023", admin: "Siti Aminah", statusClass: "bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)]", status: "Drafting" },
  { type: "Rekap Prestasi FLS2N", date: "05 Okt 2023", admin: "Budi Santoso", statusClass: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]", status: "Selesai" },
];

export default function LaporanPage() {
  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      <TopAppBar title="SMPN Manajemen" isAdmin />
      <Sidebar />

      <main className="pt-24 pb-32 lg:pb-12 px-4 lg:ml-72 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-1">Pilih Jenis Laporan</h2>
            <p className="text-base text-[var(--color-on-surface-variant)]">Pilih format laporan yang sesuai dengan kebutuhan pelaporan operasional sekolah Anda.</p>
          </header>

          {/* Report Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reportTypes.map((r, i) => (
              <div key={i} className="group bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)] rounded-xl p-6 card-level-1 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${r.border}`} />
                <div className="mb-6 flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-full ${r.bg} ${r.iconColor} flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-base">{r.icon}</span>
                  </div>
                  <span className={`${r.badgeClass} text-xs px-2 py-0.5 rounded-full font-semibold`}>{r.badge}</span>
                </div>
                <h3 className="text-base font-semibold text-[var(--color-primary)] mb-2">{r.title}</h3>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-6">{r.desc}</p>
                <Link
                  href={r.href}
                  className="w-full py-3 px-6 bg-[var(--color-primary)] text-white font-bold rounded-lg hover:bg-[var(--color-primary-container)] transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <span>{r.btnLabel}</span>
                  <span className="material-symbols-outlined text-sm">{r.btnIcon}</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Recent Activity Table */}
          <section>
            <h4 className="text-base font-semibold text-[var(--color-primary)] mb-4">Ringkasan Aktivitas Terakhir</h4>
            <div className="bg-[var(--color-surface-container)] overflow-hidden rounded-xl border border-[var(--color-outline-variant)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--color-surface-container-high)]">
                    {["Jenis Laporan", "Tanggal", "Admin", "Status"].map((h) => (
                      <th key={h} className="p-4 text-[10px] font-semibold text-[var(--color-on-surface)] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]">
                  {recentReports.map((r, i) => (
                    <tr key={i} className="hover:bg-[var(--color-surface-container-low)] transition-colors">
                      <td className="p-4 text-sm font-semibold">{r.type}</td>
                      <td className="p-4 text-sm text-[var(--color-on-surface-variant)]">{r.date}</td>
                      <td className="p-4 text-sm text-[var(--color-on-surface-variant)]">{r.admin}</td>
                      <td className="p-4">
                        <span className={`${r.statusClass} text-xs px-2 py-0.5 rounded-full font-semibold`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <AdminBottomNavBar />
    </div>
  );
}
