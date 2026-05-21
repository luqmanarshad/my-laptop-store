<template>
    <MainLayout>
        <section class="container py-5">
            <!-- Header -->
            <div class="mb-5 d-flex align-items-center justify-content-between">
                <div>
                    <h1 class="cart-title fw-bold">Shopping Cart</h1>
                    <p class="text-muted fs-5" v-if="store.cart.length && step === 'cart'">You have {{ store.cart.length }} items in your cart.</p>
                    <p class="text-muted fs-5" v-else-if="step === 'shipping'">Complete your delivery information below.</p>
                    <p class="text-muted fs-5" v-else-if="step === 'success'">Thank you for shopping with Lapzo!</p>
                </div>
                <div v-if="step === 'shipping'">
                    <button class="btn btn-outline-secondary rounded-pill px-4" @click="step = 'cart'">
                        <i class="bi bi-arrow-left me-2"></i> Back to Cart
                    </button>
                </div>
            </div>

            <!-- Empty Cart -->
            <div v-if="store.cart.length === 0 && step !== 'success'" class="text-center py-5 empty-container rounded-4 shadow-sm p-5 bg-white">
                <div class="empty-icon mb-4"><i class="bi bi-cart3"></i></div>
                <h3 class="fw-bold mb-3 text-dark">Your cart is empty</h3>
                <p class="text-muted mb-4 max-width-md mx-auto">Fill your cart with powerful laptops for developers, designers, students, and gamers.</p>
                <router-link to="/laptops" class="btn browse-btn rounded-pill px-5 py-3">Browse Laptops</router-link>
            </div>

            <!-- Main Cart Flow -->
            <div v-else class="row g-4">
                
                <!-- STEP 1 & 2: CART DETAILS & SHIPPING FORM -->
                <template v-if="step === 'cart' || step === 'shipping'">
                    <!-- Left Column (Items list OR Shipping Form) -->
                    <div class="col-lg-8">
                        
                        <!-- Step 1: Cart Items -->
                        <div v-if="step === 'cart'" class="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white">
                            <div class="cart-header-labels d-none d-md-flex pb-3 border-bottom text-muted fw-semibold">
                                <div style="width: 50%;">Product Details</div>
                                <div style="width: 25%; text-align: center;">Quantity</div>
                                <div style="width: 25%; text-align: right;">Total Price</div>
                            </div>

                            <!-- Item Row -->
                            <transition-group name="cart-list" tag="div">
                                <div 
                                    v-for="item in store.cart" 
                                    :key="item.id" 
                                    class="cart-item-row d-flex flex-column flex-md-row align-items-center py-4 border-bottom position-relative"
                                >
                                    <!-- Product Details Column -->
                                    <div class="d-flex align-items-center mb-3 mb-md-0" style="width: 50% !important;">
                                        <div class="img-wrapper rounded-3 p-2 border bg-light d-flex align-items-center justify-content-center">
                                            <img :src="item.product?.thumbnail" class="cart-img" :alt="item.product?.title">
                                        </div>
                                        <div class="ms-4 flex-grow-1">
                                            <h5 class="fw-bold text-dark mb-1 text-truncate" style="max-width: 240px;">{{ item.product?.title }}</h5>
                                            <span class="badge bg-light text-primary border rounded-pill px-3 py-1 text-xs">{{ item.product?.brand?.name }}</span>
                                            <div class="text-muted d-md-none mt-2">${{ item.price }} each</div>
                                        </div>
                                    </div>

                                    <!-- Quantity Selector Column -->
                                    <div class="d-flex align-items-center justify-content-center mb-3 mb-md-0" style="width: 25%;">
                                        <div class="quantity-controller d-flex align-items-center border rounded-pill p-1">
                                            <button 
                                                class="qty-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center"
                                                @click="store.updateCartQuantity(item.id, item.quantity - 1)"
                                                :disabled="item.quantity <= 1"
                                            >
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <span class="qty-display fw-bold text-dark px-3">{{ item.quantity }}</span>
                                            <button 
                                                class="qty-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center"
                                                @click="store.updateCartQuantity(item.id, item.quantity + 1)"
                                            >
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Price Column -->
                                    <div class="d-flex align-items-center justify-content-md-end justify-content-center" style="width: 25%;">
                                        <div class="text-md-end text-center">
                                            <div class="fw-extrabold text-primary fs-5 mb-1">${{ (item.price * item.quantity).toFixed(2) }}</div>
                                            <small class="text-muted d-none d-md-block">${{ item.price }} each</small>
                                        </div>
                                    </div>

                                    <!-- Remove Button -->
                                    <button 
                                        class="btn-close remove-item-btn position-absolute" 
                                        @click="store.removeFromCart(item.id)"
                                        title="Remove item"
                                    ></button>
                                </div>
                            </transition-group>
                        </div>

                        <!-- Step 2: Shipping Form -->
                        <div v-else-if="step === 'shipping'" class="card border-0 shadow-sm rounded-4 p-4 p-lg-5 bg-white transition-fade">
                            <h3 class="fw-bold mb-4 text-dark"><i class="bi bi-truck text-primary me-2"></i> Shipping Details</h3>
                            <form @submit.prevent="triggerCheckout">
                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-muted">Shipping Address</label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-light border-end-0"><i class="bi bi-geo-alt"></i></span>
                                        <textarea 
                                            class="form-control bg-light border-start-0" 
                                            rows="3" 
                                            placeholder="Enter your complete home or work address for delivery" 
                                            v-model="form.shipping_address"
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div class="row mb-4">
                                    <div class="col-md-6 mb-3 mb-md-0">
                                        <label class="form-label fw-semibold text-muted">Contact Phone Number</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0"><i class="bi bi-telephone"></i></span>
                                            <input 
                                                type="tel" 
                                                class="form-control bg-light border-start-0" 
                                                placeholder="+92 300 1234567" 
                                                v-model="form.phone"
                                                required
                                            >
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold text-muted">Payment Method</label>
                                        <div class="input-group">
                                            <span class="input-group-text bg-light border-end-0"><i class="bi bi-credit-card"></i></span>
                                            <select class="form-select bg-light border-start-0" v-model="form.payment_method">
                                                <option value="COD">Cash on Delivery (COD)</option>
                                                <option value="Email">Pay via Email Invoice</option>
                                                <option value="Card" disabled>Credit/Debit Card (Coming Soon)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="form.payment_method === 'COD'" class="alert alert-info border-0 rounded-3 d-flex align-items-start p-3 transition-fade">
                                    <i class="bi bi-info-circle-fill me-3 fs-5 text-primary"></i>
                                    <div>
                                        <h6 class="fw-bold text-dark mb-1">Cash on Delivery Enabled</h6>
                                        <p class="text-muted mb-0 small">You will pay the courier in cash upon receiving your items at your doorstep.</p>
                                    </div>
                                </div>

                                <div v-else-if="form.payment_method === 'Email'" class="alert alert-primary border-0 rounded-3 d-flex align-items-start p-3 transition-fade">
                                    <i class="bi bi-envelope-fill me-3 fs-5 text-primary"></i>
                                    <div>
                                        <h6 class="fw-bold text-dark mb-1">Email Invoice Payment</h6>
                                        <p class="text-muted mb-0 small">A payment invoice with instructions will be emailed to <strong>{{ store.user?.email }}</strong>. You can pay via Bank Transfer or mobile wallets to process delivery.</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Right Column (Billing Summary) -->
                    <div class="col-lg-4">
                        <div class="card border-0 shadow rounded-4 p-4 p-lg-5 bg-white summary-card position-sticky" style="top: 24px;">
                            <h3 class="fw-bold mb-4 text-dark pb-2 border-bottom">Order Summary</h3>

                            <div class="d-flex justify-content-between mb-3 text-muted">
                                <span>Subtotal</span>
                                <span class="fw-semibold text-dark">${{ subtotal.toFixed(2) }}</span>
                            </div>

                            <div v-if="discountRate > 0" class="d-flex justify-content-between mb-3 text-success">
                                <span>Discount (30%)</span>
                                <span class="fw-semibold">-${{ discountAmount.toFixed(2) }}</span>
                            </div>

                            <div class="d-flex justify-content-between mb-3 text-muted">
                                <span>Shipping</span>
                                <span class="text-success fw-semibold">FREE</span>
                            </div>

                            <div class="d-flex justify-content-between mb-4 text-muted pb-3 border-bottom">
                                <span>Estimated Tax</span>
                                <span class="fw-semibold text-dark">$0.00</span>
                            </div>

                            <!-- Promo Code Input (Only in Cart step) -->
                            <div v-if="step === 'cart'" class="promo-box mb-4">
                                <label class="form-label text-muted small fw-semibold">Have a promo code?</label>
                                <div class="input-group">
                                    <input type="text" class="form-control promo-input px-3" placeholder="SUMMER30" v-model="promoCode">
                                    <button class="btn btn-outline-secondary promo-btn px-3" @click="applyPromo">Apply</button>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between mb-4 align-items-center">
                                <span class="fs-5 text-dark fw-bold">Total</span>
                                <strong class="fs-3 text-primary fw-extrabold">${{ total.toFixed(2) }}</strong>
                            </div>

                            <button 
                                v-if="step === 'cart'"
                                class="btn checkout-btn w-100 rounded-pill py-3 fw-bold fs-5 d-flex align-items-center justify-content-center gap-2"
                                @click="proceedToShipping"
                            >
                                <span>Proceed to Checkout</span>
                                <i class="bi bi-arrow-right"></i>
                            </button>

                            <button 
                                v-else-if="step === 'shipping'"
                                class="btn checkout-btn w-100 rounded-pill py-3 fw-bold fs-5 d-flex align-items-center justify-content-center gap-2"
                                @click="triggerCheckout"
                                :disabled="checkoutLoading"
                            >
                                <span v-if="checkoutLoading" class="spinner-border spinner-border-sm" role="status"></span>
                                <span v-else>Confirm Order (${{ total.toFixed(2) }})</span>
                                <i class="bi bi-shield-check" v-if="!checkoutLoading"></i>
                            </button>
                        </div>
                    </div>
                </template>

                <!-- STEP 3: ORDER SUCCESS SCREEN -->
                <template v-else-if="step === 'success'">
                    <div class="col-12">
                        <div class="card border-0 shadow-sm rounded-4 p-5 text-center bg-white transition-fade">
                            <div class="success-checkmark-wrapper mb-4">
                                <div class="checkmark-circle">
                                    <i class="bi bi-check-lg checkmark-icon"></i>
                                </div>
                            </div>
                            <h2 class="fw-extrabold text-dark mb-3">Order Placed Successfully!</h2>
                            <p class="text-muted fs-5 mb-5 max-width-md mx-auto">
                                Thank you for shopping with Lapzo. Your order has been registered and is being processed for shipment.
                            </p>

                            <div class="row justify-content-center mb-5">
                                <div class="col-md-6 col-lg-5">
                                    <div class="order-details-box rounded-4 p-4 text-start bg-light border">
                                        <h5 class="fw-bold mb-3 border-bottom pb-2 text-dark"><i class="bi bi-receipt me-2 text-primary"></i> Receipt Details</h5>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="text-muted">Order ID:</span>
                                            <span class="fw-bold text-dark">#LPZ-{{ placedOrder?.id || '9873' }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="text-muted">Grand Total:</span>
                                            <span class="fw-bold text-primary">${{ Number(placedOrder?.total_amount || total).toFixed(2) }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between mb-2">
                                            <span class="text-muted">Payment:</span>
                                            <span class="fw-semibold text-dark">{{ placedOrder?.payment_method === 'COD' ? 'Cash on Delivery' : 'COD' }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <span class="text-muted">Shipping to:</span>
                                            <span class="fw-semibold text-dark text-truncate ms-3" style="max-width: 200px;">{{ placedOrder?.shipping_address }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                <router-link to="/orders" class="btn btn-primary rounded-pill px-5 py-3 fw-bold">
                                    <i class="bi bi-bag-check me-2"></i> Track Orders
                                </router-link>
                                <router-link to="/laptops" class="btn btn-outline-secondary rounded-pill px-5 py-3 fw-bold">
                                    Continue Shopping
                                </router-link>
                            </div>
                        </div>
                    </div>
                </template>

            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../utils/store'
import MainLayout from '../Layouts/MainLayout.vue'

const router = useRouter()

const step = ref('cart') // 'cart', 'shipping', 'success'
const promoCode = ref('')
const discountRate = ref(0) // 0.3 for 30%
const checkoutLoading = ref(false)

// Form fields
const form = ref({
    shipping_address: '',
    phone: '',
    payment_method: 'COD'
})

// Placed order data for success step
const placedOrder = ref(null)

const subtotal = computed(() => {
    return store.cart.reduce((t, i) => t + i.price * i.quantity, 0)
})

const discountAmount = computed(() => {
    return subtotal.value * discountRate.value
})

const total = computed(() => {
    return subtotal.value - discountAmount.value
})

const applyPromo = () => {
    if (promoCode.value.toUpperCase() === 'SUMMER30') {
        discountRate.value = 0.30
        store.addToast('Promo code applied! 30% discount deducted.', 'success')
    } else if (promoCode.value.trim() === '') {
        store.addToast('Please enter a promo code first.', 'warning')
    } else {
        store.addToast('Invalid promo code. Try "SUMMER30".', 'warning')
    }
}

const proceedToShipping = () => {
    if (!store.user) {
        store.addToast('Please login first to proceed with checkout.', 'warning')
        router.push('/login')
        return
    }
    step.value = 'shipping'
}

const triggerCheckout = async () => {
    if (!form.value.shipping_address.trim() || !form.value.phone.trim()) {
        store.addToast('Please enter your shipping address and contact number.', 'warning')
        return
    }

    checkoutLoading.value = true
    try {
        const orderData = {
            shipping_address: form.value.shipping_address,
            phone: form.value.phone,
            payment_method: form.value.payment_method,
        }
        const response = await store.processCheckout(orderData)
        placedOrder.value = response.order
        step.value = 'success'
    } catch (err) {
        // Handled by store.js toast notifications
    } finally {
        checkoutLoading.value = false
    }
}
</script>

<style scoped>
.cart-title {
    font-size: 46px;
    background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.empty-container {
    border: 1px solid rgba(226, 232, 240, 0.8);
}

.empty-icon {
    font-size: 70px;
    color: #cbd5e1;
}

.browse-btn {
    background: #2563eb;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
}

.browse-btn:hover {
    background: #1d4ed8;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

.img-wrapper {
    width: 90px;
    height: 70px;
    flex-shrink: 0;
}

.cart-img {
    max-height: 55px;
    max-width: 100%;
    object-fit: contain;
}

.quantity-controller {
    background: #f8fafc;
}

.qty-btn {
    width: 32px;
    height: 32px;
    padding: 0;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
    background: #edf2f7;
    transform: scale(1.05);
}

.qty-display {
    min-width: 30px;
    text-align: center;
    font-size: 15px;
}

.remove-item-btn {
    top: 15px;
    right: 15px;
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

.remove-item-btn:hover {
    opacity: 1;
}

.promo-input {
    border-radius: 50px 0 0 50px !important;
    border-color: #e2e8f0;
}

.promo-btn {
    border-radius: 0 50px 50px 0 !important;
}

.checkout-btn {
    background: #2563eb;
    color: white;
    border: none;
    transition: all 0.3s ease;
}

.checkout-btn:hover:not(:disabled) {
    background: #1d4ed8;
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
}

/* Success Checkmark CSS Animation */
.success-checkmark-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.checkmark-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #def7ec;
    color: #03543f;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.checkmark-icon {
    font-size: 40px;
    animation: pulseIcon 1.5s infinite ease-in-out;
}

/* Vue Transitions */
.cart-list-enter-active,
.cart-list-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-list-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.cart-list-leave-to {
    opacity: 0;
    transform: scale(0.9);
}

.transition-fade {
    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
}

@keyframes pulseIcon {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .cart-title {
        font-size: 34px;
    }
    .img-wrapper {
        width: 120px;
        height: 90px;
    }
    .cart-img {
        max-height: 75px;
    }
}
</style>