import React from 'react'
import ModalImage from 'react-modal-image'
import laptop from '../../images/laptop.png'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { CheckCircleOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons'

const ProductCartInCheckout = ({ product }) => {
    const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue']

    const dispatch = useDispatch()

    const handleColorChange = (e) => {
        // console.log('calor changed', e.target.value)

        let cart = []
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse((localStorage.getItem('cart')))
            }
            cart.map((p, i) => {
                if (p._id === product._id) {
                    cart[i].color = e.target.value
                }
            })
            // console.log('cart update color', color)
            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart
            })
        }
    }

    const handleQuantityChange = (e) => {
        if (e.target.value > product.quantity) {
            toast.error(`Max available quantity: ${product.quantity}`)
            return
        }

        let cart = []

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse((localStorage.getItem('cart')))
            }

            cart.map((p, i) => {
                if (p._id === product._id) {
                    cart[i].count = e.target.value
                }
            })

            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart
            })
        }
    }

    const handleRemove = () => {
        // console.log(product._id, 'to remove')
        let cart = []

        if (typeof window !== 'undefined') {
            if (localStorage.getItem('cart')) {
                cart = JSON.parse((localStorage.getItem('cart')))
            }

            cart.map((p, i) => {
                if (p._id === product._id) {
                    cart.splice(i, 1)
                }
            })

            localStorage.setItem('cart', JSON.stringify(cart))
            dispatch({
                type: 'ADD_TO_CART',
                payload: cart
            })
        }
    }

    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: '100px', margin: 'auto' }}>
                        {product.images.length ? (
                            <ModalImage
                                small={product.images[0].url}
                                large={product.images[0].url}
                            />
                        ) : (
                            <ModalImage
                                small={laptop}
                                large={laptop}
                            />
                        )}
                    </div>
                </td>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>{product.brand}</td>
                <td>
                    <select
                        name="color"
                        onChange={handleColorChange}
                        className="form-control "
                    >
                        {product.color ? (
                            <option value={product.color}>{product.color}</option>
                        ) : (
                            <option>Select</option>

                        )}
                        {colors
                            .filter((c) => c !== product.color)
                            .map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                    </select>
                </td>
                <td className="text-center">
                    <input
                        type="number"
                        min="1"
                        value={product.count}
                        onChange={handleQuantityChange}
                    />
                </td>
                <td className="text-center">{product.shipping === 'Yes' ? (
                    <CheckCircleOutlined className="text-success" />
                ) : (
                    <CloseCircleOutlined className="text-danger" />
                )}
                </td>
                <td className="text-center">
                    <CloseOutlined
                        onClick={handleRemove}
                        className="text-danger pointer"
                    />
                </td>
            </tr>
        </tbody >
    )
}

export default ProductCartInCheckout
