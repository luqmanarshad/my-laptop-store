<template>
    <MainLayout>
        <section class="container py-5">
            <div class="row g-5">
                <!-- Image -->
                <div class="col-lg-6">
                    <div class="image-wrapper rounded-4 shadow-sm overflow-hidden bg-light p-4 text-center">
                        <img
                            :src="product.thumbnail"
                            class="img-fluid product-img"
                            style="max-height: 450px; object-fit: contain;"
                            :alt="product.title"
                        >
                    </div>
                </div>

                <!-- Content -->
                <div class="col-lg-6">
                    <h1 class="fw-bold display-5 mb-2 text-dark">
                        {{ product.title }}
                    </h1>

                    <p class="text-primary fw-semibold mb-3 fs-5">
                        <i class="bi bi-tag-fill me-2"></i>{{ product.brand?.name }}
                    </p>

                    <div class="mb-4">
                        <template v-if="product.sale_price">
                            <span class="fs-2 fw-bold text-primary">${{ product.sale_price }}</span>
                            <span class="text-decoration-line-through ms-3 text-muted fs-5">${{ product.price }}</span>
                            <span class="badge bg-danger ms-3 px-3 py-2 rounded-pill">Special Deal</span>
                        </template>
                        <template v-else>
                            <span class="fs-2 fw-bold text-primary">${{ product.price }}</span>
                        </template>
                    </div>

                    <p class="text-muted leading-relaxed mb-4" style="font-size: 1.05rem;">
                        {{ product.description }}
                    </p>

                    <div class="d-flex align-items-center gap-3 mb-5">
                        <button
                            class="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow d-flex align-items-center gap-2 hover-up"
                            @click.stop.prevent="product.id && store.addToCart(product.id)"
                        >
                            <i class="bi bi-cart3 fs-5"></i>
                            <span>Add to Cart</span>
                        </button>
                        
                        <button
                            class="btn btn-outline-secondary btn-lg rounded-circle p-3 d-flex align-items-center justify-content-center shadow-sm"
                            style="width: 56px; height: 56px;"
                            @click.stop.prevent="store.toggleWishlist(product)"
                        >
                            <i class="bi" :class="store.isInWishlist(product.id) ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Specifications -->
            <div class="mt-5 pt-5 border-top">
                <h3 class="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                    <i class="bi bi-cpu text-primary"></i> Specifications
                </h3>

                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover mb-0 align-middle">
                            <tbody>
                                <tr v-if="product.specification?.processor">
                                    <th class="ps-4 py-3" style="width: 25%;">Processor</th>
                                    <td class="py-3 text-secondary">{{ product.specification.processor }}</td>
                                </tr>
                                <tr v-if="product.specification?.ram">
                                    <th class="ps-4 py-3">RAM</th>
                                    <td class="py-3 text-secondary">{{ product.specification.ram }}</td>
                                </tr>
                                <tr v-if="product.specification?.storage">
                                    <th class="ps-4 py-3">Storage</th>
                                    <td class="py-3 text-secondary">{{ product.specification.storage }}</td>
                                </tr>
                                <tr v-if="product.specification?.graphics">
                                    <th class="ps-4 py-3">Graphics</th>
                                    <td class="py-3 text-secondary">{{ product.specification.graphics }}</td>
                                </tr>
                                <tr v-if="product.specification?.display">
                                    <th class="ps-4 py-3">Display</th>
                                    <td class="py-3 text-secondary">{{ product.specification.display }}</td>
                                </tr>
                                <tr v-if="product.specification?.battery">
                                    <th class="ps-4 py-3">Battery</th>
                                    <td class="py-3 text-secondary">{{ product.specification.battery }}</td>
                                </tr>
                                <tr v-if="product.specification?.os">
                                    <th class="ps-4 py-3">Operating System</th>
                                    <td class="py-3 text-secondary">{{ product.specification.os }}</td>
                                </tr>
                                <tr v-if="product.specification?.weight">
                                    <th class="ps-4 py-3">Weight</th>
                                    <td class="py-3 text-secondary">{{ product.specification.weight }}</td>
                                </tr>
                                
                                <!-- Custom Specifications -->
                                <tr v-for="(spec, idx) in customSpecsList" :key="'custom-' + idx">
                                    <th class="ps-4 py-3">{{ spec.label }}</th>
                                    <td class="py-3 text-secondary">{{ spec.value }}</td>
                                </tr>

                                <tr v-if="hasNoSpecifications">
                                    <td colspan="2" class="text-center py-4 text-muted">No specifications listed for this product.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../firebase_config'
import { doc, getDoc } from 'firebase/firestore'
import MainLayout from '../Layouts/MainLayout.vue'
import { store } from '../utils/store'

const route = useRoute()
const product = ref({})

const getProduct = async () => {
    try {
        const docRef = doc(db, "products", route.params.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            product.value = { id: docSnap.id, ...docSnap.data() }
        } else {
            console.error('Product not found')
        }
    } catch (error) {
        console.error('Failed to load product:', error)
    }
}

const customSpecsList = computed(() => {
    if (!product.value.specification?.custom_specs) return []
    try {
        return Array.isArray(product.value.specification.custom_specs)
            ? product.value.specification.custom_specs
            : (typeof product.value.specification.custom_specs === 'string' ? JSON.parse(product.value.specification.custom_specs) : [])
    } catch (e) {
        console.warn("Failed to parse custom specs:", e)
        return []
    }
})

const hasNoSpecifications = computed(() => {
    const s = product.value.specification
    if (!s) return true
    
    const hasStandard = s.processor || s.ram || s.storage || s.graphics || s.display || s.battery || s.os || s.weight
    const hasCustom = customSpecsList.value && customSpecsList.value.length > 0
    
    return !hasStandard && !hasCustom
})

onMounted(() => {
    getProduct()
})
</script>

<style scoped>
.image-wrapper {
    transition: transform 0.3s ease;
}
.image-wrapper:hover {
    transform: scale(1.02);
}
.hover-up {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-up:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
}
</style>