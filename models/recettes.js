const jwt = require('jsonwebtoken');
const db = require('../config/config');
const { upload } = require('../config/multer');
const { promisify } = require('util');
const { log } = require('console');

 // RECETTES
 exports.recettes = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('recettes', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('recettes', {accountUser})
            }
            
        })      
    } 
    else {
        const accountUser = ""
        return res.render('recettes', {accountUser})
    }
}

exports.showAddRecipes = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('addRecipe', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('addRecipe', {accountUser})

            }
            
        })      
    } 
    else {
        const accountUser = ""
        return res.render('addRecipe', {accountUser})
    }
}

exports.addRecipes = async (req, res) => {
    const { titreRecettes, categorieRecettes, nombrePersonnes, ingredients, etapesRecettes ,UserId   } = req.body;
    const images = req.file.filename; // Assuming you are using multer for file upload

    // Save the relative path to the image
    const imagePath = `/uploads/${images}`;

    // Insert the recipe into the database&&
    db.query('INSERT INTO recettes SET ?', { titreRecettes, categorieRecettes, images: imagePath, nombrePersonnes, ingredients, etapesRecettes ,UserId }, (error, results) => {
        if (error) {
            console.log(error);
        } else {
            return res.redirect('/userRecipes');
        }
    });
}

exports.GetRecipes = async (req, res) => {
    db.query('SELECT * FROM recettes', (error, Allrecettes) => {
        if (error) {
            console.error('Error fetching all users:', error);
            return res.status(500).send('Internal Server Error');
        }

        // Include all users in the render
        return res.render('userRecipes', { recettes: Allrecettes });
    });
}


