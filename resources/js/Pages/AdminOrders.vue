<template>
    <div class="d-flex min-vh-100 bg-light">
        
        <!-- Sidebar -->
        <aside class="admin-sidebar bg-slate-900 text-white p-4 d-flex flex-column" style="width: 280px; flex-shrink: 0; min-height: 100vh; background: #0f172a; border-right: 1px solid #1e293b;">
            <div class="d-flex align-items-center mb-5 gap-2 px-2">
                <div class="admin-logo-box bg-primary text-white d-flex align-items-center justify-content-center rounded-3" style="width: 40px; height: 40px; font-size: 20px;">
                    <i class="bi bi-laptop"></i>
                </div>
                <div>
                    <h5 class="fw-bold mb-0 text-white tracking-wider">LAPZO</h5>
                    <small class="text-slate-400 text-uppercase" style="font-size: 0.65rem; color: #94a3b8;">Admin Portal</small>
                </div>
            </div>

            <nav class="flex-grow-1 d-flex flex-column gap-2">
                <router-link 
                    to="/dashboard?tab=overview" 
                    class="nav-link-btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100 text-decoration-none"
                >
                    <i class="bi bi-speedometer2"></i>
                    <span>Dashboard Overview</span>
                </router-link>

                <router-link 
                    to="/dashboard?tab=products" 
                    class="nav-link-btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100 text-decoration-none"
                >
                    <i class="bi bi-grid-3x3-gap"></i>
                    <span>Product Manager</span>
                </router-link>

                <button 
                    class="nav-link-btn active d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100"
                >
                    <i class="bi bi-box-seam"></i>
                    <span>Order Manager</span>
                </button>

                <hr class="border-slate-800 my-4" style="border-color: #334155;" />

                <router-link 
                    to="/" 
                    class="nav-link-btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100 text-decoration-none"
                >
                    <i class="bi bi-shop"></i>
                    <span>Go to storefront</span>
                </router-link>
            </nav>

            <!-- Admin Profile details & logout -->
            <div class="admin-profile border-top pt-4 mt-auto" style="border-color: #334155;">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width: 40px; height: 40px;">
                        {{ store.user?.name ? store.user.name.charAt(0).toUpperCase() : 'A' }}
                    </div>
                    <div class="lh-sm">
                        <div class="fw-bold text-white small">{{ store.user?.name || 'Administrator' }}</div>
                        <div class="text-muted small" style="font-size: 0.75rem; color: #94a3b8;">{{ store.user?.email || 'admin@lapzo.com' }}</div>
                    </div>
                </div>
                <button class="btn btn-outline-danger w-100 rounded-3 py-2.5 btn-sm" @click="logout">
                    <i class="bi bi-box-arrow-right me-2"></i> Log out
                </button>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-grow-1 p-4 p-md-5 overflow-auto" style="max-height: 100vh;">
            
            <div class="fade-in">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-5">
                    <div>
                        <h1 class="fw-extrabold text-dark mb-1">Customer Orders Manager</h1>
                        <p class="text-muted">Review, verify, process, and track all store checkouts globally.</p>
                    </div>
                </div>

                <div class="card border-0 shadow-sm p-4 rounded-4 bg-white mb-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <h3 class="h5 fw-bold mb-0 text-dark">Latest Orders</h3>
                        <button class="btn btn-primary btn-sm rounded-3 px-3 py-2 fw-semibold" @click="fetchOrders" :disabled="loading">
                            <i class="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>

                    <div v-if="loading && orders.length === 0" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="text-muted mt-2">Loading orders...</p>
                    </div>

                    <div v-else class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-secondary small">Order ID</th>
                                    <th class="text-secondary small">Date</th>
                                    <th class="text-secondary small">Customer</th>
                                    <th class="text-secondary small">Contact</th>
                                    <th class="text-secondary small">Payment</th>
                                    <th class="text-secondary small">Total</th>
                                    <th class="text-secondary small">Status</th>
                                    <th class="text-secondary small text-end">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="order in paginatedOrders" :key="order.id">
                                    <tr>
                                        <td>
                                            <span class="fw-bold text-dark">#{{ order.id.substring(0, 8).toUpperCase() }}</span>
                                        </td>
                                        <td class="text-muted small">
                                            {{ formatDate(order.created_at) }}
                                        </td>
                                        <td>
                                            <div class="fw-semibold text-dark">{{ order.shipping_name }}</div>
                                        </td>
                                        <td>
                                            <div class="small text-muted">{{ order.contact_phone }}</div>
                                            <div class="small text-muted">{{ order.contact_email }}</div>
                                        </td>
                                        <td>
                                            <div class="small fw-medium">{{ order.payment_method }}</div>
                                        </td>
                                        <td class="fw-bold text-primary">Rs. {{ Number(order.total_amount || order.total || (order.items ? order.items.reduce((t, i) => t + (i.price * i.quantity), 0) : 0)).toFixed(2) }}</td>
                                        <td>
                                            <select class="form-select form-select-sm rounded-3" v-model="order.status" @change="updateOrderStatus(order.id, order.status)" style="width: 120px;">
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td class="text-end">
                                            <button class="btn btn-sm btn-outline-primary rounded-3 px-3" @click="toggleDetails(order.id)">
                                                {{ expandedOrderId === order.id ? 'Hide' : 'View' }}
                                            </button>
                                        </td>
                                    </tr>
                                    
                                    <!-- Expandable Details Row -->
                                    <tr v-if="expandedOrderId === order.id" class="bg-light">
                                        <td colspan="8" class="p-4 border-bottom">
                                            <div class="row g-4">
                                                <!-- Shipping Info -->
                                                <div class="col-md-4">
                                                    <h6 class="fw-bold mb-3 border-bottom pb-2">Shipping Details</h6>
                                                    <p class="mb-1 small"><strong>Address:</strong> {{ order.shipping_address }}</p>
                                                    <p class="mb-1 small" v-if="order.shipping_address_line2"><strong>Address 2:</strong> {{ order.shipping_address_line2 }}</p>
                                                    <p class="mb-1 small"><strong>City:</strong> {{ order.shipping_city }}, {{ order.shipping_state }}</p>
                                                    <p class="mb-1 small"><strong>Country:</strong> {{ order.shipping_country }} - {{ order.shipping_zip }}</p>
                                                </div>
                                                
                                                <!-- Payment Verification (if not COD) -->
                                                <div class="col-md-4">
                                                    <h6 class="fw-bold mb-3 border-bottom pb-2">Payment Verification</h6>
                                                    <div v-if="order.payment_method !== 'Cash on Delivery'">
                                                        <p class="mb-1 small"><strong>Sender Name:</strong> {{ order.payment_sender_name || 'N/A' }}</p>
                                                        <p class="mb-1 small"><strong>Sender Method:</strong> <span class="badge bg-secondary">{{ order.payment_sender_method || order.payment_method }}</span></p>
                                                        <p class="mb-1 small"><strong>Amount Paid:</strong> Rs. {{ order.payment_amount }}</p>
                                                        <p class="mb-1 small"><strong>TID / Ref:</strong> <span class="fw-bold text-danger">{{ order.payment_tid || 'N/A' }}</span></p>
                                                    </div>
                                                    <div v-else>
                                                        <p class="mb-1 small text-muted">Cash on Delivery selected. No advance payment verification required.</p>
                                                    </div>
                                                </div>

                                                <!-- Order Items -->
                                                <div class="col-md-4">
                                                    <h6 class="fw-bold mb-3 border-bottom pb-2">Order Items</h6>
                                                    <div v-for="item in order.items" :key="item.id" class="d-flex align-items-center mb-2 pb-2 border-bottom border-secondary-subtle">
                                                        <img :src="item.product?.thumbnail" style="width: 40px; height: 40px; object-fit: contain;" class="bg-white border rounded p-1 me-2" />
                                                        <div class="small lh-sm flex-grow-1">
                                                            <div class="fw-semibold text-truncate" style="max-width: 150px;">{{ item.product?.title }}</div>
                                                            <div class="text-muted">{{ item.quantity }} x Rs. {{ item.price }}</div>
                                                        </div>
                                                        <div class="fw-bold small">Rs. {{ (item.quantity * item.price).toFixed(2) }}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </template>

                                <tr v-if="orders.length === 0">
                                    <td colspan="8" class="text-center py-4 text-muted">No orders found.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Controls -->
                    <div class="d-flex justify-content-between align-items-center mt-4" v-if="orders.length > 0">
                        <span class="text-muted small">
                            Showing {{ (currentPage - 1) * perPage + 1 }} to {{ Math.min(currentPage * perPage, orders.length) }} of {{ orders.length }} orders
                        </span>
                        <div class="btn-group">
                            <button class="btn btn-outline-secondary btn-sm" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
                            <button class="btn btn-secondary btn-sm disabled">{{ currentPage }} / {{ totalPages }}</button>
                            <button class="btn btn-outline-secondary btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '../firebase_config'
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { store } from '../utils/store'

const router = useRouter()
const orders = ref([])
const loading = ref(true)
const expandedOrderId = ref(null)

// Pagination state
const currentPage = ref(1)
const perPage = 40

const fetchOrders = async () => {
    loading.value = true
    try {
        const q = query(collection(db, "orders"), orderBy("created_at", "desc"))
        const querySnapshot = await getDocs(q)
        const fetchedOrders = []
        
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const created_at = data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at
            
            // Handle legacy data structure or missing fields safely
            fetchedOrders.push({ 
                id: doc.id, 
                ...data, 
                created_at,
                status: data.status || 'Pending' 
            })
        })
        
        orders.value = fetchedOrders
        currentPage.value = 1 // reset to first page on refresh
    } catch (error) {
        console.error('Failed to load orders:', error)
        store.addToast('Could not load orders from database.', 'danger')
    } finally {
        loading.value = false
    }
}

const updateOrderStatus = async (orderId, newStatus) => {
    try {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus })
        store.addToast(`Order #${orderId.substring(0,6)} status updated to ${newStatus}`, 'success')
    } catch (err) {
        console.error('Update status failed', err)
        store.addToast('Failed to update status', 'danger')
    }
}

const toggleDetails = (id) => {
    if (expandedOrderId.value === id) {
        expandedOrderId.value = null
    } else {
        expandedOrderId.value = id
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

// Pagination logic
const totalPages = computed(() => {
    return Math.ceil(orders.value.length / perPage) || 1
})

const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * perPage
    const end = start + perPage
    return orders.value.slice(start, end)
})

const logout = async () => {
    try {
        await auth.signOut()
    } catch (error) {
        console.warn('Logout failed:', error)
    }
    localStorage.removeItem('api_token')
    router.push('/login')
}

onMounted(() => {
    fetchOrders()
})
</script>

<style scoped>
.admin-sidebar {
    height: 100vh;
    position: sticky;
    top: 0;
}

.nav-link-btn {
    background: transparent;
    color: #94a3b8 !important;
    transition: all 0.2s ease;
    font-weight: 600;
}

.nav-link-btn:hover {
    background: #1e293b;
    color: white !important;
}

.nav-link-btn.active {
    background: var(--primary);
    color: white !important;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.avatar {
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.fade-in {
    animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
