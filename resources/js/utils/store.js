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
                this.user = { id: authUser.uid, name: authUser.displayName || 'User', email: authUser.email }
                
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
            if (!auth.currentUser) throw new Error("Must be logged in to checkout")
            
            const orderData = {
                 user_id: auth.currentUser.uid,
                 ...checkoutData,
                 items: this.cart,
                 status: 'pending',
                 created_at: new Date()
            }
            await addDoc(collection(db, "orders"), orderData)
            
            this.cart = []
            await this.saveCartToFirebase()
            
            this.addToast('Order placed successfully!', 'success')
            return { message: 'Order placed' }
        } catch (error) {
            console.error('Checkout failed:', error)
            this.addToast('Failed to place order. Please try again.', 'danger')
            throw error;
        }
    }
})

// Auto fetch user profile and cart on initialization
store.fetchUser()
