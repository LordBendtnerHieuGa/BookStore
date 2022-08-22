


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const passport = require('passport');

const connectDB = require('./config/connectBD');
const page = require('./routes/page');
const adminPage = require('./routes/adminPage');
const adminCategory = require('./routes/adminCategory');
const adminBook = require('./routes/adminBook');
const adminUser = require('./routes/adminUser');

const Page = require('./models/pageModel')
const Category = require('./models/categoryModel');
const User = require('./models/userModel');
const books = require('./routes/books');
const cart = require('./routes/cart')
const users = require('./routes/users');

// const route = require('./routes/allRoutes');
const expressMessages = require('express-messages');

// connect to DB
mongoose.connect(connectDB.database, {useMongoClient: true});
const db = mongoose.connection
// .openUri('mongodb://localhost/booklibs');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connect DB success!');
});

// init app
const app =  express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// set global errors variable
app.locals.errors = null;
// app.locals.users = users;


// Get all pages to pass to header.ejs
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});

// Get all categories to pass to header.ejs
User.find(function (err, users) {
    if (err) {
        console.log(err);
    } else {
        app.locals.users = users;
    }
});
// Express fileUpload middleware
app.use(fileUpload());

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        const namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
    
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value 
        };
    },

    customValidators: {
        isImage: function (value, filename) {
            let extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
}));

// Express Messages middleware
app.use(require('connect-flash') ());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages') (req, res);
    next();
});

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.cart = req.session.cart;
    res.locals.user = req.user || null;
    next();
});

// set routes


// route(app);

app.use('/admin/page', adminPage);
app.use('/admin/categories', adminCategory);
app.use('/admin/books', adminBook);
app.use('/admin/users', adminUser);
app.use('/books', books);
app.use('/cart', cart);
app.use('/users', users);
app.use('/', page);



// star servera
const port = 3030;

app.listen(port, () => {
    console.log('server started on port ' + port);
});