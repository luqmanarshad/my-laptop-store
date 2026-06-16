<template>
    <header class="bg-white border-bottom sticky-top shadow-sm z-index-master">

        <!-- Top Navbar -->
        <div class="container py-2 py-lg-3">

            <div class="row align-items-center">

                <!-- Logo & Mobile Toggle -->
                <div class="col-6 col-lg-2 d-flex align-items-center justify-content-between">
                    <router-link to="/" class="d-flex align-items-center text-decoration-none">
                        <div class="logo-box me-2">
                            <i class="bi bi-laptop"></i>
                        </div>
                        <div>
                            <h2 class="brand-name mb-0">Lapzo</h2>
                            <small class="text-muted d-none d-lg-block" style="font-size: 0.65rem;">LAPTOP STORE</small>
                        </div>
                    </router-link>
                </div>

                <!-- Desktop Search -->
                <div class="col-lg-5 d-none d-lg-block">
                    <div class="search-wrapper">
                        <input
                            type="text"
                            class="form-control search-input"
                            placeholder="Search laptops, brands, models..."
                            v-model="searchTerm"
                            @keyup.enter="submitSearch"
                        >
                        <button class="search-btn" type="button" @click="submitSearch">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <!-- Desktop Icons & Auth -->
                <div class="col-6 col-lg-5">
                    <div class="d-flex justify-content-end align-items-center gap-2 gap-lg-3 nav-icons">
                        
                        <!-- Mobile Search Toggle -->
                        <button class="nav-item-custom border-0 bg-transparent d-lg-none p-2" @click="mobileSearchOpen = !mobileSearchOpen">
                            <i class="bi bi-search fs-5"></i>
                        </button>

                        <router-link to="/compare" class="nav-item-custom position-relative text-decoration-none d-none d-md-inline-flex">
                            <i class="bi bi-grid"></i>
                            <span class="badge-circle">{{ store.compare.length }}</span>
                            <span class="d-none d-xl-inline">Compare</span>
                        </router-link>

                        <router-link to="/wishlist" class="nav-item-custom position-relative text-decoration-none p-2 p-lg-2">
                            <i class="bi bi-heart fs-5 fs-lg-6"></i>
                            <span class="badge-circle">{{ store.wishlist.length }}</span>
                            <span class="d-none d-xl-inline">Wishlist</span>
                        </router-link>

                        <router-link to="/cart" class="nav-item-custom position-relative text-decoration-none p-2 p-lg-2">
                            <i class="bi bi-cart3 fs-5 fs-lg-6"></i>
                            <span class="badge-circle">{{ store.cart.length }}</span>
                            <span class="d-none d-xl-inline">Cart</span>
                        </router-link>

                        <!-- User Authentication Menu -->
                        <div v-if="store.user" class="position-relative d-inline-block">
                            <button @click="toggleUserDropdown" class="nav-item-custom border-0 bg-transparent align-items-center p-2 p-lg-2" type="button">
                                <i class="bi bi-person-circle text-primary fs-5 fs-lg-6"></i>
                                <span class="d-none d-lg-inline">{{ store.user.name.split(' ')[0] }}</span>
                                <i class="bi bi-chevron-down ms-1 d-none d-lg-inline" style="font-size: 10px;"></i>
                            </button>
                            <!-- Dropdown Menu -->
                            <div v-if="userDropdownOpen" class="dropdown-overlay" @click="userDropdownOpen = false"></div>
                            <ul v-if="userDropdownOpen" class="dropdown-menu show dropdown-menu-end border-0 shadow-lg p-2 rounded-4 position-absolute end-0 mt-2 animate-dropdown" style="background: rgba(255, 255, 255, 0.98); box-shadow: 0 15px 40px rgba(0,0,0,0.12) !important; min-width: 200px; z-index: 1050;">
                                <li class="px-3 py-2 border-bottom mb-2 d-lg-none">
                                    <span class="fw-bold d-block text-dark">{{ store.user.name }}</span>
                                    <small class="text-muted">{{ store.user.email }}</small>
                                </li>
                                <li>
                                    <router-link to="/orders" @click="userDropdownOpen = false" class="dropdown-item rounded-3 py-2 px-3 fw-semibold">
                                        <i class="bi bi-bag-check me-2 text-primary"></i> My Orders
                                    </router-link>
                                </li>
                                <li>
                                    <router-link v-if="store.user.isAdmin" to="/dashboard" @click="userDropdownOpen = false" class="dropdown-item rounded-3 py-2 px-3 fw-semibold text-primary">
                                        <i class="bi bi-plus-circle me-2"></i> Add Product
                                    </router-link>
                                </li>
                                <li><hr class="dropdown-divider border-light"></li>
                                <li>
                                    <button @click="handleSignOut" class="dropdown-item rounded-3 py-2 px-3 fw-semibold text-danger border-0 bg-transparent w-100 text-start">
                                        <i class="bi bi-box-arrow-right me-2"></i> Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <router-link v-else to="/login" class="nav-item-custom text-decoration-none d-none d-lg-inline-flex">
                            <i class="bi bi-person"></i>
                            <span>Sign In</span>
                        </router-link>
                        
                        <!-- Mobile Menu Toggle -->
                        <button class="mobile-toggle-btn d-lg-none ms-1" @click="mobileMenuOpen = !mobileMenuOpen">
                            <i class="bi" :class="mobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
                        </button>

                    </div>
                </div>
            </div>
            
            <!-- Mobile Search Bar (Collapsible) -->
            <div class="mobile-search-collapse" :class="{ 'show': mobileSearchOpen }">
                <div class="search-wrapper mt-3">
                    <input
                        type="text"
                        class="form-control search-input"
                        placeholder="Search laptops..."
                        v-model="searchTerm"
                        @keyup.enter="submitSearch"
                    >
                    <button class="search-btn" type="button" @click="submitSearch">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>

        </div>

        <!-- Desktop Menu Bar -->
        <div class="menu-bar d-none d-lg-block">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <div class="d-flex align-items-center gap-4">
                        <router-link to="/categories" class="category-btn text-decoration-none">
                            <i class="bi bi-grid-fill me-2"></i> All Categories
                        </router-link>
                        
                        <nav class="desktop-nav d-flex gap-4">
                            <router-link to="/" class="nav-link">Home</router-link>
                            <router-link to="/laptops" class="nav-link">Laptops</router-link>
                            <router-link to="/brands" class="nav-link">Brands</router-link>
                            <router-link to="/accessories" class="nav-link">Accessories</router-link>
                            <router-link to="/deals" class="nav-link text-danger fw-bold"><i class="bi bi-fire me-1"></i>Deals</router-link>
                        </nav>
                    </div>

                    <div class="sale-banner d-none d-xl-block">
                        <i class="bi bi-brightness-high-fill text-warning me-1"></i> Summer Sale - Up to 30% Off
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Mobile Drawer Menu -->
        <div class="mobile-drawer" :class="{ 'open': mobileMenuOpen }">
            <div class="mobile-drawer-backdrop" @click="mobileMenuOpen = false"></div>
            <div class="mobile-drawer-content d-flex flex-column">
                <div class="p-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <div class="d-flex align-items-center">
                        <div class="logo-box me-2" style="width: 40px; height: 40px; font-size: 20px;">
                            <i class="bi bi-laptop"></i>
                        </div>
                        <h4 class="brand-name mb-0">Lapzo</h4>
                    </div>
                    <button class="btn-close" @click="mobileMenuOpen = false"></button>
                </div>
                
                <div class="p-4 flex-grow-1 overflow-auto">
                    <div v-if="!store.user" class="mb-4 pb-4 border-bottom">
                        <p class="text-muted small mb-3">Welcome to Lapzo! Sign in to manage your orders.</p>
                        <router-link to="/login" class="btn btn-primary w-100 rounded-pill py-2" @click="mobileMenuOpen = false">
                            Sign In / Register
                        </router-link>
                    </div>
                    
                    <h6 class="text-uppercase text-muted fw-bold mb-3 small tracking-wider">Navigation</h6>
                    <nav class="mobile-nav d-flex flex-column gap-2 mb-4">
                        <router-link to="/" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="bi bi-house me-3"></i> Home</router-link>
                        <router-link to="/laptops" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="bi bi-laptop me-3"></i> Laptops</router-link>
                        <router-link to="/categories" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="bi bi-grid me-3"></i> Categories</router-link>
                        <router-link to="/brands" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="bi bi-tags me-3"></i> Brands</router-link>
                        <router-link to="/deals" class="mobile-nav-link text-danger fw-bold" @click="mobileMenuOpen = false"><i class="bi bi-fire me-3"></i> Deals & Offers</router-link>
                    </nav>
                    
                    <h6 class="text-uppercase text-muted fw-bold mb-3 small tracking-wider mt-4">Quick Links</h6>
                    <nav class="mobile-nav d-flex flex-column gap-2">
                        <router-link to="/compare" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="bi bi-bar-chart me-3"></i> Compare Products</router-link>
                        <router-link to="/support" class="mobile-nav-link" @click="mobileMenuOpen = false"><i class="bi bi-headset me-3"></i> Support Center</router-link>
                    </nav>
                </div>
                
                <div class="p-4 bg-light mt-auto border-top text-center">
                    <p class="mb-0 text-muted small">© 2026 Lapzo Store</p>
                </div>
            </div>
        </div>

    </header>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../utils/store'

const router = useRouter()
const route = useRoute()
const searchTerm = ref(String(route.query.search || ''))

const userDropdownOpen = ref(false)
const mobileMenuOpen = ref(false)
const mobileSearchOpen = ref(false)

const toggleUserDropdown = () => {
    userDropdownOpen.value = !userDropdownOpen.value
}

const handleSignOut = () => {
    userDropdownOpen.value = false
    store.logout()
}

watch(
    () => route.query.search,
    (newSearch) => {
        searchTerm.value = String(newSearch || '')
    }
)

// Close mobile menus on route change
watch(
    () => route.path,
    () => {
        mobileMenuOpen.value = false
        mobileSearchOpen.value = false
    }
)

const submitSearch = () => {
    const query = {}
    if (searchTerm.value.trim()) {
        query.search = searchTerm.value.trim()
    }
    
    mobileSearchOpen.value = false
    mobileMenuOpen.value = false
    router.push({ path: '/laptops', query })
}

// Lock body scroll when mobile menu is open
watch(mobileMenuOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

onUnmounted(() => {
    document.body.style.overflow = ''
})
</script>

<style scoped>
.z-index-master {
    z-index: 1040;
}

.logo-box {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    box-shadow: 0 4px 10px rgba(37,99,235,0.2);
}

.brand-name {
    font-weight: 800;
    color: var(--dark);
    letter-spacing: -0.5px;
}

.desktop-nav .nav-link {
    color: #475569;
    font-weight: 600;
    padding: 10px 0;
    position: relative;
    transition: var(--transition);
}

.desktop-nav .nav-link:hover {
    color: var(--primary);
}

.desktop-nav .router-link-active {
    color: var(--primary);
}

.desktop-nav .router-link-active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--primary);
    border-radius: 3px 3px 0 0;
}

.search-wrapper {
    position: relative;
}

.search-input {
    height: 52px;
    border-radius: 50px;
    border: 1px solid #e2e8f0;
    padding-left: 24px;
    padding-right: 60px;
    font-size: 15px;
    background: #f8fafc;
    transition: var(--transition);
}

.search-input:focus {
    box-shadow: 0 0 0 4px var(--primary-glow);
    border-color: var(--primary);
    background: white;
}

.search-btn {
    position: absolute;
    right: 6px;
    top: 6px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.search-btn:hover {
    background: var(--primary-dark);
}

.nav-item-custom {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #334155;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 12px;
    transition: var(--transition);
    font-weight: 600;
}

.nav-item-custom:hover {
    background: #f1f5f9;
    color: var(--primary);
}

.badge-circle {
    position: absolute;
    top: 0px;
    left: 20px;
    background: var(--danger);
    color: white;
    font-size: 10px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
}

.menu-bar {
    border-top: 1px solid #f1f5f9;
    background: white;
}

.category-btn {
    border: none;
    background: var(--primary);
    color: white;
    border-radius: 10px;
    padding: 10px 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    transition: var(--transition);
}

.category-btn:hover {
    background: var(--primary-dark);
    color: white;
}

.sale-banner {
    background: #fffbeb;
    color: #b45309;
    padding: 8px 16px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    border: 1px solid #fde68a;
}

.animate-dropdown {
    animation: fadeInDropdown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: top right;
}

.dropdown-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1040;
}

@keyframes fadeInDropdown {
    from { opacity: 0; transform: translateY(10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

/* --- Mobile Specific Styles --- */
.mobile-toggle-btn {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: white;
    color: var(--dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.mobile-search-collapse {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    padding: 0 12px;
}

.mobile-search-collapse.show {
    max-height: 80px;
    padding-bottom: 15px;
}

/* Mobile Drawer CSS */
.mobile-drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1050;
    visibility: hidden;
    pointer-events: none;
}

.mobile-drawer.open {
    visibility: visible;
    pointer-events: auto;
}

.mobile-drawer-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.mobile-drawer.open .mobile-drawer-backdrop {
    opacity: 1;
}

.mobile-drawer-content {
    position: absolute;
    top: 0;
    left: -100%;
    width: 85%;
    max-width: 340px;
    height: 100%;
    background: white;
    transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 20px 0 50px rgba(0,0,0,0.1);
}

.mobile-drawer.open .mobile-drawer-content {
    left: 0;
}

.mobile-nav-link {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: #334155;
    text-decoration: none;
    font-weight: 600;
    border-radius: 12px;
    transition: background 0.2s;
}

.mobile-nav-link:hover, .mobile-nav-link.router-link-active {
    background: #f1f5f9;
    color: var(--primary);
}

.mobile-nav-link i {
    font-size: 20px;
    color: #94a3b8;
}

.mobile-nav-link.router-link-active i {
    color: var(--primary);
}

.tracking-wider {
    letter-spacing: 0.05em;
}

@media (max-width: 991px) {
    .nav-item-custom {
        padding: 6px;
    }
    .badge-circle {
        left: 18px;
        top: -2px;
    }
}
</style>