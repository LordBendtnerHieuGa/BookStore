const mongoose = require('mongoose');
const OBJECT_ID = mongoose.Schema.Types.ObjectId;

const reviewSchema = mongoose.Schema({

    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: OBJECT_ID,
        required: true,
        ref: 'User',
    },
    },
    {
        timestamps: true,
    }
);

const  Review = module.exports = mongoose.model('Review', reviewSchema);