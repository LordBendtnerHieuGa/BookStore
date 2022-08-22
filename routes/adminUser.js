const express = require('express');
const router = express.Router();
//const mkdirp = require('mkdirp');
const fs = require('fs-extra');
//const resizeImg = require('resize-img');
// const auth = require('../config/auth');
// let isAdmin = auth.isAdmin;

// Get User model
const User = require('../models/userModel');
//const Category = require('../models/categoryModel');

// Get users index

router.get('/', function (req, res) {
    let countUser;
    
    User.count(function(err, u) {
        countUser = u;
    });

    User.find(function(err, users){
            if(err) return console.log(err);
        res.render('./admin/users', {
            users: users,
            countUser: countUser
        });
    });
    
});



// Get add books

// router.get('/add-book', (req, res) => {
//     let  title = "";
//     let  author = "";
//     let  year = "";
//     let  desc = "";
//     let  isbn = "";
//     let  pagesCount = "";
//     let  price = "";
    
//     Category.find(function (err, categories){

//         res.render('admin/addBook', {
//             title: title,
//             author: author,
//             year: year,
//             desc: desc,
//             isbn: isbn,
//             pagesCount: pagesCount,
//             categories: categories,
//             price: price
//         });

//     });
// });

// POST add books

// router.post('/add-book', (req, res) => {

//     let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

//     req.checkBody('title', 'Title must have a value!').notEmpty();
//     req.checkBody('author', 'Author must have a value!').notEmpty();
//     req.checkBody('year', 'Relase year must have a value!').notEmpty();
//     req.checkBody('desc', 'Description must have a value!').notEmpty();
//     req.checkBody('pagesCount', 'Pages Count must have a value!').notEmpty();
//     req.checkBody('isbn', 'ISBN must have a value!').notEmpty();
//     req.checkBody('price', 'Price must have a value!').isDecimal();
//     req.checkBody('image', 'Image must have a value!').isImage(imageFile);

//     let title = req.body.title;
//     let slug = title.replace(/\s+/g, '-').toLowerCase(); 
//     let author = req.body.author;
//     let year = req.body.year;
//     let desc = req.body.desc;
//     let pagesCount = req.body.pagesCount;
//     let isbn = req.body.isbn;
//     let price = req.body.price;
//     let category = req.body.category;

//     let errors = req.validationErrors();
    

//     if (errors) {
//         Category.find(function (err, categories) {
//             res.render('admin/addBook', {
//                 errors: errors,
//                 title: title,
//                 author: author,
//                 year: year,
//                 desc: desc,
//                 isbn: isbn,
//                 pagesCount: pagesCount,
//                 categories: categories,
//                 price: price
//             });
//         });
//     } else {
//         Book.findOne({slug: slug}, function (err, book) {
//             if (book) {
//                 req.flash('danger', 'Book title exists, choose another.');
//                 Category.find(function (err, categories) {
//                     res.render('admin/addBook', {
//                         title: title,
//                         author: author,
//                         year: year,
//                         desc: desc,
//                         isbn: isbn,
//                         pagesCount: pagesCount,
//                         categories: categories,
//                         price: price
//                     });
//                 });
//             } else {
//                 let price2 = parseFloat(price).toFixed(2);
//                 let book = new Book({
//                     title: title,
//                     slug: slug,
//                     author: author,
//                     year: year,
//                     desc: desc,
//                     isbn: isbn,
//                     pagesCount: pagesCount,
//                     category: category,
//                     price: price2,
//                     image: imageFile
//                 });

//                 book.save(function (err) {
//                     if (err)
//                         return console.log(err);

//                     // Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
//                     //     if (err) {
//                     //         console.log(err);
//                     //     } else {
//                     //         req.app.locals.pages = pages;
//                     //     }
//                     // });
//                     mkdirp('public/bookImages/' + book._id, function(err){
//                         return console.log(err);
//                     });

//                     mkdirp('public/bookImages/' + book._id + '/gallery', function (err) {
//                         return console.log(err);
//                     });

//                     mkdirp('public/bookImages/' + book._id + '/gallery/thumbs', function (err) {
//                         return console.log(err);
//                     });

//                     if (imageFile != "") {
//                         let bookImage = req.files.image;
//                         let path = 'public/bookImages/' + book._id + '/' + imageFile;

//                         bookImage.mv(path, function (err) {
//                             return console.log(err);
//                         });
//                     }

//                     req.flash('success', 'Book added!');
//                     res.redirect('/admin/books');
//                 });
//             }
//         });
//     }

// });




// Get edit user
router.get('/edit-user/:id', function (req, res) {

    let errors;

    if (req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;

    

    User.findById(req.params.id, function (err, u) {
        if (err) {
            console.log(err);
            res.redirect('/admin/users');
        } else {

            res.render('admin/editUser', {
                errors: errors,
                username: u.username,
                //slug: u.slug,
                email: u.email,
                //password: u.password,
                //image: u.image,
                id: u._id,
                role: u.role
            });
        }
                
    });

});

// Post edit User

router.post('/edit-user/:id', (req, res) => {

    req.checkBody('username', 'Username must have a value!').notEmpty();
    req.checkBody('email', 'Email must have a value!').notEmpty();
    //req.checkBody('password', 'Password must have a value!').notEmpty();
    req.checkBody('role', 'Role must have a value!').isDecimal();
 
    let username = req.body.username;
    let slug = username.replace(/\s+/g, '-').toLowerCase(); 
    let email = req.body.email;
    //let password = req.body.password;
    let role = req.body.role;
    let id = req.params.id;

    let errors = req.validationErrors();

    if (errors) {
        // res.render('admin/editUser', {
            // errors: errors,
            // slug: slug,
            // username: username,
            // email: email,
            // password: password,
            // role: role,
            // id: id
        //});
        req.session.errors = errors;
        res.redirect('/admin/users/edit-user/' + id);
        
    } else {
        User.findOne({ slug: slug, _id: {'$ne':id}}, function (err, u) {
            if (u) {
                req.flash('danger', 'Username exists, choose another.');
                // res.render('admin/editUser', {
                //     username: username,
                //     email: email,
                //     role: role,
                //     id: id
                // });
                res.redirect('/admin/users/edit-user/' + id);
            } else {

                User.findById(id, function(err, u) {
                    if(err)
                        return console.log(err);

                    u.username = username;
                    u.email = email;
                    u.slug = slug;
                    //u.password = password;
                    u.role = role;

                    u.save(function (err) {
                        if (err)
                            return console.log(err);
                        

                        req.flash('success', 'User edited!');
                        res.redirect('/admin/users/edit-user/' + id);
                    });
                });
            }
        });
    }
});


// Get Delete User

router.get('/delete-user/:id', function(req, res){
    User.findByIdAndRemove(req.params.id, function(err){
        if(err)
            return console.log(err);
        
        
        req.flash('success', 'User deleted!');
        res.redirect('/admin/users/');
    });
});





module.exports = router;

