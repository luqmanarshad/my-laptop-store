import { reactive } from 'vue'
import axios from 'axios'

// Load helper
const getLocal = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]')
    } catch {
        return []
    }
}

// Save helper
const saveLocal = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val))
}

export const store = reactive({
    // State
    user: null,
    wishlist: getLocal('wishlist'),
    compare: getLocal('compare'),
    cart: getLocal('guest_cart'), // Defaults to guest cart if not logged in
    loadingCart: false,
    toasts: [],
    router: null, // Set in app.js

    // Toast Actions
    addToast(message, type = 'success') {
        const id = Date.now() + Math.random()
        this.toasts.push({ id, message, type })
        setTimeout(() => {
            this.removeToast(id)
        }, 4500)
    },
    removeToast(id) {
        this.toasts = this.toasts.filter(t => t.id !== id)
    },

    // User Profile Actions
    async fetchUser() {
        const token = localStorage.getItem('api_token')
        if (!token) {
            this.user = null
            this.cart = getLocal('guest_cart')
            return
        }
        try {
            const response = await axios.get('/api/user')
            this.user = response.data
            
            // If guest cart has items, merge them first
            const guestCart = getLocal('guest_cart')
            if (guestCart && guestCart.length > 0) {
                await this.mergeGuestCart()
            } else {
                await this.fetchCart()
            }
        } catch (error) {
            console.error('Failed to load user profile:', error)
            this.clearSession()
        }
    },
    clearSession() {
        localStorage.removeItem('api_token')
        delete axios.defaults.headers.common['Authorization']
        this.user = null
        this.cart = []
        localStorage.removeItem('guest_cart')
    },
    async logout() {
        try {
            await axios.post('/api/logout')
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            this.clearSession()
            this.addToast('Logged out successfully', 'info')
            if (this.router) {
                this.router.push('/login')
            } else {
                window.location.href = '/login'
            }
        }
    },

    // Wishlist Actions
    isInWishlist(id) {
        return this.wishlist.some(item => item.id === id)
    },
    toggleWishlist(product) {
        const index = this.wishlist.findIndex(item => item.id === product.id)
        if (index > -1) {
            this.wishlist.splice(index, 1)
            this.addToast(`Removed "${product.title}" from wishlist`, 'info')
        } else {
            this.wishlist.push(product)
            this.addToast(`Added "${product.title}" to wishlist`, 'success')
        }
        saveLocal('wishlist', this.wishlist)
    },

    // Compare Actions
    isInCompare(id) {
        return this.compare.some(item => item.id === id)
    },
    toggleCompare(product) {
        const index = this.compare.findIndex(item => item.id === product.id)
        if (index > -1) {
            this.compare.splice(index, 1)
            this.addToast(`Removed "${product.title}" from compare list`, 'info')
        } else {
            if (this.compare.length >= 3) {
                this.addToast('You can compare a maximum of 3 laptops at a time.', 'warning')
                return
            }
            this.compare.push(product)
            this.addToast(`Added "${product.title}" to compare list`, 'success')
        }
        saveLocal('compare', this.compare)
    },

    // Cart Backend & Local Actions
    async fetchCart() {
        if (!localStorage.getItem('api_token')) {
            this.cart = getLocal('guest_cart')
            return
        }
        this.loadingCart = true
        try {
            const response = await axios.get('/api/cart')
            this.cart = response.data
        } catch (error) {
            console.error('Failed to load cart:', error)
            if (error.response?.status === 401) {
                this.clearSession()
            }
        } finally {
            this.loadingCart = false
        }
    },
    async addToCart(productId, quantity = 1) {
        // If guest (not logged in)
        if (!localStorage.getItem('api_token')) {
            try {
                const response = await axios.get(`/api/products/${productId}`)
                const product = response.data
                
                let guestCart = getLocal('guest_cart')
                const existingIndex = guestCart.findIndex(i => i.product_id === productId)
                
                if (existingIndex > -1) {
                    const newQty = guestCart[existingIndex].quantity + quantity
                    if (product.stock < newQty) {
                        this.addToast(`Only ${product.stock} items available in stock.`, 'warning')
                        guestCart[existingIndex].quantity = product.stock
                    } else {
                        guestCart[existingIndex].quantity = newQty
                    }
                } else {
                    const finalQty = product.stock < quantity ? product.stock : quantity
                    if (finalQty > 0) {
                        guestCart.push({
                            id: 'guest_' + Date.now() + '_' + Math.random(),
                            product_id: productId,
                            quantity: finalQty,
                            price: product.sale_price || product.price,
                            product: product
                        })
                    } else {
                        this.addToast('Item is out of stock.', 'warning')
                        return
                    }
                }
                
                saveLocal('guest_cart', guestCart)
                this.cart = guestCart
                this.addToast(`Added "${product.title}" to cart`, 'success')
            } catch (err) {
                console.error('Guest add to cart failed:', err)
                this.addToast('Could not add item to cart.', 'danger')
            }
            return
        }

        // If logged in
        try {
            const response = await axios.post('/api/cart/add', { product_id: productId, quantity })
            await this.fetchCart()
            this.addToast(response.data.message || 'Added to cart!', 'success')
        } catch (error) {
            console.error('Failed to add to cart:', error)
            if (error.response?.status === 401) {
                this.clearSession()
                this.addToast('Your session expired. Please login again.', 'warning')
                if (this.router) this.router.push('/login')
            } else {
                this.addToast(error.response?.data?.message || 'Could not add item to cart. Please try again.', 'danger')
            }
        }
    },
    async updateCartQuantity(cartItemId, quantity) {
        if (quantity < 1) return

        // If guest
        if (!localStorage.getItem('api_token')) {
            let guestCart = getLocal('guest_cart')
            const item = guestCart.find(i => i.id === cartItemId)
            if (item) {
                if (item.product.stock < quantity) {
                    this.addToast(`Only ${item.product.stock} items available in stock.`, 'warning')
                    item.quantity = item.product.stock
                } else {
                    item.quantity = quantity
                }
                saveLocal('guest_cart', guestCart)
                this.cart = guestCart
                this.addToast('Cart updated', 'success')
            }
            return
        }

        // If logged in
        try {
            await axios.put(`/api/cart/${cartItemId}`, { quantity })
            const item = this.cart.find(i => i.id === cartItemId)
            if (item) item.quantity = quantity
            this.addToast('Cart updated', 'success')
        } catch (error) {
            console.error('Failed to update cart quantity:', error)
            if (error.response?.status === 401) {
                this.clearSession()
                this.addToast('Your session expired. Please login again.', 'warning')
                if (this.router) this.router.push('/login')
            } else {
                this.addToast(error.response?.data?.message || 'Failed to update quantity', 'danger')
            }
        }
    },
    async removeFromCart(cartItemId) {
        // If guest
        if (!localStorage.getItem('api_token')) {
            let guestCart = getLocal('guest_cart')
            const item = guestCart.find(i => i.id === cartItemId)
            const title = item?.product?.title || 'item'
            guestCart = guestCart.filter(i => i.id !== cartItemId)
            saveLocal('guest_cart', guestCart)
            this.cart = guestCart
            this.addToast(`Removed "${title}" from cart`, 'info')
            return
        }

        // If logged in
        try {
            const item = this.cart.find(i => i.id === cartItemId)
            const title = item?.product?.title || 'item'
            await axios.delete(`/api/cart/${cartItemId}`)
            this.cart = this.cart.filter(i => i.id !== cartItemId)
            this.addToast(`Removed "${title}" from cart`, 'info')
        } catch (error) {
            console.error('Failed to remove from cart:', error)
            if (error.response?.status === 401) {
                this.clearSession()
                this.addToast('Your session expired. Please login again.', 'warning')
                if (this.router) this.router.push('/login')
            } else {
                this.addToast('Could not remove item from cart', 'danger')
            }
        }
    },
    async mergeGuestCart() {
        const guestCart = getLocal('guest_cart')
        if (!guestCart || guestCart.length === 0) return

        try {
            const items = guestCart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))

            await axios.post('/api/cart/merge', { items })
            localStorage.removeItem('guest_cart')
            this.addToast('Synchronized guest shopping cart to your account!', 'success')
            await this.fetchCart()
        } catch (error) {
            console.error('Failed to merge guest cart:', error)
            await this.fetchCart()
        }
    },
    async processCheckout(checkoutData) {
        try {
            const response = await axios.post('/api/checkout', checkoutData)
            this.cart = []
            this.addToast('Order placed successfully!', 'success')
            return response.data
        } catch (error) {
            console.error('Checkout failed:', error)
            const msg = error.response?.data?.message || 'Failed to place order. Please try again.'
            this.addToast(msg, 'danger')
            throw error;
        }
    }
})

// Auto fetch user profile and cart on initialization
store.fetchUser()
