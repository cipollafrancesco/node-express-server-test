const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// MONGO MODEL
const User = require('./user.model')
const {createResponse} = require('../utils')

// GET USERS LIST
exports.users_get_all = async (req, res, next) => {
    try {
        const users = await User.find().exec()
        users ?
            res.status(200).json(createResponse(users, 'Signed up users list')) :
            res.status(500).json(createResponse(null, 'Ops! Something went wrong'))
    } catch (e) {
        console.error('>>> ERROR IN USERS GET', e)
        res.status(500).json(createResponse(null, 'Ops! Something went wrong'))
    }
}

// USER SIGNUP
exports.users_signup = async (req, res, next) => {

    const {username, password} = req.body || {}

    try {

        const isUserAlreadyPresent = await User.findOne({username}).exec()

        if (isUserAlreadyPresent)
            return res.status(400).json(createResponse(null, 'Ops! The username you choose has been already taken, try another one'))

        bcrypt.hash(
            password,
            10,
            (err, encryptedPassword) => err ?
                res.status(500).json(createResponse(null, 'Ops! Could not use this password')) :
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
                    res.status(201).json(createResponse(createdUser, 'User has been created')) :
                    res.status(500).json(createResponse(null, 'Ops! Something went wrong'))

            } catch (e) {
                res.status(400).json(createResponse(null, e.message))
            }
        }

    } catch (e) {
        console.error('>>> ERROR IN USER CREATION', e)
        res.status(500).json(createResponse(null, 'Ops! Something wrong happened'))
    }
}

// USER LOGIN
exports.users_login = async (req, res, next) => {

    // USERNAME TO CHECK
    const {username, password} = req.body

    try {
        const targetUser = await User
            .findOne({username})
            .exec()
            .catch(error => res.status(500).json(createResponse(null, error.message)))

        if (!targetUser) {
            return res.status(401).json(createResponse(null, 'Ops! Auth failed'))
        }

        // COMPARING PASSWORDS
        bcrypt.compare(password, targetUser.password, (error, result) => {
            if (error || !result) {
                return res.status(401).json(createResponse(null, 'Ops! Auth failed'))
            }

            // ENCODED TOKEN (decode @ https://jwt.io/)
            const token = jwt.sign(
                // INfO TO INCLUDE IN THE TOKEN
                {username: targetUser.username, id: targetUser._id},
                process.env.JWT_KEY,
                {expiresIn: '1h'},
            )

            return res.status(200).json(createResponse(
                {username, _id: targetUser._id},
                'Successfully logged in!',
                {token}
                )
            )
        })

    } catch (error) {
        return res.status(500).json(createResponse(null, 'Ops! Something went wrong'))
    }
}