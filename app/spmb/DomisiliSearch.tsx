'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './spmb.module.css';

type RWData = { rw: number; jarak: number };
type DesaData = { nama: string; kecamatan: string; rws: RWData[] };

const DATA: DesaData[] = [
  { nama: 'JOMBORAN', kecamatan: 'Klaten Tengah', rws: [
    {rw:1,jarak:0.361},{rw:2,jarak:0},{rw:3,jarak:0.715},{rw:4,jarak:0.889},
    {rw:5,jarak:0.829},{rw:6,jarak:0.613},{rw:7,jarak:0.668},{rw:8,jarak:0.779},
    {rw:9,jarak:0.810},{rw:10,jarak:0.915},{rw:11,jarak:0.927},
  ]},
  { nama: 'BUNTALAN', kecamatan: 'Klaten Tengah', rws: [
    {rw:1,jarak:1.199},{rw:2,jarak:0.942},{rw:3,jarak:0.574},{rw:4,jarak:0.518},
    {rw:5,jarak:0.503},{rw:6,jarak:0.729},{rw:7,jarak:0.942},{rw:8,jarak:1.112},
    {rw:9,jarak:1.113},{rw:10,jarak:0.713},{rw:11,jarak:0.709},{rw:12,jarak:0.701},
  ]},
  { nama: 'GUMULAN', kecamatan: 'Klaten Tengah', rws: [
    {rw:1,jarak:1.10},{rw:2,jarak:1.17},{rw:3,jarak:0.843},{rw:4,jarak:1.51},
    {rw:5,jarak:0.944},{rw:6,jarak:1.15},{rw:7,jarak:1.53},{rw:8,jarak:1.66},
    {rw:9,jarak:1.61},{rw:10,jarak:1.58},{rw:11,jarak:1.06},{rw:12,jarak:1.37},
  ]},
  { nama: 'MOJAYAN', kecamatan: 'Klaten Tengah', rws: [
    {rw:1,jarak:2.00},{rw:2,jarak:1.71},{rw:3,jarak:1.15},{rw:4,jarak:1.03},
    {rw:5,jarak:1.32},{rw:6,jarak:1.21},{rw:7,jarak:1.28},{rw:8,jarak:1.55},
    {rw:9,jarak:2.10},{rw:10,jarak:1.31},{rw:11,jarak:1.32},{rw:12,jarak:1.68},
  ]},
  { nama: 'NGALAS', kecamatan: 'Klaten Selatan', rws: [
    {rw:1,jarak:1.84},{rw:2,jarak:1.58},{rw:3,jarak:1.40},{rw:4,jarak:1.37},
    {rw:5,jarak:1.28},{rw:6,jarak:1.09},{rw:7,jarak:1.06},{rw:8,jarak:0.802},
  ]},
  { nama: 'NGEMPLAK', kecamatan: 'Kalikotes', rws: [
    {rw:1,jarak:1.33},{rw:2,jarak:1.98},{rw:3,jarak:1.47},{rw:4,jarak:1.25},
    {rw:5,jarak:1.41},{rw:6,jarak:1.63},{rw:7,jarak:1.91},{rw:8,jarak:2.11},
    {rw:9,jarak:2.19},{rw:10,jarak:2.28},{rw:11,jarak:2.32},{rw:12,jarak:2.75},{rw:13,jarak:2.80},
  ]},
  { nama: 'KALIKOTES', kecamatan: 'Kalikotes', rws: [
    {rw:1,jarak:1.78},{rw:2,jarak:2.01},{rw:3,jarak:2.13},{rw:4,jarak:2.52},
    {rw:5,jarak:1.69},{rw:6,jarak:1.58},{rw:7,jarak:1.41},{rw:8,jarak:2.46},
    {rw:9,jarak:1.55},{rw:10,jarak:1.82},
  ]},
  { nama: 'MERBUNG', kecamatan: 'Klaten Selatan', rws: [
    {rw:1,jarak:2.24},{rw:2,jarak:1.88},{rw:3,jarak:1.78},{rw:4,jarak:1.70},
    {rw:5,jarak:1.52},{rw:6,jarak:1.75},{rw:7,jarak:1.572},{rw:8,jarak:1.618},
    {rw:9,jarak:1.35},{rw:10,jarak:1.34},{rw:11,jarak:1.41},{rw:12,jarak:1.40},
    {rw:13,jarak:1.45},{rw:14,jarak:1.51},{rw:15,jarak:1.36},
  ]},
  { nama: 'JIMBUNG', kecamatan: 'Kalikotes', rws: [
    {rw:1,jarak:3.19},{rw:2,jarak:3.04},{rw:3,jarak:2.60},{rw:4,jarak:2.66},
    {rw:5,jarak:2.40},{rw:6,jarak:2.20},{rw:7,jarak:2.45},{rw:8,jarak:2.54},
    {rw:9,jarak:1.93},{rw:10,jarak:1.13},{rw:11,jarak:1.53},{rw:12,jarak:2.14},
    {rw:13,jarak:2.21},{rw:14,jarak:2.52},{rw:15,jarak:2.52},{rw:16,jarak:2.67},
    {rw:17,jarak:2.83},{rw:18,jarak:2.99},{rw:19,jarak:2.85},{rw:20,jarak:2.45},
    {rw:21,jarak:2.69},{rw:22,jarak:2.64},{rw:23,jarak:2.82},{rw:24,jarak:1.50},
    {rw:25,jarak:1.64},{rw:26,jarak:1.79},{rw:27,jarak:2.30},{rw:28,jarak:3.05},{rw:29,jarak:2.02},
  ]},
  { nama: 'TAMBONGWETAN', kecamatan: 'Kalikotes', rws: [
    {rw:1,jarak:2.68},{rw:2,jarak:2.34},{rw:3,jarak:2.22},{rw:4,jarak:2.37},
    {rw:5,jarak:2.52},{rw:6,jarak:2.36},{rw:7,jarak:2.24},{rw:8,jarak:3.09},
  ]},
  { nama: 'DANGURAN', kecamatan: 'Klaten Selatan', rws: [
    {rw:1,jarak:2.48},{rw:2,jarak:2.17},{rw:3,jarak:1.72},{rw:4,jarak:2.17},
    {rw:5,jarak:1.46},{rw:6,jarak:2.81},{rw:7,jarak:2.86},{rw:8,jarak:2.56},
    {rw:9,jarak:2.49},{rw:10,jarak:2.47},{rw:11,jarak:2.73},{rw:12,jarak:2.75},
    {rw:13,jarak:2.23},{rw:14,jarak:1.91},{rw:15,jarak:2.35},
  ]},
  { nama: 'GLODOGAN', kecamatan: 'Klaten Selatan', rws: [
    {rw:1,jarak:2.39},{rw:2,jarak:2.79},{rw:3,jarak:2.71},{rw:4,jarak:2.91},
    {rw:5,jarak:2.38},{rw:6,jarak:2.19},{rw:7,jarak:2.11},{rw:8,jarak:2.27},{rw:9,jarak:1.95},
  ]},
  { nama: 'KARANGPAKEL', kecamatan: 'Trucuk', rws: [
    {rw:1,jarak:2.85},{rw:2,jarak:2.68},{rw:3,jarak:2.96},{rw:4,jarak:3.28},
    {rw:5,jarak:3.18},{rw:6,jarak:3.53},{rw:7,jarak:4.06},
  ]},
  { nama: 'GEMBLEGAN', kecamatan: 'Kalikotes', rws: [
    {rw:1,jarak:2.78},{rw:2,jarak:3.28},{rw:3,jarak:3.00},{rw:4,jarak:3.73},
    {rw:5,jarak:3.55},{rw:6,jarak:3.89},{rw:7,jarak:3.63},{rw:8,jarak:3.41},
    {rw:9,jarak:3.15},{rw:10,jarak:3.12},{rw:11,jarak:2.75},{rw:12,jarak:2.59},{rw:13,jarak:3.32},
  ]},
  { nama: 'JOGOSETRAN', kecamatan: 'Kalikotes', rws: [
    {rw:1,jarak:4.19},{rw:2,jarak:3.97},{rw:3,jarak:3.04},{rw:4,jarak:4.11},
    {rw:5,jarak:3.55},{rw:6,jarak:3.76},{rw:7,jarak:3.74},{rw:8,jarak:3.67},
    {rw:9,jarak:3.99},{rw:10,jarak:4.15},{rw:11,jarak:3.82},{rw:12,jarak:3.84},
  ]},
  { nama: 'KRAKITAN', kecamatan: 'Bayat', rws: [
    {rw:13,jarak:3.38},{rw:14,jarak:3.02},{rw:15,jarak:2.42},{rw:16,jarak:2.56},
    {rw:17,jarak:2.11},{rw:18,jarak:1.97},{rw:19,jarak:2.51},
  ]},
];


export default function DomisiliSearch() {
  const [selectedDesa, setSelectedDesa] = useState('');
  const [selectedRW, setSelectedRW] = useState('');
  const desaRef = useRef<HTMLSelectElement>(null);

  // Sinkronisasi jika browser restore nilai select dari cache form
  useEffect(() => {
    if (desaRef.current?.value && desaRef.current.value !== selectedDesa) {
      setSelectedDesa(desaRef.current.value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const desaData = DATA.find(d => d.nama === selectedDesa);
  const rwData = desaData?.rws.find(r => r.rw === Number(selectedRW));

  function handleDesaChange(val: string) {
    setSelectedDesa(val);
    setSelectedRW('');
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
              onChange={e => handleDesaChange(e.target.value)}
              className={styles.domisiliSelect}
              autoComplete="off"
            >
              <option value="">-- Pilih Desa --</option>
              {DATA.map(d => (
                <option key={d.nama} value={d.nama}>
                  {d.nama} ({d.kecamatan})
                </option>
              ))}
            </select>
            <span className={styles.domisiliArrow}>▾</span>
          </div>
        </div>

        {/* DROPDOWN RW */}
        <div className={styles.domisiliField}>
          <label htmlFor="select-rw" className={styles.domisiliLabel}>
            Nomor RW
          </label>
          <div className={styles.domisiliSelectWrap}>
            <select
              id="select-rw"
              value={selectedRW}
              onChange={e => setSelectedRW(e.target.value)}
              className={styles.domisiliSelect}
              autoComplete="off"
            >
              <option value="">
                {selectedDesa ? '-- Pilih RW --' : '-- Pilih Desa dahulu --'}
              </option>
              {desaData?.rws.map(r => (
                <option key={r.rw} value={String(r.rw)}>
                  RW {String(r.rw).padStart(2, '0')}
                </option>
              ))}
            </select>
            <span className={styles.domisiliArrow}>▾</span>
          </div>
        </div>
      </div>

      {/* HASIL */}
      {rwData && (
        <div className={styles.domisiliResult}>
          <div className={styles.domisiliResultHeader}>
            <span className={styles.domisiliResultDesa}>{selectedDesa}</span>
            <span className={styles.domisiliResultRW}>RW {String(selectedRW).padStart(2, '0')}</span>
          </div>
          <div className={styles.domisiliResultBody}>
            <div className={styles.domisiliJarak}>
              <span className={styles.domisiliJarakAngka}>{rwData.jarak.toFixed(3).replace('.', ',')}</span>
              <span className={styles.domisiliJarakSatuan}>km dari SMPN 5 Klaten</span>
            </div>
          </div>
          <p className={styles.domisiliNote}>
            * Jarak dihitung dari titik RW ke SMPN 5 Klaten berdasarkan data resmi panitia SPMB 2026/2027.
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
  );
}
