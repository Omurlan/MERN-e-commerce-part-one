import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getCategories, getCategoriesSubs } from '../../../functions/category'
import AdminNav from '../../../components/nav/AdminNav'
import { getProduct, updateProduct } from '../../../functions/product'
import FileUpload from '../../../components/forms/FIleUpload'
import { LoadingOutlined } from '@ant-design/icons'
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm'

const initialState = {
    title: '',
    description: '',
    price: '',
    category: '',
    subs: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Asus', 'Xiaomi', 'Huawei'],
    color: '',
    brand: ''
}

const ProductUpdate = ({ match, history }) => {
    //state
    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([])
    const [categories, setCategories] = useState([])
    const [arrayOfSubs, setArrayOfSubs] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [loading, setLoading] = useState(false)

    //redux
    const { user } = useSelector((state) => ({ ...state }))

    const { slug } = match.params

    useEffect(() => {
        loadCategories()
        loadProduct()
    }, [])

    const loadProduct = () => {
        getProduct(slug).then((res) => {
            setValues({ ...values, ...res.data })
            console.log('original category', res.data)

            getCategoriesSubs(res.data.category._id).then(res => {
                setSubOptions(res.data) // on first load, show default subs
                console.log('subs', res.data)
            })
            let arr = []
            res.data.subs.map((s) => {
                arr.push(s._id)
            })
            setArrayOfSubs((prev) => arr) // required for ant design select to work

        })
    }

    const loadCategories = () => {
        getCategories().then((res) => {
            setCategories(res.data)
        })
    }

    const handleCategoryChange = (e) => {
        e.preventDefault()

        setValues({
            ...values,
            subs: [],
        })

        setSelectedCategory(e.target.value)
        console.log('Selected Category', e.target.value)

        getCategoriesSubs(e.target.value)
            .then((res) => {
                setSubOptions(res.data)
            })


        // if user click back to the original category
        // show its sub categories in defaul
        if (values.category._id === e.target.value) {
            loadProduct()
        }

        setArrayOfSubs([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        values.subs = arrayOfSubs
        values.category = selectedCategory ? selectedCategory : values.category

        updateProduct(slug, values, user.token)
            .then((res) => {
                setLoading(false)
                toast.success(`"${res.data.title}" is updated`)
                history.push('/admin/products')
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
                toast.error(err.response.data.err)
            })
    }

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">

                    {loading ? (
                        <LoadingOutlined className="text-danger h1" />
                    ) : (
                        (<h4>Product update</h4>))}
                    <hr />

                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>

                    <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleCategoryChange={handleCategoryChange}
                        subOptions={subOptions}
                        values={values}
                        setValues={setValues}
                        categories={categories}
                        subOptions={subOptions}
                        arrayOfSubs={arrayOfSubs}
                        setArrayOfSubs={setArrayOfSubs}
                        selectedCategory={selectedCategory}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate