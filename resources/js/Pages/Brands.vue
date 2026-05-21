<template>
    <MainLayout>
        <section class="container py-5">
            <!-- Header -->
            <div class="text-center mb-5">
                <h1 class="brand-title fw-bold">Top Laptop Brands</h1>
                <p class="text-muted fs-5">Explore laptops built by the most trusted tech innovators worldwide.</p>
            </div>

            <!-- Brands Grid -->
            <div class="row g-4">
                <div 
                    class="col-xl-4 col-lg-4 col-md-6" 
                    v-for="brand in brands" 
                    :key="brand.id"
                >
                    <div class="brand-card d-flex flex-column h-100 p-5 align-items-center justify-content-between text-center">
                        <div class="logo-wrapper mb-4 d-flex align-items-center justify-content-center">
                            <img 
                                :src="brand.logo" 
                                class="brand-logo" 
                                :alt="brand.name"
                            >
                        </div>

                        <div>
                            <h3 class="fw-bold text-dark fs-4 mb-3">{{ brand.name }}</h3>
                            <p class="text-muted small mb-4 px-2">{{ brand.description }}</p>
                        </div>

                        <router-link 
                            :to="{ path: '/laptops', query: { brand: brand.name } }" 
                            class="btn explore-btn rounded-pill px-4 py-2 w-100 d-flex align-items-center justify-content-center gap-2"
                        >
                            <span>Explore Products</span>
                            <i class="bi bi-arrow-right"></i>
                        </router-link>
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
        description: 'Elite, supercharged MacBooks featuring Apple Silicon (M-series) for developers, creators, and professionals.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
    },
    {
        id: 2,
        name: 'ASUS',
        description: 'Extreme ROG & TUF gaming machines and gorgeous OLED ZenBooks for high-fidelity gaming and creation.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg'
    },
    {
        id: 3,
        name: 'Dell',
        description: 'Industry-standard enterprise machines and cutting-edge XPS laptops tailored for high-end productivity.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg'
    },
    {
        id: 4,
        name: 'HP',
        description: 'Reliable student notebooks and high-end Spectre and Envy ultrabooks built for sleek modern offices.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg'
    },
    {
        id: 5,
        name: 'Lenovo',
        description: 'The legendary business-grade ThinkPads and gaming-ready Legion systems engineered for extreme durability.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg'
    },
    {
        id: 6,
        name: 'MSI',
        description: 'Ultra-performance laptops equipped with flagship NVIDIA GeForce RTX graphics and advanced cooling systems.',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Msi-Logo.svg'
    }
]
</script>

<style scoped>
.brand-title {
    font-size: 46px;
    background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.brand-card {
    background: white;
    border-radius: 28px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.brand-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
    border-color: rgba(37, 99, 235, 0.2);
}

.logo-wrapper {
    height: 100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.brand-logo {
    max-height: 55px;
    max-width: 130px;
    object-fit: contain;
    filter: grayscale(20%);
    transition: all 0.3s ease;
}

.brand-card:hover .brand-logo {
    filter: grayscale(0%);
    transform: scale(1.08);
}

.explore-btn {
    background: #2563eb;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
}

.explore-btn:hover {
    background: #1d4ed8;
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.explore-btn i {
    transition: transform 0.2s ease;
}

.explore-btn:hover i {
    transform: translateX(4px);
}

@media (max-width: 768px) {
    .brand-title {
        font-size: 34px;
    }
}
</style>