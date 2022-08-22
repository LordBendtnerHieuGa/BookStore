const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');
const Category = require('../models/categoryModel')
const fs = require('fs-extra');
const auth = require('../config/auth');
let isUser = auth.isUser;

// Get all books

router.get('/', function (req, res) {
    
    Book.find( function (err, books) {
        if (err)
            console.log(err);

        res.render('allBooks', {
            title: 'All books',
            books: books
        });
    });
    
});

/*
 * GET books by category
 */
router.get('/:category', function (req, res) {

    let categorySlug = req.params.category;

    Category.findOne({slug: categorySlug}, function (err, b) {
        Book.find({category: categorySlug}, function (err, books) {
            if (err)
                console.log(err);

            res.render('cateBooks', {
                title: b.title,
                books: books
            });
        });
    });

});

/*
 * GET book details
 */
router.get('/:category/:book', function (req, res) {

    let galleryImages = null;
    // let loggedIn = (req.isAuthenticated()) ? true : false;

    Book.findOne({slug: req.params.book}, function (err, book) {
        if (err) {
            console.log(err);
        } else {
            let galleryDir = 'public/bookImages/' + book._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('book', {
                        title: book.title,
                        b: book,

                        galleryImages: galleryImages,
                        //loggedIn: loggedIn
                    });
                }
            });
        }
    });

});


// POST /:category/:slug/reviews

router.post( '/:category/:book/review', (req, res) => {
    // const rating = req.body.rating;
    // const comment = req.body.comment;

    // let book = Book.findOne({slug: req.params.book});
    // res.json();
    console.log(req.body);

});


module.exports = router;

