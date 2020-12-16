const express = require('express')
const mongoose = require('mongoose')

// CONTROLLER
const router = express.Router()

const Product = require('../../models/product')

// GET ALL PRODUCTS
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find()
        const responseBody = {
            count: Array.isArray(products) ? products.length : 0,
            products: products.map(({name, price, _id}) => ({
                name,
                price,
                _id,
                request: {method: 'GET', url: `http://localhost:${process.env.PORT}/products/${_id}`}
            }))
        }

        res.status(200).json({body: responseBody, message: 'Products retrieved successfully'})
    } catch (e) {
        console.error('>>> GET PRODUCTS', e)
        res.status(500).json({body: null, message: `Ops! An error occurred while getting products`})
    }
})

// ADD PRODUCT
router.post('/', async (req, res, next) => {
    const {name, price} = req.body || {}

    // CREATING PRODUCT
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name,
        price,
    })

    try {
        // SAVING ON MONGO
        const createdProduct = await product.save()
        console.log('>>> CREATED PRODUCT', createdProduct)
        const responseBody = {
            product,
            request: {method: 'GET', url: `http://localhost:${process.env.PORT}/products/${product._id}`}
        }
        res.status(201).json({body: responseBody, message: 'Product created successfully!'})
    } catch (e) {
        // IN CASE OF ERROR IN SAVE
        res.status(500).json({body: null, message: 'Ops! An Error occurred while creating product'})
    }

})

const PRODUCT_ID_PV = 'productId'

// GET SPECIFIC PRODUCT
router.get(`/:${PRODUCT_ID_PV}`, async (req, res, next) => {

    // GETTING ID PARAM FROM REQUEST
    const productId = req.params[PRODUCT_ID_PV]

    try {
        const product = await Product.findById(productId).exec()
        product ?
            res.status(200).json({body: product, message: 'Product retrieved successfully'}) :
            res.status(404).json({body: null, message: `Ops! Product with id ${productId} was not found`})

    } catch (e) {
        res.status(500).json({
            body: null,
            message: `Ops! An error occurred while getting product with id: ${productId}`
        })
    }
})

// EDIT SPECIFIC PRODUCT
router.patch(`/:${PRODUCT_ID_PV}`, async (req, res, next) => {
    const productId = req.params[PRODUCT_ID_PV]

    // PARAMS DATA
    const {name, price} = req.body

    try {
        const updatedProduct = await Product.update({_id: productId}, {$set: {name, price}})
        console.log('>>> UPDATED Product', updatedProduct)

        updatedProduct ?
            res.status(200).json({body: {id: updatedProduct}, message: 'Product update successfully'}) :
            res.status(404).json({body: null, message: `Ops! Product with id ${productId} was not found`})

    } catch (e) {
        res.status(500).json({
            body: null,
            message: `Ops! An error occurred while updating product with id: ${productId}`
        })
    }
})

// DELETE SPECIFIC PRODUCT
router.delete(`/:${PRODUCT_ID_PV}`, async (req, res, next) => {

    // GETTING ID PARAM FROM REQUEST
    const productId = req.params[PRODUCT_ID_PV]

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId)
        deletedProduct ?
            res.status(200).json({body: deletedProduct, message: 'Product deleted successfully'}) :
            res.status(404).json({body: null, message: `Ops! Product with id ${productId} was not found`})

    } catch (e) {
        res.status(500).json({
            body: null,
            message: `Ops! An error occurred while deleting product with id: ${productId}`
        })
    }
})

module.exports = router