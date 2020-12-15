const mongoose = require('mongoose')

/**
 * PRODUCT ENTITY
 */
const productsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: mongoose.Schema.Types.String,
    price: mongoose.Schema.Types.Number,
})

// PascalCase convention for model name
module.exports = mongoose.model('Product', productsSchema)