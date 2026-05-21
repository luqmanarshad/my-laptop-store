<template>
    <MainLayout>

        <!-- Hero Section -->
        <HeroSlider />

        <!-- Features -->
        <FeatureBar />

        <!-- Products Section -->
        <section class="container mt-5">

            <div class="row">

                <!-- Left Sidebar -->
                <div class="col-lg-3 mb-4">

                    <div
                        class="card border-0 shadow-sm rounded-4 p-4"
                    >

                        <h4 class="fw-bold mb-4">
                            Shop By Category
                        </h4>

                        <ul
                            class="list-group list-group-flush"
                        >

                            <li
                                class="list-group-item border-0 ps-0"
                            >
                                💻 Gaming Laptops
                            </li>

                            <li
                                class="list-group-item border-0 ps-0"
                            >
                                🏢 Business Laptops
                            </li>

                            <li
                                class="list-group-item border-0 ps-0"
                            >
                                🎓 Student Laptops
                            </li>

                            <li
                                class="list-group-item border-0 ps-0"
                            >
                                🍎 MacBooks
                            </li>

                            <li
                                class="list-group-item border-0 ps-0"
                            >
                                ⚡ Accessories
                            </li>

                        </ul>

                    </div>

                </div>

                <!-- Products -->
                <div class="col-lg-9">

                    <div
                        class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
                    >

                        <div>
                            <h2 class="fw-bold">
                                Popular Laptops
                            </h2>
                            <p class="text-muted mb-0">{{ message }}</p>
                        </div>

                        <div class="d-flex gap-2 flex-wrap align-items-center">
                            <input
                                type="search"
                                class="form-control search-input"
                                placeholder="Search popular laptops..."
                                v-model="searchQuery"
                                @keyup.enter="searchProducts"
                            />

                            <button class="btn btn-primary" type="button" @click="searchProducts">
                                Search
                            </button>

                            <router-link
                                to="/laptops"
                                class="btn btn-outline-primary rounded-pill px-4"
                            >
                                View All
                            </router-link>
                        </div>

                    </div>

                    <!-- Loading -->
                    <div
                        v-if="loading"
                        class="text-center py-5"
                    >
                        Loading products...
                    </div>

                    <!-- Products Grid -->
                    <div
                        v-else
                        class="row g-4"
                    >

                        <div
                            class="col-lg-4 col-md-6"
                            v-for="product in products"
                            :key="product.id"
                        >

                            <router-link
                                :to="`/product/${product.id}`"
                                class="text-decoration-none"
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

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import MainLayout from '../Layouts/MainLayout.vue'
import HeroSlider from '../Components/HeroSlider.vue'
import ProductCard from '../Components/ProductCard.vue'
import FeatureBar from '../Components/FeatureBar.vue'
import { addItem } from '../utils/localList'

const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const message = ref('Popular laptops hand-picked for you.')

const getProducts = async (params = {}) => {
    loading.value = true

    try {
        const response = await axios.get('/api/products', {
            params: {
                per_page: 8,
                ...params,
            },
        })

        products.value = response.data.data

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

const addToWishlist = (product) => {
    addItem('wishlist', product)
}

const addToCompare = (product) => {
    addItem('compare', product)
}

onMounted(() => {
    getProducts()
})
</script>