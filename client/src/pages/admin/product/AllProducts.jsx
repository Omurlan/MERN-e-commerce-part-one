import React, { useEffect, useState } from 'react'
import AdminProductCard from '../../../components/cards/AdminProductCard'
import AdminNav from '../../../components/nav/AdminNav'
import { getProductsByCount, removeProduct } from '../../../functions/product'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const AllProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    // redux store
    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        loadAllProducts()
    }, [])

    const handleRemove = (slug) => {
        let answer = window.confirm('Delete ?')
        if (answer) {
            removeProduct(slug, user.token)
                .then((res) => {
                    loadAllProducts()
                    toast.error(`${res.data.title} is deleted`)
                })
                .catch((err) => {
                    if (err.response.status === 400) toast.error(err.response.data)
                })
        }
    }

    const loadAllProducts = () => {
        setLoading(true)
        getProductsByCount(100)
            .then((res) => {
                setProducts(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <AdminNav />
                    </div>
                    <div className="col">
                        {loading ? (
                            <h4 className="text-danger">Loading...</h4>
                        ) : (
                            <h4>All Products</h4>
                        )}
                        <div className="row">
                            {products.map((product) => (
                                <div key={product._id} className="col-md-3 pb-3">
                                    <AdminProductCard product={product} handleRemove={handleRemove} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AllProducts