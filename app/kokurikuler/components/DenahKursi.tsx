"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Bus, MapPin, X, User } from "lucide-react";
import styles from "./denah.module.css";
import type { KursiSiswa } from "@/lib/kokurikuler";

interface Props {
  /** Pre-loaded dari server jika tersedia */
  initialData?: KursiSiswa[];
}

/**
 * Layout bus 50 kursi — sesuai GAS "Pembagian Kursi Bus"
 * Format: baris standard 2-2, baris pendamping, pintu belakang, bangku belakang 6 kursi
 */
type RowStandard = { type: 'standard'; left: [string, string]; right: [string, string]; isCompanion?: boolean };
type RowDoor     = { type: 'door_back'; right: [string, string] };
type RowBench    = { type: 'rear_bench'; seats: [string, string, string, string, string, string] };
type BusRow      = RowStandard | RowDoor | RowBench;

const BUS_LAYOUT: BusRow[] = [
  { type: 'standard', left: ['1A', '1B'], right: ['2A', '2B'], isCompanion: true },
  { type: 'standard', left: ['3A', '3B'], right: ['3C', '3D'] },
  { type: 'standard', left: ['4A', '4B'], right: ['4C', '4D'] },
  { type: 'standard', left: ['5A', '5B'], right: ['5C', '5D'] },
  { type: 'standard', left: ['6A', '6B'], right: ['6C', '6D'] },
  { type: 'standard', left: ['7A', '7B'], right: ['7C', '7D'] },
  { type: 'standard', left: ['8A', '8B'], right: ['8C', '8D'] },
  { type: 'standard', left: ['9A', '9B'], right: ['9C', '9D'] },
  { type: 'standard', left: ['10A', '10B'], right: ['10C', '10D'] },
  { type: 'standard', left: ['11A', '11B'], right: ['11C', '11D'] },
  { type: 'standard', left: ['12A', '12B'], right: ['12C', '12D'] },
  { type: 'door_back', right: ['13C', '13D'] },
  { type: 'rear_bench', seats: ['14A', '14B', '14C', '14D', '14E', '14F'] },
];

interface SeatInfo extends KursiSiswa {
  isCompanion: boolean;
}

export default function DenahKursi({ initialData = [] }: Props) {
  const [allData, setAllData]         = useState<KursiSiswa[]>(initialData);
  const [loading, setLoading]         = useState(initialData.length === 0);
  const [query, setQuery]             = useState("");
  const [activeBus, setActiveBus]     = useState<string>("");
  const [highlightIds, setHighlight]  = useState<Set<string>>(new Set());
  const [foundSiswa, setFoundSiswa]   = useState<KursiSiswa[]>([]);
  const [modalSeat, setModalSeat]     = useState<SeatInfo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch jika data belum ada
  useEffect(() => {
    if (initialData.length > 0) { setLoading(false); return; }
    fetch("/api/kokurikuler/kursi")
      .then(r => r.json())
      .then(json => {
        setAllData(json.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [initialData.length]);

  // Daftar bus unik, diurutkan secara natural
  const buses = Array.from(new Set(allData.map(k => k.bus_id))).sort((a, b) => {
    const na = parseInt(a.replace(/\D+/g, '')) || 0;
    const nb = parseInt(b.replace(/\D+/g, '')) || 0;
    return na - nb;
  });

  useEffect(() => {
    if (buses.length > 0 && !activeBus) setActiveBus(buses[0]);
  }, [buses, activeBus]);

  // Map kursi → siswa untuk bus aktif
  const seatMap = new Map<string, SeatInfo>();
  allData
    .filter(k => k.bus_id === activeBus)
    .forEach(k => {
      const isCompanion = ['1A','1B','2A','2B'].includes(k.nomor_kursi.toUpperCase());
      seatMap.set(k.nomor_kursi.toUpperCase(), { ...k, isCompanion });
    });

  // Cari siswa (real-time)
  const handleSearch = useCallback(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setHighlight(new Set()); setFoundSiswa([]); return; }

    const found = allData.filter(k =>
      k.nama_siswa.toLowerCase().includes(q) ||
      k.kelas.toLowerCase().includes(q) ||
      (k.nis && k.nis.toLowerCase().includes(q)) ||
      k.nomor_kursi.toLowerCase().includes(q)
    );

    setFoundSiswa(found);
    if (found.length > 0) {
      setHighlight(new Set(found.map(f => f.nomor_kursi.toUpperCase())));
      // Otomatis pindah ke bus yang ditemukan pertama
      setActiveBus(found[0].bus_id);
    } else {
      setHighlight(new Set());
    }
  }, [query, allData]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleClear = () => {
    setQuery("");
    setHighlight(new Set());
    setFoundSiswa([]);
    inputRef.current?.focus();
  };

  // Render satu kursi
  const renderSeat = (seatId: string, forceCompanion?: boolean) => {
    const siswa = seatMap.get(seatId);
    const isHighlighted = highlightIds.has(seatId);
    const isCompanion = forceCompanion || siswa?.isCompanion || false;

    const cls = [
      styles.seat,
      siswa
        ? (isCompanion ? styles.seatCompanion : styles.seatOccupied)
        : (isCompanion ? styles.seatCompanionEmpty : styles.seatEmpty),
      isHighlighted ? styles.seatHighlighted : '',
    ].filter(Boolean).join(' ');

    return (
      <div
        key={seatId}
        className={cls}
        title={siswa ? `${siswa.nama_siswa} (${siswa.kelas})` : isCompanion ? 'Kursi Pendamping' : `Kursi ${seatId}`}
        onClick={() => {
          if (siswa) {
            setModalSeat(siswa);
          }
        }}
        style={siswa ? { cursor: 'pointer' } : undefined}
      >
        <span className={styles.seatId}>{seatId}</span>
        {siswa && (
          <span className={styles.seatName}>
            {siswa.nama_siswa.split(' ').slice(0, 2).join(' ')}
          </span>
        )}
        {siswa?.gender && (
          <span className={`${styles.genderBadge} ${styles[`gender${siswa.gender}`] ?? ''}`}>
            {siswa.gender}
          </span>
        )}
      </div>
    );
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
            placeholder="Ketik nama untuk menemukan posisi dudukmu di bus…"
            className={styles.searchField}
            aria-label="Cari nama siswa untuk menemukan nomor kursi"
          />
          {query && (
            <button className={styles.searchClear} onClick={handleClear} aria-label="Hapus pencarian">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Hasil pencarian */}
      {foundSiswa.length > 0 && (
        <div className={styles.resultList} role="status" aria-live="polite">
          {foundSiswa.map((s, i) => (
            <div key={i} className={styles.resultCard}>
              <div className={styles.resultIcon}><User size={18} /></div>
              <div className={styles.resultInfo}>
                <p className={styles.resultNama}>{s.nama_siswa}</p>
                <p className={styles.resultMeta}>
                  <MapPin size={13} />&nbsp;{s.kelas}&nbsp;·&nbsp;
                  <Bus size={13} />&nbsp;{s.bus_id}&nbsp;·&nbsp;
                  Kursi&nbsp;<strong>{s.nomor_kursi}</strong>
                  {s.gender && <>&nbsp;·&nbsp;<span className={styles.genderText}>{s.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</span></>}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {foundSiswa.length === 0 && query.trim() && (
        <p className={styles.notFound} role="alert">
          Nama &quot;<strong>{query}</strong>&quot; tidak ditemukan dalam data kursi.
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
              className={`${styles.busTab} ${activeBus === bus ? styles.busTabActive : ''}`}
              onClick={() => { setActiveBus(bus); setHighlight(new Set()); }}
            >
              <Bus size={15} aria-hidden="true" /> {bus}
            </button>
          ))}
        </div>
      )}

      {/* Denah bus */}
      <div className={styles.busContainer} role="tabpanel">
        {/* Depan bus */}
        <div className={styles.busHeader}>
          <span className={styles.busHeaderLabel}>DEPAN / PENGEMUDI</span>
        </div>

        <div className={styles.busBody}>
          <div className={styles.busFrame}>
            {BUS_LAYOUT.map((row, rowIdx) => {
              if (row.type === 'standard') {
                return (
                  <div key={rowIdx} className={styles.busRow}>
                    <div className={styles.sideGroup}>
                      {row.left.map(id => renderSeat(id, row.isCompanion))}
                    </div>
                    <div className={styles.aisle} aria-hidden="true">
                      {rowIdx === 0 && <span className={styles.aisleLabel}>LORONG</span>}
                    </div>
                    <div className={styles.sideGroup}>
                      {row.right.map(id => renderSeat(id, row.isCompanion))}
                    </div>
                  </div>
                );
              }

              if (row.type === 'door_back') {
                return (
                  <div key={rowIdx} className={styles.busRow}>
                    <div className={styles.doorPlaceholder}>
                      <span>PINTU<br />BELAKANG</span>
                    </div>
                    <div className={styles.aisle} aria-hidden="true" />
                    <div className={styles.sideGroup}>
                      {row.right.map(id => renderSeat(id, false))}
                    </div>
                  </div>
                );
              }

              if (row.type === 'rear_bench') {
                return (
                  <div key={rowIdx} className={styles.rearBenchRow}>
                    {row.seats.map(id => renderSeat(id, false))}
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.legendDot} ${styles.legendDotCompanion}`} />
            <span>Pendamping</span>
          </div>
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

      {/* Modal detail kursi */}
      {modalSeat && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setModalSeat(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Detail kursi ${modalSeat.nomor_kursi}`}
        >
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Detail Kursi {modalSeat.nomor_kursi}</h3>
              <button className={styles.modalClose} onClick={() => setModalSeat(null)} aria-label="Tutup">
                <X size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Nomor Kursi</span>
                <span className={styles.modalVal}>{modalSeat.nomor_kursi}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Nama</span>
                <span className={styles.modalVal}>{modalSeat.nama_siswa || '—'}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Kelas</span>
                <span className={styles.modalVal}>{modalSeat.kelas || '—'}</span>
              </div>
              {modalSeat.nis && (
                <div className={styles.modalRow}>
                  <span className={styles.modalLabel}>NIS</span>
                  <span className={styles.modalVal}>{modalSeat.nis}</span>
                </div>
              )}
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Gender</span>
                <span className={styles.modalVal}>
                  {modalSeat.gender === 'P' ? 'Perempuan' : modalSeat.gender === 'L' ? 'Laki-laki' : '—'}
                </span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Armada Bus</span>
                <span className={styles.modalVal}>{modalSeat.bus_id}</span>
              </div>
            </div>
            <button className={styles.modalCloseBtn} onClick={() => setModalSeat(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
