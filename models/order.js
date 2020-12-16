const mongoose = require('mongoose')

/**
 * ORDER ENTITY
 */
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // I'LL SAVE THE PRODUCT ID (It's LIKE A RELATION)
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    // DEFAULT VALUE
    quantity: {type: mongoose.Schema.Types.Number, default: 1},
})

// PascalCase convention for model name
module.exports = mongoose.model('Order', orderSchema)