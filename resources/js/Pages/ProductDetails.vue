<template>
    <MainLayout>
        <section class="container py-4 py-lg-5">
            
            <div class="mb-3 d-none d-lg-block">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none text-muted">Home</router-link></li>
                        <li class="breadcrumb-item"><router-link to="/laptops" class="text-decoration-none text-muted">Laptops</router-link></li>
                        <li class="breadcrumb-item active text-dark fw-medium" aria-current="page">{{ product.title || 'Loading...' }}</li>
                    </ol>
                </nav>
            </div>

            <div class="row g-4 g-lg-5">
                <!-- Image -->
                <div class="col-lg-6">
                    <div class="image-wrapper rounded-4 border overflow-hidden bg-white p-3 p-md-5 text-center position-relative h-100 d-flex align-items-center justify-content-center" style="min-height: 350px;">
                        
                        <!-- Badges -->
                        <div class="position-absolute top-0 start-0 p-3 p-md-4 d-flex flex-column gap-2 z-1">
                            <span v-if="product.sale_price" class="badge bg-danger px-3 py-2 rounded-pill shadow-sm">SALE</span>
                            <span class="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill border border-primary-subtle shadow-sm">{{ product.brand?.name }}</span>
                        </div>

                        <!-- Action Buttons Top Right -->
                        <div class="position-absolute top-0 end-0 p-3 p-md-4 d-flex flex-column gap-2 z-1">
                            <button
                                class="btn btn-light rounded-circle shadow-sm border icon-btn-hover"
                                style="width: 45px; height: 45px;"
                                @click.stop.prevent="store.toggleWishlist(product)"
                                aria-label="Add to wishlist"
                            >
                                <i class="bi" :class="store.isInWishlist(product.id) ? 'bi-heart-fill text-danger pulse-soft' : 'bi-heart text-muted'"></i>
                            </button>
                            <button
                                class="btn btn-light rounded-circle shadow-sm border icon-btn-hover"
                                style="width: 45px; height: 45px;"
                                @click.stop.prevent="store.toggleCompare(product)"
                                aria-label="Compare"
                            >
                                <i class="bi bi-bar-chart-fill" :class="store.isInCompare(product.id) ? 'text-primary' : 'text-muted'"></i>
                            </button>
                        </div>

                        <img
                            v-if="product.thumbnail"
                            :src="product.thumbnail"
                            class="img-fluid product-img fade-in-up"
                            alt="Product Image"
                        >
                        <div v-else class="spinner-border text-primary" role="status"></div>
                    </div>
                </div>

                <!-- Content -->
                <div class="col-lg-6 d-flex flex-column">
                    <div class="mb-4 fade-in-up" style="animation-delay: 0.1s;">
                        <h1 class="fw-bold display-6 mb-2 text-dark title-mobile">
                            {{ product.title }}
                        </h1>
                        
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="text-warning">
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-fill"></i>
                                <i class="bi bi-star-half"></i>
                                <span class="text-muted ms-1 text-sm">(4.5)</span>
                            </div>
                            <span class="text-muted small">|</span>
                            <span class="text-success small fw-bold"><i class="bi bi-check-circle-fill me-1"></i> In Stock</span>
                        </div>
                    </div>

                    <div class="price-box mb-4 p-3 p-md-4 rounded-4 bg-light border fade-in-up" style="animation-delay: 0.2s;">
                        <template v-if="product.sale_price">
                            <div class="d-flex align-items-center flex-wrap gap-2 gap-md-3">
                                <span class="fs-1 fw-extrabold text-primary">Rs. {{ product.sale_price }}</span>
                                <span class="text-decoration-line-through text-muted fs-5">Rs. {{ product.price }}</span>
                                <span class="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded">Save Rs. {{ (product.price - product.sale_price).toFixed(2) }}</span>
                            </div>
                        </template>
                        <template v-else>
                            <span class="fs-1 fw-extrabold text-primary">Rs. {{ product.price }}</span>
                        </template>
                    </div>

                    <p class="text-muted leading-relaxed mb-4 pb-3 border-bottom fade-in-up" style="font-size: 1.05rem; animation-delay: 0.3s;">
                        {{ product.description }}
                    </p>

                    <!-- Key Features (Extracted from specs) -->
                    <div v-if="product.specification" class="mb-4 fade-in-up" style="animation-delay: 0.4s;">
                        <h6 class="fw-bold mb-3">Key Features:</h6>
                        <ul class="list-unstyled row g-2">
                            <li v-if="product.specification.processor" class="col-sm-6 text-muted d-flex align-items-start">
                                <i class="bi bi-cpu text-primary me-2 mt-1"></i> <span>{{ product.specification.processor }}</span>
                            </li>
                            <li v-if="product.specification.ram" class="col-sm-6 text-muted d-flex align-items-start">
                                <i class="bi bi-memory text-primary me-2 mt-1"></i> <span>{{ product.specification.ram }} RAM</span>
                            </li>
                            <li v-if="product.specification.storage" class="col-sm-6 text-muted d-flex align-items-start">
                                <i class="bi bi-device-hdd text-primary me-2 mt-1"></i> <span>{{ product.specification.storage }}</span>
                            </li>
                            <li v-if="product.specification.display" class="col-sm-6 text-muted d-flex align-items-start">
                                <i class="bi bi-display text-primary me-2 mt-1"></i> <span>{{ product.specification.display }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-auto pt-3 fade-in-up" style="animation-delay: 0.5s;">
                        <button
                            class="btn btn-primary btn-lg rounded-pill w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 add-to-cart-btn"
                            @click="product.id && store.addToCart(product.id)"
                        >
                            <i class="bi bi-cart3 fs-4"></i>
                            <span class="fs-5">Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Specifications Full Table -->
            <div class="mt-5 pt-4 pt-lg-5">
                
                <ul class="nav nav-tabs mb-4 border-bottom-0" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active fw-bold px-4 py-3 rounded-top-3 border-bottom-0 bg-white shadow-sm" style="color: var(--dark); border: 1px solid #dee2e6; margin-bottom: -1px; z-index: 2; position: relative;">
                            <i class="bi bi-gear-fill text-primary me-2"></i> Tech Specs
                        </button>
                    </li>
                </ul>

                <div class="card border shadow-sm rounded-4 rounded-top-start-0 overflow-hidden bg-white">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle custom-table">
                            <tbody>
                                <tr v-if="product.specification?.processor">
                                    <th class="ps-4 py-3 bg-light text-dark" style="width: 30%; max-width: 150px;">Processor</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.processor }}</td>
                                </tr>
                                <tr v-if="product.specification?.ram">
                                    <th class="ps-4 py-3 bg-light text-dark">RAM</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.ram }}</td>
                                </tr>
                                <tr v-if="product.specification?.storage">
                                    <th class="ps-4 py-3 bg-light text-dark">Storage</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.storage }}</td>
                                </tr>
                                <tr v-if="product.specification?.graphics">
                                    <th class="ps-4 py-3 bg-light text-dark">Graphics</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.graphics }}</td>
                                </tr>
                                <tr v-if="product.specification?.display">
                                    <th class="ps-4 py-3 bg-light text-dark">Display</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.display }}</td>
                                </tr>
                                <tr v-if="product.specification?.battery">
                                    <th class="ps-4 py-3 bg-light text-dark">Battery</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.battery }}</td>
                                </tr>
                                <tr v-if="product.specification?.os">
                                    <th class="ps-4 py-3 bg-light text-dark">Operating System</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.os }}</td>
                                </tr>
                                <tr v-if="product.specification?.weight">
                                    <th class="ps-4 py-3 bg-light text-dark">Weight</th>
                                    <td class="py-3 px-4 text-muted">{{ product.specification.weight }}</td>
                                </tr>
                                
                                <!-- Custom Specifications -->
                                <tr v-for="(spec, idx) in customSpecsList" :key="'custom-' + idx">
                                    <th class="ps-4 py-3 bg-light text-dark">{{ spec.label }}</th>
                                    <td class="py-3 px-4 text-muted">{{ spec.value }}</td>
                                </tr>

                                <tr v-if="hasNoSpecifications">
                                    <td colspan="2" class="text-center py-5 text-muted">
                                        <i class="bi bi-info-circle fs-2 d-block mb-2"></i>
                                        Detailed technical specifications are not available for this model yet.
                                    </td>
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
.product-img {
    max-height: 400px;
    object-fit: contain;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1));
}

.image-wrapper:hover .product-img {
    transform: scale(1.05) translateY(-10px);
}

.icon-btn-hover {
    transition: var(--transition);
}

.icon-btn-hover:hover {
    background: var(--primary) !important;
    color: white !important;
    border-color: var(--primary) !important;
}

.icon-btn-hover:hover i {
    color: white !important;
}

.add-to-cart-btn {
    transition: var(--transition);
}

.add-to-cart-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 25px rgba(37, 99, 235, 0.3) !important;
    background-color: var(--primary-dark);
}

.custom-table th {
    font-weight: 600;
    border-right: 1px solid #f1f5f9;
}

.custom-table tr:last-child th,
.custom-table tr:last-child td {
    border-bottom: none;
}

@media (max-width: 991px) {
    .title-mobile {
        font-size: 1.8rem;
    }
    
    .product-img {
        max-height: 250px;
    }
    
    .image-wrapper {
        min-height: 280px !important;
    }
}
</style>