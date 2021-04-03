import React, { useEffect, useState } from 'react'
import ProductCard from '../../components/cards/ProductCard'
import { getSub } from '../../functions/sub'

const SubHome = ({ match }) => {
    const [sub, setSub] = useState({})
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const { slug } = match.params

    useEffect(() => {
        setLoading(true)
        getSub(slug).then((res) => {
            // console.log(JSON.stringify(c.data), null, 4)
            setSub(res.data.sub)
            setProducts(res.data.products)
            setLoading(false)
        })
    }, [])

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        {loading ? (
                            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                                Loading...
                            </h4>
                        ) : (
                            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                                {products.length} Products in "{sub.name}" sub category
                            </h4>
                        )}
                    </div>
                    <div className="row">
                        {products.map((p) => (
                            <div key={p._id} className="col-md-4">
                                <ProductCard product={p}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubHome
