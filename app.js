const express = require('express')

// APP INSTANCE WITH MIDDLEWARES
const app = express()

// PRODUCTS CONTROLLER
const productRoutes = require('./api/routes/products')

// ORDERS CONTROLLER
const orderRoutes = require('./api/routes/order')

// NOW A LOT OF EXTRA MIDDLEWARES COULD BE USED
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

module.exports = app