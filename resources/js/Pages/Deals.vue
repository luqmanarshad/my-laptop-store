<template>
    <MainLayout>
        <section class="container py-5">
            <div class="text-center mb-5">
                <h1 class="deals-title fw-bold display-4">Hot Deals 🔥</h1>
                <p class="text-muted fs-5">Save big on premium laptops with exclusive discounts</p>
            </div>

            <div class="row g-4">
                <div v-if="loading" class="text-center py-5 w-100">
                    <div class="spinner-border text-primary spinner-lg" role="status"></div>
                    <p class="text-muted mt-3">Fetching exclusive deals...</p>
                </div>
                
                <div v-else-if="deals.length === 0" class="text-center py-5 w-100">
                    <p class="text-muted">No discounted items available at the moment. Check back soon!</p>
                </div>

                <template v-else>
                    <div
                        class="col-xl-4 col-md-6"
                        v-for="product in deals"
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
                                :image="product.thumbnail"
                            />
                        </router-link>
                    </div>
                </template>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import MainLayout from '../Layouts/MainLayout.vue'
import ProductCard from '../Components/ProductCard.vue'

const products = ref([])
const loading = ref(true)

const fetchDeals = async () => {
    loading.value = true
    try {
        const response = await axios.get('/api/products?all=true')
        products.value = response.data
    } catch (error) {
        console.error('Failed to fetch products for deals:', error)
    } finally {
        loading.value = false
    }
}

const deals = computed(() => {
    return products.value.filter(p => p.sale_price !== null)
})

onMounted(() => {
    fetchDeals()
})
</script>

<style scoped>
.deals-title {
    background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>