const mongoose = require('mongoose');

const pageSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number
    }
});
const  Page = module.exports = mongoose.model('Page', pageSchema);

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