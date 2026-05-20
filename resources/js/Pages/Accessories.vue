<template>
    <MainLayout>

        <section class="container py-5">

            <div class="mb-5">

                <h1 class="fw-bold display-5">
                    Laptop Accessories
                </h1>

                <p class="text-muted">
                    Upgrade your setup with premium accessories
                </p>

            </div>

            <div class="row g-4">

                <div
                    class="col-xl-3 col-md-6"
                    v-for="item in accessories"
                    :key="item.id"
                >

                    <div class="product-card">

                        <img
                            :src="item.image"
                            class="product-img"
                        >

                        <h5 class="fw-bold mt-3">
                            {{ item.name }}
                        </h5>

                        <p class="text-muted small">
                            {{ item.description }}
                        </p>

                        <div class="fw-bold fs-4 text-primary">
                            ${{ item.price }}
                        </div>

                        <button class="btn buy-btn w-100 mt-3">
                            Add To Cart
                        </button>

                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'

const accessories = [
    {
        id: 1,
        name: 'Gaming Mouse',
        description: 'RGB high precision mouse',
        price: 59,
        image:
        'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800',
    },

    {
        id: 2,
        name: 'Mechanical Keyboard',
        description: 'Premium gaming keyboard',
        price: 120,
        image:
        'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
    },

    {
        id: 3,
        name: 'Laptop Backpack',
        description: 'Waterproof premium bag',
        price: 75,
        image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    },

    {
        id: 4,
        name: 'Cooling Pad',
        description: 'Laptop cooling system',
        price: 40,
        image:
        'https://images.unsplash.com/photo-1593642702821-c8da6771f0c7?w=800',
    },
]
</script>

<style scoped>
.product-card{
    background:white;
    border-radius:28px;
    padding:25px;
    height:100%;
    box-shadow:0 5px 30px rgba(0,0,0,.05);
    transition:.3s;
}

.product-card:hover{
    transform:translateY(-10px);
}

.product-img{
    width:100%;
    height:220px;
    object-fit:cover;
    border-radius:20px;
}

.buy-btn{
    background:#2563eb;
    color:white;
    border-radius:14px;
}
</style>