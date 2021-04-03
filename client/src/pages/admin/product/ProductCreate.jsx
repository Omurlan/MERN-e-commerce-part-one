import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getCategories, getCategoriesSubs } from '../../../functions/category'
import AdminNav from '../../../components/nav/AdminNav'
import { createProduct } from '../../../functions/product'
import ProductCreateForm from '../../../components/forms/ProductCreateForm'
import FileUpload from '../../../components/forms/FIleUpload'
import { LoadingOutlined } from '@ant-design/icons'

const initialState = {
    title: '',
    description: '',
    price: '',
    categories: [],
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

const ProductCreate = () => {
    const [values, setValues] = useState(initialState)
    const [subOptions, setSubOptions] = useState([])
    const [showSub, setShowSub] = useState(false)
    const [loading, setLoading] = useState(false)

    //redux
    const { user } = useSelector((state) => ({ ...state }))

    useEffect(() => {
        loadCategories()
    }, [])

    const loadCategories = () => {
        getCategories().then((res) => setValues({ ...values, categories: res.data }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createProduct(values, user.token)
            .then(res => {
                console.log(res)
                window.alert(` "${res.data.title}" is created`)
                window.location.reload()
            })
            .catch((err) => {
                // if (err.response.status === 400) toast.error(err.response.data)
                toast.error(err.response.data.err)
            })
    }

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const handleCategoryChange = (e) => {
        e.preventDefault()
        console.log('Clicked Category', e.target.value)
        setValues({
            ...values,
            subs: [],
            category: e.target.value
        })
        getCategoriesSubs(e.target.value)
            .then((res) => {
                console.log(res)
                setSubOptions(res.data)
            })
        setShowSub(true)
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
                        (<h4>Product create</h4>))}
                    <hr />

                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>

                    <ProductCreateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleCategoryChange={handleCategoryChange}
                        values={values}
                        setValues={setValues}
                        subOptions={subOptions}
                        showSub={showSub}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductCreate