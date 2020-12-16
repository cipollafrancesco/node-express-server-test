const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// CONTROLLER
const router = express.Router()

// MONGO MODEL
const User = require('../../models/user')

// GET USERS LIST
router.get('/', (async (req, res, next) => {
    try {
        const users = await User.find().exec()
        users ?
            res.status(200).json({body: users, message: 'Signed up users list'}) :
            res.status(500).json({body: null, message: 'Ops! Something went wrong'})
    } catch (e) {
        console.error('>>> ERROR IN USERS GET', e)
        res.status(500).json({body: null, message: 'Ops! Something went wrong'})
    }
}))

// USER SIGNUP
router.post('/signup', (async (req, res, next) => {

    const {username, password} = req.body || {}

    try {

        const isUserAlreadyPresent = await User.findOne({username}).exec()

        if (isUserAlreadyPresent)
            return res.status(400).json({message: 'Ops! The username you choose has been already taken, try another one'})

        bcrypt.hash(
            password,
            10,
            (err, encryptedPassword) => err ?
                res.status(500).json({body: null, message: 'Ops! Could not use this password'}) :
                handleEncryptSuccess(encryptedPassword)
        )

        const handleEncryptSuccess = async encryptedPassword => {

            // CREATE USER WITH ENCYPTED PASSWORD
            const user = new User({
                _id: mongoose.Types.ObjectId(),
                username,
                // SALT ENCRYPT AND ADD RANDOM WORDS TO CONFUSE HASH
                password: encryptedPassword,
            })

            // SAVING USER ON MONGO
            const createdUser = await user.save()

            createdUser ?
                res.status(201).json({body: createdUser, message: 'User has been created'}) :
                res.status(500).json({body: null, message: 'Ops! Something went wrong'})
        }

    } catch (e) {
        console.error('>>> ERROR IN USER CREATION', e)
        res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    }
}))

// USER LOGIN
router.get('/login', (async (req, res, next) => {
    try {
        const orders = await User
            .find()
            .select('product quantity _id')
            .populate('product', 'name price') // AUTO JOIN THE REF PROPERTY and RETURNS ONLY 'name price'
            .exec()
        orders ? res.status(200).json({
                body: {
                    orders: orders.map(({_id, quantity, product}) => ({
                        _id, quantity, product,
                        request: {method: 'GET', url: `http://localhost:${process.env.PORT}/orders/${_id}`}
                    })), count: orders.length
                }, message: 'Users have been fetched'
            }) :
            res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    } catch (e) {
        console.error('>>> ERROR IN ORDERS GET', e)
        res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    }
}))

module.exports = router