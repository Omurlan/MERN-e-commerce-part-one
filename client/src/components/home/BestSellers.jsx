import React, { useEffect, useState } from 'react'
import { getProducts, getTotalProductsCount } from '../../functions/product'
import ProductCard from '../cards/ProductCard'
import LoadingCard from '../cards/LoadingCard'

const BestSellers = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [productsCount, setProductsCount] = useState(0)

    const [limit, setLimit] = useState(3)
    const [page, setPage] = useState(localStorage.getItem('paginationOfBestSellers') ? JSON.parse(localStorage.getItem('paginationOfBestSellers')) : 1)

    useEffect(() => {
        loadAllProducts()
        getTotalProductsCount().then((res) => setProductsCount(res.data))
    }, [limit, page])

    const loadAllProducts = () => {
        setLoading(true)
        getProducts('sold', 'desc', limit, page)
            .then((res) => {
                setProducts(res.data.results)
                // console.log(res.data)
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

    localStorage.setItem('paginationOfBestSellers', JSON.stringify(page))

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
            </div>
        </>
    )
}

export default BestSellers

