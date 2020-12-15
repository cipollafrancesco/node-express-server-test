const express = require('express')
const morgan = require('morgan')

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
    res.status(error.statusCode || 500)
    res.json({error: {message: error.message}})
})

module.exports = app