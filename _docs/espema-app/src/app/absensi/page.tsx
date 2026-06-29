"use client";

import { useState } from "react";
import { TopAppBar, AdminBottomNavBar } from "@/components/Navigation";

interface Student {
  id: number;
  initials: string;
  name: string;
  nisn: string;
  attendance: "hadir" | "izin" | "sakit" | "alpa" | null;
}

const initialStudents: Student[] = [
  { id: 1, initials: "AN", name: "Aditya Nugraha", nisn: "009283741", attendance: "hadir" },
  { id: 2, initials: "BS", name: "Budi Santoso", nisn: "009283742", attendance: "sakit" },
  { id: 3, initials: "CL", name: "Citra Lestari", nisn: "009283743", attendance: "hadir" },
  { id: 4, initials: "DP", name: "Dimas Pratama", nisn: "009283744", attendance: "alpa" },
  { id: 5, initials: "EW", name: "Eka Wulandari", nisn: "009283745", attendance: null },
  { id: 6, initials: "FR", name: "Farhan Ramadan", nisn: "009283746", attendance: null },
];

const attendanceOptions = [
  { value: "hadir", label: "Hadir", color: "text-[var(--color-secondary)]", ring: "focus:ring-[var(--color-secondary-container)]" },
  { value: "izin", label: "Izin", color: "text-[var(--color-on-tertiary-container)]", ring: "focus:ring-[var(--color-tertiary-fixed)]" },
  { value: "sakit", label: "Sakit", color: "text-[var(--color-on-primary-container)]", ring: "focus:ring-[var(--color-primary-fixed)]" },
  { value: "alpa", label: "Alpa", color: "text-[var(--color-error)]", ring: "focus:ring-[var(--color-error-container)]" },
];

export default function AbsensiPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search)
  );

  const setAttendance = (id: number, val: Student["attendance"]) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, attendance: val } : s)));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const hadir = students.filter((s) => s.attendance === "hadir").length;
  const alpa = students.filter((s) => s.attendance === "alpa").length;

  return (
    <div className="bg-[var(--color-background)] min-h-screen pb-24">
      <TopAppBar title="SMPN Manajemen" isAdmin />

      <main className="max-w-[1280px] mx-auto px-4 pt-20">
        {/* Session Info */}
        <section className="mb-6">
          <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-6 card-level-1 border-l-4 border-[var(--color-primary)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1">Sesi Aktif</p>
                <h2 className="text-2xl font-bold text-[var(--color-on-surface)] mb-2">Ekskul Basket - Tim A</h2>
                <div className="flex items-center gap-3 text-[var(--color-on-surface-variant)]">
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  <span className="text-sm">Senin, 24 Mei 2024</span>
                  <span className="mx-1">•</span>
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span className="text-sm">15:00 - 17:00 WIB</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-4 py-3 rounded-lg flex flex-col items-center min-w-[80px]">
                  <span className="text-lg font-bold">{students.length}</span>
                  <span className="text-[10px] font-semibold">Siswa</span>
                </div>
                <div className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] px-4 py-3 rounded-lg flex flex-col items-center min-w-[80px]">
                  <span className="text-sm font-bold">Lapangan 1</span>
                  <span className="text-[10px] font-semibold">Lokasi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary chips */}
        <div className="flex gap-3 mb-4">
          <span className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] px-3 py-1 rounded-full text-xs font-semibold">Hadir: {hadir}</span>
          <span className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] px-3 py-1 rounded-full text-xs font-semibold">Alpa: {alpa}</span>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-base">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-[var(--color-surface-container-low)] border-none rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-primary-container)] outline-none"
              placeholder="Cari nama siswa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-1 px-4 py-2 text-[var(--color-primary)] font-bold hover:bg-[var(--color-surface-container-high)] rounded-xl transition-colors text-sm">
            <span className="material-symbols-outlined text-base">filter_list</span>
            <span className="hidden md:inline">Filter</span>
          </button>
        </div>

        {/* Attendance Table */}
        <div className="bg-[var(--color-surface-container-lowest)] rounded-xl card-level-1 overflow-hidden border border-[var(--color-outline-variant)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-container-low)] text-[var(--color-on-surface-variant)] border-b border-[var(--color-outline-variant)]">
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider">Siswa</th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-center">Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-[var(--color-surface-container-lowest)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-highest)] flex-shrink-0 flex items-center justify-center font-bold text-[var(--color-primary)] text-sm">
                          {student.initials}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-on-surface)] text-sm">{student.name}</p>
                          <p className="text-xs text-[var(--color-on-surface-variant)]">NISN: {student.nisn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-4 md:gap-8">
                        {attendanceOptions.map((opt) => (
                          <label key={opt.value} className="flex flex-col items-center gap-1 cursor-pointer group">
                            <input
                              type="radio"
                              name={`att_${student.id}`}
                              value={opt.value}
                              checked={student.attendance === opt.value}
                              onChange={() => setAttendance(student.id, opt.value as Student["attendance"])}
                              className={`w-5 h-5 ${opt.color} border-[var(--color-outline)] ${opt.ring}`}
                            />
                            <span className={`text-[10px] font-semibold text-[var(--color-on-surface-variant)] group-hover:${opt.color} transition-colors`}>
                              {opt.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Bar */}
          <div className="p-6 bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[var(--color-on-surface-variant)]">
              Menampilkan <span className="font-bold text-[var(--color-on-surface)]">{filtered.length}</span> dari <span className="font-bold text-[var(--color-on-surface)]">{students.length}</span> siswa.
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-3 rounded-xl text-[var(--color-primary)] font-bold hover:bg-[var(--color-surface-container-high)] transition-colors text-sm active:scale-95">
                Batal
              </button>
              <button
                onClick={handleSave}
                className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-all text-sm active:scale-95 ${
                  saved ? "bg-[var(--color-secondary)]" : "bg-[var(--color-primary)] hover:bg-[var(--color-primary-container)]"
                }`}
              >
                {saved ? "✓ Tersimpan" : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <AdminBottomNavBar />
    </div>
  );
}
