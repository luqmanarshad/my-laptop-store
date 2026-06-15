<template>
    <MainLayout>
        <section class="container py-5">
            <!-- Header -->
            <div class="mb-5">
                <h1 class="orders-title fw-bold">My Orders</h1>
                <p class="text-muted fs-5">Track and view details of your past purchases.</p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary spinner-lg" role="status"></div>
                <p class="text-muted mt-3">Loading order history...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="orders.length === 0" class="text-center py-5 empty-container rounded-4 shadow-sm p-5 bg-white transition-fade">
                <div class="empty-icon mb-4"><i class="bi bi-bag-x"></i></div>
                <h3 class="fw-bold mb-3 text-dark">No orders found</h3>
                <p class="text-muted mb-4 max-width-md mx-auto">You haven't placed any orders yet. Explore our high-performance laptops and place your first order!</p>
                <router-link to="/laptops" class="btn browse-btn rounded-pill px-5 py-3">Browse Laptops</router-link>
            </div>

            <!-- Orders List -->
            <div v-else class="row g-4 transition-fade">
                <div class="col-12">
                    <div 
                        v-for="order in orders" 
                        :key="order.id" 
                        class="card border-0 shadow-sm rounded-4 p-4 p-lg-5 mb-4 bg-white order-card position-relative overflow-hidden"
                    >
                        <!-- Card Border Top Accent -->
                        <div class="card-accent"></div>

                        <!-- Order Meta Info Header -->
                        <div class="row align-items-center pb-4 mb-4 border-bottom g-3">
                            <div class="col-sm-6 col-md-3">
                                <span class="text-muted text-xs d-block mb-1">ORDER ID</span>
                                <span class="fw-extrabold text-dark fs-5">#LPZ-{{ order.id }}</span>
                            </div>
                            <div class="col-sm-6 col-md-3">
                                <span class="text-muted text-xs d-block mb-1">DATE PLACED</span>
                                <span class="fw-semibold text-dark">{{ formatDate(order.created_at) }}</span>
                            </div>
                            <div class="col-sm-6 col-md-3">
                                <span class="text-muted text-xs d-block mb-1">TOTAL AMOUNT</span>
                                <span class="fw-extrabold text-primary fs-5">${{ Number(order.total_amount).toFixed(2) }}</span>
                            </div>
                            <div class="col-sm-6 col-md-3 text-sm-end">
                                <span class="text-muted text-xs d-block mb-1 d-sm-none">STATUS</span>
                                <span :class="['badge rounded-pill px-3 py-2 fw-bold text-uppercase text-xs', getStatusClass(order.status)]">
                                    {{ order.status }}
                                </span>
                            </div>
                        </div>

                        <!-- Order Body -->
                        <div class="row g-4">
                            <!-- Items List -->
                            <div class="col-lg-7">
                                <h6 class="fw-bold text-dark mb-3">Purchased Items</h6>
                                <div class="purchased-items-stack">
                                    <div 
                                        v-for="item in order.items" 
                                        :key="item.id" 
                                        class="d-flex align-items-center py-3 border-bottom-dashed"
                                    >
                                        <div class="item-img-wrapper rounded-3 border bg-light p-1 d-flex align-items-center justify-content-center">
                                            <img :src="item.product?.thumbnail" class="item-img" :alt="item.product?.title">
                                        </div>
                                        <div class="ms-3 flex-grow-1">
                                            <h6 class="fw-semibold text-dark mb-1 text-truncate" style="max-width: 250px;">{{ item.product?.title }}</h6>
                                            <span class="text-muted text-xs d-block">Brand: {{ item.product?.brand?.name || 'N/A' }}</span>
                                        </div>
                                        <div class="text-end">
                                            <span class="fw-bold text-dark d-block">${{ Number(item.price * item.quantity).toFixed(2) }}</span>
                                            <span class="text-muted text-xs">{{ item.quantity }} x ${{ Number(item.price).toFixed(2) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Delivery / Payment Summary -->
                            <div class="col-lg-5">
                                <div class="bg-light rounded-4 p-4 border h-100">
                                    <h6 class="fw-bold text-dark mb-3"><i class="bi bi-truck me-2 text-primary"></i> Delivery Details</h6>
                                    
                                    <div class="mb-3">
                                        <span class="text-muted text-xs d-block mb-1">SHIPPING ADDRESS</span>
                                        <p class="text-dark small mb-0 fw-medium">{{ order.shipping_address || 'No address provided' }}</p>
                                    </div>

                                    <div class="row">
                                        <div class="col-sm-6 mb-3 mb-sm-0">
                                            <span class="text-muted text-xs d-block mb-1">CONTACT PHONE</span>
                                            <span class="text-dark small fw-medium">{{ order.phone || 'N/A' }}</span>
                                        </div>
                                        <div class="col-sm-6">
                                            <span class="text-muted text-xs d-block mb-1">PAYMENT TYPE</span>
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
        month: 'long',
        day: 'numeric'
    })
}

const getStatusClass = (status) => {
    const s = String(status).toLowerCase()
    if (s === 'completed') return 'bg-success-subtle text-success border border-success'
    if (s === 'pending' || s === 'processing') return 'bg-warning-subtle text-warning border border-warning'
    return 'bg-secondary-subtle text-secondary border border-secondary'
}

onMounted(() => {
    fetchOrders()
})
</script>

<style scoped>
.orders-title {
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

.order-card {
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.order-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06) !important;
}

.card-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
}

.item-img-wrapper {
    width: 65px;
    height: 55px;
    flex-shrink: 0;
}

.item-img {
    max-height: 40px;
    max-width: 100%;
    object-fit: contain;
}

.border-bottom-dashed {
    border-bottom: 1px dashed #e2e8f0;
}

.border-bottom-dashed:last-child {
    border-bottom: none;
}

.text-xs {
    font-size: 11px;
    letter-spacing: 0.05em;
}

.transition-fade {
    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
</style>
