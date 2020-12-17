const express = require('express')
const router = express.Router()

// CONTROLLER
const UsersController = require('../controllers/users')

// GET USERS LIST
router.get('/', UsersController.users_get_all)

// USER SIGNUP
router.post('/signup', UsersController.users_signup)

// USER LOGIN
router.post('/login', UsersController.users_login)

module.exports = router