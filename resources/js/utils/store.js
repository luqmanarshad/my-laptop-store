import { reactive } from 'vue'
import axios from 'axios'
import { auth, db } from '../firebase_config'
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore'

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
            // We use a promise wrapper to wait for auth state
            const authUser = await new Promise((resolve) => {
               const unsubscribe = auth.onAuthStateChanged(user => {
                  unsubscribe();
                  resolve(user);
               });
            });
            
            if (authUser) {
                // Fetch user document to check role
                let isAdmin = false
                try {
                    const userDoc = await getDoc(doc(db, 'users', authUser.uid))
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        isAdmin = true
                    }
                    // Fallback: Check hardcoded admin email
                    if (authUser.email === 'luqmanarshad469@gmail.com') {
                        isAdmin = true
                    }
                } catch (e) {
                    // Fallback for hardcoded admin if Firestore check fails
                    if (authUser.email === 'luqmanarshad469@gmail.com') {
                        isAdmin = true
                    }
                    console.warn('Unable to verify admin role from Firestore:', e)
                }

                this.user = { 
                    id: authUser.uid, 
                    name: authUser.displayName || 'User', 
                    email: authUser.email,
                    isAdmin: isAdmin
                }
                
                // If guest cart has items, merge them first
                const guestCart = getLocal('guest_cart')
                if (guestCart && guestCart.length > 0) {
                    await this.mergeGuestCart()
                } else {
                    await this.fetchCart()
                }
            } else {
                this.clearSession();
            }
        } catch (error) {
            console.error('Failed to load user profile:', error)
            this.clearSession()
        }
    },
    clearSession() {
        localStorage.removeItem('api_token')
        this.user = null
        this.cart = []
        localStorage.removeItem('guest_cart')
    },
    async logout() {
        try {
            await auth.signOut()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            this.clearSession()
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
        if (!auth.currentUser) {
            this.cart = getLocal('guest_cart')
            return
        }
        this.loadingCart = true
        try {
            const docRef = doc(db, 'carts', auth.currentUser.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                this.cart = docSnap.data().items || []
            } else {
                this.cart = []
            }
        } catch (error) {
            console.error('Failed to load cart:', error)
        } finally {
            this.loadingCart = false
        }
    },
    async saveCartToFirebase() {
        if (!auth.currentUser) return
        try {
            await setDoc(doc(db, 'carts', auth.currentUser.uid), { items: this.cart })
        } catch (error) {
            console.error('Failed to save cart:', error)
        }
    },
    async addToCart(productId, quantity = 1) {
        let product = null
        try {
            const pDoc = await getDoc(doc(db, "products", productId))
            if(pDoc.exists()) product = {id: pDoc.id, ...pDoc.data()}
        } catch(e) {}
        
        if (!product) {
             this.addToast('Product not found', 'danger')
             return
        }

        const isGuest = !auth.currentUser
        let targetCart = isGuest ? getLocal('guest_cart') : this.cart
        
        const existingIndex = targetCart.findIndex(i => i.product_id === productId)
        if (existingIndex > -1) {
            const newQty = targetCart[existingIndex].quantity + quantity
            if (product.stock < newQty) {
                this.addToast(`Only ${product.stock} items available.`, 'warning')
                targetCart[existingIndex].quantity = product.stock
            } else {
                targetCart[existingIndex].quantity = newQty
            }
        } else {
            const finalQty = product.stock < quantity ? product.stock : quantity
            if (finalQty > 0) {
                targetCart.push({
                    id: 'item_' + Date.now() + '_' + Math.random(),
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

        if (isGuest) {
            saveLocal('guest_cart', targetCart)
            this.cart = targetCart
            this.addToast(`Added "${product.title}" to cart`, 'success')
        } else {
            this.cart = targetCart
            await this.saveCartToFirebase()
            this.addToast('Added to cart!', 'success')
        }
    },
    async updateCartQuantity(cartItemId, quantity) {
        if (quantity < 1) return
        
        const isGuest = !auth.currentUser
        let targetCart = isGuest ? getLocal('guest_cart') : this.cart
        const item = targetCart.find(i => i.id === cartItemId)
        
        if (item) {
             if (item.product.stock < quantity) {
                 this.addToast(`Only ${item.product.stock} items available.`, 'warning')
                 item.quantity = item.product.stock
             } else {
                 item.quantity = quantity
             }
             
             if (isGuest) {
                 saveLocal('guest_cart', targetCart)
                 this.cart = targetCart
             } else {
                 this.cart = targetCart
                 await this.saveCartToFirebase()
             }
             this.addToast('Cart updated', 'success')
        }
    },
    async removeFromCart(cartItemId) {
        const isGuest = !auth.currentUser
        let targetCart = isGuest ? getLocal('guest_cart') : this.cart
        
        const item = targetCart.find(i => i.id === cartItemId)
        const title = item?.product?.title || 'item'
        targetCart = targetCart.filter(i => i.id !== cartItemId)
        
        if (isGuest) {
            saveLocal('guest_cart', targetCart)
            this.cart = targetCart
        } else {
            this.cart = targetCart
            await this.saveCartToFirebase()
        }
        this.addToast(`Removed "${title}" from cart`, 'info')
    },
    async mergeGuestCart() {
        const guestCart = getLocal('guest_cart')
        if (!guestCart || guestCart.length === 0 || !auth.currentUser) return

        try {
            await this.fetchCart()
            for (const item of guestCart) {
                 const existing = this.cart.find(i => i.product_id === item.product_id)
                 if (existing) {
                      existing.quantity += item.quantity
                 } else {
                      this.cart.push(item)
                 }
            }
            await this.saveCartToFirebase()
            localStorage.removeItem('guest_cart')
            this.addToast('Synchronized guest shopping cart to your account!', 'success')
        } catch (error) {
            console.error('Failed to merge guest cart:', error)
        }
    },
    async processCheckout(checkoutData) {
        try {
            const userId = auth.currentUser ? auth.currentUser.uid : 'guest'
            
            // Validate stock and prices for all items before processing
            for (const item of this.cart) {
                try {
                    const productDoc = await getDoc(doc(db, "products", item.product_id))
                    if (!productDoc.exists()) {
                        throw new Error(`Product ${item.product_id} no longer exists`)
                    }
                    const currentProduct = productDoc.data()
                    
                    // Check stock availability
                    if (currentProduct.stock < item.quantity) {
                        throw new Error(`Insufficient stock for ${item.product?.title}. Only ${currentProduct.stock} available.`)
                    }
                    
                    // Verify price hasn't changed drastically (allow 5% variance)
                    const currentPrice = currentProduct.sale_price || currentProduct.price
                    const cartPrice = item.price
                    const priceVariance = Math.abs(currentPrice - cartPrice) / cartPrice
                    if (priceVariance > 0.05) {
                        throw new Error(`Price for ${item.product?.title} has changed from Rs. ${cartPrice} to Rs. ${currentPrice}. Please review your cart.`)
                    }
                } catch (e) {
                    this.addToast(e.message || 'Failed to validate cart items', 'danger')
                    throw e
                }
            }
            
            const orderData = {
                 user_id: userId,
                 ...checkoutData,
                 items: this.cart,
                 status: 'pending',
                 created_at: new Date()
            }
            await addDoc(collection(db, "orders"), orderData)
            
            // Clear cart
            this.cart = []
            if (userId === 'guest') {
                localStorage.removeItem('guest_cart')
            } else {
                await this.saveCartToFirebase()
            }
            
            this.addToast('Order placed successfully!', 'success')
            
            // Trigger Email Notification (EmailJS)
            await this.sendOrderEmail(orderData, checkoutData.contact_email)

            return { message: 'Order placed', order: orderData }
        } catch (error) {
            console.error('Checkout failed:', error)
            this.addToast('Failed to place order. Please try again.', 'danger')
            throw error;
        }
    },
    async sendOrderEmail(orderData, userEmail) {
        // NOTE: To make this work in production, create a free account at EmailJS.com
        // 1. Add your Service ID
        // 2. Add your Template ID
        // 3. Add your Public Key
        const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
        const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
        const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

        const templateParams = {
            to_email: userEmail,
            to_name: this.user?.name || 'Customer',
            order_id: Math.floor(Math.random() * 1000000), // Random ID for demo
            order_total: orderData.items.reduce((t, i) => t + (i.price * i.quantity), 0).toFixed(2),
            shipping_address: orderData.shipping_address,
            payment_method: orderData.payment_method
        }

        try {
            if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
                // Mock behavior if EmailJS is not configured
                console.log('✅ [EmailJS Mock] Order receipt email sent to:', userEmail)
                console.log('Template Params:', templateParams)
                this.addToast('Order receipt emailed to you!', 'info')
                return
            }

            // Real EmailJS call
            await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                template_params: templateParams
            })
            this.addToast('Order receipt emailed to you!', 'info')
        } catch (error) {
            console.error('Email failed to send:', error)
            // Don't show toast error for email to not disrupt checkout flow UX
        }
    }
})

// Auto fetch user profile and cart on initialization
store.fetchUser()
