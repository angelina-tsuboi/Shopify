var mongoose = require('mongoose');

var CustomerInfo = mongoose.model('CustomerInfo', {
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    country: {
        type:String,
        required:true
    },
    countryCode: {
        type:String,
        required:true
    },
    zip: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },

    addressCity: {
        type:String,
        required:true
    },
    
    addressState: {
        type:String,
        required:true
    }
})

module.exports = {
    CustomerInfo:CustomerInfo
}