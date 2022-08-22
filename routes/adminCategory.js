const express = require('express');
const router = express.Router();
// const auth = require('../config/auth');
// let isAdmin = auth.isAdmin;

// Get Page model
const Category = require('../models/categoryModel');


/*
 * GET category index
 */
router.get('/',  function (req, res) {
    let countCategory;
    
    Category.count(function(err, c) {
        countCategory = c;
    });
    
    Category.find(function (err, categories) {
           if(err) return console.log(err);
        res.render('./admin/categories', {
            categories: categories,
            countCategory
        });
    });
});


// Get add category

router.get('/add-category',(req, res) => {
    const title = "";
    
    res.render('admin/addCategory', {
        title: title
    });
});

// POST add category

router.post('/add-category', (req, res) => {
    req.checkBody('title', 'Title must have a value!').notEmpty();

    let title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    
    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/addCategory', {
            errors: errors,
            title: title,
        });
    } else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                req.flash('danger', 'Category slug exists, choose another.');
                res.render('admin/addCategory', {
                    title: title,
    
                });
            } else {
                let category = new Category({
                    title: title,
                    slug: slug,
            
                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);

                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });

                        req.flash('success', 'Category added!');
                        res.redirect('/admin/categories');
                    });
                }
            });
        }

});

// Get edit category

// router.get('/edit-category/:id', (req, res) => {
    
//     Category.findById(req.params.id , (err, category) => {

//         if(err) { return console.log(err) };

//             res.render('admin/editCategory', {
//                 title: category.title,
//                 id: category._id
//             });
            
//     });
// });

// // Post edit category

// router.post('/edit-category/:id', function (req, res) {
//     req.checkBody('title', 'Title must have a value!').notEmpty();

//     let title = req.body.title;
//     let slug = title.replace(/\s+/g, '-').toLowerCase();
//     let id = req.params.id;
//     let errors = req.validationErrors();

//     if (errors) {
//         res.render('admin/editCategory', {
//             errors: errors,
//             title: title,
//             id: id
//         });
//     } else {
//         Category.findOne({slug: slug, _id: {'$ne':id}}, function (err, category) {
//             if (category) {
//                 req.flash('danger', 'Category slug exists, choose another.');
//                 res.render('admin/editCategory', {
//                     title: title,
//                     id: id
//                 });
//             } else {

//                 Category.findById(id, function(err, category) {
//                     if(err)
//                         return console.log(err);

//                     category.title = title;
//                     category.slug = slug;
                    
//                     category.save(function (err) {
//                         if (err)
//                             return console.log(err);
                            

//                         req.flash('success', 'Category edited!');
//                         res.redirect('/admin/categories/edit-category/' + id);
//                     });
//                 });
//             }
//         });
//     }
// });

// Get Delete Category

router.get('/delete-category/:id', function(req, res){
    Category.findByIdAndRemove(req.params.id, function(err){
        if(err)
            return console.log(err);
        
        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });
        
        req.flash('success', 'Category deleted!');
        res.redirect('/admin/categories/');
    });
});



module.exports = router;

