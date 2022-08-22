const mongoose = require('mongoose');

//const ENCRYPTION = require('../utilities/encryption');
// const String = MONGOOSE.Schema.Types.String;
// const NUMBER = MONGOOSE.Schema.Types.Number;
// const BOOLEAN = MONGOOSE.Schema.Types.Boolean;
let ObjectId = require('mongoose').ObjectId ;

const userSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        //unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        //unique: true 
    },
    address: { 
        type: String, 
        required: true, 
        //unique: true 
    },
    phonenumber: { 
        type: String, 
        required: true, 
        //unique: true 
    },
    avatar: { 
        type: String, 
        //default: 'https://i.imgur.com/4s5qLzU.png' 
    },
    password: { 
        type: String, 
        required: true 
    },
    
    role: { 
        type: Number,
    }
    // isCommentsBlocked: { type: BOOLEAN, default: false },
    // commentsCount: { type: NUMBER, default: 0 },
    // roles: [{ type: OBJECT_ID, ref: 'Role' }],
    // cart: { type: OBJECT_ID, ref: 'Cart' },
    // receipts: [{ type: OBJECT_ID, ref: 'Receipt' }],
    // favoriteBooks: [{ type: OBJECT_ID, ref: 'Book' }]
});


const User = mongoose.model('users', userSchema);

module.exports = User;