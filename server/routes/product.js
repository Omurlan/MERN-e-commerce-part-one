const express = require('express')
const {
    create,
    listAll,
    remove,
    update,
    read,
    list,
    productsCount,
    productStar,
    listRelated,
    searchFilters
} = require('../controllers/product')

const router = express.Router()

// middlewares 
const { authCheck, adminCheck } = require('../middlewares/auth')

//routes
router.post('/product', authCheck, adminCheck, create)
router.get('/products/total', productsCount)
router.post('/products', list)

router.get('/products/:count', listAll)
router.delete('/product/:slug', authCheck, adminCheck, remove)
router.get('/product/:slug', read)
router.put('/product/:slug', authCheck, adminCheck, update)

//rating system
router.post('/product/star/:productId', authCheck, productStar)

//related products
router.get('/products/related/:productId', listRelated)

//search
router.post('/search/filters', searchFilters)

module.exports = router