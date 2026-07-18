const mahasiswaModel = require('../models/mahasiswa');
const kelasModel = require('../models/kelasBimbingan');
const bimbinganModel = require('../models/bimbinganKelas');

function dashboard(req, res) {
    res.redirect('/mahasiswa-panel/data-kelas');
}

function dataKelas(req, res) {
    const userId = req.session.user_id;
    const mhs = mahasiswaModel.ambilMahasiswaById(userId);
    
    if (!mhs) {
        return res.status(403).send("Mahasiswa tidak ditemukan");
    }

    let kelas = null;
    let isKomting = false;
    let temanSekelas = [];

    if (mhs.kelas_bimbingan_id) {
        kelas = kelasModel.ambilKelasBimbinganById(mhs.kelas_bimbingan_id);
        
        if (kelas) {
            isKomting = (kelas.komting_id === mhs.mahasiswa_id);
            temanSekelas = kelasModel.ambilMahasiswaByKelasId(mhs.kelas_bimbingan_id);
        }
    }

    res.render('pages/mahasiswa-panel/data-kelas', { 
        mhs, 
        kelas, 
        isKomting, 
        temanSekelas
    });
}

function bimbingan(req, res) {
    const userId = req.session.user_id;
    const mhs = mahasiswaModel.ambilMahasiswaById(userId);
    
    if (!mhs) {
        return res.status(403).send("Mahasiswa tidak ditemukan");
    }

    let kelas = null;
    let isKomting = false;
    let bimbinganList = [];

    if (mhs.kelas_bimbingan_id) {
        kelas = kelasModel.ambilKelasBimbinganById(mhs.kelas_bimbingan_id);
        if (kelas) {
            isKomting = (kelas.komting_id === mhs.mahasiswa_id);
            bimbinganList = bimbinganModel.ambilBimbinganByKelasId(mhs.kelas_bimbingan_id);
        }
    }

    res.render('pages/mahasiswa-panel/bimbingan', { 
        mhs, 
        kelas, 
        isKomting, 
        bimbinganList 
    });
}

function requestBimbingan(req, res) {
    const userId = req.session.user_id;
    const mhs = mahasiswaModel.ambilMahasiswaById(userId);
    
    const { tanggal, jam } = req.body;

    if (!mhs || !mhs.kelas_bimbingan_id) {
        return res.status(403).send("Anda tidak memiliki akses ini.");
    }

    const kelas = kelasModel.ambilKelasBimbinganById(mhs.kelas_bimbingan_id);
    if (!kelas || kelas.komting_id !== mhs.mahasiswa_id) {
        return res.status(403).send("Hanya Komting yang bisa mengajukan jadwal bimbingan.");
    }

    // Backend validations
    if (!tanggal || !jam) {
        return res.status(400).send("Tanggal dan Jam harus diisi.");
    }

    // Parse date (yyyy-mm-dd) in local time
    const parts = tanggal.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateVal = new Date(year, month, day);
    const dayOfWeek = dateVal.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).send("Bimbingan tidak dapat diajukan pada hari Sabtu atau Minggu.");
    }

    // Parse time (hh:mm)
    const [hour, min] = jam.split(':').map(Number);
    if (hour < 13 || hour > 19 || (hour === 19 && min > 0)) {
        return res.status(400).send("Jam bimbingan hanya diperbolehkan antara pukul 13:00 sampai 19:00.");
    }

    bimbinganModel.buatBimbingan(mhs.kelas_bimbingan_id, tanggal, jam);
    res.redirect('/mahasiswa-panel/bimbingan');
}

module.exports = {
    dashboard,
    dataKelas,
    bimbingan,
    requestBimbingan
};
