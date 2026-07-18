const router = require('express').Router();
const { editAdmin } = require('../controllers/adminController');
const dosenController = require('../controllers/dosenController');

router.get('/create', dosenController.showCreateForm);
router.get('/list', dosenController.listDosen);
router.get('/edit/:id', dosenController.showEditForm);
router.post('/create', dosenController.createDosen);
router.post('/edit/:id', dosenController.editDosen);
router.post('/delete/:id',dosenController.deleteDosen);

module.exports = router;