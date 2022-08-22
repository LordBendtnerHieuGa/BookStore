const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
// const { render } = require('ejs');
let ObjectId = require('mongoose').ObjectId ;






// Get register

router.get('/register', function (req, res) {
    
    res.render('register', {
        title: 'Register',
            
    });
   


});

// /*
//  * POST register
//  */
router.post('/register', function (req, res) {

    let username = req.body.username;
    let email = req.body.email;
    let address = req.body.address;
    let phonenumber = req.body.phonenumber;
    let password = req.body.password;
    let password2 = req.body.password2;

    req.checkBody('username', 'Username is required!').notEmpty();
    req.checkBody('email', 'Email is required!').isEmail();
    req.checkBody('address', 'Address is required!').notEmpty();
    req.checkBody('phonenumber', 'Phone Number is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('password2', 'Passwords do not match!').equals(password);

    const errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            user: null,
            title: 'Register'
        });
    } else {
        User.findOne({username: username}, function (err, user) {
            if (err)
                console.log(err);

            if (user) {
                req.flash('danger', 'Username exists, choose another!');
                res.redirect('/users/register');
            } else {
                let user = new User({
                    username: username,
                    email: email,
                    address: address,
                    phonenumber: phonenumber,
                    password: password,
                    role: 1
                });

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(user.password, salt, function (err, hash) {
                        if (err)
                            console.log(err);

                        user.password = hash;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You are now registered!');
                                res.redirect('/users/login')
                            }
                        });
                    });
                });
            }
        });
    }

});

// /*
//  * GET login
//  */
router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');
    
    res.render('login', {
        title: 'Log in'
    });

});

// /*
//  * POST login
//  */
router.post('/login', function (req, res, next) {

    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

    
});


// /*
//  *  Get logout
//  */
router.get('/logout', function (req, res) {

    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/users/login');
});

// //

// router.get('/{username}',async function (req, res) {
//     try {
//         const username = req.params.username;

//         const user = await User.findById(username);

//         if (!user) return res.status(401).json({message: 'User does not exist'});

//         res.render('profileUser', {
//             title: 'Profile',
//             username: user.username,
//             email: user.email,
//             address: user.address,
//             phonenumber: user.phonenumber

//         });
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// });
// GET Profile

router.get('/me', function (req, res) {


    res.render('profileUser', {
        title: 'Profile'
    });

});

// Change Profile
router.get('/me/update', function (req, res) {


//    User.findById( req.params.id, (err, up) => {

            res.render('updateMe', {
                title: 'Change Profile'
                // username: up.username,
                // email: up.email,
                // address: up.address,
                // phonenumber: up.phonenumber,
                // id: up._id
            });
            
            // if(err) { return console.log(err) };
    // });
});

// POST update profle
// router.post("/me/update", (req, res) => {
//     const { username, email, phonenumber } = req.body;
//     const _id = ObjectId(req.session.passport.user._id);
//     console.log(_id)
//     User.findOne({ _id: _id })
//       .then((user) => {
//         if (!user) {
//           req.flash("error_msg", "user not found");
//           res.redirect("/me/update");
//         }
//         if (typeof username !== "undefined") {
//           user.username = username;
//           console.log(user.username);
//         }
//         if (typeof email !== "undefined") {
//           user.email = email;
//         }
//         if (typeof phonenumber !== "undefined") {
//           user.phonenumber = phonenumber;
//         }
     
//         user.save().then((User) => {
//           req.flash('success', 'details updated successfully');
//           res.redirect("/me/update");
//         });
//     })
//     .catch((err) => console.log(err));
// });

router.post('/me/update', function(req, res, next){

    User.findById(req.user.id, function (err, user) {

        // todo: don't forget to handle err
        if (err) {
            console.log(err);
            res.redirect('/me');
        }

        if (!user) {
            req.flash('error', 'No account found');
            return res.redirect('/me');
        }

        // good idea to trim 
        let email = req.body.email //.trim();
        let username = req.body.username//.trim();
        let address = req.body.address//.trim();
        let phonenumber = req.body.phonenumber;

        // validate 
        if (!email || !username || !address || !phonenumber) { // simplified: '' is a falsey
            req.flash('danger', 'One or more fields are empty');
            return res.redirect('/me'); // modified
        }

        // no need for else since you are returning early ^
        user.email = email;
        // user.local.email = email; // why do you have two? oh well
        user.phonenumber = phonenumber;
        user.address = address;
        user.username = username;

        // don't forget to save!
        user.save(function (err) {

            if (err) return console.log(err);

            req.flash('success', 'Profile edited!');
            res.redirect('/me');
        });
    });
});

// GET Change Password

// router.get('/me/pass', function (req, res) {


//     // User.findById( req.params.id, (err, up) => {
    
//     //             res.render('updatePass', {
//     //                 title: 'Change Password'
//                     // username: up.username,
//                     // email: up.email,
//                     // address: up.address,
//                     // phonenumber: up.phonenumber,
//                     // id: up._id
//                 });
                
//                 // if(err) { return console.log(err) };
//         // });
//     });
// });


module.exports = router;