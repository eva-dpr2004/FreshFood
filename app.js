const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use('/uploads', express.static('uploads'));

// Parse url encoded bodies
app.use(express.urlencoded({ extended: false }));

// Parse JSON bodies
app.use(express.json());

//cookie-parser
app.use(cookieParser());

// EJS
app.set('view engine', 'ejs');

// ROUTES
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/recettes'));
app.use('/profile' , require('./routes/pages'));

// PORT EN ECOUTE
app.listen(3000, () => {
    console.log("Le serveur tourne sur le port 3000");
});


