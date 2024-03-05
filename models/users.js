const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const db = require('../config/config');
const { promisify } = require('util');

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_+=]).{12,}$/;
    return passwordRegex.test(password);
};

const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name);
};

// update
exports.update = async (req, res) => {
    try {
        const { email, password, lastName, firstName } = req.body;
        // Validation des noms
        if ((lastName && !validateName(lastName)) || (firstName && !validateName(firstName))) {
            return res.status(400).render('update', {
                validationUpdateMessage: {
                    success: false,
                    text: 'Invalid name format',
                },
                user: req.user // Pass the user information to the view
            });
        }

        // Validation du mot de passe
        if (password && !validatePassword(password)) {
            return res.status(400).render('update', {
                validationUpdateMessage: {
                    success: false,
                    text: 'Invalid password format',
                },
                user: req.user // Pass the user information to the view
            });
        }
  
        if (!email && !password && !lastName && !firstName) {
            return res.status(400).render('update', {
                validationUpdateMessage: {
                    success: false,
                    text: 'Please fill in at least one field',
                },
                user: req.user // Pass the user information to the view
            });
        }
        try {
            const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
            const userId = decoded.userId;
  
            db.query('SELECT * FROM users WHERE UserId = ?', [userId], async (error, result) => {
                if (error) {
                    return res.status(500).render('update', {
                        validationUpdateMessage: {
                            success: false,
                            text: 'Error during update',
                        },
                        user: req.user // Pass the user information to the view
                    });
                } else {
                    if (!result) {
                        return res.status(404).render('update', {
                            validationUpdateMessage: {
                                success: false,
                                text: 'User not found.',
                            },
                            user: req.user // Pass the user information to the view
                        });
                    }
                    let updateQuery = '';
                    const updateValues = [];
  
                    if (email) {
                        updateQuery += 'email = ?,';
                        updateValues.push(email);
                    }
  
                    if (password) {
                        const hashedPassword = await bcryptjs.hash(password, 8);
                        updateQuery += 'password = ?,';
                        updateValues.push(hashedPassword);
                    }
  
                    if (lastName) {
                        updateQuery += 'lastName = ?,';
                        updateValues.push(lastName);
                    }
  
                    if (firstName) {
                        updateQuery += 'firstName = ?,';
                        updateValues.push(firstName);
                    }
  
                    // Remove the trailing comma from updateQuery
                    if (updateQuery.endsWith(',')) {
                        updateQuery = updateQuery.slice(0, -1);
                    }
  
                    // Add the userId to updateValues
                    updateValues.push(userId);
  
                    // Perform the update operation in the database
                    db.query('UPDATE users SET ' + updateQuery + ' WHERE UserId = ?', updateValues, (error, result) => {
                        if (error) {
                            return res.status(500).render('update', {
                                validationUpdateMessage: {
                                    success: false,
                                    text: 'Error during the update in the database',
                                },
                                user: req.user // Pass the user information to the view
                            });
                        } else {
                           
                          return res.status(200).redirect('/')
                        }
                    });
                }
            });
        } catch (error) {
            return res.status(401).render('update', {
                validationUpdateMessage: {
                    success: false,
                    text: 'Unauthorized access',
                },
                user: req.user // Pass the user information to the view
            });
        }
    } catch (error) {
        console.log(error);
    }
};
  
// supprimer le compte
exports.delete = async (req, res) => {
    try {
    // Get the user ID from the Req.Body
    const { userId } = req.body;
    // Delete the user from the database
    db.query('DELETE FROM users WHERE UserId = ?', [userId], (error, result) => {
        if (error) {
        return res.status(500).render('delete', {
            message: 'Error deleting account',
        });
        } else {
        // Clear the JWT cookie
        res.cookie('jwt', '', {
            expires: new Date(0),
            httpOnly: true,
        });

        // Redirect to the homepage
        return res.redirect('/');
        }
    });
    } catch (error) {
    return res.status(401).render('delete', {
        message: 'Unauthorized access',
    });
    }
};

// update Admin
exports.updateAdmin = async (req, res) => { 
    if (!req.cookies.jwt) {
        return res.redirect('/login'); 
    }
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ? AND role ="admin"', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('updateAdmin', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('updateAdmin', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('updateAdmin', {accountUser})
    }
    try {
        const { UserId, email, password, lastName, firstName } = req.body;
        // Validation des noms
        if ((lastName && !validateName(lastName)) || (firstName && !validateName(firstName))) {
            return res.status(400).render('updateAdmin', {
                validationUpdateMessage: {
                    success: false,
                    text: 'Invalid name format',
                },
            });
        }

        // Validation du mot de passe
        if (password && !validatePassword(password)) {
            return res.status(400).render('updateAdmin', {
                validationUpdateMessage: {
                    success: false,
                    text: 'Invalid password format',
                },
            });
        }
        // Vérifiez si l'utilisateur existe avec le UserId donné
        db.query('SELECT * FROM users WHERE UserId = ?', [UserId], async (error, result) => {
            if (error) {
                return res.status(500).render('updateAdmin', {
                    validationUpdateMessage: {
                        success: false,
                        text: 'Error during user lookup',
                    },
                });
            } else {
                if (result.length === 0) {
                    return res.status(404).render('updateAdmin', {
                        validationUpdateMessage: {
                            success: false,
                            text: 'User not found.',
                        },
                    });
                }

                let updateQuery = '';
                const updateValues = [];
                

                if (email) {
                    updateQuery += 'email = ?,';
                    updateValues.push(email);
                }

                if (password) {
                    const hashedPassword = await bcryptjs.hash(password, 8);
                    updateQuery += 'password = ?,';
                    updateValues.push(hashedPassword);
                }

                if (lastName) {
                    updateQuery += 'lastName = ?,';
                    updateValues.push(lastName);
                }

                if (firstName) {
                    updateQuery += 'firstName = ?,';
                    updateValues.push(firstName);
                }

                // Remove the trailing comma from updateQuery
                if (updateQuery.endsWith(',')) {
                    updateQuery = updateQuery.slice(0, -1);
                }

                // Add the UserId to updateValues
                updateValues.push(UserId);

                // Perform the update operation in the database
                db.query('UPDATE users SET ' + updateQuery + ' WHERE UserId = ?', updateValues, (error, result) => {
                    if (error) {
                        return res.status(500).render('updateAdmin', {
                            validationUpdateMessage: {
                                success: false,
                                text: 'Error during the update in the database',
                            },
                        });
                    } else {
                        return res.status(200).render('updateAdmin', {
                            validationUpdateMessage: {
                                success: true,
                                text: 'User updated successfully',
                            },
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

// delete Admin
exports.deleteAdmin = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.redirect('/login'); 
    }
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ? AND role="admin"', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('deleteAdmin', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('deleteAdmin', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('deleteAdmin', {accountUser})
    }
    try {
        const { UserId } = req.body;

        // Vérifiez si l'utilisateur existe avec le UserId donné
        db.query('SELECT * FROM users WHERE UserId = ?', [UserId], (error, result) => {
            if (error) {
                return res.status(500).render('deleteAdmin', {
                    validationDeleteMessage: {
                        success: false,
                        text: 'Error during user lookup',
                    },
                });
            } else {
                if (result.length === 0) {
                    return res.status(404).render('deleteAdmin', {
                        validationDeleteMessage: {
                            success: false,
                            text: 'User not found.',
                        },
                    });
                }

                // Supprimer l'utilisateur de la base de données
                db.query('DELETE FROM users WHERE UserId = ?', [UserId], (error, result) => {
                    if (error) {
                        return res.status(500).render('deleteAdmin', {
                            validationDeleteMessage: {
                                success: false,
                                text: 'Error during user deletion',
                            },
                        });
                    } else {
                        return res.status(200).render('deleteAdmin', {
                            validationDeleteMessage: {
                                success: true,
                                text: 'User deleted successfully',
                            },
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

 // loginGet
exports.loginGet = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('login', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('login', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('login', {accountUser})
    }
}

 // profilGet
 exports.profilGet = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.redirect('/login'); 
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

    // Check if the user exists
    db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) => {
        if (error) {
            const accountUser = "";
            return res.render('profile', { accountUser });
        } else {
            const accountUser = result[0];

            // Fetch all users from the database
            db.query('SELECT * FROM users', (error, allUsers) => {
                if (error) {
                    console.error('Error fetching all users:', error);
                    return res.status(500).send('Internal Server Error');
                }

                // Include all users in the render
                return res.render('profile', { accountUser, accountUsers: allUsers });
            });
        }
    });
};

// deleteProfil
exports.deleteProfil = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.redirect('/login'); 
    }
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('delete', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('delete', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('delete', {accountUser})
    }
}

// deleteProfil
exports.updateProfil = async (req, res) => {
    if (!req.cookies.jwt) {
        return res.redirect('/login'); 
    }
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('update', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('update', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('update', {accountUser})
    }
}

// registerGet
exports.registerGet = async (req, res)=>{
    if (req.cookies.jwt) {
        
        // Verification token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
        // Check si l'utilisateur existe
        db.query('SELECT * FROM users WHERE UserId = ?', [decoded.userId], (error, result) =>{
            if(error){
                const accountUser = ""
                 return res.render('register', {accountUser})
            } else {
                const accountUser = result[0]
                return res.render('register', {accountUser})
            }
        })      
    } 
    else {
        const accountUser = ""
        return res.render('register', {accountUser})
    }
}

// AllUser
exports.AllUser = (req, res) => {
    try {
      // Fetch users from the database
      db.query('SELECT * FROM users', (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500);
        }
  
        // Send the fetched users as JSON response
        res.status(200).json({ users: results });
        return res.render('profile', {users})
      });
    } catch (error) {
      console.error(error);
      res.status(500);
    }
};










