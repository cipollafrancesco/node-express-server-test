const mongoose = require('mongoose')

/**
 * USER ENTITY
 */
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // unique makes possible some performances optimizations due to uniqueness
    username: {type: mongoose.Schema.Types.String, required: true, unique: true, match: /^[a-zA-Z0-9]+$/},
    password: {type: mongoose.Schema.Types.String, required: true},
})

// PascalCase convention for model name
module.exports = mongoose.model('User', userSchema)