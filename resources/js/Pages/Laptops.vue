<template>
    <MainLayout>

        <section class="container py-5">

            <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-5">

                <div>
                    <h1 class="fw-bold page-title">
                        Premium Laptops
                    </h1>

                    <p class="text-muted">
                        Discover powerful laptops for gaming,
                        business and productivity.
                    </p>
                </div>

                <select class="form-select sort-box">
                    <option>Sort By Latest</option>
                    <option>Low to High</option>
                    <option>High to Low</option>
                </select>

            </div>

            <div class="row">

                <!-- Sidebar -->
                <div class="col-lg-3 mb-4">

                    <div class="filter-card">

                        <h4 class="fw-bold mb-4">
                            Filters
                        </h4>

                        <div class="mb-4">

                            <h6 class="fw-bold">
                                Brand
                            </h6>

                            <div class="form-check">
                                <input class="form-check-input" type="checkbox">
                                <label class="form-check-label">
                                    ASUS
                                </label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="checkbox">
                                <label class="form-check-label">
                                    HP
                                </label>
                            </div>

                            <div class="form-check">
                                <input class="form-check-input" type="checkbox">
                                <label class="form-check-label">
                                    Dell
                                </label>
                            </div>

                        </div>

                        <div>

                            <h6 class="fw-bold">
                                Price
                            </h6>

                            <input
                                type="range"
                                class="form-range"
                            >

                        </div>

                    </div>

                </div>

                <!-- Products -->
                <div class="col-lg-9">

                    <div class="row g-4">

                        <div
                            class="col-xl-4 col-md-6"
                            v-for="product in laptops"
                            :key="product.id"
                        >
                            <ProductCard
                                :title="product.title"
                                :brand="product.brand"
                                :price="product.price"
                                :image="product.image"
                            />
                        </div>

                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'
import ProductCard from '../Components/ProductCard.vue'

const laptops = [
    {
        id: 1,
        title: 'ASUS ROG Gaming',
        brand: 'RTX 4060 | Ryzen 9',
        price: 1499,
        image:
        'https://dlcdnwebimgs.asus.com/gain/90C2C48B-AB4A-4975-A77A-C1E1A7701F92/w717/h525',
    },

    {
        id: 2,
        title: 'Dell XPS 13',
        brand: 'Intel i7 | 16GB RAM',
        price: 1299,
        image:
        'https://i.dell.com/is/image/DellContent/content/dam/images/products/laptops-and-2-in-1s/xps/13-9340/media-gallery/laptop-xps-13-9340-gray-gallery-2.psd',
    },

    {
        id: 3,
        title: 'HP Victus',
        brand: 'Gaming Series',
        price: 999,
        image:
        'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08470648.png',
    },
]
</script>

<style scoped>
.page-title{
    font-size:42px;
}

.sort-box{
    width:220px;
    border-radius:14px;
}

.filter-card{
    background:white;
    border-radius:25px;
    padding:30px;
    box-shadow:0 5px 25px rgba(0,0,0,.05);
}
</style>