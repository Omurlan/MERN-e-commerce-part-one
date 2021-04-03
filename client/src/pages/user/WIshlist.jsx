import React, { useEffect, useState } from 'react'
import UserNav from '../../components/nav/UserNav'
import { getWishList, removeWishList } from '../../functions/user'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { DeleteOutlined } from '@ant-design/icons'

const Wishlist = () => {
    const [wishList, setWishList] = useState([])

    const dispatch = useDispatch()
    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        loadWishList()
    }, [])

    const loadWishList = () =>
        getWishList(user.token)
            .then((res) => {
            // setWishList(res.data.wishlist)
            setWishList(res.data.wishlist)
        })

    const handleRemove = (productId) =>
        removeWishList(productId, user.token)
            .then((res) => {
                loadWishList()
            })

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col">
                    <h4>Wishlist</h4>

                    {wishList.map((p) => (
                        <div key={p._id} className="alert alert-secondary">
                            <Link to={`/products/${p.slug}`}>
                                {p.title}
                            </Link>
                            <span
                                onClick={() => handleRemove(p._id)}
                                className="btn btn-sm float-right"
                            >
                                <DeleteOutlined className="text-danger" />
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Wishlist