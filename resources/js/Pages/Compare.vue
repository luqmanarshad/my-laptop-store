<template>
    <MainLayout>
        <section class="container py-5">
            <!-- Header -->
            <div class="text-center mb-5">
                <h1 class="compare-title fw-bold">Compare Laptops</h1>
                <p class="text-muted fs-5">Compare technical specifications side-by-side to make the perfect choice.</p>
            </div>

            <!-- Empty State -->
            <div v-if="store.compare.length === 0" class="text-center py-5 empty-container rounded-4 shadow-sm p-5 bg-white">
                <div class="empty-icon mb-4"><i class="bi bi-grid-3x3-gap"></i></div>
                <h3 class="fw-bold mb-3 text-dark">Your comparison list is empty</h3>
                <p class="text-muted mb-4 max-width-md mx-auto">Add up to 3 laptops from the store to compare their processor, ram, graphics, storage, and price instantly.</p>
                <router-link to="/laptops" class="btn browse-btn rounded-pill px-5 py-3">Browse Laptops</router-link>
            </div>

            <!-- Compare Table Layout -->
            <div v-else class="comparison-wrapper bg-white shadow rounded-4 p-4 p-lg-5 border overflow-hidden">
                <div class="table-responsive">
                    <table class="table align-middle text-center compare-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col" class="spec-label-col border-0"></th>
                                <th scope="col" v-for="product in store.compare" :key="product.id" class="product-col border-0">
                                    <div class="product-header-card position-relative p-3 rounded-4">
                                        <button 
                                            class="btn-close remove-compare-btn shadow-sm position-absolute" 
                                            @click="store.toggleCompare(product)"
                                            title="Remove product"
                                        ></button>
                                        <div class="img-wrapper mb-3 p-2 bg-white rounded-3">
                                            <img :src="product.thumbnail || product.images?.[0]?.image" class="compare-img" :alt="product.title" />
                                        </div>
                                        <h5 class="fw-bold text-dark text-truncate px-2 mb-1">{{ product.title }}</h5>
                                        <span class="badge bg-light text-primary border rounded-pill px-3 py-1 mb-2">{{ product.brand?.name }}</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Processor -->
                            <tr>
                                <td class="spec-title text-start fw-bold text-muted ps-3">Processor</td>
                                <td v-for="product in store.compare" :key="product.id" class="spec-value text-dark font-medium">
                                    {{ product.specification?.processor || 'N/A' }}
                                </td>
                            </tr>
                            <!-- RAM -->
                            <tr>
                                <td class="spec-title text-start fw-bold text-muted ps-3">RAM</td>
                                <td v-for="product in store.compare" :key="product.id" class="spec-value text-dark font-medium">
                                    {{ product.specification?.ram || 'N/A' }}
                                </td>
                            </tr>
                            <!-- Storage -->
                            <tr>
                                <td class="spec-title text-start fw-bold text-muted ps-3">Storage</td>
                                <td v-for="product in store.compare" :key="product.id" class="spec-value text-dark font-medium">
                                    {{ product.specification?.storage || 'N/A' }}
                                </td>
                            </tr>
                            <!-- Graphics -->
                            <tr>
                                <td class="spec-title text-start fw-bold text-muted ps-3">Graphics</td>
                                <td v-for="product in store.compare" :key="product.id" class="spec-value text-dark font-medium">
                                    {{ product.specification?.graphics || 'N/A' }}
                                </td>
                            </tr>
                            <!-- Display -->
                            <tr>
                                <td class="spec-title text-start fw-bold text-muted ps-3">Display</td>
                                <td v-for="product in store.compare" :key="product.id" class="spec-value text-dark font-medium">
                                    {{ product.specification?.display || 'N/A' }}
                                </td>
                            </tr>
                            <!-- Price -->
                            <tr>
                                <td class="spec-title text-start fw-bold text-muted ps-3">Price</td>
                                <td v-for="product in store.compare" :key="product.id" class="spec-price fw-extrabold fs-4 text-primary">
                                    ${{ product.sale_price || product.price }}
                                </td>
                            </tr>
                            <!-- Actions -->
                            <tr>
                                <td class="spec-title border-0"></td>
                                <td v-for="product in store.compare" :key="product.id" class="border-0 py-4">
                                    <div class="d-flex flex-column gap-2 px-3">
                                        <button 
                                            class="btn btn-primary rounded-pill py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                            @click="store.addToCart(product.id)"
                                        >
                                            <i class="bi bi-cart3"></i>
                                            <span>Add to Cart</span>
                                        </button>
                                        <router-link 
                                            :to="`/product/${product.id}`" 
                                            class="btn btn-outline-secondary rounded-pill py-2.5 fw-semibold"
                                        >
                                            View Details
                                        </router-link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'
import { store } from '../utils/store'
</script>

<style scoped>
.compare-title {
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

.comparison-wrapper {
    border: 1px solid rgba(226, 232, 240, 0.8);
}

.compare-table th {
    vertical-align: bottom;
}

.spec-label-col {
    width: 20%;
    min-width: 140px;
}

.product-col {
    width: 26.6%;
    min-width: 250px;
}

.product-header-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.remove-compare-btn {
    top: 12px;
    right: 12px;
    background-color: white;
    padding: 8px;
    border-radius: 50%;
    opacity: 0.7;
    transition: all 0.2s ease;
}

.remove-compare-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.img-wrapper {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
}

.compare-img {
    max-height: 110px;
    max-width: 100%;
    object-fit: contain;
}

.spec-title {
    background-color: #f8fafc;
    padding: 18px 15px;
    border-bottom: 1px solid #edf2f7;
    font-size: 14px;
}

.spec-value {
    padding: 18px 15px;
    border-bottom: 1px solid #edf2f7;
    font-size: 15px;
}

.spec-price {
    padding: 22px 15px;
    border-bottom: 1px solid #edf2f7;
}

@media (max-width: 768px) {
    .compare-title {
        font-size: 34px;
    }
}
</style>
