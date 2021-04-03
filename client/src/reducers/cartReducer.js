let inititalState = []

// load cart items from local storage
if (typeof window !== 'undefined') {
    if (localStorage.getItem('cart')) {
        inititalState = JSON.parse(localStorage.getItem('cart'))
    } else {
        inititalState = []
    }
}

export const cartReducer = (state = inititalState, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return action.payload
        default:
            return state;
    }
}