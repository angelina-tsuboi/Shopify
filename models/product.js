var mongoose = require('mongoose');

let Product = mongoose.model("Product", {
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    pickUpName: {
        type: String,
        required: true
    }
})

module.exports = {
    Product: Product
}