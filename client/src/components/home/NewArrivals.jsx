import React, { useEffect, useState } from 'react'
import { getProducts, getTotalProductsCount } from '../../functions/product'
import ProductCard from '../cards/ProductCard'
import LoadingCard from '../cards/LoadingCard'
import './NewArrivals.css'

const NewArrivals = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [productsCount, setProductsCount] = useState(0)

    const [limit, setLimit] = useState(2)
    const [page, setPage] = useState(localStorage.getItem('paginationOfNewArrivals') ? JSON.parse(localStorage.getItem('paginationOfNewArrivals')) : 1)

    useEffect(() => {
        loadAllProducts()
        getTotalProductsCount().then((res) => setProductsCount(res.data))
    }, [page, limit])

    const loadAllProducts = () => {
        setLoading(true)
        getProducts('createdAt', 'desc', limit, page)
            .then((res) => {
                setProducts(res.data.results)
                console.log(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    const nextPage = () => {
        if (page !== pageButtons.length) {
            setPage(page + 1)
        }
    }

    localStorage.setItem('paginationOfNewArrivals', JSON.stringify(page))

    const previousPage = () => {
        if (page > 1)
            setPage(page - 1)
    }

    const pageButtons = []

    const handlePageButtons = () => {
        let totalCount = Math.ceil(productsCount / limit)

        for (let i = 1; i <= totalCount; i++) {
            pageButtons.push(i)
        }
    }

    handlePageButtons()

    return (
        <>
            <div className="container">
                {loading ? (
                    <LoadingCard count={3} />
                ) : (
                    <div className="row">
                        {products.map((product) => (
                            <div key={product._id} className="col-md-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>)}
            </div>

            {/* <div className="row">
                <nav className="col-md-4 offset-md-4 text-center pt-2 p-3">
                    <Pagination
                        current={page}
                        total={(productsCount / 1) * 10}
                        onChange={value => setPage(value)}
                    />
                </nav>
            </div> */}
            <div className="pagination-block">


                <button className="pagination-button" onClick={previousPage}> {'<'} </button>
                {pageButtons.map((p) => (
                    (
                        <button button
                            key={p}
                            className={page === p ? "pagination-button clicked" : "pagination-button"
                            }
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    )

                ))}
                <button className="pagination-button" onClick={nextPage}> {'>'} </button>

            </div>
        </>
    )
}

export default NewArrivals

