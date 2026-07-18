const router = require('express').Router();
const kelasController = require('../controllers/kelasController');

router.get('/create', kelasController.showCreateForm);
router.get('/list', kelasController.listKelas);
router.get('/detail/:id', kelasController.detailKelas);
router.get('/edit/:id', kelasController.showEditForm);
router.post('/create', kelasController.createKelas);
router.post('/edit/:id', kelasController.editKelas);
router.post('/delete/:id', kelasController.deleteKelas);

// API endpoint for dynamic fetching in the form
router.get('/api/dosen', kelasController.getDosenByFakultas);
router.get('/api/mahasiswa', kelasController.getMahasiswaByKriteria);
router.get('/api/angkatan', kelasController.getAngkatanByKriteria);

module.exports = router;
