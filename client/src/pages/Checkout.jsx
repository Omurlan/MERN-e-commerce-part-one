import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { applyCoupon, createCashOrderForUser, emptyUserCart, getUserCart, saveUserAddress } from '../functions/user'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Checkout = ({ history }) => {
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [address, setAddress] = useState('')
    const [addressSaved, setAddressSaved] = useState(false)
    const [coupon, setCoupon] = useState('')
    //discount price
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0)
    const [discountError, setDiscountError] = useState('')

    const dispatch = useDispatch()
    const { user, COD } = useSelector((state) => ({ ...state }))
    const couponTrueOrFalse = useSelector((state) => state.coupon)


    useEffect(() => {
        getUserCart(user.token)
            .then((res) => {
                // console.log(user.token)
                setProducts(res.data.products)
                setTotal(res.data.cartTotal)
            })
    }, [])

    const emptyCart = () => {
        // remove from local storage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cart')
        }

        //remove from redux
        dispatch({
            type: 'ADD_TO_CART',
            payload: []
        })
        // remove from backend
        emptyUserCart(user.token)
            .then((res) => {
                setProducts([])
                setTotal(0)
                setTotalAfterDiscount(0)
                setCoupon('')
                toast.success('Cart is empty. Continue shopping')
            })
    }

    const saveAddresToDb = () => {
        saveUserAddress(user.token, address).then(res => {
            if (res.data.ok) {
                setAddressSaved(true)
                toast.success('Address saved')
            }
        })
    }

    const applyDiscountCoupon = () => {
        applyCoupon(user.token, coupon)
            .then((res) => {
                console.log('RES ON COUPON APPLIED', res.data)
                if (res.data) {
                    setTotalAfterDiscount(res.data)
                    // update redux coupon applied true/false
                    dispatch({
                        type: 'COUPON_APPLIED',
                        payload: true
                    })
                }
                // error
                if (res.data.err) {
                    setDiscountError(res.data.err)
                    // update redux coupon applied true/false
                    dispatch({
                        type: 'COUPON_APPLIED',
                        payload: false
                    })
                }
            })

    }

    const showAddress = () => (
        <>
            <ReactQuill theme="snow" value={address} onChange={setAddress} />
            <button className="btn btn-primary mt-2" onClick={saveAddresToDb}>
                Save
            </button>
        </>
    )

    const showProductSummary = () =>
        products.map((p, i) => (
            <div key={i}>
                <p>{p.product.title} ({p.color}) x {p.count} =
                {p.price} * {p.count}</p>
            </div>
        ))

    const showApplyCoupon = () => (
        <>
            <input
                type="text"
                value={coupon}
                onChange={(e) => {
                    setCoupon(e.target.value)
                    setDiscountError('')
                }}
                className="form-control"
            />
            <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
                Apply
            </button>
        </>
    )

    const createCashOrder = () => {
        createCashOrderForUser(user.token, COD, couponTrueOrFalse)
            .then((res) => {
                if (res.data.ok) {
                    // empty localStorage
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('cart')
                    }
                    // emtpy redux cart
                    dispatch({
                        type: 'ADD_TO_CART',
                        payload: []
                    })
                    // empty redux coupon
                    dispatch({
                        type: 'COUPON_APPLIED',
                        payload: false
                    })
                    // empty redux COD
                    dispatch({
                        type: 'CASH_ON_DELIVERY',
                        payload: false
                    })
                    // empty cart from backend
                    emptyUserCart(user.token)
                    // redirect
                    setTimeout(() => {
                        history.push('/user/history')
                    }, 1000)
                }
            })
    }

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4>Got Coupon ?</h4>
                <br />
                <br />
                {showApplyCoupon()}
                <br />
                {discountError && <p className="bg-danger p-2">{discountError}</p>}
            </div>

            <div className="col-md-6">
                <h4>Order Summary</h4>
                <hr />
                <p>Products {products.length}</p>
                <hr />
                {showProductSummary()}
                <hr />
                <p>Cart Total: ${total}</p>

                {totalAfterDiscount > 0 && (
                    <p className="bg-success p-2">
                        Discount Applied: Total Payable: ${totalAfterDiscount}
                    </p>
                )}

                <div className="row">
                    <div className="col-md-6">
                        {COD ? (
                            <button
                                disabled={!addressSaved || !products.length}
                                className="btn btn-primary"
                                onClick={createCashOrder}
                            >
                                Place Order
                            </button>
                        ) : (
                            <button
                                disabled={!addressSaved || !products.length}
                                className="btn btn-primary"
                                onClick={() => history.push('/payment')}
                            >
                                Place Order
                            </button>
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <button
                            disabled={!products.length}
                            onClick={emptyCart}
                            className="btn btn-primary">
                            Empty Cart
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Checkout
