<template>
    <MainLayout>

        <section class="container py-5">

            <!-- Header -->
            <div class="text-center mb-5">

                <h1 class="brand-title">
                    Top Laptop Brands
                </h1>

                <p class="text-muted">
                    Explore premium laptop brands trusted worldwide
                </p>

            </div>

            <!-- Brands Grid -->
            <div class="row g-4">

                <div
                    class="col-xl-3 col-lg-4 col-md-6"
                    v-for="brand in brands"
                    :key="brand.id"
                >

                    <div class="brand-card">

                        <img
                            :src="brand.logo"
                            class="brand-logo"
                            :alt="brand.name"
                        >

                        <h4 class="fw-bold mt-4">
                            {{ brand.name }}
                        </h4>

                        <p class="text-muted small mb-4">
                            {{ brand.description }}
                        </p>

                        <button class="btn explore-btn">
                            Explore Products
                        </button>

                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'

const brands = [
    {
        id: 1,
        name: 'Apple',
        description: 'Premium MacBooks for creators & professionals.',
        logo:
        'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    },

    {
        id: 2,
        name: 'ASUS',
        description: 'High-performance gaming & creator laptops.',
        logo:
        'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg',
    },

    {
        id: 3,
        name: 'Dell',
        description: 'Business & productivity focused laptops.',
        logo:
        'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg',
    },

    {
        id: 4,
        name: 'HP',
        description: 'Reliable laptops for students and office work.',
        logo:
        'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg',
    },

    {
        id: 5,
        name: 'Lenovo',
        description: 'ThinkPad & Legion powerful performance.',
        logo:
        'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg',
    },

    {
        id: 6,
        name: 'MSI',
        description: 'Extreme gaming laptops with RTX graphics.',
        logo:
        'https://upload.wikimedia.org/wikipedia/commons/9/91/Msi-Logo.svg',
    },
]
</script>

<style scoped>
.brand-title{
    font-size:48px;
    font-weight:800;
    color:#111827;
}

.brand-card{
    background:white;
    border-radius:30px;
    padding:40px 30px;
    text-align:center;
    height:100%;
    transition:.3s;
    box-shadow:0 5px 30px rgba(0,0,0,.05);
}

.brand-card:hover{
    transform:translateY(-10px);
    box-shadow:0 15px 40px rgba(0,0,0,.12);
}

.brand-logo{
    height:70px;
    object-fit:contain;
}

.explore-btn{
    background:#2563eb;
    color:white;
    border-radius:14px;
    padding:12px 24px;
    font-weight:600;
}

.explore-btn:hover{
    background:#1d4ed8;
    color:white;
}

@media(max-width:768px){

    .brand-title{
        font-size:34px;
    }

}
</style>