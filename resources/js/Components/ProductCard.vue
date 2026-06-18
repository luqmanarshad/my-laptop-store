<template>
    <div class="product-card card border-0 rounded-4 h-100 overflow-hidden d-flex flex-column">

        <div class="product-actions">
            <button
                class="icon-btn compare-btn"
                :class="{ 'active-compare': store.isInCompare(product.id) }"
                type="button"
                @click.stop.prevent="store.toggleCompare(product)"
                v-if="product"
                aria-label="Compare"
            >
                <i class="bi bi-bar-chart-fill" :class="{ 'text-primary': store.isInCompare(product.id) }"></i>
            </button>
            <button
                class="icon-btn wishlist-btn"
                :class="{ 'active-wishlist': store.isInWishlist(product.id) }"
                type="button"
                @click.stop.prevent="store.toggleWishlist(product)"
                v-if="product"
                aria-label="Wishlist"
            >
                <i class="bi" :class="store.isInWishlist(product.id) ? 'bi-heart-fill text-danger pulse-soft' : 'bi-heart'"></i>
            </button>
        </div>

        <!-- Product Image -->
        <div class="product-image-wrapper bg-light m-2 rounded-4">
            <img
                :src="image"
                class="product-image"
                :alt="title"
            />
        </div>

        <!-- Content -->
        <div class="card-body pt-3 d-flex flex-column flex-grow-1">
            <h5 class="product-title text-truncate-2" :title="title">
                {{ title }}
            </h5>

            <p class="product-specs mb-2 text-muted text-truncate">
                <i class="bi bi-tag-fill me-1 small"></i> {{ brand }}
            </p>

            <!-- Price -->
            <div class="mt-auto pt-3 pb-3">
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <span class="current-price">
                        Rs. {{ formatCurrency(product.sale_price || product.price, {minimumFractionDigits:0,maximumFractionDigits:0}) }}
                    </span>

                    <span v-if="product.sale_price" class="old-price text-decoration-line-through text-muted small">
                        Rs. {{ formatCurrency(product.price, {minimumFractionDigits:0,maximumFractionDigits:0}) }}
                    </span>

                    <span v-if="product.sale_price" class="discount-badge d-none d-sm-inline-block">
                        SALE
                    </span>
                </div>
            </div>

            <button 
                class="btn add-cart-btn w-100" 
                type="button"
                @click.stop.prevent="product && store.addToCart(product.id)"
            >
                <i class="bi bi-cart-plus fs-5"></i>
                <span class="ms-2 d-none d-sm-inline">Add to Cart</span>
                <span class="ms-2 d-inline d-sm-none">Add</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { store } from '../utils/store'
import { formatCurrency } from '../utils/format'

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
    background: var(--bg-card);
    transition: var(--transition);
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    border: 1px solid rgba(226, 232, 240, 0.6) !important;
}

.product-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(226, 232, 240, 1) !important;
}

.product-image-wrapper {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
}

.product-image {
    max-width: 100%;
    max-height: 160px;
    object-fit: contain;
    transition: var(--transition);
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.05));
}

.product-card:hover .product-image {
    transform: scale(1.08) translateY(-5px);
    filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1));
}

.product-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 5;
}

.icon-btn {
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    color: var(--text);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    transition: var(--transition);
    opacity: 0;
    transform: translateX(10px);
}

.product-card:hover .icon-btn {
    opacity: 1;
    transform: translateX(0);
}

/* Delay for cascade effect */
.product-card:hover .icon-btn:nth-child(1) { transition-delay: 0.05s; }
.product-card:hover .icon-btn:nth-child(2) { transition-delay: 0.1s; }

.icon-btn:hover {
    background: white;
    transform: scale(1.1) !important;
    color: var(--primary);
    box-shadow: 0 6px 15px rgba(0,0,0,0.12);
}

.icon-btn.active-compare, .icon-btn.active-wishlist {
    opacity: 1;
    transform: translateX(0);
}

.product-title {
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.4;
    color: var(--dark);
    margin-bottom: 0.5rem;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 3em;
}

.product-specs {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.current-price {
    color: var(--primary);
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.5px;
}

.old-price {
    text-decoration: line-through;
    color: #94a3b8;
}

.discount-badge {
    background: #fee2e2;
    color: var(--danger);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
}

.add-cart-btn {
    background: #f1f5f9;
    color: var(--dark);
    border-radius: 12px;
    height: 48px;
    font-weight: 600;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
}

.add-cart-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 10px 20px var(--primary-glow);
    transform: translateY(-2px);
}

/* Mobile Responsive */
@media (max-width: 767px) {

    .product-image-wrapper {
        height: 140px;
        padding: 1rem;
        margin: 0.5rem;
    }

    .product-image {
        max-height: 110px;
    }

    .product-title {
        font-size: 0.95rem;
        height: 2.8em;
    }

    .current-price {
        font-size: 1.1rem;
    }

    .card-body {
        padding: 0.8rem;
    }
    
    .add-cart-btn {
        height: 40px;
        font-size: 0.9rem;
    }

    .icon-btn {
        opacity: 1; /* Always show icons on mobile */
        transform: translateX(0);
        width: 32px;
        height: 32px;
        font-size: 0.9rem;
    }
    
    .product-actions {
        top: 10px;
        right: 10px;
    }

}
</style>