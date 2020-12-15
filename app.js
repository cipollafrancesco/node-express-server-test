const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

// APP INSTANCE WITH MIDDLEWARES
const app = express()

// PRODUCTS CONTROLLER
const productRoutes = require('./api/routes/products')
// ORDERS CONTROLLER
const orderRoutes = require('./api/routes/order')

/**
 * EXTRA MIDDLEWARES SET UP
 */

// REQUEST LOGGER
app.use(morgan('dev'))

// REQ BODY PARSER ENHANCER (extended is for complex body bjs )
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ALLOW CORS BY ADDING SPECIFIC HEADERS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // * = any or specific domain allowed to access

    // ALLOWED REQ HEADERS
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({}) // OPTIONS doesn't ask for data but for headers. So it can exit now
    }

    next()
})

// ROUTES CONFIGURATION
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

// REQUESTS THAT DON'T MATCH GO TO ERROR HANDLER
app.use(((req, res, next) => {
    const error = new Error('Endpoint not found')
    error.status = 404
    // FORWARD THE REQUEST WITH THIS ERROR
    next(error)
}))

// TRIGGERED BY 500 OR DB FAILURE OPERATIONS
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({error: {message: error.message}})
})

module.exports = app