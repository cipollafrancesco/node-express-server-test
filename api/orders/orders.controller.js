const mongoose = require('mongoose')
const {ORDER_ID_PV} = require('../api.constants')

// MONGO MODEL
const Order = require('./order.model')
const Product = require('../products/product.model')
const {createResponse} = require('../utils')

// GET ALL ORDERS
exports.orders_get_all = async (req, res) => {
    try {
        const orders = await Order
            .find()
            .select('product quantity _id')
            .populate('product', 'name price') // AUTO JOIN THE REF PROPERTY and RETURNS ONLY 'name price'
            .exec()

        orders ? res.status(200).json(createResponse({
                orders: orders.map(({_id, quantity, product}) => ({
                    _id,
                    quantity,
                    product,
                    request: {method: 'GET', url: `http://localhost:${process.env.PORT}/orders/${_id}`}
                })),
                count: orders.length
            },
            'Orders have been fetched'
        )) : res.status(500).json(createResponse(null, 'Ops! Something wrong happened'))

    } catch (e) {
        console.error('>>> ERROR IN ORDERS GET', e)
        res.status(500).json(createResponse(null, 'Ops! Something wrong happened'))
    }
}

// ADD ORDER
exports.orders_create_order = async (req, res) => {

    const {productId, quantity} = req.body || {}

    try {
        await Product.findById(productId).exec()
    } catch (e) {
        res.status(404).json(createResponse(null, `Could not find product with id: ${productId}`))
    }

    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity,
        product: productId,
    })

    try {
        const addedOrder = await order.save()
        // SAVING ORDER
        addedOrder ? res.status(201).json(createResponse(order, 'Order has been created')) :
            res.status(500).json(createResponse(null, 'Ops! Something wrong happened'))
    } catch (e) {
        console.error('>>> ERROR IN ORDER CREATION', e)
        res.status(500).json(createResponse(null, 'Ops! Something wrong happened'))
    }
}

// GET ORDER BY ID
exports.orders_get_order_by_id = async (req, res) => {
    const orderId = req.params[ORDER_ID_PV]
    try {
        const order = await Order.findById(orderId).exec()
        order ?
            res.status(200).json(createResponse(order, `GETTING order with id: ${orderId}`)) :
            res.status(404).json(createResponse(null, `Could not find order with id: ${orderId}`))
    } catch (e) {
        console.error('>>> ERROR IM GETTING order with id:' + orderId)
        res.status(500).json(createResponse(null, `Ops! An error occurred while getting order with id ${orderId}`))
    }
}

// DELETE ORDER BY ID
exports.orders_delete_order_by_id = async (req, res) => {
    const orderId = req.params[ORDER_ID_PV]
    try {
        const order = await Order.findByIdAndDelete(orderId).exec()
        order ?
            res.status(200).json(createResponse(null, `Order with id ${orderId} has been deleted`)) :
            res.status(400).json(createResponse(null, `Could not delete order with id: ${orderId}`))

    } catch (e) {
        console.error('>>> ERROR IM DELETING order with id:' + orderId)
        res.status(500).json(createResponse(null, `Ops! An error occurred while deleting order with id ${orderId}`))
    }
}