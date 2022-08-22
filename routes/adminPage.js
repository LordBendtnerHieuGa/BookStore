const express = require('express');
const router = express.Router();
// const auth = require('../config/auth');
// let isAdmin = auth.isAdmin;

// Get Page model
const Page = require('../models/pageModel');

// Get pages index

/*
 * GET pages index
 */
router.get('/', function (req, res) {
    let countPage;
    
    Page.count(function(err, p) {
        countPage = p;
    });

    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
        res.render('admin/pages', {
            pages: pages,
            countPage
        });
    });
});


// Get add pages

router.get('/add-page', (req, res) => {
    const title = "";
    const slug = "";
    const content = "";
    
    res.render('admin/addPage', {
        title: title,
        slug: slug,
        content: content
    });
});

// POST add pages

router.post('/add-page', (req, res) => {
    req.checkBody('title', 'Title must have a value!').notEmpty();
    req.checkBody('content', 'Content must have a value!').notEmpty();

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    
    let content = req.body.content;
    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/addPage', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({slug: slug}, function (err, page) {
            if (page) {
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/addPage', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                let page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });

                page.save(function (err) {
                    if (err)
                        return console.log(err);

                    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.pages = pages;
                        }
                    });

                    req.flash('success', 'Page added!');
                    res.redirect('/admin/page');
                });
            }
        });
    }

});


// Sort pages function
function sortPages(ids, callback) {
    let count = 0;

    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;

        (function (count) {
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                    ++count;
                    if (count >= ids.length) {
                        callback();
                    }
                });
            });
        })(count);

    }
}

/*
 * POST reorder pages
 */
router.post('/reorder-pages', function (req, res) {
    let ids = req.body['id[]'];

    sortPages(ids, function () {
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
    });

});

// router.post('/reorder-pages', function (req, res) {
   
//     let ids = req.body['id[]'];

//     let count = 0;
//     for( let i = 0; i < ids.length; i++){
//         let id = ids[i];
//         count++;

//         (function(count){
//             Page.findById(id, function(err, page){
//                 page.sorting = count;
//                 page.save(function(err){
//                     if(err)
//                     return console.log(err);
//                 });
//             });
//         }) (count);
//     }

//});

// Get edit page

router.get('/edit-page/:id', (req, res) => {
    
    Page.findById( req.params.id, (err, page) => {

            res.render('./admin/editPage', {
                title: page.title,
                slug: page.slug,
                content: page.content,
                id: page._id
            });
            
            if(err) { return console.log(err) };
    });
});

// Post edit Page

router.post('/edit-page/:id', (req, res) => {
    req.checkBody('title', 'Title must have a value!').notEmpty();
    req.checkBody('content', 'Content must have a value!').notEmpty();

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    
    let content = req.body.content;
    let id = req.params.id;
    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/editPage', {
            errors: errors,
            title: title,
            slug: slug,
            content: content,
            id: id
        });
    } else {
        Page.findOne({slug: slug, _id: {'$ne':id}}, function (err, page) {
            if (page) {
                req.flash('danger', 'Page slug exists, choose another.');
                res.render('admin/editPage', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {

                Page.findById(id, function(err, page) {
                    if(err)
                        return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    
                    page.save(function (err) {
                        if (err)
                            return console.log(err);

                        req.flash('success', 'Page edited!');
                        res.redirect('/admin/page/edit-page/' + id);
                    });
                });
            }
        });
    }
});

// Get Delete Page

router.get('/delete-page/:id', function(req, res){
    Page.findByIdAndRemove(req.params.id, function(err){
        if(err)
            return console.log(err);
        
        Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.pages = pages;
            }
        });
        
        req.flash('success', 'Page deleted!');
        res.redirect('/admin/page/');
    });
});



module.exports = router;

