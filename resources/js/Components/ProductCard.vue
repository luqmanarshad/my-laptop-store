<template>
    <div class="product-card card border-0 rounded-4 h-100 overflow-hidden">

        <!-- Wishlist -->
        <button class="wishlist-btn">
            <i class="bi bi-heart"></i>
        </button>

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

            <h5 class="product-title">
                {{ title }}
            </h5>

            <p class="product-specs mb-2">
                {{ brand }}
            </p>

            <!-- Price -->
            <div class="mb-3">

                <div class="d-flex align-items-center gap-2 flex-wrap">

                    <span class="current-price">
                        ${{ price }}
                    </span>

                    <span class="old-price">
                        ${{ Math.floor(price + 250) }}
                    </span>

                    <span class="discount-badge">
                        15% OFF
                    </span>

                </div>

            </div>

            <!-- Button -->
            <button class="btn add-cart-btn mt-auto">
                <i class="bi bi-cart3 me-2"></i>
                Add to Cart
            </button>

        </div>

    </div>
</template>

<script setup>
defineProps({
    title: String,
    brand: String,
    image: String,
    price: Number,
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

.wishlist-btn {
    position: absolute;
    top: 18px;
    right: 18px;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f8f9fa;
    z-index: 5;
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
    font-size: 34px;
    font-weight: 800;
}

}
</style>