const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});
const Category = module.exports = mongoose.model('Category', categorySchema);

// const mongoose = require('mongoose')
// mongoose.Promise = require('bluebird')  
// const conn = mongoose.createConnection('mongodb://localhost/booklibs')
// const Schema = mongoose.Schema

// const PageSchema = new Schema({
// 	title: {
//         type: String,
//         required: true
//     },
//     slug: {
//         type: String
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     sorting: {
//         type: Number
//     }
// })

// const Page = conn.model('Page', PageSchema)
// module.exports = Page;