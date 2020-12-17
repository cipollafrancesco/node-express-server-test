const express = require('express')
const {ORDER_ID_PV} = require('../api.constants')

// AUTH CHECK HANDLER
const authCheck = require('../middlewares/check-auth')

// CONTROLLER ENHANCER
const router = express.Router()

const OrderController = require('./orders.controller')

// GET ORDERS
router.get('/', authCheck, OrderController.orders_get_all)

// ADD ORDER
router.post('/', authCheck, OrderController.orders_create_order)

// GET ORDER BY ID
router.get(`/:${ORDER_ID_PV}`, authCheck, OrderController.orders_get_order_by_id)

// DELETE ORDER BY ID
router.delete(`/:${ORDER_ID_PV}`, authCheck, OrderController.orders_delete_order_by_id)

module.exports = router