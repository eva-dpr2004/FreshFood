const express = require('express');
const router = express.Router();
const recettesController = require('../controllers/recettes');
const middleware = require('../middleware/middleware');
const { upload } = require('../config/multer');
const usersController = require('../controllers/users');


router.post('/addRecipe', upload.single('images'),  middleware.isLoggedIn, recettesController.addRecipes);

router.get('/addRecipe',  recettesController.showAddRecipes);

router.get('/userRecipes', recettesController.GetRecipes, middleware.isLoggedIn);

module.exports = router;