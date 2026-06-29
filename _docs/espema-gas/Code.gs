// ============================================================
// Code.gs — Router Utama SIM Ekskul & Lomba SMPN 5 Klaten
// ============================================================

// ID Google Spreadsheet — GANTI dengan ID Spreadsheet Anda
var SPREADSHEET_ID = '1Y9OkiPwXoOOqzNCruxJGkR3Oe90lI-UjgokEbYe8TdY';

/**
 * Entry point GET — serve halaman HTML
 */
function doGet(e) {
  var page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'login';

  if (page === 'login') {
    return HtmlService.createTemplateFromFile('login')
      .evaluate()
      .setTitle('Login — SMPN Manajemen')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Halaman utama (SPA) — semua role diarahkan ke sini
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('SMPN Manajemen — SIM Ekskul & Lomba')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper: include file HTML lain (CSS, JS)
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Ambil URL Web App (untuk redirect setelah login)
 */
function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}
