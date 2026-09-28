// ============================================================
// HasilAsesmen.gs (Versi 2.0 — Smart Sheet & Header Detection)
// Google Apps Script — Web App endpoint untuk Hasil Asesmen
// SMPN 5 Klaten · TA 2026/2027
// ============================================================

var JENIS_URUT = ['ASTS_Gasal', 'ASAS_Gasal', 'ASTS_Genap', 'ASAS_Genap', 'ASAJ'];

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var nis    = String(params.nis || '').trim();
  var mapel  = String(params.mapel || 'PAI').toUpperCase().trim();
  var isDebug = params.debug === '1' || params.debug === 'true' || nis.toLowerCase() === 'debug';

  var ss     = SpreadsheetApp.getActiveSpreadsheet();
  var config = getConfig(ss);
  var ta     = String(params.ta || '').trim() || config.ACTIVE_TA;

  // ── Mode Debug: Membantu diagnosa nama sheet & kolom ──────
  if (isDebug) {
    return handleDebug(ss, mapel, ta, nis);
  }

  if (!nis) {
    return jsonError('NIS diperlukan');
  }

  var hasil           = {};
  var siswaInfo       = null;
  var nilaiSebelumnya = null;

  JENIS_URUT.forEach(function(jenis) {
    var sheet = findSheetIntelligent(ss, mapel, jenis, ta);
    if (!sheet) return;

    var rows = sheet.getDataRange().getValues();
    if (rows.length < 2) return;

    // Cari baris header dan indeks kolomnya
    var colMap = detectColumns(rows);
    if (colMap.nis === -1) {
      // Fallback jika tidak ada header: anggap kolom A=NIS, B=Nama, dst.
      colMap = {
        headerRow: 0,
        nis: 0, nama: 1, kelas: 2, tingkat: 3, nilai: 4,
        predikat: 5, kktp: 6, status: 7, tanggal: 8, rataKelas: 9
      };
    }

    // Cari baris data siswa yang cocok dengan NIS
    var targetRow = null;
    for (var r = colMap.headerRow + 1; r < rows.length; r++) {
      var cellVal = normalizeNis(rows[r][colMap.nis]);
      if (cellVal === nis) {
        targetRow = rows[r];
        break;
      }
    }

    if (!targetRow) return;

    // Catat info identitas siswa dari sheet pertama yang ditemukan
    if (!siswaInfo) {
      siswaInfo = {
        nama:    colMap.nama !== -1 ? String(targetRow[colMap.nama] || '').trim() : '',
        kelas:   colMap.kelas !== -1 ? String(targetRow[colMap.kelas] || '').trim() : '',
        tingkat: colMap.tingkat !== -1 ? Number(targetRow[colMap.tingkat]) || 0 : 0,
      };
    }

    var rawNilai = colMap.nilai !== -1 ? targetRow[colMap.nilai] : null;
    var nilaiSkrg = (rawNilai !== '' && rawNilai !== null && !isNaN(Number(rawNilai))) ? Number(rawNilai) : null;
    var rawKktp = colMap.kktp !== -1 ? targetRow[colMap.kktp] : 75;
    var kktpVal = Number(rawKktp) || 75;

    var rawStatus = colMap.status !== -1 ? String(targetRow[colMap.status] || '').toLowerCase().trim() : '';
    var statusTuntas = rawStatus === 'tuntas' || (nilaiSkrg !== null && nilaiSkrg >= kktpVal);

    var rawTanggal = colMap.tanggal !== -1 ? targetRow[colMap.tanggal] : null;
    var tanggalStr = null;
    if (rawTanggal) {
      try {
        tanggalStr = Utilities.formatDate(new Date(rawTanggal), 'Asia/Jakarta', 'yyyy-MM-dd');
      } catch (err) {
        tanggalStr = String(rawTanggal);
      }
    }

    var rawRata = colMap.rataKelas !== -1 ? targetRow[colMap.rataKelas] : null;
    var rataKelasVal = (rawRata !== '' && rawRata !== null && !isNaN(Number(rawRata))) ? Number(rawRata) : null;

    hasil[jenis] = {
      nilai:           nilaiSkrg,
      predikat:        colMap.predikat !== -1 ? String(targetRow[colMap.predikat] || '').trim() || null : null,
      kktp:            kktpVal,
      statusTuntas:    statusTuntas,
      tanggal:         tanggalStr,
      rataKelas:       rataKelasVal,
      nilaiSebelumnya: nilaiSebelumnya,
    };

    if (nilaiSkrg !== null) {
      nilaiSebelumnya = nilaiSkrg;
    }
  });

  if (!siswaInfo) {
    return jsonError('NIS ' + nis + ' tidak ditemukan di TA ' + ta);
  }

  return jsonOk({
    nis:         nis,
    nama:        siswaInfo.nama,
    kelas:       siswaInfo.kelas,
    tingkat:     siswaInfo.tingkat,
    mapel:       mapel,
    ta:          ta,
    activeTa:    config.ACTIVE_TA,
    taList:      config.TA_LIST,
    mapelAktif:  config.MAPEL_AKTIF,
    hasil:       hasil,
  });
}

// ── Normalisasi NIS untuk mencocokkan angka/teks ─────────────
function normalizeNis(val) {
  if (val === null || val === undefined) return '';
  var s = String(val).trim();
  // Hilangkan desimal bila angka format float, misal 1012.0 -> 1012
  s = s.replace(/\.0+$/, '');
  return s;
}

// ── Pencarian sheet cerdas & toleran variasi nama ────────────
function findSheetIntelligent(ss, mapel, jenis, ta) {
  var targetVariations = [
    (mapel + '_' + jenis + '_' + ta).toLowerCase(),
    (mapel + '_' + jenis).toLowerCase(),
    (mapel + ' ' + jenis + ' ' + ta).toLowerCase(),
    (mapel + '-' + jenis + '-' + ta).toLowerCase(),
    jenis.toLowerCase(),
  ];

  var allSheets = ss.getSheets();
  for (var i = 0; i < allSheets.length; i++) {
    var rawName = allSheets[i].getName();
    var cleanName = rawName.trim().toLowerCase();
    var compactName = cleanName.replace(/[\s_-]/g, '');

    for (var v = 0; v < targetVariations.length; v++) {
      var target = targetVariations[v];
      var targetCompact = target.replace(/[\s_-]/g, '');
      if (cleanName === target || compactName === targetCompact) {
        return allSheets[i];
      }
    }
  }
  return null;
}

// ── Deteksi Kolom Otomatis dari Baris Header ─────────────────
function detectColumns(rows) {
  var map = {
    headerRow: -1,
    nis: -1,
    nama: -1,
    kelas: -1,
    tingkat: -1,
    nilai: -1,
    predikat: -1,
    kktp: -1,
    status: -1,
    tanggal: -1,
    rataKelas: -1,
  };

  // Cek hingga 5 baris pertama untuk mencari baris header
  var maxScan = Math.min(rows.length, 5);
  for (var r = 0; r < maxScan; r++) {
    var row = rows[r];
    for (var c = 0; c < row.length; c++) {
      var txt = String(row[c] || '').toLowerCase().trim();
      if (txt === 'nis' || txt === 'nisn' || txt === 'no induk' || txt === 'nomor induk') {
        map.headerRow = r;
        break;
      }
    }
    if (map.headerRow !== -1) break;
  }

  if (map.headerRow === -1) return map;

  var hRow = rows[map.headerRow];
  for (var i = 0; i < hRow.length; i++) {
    var h = String(hRow[i] || '').toLowerCase().trim();
    if (h === 'nis' || h === 'nisn' || h === 'no induk' || h === 'nomor induk') map.nis = i;
    else if (h.indexOf('nama') !== -1) map.nama = i;
    else if (h === 'kelas' || h === 'rombel') map.kelas = i;
    else if (h === 'tingkat' || h === 'tingkat kelas') map.tingkat = i;
    else if (h === 'nilai' || h === 'skor' || h === 'angka') map.nilai = i;
    else if (h === 'predikat' || h === 'grade') map.predikat = i;
    else if (h === 'kktp' || h === 'kkm') map.kktp = i;
    else if (h.indexOf('tuntas') !== -1 || h.indexOf('status') !== -1) map.status = i;
    else if (h.indexOf('tanggal') !== -1 || h.indexOf('tgl') !== -1) map.tanggal = i;
    else if (h.indexOf('rata') !== -1) map.rataKelas = i;
  }

  return map;
}

// ── Baca sheet _CONFIG ──────────────────────────────────────
function getConfig(ss) {
  var sheet = ss.getSheetByName('_CONFIG') || ss.getSheetByName('CONFIG');
  if (!sheet) {
    return {
      ACTIVE_TA:   '2627',
      TA_LIST:     ['2627'],
      MAPEL_AKTIF: ['PAI'],
    };
  }

  var rows = sheet.getDataRange().getValues();
  var cfg  = {};
  for (var i = 1; i < rows.length; i++) {
    var key = String(rows[i][0] || '').trim();
    if (key) cfg[key] = rows[i][1];
  }

  return {
    ACTIVE_TA:   String(cfg['ACTIVE_TA']    || '2627').trim(),
    TA_LIST:     String(cfg['TA_LIST']      || '2627').split(',').map(function(s){ return s.trim(); }),
    MAPEL_AKTIF: String(cfg['MAPEL_AKTIF']  || 'PAI').split(',').map(function(s){ return s.trim(); }),
  };
}

// ── Handler Debug untuk mendiagnosa Spreadsheet ─────────────
function handleDebug(ss, mapel, ta, nis) {
  var sheets = ss.getSheets();
  var sheetNames = [];
  var matchedSheets = {};

  for (var i = 0; i < sheets.length; i++) {
    sheetNames.push(sheets[i].getName());
  }

  JENIS_URUT.forEach(function(jenis) {
    var sh = findSheetIntelligent(ss, mapel, jenis, ta);
    if (sh) {
      var rows = sh.getDataRange().getValues();
      var colMap = detectColumns(rows);
      var sampleNis = [];
      var startRow = colMap.headerRow !== -1 ? colMap.headerRow + 1 : 1;
      var nisCol = colMap.nis !== -1 ? colMap.nis : 0;
      for (var r = startRow; r < Math.min(rows.length, startRow + 5); r++) {
        sampleNis.push(normalizeNis(rows[r][nisCol]));
      }
      matchedSheets[jenis] = {
        sheetName: sh.getName(),
        totalRows: rows.length,
        colMap: colMap,
        sampleNis: sampleNis,
      };
    } else {
      matchedSheets[jenis] = null;
    }
  });

  return jsonOk({
    status: 'debug_info',
    activeSpreadsheet: ss.getName(),
    allSheetNamesInSpreadsheet: sheetNames,
    requestedMapel: mapel,
    requestedTA: ta,
    requestedNis: nis,
    matchedSheets: matchedSheets,
  });
}

function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ error: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
