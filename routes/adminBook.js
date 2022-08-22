const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
// const auth = require('../config/auth');
// let isAdmin = auth.isAdmin;

// Get Book model
const Book = require('../models/bookModel');
const Category = require('../models/categoryModel');

// Get books index

router.get('/',  function (req, res) {
    let countBook;
    
    Book.count(function(err, c) {
        countBook = c;
    });

    Book.find(function(err, books){
        res.render('admin/books', {
            books: books,
            countBook: countBook
        });
    });
    
});


// Get add books

router.get('/add-book',  (req, res) => {
    let  title = "";
    let  author = "";
    let  year = "";
    let  desc = "";
    let  isbn = "";
    let  pagesCount = "";
    let  price = "";
    
    Category.find(function (err, categories){

        res.render('admin/addBook', {
            title: title,
            author: author,
            year: year,
            desc: desc,
            isbn: isbn,
            pagesCount: pagesCount,
            categories: categories,
            price: price
        });

    });
});

// POST add books

router.post('/add-book', (req, res) => {

    let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    req.checkBody('title', 'Title must have a value!').notEmpty();
    req.checkBody('author', 'Author must have a value!').notEmpty();
    req.checkBody('year', 'Relase year must have a value!').notEmpty();
    req.checkBody('desc', 'Description must have a value!').notEmpty();
    req.checkBody('pagesCount', 'Pages Count must have a value!').notEmpty();
    req.checkBody('isbn', 'ISBN must have a value!').notEmpty();
    req.checkBody('price', 'Price must have a value!').isDecimal();
    req.checkBody('image', 'Image must have a value!').isImage(imageFile);

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase(); 
    let author = req.body.author;
    let year = req.body.year;
    let desc = req.body.desc;
    let pagesCount = req.body.pagesCount;
    let isbn = req.body.isbn;
    let price = req.body.price;
    let category = req.body.category;

    let errors = req.validationErrors();
    

    if (errors) {
        Category.find(function (err, categories) {
            res.render('admin/addBook', {
                errors: errors,
                title: title,
                author: author,
                year: year,
                desc: desc,
                isbn: isbn,
                pagesCount: pagesCount,
                categories: categories,
                price: price
            });
        });
    } else {
        Book.findOne({slug: slug}, function (err, book) {
            if (book) {
                req.flash('danger', 'Book title exists, choose another.');
                Category.find(function (err, categories) {
                    res.render('admin/addBook', {
                        title: title,
                        author: author,
                        year: year,
                        desc: desc,
                        isbn: isbn,
                        pagesCount: pagesCount,
                        categories: categories,
                        price: price
                    });
                });
            } else {
                let price2 = parseFloat(price).toFixed(2);
                let book = new Book({
                    title: title,
                    slug: slug,
                    author: author,
                    year: year,
                    desc: desc,
                    isbn: isbn,
                    pagesCount: pagesCount,
                    category: category,
                    price: price2,
                    image: imageFile
                });

                book.save(function (err) {
                    if (err)
                        return console.log(err);

                    // Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                    //     if (err) {
                    //         console.log(err);
                    //     } else {
                    //         req.app.locals.pages = pages;
                    //     }
                    // });
                    mkdirp('public/bookImages/' + book._id, function(err){
                        return console.log(err);
                    });

                    mkdirp('public/bookImages/' + book._id + '/gallery', function (err) {
                        return console.log(err);
                    });

                    mkdirp('public/bookImages/' + book._id + '/gallery/thumbs', function (err) {
                        return console.log(err);
                    });

                    if (imageFile != "") {
                        let bookImage = req.files.image;
                        let path = 'public/bookImages/' + book._id + '/' + imageFile;

                        bookImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Book added!');
                    res.redirect('/admin/books');
                });
            }
        });
    }

});

  
// Get edit book

router.get('/edit-book/:id', function (req, res) {

    let errors;

    if (req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;

    Category.find(function (err, categories) {

        Book.findById(req.params.id, function (err, b) {
            if (err) {
                console.log(err);
                res.redirect('/admin/books');
            } else {
                let galleryDir = 'public/bookImages/' + b._id + '/gallery';
                let galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/editBook', {
                            errors: errors,
                            title: b.title,
                            author: b.author,
                            year: b.year,
                            desc: b.desc,
                            isbn: b.isbn,
                            pagesCount: b.pagesCount,
                            categories: categories,
                            category: b.category.replace(/\s+/g, '-').toLowerCase(),
                            price: parseFloat(b.price).toFixed(2),
                            image: b.image,
                            galleryImages: galleryImages,
                            id: b._id
                        });
                    }
                });
            }
        });

    });

});

// Post edit Book

router.post('/edit-book/:id', (req, res) => {
    let imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    req.checkBody('title', 'Title must have a value!').notEmpty();
    req.checkBody('author', 'Author must have a value!').notEmpty();
    req.checkBody('year', 'Relase year must have a value!').notEmpty();
    req.checkBody('desc', 'Description must have a value!').notEmpty();
    req.checkBody('pagesCount', 'Pages Count must have a value!').notEmpty();
    req.checkBody('isbn', 'ISBN must have a value!').notEmpty();
    req.checkBody('price', 'Price must have a value!').isDecimal();
    req.checkBody('image', 'Image must have a value!').isImage(imageFile);

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase(); 
    let author = req.body.author;
    let year = req.body.year;
    let desc = req.body.desc;
    let pagesCount = req.body.pagesCount;
    let isbn = req.body.isbn;
    let price = req.body.price;
    let category = req.body.category;
    let bimage = req.body.bimage;
    let id = req.params.id;

    let errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/books/edit-book/' + id);
        
    } else {
        Book.findOne({slug: slug, _id: {'$ne':id}}, function (err, b) {
            if (err) {
                console.log(err);
            }
                
            if (b) {
                req.flash('danger', 'Book title exsits, choose another.');
                res.redirect('/admin/books/edit-book/' + id);
            } else {

                Book.findById(id, function(err, b) {
                    if(err)
                        console.log(err);

                    b.title = title;
                    b.slug = slug;
                    b.author = author;
                    b.year = year;
                    b.desc = desc;
                    b.pagesCount = pagesCount;
                    b.isbn = isbn;
                    b.price = parseFloat(price).toFixed(2);
                    b.category = category;

                    if(imageFile != "") {
                        b.image = imageFile;
                    }
                    
                    b.save(function (err) {
                        if (err)
                            console.log(err);
                        
                        if(imageFile != "") {
                            if(bimage != "") {
                                fs.remove('public/bookImages/' + id + '/' + bimage, function(err){
                                    if(err)
                                        console.log(err);
                                });
                            }

                            let bookImage = req.files.image;
                            let path = 'public/bookImages/' + id + '/' + imageFile;

                            bookImage.mv(path, function (err) {
                                return console.log(err);
                            });
                        }

                        req.flash('success', 'Book edited!');
                        res.redirect('/admin/books/edit-book/' + id);
                    });
                });
            }
        });
    }
});

/*
 * POST book gallery
 */
router.post('/book-gallery/:id', function (req, res) {

    let bookImage = req.files.file;
    let id = req.params.id;
    let path = 'public/bookImages/' + id + '/gallery/' + req.files.file.name;
    let thumbsPath = 'public/bookImages/' + id + '/gallery/thumbs/' + req.files.file.name;

    bookImage.mv(path, function (err) {
        if (err)
            console.log(err);

        resizeImg(fs.readFileSync(path), {width: 100, height: 100}).then(function (buf) {
            fs.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);

});

// Get delete image
router.get('/delete-image/:image', function (req, res) {

    var originalImage = 'public/bookImages/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/bookImages/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbImage, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    req.flash('success', 'Image deleted!');
                    res.redirect('/admin/books/edit-book/' + req.query.id);
                }
            });
        }
    });
});

// Get Delete Book

router.get('/delete-book/:id',  function (req, res) {

    let id = req.params.id;
    let path = 'public/bookImages/' + id;

    fs.remove(path, function (err) {
        if (err) {
            console.log(err);
        } else {
            Book.findByIdAndRemove(id, function (err) {
                console.log(err);
            });
            
            req.flash('success', 'Book deleted!');
            res.redirect('/admin/books');
        }
    });

});



module.exports = router;

