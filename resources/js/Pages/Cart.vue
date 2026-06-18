<template>
    <MainLayout>
        <section class="container py-4 py-lg-5">
            <!-- Notes: Cart.vue rebuilt to fix Vite/Vue SFC parse errors. -->
            <!-- Header -->
            <div class="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                    <h1 class="cart-title fw-bold mb-1">Shopping Cart</h1>
                    <p class="text-muted fs-6 mb-0" v-if="store.cart.length && step === 'cart'">
                        You have {{ store.cart.length }} items in your cart.
                    </p>
                    <p class="text-muted fs-6 mb-0" v-else-if="step === 'shipping'">
                        Complete your delivery information below.
                    </p>
                    <p class="text-muted fs-6 mb-0" v-else-if="step === 'success'">
                        Thank you for shopping with Lapzo!
                    </p>
                </div>

                <div v-if="step === 'shipping'">
                    <button class="btn btn-outline-secondary rounded-pill px-3 px-md-4" @click="step = 'cart'">
                        <i class="bi bi-arrow-left me-1"></i> <span class="d-none d-sm-inline">Back to Cart</span>
                    </button>
                </div>
            </div>

            <!-- Empty Cart -->
            <div
                v-if="store.cart.length === 0 && step !== 'success'"
                class="text-center py-5 empty-container rounded-4 shadow-sm p-4 p-md-5 bg-white fade-in-up"
            >
                <div class="empty-icon mb-4"><i class="bi bi-cart-x"></i></div>
                <h3 class="fw-bold mb-3 text-dark">Your cart is empty</h3>
                <p class="text-muted mb-4 max-width-md mx-auto">
                    Fill your cart with powerful laptops for developers, designers, students, and gamers.
                </p>
                <router-link to="/laptops" class="btn btn-primary rounded-pill px-5 py-3 shadow-sm hover-lift">
                    Browse Laptops
                </router-link>
            </div>

            <!-- STEP 1: CART ITEMS -->
            <div v-else-if="step === 'cart'" class="row g-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white fade-in-up">
                        <div class="d-none d-md-flex pb-3 border-bottom text-muted fw-semibold small text-uppercase tracking-wider">
                            <div style="width: 50%">Product Details</div>
                            <div style="width: 25%; text-align: center">Quantity</div>
                            <div style="width: 25%; text-align: right">Total Price</div>
                        </div>

                        <transition-group name="cart-list" tag="div">
                            <div
                                v-for="item in store.cart"
                                :key="item.id"
                                class="cart-item-row d-flex flex-column flex-md-row align-items-md-center py-4 border-bottom position-relative"
                            >
                                <!-- Remove (mobile) -->
                                <button
                                    class="btn btn-sm btn-outline-danger remove-item-btn-mobile d-md-none"
                                    @click="store.removeFromCart(item.id)"
                                    aria-label="Remove item"
                                >
                                    <i class="bi bi-trash"></i>
                                </button>

                                <!-- Product -->
                                <div class="d-flex align-items-start align-items-md-center mb-3 mb-md-0" style="width: 100%; max-width: 100%;">
                                    <div class="img-wrapper rounded-3 p-2 border bg-light d-flex align-items-center justify-content-center">
                                        <img :src="item.product?.thumbnail" class="cart-img" :alt="item.product?.title" />
                                    </div>
                                    <div class="ms-3 ms-md-4 pe-4 pe-md-0 flex-grow-1">
                                        <h6 class="fw-bold text-dark mb-1 d-block text-truncate-2">{{ item.product?.title }}</h6>
                                        <span class="badge bg-light text-secondary border rounded-pill px-2 py-1" style="font-size: 0.7rem;">
                                            {{ item.product?.brand?.name || 'N/A' }}
                                        </span>

                                        <!-- Mobile controls -->
                                        <div class="d-md-none mt-3 d-flex align-items-center justify-content-between">
                                            <div class="fw-bold text-primary fs-5">
                                                Rs. {{ formatCurrency(item.price * item.quantity, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
                                            </div>

                                            <div class="quantity-controller d-flex align-items-center border rounded-pill p-1 bg-light">
                                                <button
                                                    class="qty-btn btn border-0 rounded-circle"
                                                    @click="store.updateCartQuantity(item.id, item.quantity - 1)"
                                                    :disabled="item.quantity <= 1"
                                                >
                                                    <i class="bi bi-dash"></i>
                                                </button>
                                                <span class="qty-display fw-bold text-dark px-2">{{ item.quantity }}</span>
                                                <button
                                                    class="qty-btn btn border-0 rounded-circle"
                                                    @click="store.updateCartQuantity(item.id, item.quantity + 1)"
                                                >
                                                    <i class="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Desktop qty -->
                                <div class="d-none d-md-flex align-items-center justify-content-center" style="width: 25%">
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

                                <!-- Desktop total -->
                                <div class="d-none d-md-flex align-items-center justify-content-end position-relative" style="width: 25%">
                                    <div class="text-end pe-4">
                                        <div class="fw-extrabold text-primary fs-5 mb-1">
                                            Rs. {{ formatCurrency(item.price * item.quantity, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
                                        </div>
                                        <small class="text-muted">
                                            Rs. {{ formatCurrency(item.price, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }} each
                                        </small>
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

                <!-- Order Summary -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white summary-card position-sticky fade-in-up" style="top: 100px;">
                        <h5 class="fw-bold text-dark text-uppercase mb-4 pb-2 border-bottom" style="font-size: 0.95rem; letter-spacing: 0.5px;">Order Summary</h5>

                        <div class="mb-4 pb-3 border-bottom" style="max-height: 250px; overflow-y: auto;">
                            <div v-for="item in store.cart" :key="item.id" class="d-flex justify-content-between mb-2">
                                <div class="pe-2">
                                    <div class="text-dark small fw-medium">{{ item.product?.title?.substring(0, 35) }}...</div>
                                    <div class="text-muted" style="font-size: 0.75rem;">Qty: {{ item.quantity }}</div>
                                </div>
                                <div class="fw-bold text-nowrap small">
                                    Rs. {{ formatCurrency(item.price * item.quantity, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between mb-2 text-muted">
                            <span>Sub Total</span>
                            <span class="fw-semibold text-dark">Rs. {{ formatCurrency(subtotal, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                        </div>

                        <div class="d-flex justify-content-between mb-2 pb-3 text-muted border-bottom">
                            <span>Shipping</span>
                            <span class="fw-semibold text-dark">Rs. 300</span>
                        </div>

                        <div class="d-flex justify-content-between mb-4">
                            <span class="fw-bold text-dark">Total</span>
                            <strong class="fs-5 text-dark">Rs. {{ formatCurrency(total + 300, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</strong>
                        </div>

                        <button
                            class="btn w-100 py-3 fw-bold rounded-3 hover-lift"
                            @click="proceedToShipping"
                            style="background-color:#1e1b4b;color:white;border:none;"
                            :disabled="store.cart.length === 0"
                        >
                            Checkout Securely
                        </button>
                    </div>
                </div>
            </div>

            <!-- STEP 2: SHIPPING/CHECKOUT FORM -->
            <div v-else-if="step === 'shipping'" class="row g-4">
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white fade-in-up">
                        <h5 class="fw-bold text-uppercase mb-4 pb-2 border-bottom" style="font-size:0.85rem;letter-spacing:0.5px;">Contact Information</h5>

                        <div class="mb-3">
                            <input type="email" class="form-control bg-light border-0 custom-focus" placeholder="Email Address" v-model="form.contact_email" />
                        </div>
                        <div class="mb-4">
                            <input type="tel" class="form-control bg-light border-0 custom-focus" placeholder="Phone Number" v-model="form.contact_phone" />
                        </div>

                        <h5 class="fw-bold text-uppercase mb-4 pb-2 border-bottom" style="font-size:0.85rem;letter-spacing:0.5px;">Shipping Address</h5>

                        <div class="mb-3">
                            <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Full Name" v-model="form.shipping_name" />
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Address" v-model="form.shipping_address" />
                        </div>
                        <div class="mb-3">
                            <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Address Line 2 (Optional)" v-model="form.shipping_address_line2" />
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
                                    <option>Punjab</option>
                                    <option>Sindh</option>
                                    <option>KPK</option>
                                    <option>Balochistan</option>
                                    <option>Islamabad</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <select class="form-select bg-light border-0 custom-focus" v-model="form.shipping_city">
                                    <option value="" disabled>City</option>
                                    <option>Lahore</option>
                                    <option>Karachi</option>
                                    <option>Islamabad</option>
                                    <option>Rawalpindi</option>
                                    <option>Faisalabad</option>
                                    <option>Multan</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-4">
                            <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="Zip/Postal Code" v-model="form.shipping_zip" />
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="billingSame" v-model="form.billing_same" />
                            <label class="form-check-label text-muted small" for="billingSame">Billing address is same as above</label>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 p-4 bg-white fade-in-up">
                        <h5 class="fw-bold text-uppercase mb-4 pb-2 border-bottom" style="font-size:0.85rem;letter-spacing:0.5px;">Payment Method</h5>

                        <div class="d-flex flex-column gap-3">
                            <div class="form-check d-flex align-items-center gap-2">
                                <input class="form-check-input" type="radio" id="payCOD" value="Cash on Delivery" v-model="form.payment_method" />
                                <label class="form-check-label text-dark" for="payCOD">Cash on Delivery</label>
                            </div>

                            <div class="form-check d-flex align-items-center gap-2">
                                <input class="form-check-input" type="radio" id="payJazz" value="Jazz Cash" v-model="form.payment_method" />
                                <label class="form-check-label text-dark" for="payJazz">Jazz Cash</label>
                            </div>

                            <div class="form-check d-flex align-items-center gap-2">
                                <input class="form-check-input" type="radio" id="payEasy" value="Easy Paisa" v-model="form.payment_method" />
                                <label class="form-check-label text-dark" for="payEasy">Easy Paisa</label>
                            </div>

                            <div class="form-check d-flex align-items-center gap-2">
                                <input class="form-check-input" type="radio" id="payBank" value="UBL" v-model="form.payment_method" />
                                <label class="form-check-label text-dark" for="payBank">UBL Bank</label>
                            </div>
                        </div>

                            <div v-if="form.payment_method !== 'Cash on Delivery'" class="mt-4 p-3 rounded-3 bg-light border" style="font-size:0.85rem;">
                                <!-- Payment Verification -->
                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-semibold">Sender's Full Name *</label>
                                    <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="e.g. Ali Khan" v-model="form.payment_sender_name" />
                                </div>

                                <div class="mb-3">
                                    <label class="form-label text-muted small fw-semibold">Sender's Payment Method *</label>
                                    <select class="form-select border-0 custom-focus" style="background:#dbeafe;color:#1d4ed8;" v-model="form.payment_sender_method">
                                        <option value="" disabled>Select Method</option>
                                        <option value="Jazz Cash">Jazz Cash</option>
                                        <option value="Easy Paisa">Easy Paisa</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>

                                <div v-if="form.payment_sender_method === 'Jazz Cash' || form.payment_sender_method === 'Easy Paisa'" class="mb-3 p-3 rounded-3" :style="form.payment_sender_method === 'Jazz Cash' ? 'background:#ecfdf5;border-color:#6ee7b7 !important;' : 'background:#eff6ff;border-color:#93c5fd !important;'">
                                    <label class="form-label text-muted small fw-bold mb-1" :style="form.payment_sender_method === 'Jazz Cash' ? 'color: #15803d;' : 'color:#1d4ed8'">
                                        <i class="bi bi-phone-fill me-1"></i>
                                        {{ form.payment_sender_method === 'Jazz Cash' ? 'Jazz Cash Sender Number' : 'Easy Paisa Sender Number' }} *
                                    </label>
                                    <input type="tel" class="form-control border-0 custom-focus" style="background:#d1fae5;" v-model="form.payment_sender_number" maxlength="15" placeholder="e.g. 03XX-1234567" />
                                    <small class="text-muted">Enter the mobile number used for payment</small>
                                </div>

                                <div v-if="form.payment_sender_method === 'Bank Transfer'" class="mb-3 p-3 rounded-3" style="background:#fdf4ff;border-color:#d8b4fe !important;">
                                    <label class="form-label fw-bold mb-2" style="color:#7c3aed;font-size:0.82rem;">
                                        <i class="bi bi-bank me-1"></i> Bank Transfer Details *
                                    </label>
                                    <input type="text" class="form-control border-0 custom-focus mb-2" style="background:#f3e8ff;" placeholder="Sender Bank Name" v-model="form.payment_sender_bank" />
                                    <input type="text" class="form-control border-0 custom-focus" style="background:#f3e8ff;" placeholder="Sender Account No. / IBAN" v-model="form.payment_sender_number" />
                                    <small class="text-muted">Enter bank/account used to transfer</small>
                                </div>

                                <div class="row g-2 mt-1">
                                    <div class="col-12">
                                        <label class="form-label text-muted small fw-semibold d-flex justify-content-between">
                                            <span>Amount Sent (Rs.) *</span>
                                            <span v-if="amountStatus === 'match'" class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i>Amount matches ✓</span>
                                            <span v-else-if="amountStatus === 'low'" class="text-danger fw-bold"><i class="bi bi-x-circle-fill me-1"></i>Amount is low!</span>
                                            <span v-else-if="amountStatus === 'high'" class="text-warning fw-bold"><i class="bi bi-exclamation-circle-fill me-1"></i>Amount is high!</span>
                                        </label>

                                        <div class="input-group">
                                            <span
                                                class="input-group-text border-0 fw-bold"
                                                :class="amountStatus === 'match' ? 'bg-success text-white' : amountStatus === 'low' ? 'bg-danger text-white' : amountStatus === 'high' ? 'bg-warning text-dark' : 'bg-light text-muted'"
                                            >
                                                Rs.
                                            </span>
                                            <input
                                                type="number"
                                                class="form-control border-0 custom-focus"
                                                :class="amountStatus === 'match' ? 'border-success' : amountStatus ? 'border-danger' : ''"
                                                :style="amountStatus === 'match' ? 'background:#f0fdf4;' : amountStatus ? 'background:#fff1f2;' : 'background:#f8fafc;'"
                                                :placeholder="String(total + 300)"
                                                v-model="form.payment_amount"
                                            />
                                            <span
                                                class="input-group-text border-0"
                                                :class="amountStatus === 'match' ? 'bg-success text-white' : amountStatus === 'low' ? 'bg-danger text-white' : amountStatus === 'high' ? 'bg-warning' : 'bg-light'"
                                            >
                                                <i v-if="amountStatus === 'match'" class="bi bi-check-lg"></i>
                                                <i v-else-if="amountStatus" class="bi bi-x-lg"></i>
                                                <i v-else class="bi bi-currency-rupee text-muted"></i>
                                            </span>
                                        </div>

                                        <small class="text-muted d-block mt-1">
                                            Expected: <strong class="text-dark">Rs. {{ formatCurrency(total + 300, { minimumFractionDigits:0, maximumFractionDigits:0 }) }}</strong>
                                        </small>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label text-muted small fw-semibold">Transaction ID (TID) *</label>
                                        <input type="text" class="form-control bg-light border-0 custom-focus" placeholder="e.g. 12345678901" v-model="form.payment_tid" />
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

                        <div class="mb-4 pb-3 border-bottom" style="max-height:220px;overflow-y:auto;">
                            <div v-for="item in store.cart" :key="item.id" class="mb-3">
                                <div class="small text-dark fw-medium" style="line-height:1.4;">{{ item.product?.title }}</div>
                                <div class="d-flex justify-content-between mt-1">
                                    <span class="text-primary" style="font-size:0.8rem;">
                                        Rs. {{ formatCurrency(item.price, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }} x {{ item.quantity }}
                                    </span>
                                    <span class="fw-bold small">
                                        Rs. {{ formatCurrency(item.price * item.quantity, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between mb-2 text-muted small">
                            <span>Sub Total</span>
                            <span class="fw-semibold text-dark">Rs. {{ formatCurrency(subtotal, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3 pb-3 text-muted small border-bottom">
                            <span>Shipping Charges</span>
                            <span class="fw-semibold text-dark">Rs. 300</span>
                        </div>
                        <div class="d-flex justify-content-between mb-4">
                            <span class="fw-bold text-dark">Total</span>
                            <strong class="fs-5">Rs. {{ formatCurrency(total + 300, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</strong>
                        </div>

                        <button
                            class="btn w-100 py-3 fw-bold rounded-3 hover-lift"
                            @click="triggerCheckout"
                            :disabled="checkoutLoading"
                            style="background-color:#1e1b4b;color:white;border:none;"
                        >
                            <span v-if="checkoutLoading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                            <span>{{ checkoutLoading ? 'Processing...' : 'Confirm Now' }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- STEP 3: SUCCESS -->
            <div v-else-if="step === 'success'" class="row g-4">
                <div class="col-12">
                    <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                        <div class="text-center mb-4">
                            <h2 class="fw-extrabold text-dark mb-2">Order Confirmed!</h2>
                            <p class="text-muted fs-6">
                                Thank you,
                                <span class="fw-bold text-dark">{{ placedOrder?.shipping_name }}</span>.
                            </p>
                            <div v-if="placedOrder" class="text-muted mt-2">
                                Order ID: #{{ placedOrder?.id?.substring(0, 8).toUpperCase() }}
                            </div>
                        </div>

                        <div class="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-md-3 mt-4">
                            <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold" type="button" @click="printInvoice">
                                Print Invoice
                            </button>
                            <router-link to="/laptops" class="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold">
                                Continue Shopping
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../utils/store'
import MainLayout from '../Layouts/MainLayout.vue'
import { formatCurrency } from '../utils/format'

const router = useRouter()

const step = ref('cart') // 'cart', 'shipping', 'success'
const checkoutLoading = ref(false)

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
    payment_sender_number: '',
    payment_sender_bank: '',
    payment_amount: '',
    payment_tid: ''
})

const placedOrder = ref(null)

const subtotal = computed(() => {
    return store.cart.reduce((t, i) => t + i.price * i.quantity, 0)
})

const discountAmount = computed(() => 0) // placeholder; keep simple and build-safe
const total = computed(() => subtotal.value - discountAmount.value)

// Real-time amount mismatch check for payment verification UI
const amountStatus = computed(() => {
    if (!form.value.payment_amount) return ''
    const entered = Number(form.value.payment_amount)
    const expected = total.value + 300
    if (Math.abs(entered - expected) < 0.5) return 'match'
    if (entered < expected) return 'low'
    return 'high'
})

const proceedToShipping = () => {
    step.value = 'shipping'
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const triggerCheckout = async () => {
    if (!form.value.contact_email.trim() || !form.value.shipping_address.trim() || !form.value.contact_phone.trim()) {
        store.addToast('Please fill in all required contact and shipping details.', 'warning')
        return
    }

    // Payment verification required when not COD
    if (form.value.payment_method !== 'Cash on Delivery') {
        const required = [
            ['payment_sender_name', 'Sender name'],
            ['payment_sender_method', 'Sender payment method'],
            ['payment_amount', 'Payment amount'],
            ['payment_tid', 'Transaction ID']
        ]

        for (const [key, label] of required) {
            if (!String(form.value[key] || '').trim()) {
                store.addToast(`Please fill: ${label}`, 'warning')
                return
            }
        }

        const expectedAmount = total.value + 300
        const providedAmount = Number(form.value.payment_amount)
        if (Math.abs(providedAmount - expectedAmount) > 0.5) {
            store.addToast(`Payment amount must be Rs. ${formatCurrency(expectedAmount, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}.`, 'danger')
            return
        }

        if (
            (form.value.payment_sender_method === 'Jazz Cash' || form.value.payment_sender_method === 'Easy Paisa') &&
            !form.value.payment_sender_number
        ) {
            store.addToast(`Please enter ${form.value.payment_sender_method} sender number.`, 'warning')
            return
        }

        if (form.value.payment_sender_method === 'Bank Transfer' && !form.value.payment_sender_number) {
            store.addToast('Please enter sender account/IBAN for Bank Transfer.', 'warning')
            return
        }
    }

    checkoutLoading.value = true
    try {
        const orderData = { ...form.value, total_amount: total.value + 300 }
        const response = await store.processCheckout(orderData)
        placedOrder.value = response.order
        step.value = 'success'
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
        // store.js already shows toast
    } finally {
        checkoutLoading.value = false
    }
}

const printInvoice = () => {
    // Build-safe minimal print: rely on browser print for success screen.
    window.print()
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

.hover-lift {
    transition: var(--transition);
}

.hover-lift:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25) !important;
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

.fade-in-up {
    animation: fadeInUp 0.35s ease-out both;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>

