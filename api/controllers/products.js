const mongoose = require('mongoose')
const {PRODUCT_ID_PV} = require('../routes/routes.constants')

// MONGO DB MODEL
const Product = require('../../models/product')
const {createResponse} = require('../utils')

exports.products_get_all = async (req, res, next) => {
    try {
        const products = await Product.find()
        const responseBody = {
            count: Array.isArray(products) ? products.length : 0,
            products: products.map(({name, price, productImage, _id}) => ({
                name, price, _id, productImage,
                request: {method: 'GET', url: `http://localhost:${process.env.PORT}/products/${_id}`}
            }))
        }

        res.status(200).json(createResponse(responseBody, 'Products retrieved successfully'))

    } catch (e) {
        console.error('>>> GET PRODUCTS', e)
        res.status(500).json(createResponse(null, `Ops! An error occurred while getting products`))
    }
}

exports.products_add_product = async (req, res, next) => {
    const {name, price} = req.body || {}

    console.log('>>> FILE', req.file)

    // CREATING PRODUCT
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name,
        price,
        productImage: req.file.path, // UPLOADED IMG
    })

    try {
        // SAVING ON MONGO
        const createdProduct = await product.save()
        console.log('>>> CREATED PRODUCT', createdProduct)
        const responseBody = {
            product,
            request: {method: 'GET', url: `http://localhost:${process.env.PORT}/products/${product._id}`}
        }
        res.status(200).json(createResponse(responseBody, 'Product created successfully!'))
    } catch (e) {
        // IN CASE OF ERROR IN SAVE
        res.status(500).json(createResponse(null, 'Ops! An Error occurred while creating product'))
    }

}

exports.products_get_by_id = async (req, res, next) => {

    // GETTING ID PARAM FROM REQUEST
    const productId = req.params[PRODUCT_ID_PV]

    try {
        const product = await Product.findById(productId).exec()
        product ?
            res.status(200).json(createResponse(product, 'Product retrieved successfully')) :
            res.status(404).json(createResponse(null, `Ops! Product with id ${productId} was not found`))

    } catch (e) {
        res.status(500).json(createResponse(null, `Ops! An error occurred while getting product with id: ${productId}`))
    }
}

exports.products_edit_by_id = async (req, res, next) => {
    const productId = req.params[PRODUCT_ID_PV]

    // PARAMS DATA
    const {name, price} = req.body

    try {
        const updatedProduct = await Product.update({_id: productId}, {$set: {name, price}})
        console.log('>>> UPDATED Product', updatedProduct)

        updatedProduct ?
            res.status(200).json(createResponse(updatedProduct, 'Product update successfully')) :
            res.status(404).json(createResponse(null, `Ops! Product with id ${productId} was not found`))

    } catch (e) {
        res.status(500).json(createResponse(null, `Ops! An error occurred while updating product with id: ${productId}`))
    }
}

exports.products_delete_by_id = async (req, res, next) => {

    // GETTING ID PARAM FROM REQUEST
    const productId = req.params[PRODUCT_ID_PV]

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId)
        deletedProduct ?
            res.status(200).json(createResponse(deletedProduct, 'Product deleted successfully')) :
            res.status(404).json(createResponse(null, `Ops! Product with id ${productId} was not found`))

    } catch (e) {
        res.status(500).json(createResponse(null, `Ops! An error occurred while deleting product with id: ${productId}`))
    }
}