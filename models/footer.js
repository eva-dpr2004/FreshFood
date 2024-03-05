const jwt = require('jsonwebtoken');
const db = require('../config/config');
const { promisify } = require('util');

// donationLocation 
exports.donationLocation = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('donationLocation', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('donationLocation', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('donationLocation', {accountUser})
    }
}

// termOfUse 
exports.termsOfUse = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('termsOfUse', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('termsOfUse', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('termsOfUse', {accountUser})
    }
}


// termOfUse 
exports.contact = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('contact', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('contact', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('contact', {accountUser})
    }
}

