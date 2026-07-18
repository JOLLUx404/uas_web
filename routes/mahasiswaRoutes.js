const router = require('express').Router();
const mahasiswaController = require('../controllers/mahasiswaController');

router.get('/create', mahasiswaController.showCreateForm);
router.get('/list', mahasiswaController.listMahasiswa);
router.get('/edit/:id',mahasiswaController.showEditForm);
router.get('/create',mahasiswaController.createMahasiswa);
router.post('/edit/:id', mahasiswaController.editMahasiswa);
router.post('/delete/:id', mahasiswaController.deleteMahasiswa);

module.exports = router;