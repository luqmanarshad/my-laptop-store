<template>
    <MainLayout>
        <section class="container py-5">
            <!-- Header -->
            <div class="text-center mb-5">
                <h1 class="wishlist-title fw-bold">My Wishlist</h1>
                <p class="text-muted fs-5">Your saved laptops and creators' notebooks are kept here.</p>
            </div>

            <!-- Empty Wishlist -->
            <div v-if="store.wishlist.length === 0" class="text-center py-5 empty-container rounded-4 shadow-sm p-5 bg-white">
                <div class="empty-icon mb-4"><i class="bi bi-heart"></i></div>
                <h3 class="fw-bold mb-3 text-dark">Your wishlist is empty</h3>
                <p class="text-muted mb-4 max-width-md mx-auto">Explore our laptop collections and save your favorite devices to keep track of specs and prices.</p>
                <router-link to="/laptops" class="btn browse-btn rounded-pill px-5 py-3">Browse Laptops</router-link>
            </div>

            <!-- Saved Products Grid -->
            <div v-else class="row g-4">
                <div 
                    class="col-xl-3 col-lg-4 col-md-6" 
                    v-for="product in store.wishlist" 
                    :key="product.id"
                >
                    <div class="h-100 position-relative">
                        <router-link
                            :to="`/product/${product.id}`"
                            class="text-decoration-none d-block h-100"
                        >
                            <ProductCard
                                :product="product"
                                :title="product.title"
                                :brand="product.brand?.name"
                                :price="product.sale_price || product.price"
                                :image="product.thumbnail || product.images?.[0]?.image"
                            />
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'
import ProductCard from '../Components/ProductCard.vue'
import { store } from '../utils/store'
</script>

<style scoped>
.wishlist-title {
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

@media (max-width: 768px) {
    .wishlist-title {
        font-size: 34px;
    }
}
</style>
