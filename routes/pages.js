const express = require('express');
const router = express.Router();
const middleware = require('../middleware/middleware')
const { log } = require('util');
const { upload } = require('../config/multer');

const authController = require('../controllers/auth');
const recettesController = require('../controllers/recettes');
const homeController = require('../controllers/home');
const articlesController = require('../controllers/articles');
const usersController = require('../controllers/users');
const footerController = require('../controllers/footer');

// Homepage
router.get('/', homeController.home);

// Recettes
router.get('/recettes', recettesController.recettes);

// Articles
router.get('/articles', articlesController.articles);

// Register
router.get('/register', usersController.registerGet);

// Login
router.get('/login', middleware.isLoggedIn, usersController.loginGet);

// Profile
router.get('/profile', middleware.isLoggedIn, usersController.profilGet);

// Update
router.get('/update', middleware.isLoggedIn, usersController.updateProfil);

// Delete
router.get('/delete', middleware.isLoggedIn, usersController.deleteProfil);

// Donation location
router.get('/donationLocation', footerController.donationLocation);

// contact
router.get('/contact', footerController.contact);

// Terms Of Use
router.get('/termsOfUse', footerController.termsOfUse);

//ADMIN 

//UpdateAdmin
router.get('/updateAdmin', usersController.updateAdmin);

//DeleteAdmin
router.get('/deleteAdmin', usersController.deleteAdmin);

module.exports = router;