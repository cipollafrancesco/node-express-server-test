const mongoose = require('mongoose')

/**
 * USER ENTITY
 */
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: mongoose.Schema.Types.String, required: true},
    password: {type: mongoose.Schema.Types.String, required: true},
})

// PascalCase convention for model name
module.exports = mongoose.model('User', userSchema)