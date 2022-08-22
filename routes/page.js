const express = require('express');
const router = express.Router();
const Page = require('../models/pageModel');

// Get /

router.get('/', function (req, res) {
    
    Page.findOne({slug: 'home'}, function (err, page) {
        if (err)
            console.log(err);

        res.render('index', {
            title: page.title,
            content: page.content
        });
    });
    
});

/*
 * GET a page
 */
router.get('/:slug', function (req, res) {

    let slug = req.params.slug;

    Page.findOne({slug: slug}, function (err, page) {
        if (err)
            console.log(err);
        
        if (!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });

    
});

module.exports = router;

