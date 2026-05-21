<template>
    <div class="product-card card border-0 rounded-4 h-100 overflow-hidden">

        <div class="product-actions">
            <button
                class="icon-btn compare-btn"
                :class="{ 'active-compare': store.isInCompare(product.id) }"
                type="button"
                @click.stop.prevent="store.toggleCompare(product)"
                v-if="product"
            >
                <i class="bi bi-bar-chart-fill" :class="{ 'text-primary': store.isInCompare(product.id) }"></i>
            </button>
            <button
                class="icon-btn wishlist-btn"
                :class="{ 'active-wishlist': store.isInWishlist(product.id) }"
                type="button"
                @click.stop.prevent="store.toggleWishlist(product)"
                v-if="product"
            >
                <i class="bi" :class="store.isInWishlist(product.id) ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
            </button>
        </div>

        <!-- Product Image -->
        <div class="product-image-wrapper">
            <img
                :src="image"
                class="product-image"
                :alt="title"
            />
        </div>

        <!-- Content -->
        <div class="card-body pt-0 d-flex flex-column">
            <h5 class="product-title text-truncate">
                {{ title }}
            </h5>

            <p class="product-specs mb-2 text-muted text-truncate" style="min-height: auto;">
                {{ brand }}
            </p>

            <!-- Price -->
            <div class="mb-3">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="current-price">
                        ${{ product.sale_price || product.price }}
                    </span>

                    <span v-if="product.sale_price" class="old-price text-decoration-line-through text-muted small">
                        ${{ product.price }}
                    </span>

                    <span v-if="product.sale_price" class="discount-badge">
                        15% OFF
                    </span>
                </div>
            </div>

            <button 
                class="btn add-cart-btn mt-auto w-100" 
                type="button"
                @click.stop.prevent="product && store.addToCart(product.id)"
            >
                <i class="bi bi-cart3 me-2"></i>
                Add to Cart
            </button>
        </div>
    </div>
</template>

<script setup>
import { store } from '../utils/store'

defineProps({
    id: [Number, String],
    title: String,
    brand: String,
    image: String,
    price: Number,
    product: Object
})
</script>

<style scoped>
.product-card {
    background: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0,0,0,.05);
    position: relative;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0,0,0,.12);
}

.product-image-wrapper {
    height: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 25px;
}

.product-image {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    transition: .3s;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.product-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 5;
}

.icon-btn {
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f8f9fa;
    color: #111827;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.icon-btn:hover {
    background: #e2e8f0;
}

.product-title {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
}

.product-specs {
    font-size: 14px;
    color: #6b7280;
    min-height: 45px;
}

.current-price {
    color: #2563eb;
    font-size: 30px;
    font-weight: 800;
}

.old-price {
    text-decoration: line-through;
    color: #9ca3af;
}

.discount-badge {
    background: #fee2e2;
    color: #dc2626;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
}

.add-cart-btn {
    background: #2563eb;
    color: white;
    border-radius: 16px;
    height: 50px;
    font-weight: 600;
    transition: .3s;
}

.add-cart-btn:hover {
    background: #1748b3;
    color: white;
}

/* Mobile Responsive */
@media (max-width: 768px) {

    .product-image-wrapper {
        height: 180px;
    }

    .product-title {
        font-size: 16px;
    }

    .current-price {
        font-size: 20px;
        font-weight: 800;
    }

}
</style>