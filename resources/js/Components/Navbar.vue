<template>
    <header class="bg-white border-bottom">

        <!-- Top Navbar -->
        <div class="container py-3">

            <div class="row align-items-center">

                <!-- Logo -->
                <div class="col-lg-2 col-md-3 col-12 mb-3 mb-lg-0">

                    <div class="d-flex align-items-center">

                        <div class="logo-box me-2">
                            <i class="bi bi-laptop"></i>
                        </div>

                        <div>
                            <h2 class="brand-name mb-0">
                                Lapzo
                            </h2>

                            <small class="text-muted">
                                LAPTOP STORE
                            </small>
                        </div>

                    </div>

                </div>

                <!-- Search -->
                <div class="col-lg-5 col-md-9 mb-3 mb-lg-0">

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

                <!-- Icons -->
                <div class="col-lg-5">

                    <div class="d-flex justify-content-lg-end justify-content-center gap-3 nav-icons flex-wrap">

                        <router-link to="/compare" class="nav-item-custom position-relative text-decoration-none">
                            <i class="bi bi-grid"></i>
                            <span class="badge-circle">{{ store.compare.length }}</span>
                            <span>Compare</span>
                        </router-link>

                        <router-link to="/wishlist" class="nav-item-custom position-relative text-decoration-none">
                            <i class="bi bi-heart"></i>
                            <span class="badge-circle">{{ store.wishlist.length }}</span>
                            <span>Wishlist</span>
                        </router-link>

                        <router-link to="/cart" class="nav-item-custom position-relative text-decoration-none">
                            <i class="bi bi-cart3"></i>
                            <span class="badge-circle">{{ store.cart.length }}</span>
                            <span>Cart</span>
                        </router-link>

                        <!-- User Authentication Menu -->
                        <div v-if="store.user" class="position-relative d-inline-block">
                            <button @click="toggleUserDropdown" class="nav-item-custom border-0 bg-transparent align-items-center" type="button">
                                <i class="bi bi-person-circle text-primary"></i>
                                <span>{{ store.user.name.split(' ')[0] }}</span>
                                <i class="bi bi-chevron-down ms-1" style="font-size: 10px;"></i>
                            </button>
                            <ul v-if="userDropdownOpen" class="dropdown-menu show dropdown-menu-end border-0 shadow p-2 rounded-4 position-absolute end-0 mt-2 animate-dropdown" style="background: rgba(255, 255, 255, 0.98); box-shadow: 0 15px 40px rgba(0,0,0,0.12) !important; min-width: 180px; z-index: 1000;">
                                <li>
                                    <router-link to="/orders" @click="userDropdownOpen = false" class="dropdown-item rounded-3 py-2 px-3 fw-semibold">
                                        <i class="bi bi-bag-check me-2"></i> My Orders
                                    </router-link>
                                </li>
                                <li v-if="store.user.email === 'admin@example.com'">
                                    <router-link to="/dashboard" @click="userDropdownOpen = false" class="dropdown-item rounded-3 py-2 px-3 fw-semibold text-primary">
                                        <i class="bi bi-speedometer2 me-2"></i> Admin Panel
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

                        <router-link v-else to="/login" class="nav-item-custom text-decoration-none">
                            <i class="bi bi-person"></i>
                            <span>Sign In</span>
                        </router-link>

                    </div>

                </div>

            </div>

        </div>

        <!-- Menu -->
        <div class="menu-bar">

            <div class="container">

                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">

                    <div class="d-flex align-items-center flex-wrap gap-4">

                        <router-link
                            to="/categories"
                            class="category-btn text-decoration-none"
                        >
                            <i class="bi bi-list"></i>
                            All Categories
                        </router-link>

                       

                            <router-link
                                to="/"
                                class="nav-link"
                            >
                                Home
                            </router-link>

                            <router-link
                                to="/laptops"
                                class="nav-link"
                            >
                                Laptops
                            </router-link>

                            <router-link
                                to="/brands"
                                class="nav-link"
                            >
                                Brands
                            </router-link>

                            <router-link
                                to="/accessories"
                                class="nav-link"
                            >
                                Accessories
                            </router-link>

                            <router-link
                                to="/deals"
                                class="nav-link"
                            >
                                Deals
                            </router-link>

                            <router-link
                                to="/support"
                                class="nav-link"
                            >
                                Support
                            </router-link>

                            <router-link
                                to="/cart"
                                class="nav-link fw-bold text-primary"
                            >
                                🛒 Cart
                            </router-link>

                         

                    </div>

                    <div class="sale-banner">
                        ☀ Summer Sale - Up to 30% Off
                    </div>

                </div>

            </div>

        </div>

    </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../utils/store'

const router = useRouter()
const route = useRoute()
const searchTerm = ref(String(route.query.search || ''))

const userDropdownOpen = ref(false)
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

const submitSearch = () => {
    const query = {}

    if (searchTerm.value.trim()) {
        query.search = searchTerm.value.trim()
    }

    router.push({ path: '/laptops', query })
}
</script>

<style scoped>
header {
    background: white;
}

.logo-box {
    width: 56px;
    height: 56px;
    border: 2px solid #2563eb;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2563eb;
    font-size: 30px;
}

.brand-name {
    font-weight: 800;
    color: #111827;
}
.router-link-active {
    color: #2563eb;
    font-weight: 700;
}
.search-wrapper {
    position: relative;
}

.search-input {
    height: 58px;
    border-radius: 50px;
    border: 1px solid #e5e7eb;
    padding-left: 25px;
    font-size: 16px;
}

.search-input:focus {
    box-shadow: none;
    border-color: #2563eb;
}

.search-btn {
    position: absolute;
    right: 7px;
    top: 7px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: none;
    background: #2563eb;
    color: white;
}

.nav-icons {
    font-size: 18px;
}

.nav-item-custom {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #111827;
    cursor: pointer;
    padding: 10px 14px;
    border-radius: 14px;
    transition: background 0.2s ease, color 0.2s ease;
}

.nav-item-custom:hover {
    background: #f8fafc;
    color: #2563eb;
}

.nav-item-custom span {
    font-weight: 600;
}

.badge-circle {
    position: absolute;
    top: -8px;
    left: 12px;
    background: #2563eb;
    color: white;
    font-size: 11px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-bar {
    border-top: 1px solid #eee;
}

.category-btn {
    border: none;
    background: #2563eb;
    color: white;
    border-radius: 14px;
    padding: 12px 25px;
    font-weight: 600;
}

.menu-link {
    color: #374151;
    text-decoration: none;
    font-weight: 500;
}

.menu-link.active {
    color: #2563eb;
}

.sale-banner {
    background: #eef4ff;
    color: #2563eb;
    padding: 12px 22px;
    border-radius: 14px;
    font-weight: 600;
}

.animate-dropdown {
    animation: fadeInDropdown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform-origin: top right;
}

@keyframes fadeInDropdown {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@media(max-width:991px) {
    .nav-icons {
        justify-content: center;
        margin-top: 20px;
    }
}
</style>