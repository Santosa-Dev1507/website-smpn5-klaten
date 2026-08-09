"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Bus, MapPin, User, X, ChevronDown } from "lucide-react";
import styles from "./denah.module.css";
import type { KursiSiswa } from "@/lib/kokurikuler";

interface Props {
  /** Pre-loaded dari server jika tersedia, kosong jika GAS belum dikonfigurasi */
  initialData?: KursiSiswa[];
}

// Default bus layout: 40 kursi per bus, layout 2-2 (baris A-B | C-D)
const SEATS_PER_BUS = 40;
const ROWS = 10; // 10 baris × 4 kursi = 40

/** Posisi kursi pada grid 2-2: 1-10 = kiri, 11-20 = kanan blok A, dst. */
function getSeatPosition(nomor: number): { row: number; col: 'A' | 'B' | 'C' | 'D' } {
  const idx = (Number(nomor) - 1) % SEATS_PER_BUS;
  const row = Math.floor(idx / 4) + 1;
  const colIdx = idx % 4;
  const cols: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  return { row, col: cols[colIdx] };
}

export default function DenahKursi({ initialData = [] }: Props) {
  const [allData, setAllData]           = useState<KursiSiswa[]>(initialData);
  const [loading, setLoading]           = useState(initialData.length === 0);
  const [query, setQuery]               = useState("");
  const [activeBus, setActiveBus]       = useState<string>("");
  const [highlightNomor, setHighlight]  = useState<string | null>(null);
  const [foundSiswa, setFoundSiswa]     = useState<KursiSiswa | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch jika data belum ada
  useEffect(() => {
    if (initialData.length > 0) { setLoading(false); return; }
    fetch("/api/kokurikuler/data?tab=kursi")
      .then(r => r.json())
      .then(json => {
        setAllData(json.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [initialData.length]);

  // Daftar bus unik
  const buses = Array.from(new Set(allData.map(k => k.bus_id))).sort();

  useEffect(() => {
    if (buses.length > 0 && !activeBus) setActiveBus(buses[0]);
  }, [buses, activeBus]);

  // Data kursi per bus aktif
  const busSiswa = allData.filter(k => k.bus_id === activeBus);

  const seatMap = new Map<string, KursiSiswa>();
  busSiswa.forEach(k => seatMap.set(String(k.nomor_kursi), k));

  // Cari siswa
  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) { setHighlight(null); setFoundSiswa(null); return; }

    const found = allData.find(k => k.nama_siswa.toLowerCase().includes(q));
    if (found) {
      setFoundSiswa(found);
      setActiveBus(found.bus_id);
      setHighlight(String(found.nomor_kursi));
    } else {
      setFoundSiswa(null);
      setHighlight(null);
    }
  };

  const handleClear = () => {
    setQuery("");
    setHighlight(null);
    setFoundSiswa(null);
    inputRef.current?.focus();
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <span>Memuat data kursi…</span>
      </div>
    );
  }

  if (allData.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Bus size={40} strokeWidth={1.5} />
        <p>Data kursi belum tersedia.<br />Hubungi panitia kokurikuler.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Search bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <Search size={18} className={styles.searchIcon} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Cari nama siswa…"
            className={styles.searchField}
            aria-label="Cari nama siswa untuk menemukan nomor kursi"
          />
          {query && (
            <button className={styles.searchClear} onClick={handleClear} aria-label="Hapus pencarian">
              <X size={16} />
            </button>
          )}
        </div>
        <button className={styles.searchBtn} onClick={handleSearch}>
          Cari Kursi
        </button>
      </div>

      {/* Hasil pencarian */}
      {foundSiswa && (
        <div className={styles.resultCard} role="status" aria-live="polite">
          <div className={styles.resultIcon}><Bus size={20} /></div>
          <div className={styles.resultInfo}>
            <p className={styles.resultNama}>{foundSiswa.nama_siswa}</p>
            <p className={styles.resultMeta}>
              <MapPin size={13} /> {foundSiswa.kelas} &nbsp;·&nbsp;
              <Bus size={13} /> Bus {foundSiswa.bus_id} &nbsp;·&nbsp;
              Kursi <strong>{foundSiswa.nomor_kursi}</strong>
            </p>
          </div>
        </div>
      )}

      {foundSiswa === null && query && (
        <p className={styles.notFound} role="alert">
          Nama "<strong>{query}</strong>" tidak ditemukan dalam data kursi.
        </p>
      )}

      {/* Bus tabs */}
      {buses.length > 1 && (
        <div className={styles.busTabs} role="tablist" aria-label="Pilih nomor bus">
          {buses.map(bus => (
            <button
              key={bus}
              role="tab"
              aria-selected={activeBus === bus}
              className={`${styles.busTab} ${activeBus === bus ? styles.busTabActive : ""}`}
              onClick={() => { setActiveBus(bus); setHighlight(null); }}
            >
              <Bus size={15} aria-hidden="true" /> Bus {bus}
            </button>
          ))}
        </div>
      )}

      {/* Denah bus */}
      <div className={styles.busContainer} role="tabpanel">
        <div className={styles.busHeader}>
          <span className={styles.busHeaderLabel}>DEPAN / PENGEMUDI</span>
        </div>
        <div className={styles.busBody}>
          {/* Aisle label */}
          <div className={styles.seatGrid}>
            {Array.from({ length: ROWS }, (_, rowIdx) => {
              const rowNum = rowIdx + 1;
              const cols: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
              return cols.map((col, colIdx) => {
                const seatNum = rowIdx * 4 + colIdx + 1;
                const siswa = seatMap.get(String(seatNum));
                const isHighlighted = highlightNomor === String(seatNum);
                const isAisle = colIdx === 1; // after B, before C = aisle

                return (
                  <>
                    <div
                      key={`${rowNum}-${col}`}
                      className={`${styles.seat}
                        ${siswa ? styles.seatOccupied : styles.seatEmpty}
                        ${isHighlighted ? styles.seatHighlighted : ""}
                      `}
                      title={siswa ? `${siswa.nama_siswa} (${siswa.kelas})` : `Kursi ${seatNum}`}
                      aria-label={siswa
                        ? `Kursi ${seatNum}: ${siswa.nama_siswa}, ${siswa.kelas}`
                        : `Kursi ${seatNum} kosong`
                      }
                    >
                      <span className={styles.seatNumber}>{seatNum}</span>
                      {siswa && (
                        <span className={styles.seatName}>
                          {siswa.nama_siswa.split(" ")[0]}
                        </span>
                      )}
                    </div>
                    {/* Aisle spacer setelah kolom B (index 1) */}
                    {colIdx === 1 && (
                      <div key={`aisle-${rowNum}`} className={styles.aisle} aria-hidden="true">
                        {rowNum === 1 && <span className={styles.aisleLabel}>LORONG</span>}
                      </div>
                    )}
                  </>
                );
              });
            })}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotOccupied}`} />
            <span>Terisi</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotEmpty}`} />
            <span>Kosong</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotHighlighted}`} />
            <span>Hasil Pencarian</span>
          </div>
        </div>
      </div>
    </div>
  );
}
