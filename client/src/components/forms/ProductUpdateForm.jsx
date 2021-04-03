import React from 'react'
import { Select } from 'antd'
const { Option } = Select

const ProductUpdateForm = ({
    handleSubmit,
    handleChange,
    setValues,
    values,
    handleCategoryChange,
    categories,
    subOptions,
    arrayOfSubs,
    setArrayOfSubs,
    selectedCategory
}) => {

    //destructure
    const {
        title,
        description,
        price,
        category,
        subs,
        shipping,
        quantity,
        images,
        colors,
        brands,
        brand,
        color,
        setShow,
    } = values

    return (
        <form form onSubmit={handleSubmit} >
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={title}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={description}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Price</label>
                <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={price}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Shipping</label>
                <select
                    value={shipping === 'Yes' ? 'Yes' : 'No'}
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
            </div>

            <div className="form-group">
                <label>Quantity</label>
                <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Color</label>
                <select
                    value={color}
                    name="color"
                    className="form-control"
                    onChange={handleChange}
                >
                    {colors.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Brand</label>
                <select
                    value={brand}
                    name="brand"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Select brand</option>
                    {brands.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Category</label>
                <select
                    name="category"
                    className="form-control"
                    onChange={handleCategoryChange}
                    value={selectedCategory ? selectedCategory : category._id}
                >
                    {/* <option>{category ? category.name : 'Please Select'}</option> */}
                    {categories.length > 0 && categories.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Subcategories</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    value={arrayOfSubs}
                    onChange={(value) => setArrayOfSubs(value)}
                >
                    {subOptions.length &&
                        subOptions.map((sub) => (
                            <Option key={sub._id} value={sub._id}>
                                {sub.name}
                            </Option>
                        ))}
                </Select>
                <br />
            </div>
            <br />
            <button className="btn btn-outline-info">Admit</button>
        </form>
    )
}

export default ProductUpdateForm