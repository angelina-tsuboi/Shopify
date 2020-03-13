var mongoose = require('mongoose');

var User = mongoose.model('User', {
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    ccNumber: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    cvcNumber: {
        type: Number,
        required: true
    }
})

module.exports = {
    User:User
}