const router = require('express').Router();
const dosenPanelController = require('../controllers/dosenPanelController');

router.get('/dashboard', dosenPanelController.dashboard);
router.get('/data-kelas', dosenPanelController.dataKelas);
router.get('/data-kelas/:id', dosenPanelController.detailKelas);
router.post('/data-kelas/:id/assign-komting', dosenPanelController.assignKomting);
router.get('/bimbingan', dosenPanelController.bimbingan);
router.post('/bimbingan/:id/update-status', dosenPanelController.updateBimbinganStatus);

module.exports = router;
