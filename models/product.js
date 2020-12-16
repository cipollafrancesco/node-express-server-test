const mongoose = require('mongoose')

/**
 * PRODUCT ENTITY
 */
const productsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: mongoose.Schema.Types.String, required: true},
    price: {type: mongoose.Schema.Types.Number, required: true},
})

// PascalCase convention for model name
module.exports = mongoose.model('Product', productsSchema)