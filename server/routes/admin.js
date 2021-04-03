const express = require('express')

// middlewares
const { authCheck, adminCheck } = require('../middlewares/auth')

const router = express.Router()

const { orders, orderStatus } = require('../controllers/admin.js')

// routes
router.get('/admin/orders', authCheck, adminCheck, orders)
router.put('/admin/order-status', authCheck, adminCheck, orderStatus)

module.exports = router