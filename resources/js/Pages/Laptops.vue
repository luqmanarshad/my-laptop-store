<template>
    <MainLayout>

        <section class="container py-4 py-lg-5">

            <!-- Header -->
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">

                <div>
                    <h1 class="fw-bold page-title mb-1">
                        Premium Laptops
                    </h1>

                    <p class="text-muted mb-0">
                        Discover powerful laptops for gaming,
                        business and productivity.
                    </p>
                </div>

                <div class="d-flex flex-wrap align-items-center gap-2 justify-content-md-end filter-controls">
                    <!-- Mobile Filter Toggle -->
                    <button class="btn btn-outline-primary d-lg-none" @click="mobileFiltersOpen = true">
                        <i class="bi bi-funnel"></i> Filters
                    </button>
                    
                    <div class="search-input-wrapper flex-grow-1 flex-md-grow-0">
                        <i class="bi bi-search search-icon"></i>
                        <input
                            type="search"
                            class="form-control search-input"
                            v-model="searchQuery"
                            placeholder="Search laptops..."
                        />
                    </div>

                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill d-none d-sm-inline-block">
                        {{ productCount }} products
                    </span>

                    <select class="form-select per-page-select d-none d-md-block" v-model.number="perPage">
                        <option :value="12">12 / page</option>
                        <option :value="24">24 / page</option>
                        <option :value="36">36 / page</option>
                    </select>

                    <select class="form-select sort-box" v-model="selectedSort">
                        <option value="latest">Sort: Latest</option>
                        <option value="low">Price: Low to High</option>
                        <option value="high">Price: High to Low</option>
                    </select>
                </div>

            </div>

            <div v-if="activeFilters.length" class="mb-4 d-flex flex-wrap align-items-center gap-2 bg-white p-3 rounded-4 shadow-sm border">
                <span class="text-muted me-2 small fw-semibold"><i class="bi bi-funnel-fill me-1"></i> Active filters:</span>
                <span
                    class="badge bg-light text-dark border px-2 py-1 rounded-pill fw-medium d-flex align-items-center"
                    v-for="filter in activeFilters"
                    :key="filter"
                >
                    {{ filter }}
                </span>
                <button
                    class="btn btn-sm btn-link text-danger text-decoration-none ms-auto fw-medium"
                    @click="clearFilters"
                >
                    Clear All
                </button>
            </div>

            <div class="row">

                <!-- Mobile Filter Backdrop -->
                <div v-if="mobileFiltersOpen" class="mobile-filter-backdrop d-lg-none" @click="mobileFiltersOpen = false"></div>

                <!-- Sidebar Filters -->
                <div class="col-lg-3 filter-sidebar-wrapper" :class="{ 'open': mobileFiltersOpen }">

                    <div class="filter-card h-100 overflow-auto">
                        
                        <!-- Mobile Header -->
                        <div class="d-flex justify-content-between align-items-center d-lg-none mb-4 pb-3 border-bottom">
                            <h4 class="fw-bold mb-0">Filters</h4>
                            <button class="btn-close" @click="mobileFiltersOpen = false"></button>
                        </div>

                        <h4 class="fw-bold mb-4 d-none d-lg-block d-flex align-items-center">
                            <i class="bi bi-sliders text-primary me-2"></i> Filters
                        </h4>

                        <!-- Brand Filter -->
                        <div class="filter-section mb-4">
                            <h6 class="fw-bold d-flex justify-content-between align-items-center cursor-pointer" @click="toggleSection('brand')">
                                Brand
                                <i class="bi" :class="sections.brand ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                            </h6>

                            <div class="filter-options mt-3" v-show="sections.brand">
                                <div class="form-check custom-check mb-2" v-for="brand in availableBrands" :key="brand.name">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        :value="brand.name"
                                        v-model="selectedBrands"
                                        :id="`brand-${brand.name}`"
                                        :disabled="!selectedBrands.includes(brand.name) && brand.count === 0"
                                    >
                                    <label class="form-check-label d-flex justify-content-between text-muted" :for="`brand-${brand.name}`">
                                        {{ brand.name }}
                                        <span class="badge bg-light text-secondary rounded-pill border">{{ brand.count }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr class="border-light opacity-100 my-4">

                        <!-- Category Filter -->
                        <div class="filter-section mb-4">
                            <h6 class="fw-bold d-flex justify-content-between align-items-center cursor-pointer" @click="toggleSection('category')">
                                Category
                                <i class="bi" :class="sections.category ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                            </h6>

                            <div class="filter-options mt-3" v-show="sections.category">
                                <div class="form-check custom-check mb-2" v-for="category in availableCategories" :key="category.name">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        :value="category.name"
                                        v-model="selectedCategories"
                                        :id="`category-${category.name}`"
                                        :disabled="!selectedCategories.includes(category.name) && category.count === 0"
                                    >
                                    <label class="form-check-label d-flex justify-content-between text-muted" :for="`category-${category.name}`">
                                        {{ category.name }}
                                        <span class="badge bg-light text-secondary rounded-pill border">{{ category.count }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr class="border-light opacity-100 my-4">

                        <!-- Price Filter -->
                        <div class="filter-section mb-4">
                            <h6 class="fw-bold d-flex justify-content-between align-items-center cursor-pointer" @click="toggleSection('price')">
                                Price
                                <i class="bi" :class="sections.price ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                            </h6>

                            <div class="filter-options mt-3" v-show="sections.price">
                                <div class="price-labels d-flex justify-content-between mb-2 text-primary fw-bold">
                                    <span>Rs. {{ formatCurrency(priceRange.min, {minimumFractionDigits:0,maximumFractionDigits:0}) }}</span>
                                    <span>Rs. {{ formatCurrency(selectedPriceMax, {minimumFractionDigits:0,maximumFractionDigits:0}) }}</span>
                                </div>

                                <input
                                    type="range"
                                    class="form-range custom-range"
                                    :min="priceRange.min"
                                    :max="priceRange.max"
                                    v-model.number="selectedPriceMax"
                                >
                            </div>
                        </div>

                        <button
                            class="btn btn-primary w-100 mt-4 py-2 fw-bold d-lg-none"
                            @click="mobileFiltersOpen = false"
                        >
                            Apply Filters
                        </button>
                        <button
                            class="btn btn-outline-secondary w-100 mt-2 py-2"
                            @click="clearFilters"
                        >
                            Clear Filters
                        </button>

                    </div>

                </div>

                <!-- Products -->
                <div class="col-lg-9">

                    <div class="row g-3 g-md-4">

                        <div v-if="loading" class="col-12 text-center py-5">
                            <div class="spinner-border text-primary mb-3" role="status"></div>
                            <p class="text-muted">Loading laptops...</p>
                        </div>

                        <div v-else-if="products.length === 0" class="col-12 text-center py-5 bg-white rounded-4 border shadow-sm mt-2">
                            <div class="py-5">
                                <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                                <h4 class="fw-bold">No laptops match your filters</h4>
                                <p class="text-muted mb-4">Try adjusting your price range, or removing some brand/category filters.</p>
                                <button class="btn btn-primary rounded-pill px-4" @click="clearFilters">Clear All Filters</button>
                            </div>
                        </div>

                        <template v-else>
                            <div
                                class="col-6 col-md-4 fade-in-up"
                                v-for="(product, index) in products"
                                :key="product.id"
                                :style="{ animationDelay: `${index * 0.05}s` }"
                            >
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
                        </template>

                    </div>

                    <!-- Pagination -->
                    <div v-if="products.length > 0" class="mt-5 d-flex justify-content-center">
                        <div class="pagination-wrapper bg-white shadow-sm rounded-pill p-2 border d-inline-flex gap-1">
                            <button
                                class="btn btn-icon rounded-circle"
                                :disabled="!hasPreviousPage"
                                @click="goToPage(currentPage - 1)"
                            >
                                <i class="bi bi-chevron-left"></i>
                            </button>

                            <template v-for="page in pageNumbers" :key="page">
                                <button
                                    v-if="page !== '...'"
                                    type="button"
                                    class="btn rounded-circle page-btn"
                                    :class="page === currentPage ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'"
                                    @click="goToPage(page)"
                                >
                                    {{ page }}
                                </button>
                                <span v-else class="btn disabled px-1 text-muted border-0">…</span>
                            </template>

                            <button
                                class="btn btn-icon rounded-circle"
                                :disabled="!hasNextPage"
                                @click="goToPage(currentPage + 1)"
                            >
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase_config'
import { collection, getDocs } from 'firebase/firestore'

import MainLayout from '../Layouts/MainLayout.vue'
import ProductCard from '../Components/ProductCard.vue'
import { formatCurrency } from '../utils/format'

const route = useRoute()
const brands = ref([])
const categories = ref([])
const products = ref([])
const loading = ref(true)
const selectedBrands = ref([])
const selectedCategories = ref([])
const selectedPriceMax = ref(0)
const selectedSort = ref('latest')
const searchQuery = ref(String(route.query.search || ''))
const currentPage = ref(Number(route.query.page || 1))
const perPage = ref(Number(route.query.per_page || 12))
const pagination = ref({})
const priceRange = ref({ min: 0, max: 0 })

const mobileFiltersOpen = ref(false)
const sections = ref({
    brand: true,
    category: true,
    price: true
})

const toggleSection = (section) => {
    sections.value[section] = !sections.value[section]
}

const availableBrands = computed(() => brands.value)
const availableCategories = computed(() => categories.value)

const activeFilters = computed(() => {
    const filters = []
    if (searchQuery.value.trim()) filters.push(`Search: ${searchQuery.value.trim()}`)
    if (selectedBrands.value.length) filters.push(`Brand: ${selectedBrands.value.join(', ')}`)
    if (selectedCategories.value.length) filters.push(`Category: ${selectedCategories.value.join(', ')}`)
    if (selectedPriceMax.value < priceRange.value.max) filters.push(`Up to $${selectedPriceMax.value}`)
    return filters
})

const productCount = computed(() => pagination.value.total || products.value.length)

const clearFilters = () => {
    selectedBrands.value = []
    selectedCategories.value = []
    selectedPriceMax.value = priceRange.value.max
    selectedSort.value = 'latest'
    searchQuery.value = ''
    currentPage.value = 1
}

const updatePriceRange = (minPrice = 0, maxPrice = 0) => {
    if (minPrice === null || maxPrice === null || maxPrice === 0) {
        priceRange.value = { min: 0, max: 0 }
        selectedPriceMax.value = 0
        return
    }
    priceRange.value = { min: minPrice, max: maxPrice }
    if (selectedPriceMax.value === 0 || selectedPriceMax.value > maxPrice) {
        selectedPriceMax.value = maxPrice
    }
}

const getProducts = async () => {
    loading.value = true
    try {
        const querySnapshot = await getDocs(collection(db, "products"))
        let prods = []
        querySnapshot.forEach((doc) => {
            prods.push({ id: doc.id, ...doc.data() })
        })

        if (searchQuery.value) {
            prods = prods.filter(p => p.title?.toLowerCase().includes(searchQuery.value.toLowerCase()))
        }
        if (selectedBrands.value.length) {
            prods = prods.filter(p => p.brand && selectedBrands.value.includes(p.brand.name))
        }
        if (selectedCategories.value.length) {
            prods = prods.filter(p => p.category && selectedCategories.value.includes(p.category.name))
        }
        if (selectedPriceMax.value && selectedPriceMax.value < priceRange.value.max) {
             prods = prods.filter(p => (p.sale_price || p.price) <= selectedPriceMax.value)
        }

        if (selectedSort.value === 'low') {
             prods.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
        } else if (selectedSort.value === 'high') {
             prods.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
        }

        products.value = prods
        pagination.value = {
            total: prods.length,
            current_page: 1,
            last_page: 1
        }
    } catch (error) {
        console.error('Unable to load laptops:', error)
    } finally {
        loading.value = false
    }
}

const getFilterMetadata = async () => {
    brands.value = [
        { name: 'Apple', count: 1 },
        { name: 'HP', count: 1 },
        { name: 'Dell', count: 1 },
        { name: 'Lenovo', count: 1 },
        { name: 'ASUS', count: 1 },
        { name: 'MSI', count: 0 }
    ]
    categories.value = [
        { name: 'Gaming', count: 1 },
        { name: 'Business', count: 1 },
        { name: 'Student', count: 1 },
        { name: 'Creator', count: 1 }
    ]
    updatePriceRange(200, 5000)
}

watch([
    selectedBrands,
    selectedCategories,
    selectedPriceMax,
    searchQuery,
], async () => {
    if (currentPage.value !== 1) {
        currentPage.value = 1
    } else {
        await getProducts()
    }
})

watch(
    () => route.query.search,
    (newSearch) => {
        searchQuery.value = String(newSearch || '')
        if (currentPage.value !== 1) {
            currentPage.value = 1
        }
    }
)

watch([
    selectedSort,
    perPage,
], getProducts)

watch(currentPage, getProducts)

const hasPreviousPage = computed(() => false)
const hasNextPage = computed(() => false)
const pageNumbers = computed(() => [1])

const goToPage = (page) => {
    currentPage.value = 1
}

// Lock body scroll when mobile filter is open
watch(mobileFiltersOpen, (isOpen) => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

onMounted(() => {
    if (route.query.brand) selectedBrands.value = Array.isArray(route.query.brand) ? route.query.brand : [route.query.brand]
    if (route.query.category) selectedCategories.value = Array.isArray(route.query.category) ? route.query.category : [route.query.category]
    getFilterMetadata()
    getProducts()
})
</script>

<style scoped>
.page-title {
    font-size: 2.2rem;
    color: var(--dark);
    letter-spacing: -0.5px;
}

.search-input-wrapper {
    position: relative;
    max-width: 250px;
}

.search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
}

.search-input {
    padding-left: 38px;
    border-radius: 999px;
    border: 1px solid #e2e8f0;
    transition: var(--transition);
}

.search-input:focus {
    box-shadow: 0 0 0 3px var(--primary-glow);
    border-color: var(--primary);
}

.sort-box {
    border-radius: 999px;
    width: auto;
    min-width: 170px;
    border-color: #e2e8f0;
    cursor: pointer;
}

.per-page-select {
    border-radius: 999px;
    width: 120px;
    border-color: #e2e8f0;
}

/* Sidebar Styles */
.filter-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    border: 1px solid rgba(226, 232, 240, 0.8);
    box-shadow: var(--shadow-sm);
}

.cursor-pointer {
    cursor: pointer;
    user-select: none;
}

.cursor-pointer:hover {
    color: var(--primary);
}

.custom-check .form-check-input {
    width: 1.2em;
    height: 1.2em;
    margin-top: 0.15em;
    border-color: #cbd5e1;
}

.custom-check .form-check-input:checked {
    background-color: var(--primary);
    border-color: var(--primary);
}

.custom-range::-webkit-slider-thumb {
    background: var(--primary);
}

/* Pagination */
.page-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.btn-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--dark);
    border: none;
}

.btn-icon:hover:not(:disabled) {
    background: #f1f5f9;
}

/* Mobile Filter Drawer */
@media (max-width: 991px) {
    .page-title {
        font-size: 1.8rem;
    }

    .filter-controls {
        width: 100%;
        justify-content: space-between !important;
    }

    .search-input-wrapper {
        max-width: 100%;
    }

    .sort-box {
        flex-grow: 1;
    }

    .mobile-filter-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(4px);
        z-index: 1040;
    }

    .filter-sidebar-wrapper {
        position: fixed;
        top: 0;
        right: -100%;
        width: 85%;
        max-width: 350px;
        height: 100vh;
        z-index: 1050;
        transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        padding: 0;
    }

    .filter-sidebar-wrapper.open {
        right: 0;
    }

    .filter-card {
        border-radius: 0;
        height: 100%;
        border: none;
        box-shadow: -10px 0 30px rgba(0,0,0,0.1);
    }
}
</style>