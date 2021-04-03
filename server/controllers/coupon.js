const Coupon = require('../models/coupon')
const slugify = require('slugify')

exports.create = async (req, res) => {
    try {
        const { name, expiry, discount } = req.body.coupon
        const coupon = await new Coupon({ name, expiry, discount }).save()
        res.json(coupon)
    } catch (err) {
        console.log(err)
    }
}

exports.list = async (req, res) => {
    try {
        const coupon = await Coupon.find({}).sort({ createdAt: -1 }).exec()
        res.json(coupon)
    } catch (err) {
        console.log(err)

    }
}

exports.remove = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndRemove(req.params.couponId).exec()
        res.json(coupon)
    } catch (err) {
        console.log(err)
    }
}

