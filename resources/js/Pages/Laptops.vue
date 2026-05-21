<template>
    <MainLayout>

        <section class="container py-5">

            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-3">

                <div>
                    <h1 class="fw-bold page-title">
                        Premium Laptops
                    </h1>

                    <p class="text-muted">
                        Discover powerful laptops for gaming,
                        business and productivity.
                    </p>
                </div>

                <div class="d-flex align-items-center gap-2 w-100 justify-content-end flex-wrap">
                    <input
                        type="search"
                        class="form-control search-input"
                        v-model="searchQuery"
                        placeholder="Search laptops..."
                    />

                    <span class="badge bg-primary text-white fs-6">
                        {{ productCount }} products
                    </span>

                    <select class="form-select per-page-select" v-model.number="perPage">
                        <option :value="12">12 / page</option>
                        <option :value="24">24 / page</option>
                        <option :value="36">36 / page</option>
                    </select>

                    <select class="form-select sort-box" v-model="selectedSort">
                        <option value="latest">Sort By Latest</option>
                        <option value="low">Low to High</option>
                        <option value="high">High to Low</option>
                    </select>
                </div>

            </div>

            <div v-if="activeFilters.length" class="mb-4 d-flex flex-wrap align-items-center gap-2">
                <span class="text-muted me-2">Active filters:</span>
                <span
                    class="badge bg-secondary"
                    v-for="filter in activeFilters"
                    :key="filter"
                >
                    {{ filter }}
                </span>
                <button
                    class="btn btn-sm btn-outline-primary ms-2"
                    @click="clearFilters"
                >
                    Clear Filters
                </button>
            </div>

            <div class="row">

                <!-- Sidebar -->
                <div class="col-lg-3 mb-4">

                    <div class="filter-card">

                        <h4 class="fw-bold mb-4">
                            Filters
                        </h4>

                        <div class="mb-4">

                            <h6 class="fw-bold">
                                Brand
                            </h6>

                            <div class="form-check" v-for="brand in availableBrands" :key="brand.name">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    :value="brand.name"
                                    v-model="selectedBrands"
                                    :id="`brand-${brand.name}`"
                                    :disabled="!selectedBrands.includes(brand.name) && brand.count === 0"
                                >
                                <label class="form-check-label" :for="`brand-${brand.name}`">
                                    {{ brand.name }}
                                    <small class="text-muted">({{ brand.count }})</small>
                                </label>
                            </div>

                        </div>

                    <div class="mt-4">

                        <h6 class="fw-bold">
                            Category
                        </h6>

                        <div class="form-check" v-for="category in availableCategories" :key="category.name">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :value="category.name"
                                v-model="selectedCategories"
                                :id="`category-${category.name}`"
                                :disabled="!selectedCategories.includes(category.name) && category.count === 0"
                            >
                            <label class="form-check-label" :for="`category-${category.name}`">
                                {{ category.name }}
                                <small class="text-muted">({{ category.count }})</small>
                            </label>
                        </div>

                    </div>

                    <div class="mt-4">

                        <h6 class="fw-bold">
                            Price
                        </h6>

                        <div class="d-flex justify-content-between mb-2">
                            <small>${{ priceRange.min }}</small>
                            <small>${{ selectedPriceMax }}</small>
                        </div>

                        <input
                            type="range"
                            class="form-range"
                            :min="priceRange.min"
                            :max="priceRange.max"
                            v-model.number="selectedPriceMax"
                        >

                    </div>

                    <button
                        class="btn btn-outline-secondary w-100 mt-4"
                        @click="clearFilters"
                    >
                        Clear Filters
                    </button>

                </div>

                </div>

                <!-- Products -->
                <div class="col-lg-9">

                    <div class="row g-4">

                        <div v-if="loading" class="text-center py-5">
                            Loading laptops...
                        </div>

                        <div v-else-if="products.length === 0" class="text-center py-5">
                            No laptops match your filters.
                        </div>

                        <template v-else>
                            <div
                                class="col-xl-4 col-md-6"
                                v-for="product in products"
                                :key="product.id"
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

                </div>

                <div class="col-12 mt-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <button
                            class="btn btn-outline-primary"
                            :disabled="!hasPreviousPage"
                            @click="goToPage(currentPage - 1)"
                        >
                            Previous
                        </button>

                        <div class="pagination-buttons btn-group">
                            <template v-for="page in pageNumbers" :key="page">
                                <button
                                    v-if="page !== '...'"
                                    type="button"
                                    class="btn"
                                    :class="page === currentPage ? 'btn-primary text-white' : 'btn-outline-secondary'"
                                    @click="goToPage(page)"
                                >
                                    {{ page }}
                                </button>

                                <span
                                    v-else
                                    class="btn btn-outline-secondary disabled"
                                >
                                    …
                                </span>
                            </template>
                        </div>

                        <button
                            class="btn btn-outline-primary"
                            :disabled="!hasNextPage"
                            @click="goToPage(currentPage + 1)"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { addItem, removeItem, hasItem } from '../utils/localList'

import MainLayout from '../Layouts/MainLayout.vue'
import ProductCard from '../Components/ProductCard.vue'

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

const availableBrands = computed(() => brands.value)

const availableCategories = computed(() => categories.value)

const activeFilters = computed(() => {
    const filters = []

    if (searchQuery.value.trim()) {
        filters.push(`Search: ${searchQuery.value.trim()}`)
    }

    if (selectedBrands.value.length) {
        filters.push(`Brand: ${selectedBrands.value.join(', ')}`)
    }

    if (selectedCategories.value.length) {
        filters.push(`Category: ${selectedCategories.value.join(', ')}`)
    }

    if (selectedPriceMax.value < priceRange.value.max) {
        filters.push(`Price up to $${selectedPriceMax.value}`)
    }

    if (selectedSort.value !== 'latest') {
        filters.push(selectedSort.value === 'low' ? 'Price: Low to High' : 'Price: High to Low')
    }

    return filters
})

const toggleWishlist = (product) => {
    if (hasItem('wishlist', product.id)) {
        removeItem('wishlist', product.id)
    } else {
        addItem('wishlist', product)
    }
}

const toggleCompare = (product) => {
    if (hasItem('compare', product.id)) {
        removeItem('compare', product.id)
    } else {
        addItem('compare', product)
    }
}

const productCount = computed(() => pagination.value.total || products.value.length)

const buildQueryParams = () => {
    return {
        search: searchQuery.value || undefined,
        brand: selectedBrands.value.length ? selectedBrands.value : undefined,
        category: selectedCategories.value.length ? selectedCategories.value : undefined,
        max_price: selectedPriceMax.value || undefined,
        sort: selectedSort.value !== 'latest' ? selectedSort.value : undefined,
        page: currentPage.value,
        per_page: perPage.value,
    }
}

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
        const response = await axios.get('/api/products', {
            params: buildQueryParams(),
        })

        products.value = response.data.data
        pagination.value = response.data
    } catch (error) {
        console.error('Unable to load laptops:', error)
    } finally {
        loading.value = false
    }
}

const getFilterMetadata = async () => {
    try {
        const response = await axios.get('/api/products/filters', {
            params: {
                search: searchQuery.value || undefined,
                brand: selectedBrands.value.length ? selectedBrands.value : undefined,
                category: selectedCategories.value.length ? selectedCategories.value : undefined,
                max_price: selectedPriceMax.value || undefined,
            },
        })

        brands.value = response.data.brands || []
        categories.value = response.data.categories || []

        const { min, max } = response.data.price_range || { min: 0, max: 0 }
        updatePriceRange(min, max)
    } catch (error) {
        console.error('Unable to load product filter options:', error)
    }
}

watch([
    selectedBrands,
    selectedCategories,
    selectedPriceMax,
    searchQuery,
], async () => {
    await getFilterMetadata()

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

const hasPreviousPage = computed(() => pagination.value.current_page > 1)
const hasNextPage = computed(() => pagination.value.current_page < pagination.value.last_page)

const pageNumbers = computed(() => {
    const last = pagination.value.last_page || 1
    const current = currentPage.value
    const delta = 2
    const range = []

    for (let i = Math.max(1, current - delta); i <= Math.min(last, current + delta); i += 1) {
        range.push(i)
    }

    if (range[0] > 2) {
        range.unshift('...')
        range.unshift(1)
    } else if (range[0] === 2) {
        range.unshift(1)
    }

    if (range[range.length - 1] < last - 1) {
        range.push('...')
        range.push(last)
    } else if (range[range.length - 1] === last - 1) {
        range.push(last)
    }

    return range
})

const goToPage = (page) => {
    if (page === '...' || page < 1 || page > pagination.value.last_page) {
        return
    }

    currentPage.value = page
}

onMounted(() => {
    if (route.query.brand) {
        selectedBrands.value = Array.isArray(route.query.brand) ? route.query.brand : [route.query.brand]
    }
    if (route.query.category) {
        selectedCategories.value = Array.isArray(route.query.category) ? route.query.category : [route.query.category]
    }
    getFilterMetadata()
    getProducts()
})

</script>

<style scoped>
.page-title{
    font-size:42px;
}

.sort-box{
    width:220px;
    border-radius:14px;
}

.filter-card{
    background:white;
    border-radius:25px;
    padding:30px;
    box-shadow:0 5px 25px rgba(0,0,0,.05);
}

.search-input {
    min-width: 220px;
    max-width: 320px;
    border-radius: 999px;
}

.per-page-select {
    width: 140px;
}
</style>