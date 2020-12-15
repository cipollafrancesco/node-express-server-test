const express = require('express')

// CONTROLLER
const router = express.Router()

// GET ALL PRODUCTS
router.get('/', (req, res, next)=> {
    res.status(200).json({
        message: 'Handling GET requests to /products'
    })
})

// ADD PRODUCT
router.post('/', (req, res, next)=> {
    const {name, price} = req.body || {}
    // CREATED PRODUCT
    const product = {name, price}
    res.status(201).json({
        body: product,
        message: 'Product CREATED!',
    })
})

const PRODUCT_ID_PV = 'productId'

// GET SPECIFIC PRODUCT
router.get(`/:${PRODUCT_ID_PV}`, (req, res, next)=> {

    // GETTING ID PARAM FROM REQUEST
    const productId = req.params[PRODUCT_ID_PV]

    res.status(200).json({
        message: 'GETTING product with id: '+ productId
    })
})

// EDIT SPECIFIC PRODUCT
router.patch(`/:${PRODUCT_ID_PV}`, (req, res, next)=> {
    const productId = req.params[PRODUCT_ID_PV]
    res.status(200).json({
        message: 'UPDATED product with id: '+ productId
    })
})

// DELETE SPECIFIC PRODUCT
router.delete(`/:${PRODUCT_ID_PV}`, (req, res, next)=> {
    const productId = req.params[PRODUCT_ID_PV]
    res.status(200).json({
        message: 'DELETED product with id: '+ productId
    })
})

module.exports = router