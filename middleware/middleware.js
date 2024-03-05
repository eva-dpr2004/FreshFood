const jwt = require('jsonwebtoken')
const mysql = require('mysql');
const db = require('../config/config')
const { promisify } = require('util');
const { log } = require('util');

module.exports = {
    // En étant connecté
    isLoggedIn: async (req, res, next) => {

        if (req.cookies.jwt) {
            try {
              
                // Verification token
                const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
                // Check si l'utilisateur existe
                await db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) => {
    
                    if (!result || result.length === 0) {
                        return next();
                    }
                    req.user = result[0]
                    req.infoUsers = result
                    
                    
                    return next();
                });
    
            } catch (error) {
                return next();
            }
        } else {
            next();
        }
    },
    // admin
    isAdmin: async (req, res, next) => {
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
        // Check si l'utilisateur existe
        db.query(`SELECT * FROM users WHERE UserId = ? AND role="admin"`, [decoded.userId], (error, result) =>{
           if (result.length > 0) {
            next();
           } else {
            res.redirect('/');
           }
        })  
    },
}