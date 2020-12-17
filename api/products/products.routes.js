const express = require('express')
const {upload} = require('../middlewares/upload.configs')
const {PRODUCT_ID_PV} = require('../api.constants')

// AUTH CHECK HANDLER
const authCheck = require('../middlewares/check-auth')

// CONTROLLER
const router = express.Router()
const ProductController = require('./products.controller')

// GET ALL PRODUCTS
router.get('/', authCheck, ProductController.products_get_all)

// ADD PRODUCT with image UPLOAD
// RUNS AFTER UPLOAD THAT PARSES THE REQUEST BOD
router.post('/', upload.single('productImage'), authCheck, ProductController.products_add_product)

// GET SPECIFIC PRODUCT
router.get(`/:${PRODUCT_ID_PV}`, authCheck, ProductController.products_get_by_id)

// EDIT SPECIFIC PRODUCT
router.patch(`/:${PRODUCT_ID_PV}`, authCheck, ProductController.products_edit_by_id)

/**
 * @label DELETE SPECIFIC PRODUCT
 * @extra PROTECTED ROUTE, HANDLERS RUNS IN ORDER
 */
router.delete(`/:${PRODUCT_ID_PV}`, authCheck, ProductController.products_delete_by_id)

module.exports = router