const kelasModel = require('../models/kelasBimbingan');
const dosenModel = require('../models/dosen');
const bimbinganModel = require('../models/bimbinganKelas');

function dashboard(req, res) {
    const userId = req.session.user_id;
    const dosen = dosenModel.ambilDosenById(userId);
    
    if (!dosen) {
        return res.status(403).send("Dosen tidak ditemukan");
    }

    const kelas = kelasModel.ambilKelasBimbinganByDosenId(dosen.dosen_id);
    const bimbinganList = bimbinganModel.ambilBimbinganByDosenId(dosen.dosen_id);
    
    // Count stats
    const totalKelas = kelas.length;
    const pendingBimbingan = bimbinganList.filter(b => b.status === 'menunggu').length;
    
    let totalMahasiswa = 0;
    kelas.forEach(k => {
        const mhs = kelasModel.ambilMahasiswaByKelasId(k.id);
        totalMahasiswa += mhs.length;
    });

    res.render('pages/dosen-panel/dashboard', { 
        dosen, 
        totalKelas, 
        totalMahasiswa, 
        pendingBimbingan 
    });
}

function dataKelas(req, res) {
    const userId = req.session.user_id;
    const dosen = dosenModel.ambilDosenById(userId);
    
    if (!dosen) {
        return res.status(403).send("Dosen tidak ditemukan");
    }

    const kelas = kelasModel.ambilKelasBimbinganByDosenId(dosen.dosen_id);
    res.render('pages/dosen-panel/data-kelas', { dosen, kelas });
}

function detailKelas(req, res) {
    const { id } = req.params;
    const userId = req.session.user_id;
    const dosen = dosenModel.ambilDosenById(userId);
    
    const kelas = kelasModel.ambilKelasBimbinganById(id);
    
    if (!kelas || kelas.dosen_id !== dosen.dosen_id) {
        return res.status(403).send("Anda tidak memiliki akses ke kelas ini");
    }

    const mahasiswaList = kelasModel.ambilMahasiswaByKelasId(id);

    res.render('pages/dosen-panel/detail', { kelas, mahasiswaList });
}

function assignKomting(req, res) {
    const { id } = req.params;
    const { komting_id } = req.body;
    const userId = req.session.user_id;
    const dosen = dosenModel.ambilDosenById(userId);
    
    const kelas = kelasModel.ambilKelasBimbinganById(id);
    if (!kelas || kelas.dosen_id !== dosen.dosen_id) {
        return res.status(403).send("Anda tidak memiliki akses ke kelas ini");
    }

    // Set komting_id to null if empty string is passed
    const komtingVal = komting_id === '' ? null : komting_id;

    kelasModel.updateKomting(id, komtingVal);
    res.redirect(`/dosen-panel/data-kelas/${id}`);
}

function bimbingan(req, res) {
    const userId = req.session.user_id;
    const dosen = dosenModel.ambilDosenById(userId);
    
    if (!dosen) {
        return res.status(403).send("Dosen tidak ditemukan");
    }

    const bimbinganList = bimbinganModel.ambilBimbinganByDosenId(dosen.dosen_id);
    res.render('pages/dosen-panel/bimbingan', { dosen, bimbinganList });
}

function updateBimbinganStatus(req, res) {
    const { id } = req.params;
    const { status, catatan } = req.body;
    
    const bimbingan = bimbinganModel.ambilBimbinganById(id);
    if (!bimbingan) {
        return res.status(404).send("Bimbingan tidak ditemukan");
    }

    const userId = req.session.user_id;
    const dosen = dosenModel.ambilDosenById(userId);
    const kelas = kelasModel.ambilKelasBimbinganById(bimbingan.kelas_bimbingan_id);
    
    if (!kelas || kelas.dosen_id !== dosen.dosen_id) {
        return res.status(403).send("Anda tidak memiliki akses ke kelas ini");
    }

    // Backend validation to prevent updating locked bimbingan
    if (bimbingan.status === 'selesai' || bimbingan.status === 'ditolak') {
        return res.status(403).send("Bimbingan yang sudah selesai atau ditolak tidak dapat diubah lagi.");
    }

    bimbinganModel.updateStatusBimbingan(id, status, catatan);
    res.redirect(`/dosen-panel/bimbingan`);
}

module.exports = {
    dashboard,
    dataKelas,
    detailKelas,
    assignKomting,
    bimbingan,
    updateBimbinganStatus
};
