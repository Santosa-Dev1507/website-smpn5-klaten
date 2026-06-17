'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './spmb.module.css';

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSqnoxqUsT9bKiOfBopZlfIXjpahbxj-WKBYJVlsw4gmGpETmjFnYWnp8i6cJPmMuBBDo5MnROhlB0g/pub?output=csv';

type RWData = { rw: number; jarak: number };
type DesaData = { nama: string; kecamatan: string; rws: RWData[] };

/** Parse satu baris CSV yang mungkin punya nilai di dalam tanda kutip */
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

/** Konversi string angka yang mungkin memakai koma desimal → number */
function toNumber(s: string): number {
  // Ganti koma desimal ke titik jika format "1,53" (bukan "1,000.00")
  const normalized = s.replace(',', '.');
  return parseFloat(normalized);
}

/** Parse seluruh CSV menjadi array DesaData */
function parseCSV(text: string): DesaData[] {
  const rows = text
    .split(/\r?\n/)
    .map((r) => parseCSVRow(r));

  // Lewati baris header (baris pertama)
  const dataRows = rows.slice(1);

  const result: DesaData[] = [];
  let currentDesa: DesaData | null = null;

  for (const cols of dataRows) {
    // Kolom: NO, Desa, RW, Kecamatan, Jarak (Km)
    const [, desaCol, rwCol, kecamatanCol, jarakCol] = cols;

    // Baris desa baru — kolom Desa terisi, kolom RW kosong
    if (desaCol && desaCol.trim() !== '' && (!rwCol || rwCol.trim() === '')) {
      currentDesa = { nama: desaCol.trim(), kecamatan: '', rws: [] };
      result.push(currentDesa);
      continue;
    }

    // Baris RW — kolom RW terisi
    const rwNum = parseInt(rwCol, 10);
    if (!isNaN(rwNum) && currentDesa && jarakCol && jarakCol.trim() !== '') {
      const jarak = toNumber(jarakCol);
      if (!isNaN(jarak)) {
        if (!currentDesa.kecamatan && kecamatanCol) {
          currentDesa.kecamatan = kecamatanCol.trim();
        }
        currentDesa.rws.push({ rw: rwNum, jarak });
      }
    }
  }

  return result;
}

/** Skeleton loader — ditampilkan saat data sedang dimuat */
function DomisiliSkeleton() {
  return (
    <div className={styles.domisiliWrap}>
      <div className={styles.domisiliDropdowns}>
        <div className={styles.domisiliField}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonInput} />
        </div>
        <div className={styles.domisiliField}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonInput} />
        </div>
      </div>
      <div className={styles.skeletonCard} />
    </div>
  );
}

export default function DomisiliSearch() {
  const [data, setData] = useState<DesaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedDesa, setSelectedDesa] = useState('');
  const [selectedRW, setSelectedRW] = useState('');
  const desaRef = useRef<HTMLSelectElement>(null);

  // retryCount digunakan sebagai trigger untuk fetch ulang saat retry
  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(CSV_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('fetch failed');
        const text = await res.text();
        if (!cancelled) {
          setData(parseCSV(text));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [retryCount]);

  // Sinkronisasi jika browser restore nilai select dari cache form
  useEffect(() => {
    if (desaRef.current?.value && desaRef.current.value !== selectedDesa) {
      setSelectedDesa(desaRef.current.value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const desaData = data.find((d) => d.nama === selectedDesa);
  const rwData = desaData?.rws.find((r) => r.rw === Number(selectedRW));

  function handleDesaChange(val: string) {
    setSelectedDesa(val);
    setSelectedRW('');
  }

  if (loading) {
    return <DomisiliSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.domisiliWrap} style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <svg
          width="44" height="44" viewBox="0 0 24 24" fill="none"
          aria-hidden="true" style={{ marginBottom: '0.75rem', opacity: 0.75 }}
        >
          <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
          <line x1="12" y1="7" x2="12" y2="13" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1.2" fill="#ef4444" />
        </svg>
        <p style={{ color: '#b91c1c', fontWeight: 600, marginBottom: '1.25rem', fontSize: '0.95rem' }}>
          Gagal memuat data jarak RW. Periksa koneksi internet Anda.
        </p>
        <button
          onClick={() => setRetryCount((c) => c + 1)}
          className={styles.retryButton}
        >
          ↺ Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className={styles.domisiliWrap}>
      <div className={styles.domisiliDropdowns}>
        {/* DROPDOWN DESA */}
        <div className={styles.domisiliField}>
          <label htmlFor="select-desa" className={styles.domisiliLabel}>
            Nama Desa / Kelurahan
          </label>
          <div className={styles.domisiliSelectWrap}>
            <select
              ref={desaRef}
              id="select-desa"
              value={selectedDesa}
              onChange={(e) => handleDesaChange(e.target.value)}
              className={styles.domisiliSelect}
              autoComplete="off"
            >
              <option value="">-- Pilih Desa --</option>
              {data.map((d) => (
                <option key={d.nama} value={d.nama}>
                  {d.nama} ({d.kecamatan})
                </option>
              ))}
            </select>
            <span className={styles.domisiliArrow} aria-hidden="true">▾</span>
          </div>
        </div>

        {/* DROPDOWN RW — disabled saat desa belum dipilih */}
        <div className={styles.domisiliField}>
          <label htmlFor="select-rw" className={styles.domisiliLabel}>
            Nomor RW
          </label>
          <div className={styles.domisiliSelectWrap}>
            <select
              id="select-rw"
              value={selectedRW}
              onChange={(e) => setSelectedRW(e.target.value)}
              className={styles.domisiliSelect}
              disabled={!selectedDesa}
              autoComplete="off"
            >
              <option value="">
                {selectedDesa ? '-- Pilih RW --' : '-- Pilih Desa dahulu --'}
              </option>
              {desaData?.rws.map((r) => (
                <option key={r.rw} value={String(r.rw)}>
                  RW {String(r.rw).padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className={styles.domisiliArrow} aria-hidden="true">▾</span>
          </div>
        </div>
      </div>

      {/* aria-live: perubahan hasil diumumkan ke screen reader secara otomatis */}
      <div aria-live="polite" aria-atomic="true">
        {/* HASIL */}
        {rwData && (
          <div className={styles.domisiliResult}>
            <div className={styles.domisiliResultHeader}>
              <span className={styles.domisiliResultDesa}>{selectedDesa}</span>
              <span className={styles.domisiliResultRW}>RW {String(selectedRW).padStart(2, '0')}</span>
            </div>
            <div className={styles.domisiliResultBody}>
              <div className={styles.domisiliJarak}>
                <span className={styles.domisiliJarakAngka}>{rwData.jarak.toFixed(2).replace('.', ',')}</span>
                <span className={styles.domisiliJarakSatuan}>km dari SMPN 5 Klaten</span>
              </div>
            </div>
            <p className={styles.domisiliNote}>
              * Berdasarkan Lampiran SK Bupati Klaten No 12/400.3/6 tahun 2026 tentang Wilayah Penerimaan Murid Baru Jenjang Sekolah Menengah Pertama Tingkat Kabupaten Klaten Tahun Ajaran 2026/2027.
            </p>
          </div>
        )}

        {/* EMPTY STATE saat desa dipilih tapi belum pilih RW */}
        {selectedDesa && !selectedRW && (
          <div className={styles.domisiliEmpty}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="rgba(148,69,53,0.12)" stroke="#944535" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="12" cy="9" r="2.5" fill="#944535"/>
            </svg>
            <p>Pilih nomor RW untuk melihat jarak dari SMPN 5 Klaten</p>
          </div>
        )}
      </div>
    </div>
  );
}
