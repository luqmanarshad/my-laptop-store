<template>
    <MainLayout>
        <section class="container py-4 py-lg-5">
            <!-- Header -->
            <div class="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                    <h1 class="cart-title fw-bold mb-1">Shopping Cart</h1>
                    <p class="text-muted fs-6 mb-0" v-if="store.cart.length && step === 'cart'">You have {{ store.cart.length }} items in your cart.</p>
                    <p class="text-muted fs-6 mb-0" v-else-if="step === 'shipping'">Complete your delivery information below.</p>
                    <p class="text-muted fs-6 mb-0" v-else-if="step === 'success'">Thank you for shopping with Lapzo!</p>
                </div>
                <div v-if="step === 'shipping'">
                    <button class="btn btn-outline-secondary rounded-pill px-3 px-md-4" @click="step = 'cart'">
                        <i class="bi bi-arrow-left me-1"></i> <span class="d-none d-sm-inline">Back to Cart</span>
                    </button>
                </div>
            </div>

            <!-- Empty Cart -->
            <div v-if="store.cart.length === 0 && step !== 'success'" class="text-center py-5 empty-container rounded-4 shadow-sm p-4 p-md-5 bg-white fade-in-up">
                <div class="empty-icon mb-4"><i class="bi bi-cart-x"></i></div>
                <h3 class="fw-bold mb-3 text-dark">Your cart is empty</h3>
                <p class="text-muted mb-4 max-width-md mx-auto">Fill your cart with powerful laptops for developers, designers, students, and gamers.</p>
                <router-link to="/laptops" class="btn btn-primary rounded-pill px-5 py-3 shadow-sm hover-lift">Browse Laptops</router-link>
            </div>

            <!-- Main Cart Flow -->
            <div v-else class="row g-4">
                
                <!-- STEP 1: CART ITEMS -->
                <template v-if="step === 'cart'">
                    <div class="col-lg-8">
                        <!-- Step 1: Cart Items -->
                        <div v-if="step === 'cart'" class="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white fade-in-up">
                            <div class="cart-header-labels d-none d-md-flex pb-3 border-bottom text-muted fw-semibold small text-uppercase tracking-wider">
                                <div style="width: 50%;">Product Details</div>
                                <div style="width: 25%; text-align: center;">Quantity</div>
                                <div style="width: 25%; text-align: right;">Total Price</div>
                            </div>

                            <!-- Item Row -->
                            <transition-group name="cart-list" tag="div">
                                <div 
                                    v-for="item in store.cart" 
                                    :key="item.id" 
                                    class="cart-item-row d-flex flex-column flex-md-row align-items-md-center py-4 border-bottom position-relative"
                                >
                                    <!-- Remove Button (Absolute on mobile, relative flow on desktop) -->
                                    <button 
                                        class="btn btn-sm btn-outline-danger remove-item-btn-mobile d-md-none" 
                                        @click="store.removeFromCart(item.id)"
                                        aria-label="Remove item"
                                    >
                                        <i class="bi bi-trash"></i>
                                    </button>

                                    <!-- Product Details Column -->
                                    <div class="d-flex align-items-start align-items-md-center mb-3 mb-md-0" style="width: 100%; max-width: 100%; @media(min-width: 768px) { width: 50% !important; max-width: 50%; }">
                                        <div class="img-wrapper rounded-3 p-2 border bg-light d-flex align-items-center justify-content-center">
                                            <img :src="item.product?.thumbnail" class="cart-img" :alt="item.product?.title">
                                        </div>
                                        <div class="ms-3 ms-md-4 pe-4 pe-md-0 flex-grow-1">
                                            <h6 class="fw-bold text-dark mb-1 d-block text-truncate-2">{{ item.product?.title }}</h6>
                                            <span class="badge bg-light text-secondary border rounded-pill px-2 py-1" style="font-size: 0.7rem;">{{ item.product?.brand?.name }}</span>
                                            
                                            <!-- Mobile Price & Qty Controls (stacked) -->
                                            <div class="d-md-none mt-3 d-flex align-items-center justify-content-between">
                                                <div class="fw-bold text-primary fs-5">${{ (item.price * item.quantity).toFixed(2) }}</div>
                                                
                                                <div class="quantity-controller d-flex align-items-center border rounded-pill p-1 bg-light">
                                                    <button class="qty-btn btn border-0 rounded-circle" @click="store.updateCartQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1"><i class="bi bi-dash"></i></button>
                                                    <span class="qty-display fw-bold text-dark px-2">{{ item.quantity }}</span>
                                                    <button class="qty-btn btn border-0 rounded-circle" @click="store.updateCartQuantity(item.id, item.quantity + 1)"><i class="bi bi-plus"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Desktop Quantity Column -->
                                    <div class="d-none d-md-flex align-items-center justify-content-center" style="width: 25%;">
                                        <div class="quantity-controller d-flex align-items-center border rounded-pill p-1 bg-light shadow-sm">
                                            <button 
                                                class="qty-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center bg-white"
                                                @click="store.updateCartQuantity(item.id, item.quantity - 1)"
                                                :disabled="item.quantity <= 1"
                                            >
                                                <i class="bi bi-dash"></i>
                                            </button>
                                            <span class="qty-display fw-bold text-dark px-3">{{ item.quantity }}</span>
                                            <button 
                                                class="qty-btn btn border-0 rounded-circle d-flex align-items-center justify-content-center bg-white"
                                                @click="store.updateCartQuantity(item.id, item.quantity + 1)"
                                            >
                                                <i class="bi bi-plus"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Desktop Price Column -->
                                    <div class="d-none d-md-flex align-items-center justify-content-end position-relative" style="width: 25%;">
                                        <div class="text-end pe-4">
                                            <div class="fw-extrabold text-primary fs-5 mb-1">${{ (item.price * item.quantity).toFixed(2) }}</div>
                                            <small class="text-muted">${{ item.price }} each</small>
                                        </div>
                                        <button 
                                            class="btn-close remove-item-btn-desktop position-absolute end-0" 
                                            @click="store.removeFromCart(item.id)"
                                            title="Remove item"
                                        ></button>
                                    </div>
                                </div>
                            </transition-group>
                            
                            <div class="text-end mt-4 d-none d-md-block">
                                <router-link to="/laptops" class="btn btn-outline-secondary rounded-pill px-4">
                                    <i class="bi bi-arrow-left me-1"></i> Continue Shopping
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Step: Order Summary Sidebar -->
                    <div class="col-lg-4">
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white summary-card position-sticky fade-in-up" style="top: 100px;">
                            <h5 class="fw-bold text-dark text-uppercase mb-4 pb-2 border-bottom" style="font-size: 0.95rem; letter-spacing: 0.5px;">Order Summary</h5>
                            <div class="mb-4 pb-3 border-bottom" style="max-height: 250px; overflow-y: auto;">
                                <div v-for="item in store.cart" :key="item.id" class="d-flex justify-content-between mb-2">
                                    <div class="pe-2">
                                        <div class="text-dark small fw-medium">{{ item.product?.title?.substring(0, 35) }}...</div>
                                        <div class="text-muted" style="font-size:0.75rem;">Qty: {{ item.quantity }}</div>
                                    </div>
                                    <div class="fw-bold text-nowrap small">Rs. {{ (item.price * item.quantity).toFixed(0) }}</div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between mb-2 text-muted">
                                <span>Sub Total</span><span class="fw-semibold text-dark">Rs. {{ subtotal.toFixed(0) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-4 pb-3 text-muted border-bottom">
                                <span>Shipping</span><span class="fw-semibold text-dark">Rs. 300</span>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                                <span class="fw-bold text-dark">Total</span>
                                <strong class="fs-5 text-dark">Rs. {{ (total + 300).toFixed(0) }}</strong>
                            </div>
                            <button class="btn w-100 py-3 fw-bold rounded-3 hover-lift" @click="proceedToShipping" style="background-color:#1e1b4b;color:white;border:none;">
                                Checkout Securely
                            </button>
                        </div>
                    </div>
                </template>

                <!-- STEP 2: CHECKOUT FORM (3 columns) -->
                <template v-else-if="step === 'shipping'">

                    <!-- Column 1: Contact + Shipping -->
                    <div class="col-lg-4">
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white fade-in-up">
                            <h5 class="fw-bold text-uppercase mb-4 pb-2 border-bottom" style="font-size:0.85rem;letter-spacing:0.5px;">Contact Information</h5>
                            <div class="mb-3">
                                <input type="email" class="form-control bg-light border-0 custom-focus" placeholder="Email Address" v-model="form.contact_email">
                            </div>
                            <div class="mb-4">
                                <input type="tel" class="form-control bg-light border-0 custom-focus" placeholder="Phone Number" v-model="form.contact_phone">
                            </div>

                            <h5 class="fw-bold text-uppercase mb-4 pb-2 border-bottom" style="font-size:0.85rem;letter-spacing:0.5px;">Shipping Address</h5>
                            <div class="mb-3">
                                <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Full Name" v-model="form.shipping_name">
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Address" v-model="form.shipping_address">
                            </div>
                            <div class="mb-3">
                                <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Address Line 2 (Optional)" v-model="form.shipping_address_line2">
                            </div>
                            <div class="mb-3">
                                <select class="form-select bg-light border-0 custom-focus" v-model="form.shipping_country">
                                    <option value="Pakistan">Pakistan</option>
                                </select>
                            </div>
                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <select class="form-select bg-light border-0 custom-focus" v-model="form.shipping_state">
                                        <option value="" disabled>Province</option>
                                        <option>Punjab</option><option>Sindh</option>
                                        <option>KPK</option><option>Balochistan</option>
                                        <option>Islamabad</option>
                                    </select>
                                </div>
                                <div class="col-6">
                                    <select class="form-select bg-light border-0 custom-focus" v-model="form.shipping_city">
                                        <option value="" disabled>City</option>
                                        <option>Lahore</option><option>Karachi</option>
                                        <option>Islamabad</option><option>Rawalpindi</option>
                                        <option>Faisalabad</option><option>Multan</option>
                                    </select>
                                </div>
                            </div>
                            <div class="mb-4">
                                <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Zip/Postal Code" v-model="form.shipping_zip">
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="billingSame" v-model="form.billing_same">
                                <label class="form-check-label text-muted small" for="billingSame">Billing address is same as above</label>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Payment Method + Verification -->
                    <div class="col-lg-4">
                        <div class="d-flex flex-column gap-4">
                            <!-- Payment Method -->
                            <div class="card border-0 shadow-sm rounded-4 p-4 bg-white fade-in-up">
                                <h5 class="fw-bold text-uppercase mb-4 pb-2 border-bottom" style="font-size:0.85rem;letter-spacing:0.5px;">Payment Method</h5>
                                <div class="d-flex flex-column gap-3">
                                    <div class="form-check d-flex align-items-center gap-2">
                                        <input class="form-check-input" type="radio" id="payCOD" value="Cash on Delivery" v-model="form.payment_method">
                                        <label class="form-check-label text-dark" for="payCOD">Cash on Delivery</label>
                                    </div>
                                    <div class="form-check d-flex align-items-center gap-2">
                                        <input class="form-check-input" type="radio" id="payJazz" value="Jazz Cash" v-model="form.payment_method">
                                        <label class="form-check-label text-dark" for="payJazz">Jazz Cash</label>
                                    </div>
                                    <div class="form-check d-flex align-items-center gap-2">
                                        <input class="form-check-input" type="radio" id="payEasy" value="Easy Paisa" v-model="form.payment_method">
                                        <label class="form-check-label text-dark" for="payEasy">Easy Paisa</label>
                                    </div>
                                    <div class="form-check d-flex align-items-center gap-2">
                                        <input class="form-check-input" type="radio" id="payBank" value="Bank Alfalah" v-model="form.payment_method">
                                        <label class="form-check-label text-dark" for="payBank">Bank Alfalah</label>
                                    </div>
                                </div>
                                <!-- Account Details -->
                                <div v-if="form.payment_method !== 'Cash on Delivery'" class="mt-4 p-3 rounded-3 bg-light border" style="font-size:0.85rem;">
                                    <div v-if="form.payment_method === 'Bank Alfalah'">
                                        <div class="mb-1"><strong>Account title:</strong> Luqman Arshad</div>
                                        <div class="mb-1"><strong>Account number:</strong> 02059585389</div>
                                        <div><strong>IBAN:</strong> PK26ALFH020500105389</div>
                                    </div>
                                    <div v-else-if="form.payment_method === 'Jazz Cash'">
                                        <div class="mb-1"><strong>Account title:</strong> Luqman Arshad</div>
                                        <div><strong>Mobile:</strong> 0305-1234567</div>
                                    </div>
                                    <div v-else-if="form.payment_method === 'Easy Paisa'">
                                        <div class="mb-1"><strong>Account title:</strong> Luqman Arshad</div>
                                        <div><strong>Mobile:</strong> 0345-1234567</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Verification -->
                            <div v-if="form.payment_method !== 'Cash on Delivery'" class="card border-0 shadow-sm rounded-4 p-4 bg-white fade-in-up">
                                <h5 class="fw-bold text-uppercase mb-4 pb-2 border-bottom" style="font-size:0.85rem;letter-spacing:0.5px;">Payment Verification</h5>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-semibold">Sender's Full Name *</label>
                                    <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="e.g. Naqqash Tarpal" v-model="form.payment_sender_name">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-semibold">Sender's Payment Method *</label>
                                    <select class="form-select fw-semibold border-0 custom-focus" style="background:#dbeafe;color:#1d4ed8;" v-model="form.payment_sender_method">
                                        <option value="" disabled>Select Method</option>
                                        <option>Jazz Cash</option>
                                        <option>Easy Paisa</option>
                                        <option>Bank Transfer</option>
                                    </select>
                                </div>
                                <div class="row g-2">
                                    <div class="col-5">
                                        <label class="form-label text-muted small fw-semibold">Amount (Rs.) *</label>
                                        <input type="number" class="form-control bg-light border-0 custom-focus" :placeholder="(total+300).toFixed(0)" v-model="form.payment_amount">
                                    </div>
                                    <div class="col-7">
                                        <label class="form-label text-muted small fw-semibold">Transaction ID (TID) *</label>
                                        <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="e.g. 12345678901" v-model="form.payment_tid">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Column 3: Order Summary + Confirm -->
                    <div class="col-lg-4">
                        <div class="card border-0 shadow-sm rounded-4 p-4 bg-white summary-card position-sticky fade-in-up" style="top:100px;">
                            <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                                <h5 class="fw-bold text-uppercase mb-0" style="font-size:0.85rem;letter-spacing:0.5px;">Order Summary</h5>
                                <button class="btn btn-link text-decoration-none text-muted small p-0" @click="step = 'cart'">Edit Quantity</button>
                            </div>
                            <!-- Items -->
                            <div class="mb-4 pb-3 border-bottom" style="max-height:220px;overflow-y:auto;">
                                <div v-for="item in store.cart" :key="item.id" class="mb-3">
                                    <div class="small text-dark fw-medium" style="line-height:1.4;">{{ item.product?.title }}</div>
                                    <div class="d-flex justify-content-between mt-1">
                                        <span class="text-primary" style="font-size:0.8rem;">Rs. {{ item.price }} x {{ item.quantity }}</span>
                                        <span class="fw-bold small">Rs. {{ (item.price * item.quantity).toFixed(0) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between mb-2 text-muted small">
                                <span>Sub Total</span><span class="fw-semibold text-dark">Rs. {{ subtotal.toFixed(0) }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 pb-3 text-muted small border-bottom">
                                <span>Shipping Charges</span><span class="fw-semibold text-dark">Rs. 300</span>
                            </div>
                            <div class="d-flex justify-content-between mb-4">
                                <span class="fw-bold text-dark">Total</span>
                                <strong class="fs-5">Rs. {{ (total + 300).toFixed(0) }}</strong>
                            </div>
                            <button
                                class="btn w-100 py-3 fw-bold rounded-3 hover-lift"
                                @click="triggerCheckout"
                                :disabled="checkoutLoading"
                                style="background-color:#1e1b4b;color:white;border:none;"
                            >
                                <span v-if="checkoutLoading" class="spinner-border spinner-border-sm me-2"></span>
                                <span>{{ checkoutLoading ? 'Processing...' : 'Confirm Now' }}</span>
                            </button>
                        </div>
                    </div>
                </template>





                <!-- STEP 3: ORDER SUCCESS SCREEN -->
                <template v-else-if="step === 'success'">
                    <div class="col-12 fade-in-up">
                        <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 text-center bg-white">
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
                                <div class="col-md-8 col-lg-6">
                                    <div class="order-details-box rounded-4 p-4 text-start bg-light border">
                                        <h5 class="fw-bold mb-3 border-bottom pb-3 text-dark"><i class="bi bi-receipt me-2 text-primary"></i> Receipt Details</h5>
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
                                            <span class="fw-semibold text-dark">{{ placedOrder?.payment_method === 'COD' ? 'Cash on Delivery' : 'Email Invoice' }}</span>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <span class="text-muted">Shipping to:</span>
                                            <span class="fw-semibold text-dark text-truncate ms-3 text-end" style="max-width: 200px;">{{ placedOrder?.shipping_address }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                <router-link to="/orders" class="btn btn-primary rounded-pill px-4 py-3 fw-bold shadow-sm hover-lift">
                                    <i class="bi bi-bag-check me-2"></i> Track My Order
                                </router-link>
                                <router-link to="/laptops" class="btn btn-outline-secondary rounded-pill px-4 py-3 fw-bold">
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
    contact_email: store.user?.email || '',
    contact_phone: '',
    shipping_name: store.user?.name || '',
    shipping_address: '',
    shipping_address_line2: '',
    shipping_country: 'Pakistan',
    shipping_state: '',
    shipping_city: '',
    shipping_zip: '',
    billing_same: true,
    payment_method: 'Cash on Delivery',
    payment_sender_name: '',
    payment_sender_method: '',
    payment_amount: '',
    payment_tid: ''
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
    step.value = 'shipping'
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const triggerCheckout = async () => {
    if (!form.value.contact_email.trim() || !form.value.shipping_address.trim() || !form.value.contact_phone.trim()) {
        store.addToast('Please fill in all required contact and shipping details.', 'warning')
        return
    }
    
    if (form.value.payment_method !== 'Cash on Delivery') {
        if (!form.value.payment_sender_name || !form.value.payment_sender_method || !form.value.payment_amount || !form.value.payment_tid) {
            store.addToast('Please fill in all Payment Verification fields.', 'warning')
            return
        }
    }

    checkoutLoading.value = true
    try {
        const orderData = { ...form.value }
        const response = await store.processCheckout(orderData)
        placedOrder.value = response.order
        step.value = 'success'
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
        // Handled by store.js toast notifications
    } finally {
        checkoutLoading.value = false
    }
}
</script>

<style scoped>
.cart-title {
    font-size: 2.5rem;
    color: var(--dark);
    letter-spacing: -1px;
}

.empty-container {
    border: 1px dashed rgba(226, 232, 240, 0.8);
}

.empty-icon {
    font-size: 80px;
    color: #e2e8f0;
}

.img-wrapper {
    width: 90px;
    height: 90px;
    flex-shrink: 0;
}

.cart-img {
    max-height: 70px;
    max-width: 100%;
    object-fit: contain;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 3em;
    line-height: 1.5;
}

.tracking-wider {
    letter-spacing: 0.05em;
}

.custom-radio .form-check-input {
    width: 1.25em;
    height: 1.25em;
    cursor: pointer;
}

.custom-radio .form-check-input:checked {
    background-color: var(--primary);
    border-color: var(--primary);
}

.custom-checkbox {
    width: 1.1em;
    height: 1.1em;
    cursor: pointer;
}

.quantity-controller {
    background: white;
}

.qty-btn {
    width: 28px;
    height: 28px;
    padding: 0;
    transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
    background: #f1f5f9 !important;
    color: var(--primary);
}

.qty-display {
    min-width: 24px;
    text-align: center;
    font-size: 14px;
}

.remove-item-btn-mobile {
    position: absolute;
    top: 10px;
    right: 0;
    border-radius: 8px;
    z-index: 2;
}

.remove-item-btn-desktop {
    opacity: 0.4;
    transition: var(--transition);
}

.remove-item-btn-desktop:hover {
    opacity: 1;
    color: var(--danger);
}

.custom-focus:focus {
    box-shadow: 0 0 0 3px var(--primary-glow);
    border-color: var(--primary);
    background-color: white !important;
}

.promo-input {
    border-radius: 12px 0 0 12px !important;
    border-color: #e2e8f0;
}

.promo-btn {
    border-radius: 0 12px 12px 0 !important;
}

.hover-lift {
    transition: var(--transition);
}

.hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25) !important;
}

/* Success Checkmark CSS Animation */
.success-checkmark-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.checkmark-circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #dcfce7;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    box-shadow: 0 0 0 10px rgba(22, 163, 74, 0.1);
}

.checkmark-icon {
    font-size: 45px;
    animation: pulseIcon 2s infinite ease-in-out;
}

/* Vue Transitions */
.cart-list-enter-active,
.cart-list-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-list-enter-from {
    opacity: 0;
    transform: translateX(-20px);
}

.cart-list-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

@keyframes scaleUp {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

@keyframes pulseIcon {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

@media (max-width: 767px) {
    .cart-title {
        font-size: 2rem;
    }
    .img-wrapper {
        width: 80px;
        height: 80px;
    }
    .cart-img {
        max-height: 65px;
    }
    .summary-card {
        margin-top: 1rem;
    }
    .remove-item-btn-mobile {
        top: 1rem;
    }
}
</style>