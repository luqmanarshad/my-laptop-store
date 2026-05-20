<template>
    <MainLayout>
        <section class="container py-5">
            <div class="text-center mb-5">
                <h1 class="h2">Wishlist</h1>
                <p class="text-muted">Your saved laptops appear here.</p>
            </div>

            <div v-if="!products.length" class="text-center py-5">
                <p class="text-muted mb-3">Your wishlist is empty.</p>
                <router-link to="/laptops" class="btn btn-primary">Browse Laptops</router-link>
            </div>

            <div v-else class="row g-4">
                <div class="col-lg-4" v-for="product in products" :key="product.id">
                    <div class="card shadow-sm h-100">
                        <img :src="product.thumbnail || product.images?.[0]?.image" class="card-img-top" :alt="product.title" />
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">{{ product.title }}</h5>
                            <p class="text-muted mb-2">{{ product.brand?.name }} • {{ product.category?.name }}</p>
                            <p class="mb-2">${{ product.sale_price || product.price }}</p>
                            <p class="text-truncate mb-3">{{ product.description }}</p>

                            <div class="mt-auto d-flex gap-2">
                                <button class="btn btn-outline-secondary w-100" @click="removeProduct(product.id)">
                                    Remove
                                </button>
                                <router-link :to="`/product/${product.id}`" class="btn btn-primary w-100">
                                    View
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../Layouts/MainLayout.vue'
import { loadList, removeItem } from '../utils/localList'

const products = ref([])

const loadProducts = () => {
    products.value = loadList('wishlist')
}

const removeProduct = (id) => {
    removeItem('wishlist', id)
    loadProducts()
}

onMounted(() => {
    loadProducts()
})
</script>
