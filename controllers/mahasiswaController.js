const mahasiswaModel = require('../models/mahasiswa');
const {transporter} = require('../config/mail');
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function validateMahasiswa(nim,nama,email,fakultas,program_studi,angkatan){
    const pesanError = [];

    if(!nim || nim.trim() === ''){
        pesanError.push("nim tidak boleh kosong");
    } else if (!/^\d{8,15}$/.test(nim.trim())) {
        pesanError.push("nim harus terdiri dari 8-15 digit angka");
    }

    if(!nama || nama.trim() === ''){
        pesanError.push("nama mahasiswa tidak boleh kosong");
    } else if (nama.trim().length < 3){
        pesanError.push("pengisian nama mahasiswa harus minimal 3 karakter");
    } else if (!/^[a-zA-Z\s]+$/.test(nama.trim())){
        pesanError.push("nama hanya boleh berisikan huruf dan spasi");
    } 

    if(!email || email.trim() === ''){
        pesanError.push("email mahasiswa tidak boleh kosong");
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){
        pesanError.push("format email tidak valid");
    }

    if (!fakultas || (fakultas !== 'Fakultas Sains dan Teknologi (FaST)' && fakultas !== 'Fakultas Ilmu Sosial dan Humaniora (FISH)')){
        pesanError.push("Fakultas harus dipilih dan valid");
    }

    const validProdiFast = ['Sistem Informasi (SI)', 'Teknik Informatika (TI)', 'Teknologi Informasi (IT)'];
    const validProdiFish = ['Manajemen', 'Akuntansi'];
    
    if (fakultas === 'Fakultas Sains dan Teknologi (FaST)' && !validProdiFast.includes(program_studi)) {
        pesanError.push("Program studi tidak valid untuk fakultas tersebut");
    } else if (fakultas === 'Fakultas Ilmu Sosial dan Humaniora (FISH)' && !validProdiFish.includes(program_studi)) {
        pesanError.push("Program studi tidak valid untuk fakultas tersebut");
    }

    if(!angkatan || isNaN(angkatan) || angkatan < 2000 || angkatan >2100){
        pesanError.push("harap isi angkatan mahasiswa antara 2000-2100");
    }
    return pesanError;
}

function showCreateForm(req,res){
    res.render('pages/mahasiswa/create');
}

function listMahasiswa(req,res){
    const mahasiswa = mahasiswaModel.ambilSemuaMahasiswa();
    res.render('pages/mahasiswa/list', {mahasiswa});
}

function showEditForm(req,res){
    const {id} = req.params;
    const mahasiswa = mahasiswaModel.ambilMahasiswaById(id);
    res.render('pages/mahasiswa/edit',{mahasiswa});
}

function createMahasiswa(req,res){
    const {nim,nama,email,fakultas,program_studi,angkatan} = req.body;
    const pesanError = validateMahasiswa(nim,nama,email,fakultas,program_studi,angkatan);

    if(pesanError.length > 0){
        res.render('pages/mahasiswa/create',{
            pesanError,
            FormData: {nim,nama,email,fakultas,program_studi,angkatan}
        });
        return;
    }

    mahasiswaModel.buatMahasiswa(nim,nama,email,fakultas,program_studi,angkatan);
    kirimEmailDataUser(nama,email,nim,fakultas,program_studi,angkatan);
    res.redirect('/mahasiswa/list');
}

function editMahasiswa(req,res){
    const {id} = req.params;
    const {nim,nama,email,fakultas,program_studi,angkatan} = req.body;
    const pesanError = validateMahasiswa(nim,nama,email,fakultas,program_studi,angkatan);

    if(pesanError.length > 0){
        res.render('pages/mahasiswa/edit',{
            pesanError,
            mahasiswa:{id,nim,nama,email,fakultas,program_studi,angkatan}
        });
        return;
    }
    mahasiswaModel.updateMahasiswa(id,nim,nama,email,fakultas,program_studi,angkatan);
    res.redirect('/mahasiswa/list');
}

async function kirimEmailDataUser(nama,email,password,fakultas,program_studi,angkatan){
    const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <div style="background: linear-gradient(135deg, #0d6efd, #0a58ca); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px;">Web Absensi IBBI</h1>
  </div>
  <div style="padding: 20px; background: #fafafa;">
      <p style="font-size: 16px; color: #333;">Halo <strong>${nama}</strong>,</p>
      <p style="font-size: 14px; color: #555;">Akun <strong>Mahasiswa ${program_studi} Angkatan ${angkatan}</strong> Anda telah berhasil dibuat di sistem Web Absensi IBBI. Berikut adalah kredensial login Anda:</p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #fff; border: 1px solid #ddd; border-radius: 4px;">
          <tr>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px; color: #333;">Email</td>
              <td style="padding: 10px 15px; border-bottom: 1px solid #eee; color: #0d6efd;">${email}</td>
          </tr>
          <tr>
              <td style="padding: 10px 15px; font-weight: bold; color: #333;">Password</td>
              <td style="padding: 10px 15px; color: #dc3545;">${password}</td>
          </tr>
      </table>

      <p style="font-size: 13px; color: #888; font-style: italic;">⚠️  Sebaiknya segera ganti password setelah login pertama.</p>

      <div style="text-align: center; margin: 25px 0;">
          <a href="${APP_URL}/auth/login" style="background: #0d6efd; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; display: inline-block;">Login Sekarang</a>
      </div>
  </div>
  <div style="padding: 15px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee;">
      <p>© 2026 Web Absensi IBBI. Sistem Informasi Akademik.</p>
      <p>Email ini dikirim otomatis, jangan membalas email ini.</p>
  </div>
</div>
`;

  await transporter.sendMail({
    from: {
        name:'admin ibbi',
        address:'admin@ibbi.com',
    },
    to:email,
    subject:`akun ibbi - ${nama}`,
    html:html,
  });
}

function deleteMahasiswa(req,res){
    const {id} = req.params;
    mahasiswaModel.hapusMahasiswa(id);
    res.redirect('/mahasiswa/list');
}

module.exports = {
    listMahasiswa,
    showEditForm,
    createMahasiswa,
    editMahasiswa,
    deleteMahasiswa,
    kirimEmailDataUser,
    showCreateForm
}