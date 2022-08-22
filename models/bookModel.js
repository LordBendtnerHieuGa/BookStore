const mongoose = require('mongoose');
const OBJECT_ID = mongoose.Schema.Types.ObjectId;


const bookSchema = mongoose.Schema({

    title: { 
        type: String, 
        required: true
    },
    slug: {
        type: String

    },
    author: {
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    year: { 
        type: Number, 
        required: true 
    },
    desc: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    isbn: { 
        type: String, 
        required: true 
    },
    pagesCount: { 
        type: Number, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },

    reviews: [{ type: OBJECT_ID, ref: 'reviewModel' }],

    rating: {
        type: Number,
        required: true,
        default: 0,
    },

    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },

    },
    {
        timestamps: true,
    }
    // currentRating: { type: Number, default: 0 },
    // ratingPoints: { type: Number, default: 0 },
    // ratedCount: { type: Number, default: 0 },
    // ratedBy: [{ type: OBJECT_ID, ref: 'User' }],
    // purchasesCount: { type: Number, default: 0 },
    // comments: [{ type: OBJECT_ID, ref: 'Comment' }]
);

// BOOK_SCHEMA.index({
//     title: 'text',
//     author: 'text',
//     genre: 'text',
//     isbn: 'text'
// });

const  Book = module.exports = mongoose.model('Book', bookSchema);
