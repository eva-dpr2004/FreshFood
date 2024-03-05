const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/config');

const validatePassword = (password) => {
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=]).{12,}$/;
return passwordRegex.test(password);
};

const validateName = (name) => {
const nameRegex = /^[A-Za-z]+$/;
return nameRegex.test(name);
};

// Créé un utilisateur
exports.register = (req, res) => {
    const { lastName, firstName, email, password, passwordConfirm } = req.body;
        // Validation du mot de passe
        if (!validatePassword(password)) {
            return res.render('register', {
                errorMessage: "The password does not meet the security criteria (at least 12 characters, including at least one uppercase letter, one digit, and one special character among !@#$%^&*()-_+=)."
            });
        }
        // Validation des noms
        if (!validateName(lastName) || !validateName(firstName)) {
            return res.render('register', {
                errorMessage: "Names must contain only letters."
            });
        }


        db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.log(error);
            }
            if (results.length > 0) {
                return res.render('register', {
                    errorMessage: "L'email est déjà pris"
                });
            } else if (password !== passwordConfirm) {
                return res.render('register', accountUser()({
                    errorMessage: "Le mot de passe n'est pas correct"
                }));
            }

            const hashedPassword = await bcryptjs.hash(password, 8);

            db.query('INSERT INTO users SET ?', { lastName: lastName, firstName: firstName, email: email, password: hashedPassword }, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.status(200).redirect('/login');
                }
        });
    });
};

// Se connecter
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                remplirMessage: 'Svp veuillez entrer un email et un mdp'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            if (!results || results.length === 0 || !(await bcryptjs.compare(password, results[0].password))) {
                res.status(401).render("login", {
                    incorrectMessage: 'Email ou Mots de Passe Incorrect '
                });
            } else {

                const userId = results[0].UserId;

                const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');
            }
        })

    } catch (error) {
        console.log(error);
    }
}

 // Logout
 exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(0),
        httpOnly: true
    });

    res.status(200).redirect('/');
};