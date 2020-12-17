const express = require('express')
const {ORDER_ID_PV} = require('./routes.constants')

// AUTH CHECK HANDLER
const authCheck = require('../middleware/check-auth')

// CONTROLLER ENHANCER
const router = express.Router()

const OrderController = require('../controllers/orders')

// GET ORDERS
router.get('/', authCheck, OrderController.orders_get_all)

// ADD ORDER
router.post('/', authCheck, OrderController.orders_create_order)

// GET ORDER BY ID
router.get(`/:${ORDER_ID_PV}`, authCheck, OrderController.orders_get_order_by_id)

// DELETE ORDER BY ID
router.delete(`/:${ORDER_ID_PV}`, authCheck, OrderController.orders_delete_order_by_id)

module.exports = router