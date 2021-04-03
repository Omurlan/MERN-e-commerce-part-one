import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { DeleteOutlined } from '@ant-design/icons'
import AdminNav from '../../../components/nav/AdminNav'
import { createCoupon, getCoupons, removeCoupon } from '../../../functions/coupon'

const CreateCouponPage = () => {
    const [name, setName] = useState('')
    const [expiry, setExpiry] = useState('')
    const [discount, setDiscount] = useState('')
    const [loading, setLoading] = useState(false)
    const [coupons, setCoupons] = useState([])

    const { user } = useSelector((state) => ({ ...state }))
    const dispatch = useDispatch()

    useEffect(() => {
        loadAllCoupons()
    }, [])

    const loadAllCoupons = () => {
        getCoupons().then((res) => {
            setCoupons(res.data)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        createCoupon({ name, expiry, discount }, user.token)
            .then((res) => {
                setName('')
                loadAllCoupons()
                setExpiry('')
                setDiscount('')
                setLoading(false)
                toast.success(`${res.data.name} is created`)
            })
    }

    const handleRemove = (couponId) => {
        if (window.confirm('Delete ?')) {
            setLoading(true)
            removeCoupon(couponId, user.token).then((res) => {
               loadAllCoupons()
                setLoading(false)
                console.log(res)
                toast.error(`Coupon "${res.data.name}" deleted`)
            })
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    {loading ? (
                        <h4 className="text-danger">Loading...</h4>
                    ) : (
                        <h4>Coupon</h4>)}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="text-muted">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Discount %</label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={(e) => setDiscount(e.target.value)}
                                value={discount}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Expiry</label>
                            <br />
                            <DatePicker
                                className="form-control"
                                selected={new Date}
                                onChange={(date) => setExpiry(date)}
                                value={expiry}
                                required
                            />
                        </div>

                        <button className="btn btn-outline-primary">Save</button>
                    </form>

                    <br />

                    <h4>{coupons.length} Coupons</h4>


                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Expiry</th>
                                <th scope="col">Discount</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {coupons.map((c) => (
                                <tr className={c._id}>
                                    <td>{c.name}</td>
                                    <td>{new Date(c.expiry).toLocaleDateString()}</td>
                                    <td>{c.discount} %</td>
                                    <td
                                        className="text-danger text-center pointer"
                                        onClick={() => handleRemove(c._id)}
                                    >
                                        <DeleteOutlined />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CreateCouponPage
