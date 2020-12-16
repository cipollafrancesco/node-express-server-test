const express = require('express')
const mongoose = require('mongoose')

// CONTROLLER
const router = express.Router()

// MONGO MODEL
const Order = require('../../models/order')
const Product = require('../../models/product')

// GET ORDERS
router.get('/', (async (req, res, next) => {
    try {
        const orders = await Order
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
                }, message: 'Orders have been fetched'
            }) :
            res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    } catch (e) {
        console.error('>>> ERROR IN ORDERS GET', e)
        res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    }
}))

// ADD ORDER
router.post('/', (async (req, res, next) => {

    const {productId, quantity} = req.body || {}

    try {
        await Product.findById(productId).exec()
    } catch (e) {
        res.status(404).json({
            body: null,
            message: `Could not find product with id: ${productId}`
        })
    }

    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity,
        product: productId,
    })

    try {
        const addedOrder = await order.save()
        // SAVING ORDER
        addedOrder ? res.status(201).json({body: order, message: 'Order has been created'}) :
            res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    } catch (e) {
        console.error('>>> ERROR IN ORDER CREATION', e)
        res.status(500).json({body: null, message: 'Ops! Something wrong happened'})
    }
}))

const ORDER_ID_PV = 'orderId'

// GET ORDER BY ID
router.get(`/:${ORDER_ID_PV}`, async (req, res, next) => {
    const orderId = req.params[ORDER_ID_PV]
    try {
        const order = await Order.findById(orderId).exec()
        order ?
            res.status(200).json({body: order, message: `GETTING order with id: ${orderId}`}) :
            res.status(404).json({body: null, message: `Could not find order with id: ${orderId}`})

    } catch (e) {
        console.error('>>> ERROR IM GETTING order with id:' + orderId)
        res.status(500).json({body: null, message: `Ops! An error occurred while getting order with id ${orderId}`})
    }
})

// DELETE ORDER BY ID
router.delete(`/:${ORDER_ID_PV}`, async (req, res, next) => {
    const orderId = req.params[ORDER_ID_PV]
    try {
        const order = await Order.findByIdAndDelete(orderId).exec()
        order ?
            res.status(200).json({body: null, message: `Order with id ${orderId} has been deleted`}) :
            res.status(400).json({body: null, message: `Could not delete order with id: ${orderId}`})

    } catch (e) {
        console.error('>>> ERROR IM DELETING order with id:' + orderId)
        res.status(500).json({body: null, message: `Ops! An error occurred while deleting order with id ${orderId}`})
    }
})

module.exports = router