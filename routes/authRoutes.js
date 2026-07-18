const router = require('express').Router();
const authController = require ('../controllers/authController');
const {isNotAuthenticated} = require ('../middlewares/authMiddlewares');

router.get('/login', isNotAuthenticated, authController.showLoginForm);

router.post('/login', isNotAuthenticated, authController.handleLogin);

router.get('/logout', authController.handleLogout);

router.get('/forgot-password', isNotAuthenticated, authController.showForgotPasswordForm);

router.post('/forgot-password', isNotAuthenticated, authController.handleForgotPassword);

router.get('/reset-password', isNotAuthenticated, authController.showResetPasswordForm);

router.post('/reset-password', isNotAuthenticated, authController.handleResetPassword);

module.exports = router;