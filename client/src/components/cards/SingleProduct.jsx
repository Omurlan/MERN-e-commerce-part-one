import React, { useState } from 'react'
import { Card, Tabs, Tooltip } from 'antd'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import laptop from '../../images/laptop.png'
import ProductListItems from './ProductListItems';
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import { addToWishList } from '../../functions/user';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom'

const { TabPane } = Tabs

//this is children component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
    const { title, images, description, _id } = product
    const [tooltip, setTooltip] = useState('Click to add')

    const dispatch = useDispatch()
    const { user } = useSelector((state) => ({ ...state }))
    const history = useHistory()

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

    const handleAddToWishList = (e) => {
        e.preventDefault()
        addToWishList(product._id, user.token)
            .then((res) => {
                console.log('added to wishlist', res.data)
            })
        toast.success('Added to wishlist')
        history.push('/user/wishlist')
    }

    return (
        <>
            <div className="d-flex justify-content-between">

                <div className="col-md-4">
                    {images && images.length ? (
                        <Carousel showArrows={true} autoPlay infiniteLoop>
                            {images && images.map((i) => (
                                <img src={i.url} key={i.public_id} />
                            ))}
                        </Carousel>
                    ) : (
                        <Card cover={<img src={laptop} className="md-3" />}></Card>)}

                    <Tabs type="card">
                        <TabPane tab="Description" key="1">
                            {description && description}
                        </TabPane>
                        <TabPane tab="More" key="2">
                            Call use on xxxx xxx xxx to learn more about this product.
                        </TabPane>
                    </Tabs>
                </div>

                <div className="col-md-5">
                    <h1 className="bg-info p-3">{title}</h1>
                    {product && product.ratings && product.ratings.length > 0
                        ? showAverage(product)
                        : (<div className="text-center pt-1 pb-3">No rating yet</div>)}

                    <Card
                        actions={[

                            <Tooltip title={tooltip}>
                                <a onClick={handleAddToCard}>
                                    <ShoppingCartOutlined className="text-danger" />
                                    <br /> Add to cart
                                </a>
                            </Tooltip>,

                            <a onClick={handleAddToWishList}>
                                <HeartOutlined className="text-info" /> <br /> Add to Wishlist
                            </a>,
                            <RatingModal>
                                <StarRating
                                    name={_id}
                                    numberOfStars={5}
                                    rating={star}
                                    changeRating={onStarClick}
                                    isSelectable={true}
                                    starRatedColor="red "
                                />
                            </RatingModal>
                        ]}
                    >
                        <ProductListItems product={product} />
                    </Card>
                </div>
            </div>
        </>
    )
}

export default SingleProduct
