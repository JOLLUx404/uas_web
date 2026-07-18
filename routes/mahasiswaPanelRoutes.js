const router = require('express').Router();
const mahasiswaPanelController = require('../controllers/mahasiswaPanelController');

router.get('/dashboard', mahasiswaPanelController.dashboard);
router.get('/data-kelas', mahasiswaPanelController.dataKelas);
router.get('/bimbingan', mahasiswaPanelController.bimbingan);
router.post('/request-bimbingan', mahasiswaPanelController.requestBimbingan);

module.exports = router;
