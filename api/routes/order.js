const express = require('express')

// CONTROLLER
const router = express.Router()

// GET ORDERS
router.get('/', ((req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    })
}))

// ADD ORDER
router.post('/', ((req, res, next) => {
    res.status(201).json({
        message: 'Order was created'
    })
}))

const ORDER_ID_PV = 'orderId'

// GET ORDER BY ID
router.get(`/:${ORDER_ID_PV}`, (req, res, next) => {
    const orderId = req.params[ORDER_ID_PV]
    res.status(200).json({
        message: `GETTING order with id: ${orderId}`
    })
})

// DELETE ORDER BY ID
router.delete(`/:${ORDER_ID_PV}`, (req, res, next) => {
    const orderId = req.params[ORDER_ID_PV]
    res.status(200).json({
        message: `DELETING order with id: ${orderId}`
    })
})

module.exports = router