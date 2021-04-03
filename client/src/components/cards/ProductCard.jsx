import React, { useState } from 'react'
import { Card, Tooltip } from 'antd'
import laptop from '../../images/laptop.png'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import Meta from 'antd/lib/card/Meta'
import { Link } from 'react-router-dom'
import { showAverage } from '../../functions/rating'
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'


const ProductCard = ({ product }) => {
    // destructure
    const { images, title, description, slug, price } = product
    const [tooltip, setTooltip] = useState('Click to add')

    // redux
    const dispatch = useDispatch()
    const { user } = useSelector((state) => ({ ...state }))

    const handleAddToCard = () => {
        // create card array
        let cart = []
        if (typeof window !== 'undefined') {
            // if card is in localStorage GET it
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'))
            }
            // push new product to cart
            cart.push({
                ...product,
                count: 1
            })
            // remove duplicates
            let unique = _.uniqWith(cart, _.isEqual)
            // save to localStorage
            localStorage.setItem('cart', JSON.stringify(unique))
            // show tooltip
            setTooltip('Added')

            //add to Redux states
            dispatch({
                type: 'ADD_TO_CART',
                payload: unique
            })
            // show cat item in sdie drawer
            dispatch({
                type: 'SET_VISIBLE',
                payload: true
            })
        }
    }

    return (
        <>
            {product && product.ratings && product.ratings.length > 0
                ? showAverage(product)
                : (<div className="text-center pt-1 pb-3">No rating yet</div>)}
            <Card
                cover={
                    <img
                        src={images && images.length ? images[0].url : laptop}
                        style={{ width: '80%', objectFit: 'cover', margin: 'auto' }}
                        className="p-1"
                    />
                }
                actions={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className="text-warning" />
                        <br /> View Product
                    </Link>,
                    <Tooltip title={tooltip}>
                        <a onClick={handleAddToCard} disabled={product.quantity < 1}>
                            <ShoppingCartOutlined className="text-danger" />
                            <br /> 
                            {product.quantity < 1 ? 'Out of stock' : 'Add to cart'}
                        </a>
                    </Tooltip>
                ]}
            >
                <Meta
                    title={`${title} - $${price}`}
                    description={`${description && description.substring(0, 150)}...`}
                />
            </Card>
        </>
    )
}

export default ProductCard