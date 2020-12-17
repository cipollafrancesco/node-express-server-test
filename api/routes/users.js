const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
            try {
                const createdUser = await user.save()
                return createdUser ?
                    res.status(201).json({body: createdUser, message: 'User has been created'}) :
                    res.status(500).json({body: null, message: 'Ops! Something went wrong'})

            } catch (e) {
                res.status(400).json({body: null, message: e.message})
            }
        }

    } catch (e) {
        console.error('>>> ERROR IN USER CREATION', e)
        res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    }
}))

// USER LOGIN
router.post('/login', (async (req, res, next) => {

    // USERNAME TO CHECK
    const {username, password} = req.body

    try {
        const targetUser = await User
            .findOne({username})
            .exec()
            .catch(error => res.status(500).json({body: null, message: error.message}))

        if (!targetUser) {
            return res.status(401).json({body: null, message: 'Ops! Auth failed'})
        }

        // COMPARING PASSWORDS
        bcrypt.compare(password, targetUser.password, (error, result) => {
                if (error || !result) {
                    return res.status(401).json({body: null, message: 'Ops! Auth failed'})
                }

                // ENCODED TOKEN (decode @ https://jwt.io/)
                const token = jwt.sign(
                    // INfO TO INCLUDE IN THE TOKEN
                    {username: targetUser.username, id: targetUser._id},
                    process.env.JWT_KEY,
                    {expiresIn: '1h'},
                )

                return res.status(200).json({
                    body: {username, _id: targetUser._id},
                    token,
                    message: 'Successfully logged in!'
                })
            }
        )

    } catch (error) {
        return res.status(500).json({body: null, message: 'Ops! Something went wrong'})
    }
}))

module.exports = router