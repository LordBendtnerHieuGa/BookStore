const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');

/*
 * GET add book to cart
 */
router.get('/add/:book', function (req, res) {

    let slug = req.params.book;

    Book.findOne({slug: slug}, function (err, b) {
        if (err)
            console.log(err);

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(b.price).toFixed(2),
                image: '/bookImages/' + b._id + '/' + b.image
            });
        } else {
            let cart = req.session.cart;
            let newItem = true;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(b.price).toFixed(2),
                    image: '/bookImages/' + b._id + '/' + b.image
                });
            }
        }

//        console.log(req.session.cart);
        req.flash('success', 'Product added!');
        res.redirect('back');
    });

});

/*
 * GET checkout page
 */
router.get('/checkout', function (req, res) {

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkOut', {
            title: 'Checkout',
            cart: req.session.cart
        });
    }

});

/*
 * GET update cart
 */
router.get('/update/:book', function (req, res) {

    let slug = req.params.book;
    let cart = req.session.cart;
    let action = req.query.action;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');

});

/*
 * GET clear cart
 */
router.get('/clear', function (req, res) {

    delete req.session.cart;
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});

/*
 * GET cod
 */
// router.get('/cod', function (req, res) {
//     if (req.session.cart && req.session.cart.length == 0) {
//         delete req.session.cart;
//         res.redirect('/cart/checkout');
//     } else {
//         res.render('codBuyNow', {
//             title: 'Buy Now'
//             
//         });
//     }
    
// });


 

module.exports = router;