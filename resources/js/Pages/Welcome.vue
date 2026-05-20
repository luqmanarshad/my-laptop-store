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
                        class="d-flex justify-content-between align-items-center mb-4"
                    >

                        <h2 class="fw-bold">
                            Popular Laptops
                        </h2>

                        <button
                            class="btn btn-outline-primary rounded-pill px-4"
                        >
                            View All
                        </button>

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
                                    :title="product.title"
                                    :brand="product.brand?.name"
                                    :price="product.sale_price"
                                    :image="product.thumbnail"
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

const products = ref([])
const loading = ref(true)

const getProducts = async () => {

    try {

        const response = await axios.get(
            'http://127.0.0.1:8000/api/products'
        )

        products.value = response.data

        console.log(response.data)

    } catch (error) {

        console.error(
            'API Error:',
            error
        )

    } finally {

        loading.value = false
    }
}

onMounted(() => {
    getProducts()
})
</script>