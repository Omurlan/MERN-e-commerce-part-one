import React, { useEffect, useState } from 'react'
import { fetchProductsByFilter, getProductsByCount } from '../functions/product'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '../components/cards/ProductCard'
import { Menu, Radio, Slider } from 'antd'
import { DollarOutlined, DownSquareOutlined, StarOutlined } from '@ant-design/icons'
import { getCategories } from '../functions/category'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import Star from '../components/forms/Star'
import { getSubs } from '../functions/sub'
const { SubMenu } = Menu

const Shop = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState([0, 0])
    const [ok, setOk] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoryIds, setCategoryIds] = useState([])
    const [star, setStar] = useState('')
    const [subs, setSubs] = useState([])
    const [sub, setSub] = useState('')
    const [brands, setBrands] = useState([
        'Apple',
        'Samsung',
        'Microsoft',
        'Lenovo',
        'Asus',
        'Xiaomi',
        'Huawei'
    ])
    const [brand, setBrand] = useState('')
    const [colors, setColors] = useState([
        'Black',
        'Brown',
        'Silver',
        'White',
        'Blue'
    ])
    const [color, setColor] = useState('')
    const [shipping, setShipping] = useState(['Yes', 'No'])

    const dispatch = useDispatch()

    let { search } = useSelector((state) => ({ ...state }))
    const { text } = search

    useEffect(() => {
        loadAllProducts()
        //fetch categories
        getCategories().then((res) => {
            setCategories(res.data)
        })
        getSubs().then((res) => setSubs(res.data))
    }, [])

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg).then((res) => {
            setProducts(res.data)
        })
    }

    // 1 load products by default on page load
    const loadAllProducts = () => {
        setLoading(true)
        getProductsByCount(10).then((res) => {
            setProducts(res.data)
            setLoading(false)
        })
    }

    //2 load product on user search input
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({ query: text })
            if (!text) {
                loadAllProducts()
            }
        }, 300)
        return () => clearTimeout(delayed)
    }, [text])

    // 3 load product based on price range
    useEffect(() => {
        fetchProducts({ price })
    }, [ok])

    const handleSlider = (value) => {
        setPrice(value)
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })

        //reset
        setCategoryIds([])
        setPrice(value)
        setStar('')
        setSub('')
        setBrand('')
        setColor('')
        setShipping('')
        setTimeout(() => (
            setOk(!ok)
        ), 300)
    }

    // 4 load products based on category
    // show categories in a list of checkbox
    const showCategories = () =>
        categories.map((c) => (
            <div key={c._id}>
                <Checkbox
                    className="pb-2 pl-4 pr-4"
                    value={c._id}
                    name="category"
                    onChange={handleCheck}
                    checked={categoryIds.includes(c._id)}
                >
                    {c.name}
                </Checkbox>
                <br />
            </div>)
        )

    // handleCheck for categories 
    const handleCheck = (e) => {
        // reset
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setStar('')
        setSub('')
        setColor('')
        setBrand('')
        setShipping('')
        // console.log(e.target.value)
        let inTheState = [...categoryIds]
        let justChecked = e.target.value
        let foundInTheState = inTheState.indexOf((justChecked))

        //indexOf method if no found returns -1, else retun index
        if (foundInTheState === -1) {
            inTheState.push(justChecked)
        } else {
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1)
        }
        setCategoryIds(inTheState)
        fetchProducts({ category: inTheState })
    }

    //5 show products by star rating
    const handleStarClick = (num) => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar(num)
        setSub('')
        setBrand('')
        setColor('')
        setShipping('')
        fetchProducts({ stars: num })
    }

    const showStars = () => (
        <div className="pr-4 pl-4 pb-2">
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    )

    //6 show products by sub categories

    const showSubs = () =>
        subs.map((s) => (
            <div
                key={s._id}
                onClick={() => handleSub(s)}
                className="p-1 m-1 badge badge-secondary"
                style={{ cursor: 'pointer' }}
            >
                {s.name}
            </div>)
        )

    const handleSub = (sub) => {
        // console.log('SUB', sub)
        setSub(sub)
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setBrand('')
        setColor('')
        setShipping('')
        fetchProducts({ sub })
    }

    // 7 show products based on brand name
    const showBrands = () =>
        brands.map((b) => (
            <Radio
                key={b}
                value={b}
                name={b}
                checked={b === brand}
                onChange={handleBrand}
                className="col-md-6 pb-2 pl-4 pr-4"
            >
                {b}
            </Radio>

        ))

    const handleBrand = (e) => {
        setSub('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setColor('')
        setShipping('')
        setBrand(e.target.value)
        fetchProducts({ brand: e.target.value })
    }

    // 8 show products based on color
    const showColors = () =>
        colors.map((c) => (
            <Radio
                key={c}
                value={c}
                name={c}
                checked={c === color}
                onChange={handleColor}
                className="col-md-6 pb-2 pl-4 pr-4"
            >
                {c}
            </Radio>
        ))

    const handleColor = (e) => {
        setSub('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setBrand('')
        setShipping('')
        setColor(e.target.value)
        fetchProducts({ color: e.target.value })
    }

    // 9 show products based on shipping
    const showShipping = () =>
        <>
            <Checkbox
                className="pb-2 pl-4 pr-4"
                onChange={handleShippingChange}
                value="Yes"
                checked={shipping === 'Yes'}
            >
                Yes
            </Checkbox>

            <Checkbox
                className="pb-2 pl-4 pr-4"
                onChange={handleShippingChange}
                value="No"
                checked={shipping === 'No'}
            >
                No
            </Checkbox>
        </>

    const handleShippingChange = (e) => {
        setSub('')
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: '' }
        })
        setPrice([0, 0])
        setCategoryIds([])
        setStar('')
        setBrand('')
        setColor('')
        setShipping(e.target.value)
        fetchProducts({ shipping: e.target.value })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3 pt-2">
                    <h4>Search/Filter</h4>
                    <hr />

                    <Menu defaultOpenKeys={['slider', 'categories', 'stars', 'subs', 'brands', 'colors', 'shipping']} mode="inline">
                        <SubMenu
                            key='slider'
                            title={
                                <span className="h6">
                                    <DollarOutlined /> Price
                                </span>}>
                            <div>
                                <Slider
                                    className="ml-4 mr-4"
                                    tipFormatter={(v) => `$${v}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max="4999"
                                />
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='categories'
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Categories
                                </span>}>
                            <div>
                                {showCategories()}
                            </div>
                        </SubMenu>

                        {/* stars */}
                        <SubMenu
                            key='stars'
                            title={
                                <span className="h6">
                                    <StarOutlined /> Rating
                                </span>}>
                            <div>
                                {showStars()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='subs'
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Sub categories
                                </span>}>
                            <div className="pl-4 pr-4">
                                {showSubs()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='brands'
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Brands
                                </span>}>
                            <div className="pr-4">
                                {showBrands()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='colors'
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Colors
                                </span>}>
                            <div className="pr-4">
                                {showColors()}
                            </div>
                        </SubMenu>

                        <SubMenu
                            key='shipping'
                            title={
                                <span className="h6">
                                    <DownSquareOutlined /> Shipping
                                </span>}>
                            <div className="pr-4">
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>

                <div className="col-md-9 pt-2">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4 className="text-danger">Products</h4>
                    )}

                    {products.length < 1 && <p>No products found</p>}

                    <div className="row pb-5">
                        {products.map((p) => (
                            <div key={p._id} className="col-md-4 mt-3">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop
