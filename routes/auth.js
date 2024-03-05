const express = require('express');
const authController = require('../controllers/auth');
const usersController = require('../controllers/users');
const middleware = require('../middleware/middleware');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.post('/update',  middleware.isLoggedIn, usersController.update);

router.post('/updateAdmin',middleware.isAdmin, usersController.updateAdmin);

router.post('/delete',  middleware.isLoggedIn, usersController.delete);

router.post('/deleteAdmin',  middleware.isAdmin, usersController.deleteAdmin);

module.exports = router;