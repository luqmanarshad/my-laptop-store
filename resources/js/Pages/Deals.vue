<template>
    <MainLayout>

        <section class="container py-5">

            <div class="text-center mb-5">

                <h1 class="fw-bold display-4">
                    Hot Deals 🔥
                </h1>

                <p class="text-muted">
                    Save big on premium laptops
                </p>

            </div>

            <div class="row g-4">

                <div
                    class="col-lg-4"
                    v-for="deal in deals"
                    :key="deal.id"
                >

                    <div class="deal-card">

                        <span class="badge-sale">
                            {{ deal.discount }} OFF
                        </span>

                        <img
                            :src="deal.image"
                            class="deal-img"
                        >

                        <h4 class="fw-bold mt-4">
                            {{ deal.name }}
                        </h4>

                        <div class="d-flex gap-3 align-items-center">

                            <span class="new-price">
                                ${{ deal.price }}
                            </span>

                            <span class="old-price">
                                ${{ deal.oldPrice }}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'

const deals = [
    {
        id: 1,
        name: 'MacBook Pro',
        price: 1499,
        oldPrice: 1799,
        discount: '20%',
        image:
        'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-midnight-gallery1-202206',
    },

    {
        id: 2,
        name: 'ASUS ROG',
        price: 1299,
        oldPrice: 1599,
        discount: '25%',
        image:
        'https://dlcdnwebimgs.asus.com/gain/90C2C48B-AB4A-4975-A77A-C1E1A7701F92/w717/h525',
    },
]
</script>

<style scoped>
.deal-card{
    background:white;
    border-radius:30px;
    padding:30px;
    position:relative;
    box-shadow:0 5px 30px rgba(0,0,0,.05);
}

.badge-sale{
    position:absolute;
    top:20px;
    right:20px;
    background:#ef4444;
    color:white;
    padding:8px 14px;
    border-radius:14px;
}

.deal-img{
    width:100%;
    height:250px;
    object-fit:contain;
}

.new-price{
    color:#2563eb;
    font-size:28px;
    font-weight:700;
}

.old-price{
    text-decoration:line-through;
    color:#9ca3af;
}
</style>