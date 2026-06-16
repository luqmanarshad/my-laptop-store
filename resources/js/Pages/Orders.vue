<template>
    <MainLayout>
        <section class="container py-4 py-lg-5">
            <!-- Header -->
            <div class="mb-4 mb-lg-5">
                <h1 class="orders-title fw-bold mb-2">My Orders</h1>
                <p class="text-muted fs-6 mb-0">Track and view details of your past purchases.</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5 d-flex flex-column align-items-center">
                <div class="spinner-border text-primary spinner-lg mb-3" role="status"></div>
                <p class="text-muted">Loading order history...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="orders.length === 0" class="text-center py-5 empty-container rounded-4 shadow-sm p-4 p-md-5 bg-white fade-in-up">
                <div class="empty-icon mb-4"><i class="bi bi-bag-x"></i></div>
                <h3 class="fw-bold mb-3 text-dark">No orders found</h3>
                <p class="text-muted mb-4 max-width-md mx-auto">You haven't placed any orders yet. Explore our high-performance laptops and place your first order!</p>
                <router-link to="/laptops" class="btn btn-primary hover-lift rounded-pill px-4 px-md-5 py-2 py-md-3 shadow-sm">Browse Laptops</router-link>
            </div>

            <!-- Orders List -->
            <div v-else class="row g-4">
                <div class="col-12" v-for="(order, index) in orders" :key="order.id">
                    <div 
                        class="card border-0 shadow-sm rounded-4 p-3 p-md-4 p-lg-5 bg-white order-card position-relative overflow-hidden fade-in-up"
                        :style="{ animationDelay: `${index * 0.1}s` }"
                    >
                        <!-- Card Border Top Accent -->
                        <div class="card-accent" :class="getAccentClass(order.status)"></div>

                        <!-- Order Meta Info Header -->
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center pb-3 mb-4 border-bottom gap-3">
                            <div class="d-flex flex-wrap gap-3 gap-md-5 w-100">
                                <div>
                                    <span class="text-muted text-xs d-block mb-1 tracking-wider fw-semibold">ORDER ID</span>
                                    <span class="fw-extrabold text-dark fs-5 text-break">#LPZ-{{ order.id }}</span>
                                </div>
                                <div>
                                    <span class="text-muted text-xs d-block mb-1 tracking-wider fw-semibold">DATE PLACED</span>
                                    <span class="fw-semibold text-dark">{{ formatDate(order.created_at) }}</span>
                                </div>
                                <div class="ms-md-auto text-md-end w-100 w-md-auto d-flex justify-content-between justify-content-md-end align-items-center gap-4 mt-2 mt-md-0">
                                    <div>
                                        <span class="text-muted text-xs d-block mb-1 tracking-wider fw-semibold text-start text-md-end">TOTAL</span>
                                        <span class="fw-extrabold text-primary fs-5">${{ Number(order.total_amount).toFixed(2) }}</span>
                                    </div>
                                    <div class="text-end">
                                        <span :class="['badge rounded-pill px-3 py-2 fw-bold text-uppercase text-xs border', getStatusClass(order.status)]">
                                            {{ order.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Order Body -->
                        <div class="row g-4">
                            <!-- Items List -->
                            <div class="col-lg-7">
                                <h6 class="fw-bold text-dark mb-3"><i class="bi bi-box-seam text-primary me-2"></i> Purchased Items</h6>
                                <div class="purchased-items-stack bg-light rounded-4 p-3 border">
                                    <div 
                                        v-for="(item, i) in order.items" 
                                        :key="item.id" 
                                        class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center py-3"
                                        :class="{'border-bottom-dashed': i !== order.items.length - 1}"
                                    >
                                        <div class="d-flex align-items-center w-100">
                                            <div class="item-img-wrapper rounded-3 border bg-white p-2 d-flex align-items-center justify-content-center shadow-sm">
                                                <img :src="item.product?.thumbnail" class="item-img" :alt="item.product?.title">
                                            </div>
                                            <div class="ms-3 flex-grow-1 pe-2">
                                                <h6 class="fw-bold text-dark mb-1 text-truncate-2" style="font-size: 0.95rem;">{{ item.product?.title }}</h6>
                                                <span class="badge bg-secondary-subtle text-secondary px-2 py-1 rounded" style="font-size: 0.7rem;">{{ item.product?.brand?.name || 'N/A' }}</span>
                                            </div>
                                            <div class="text-end ms-auto min-w-max text-nowrap">
                                                <span class="fw-extrabold text-dark d-block">${{ Number(item.price * item.quantity).toFixed(2) }}</span>
                                                <span class="text-muted text-xs">{{ item.quantity }} x ${{ Number(item.price).toFixed(2) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Delivery / Payment Summary -->
                            <div class="col-lg-5">
                                <div class="bg-light rounded-4 p-4 border h-100 position-relative overflow-hidden">
                                    <!-- Background Icon -->
                                    <i class="bi bi-truck position-absolute text-secondary opacity-10" style="font-size: 150px; right: -20px; bottom: -30px; z-index: 0;"></i>
                                    
                                    <div class="position-relative z-1">
                                        <h6 class="fw-bold text-dark mb-4 pb-2 border-bottom"><i class="bi bi-info-circle-fill text-primary me-2"></i> Order Details</h6>
                                        
                                        <div class="mb-4">
                                            <span class="text-muted text-xs d-block mb-1 tracking-wider fw-semibold">SHIPPING ADDRESS</span>
                                            <div class="d-flex align-items-start">
                                                <i class="bi bi-geo-alt-fill text-muted me-2 mt-1"></i>
                                                <p class="text-dark small mb-0 fw-medium lh-base">{{ order.shipping_address || 'No address provided' }}</p>
                                            </div>
                                        </div>

                                        <div class="row g-3">
                                            <div class="col-sm-6">
                                                <span class="text-muted text-xs d-block mb-1 tracking-wider fw-semibold">CONTACT PHONE</span>
                                                <div class="d-flex align-items-center">
                                                    <i class="bi bi-telephone-fill text-muted me-2"></i>
                                                    <span class="text-dark small fw-medium">{{ order.phone || 'N/A' }}</span>
                                                </div>
                                            </div>
                                            <div class="col-sm-6">
                                                <span class="text-muted text-xs d-block mb-1 tracking-wider fw-semibold">PAYMENT TYPE</span>
                                                <div class="d-flex align-items-center">
                                                    <i class="bi bi-credit-card-fill text-muted me-2"></i>
                                                    <span class="text-dark small fw-medium">
                                                        {{ order.payment_method === 'COD' ? 'Cash on Delivery' : order.payment_method }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase_config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import MainLayout from '../Layouts/MainLayout.vue'
import { store } from '../utils/store'

const orders = ref([])
const loading = ref(true)

const fetchOrders = async () => {
    loading.value = true
    try {
        if (!auth.currentUser) {
            orders.value = []
            return
        }
        
        const q = query(
            collection(db, "orders"), 
            where("user_id", "==", auth.currentUser.uid)
        )
        const querySnapshot = await getDocs(q)
        const fetchedOrders = []
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const created_at = data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at
            fetchedOrders.push({ id: doc.id, ...data, created_at })
        })
        
        fetchedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        orders.value = fetchedOrders
    } catch (error) {
        console.error('Failed to load orders:', error)
        store.addToast('Could not load order history.', 'danger')
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getStatusClass = (status) => {
    const s = String(status).toLowerCase()
    if (s === 'completed' || s === 'delivered') return 'bg-success-subtle text-success border-success-subtle'
    if (s === 'pending' || s === 'processing') return 'bg-warning-subtle text-warning border-warning-subtle'
    if (s === 'shipped') return 'bg-info-subtle text-info border-info-subtle'
    if (s === 'cancelled') return 'bg-danger-subtle text-danger border-danger-subtle'
    return 'bg-secondary-subtle text-secondary border-secondary-subtle'
}

const getAccentClass = (status) => {
    const s = String(status).toLowerCase()
    if (s === 'completed' || s === 'delivered') return 'bg-success'
    if (s === 'pending' || s === 'processing') return 'bg-warning'
    if (s === 'shipped') return 'bg-info'
    if (s === 'cancelled') return 'bg-danger'
    return 'bg-primary'
}

onMounted(() => {
    fetchOrders()
})
</script>

<style scoped>
.orders-title {
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

.order-card {
    border: 1px solid rgba(226, 232, 240, 0.8) !important;
    transition: var(--transition);
}

.order-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg) !important;
    border-color: rgba(226, 232, 240, 1) !important;
}

.card-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
}

.item-img-wrapper {
    width: 70px;
    height: 70px;
    flex-shrink: 0;
}

.item-img {
    max-height: 50px;
    max-width: 100%;
    object-fit: contain;
}

.border-bottom-dashed {
    border-bottom: 1px dashed #cbd5e1;
}

.text-xs {
    font-size: 0.7rem;
}

.tracking-wider {
    letter-spacing: 0.05em;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

@media (max-width: 767px) {
    .orders-title {
        font-size: 2rem;
    }
    .item-img-wrapper {
        width: 60px;
        height: 60px;
    }
    .item-img {
        max-height: 40px;
    }
}
</style>
