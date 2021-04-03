const Product = require('../models/product')
const slugify = require('slugify')
const User = require('../models/user')

exports.create = async (req, res) => {
    console.log(req.body)
    try {
        req.body.slug = slugify(req.body.title)
        const newProduct = await new Product(req.body).save()
        res.json(newProduct)

    } catch (err) {
        res.status(400).json({
            err: err.message
        })
    }
}

exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createdAt', 'desc']])
        .exec()
    res.json(products)
}

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({ slug: req.params.slug }).exec()
        res.json(deleted)
    } catch (err) {
        console.log(err)
        return res.status(400).send('Product delete failed')
    }
}

exports.read = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('category')
            .populate('subs')
            .exec()
        res.json(product)
    } catch (err) {
        console.log(err)
    }
}

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec()
        res.json(updated)

    } catch (err) {
        console.log('PRODUCT UPDATE EROR ======>', err)
        return res.status(400).json({
            err: err.message
        })
    }
}

// with PAGINATION
// exports.list = async (req, res) => {
//     try {
//         const { sort, page, order } = req.body
//         const currentPage = page || 1
//         const perPage = 1

//         // console.log(sort, order, limit)
//         const products = await Product.find({})
//             .skip((currentPage - 1) * perPage)
//             .populate('category')
//             .populate('subs')
//             .sort([[sort, order]])
//             .limit(perPage)
//             .exec()

//         res.json(products)
//     } catch (err) {
//         console.log(err)
//     }
// }

exports.list = async (req, res) => {
    const { sort, order } = req.body

    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await Product.find({}).estimatedDocumentCount().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0)
        results.previous = {
            page: page - 1,
            limit: limit
        }

    try {
        results.results = await Product.find({})
            .skip(startIndex)
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(limit)
            .exec()

        res.json(results)



    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// exports.paginatedResults = async (req, res, next) => {
//     const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const results = {}

//     if (endIndex < await Product.find({}).estimatedDocumentCount().exec()) {
//         results.next = {
//             page: page + 1,
//             limit: limit
//         }
//     }

//     if (startIndex > 0)
//         results.previous = {
//             page: page - 1,
//             limit: limit
//         }

//     // console.log(startIndex)

//     try {
//         results.results = await Product.find({})
//             .limit(limit)
//             .skip(startIndex)
//             .exec()
//         res.paginatedResults = results

//         next()
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// }

exports.productsCount = async (req, res) => {
    try {
        let total = await Product.find({}).estimatedDocumentCount().exec()
        res.json(total)
    } catch (err) {
        console.log(err)
    }
}

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()
    const user = await User.findOne({ email: req.user.email }).exec()
    const { star } = req.body

    // who is updating ?
    // check if currently logged in user have already added rating to this product ?
    let existingRatingObject = product.ratings.find(
        (elem) => elem.postedBy.toString() === user._id.toString()
    )

    // if user haven not left raing yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(product._id, {
            $push: { ratings: { star, postedBy: user._id } }
        }, { new: true }
        ).exec()
        // console.log('RatingAdded', ratingAdded)
        res.json(ratingAdded)
    } else {
        // if user have already left rating, update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject }
            },
            { $set: { "ratings.$.star": star } },
            { new: true }
        ).exec()
        console.log('RatingUpdated', ratingUpdated)
        res.json(ratingUpdated)
    }

}

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec()

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category
    })
        .limit(3)
        .populate('category')
        .populate('subs')
        .populate('postedBy')
        .exec()

    res.json(related)
}

// SEARCH /FILTER
const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query } })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy,', '_id name')
        .exec()

    res.json(products)
}

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1]
            }
        })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy,', '_id name')
            .exec()

        res.json(products)
    } catch (err) {
        console.log(err)
    }
}

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy,', '_id name')
            .exec()

        res.json(products)
    } catch (err) {
        console.log(err)
    }
}

const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: '$$ROOT',
                floorAverage: {
                    $floor: { $avg: '$ratings.star' }
                }
            }
        },
        { $match: { floorAverage: stars } }
    ])
        .limit(12)
        .exec((err, aggregates) => {
            if (err) console.log('Aggregates Error', err)
            Product.find({ _id: aggregates })
                .populate('category', '_id name')
                .populate('subs', '_id name')
                .populate('postedBy,', '_id name')
                .exec((err, products) => {
                    if (err) console.log('Product Aggregates Error', err)
                    res.json(products)
                })
        })
}

const handleSub = async (req, res, sub) => {
    const products = await Product.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy,', '_id name')
        .exec()
    res.json(products)
}

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy,', '_id name')
        .exec()
    res.json(products)
}

const handleColor = async (req, res, color) => {
    const products = await Product.find({ color })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy,', '_id name')
        .exec()
    res.json(products)
}

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy,', '_id name')
        .exec()
    res.json(products)
}

exports.searchFilters = async (req, res) => {
    const {
        query,
        price,
        category,
        stars,
        sub,
        shipping,
        color,
        brand
    } = req.body

    if (query) {
        console.log('query ------>', query)
        await handleQuery(req, res, query)
    }

    // price [20, 200]
    if (price !== undefined) {
        console.log('price ------>', price)
        await handlePrice(req, res, price)
    }

    if (category) {
        console.log('category ------>', category)
        await handleCategory(req, res, category)
    }

    if (stars) {
        console.log('stars ------>', stars)
        await handleStar(req, res, stars)
    }

    if (sub) {
        console.log('stars ------>', sub)
        await handleSub(req, res, sub)
    }

    if (shipping) {
        console.log('shipping ------>', shipping)
        await handleShipping(req, res, shipping)
    }

    if (color) {
        console.log('color ------>', color)
        await handleColor(req, res, color)
    }

    if (brand) {
        console.log('brand ------>', brand)
        await handleBrand(req, res, brand)
    }
}
