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
                        >

                        <button class="search-btn">
                            <i class="bi bi-search"></i>
                        </button>

                    </div>

                </div>

                <!-- Icons -->
                <div class="col-lg-5">

                    <div class="d-flex justify-content-lg-end justify-content-center gap-4 nav-icons flex-wrap">

                        <div class="nav-item-custom">
                            <i class="bi bi-grid"></i>
                            <span>Compare</span>
                        </div>

                        <div class="nav-item-custom position-relative">

                            <i class="bi bi-heart"></i>

                            <span class="badge-circle">
                                3
                            </span>

                            <span>Wishlist</span>

                        </div>

                        <div class="nav-item-custom position-relative">

                            <i class="bi bi-cart3"></i>

                            <span class="badge-circle">
                                2
                            </span>

                            <span>Cart</span>

                        </div>

                        <div class="nav-item-custom">
                            <i class="bi bi-person"></i>
                            <span>Sign In</span>
                        </div>

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
    display: flex;
    align-items: center;
    gap: 8px;
    color: #111827;
    cursor: pointer;
}

.badge-circle {
    position: absolute;
    top: -10px;
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

@media(max-width:991px) {
    .nav-icons {
        justify-content: center;
        margin-top: 20px;
    }
}
</style>