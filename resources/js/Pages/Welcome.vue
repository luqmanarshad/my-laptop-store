<template>
    <MainLayout>

        <!-- Hero Section -->
        <HeroSlider />

        <!-- Features -->
        <FeatureBar />

        <!-- Products Section -->
        <section class="container mt-5 mb-5 pb-5">

            <div class="row">

                <!-- Left Sidebar -->
                <div class="col-lg-3 mb-4">

                    <!-- Mobile category toggle -->
                    <button class="btn btn-outline-primary w-100 d-lg-none mb-3 d-flex justify-content-between align-items-center" @click="showCategories = !showCategories">
                        <span class="fw-bold"><i class="bi bi-grid-fill me-2"></i> Shop By Category</span>
                        <i class="bi" :class="showCategories ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    </button>

                    <div class="card border-0 shadow-sm rounded-4 p-4 sticky-lg-top" style="top: 100px;" :class="{'d-none d-lg-block': !showCategories}">
                        <h4 class="fw-bold mb-4 d-none d-lg-block">
                            Shop By Category
                        </h4>

                        <ul class="list-group list-group-flush category-list">
                            <li class="list-group-item border-0 ps-0 category-item">
                                <router-link to="/laptops?category=Gaming" class="text-decoration-none text-dark d-flex align-items-center">
                                    <span class="cat-icon bg-primary-subtle text-primary"><i class="bi bi-controller"></i></span>
                                    <span class="fw-medium">Gaming Laptops</span>
                                    <i class="bi bi-chevron-right ms-auto small text-muted"></i>
                                </router-link>
                            </li>
                            <li class="list-group-item border-0 ps-0 category-item">
                                <router-link to="/laptops?category=Business" class="text-decoration-none text-dark d-flex align-items-center">
                                    <span class="cat-icon bg-info-subtle text-info"><i class="bi bi-briefcase"></i></span>
                                    <span class="fw-medium">Business Laptops</span>
                                    <i class="bi bi-chevron-right ms-auto small text-muted"></i>
                                </router-link>
                            </li>
                            <li class="list-group-item border-0 ps-0 category-item">
                                <router-link to="/laptops?category=Student" class="text-decoration-none text-dark d-flex align-items-center">
                                    <span class="cat-icon bg-warning-subtle text-warning"><i class="bi bi-backpack"></i></span>
                                    <span class="fw-medium">Student Laptops</span>
                                    <i class="bi bi-chevron-right ms-auto small text-muted"></i>
                                </router-link>
                            </li>
                            <li class="list-group-item border-0 ps-0 category-item">
                                <router-link to="/laptops?brand=Apple" class="text-decoration-none text-dark d-flex align-items-center">
                                    <span class="cat-icon bg-secondary-subtle text-secondary"><i class="bi bi-apple"></i></span>
                                    <span class="fw-medium">MacBooks</span>
                                    <i class="bi bi-chevron-right ms-auto small text-muted"></i>
                                </router-link>
                            </li>
                            <li class="list-group-item border-0 ps-0 category-item">
                                <router-link to="/accessories" class="text-decoration-none text-dark d-flex align-items-center">
                                    <span class="cat-icon bg-danger-subtle text-danger"><i class="bi bi-mouse3"></i></span>
                                    <span class="fw-medium">Accessories</span>
                                    <i class="bi bi-chevron-right ms-auto small text-muted"></i>
                                </router-link>
                            </li>
                        </ul>
                    </div>

                </div>

                <!-- Products -->
                <div class="col-lg-9">

                    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                        <div>
                            <h2 class="fw-bold mb-1 d-flex align-items-center gap-2 text-dark">
                                Popular Laptops <i class="bi bi-stars text-warning fs-4"></i>
                            </h2>
                            <p class="text-muted mb-0" style="font-size: 0.9rem;">{{ message }}</p>
                        </div>

                        <div class="d-flex gap-2 align-items-center w-100 w-md-auto">
                            <div class="input-group search-group flex-grow-1 flex-md-grow-0">
                                <span class="input-group-text bg-white border-end-0 text-muted ps-3 rounded-start-pill">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    class="form-control border-start-0 ps-0 shadow-none rounded-end-pill"
                                    placeholder="Search laptops..."
                                    v-model="searchQuery"
                                    @keyup.enter="searchProducts"
                                />
                            </div>

                            <router-link
                                to="/laptops"
                                class="btn btn-primary rounded-pill px-3 px-md-4 text-nowrap d-flex align-items-center gap-2"
                            >
                                <span class="d-none d-sm-inline">View All</span>
                                <i class="bi bi-arrow-right d-sm-none"></i>
                            </router-link>
                        </div>

                    </div>

                    <!-- Loading -->
                    <div
                        v-if="loading"
                        class="text-center py-5 d-flex flex-column align-items-center"
                    >
                        <div class="spinner-border text-primary mb-3" role="status"></div>
                        <span class="text-muted">Loading best products...</span>
                    </div>

                    <!-- Products Grid -->
                    <div
                        v-else
                        class="row g-3 g-md-4"
                    >
                        <div
                            class="col-6 col-md-4 col-xl-3 fade-in-up"
                            v-for="(product, index) in products"
                            :key="product.id"
                            :style="{ animationDelay: `${index * 0.05}s` }"
                        >
                            <router-link
                                :to="`/product/${product.id}`"
                                class="text-decoration-none h-100 d-block"
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
                        
                        <!-- Empty State -->
                        <div v-if="products.length === 0" class="col-12 text-center py-5 bg-white rounded-4 shadow-sm border mt-3">
                            <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                            <h5 class="fw-bold">No products found</h5>
                            <p class="text-muted">Try a different search term or browse all laptops.</p>
                            <button class="btn btn-outline-primary rounded-pill px-4 mt-2" @click="searchQuery=''; searchProducts()">Clear Search</button>
                        </div>
                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase_config'
import { collection, getDocs, query, limit } from 'firebase/firestore'

import MainLayout from '../Layouts/MainLayout.vue'
import HeroSlider from '../Components/HeroSlider.vue'
import ProductCard from '../Components/ProductCard.vue'
import FeatureBar from '../Components/FeatureBar.vue'

const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const message = ref('Popular laptops hand-picked for you.')
const showCategories = ref(false)

const getProducts = async (params = {}) => {
    loading.value = true

    try {
        const q = query(collection(db, "products"), limit(12))
        const querySnapshot = await getDocs(q)
        const prods = []
        querySnapshot.forEach((doc) => {
            prods.push({ id: doc.id, ...doc.data() })
        })

        if (params.search) {
             products.value = prods.filter(p => p.title?.toLowerCase().includes(params.search.toLowerCase()))
        } else {
             products.value = prods
        }

        if (!products.value.length) {
            message.value = searchQuery.value
                ? 'No products found for that search.'
                : 'No products are currently available.'
        } else {
            message.value = searchQuery.value
                ? `Showing results for "${searchQuery.value}".`
                : 'Popular laptops hand-picked for you.'
        }
    } catch (error) {
        console.error('API Error:', error)
        message.value = 'Unable to load popular laptops right now.'
    } finally {
        loading.value = false
    }
}

const searchProducts = async () => {
    await getProducts({ search: searchQuery.value || undefined })
}

onMounted(() => {
    getProducts()
})
</script>

<style scoped>
.category-item {
    margin-bottom: 0.5rem;
    border-radius: 12px;
    transition: var(--transition);
}

.category-item a {
    padding: 0.5rem;
    border-radius: 12px;
}

.category-item:hover a {
    background-color: var(--bg);
    transform: translateX(5px);
}

.category-item:hover .bi-chevron-right {
    color: var(--primary) !important;
    transform: translateX(3px);
}

.cat-icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-right: 12px;
    font-size: 1.1rem;
}

.search-group {
    border: 1px solid #e2e8f0;
    border-radius: 50px;
    overflow: hidden;
    transition: var(--transition);
    max-width: 300px;
}

.search-group:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-glow);
}

@media (max-width: 767px) {
    .search-group {
        max-width: 100%;
    }
}
</style>