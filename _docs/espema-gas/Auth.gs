// ============================================================
// Auth.gs — Autentikasi & Manajemen Sesi
// ============================================================

var SESSION_EXPIRE_HOURS = 8; // Sesi expired setelah 8 jam

/**
 * Login — validasi kredensial dan buat token sesi
 * @param {string} username - NIS (siswa) atau NIP/username (pembina/admin)
 * @param {string} password
 * @param {string} role - 'siswa' | 'pembina' | 'admin'
 * @returns {object} { success, token, nama, role, message }
 */
function login(username, password, role) {
  try {
    var user = findRow('Users', 'username', username);

    if (!user) {
      return { success: false, message: 'Akun tidak ditemukan.' };
    }
    if (!user.aktif) {
      return { success: false, message: 'Akun tidak aktif. Hubungi administrator.' };
    }
    if (user.role !== role) {
      return { success: false, message: 'Role tidak sesuai untuk akun ini.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Password salah.' };
    }

    // Buat token sesi
    var token = generateToken();
    var now = new Date();
    var expired = new Date(now.getTime() + SESSION_EXPIRE_HOURS * 60 * 60 * 1000);

    appendRow('Sessions', {
      token: token,
      user_id: user.id,
      nama: user.nama,
      role: user.role,
      username: user.username,
      created_at: now,
      expired_at: expired
    });

    return {
      success: true,
      token: token,
      nama: user.nama,
      role: user.role,
      username: user.username,
      user_id: user.id,
      ekskulKu: user.kode_ekskul ? user.kode_ekskul.split(',') : [],
      message: 'Login berhasil'
    };
  } catch (e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

/**
 * Validasi token sesi
 * @param {string} token
 * @returns {object} { valid, user } atau { valid: false }
 */
function validateSession(token) {
  try {
    if (!token) return { valid: false };

    var session = findRow('Sessions', 'token', token);
    if (!session) return { valid: false, message: 'Sesi tidak ditemukan.' };

    var now = new Date();
    var expired = new Date(session.expired_at);
    if (now > expired) {
      return { valid: false, message: 'Sesi telah berakhir. Silakan login ulang.' };
    }

    return {
      valid: true,
      user_id: session.user_id,
      nama: session.nama,
      role: session.role,
      username: session.username
    };
  } catch (e) {
    return { valid: false, message: 'Error validasi: ' + e.message };
  }
}

/**
 * Logout — hapus sesi
 * @param {string} token
 */
function logout(token) {
  try {
    var sheet = getSheet('Sessions');
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var tokenIdx = headers.indexOf('token');

    for (var i = 1; i < data.length; i++) {
      if (data[i][tokenIdx] === token) {
        sheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    return { success: true }; // Token tidak ditemukan, anggap sudah logout
  } catch (e) {
    return { success: false, message: e.message };
  }
}

/**
 * Bersihkan sesi yang sudah expired (jalankan via trigger harian)
 */
function cleanExpiredSessions() {
  var sheet = getSheet('Sessions');
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return;

  var headers = data[0];
  var expiredIdx = headers.indexOf('expired_at');
  var now = new Date();

  // Hapus dari bawah agar index tidak bergeser
  for (var i = data.length - 1; i >= 1; i--) {
    if (new Date(data[i][expiredIdx]) < now) {
      sheet.deleteRow(i + 1);
    }
  }
}

/**
 * Ganti password
 */
function changePassword(token, oldPassword, newPassword) {
  var session = validateSession(token);
  if (!session.valid) return { success: false, message: 'Sesi tidak valid.' };

  var user = findRow('Users', 'id', session.user_id);
  if (!user) return { success: false, message: 'User tidak ditemukan.' };
  if (user.password !== oldPassword) return { success: false, message: 'Password lama salah.' };

  updateRow('Users', user._rowIndex, { password: newPassword });
  return { success: true, message: 'Password berhasil diganti.' };
}
