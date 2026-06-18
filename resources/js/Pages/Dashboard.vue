<template>
    <div class="d-flex min-vh-100 bg-light">
        
        <!-- Mobile overlay -->
        <div
            v-if="isSidebarOpen"
            class="admin-overlay"
            @click="closeSidebar"
        ></div>

        <!-- Sidebar -->
        <aside
            class="admin-sidebar bg-slate-900 text-white p-4 d-flex flex-column"
            :class="{ 'sidebar-open': isSidebarOpen }"
            style="width: 280px; flex-shrink: 0; min-height: 100vh; background: #0f172a; border-right: 1px solid #1e293b;"
        >
            <div class="d-flex align-items-center mb-5 gap-2 px-2">
                <div class="admin-logo-box bg-primary text-white d-flex align-items-center justify-content-center rounded-3" style="width: 40px; height: 40px; font-size: 20px;">
                    <i class="bi bi-laptop"></i>
                </div>
                <div>
                    <h5 class="fw-bold mb-0 text-white tracking-wider">LAPZO</h5>
                    <small class="text-slate-400 text-uppercase" style="font-size: 0.65rem; color: #94a3b8;">Admin Portal</small>
                </div>

                <!-- Mobile close button -->
                <button
                    type="button"
                    class="btn btn-sm btn-outline-light ms-auto d-md-none"
                    @click="closeSidebar"
                    aria-label="Close sidebar"
                >
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <nav class="flex-grow-1 d-flex flex-column gap-2">
                <button 
                    class="nav-link-btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100"
                    :class="{ 'active': activeTab === 'overview' }"
                    @click="() => { activeTab = 'overview'; closeSidebar(); }"
                >
                    <i class="bi bi-speedometer2"></i>
                    <span>Dashboard Overview</span>
                </button>

                <button 
                    class="nav-link-btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100"
                    :class="{ 'active': activeTab === 'products' }"
                    @click="() => { activeTab = 'products'; closeSidebar(); }"
                >
                    <i class="bi bi-grid-3x3-gap"></i>
                    <span>Product Manager</span>
                </button>

                <router-link 
                    to="/admin/orders" 
                    class="nav-link-btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100 text-decoration-none"
                    @click="closeSidebar"
                >
                    <i class="bi bi-box-seam"></i>
                    <span>Order Manager</span>
                </router-link>

                <hr class="border-slate-800 my-4" style="border-color: #334155;" />

                <router-link 
                    to="/" 
                    class="nav-link-btn d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 text-start text-white w-100 text-decoration-none"
                    @click="closeSidebar"
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
            
            <!-- Mobile top bar (sidebar toggle) -->
            <div class="d-flex align-items-center mb-4 d-md-none">
                <button
                    type="button"
                    class="btn btn-outline-primary rounded-3 px-3 py-2 fw-bold"
                    @click="openSidebar"
                >
                    <i class="bi bi-list me-2"></i> Menu
                </button>
            </div>

            <!-- OVERVIEW TAB -->
            <div v-if="activeTab === 'overview'" class="fade-in">
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 mb-sm-5 gap-3">
                    <div>
                        <h1 class="fw-extrabold text-dark mb-1" style="font-size: 1.6rem;">Welcome Back, Admin!</h1>
                        <p class="text-muted mb-0">Here is a quick overview of your laptop store's performance today.</p>
                    </div>
                    <button type="button" class="btn btn-primary rounded-3 px-4 py-2.5 fw-bold" @click="refreshAllData">
                        <i class="bi bi-arrow-clockwise"></i> Refresh Stats
                    </button>
                </div>


                <!-- KPI Cards -->
                <div class="row g-4 mb-5">
                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <span class="text-muted fw-bold text-uppercase small">Total Sales</span>
                                <div class="icon-box bg-primary-subtle text-primary rounded-3 p-2">
                                    <i class="bi bi-wallet2 fs-5"></i>
                                </div>
                            </div>
                            <h3 class="fw-extrabold mb-1">Rs. {{ formatCurrency(totalRevenue, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</h3>
                            <span class="text-muted small">Lifetime earnings (Excl. cancelled)</span>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <span class="text-muted fw-bold text-uppercase small">Total Orders</span>
                                <div class="icon-box bg-success-subtle text-success rounded-3 p-2">
                                    <i class="bi bi-box-seam fs-5"></i>
                                </div>
                            </div>
                            <h3 class="fw-extrabold mb-1">{{ totalOrders }}</h3>
                            <span class="text-muted small">Orders placed by customers</span>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <span class="text-muted fw-bold text-uppercase small">Total Products</span>
                                <div class="icon-box bg-info-subtle text-info rounded-3 p-2">
                                    <i class="bi bi-laptop fs-5"></i>
                                </div>
                            </div>
                            <h3 class="fw-extrabold mb-1">{{ products.length }}</h3>
                            <span class="text-muted small">Active models in catalog</span>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <span class="text-muted fw-bold text-uppercase small">Stock Alerts</span>
                                <div class="icon-box bg-danger-subtle text-danger rounded-3 p-2">
                                    <i class="bi bi-exclamation-triangle fs-5"></i>
                                </div>
                            </div>
                            <h3 class="fw-extrabold mb-1" :class="{'text-danger': outOfStockCount > 0}">{{ outOfStockCount }}</h3>
                            <span class="text-muted small">Items currently out of stock</span>
                        </div>
                    </div>
                </div>

                <!-- Recent Activities Section -->
                <div class="row g-4">
                    <!-- Recent Orders -->
                    <div class="col-lg-7">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="fw-bold mb-0 text-dark">Recent Customer Orders</h5>
                                <router-link to="/admin/orders" class="btn btn-sm btn-outline-primary rounded-3 px-3">View All</router-link>
                            </div>

                            <div v-if="loading" class="text-center py-4">
                                <div class="spinner-border text-primary" role="status"></div>
                            </div>

                            <div v-else-if="recentOrders.length === 0" class="text-center py-4 text-muted">
                                No orders registered yet.
                            </div>

                            <div v-else class="table-responsive">
                                <table class="table align-middle">
                                    <thead>
                                        <tr class="table-light">
                                            <th class="small fw-semibold text-muted">Order ID</th>
                                            <th class="small fw-semibold text-muted">Customer</th>
                                            <th class="small fw-semibold text-muted">Amount</th>
                                            <th class="small fw-semibold text-muted">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in recentOrders" :key="order.id">
                                            <td class="fw-bold small">#{{ order.id.substring(0,8).toUpperCase() }}</td>
                                            <td>{{ order.shipping_name }}</td>
                                            <td class="fw-bold text-primary">Rs. {{ formatCurrency(Number(order.total_amount || order.total || 0), { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</td>
                                            <td>
                                                <span class="badge rounded-pill px-2.5 py-1" :class="getStatusBadgeClass(order.status)">
                                                    {{ order.status }}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Out of stock inventory -->
                    <div class="col-lg-5">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="fw-bold mb-0 text-dark">Low & Out of Stock Alerts</h5>
                                <button class="btn btn-sm btn-outline-secondary rounded-3 px-3" @click="activeTab = 'products'">Manage Inventory</button>
                            </div>

                            <div v-if="loading" class="text-center py-4">
                                <div class="spinner-border text-primary" role="status"></div>
                            </div>

                            <div v-else-if="lowStockProducts.length === 0" class="text-center py-4 text-success fw-semibold">
                                <i class="bi bi-check-circle-fill me-2"></i> All products are in stock!
                            </div>

                            <div v-else class="list-group list-group-flush">
                                <div v-for="p in lowStockProducts" :key="p.id" class="list-group-item px-0 py-3 border-secondary-subtle d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img :src="p.thumbnail" style="width: 40px; height: 40px; object-fit: contain;" class="bg-white border rounded p-1 me-2" />
                                        <div>
                                            <div class="fw-bold small text-dark text-truncate" style="max-width: 150px;">{{ p.title }}</div>
                                            <small class="text-muted">SKU: {{ p.sku }}</small>
                                        </div>
                                    </div>
                                    <span class="badge rounded-pill px-2.5 py-1" :class="p.stock === 0 ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'">
                                        {{ p.stock === 0 ? 'Out of Stock' : `${p.stock} left` }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PRODUCT MANAGER TAB -->
            <div v-if="activeTab === 'products'" class="fade-in">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-5">
                    <div>
                        <h1 class="fw-extrabold text-dark mb-1">Product Inventory Manager</h1>
                        <p class="text-muted">Publish, modify, or delete laptops catalog items instantly.</p>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-lg-5">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            <h3 class="h5 fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                                <span>{{ form.id ? 'Edit Product 📝' : 'Create Product ➕' }}</span>
                            </h3>

                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Product Title</label>
                                <input type="text" class="form-control rounded-3" v-model="form.title" placeholder="e.g. MacBook Pro 16" />
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary small">Brand</label>
                                    <select class="form-select rounded-3" v-model.number="form.brand_id">
                                        <option :value="null" disabled>Select a brand</option>
                                        <option v-for="brand in availableBrands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-semibold text-secondary small">Category</label>
                                    <select class="form-select rounded-3" v-model.number="form.category_id">
                                        <option :value="null" disabled>Select a category</option>
                                        <option v-for="category in availableCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-6">
                                    <label class="form-label fw-semibold text-secondary small">Price (Rs.)</label>
                                    <input type="number" class="form-control rounded-3" v-model.number="form.price" placeholder="Base price" />
                                </div>
                                <div class="col-6">
                                    <label class="form-label fw-semibold text-secondary small">Sale Price (Rs.)</label>
                                    <input type="number" class="form-control rounded-3" v-model.number="form.sale_price" placeholder="Discount price" />
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-6">
                                    <label class="form-label fw-semibold text-secondary small">Stock Qty</label>
                                    <input type="number" class="form-control rounded-3" v-model.number="form.stock" placeholder="Inventory Qty" />
                                </div>
                                <div class="col-6">
                                    <label class="form-label fw-semibold text-secondary small">SKU Code</label>
                                    <input type="text" class="form-control rounded-3" v-model="form.sku" placeholder="e.g. MBP-16-M3" />
                                </div>
                            </div>

                            <div class="row g-3 mb-3">
                                <div class="col-6">
                                    <label class="form-label fw-semibold text-secondary small">Store Phone</label>
                                    <input type="tel" class="form-control rounded-3" v-model="form.phone" placeholder="e.g. +91 98765 43210" />
                                </div>
                                <div class="col-6">
                                    <label class="form-label fw-semibold text-secondary small">Store Address</label>
                                    <input type="text" class="form-control rounded-3" v-model="form.address" placeholder="e.g. 123 Main St, Pune" />
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label fw-semibold text-secondary small">Thumbnail Image URL</label>
                                <input type="text" class="form-control rounded-3" v-model="form.thumbnail" placeholder="https://example.com/image.jpg" />
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-semibold text-secondary small">Description</label>
                                <textarea class="form-control rounded-3" v-model="form.description" rows="3" placeholder="Enter short specification summary description..."></textarea>
                            </div>

                            <!-- Laptop Standard Specifications Block -->
                            <div class="border-top pt-3 mt-3 mb-4">
                                <h4 class="h6 fw-bold text-uppercase text-primary mb-3 d-flex align-items-center gap-2">
                                    <i class="bi bi-cpu"></i> Standard Specifications
                                </h4>
                                
                                <div class="row g-2">
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">Processor</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.processor" placeholder="e.g. Apple M3 Pro / Core i7" />
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">RAM Memory</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.ram" placeholder="e.g. 18GB Unified / 16GB" />
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">Storage SSD</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.storage" placeholder="e.g. 512GB SSD" />
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">Graphics GPU</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.graphics" placeholder="e.g. 14-core GPU / RTX 4050" />
                                    </div>
                                    <div class="col-md-12 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">Screen Display</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.display" placeholder="e.g. 16.2 inch Liquid Retina XDR" />
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">Battery</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.battery" placeholder="e.g. 100 Wh" />
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">OS</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.os" placeholder="e.g. macOS / Win 11" />
                                    </div>
                                    <div class="col-md-4 mb-2">
                                        <label class="form-label fw-semibold text-secondary small mb-1">Weight</label>
                                        <input type="text" class="form-control form-control-sm rounded-2" v-model="form.weight" placeholder="e.g. 2.14 kg" />
                                    </div>
                                </div>
                            </div>

                            <!-- Custom Specifications Block -->
                            <div class="border-top pt-3 mt-3 mb-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="h6 fw-bold text-uppercase text-primary mb-0 d-flex align-items-center gap-2">
                                        <i class="bi bi-plus-circle"></i> Custom Specifications
                                    </h4>
                                    <button type="button" class="btn btn-sm btn-outline-primary py-1 px-2.5 rounded-3 fw-bold" style="font-size: 0.8rem;" @click="addCustomSpecRow">
                                        + Add Spec
                                    </button>
                                </div>

                                <div v-for="(spec, index) in form.custom_specs" :key="index" class="d-flex gap-2 align-items-center mb-2">
                                    <input type="text" class="form-control form-control-sm rounded-2" style="width: 40%;" v-model="spec.label" placeholder="Label (e.g. Color)" />
                                    <input type="text" class="form-control form-control-sm rounded-2" style="width: 50%;" v-model="spec.value" placeholder="Value (e.g. Space Gray)" />
                                    <button type="button" class="btn btn-sm btn-outline-danger border-0 p-1 rounded-circle" @click="removeCustomSpecRow(index)">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>

                                <p v-if="!form.custom_specs || form.custom_specs.length === 0" class="text-muted small text-center mb-0 py-2 border border-dashed rounded-3">
                                    No custom specifications added. Click "+ Add Spec" to list others.
                                </p>
                            </div>

                            <div class="d-flex gap-4 mb-4">
                                <label class="d-flex align-items-center gap-2 fw-semibold text-secondary small cursor-pointer">
                                    <input type="checkbox" class="form-check-input" v-model="form.featured" />
                                    Featured Laptop
                                </label>
                                <label class="d-flex align-items-center gap-2 fw-semibold text-secondary small cursor-pointer">
                                    <input type="checkbox" class="form-check-input" v-model="form.status" />
                                    Active Listing
                                </label>
                            </div>

                            <button class="btn btn-primary w-100 py-2.5 rounded-3 fw-bold" type="button" @click="saveProduct">
                                {{ form.id ? 'Save Changes' : 'Publish Product' }}
                            </button>

                            <button v-if="form.id" class="btn btn-outline-secondary w-100 mt-2 py-2 rounded-3" type="button" @click="resetForm">
                                Cancel Edit
                            </button>

                            <div v-if="alertMessage" class="alert alert-info mt-3 py-2 text-center rounded-3 fw-semibold small" role="alert">
                                {{ alertMessage }}
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-7">
                        <div class="card border-0 shadow-sm p-4 rounded-4 bg-white">
                            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                                <h3 class="h5 fw-bold mb-0 text-dark">Laptops Inventory</h3>
                                <input
                                    type="search"
                                    class="form-control search-input rounded-3 w-50"
                                    placeholder="Search by title..."
                                    v-model="searchQuery"
                                />
                            </div>

                            <div v-if="loading" class="text-center py-5">
                                <div class="spinner-border text-primary" role="status"></div>
                                <p class="text-muted mt-2">Loading inventory...</p>
                            </div>

                            <div v-else class="table-responsive">
                                <table class="table table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th class="text-secondary small">Product</th>
                                            <th class="text-secondary small">Brand</th>
                                            <th class="text-secondary small">Category</th>
                                            <th class="text-secondary small">Price</th>
                                            <th class="text-secondary small">Stock</th>
                                            <th class="text-secondary small">Status</th>
                                            <th class="text-secondary small text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="product in filteredProducts" :key="product.id">
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <img :src="product.thumbnail" style="width: 35px; height: 35px; object-fit: contain;" class="bg-white border rounded p-1" />
                                                    <div>
                                                        <div class="fw-semibold text-dark">{{ product.title }}</div>
                                                        <div class="text-muted small text-truncate" style="max-width: 150px;">{{ product.description }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{{ product.brand?.name }}</td>
                                            <td>{{ product.category?.name }}</td>
                                            <td class="fw-bold text-primary">Rs. {{ formatCurrency(product.sale_price || product.price, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</td>
                                            <td>
                                                <span :class="{'text-danger fw-bold': product.stock === 0}">{{ product.stock }}</span>
                                            </td>
                                            <td>
                                                <span class="badge rounded-pill px-2 py-1" :class="product.status ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                                                    {{ product.status ? 'Active' : 'Inactive' }}
                                                </span>
                                            </td>
                                            <td class="text-end">
                                                <div class="d-inline-flex gap-2">
                                                    <button class="btn btn-sm btn-outline-primary rounded-3 px-3" type="button" @click="editProduct(product)">Edit</button>
                                                    <button class="btn btn-sm btn-danger rounded-3 px-3" type="button" @click="deleteProduct(product.id)">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="filteredProducts.length === 0">
                                            <td colspan="7" class="text-center py-4 text-muted">No products found.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { db, auth } from '../firebase_config'
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { store } from '../utils/store'
import { formatCurrency } from '../utils/format'

const router = useRouter()
const route = useRoute()
const activeTab = ref('overview') // 'overview', 'products'

// Mobile sidebar toggle
const isSidebarOpen = ref(false)
const openSidebar = () => { isSidebarOpen.value = true }
const closeSidebar = () => { isSidebarOpen.value = false }

watch(activeTab, () => {
    // close sidebar when tab changes (mobile UX)
    closeSidebar()
})


// Data sources
const products = ref([])
const orders = ref([])
const loading = ref(true)

// Overview stats
const totalOrders = ref(0)
const totalRevenue = ref(0)
const outOfStockCount = computed(() => products.value.filter(p => p.stock <= 0).length)

const availableBrands = ref([
    { id: 'apple', name: 'Apple' },
    { id: 'hp', name: 'HP' },
    { id: 'dell', name: 'Dell' },
    { id: 'lenovo', name: 'Lenovo' },
    { id: 'asus', name: 'ASUS' },
])
const availableCategories = ref([
    { id: 'gaming', name: 'Gaming' },
    { id: 'business', name: 'Business' },
    { id: 'student', name: 'Student' },
    { id: 'creator', name: 'Creator' },
])

const searchQuery = ref('')
const alertMessage = ref('')

const form = ref({
    id: null,
    category_id: null,
    brand_id: null,
    title: '',
    description: '',
    price: 0,
    sale_price: null,
    stock: 0,
    sku: '',
    phone: '+923004619737',
    address: '',
    thumbnail: '',
    featured: false,
    status: true,
    processor: '',
    ram: '',
    storage: '',
    graphics: '',
    display: '',
    battery: '',
    os: '',
    weight: '',
    custom_specs: []
})

const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) {
        return products.value
    }
    const term = searchQuery.value.toLowerCase()
    return products.value.filter((product) => {
        return (
            product.title?.toLowerCase().includes(term) ||
            product.brand?.name?.toLowerCase().includes(term) ||
            product.category?.name?.toLowerCase().includes(term)
        )
    })
})

// Overview stats computations
const recentOrders = computed(() => {
    return [...orders.value]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
})

const lowStockProducts = computed(() => {
    return products.value
        .filter(p => p.stock <= 3)
        .slice(0, 5)
})

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-success-subtle text-success'
        case 'Processing': return 'bg-primary-subtle text-primary'
        case 'Shipped': return 'bg-info-subtle text-info'
        case 'Cancelled': return 'bg-danger-subtle text-danger'
        default: return 'bg-warning-subtle text-warning'
    }
}

const loadProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"))
        const prods = []
        querySnapshot.forEach((doc) => {
            prods.push({ id: doc.id, ...doc.data() })
        })
        products.value = prods
    } catch (error) {
        console.error('Unable to load products:', error)
    }
}

const loadOrders = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "orders"))
        const ords = []
        let revenue = 0
        
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            const created_at = data.created_at?.toDate ? data.created_at.toDate().toISOString() : data.created_at
            const orderObj = { id: doc.id, ...data, created_at }
            ords.push(orderObj)
            
            if (data.status !== 'Cancelled') {
                const totalAmt = data.total_amount || data.total || (data.items ? data.items.reduce((t, i) => t + (i.price * i.quantity), 0) : 0)
                revenue += Number(totalAmt)
            }
        })
        orders.value = ords
        totalOrders.value = ords.length
        totalRevenue.value = revenue
    } catch (error) {
        console.error('Failed to load orders for dashboard stats:', error)
    }
}

const refreshAllData = async () => {
    loading.value = true
    await Promise.all([loadProducts(), loadOrders()])
    loading.value = false
}

const resetForm = (keepAlert = false) => {
    form.value = {
        id: null,
        category_id: null,
        brand_id: null,
        title: '',
        description: '',
        price: 0,
        sale_price: null,
        stock: 0,
        sku: '',
        thumbnail: '',
        featured: false,
        status: true,
        processor: '',
        ram: '',
        storage: '',
        graphics: '',
        display: '',
        battery: '',
        os: '',
        weight: '',
        phone: '',
        address: '',
        custom_specs: []
    }
    if (!keepAlert) {
        alertMessage.value = ''
    }
}

const addCustomSpecRow = () => {
    if (!form.value.custom_specs) {
        form.value.custom_specs = []
    }
    form.value.custom_specs.push({ label: '', value: '' })
}

const removeCustomSpecRow = (index) => {
    form.value.custom_specs.splice(index, 1)
}

const saveProduct = async () => {
    try {
        if (!form.value.title) {
            alertMessage.value = 'Product title is required.'
            return
        }

        const cleanedCustomSpecs = (form.value.custom_specs || []).filter(item => item.label.trim() && item.value.trim())
        
        const payload = {
            title: form.value.title,
            description: form.value.description,
            price: form.value.price,
            sale_price: form.value.sale_price,
            stock: form.value.stock,
            sku: form.value.sku,
            phone: form.value.phone,
            address: form.value.address,
            thumbnail: form.value.thumbnail,
            featured: form.value.featured,
            status: form.value.status,
            category: availableCategories.value.find(c => c.id === form.value.category_id) || null,
            brand: availableBrands.value.find(b => b.id === form.value.brand_id) || null,
            specification: {
                processor: form.value.processor,
                ram: form.value.ram,
                storage: form.value.storage,
                graphics: form.value.graphics,
                display: form.value.display,
                battery: form.value.battery,
                os: form.value.os,
                weight: form.value.weight,
                custom_specs: cleanedCustomSpecs
            }
        }

        const successText = form.value.id ? 'Product updated successfully.' : 'Product created successfully.'

        if (form.value.id) {
            await updateDoc(doc(db, "products", form.value.id), payload)
        } else {
            await addDoc(collection(db, "products"), payload)
        }

        alertMessage.value = successText
        resetForm(true)
        await loadProducts()
    } catch (error) {
        console.error('Unable to save product:', error)
        alertMessage.value = 'Unable to save product. Check values and try again.'
    }
}

const editProduct = (product) => {
    let customSpecsParsed = []
    if (product.specification?.custom_specs) {
        customSpecsParsed = Array.isArray(product.specification.custom_specs)
            ? product.specification.custom_specs
            : (typeof product.specification.custom_specs === 'string' ? JSON.parse(product.specification.custom_specs) : [])
    }

    form.value = {
        id: product.id,
        category_id: product.category?.id || null,
        brand_id: product.brand?.id || null,
        title: product.title,
        description: product.description || '',
        price: product.price,
        sale_price: product.sale_price,
        stock: product.stock,
        sku: product.sku || '',
        phone: product.phone || '',
        address: product.address || '',
        thumbnail: product.thumbnail || '',
        featured: product.featured,
        status: product.status,
        processor: product.specification?.processor || '',
        ram: product.specification?.ram || '',
        storage: product.specification?.storage || '',
        graphics: product.specification?.graphics || '',
        display: product.specification?.display || '',
        battery: product.specification?.battery || '',
        os: product.specification?.os || '',
        weight: product.specification?.weight || '',
        custom_specs: JSON.parse(JSON.stringify(customSpecsParsed))
    }
    alertMessage.value = ''
}

const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) {
        return
    }
    try {
        await deleteDoc(doc(db, "products", id))
        products.value = products.value.filter((product) => product.id !== id)
        alertMessage.value = 'Product deleted successfully.'
    } catch (error) {
        console.error('Unable to delete product:', error)
        alertMessage.value = 'Unable to delete product.'
    }
}

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
    if (route.query.tab) {
        activeTab.value = route.query.tab
    }
    refreshAllData()
})
</script>

<style scoped>
.admin-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.55);
    z-index: 40;
}

.admin-sidebar {
    height: 100vh;
    position: sticky;
    top: 0;
    transition: transform 0.2s ease;
}

/* Mobile off-canvas */
@media (max-width: 767.98px) {
    .admin-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 50;
        box-shadow: 0 12px 40px rgba(2, 6, 23, 0.35);
    }
    .admin-sidebar.sidebar-open {
        transform: translateX(0);
    }

    main {
        padding: 0.9rem !important;
    }

    /* Tighten table typography */
    table {
        font-size: 0.92rem;
    }

    h1 {
        font-size: 1.35rem;
    }
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

.icon-box {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fade-in {
    animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.avatar {
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}
</style>
