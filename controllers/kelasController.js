const kelasModel = require('../models/kelasBimbingan');
const dosenModel = require('../models/dosen');
const mahasiswaModel = require('../models/mahasiswa');
const bimbinganModel = require('../models/bimbinganKelas');

function validateKelas(nama_kelas, fakultas, program_studi, angkatan, dosen_id) {
    const pesanError = [];
    if (!nama_kelas || nama_kelas.trim() === '') pesanError.push("Nama kelas tidak boleh kosong");
    if (!fakultas) pesanError.push("Fakultas harus dipilih");
    if (!program_studi) pesanError.push("Program studi harus dipilih");
    if (!angkatan) pesanError.push("Angkatan harus diisi");
    if (!dosen_id) pesanError.push("Dosen pembimbing harus dipilih");
    return pesanError;
}

function showCreateForm(req, res) {
    res.render('pages/kelas/create');
}

function listKelas(req, res) {
    const kelas = kelasModel.ambilSemuaKelasBimbingan();
    res.render('pages/kelas/list', { kelas });
}

function showEditForm(req, res) {
    const { id } = req.params;
    const kelas = kelasModel.ambilKelasBimbinganById(id);
    const mahasiswaList = kelasModel.ambilMahasiswaByKelasId(id);
    const mahasiswaIds = mahasiswaList.map(m => m.mahasiswa_id);
    
    res.render('pages/kelas/edit', { kelas, mahasiswaIds: JSON.stringify(mahasiswaIds) });
}

function createKelas(req, res) {
    const { nama_kelas, fakultas, program_studi, angkatan, dosen_id, mahasiswa_ids } = req.body;
    const pesanError = validateKelas(nama_kelas, fakultas, program_studi, angkatan, dosen_id);

    if (pesanError.length > 0) {
        res.render('pages/kelas/create', {
            pesanError,
            FormData: { nama_kelas, fakultas, program_studi, angkatan, dosen_id }
        });
        return;
    }

    const kelasId = kelasModel.buatKelasBimbingan(nama_kelas, fakultas, program_studi, angkatan, dosen_id);

    // Update students' kelas_bimbingan_id
    if (mahasiswa_ids) {
        const ids = Array.isArray(mahasiswa_ids) ? mahasiswa_ids : [mahasiswa_ids];
        ids.forEach(mId => {
            mahasiswaModel.updateKelasMahasiswa(mId, kelasId);
        });
    }

    res.redirect('/kelas/list');
}

function editKelas(req, res) {
    const { id } = req.params;
    const { nama_kelas, fakultas, program_studi, angkatan, dosen_id, mahasiswa_ids } = req.body;
    const pesanError = validateKelas(nama_kelas, fakultas, program_studi, angkatan, dosen_id);

    if (pesanError.length > 0) {
        res.render('pages/kelas/edit', {
            pesanError,
            kelas: { id, nama_kelas, fakultas, program_studi, angkatan, dosen_id }
        });
        return;
    }

    kelasModel.updateKelasBimbingan(id, nama_kelas, fakultas, program_studi, angkatan, dosen_id);

    // First remove all students from this class
    const currentStudents = kelasModel.ambilMahasiswaByKelasId(id);
    currentStudents.forEach(s => {
        mahasiswaModel.updateKelasMahasiswa(s.mahasiswa_id, null);
    });

    // Then assign the new ones
    if (mahasiswa_ids) {
        const ids = Array.isArray(mahasiswa_ids) ? mahasiswa_ids : [mahasiswa_ids];
        ids.forEach(mId => {
            mahasiswaModel.updateKelasMahasiswa(mId, id);
        });
    }

    res.redirect('/kelas/list');
}

function deleteKelas(req, res) {
    const { id } = req.params;
    kelasModel.hapusKelasBimbingan(id);
    res.redirect('/kelas/list');
}

// APIs for AJAX
function getDosenByFakultas(req, res) {
    const { fakultas } = req.query;
    const allDosen = dosenModel.ambilSemuaDosen();
    const filtered = allDosen.filter(d => d.fakultas === fakultas);
    res.json(filtered);
}

function getMahasiswaByKriteria(req, res) {
    const { fakultas, program_studi, angkatan } = req.query;
    const allMahasiswa = mahasiswaModel.ambilSemuaMahasiswa();
    let filtered = allMahasiswa.filter(m => 
        m.fakultas === fakultas && 
        m.program_studi === program_studi && 
        String(m.angkatan) === String(angkatan)
    );
    res.json(filtered);
}

function getAngkatanByKriteria(req, res) {
    const { fakultas, program_studi } = req.query;
    const angkatanList = mahasiswaModel.ambilAngkatanByKriteria(fakultas, program_studi);
    res.json(angkatanList);
}

function detailKelas(req, res) {
    const { id } = req.params;
    const kelas = kelasModel.ambilKelasBimbinganById(id);
    const mahasiswaList = kelasModel.ambilMahasiswaByKelasId(id);
    const bimbinganList = bimbinganModel.ambilBimbinganByKelasId(id);
    
    res.render('pages/kelas/detail', { kelas, mahasiswaList, bimbinganList });
}

module.exports = {
    showCreateForm,
    listKelas,
    showEditForm,
    createKelas,
    editKelas,
    deleteKelas,
    detailKelas,
    getDosenByFakultas,
    getMahasiswaByKriteria,
    getAngkatanByKriteria
};
