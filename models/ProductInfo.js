var mongoose = require('mongoose');

var ProductInfo = mongoose.model('ProductInfo', {
    productId: {
        type:String,
        required:true
    },
    token: {
        type:String,
        required:true
    },
    tokenType: {
        type:String,
        required:true
    },
})

module.exports = {
    ProductInfo: ProductInfo
}