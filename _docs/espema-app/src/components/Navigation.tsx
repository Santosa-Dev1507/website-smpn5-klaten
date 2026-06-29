"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const adminNavItems: NavItem[] = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/ekskul", icon: "list_alt", label: "Daftar Ekskul" },
  { href: "/jadwal", icon: "calendar_month", label: "Jadwal Kompetisi" },
  { href: "/absensi", icon: "assessment", label: "Rekap Kehadiran" },
  { href: "/laporan", icon: "analytics", label: "Pusat Laporan" },
];

const studentNavItems: NavItem[] = [
  { href: "/beranda", icon: "home", label: "Beranda" },
  { href: "/ekskul", icon: "groups", label: "Ekskul" },
  { href: "/jadwal", icon: "emoji_events", label: "Lomba" },
  { href: "/absensi", icon: "fact_check", label: "Absen" },
  { href: "/portofolio", icon: "person", label: "Profil" },
];

export function Sidebar({ items = adminNavItems }: { items?: NavItem[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col p-4 gap-2 fixed left-0 top-16 h-[calc(100vh-64px)] w-72 bg-[var(--color-surface)] border-r border-[var(--color-outline-variant)] z-30 overflow-y-auto">
      <div className="mb-4 p-4 bg-[var(--color-surface-container-low)] rounded-xl">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-on-secondary-container)]">school</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-primary)]">Admin Sekolah</h3>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Manajemen Akademik</p>
          </div>
        </div>
        <p className="text-xs text-[var(--color-outline)] px-1">SMPN 5 Klaten</p>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-4 px-4 py-2 bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] font-semibold rounded-r-full transition-colors"
                  : "flex items-center gap-4 px-4 py-2 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] rounded-r-full transition-colors"
              }
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        <div className="h-px bg-[var(--color-outline-variant)] my-2" />

        <Link
          href="/pengaturan"
          className="flex items-center gap-4 px-4 py-2 text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] rounded-r-full transition-colors"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm">Pengaturan</span>
        </Link>
      </nav>
    </aside>
  );
}

export function TopAppBar({
  title = "SMPN Manajemen",
  showSearch = false,
  isAdmin = false,
}: {
  title?: string;
  showSearch?: boolean;
  isAdmin?: boolean;
}) {
  return (
    <header className="bg-[var(--color-surface-bright)] shadow-sm fixed top-0 w-full z-40 h-16 flex justify-between items-center px-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-on-primary-container)]">
          <span className="material-symbols-outlined">school</span>
        </div>
        <h1 className="text-base font-bold text-[var(--color-primary)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <button className="p-2 hover:bg-[var(--color-surface-container-low)] transition-colors rounded-full">
            <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">search</span>
          </button>
        )}
        <button className="p-2 hover:bg-[var(--color-surface-container-low)] transition-colors rounded-full relative">
          <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-error)] rounded-full" />
        </button>
        {isAdmin ? (
          <div className="hidden md:flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-[var(--color-on-surface)]">Admin Sekolah</p>
              <p className="text-[10px] text-[var(--color-on-surface-variant)]">SMPN 5 Klaten</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary-container)] flex items-center justify-center text-[var(--color-on-secondary-container)] text-xs font-bold">
            AF
          </div>
        )}
      </div>
    </header>
  );
}

export function BottomNavBar({ items = studentNavItems }: { items?: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--color-surface-container-lowest)] shadow-lg border-t border-[var(--color-outline-variant)] flex justify-around items-center px-4 py-2 z-50 rounded-t-xl">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "flex flex-col items-center justify-center bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] rounded-full px-4 py-1 transition-all"
                : "flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-all p-1 rounded-lg"
            }
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminBottomNavBar() {
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: "/admin", icon: "home", label: "Beranda" },
    { href: "/ekskul", icon: "groups", label: "Ekskul" },
    { href: "/jadwal", icon: "emoji_events", label: "Lomba" },
    { href: "/absensi", icon: "fact_check", label: "Absen" },
    { href: "/laporan", icon: "person", label: "Profil" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--color-surface-container-lowest)] shadow-lg border-t border-[var(--color-outline-variant)] flex justify-around items-center px-4 py-2 z-50 rounded-t-xl">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isActive
                ? "flex flex-col items-center justify-center bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] rounded-full px-4 py-1 transition-all"
                : "flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]/50 transition-all p-1 rounded-lg"
            }
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
