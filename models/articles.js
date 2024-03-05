const jwt = require('jsonwebtoken');
const db = require('../config/config');
const { promisify } = require('util');

// ARTICLES 
exports.articles = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('articles', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('articles', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('articles', {accountUser})
    }
}