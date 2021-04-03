const express = require('express')
const { createOrUpdateUser, currentUser } = require('../controllers/auth.js')

const router = express.Router()

// middlewares 
const { authCheck, adminCheck } = require('../middlewares/auth')

router.post('/auth', authCheck, createOrUpdateUser)
router.post('/current-user', authCheck, currentUser)
router.post('/current-admin', authCheck, adminCheck, currentUser)
  
module.exports = router