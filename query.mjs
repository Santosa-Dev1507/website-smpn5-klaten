import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data: users, error: e2 } = await supabase.from('users').select('nis_nip, nama_lengkap, kelas_id, kelas(nama_kelas)').eq('role', 'siswa').order('nis_nip');
  
  let currentClass = null;
  let currentClassStartNis = null;
  let count = 0;
  for (const u of users) {
    const className = u.kelas?.nama_kelas || 'Tanpa Kelas';
    if (className !== currentClass) {
      if (currentClass) {
        console.log(`${currentClass}: ${count} siswa (NIS mulai ${currentClassStartNis})`);
      }
      currentClass = className;
      currentClassStartNis = u.nis_nip;
      count = 1;
    } else {
      count++;
    }
  }
  if (currentClass) {
    console.log(`${currentClass}: ${count} siswa (NIS mulai ${currentClassStartNis})`);
  }
}
check();
