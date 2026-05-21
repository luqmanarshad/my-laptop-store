<template>
    <MainLayout>
        <section class="container py-5">
            <!-- Header -->
            <div class="text-center mb-5">
                <h1 class="category-title fw-bold">Shop by Category</h1>
                <p class="text-muted fs-5">Select a category below to explore custom curated high-performance laptops.</p>
            </div>

            <!-- Categories Grid -->
            <div class="row g-4 justify-content-center">
                <div 
                    class="col-xl-3 col-lg-4 col-md-6" 
                    v-for="category in categories" 
                    :key="category.name"
                >
                    <router-link 
                        :to="{ path: '/laptops', query: { category: category.name } }" 
                        class="text-decoration-none d-block h-100"
                    >
                        <div class="category-card p-5 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                            <div class="icon-circle mb-4" :style="`background-color: ${category.bgColor}; color: ${category.color};`">
                                <i :class="`bi ${category.icon} fs-1`"></i>
                            </div>
                            <h3 class="fw-bold text-dark fs-4 mb-2">{{ category.name }}</h3>
                            <p class="text-muted small mb-0">{{ category.description }}</p>
                        </div>
                    </router-link>
                </div>
            </div>
        </section>
    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'

const categories = [
    {
        name: 'Gaming Laptops',
        icon: 'bi-controller',
        description: 'Elite RTX graphics, mechanical keyboards, and 240Hz screen tech.',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444'
    },
    {
        name: 'Business Laptops',
        icon: 'bi-briefcase',
        description: 'Security options, biometric security, and full day battery endurance.',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6'
    },
    {
        name: 'Student Laptops',
        icon: 'bi-book',
        description: 'Extremely lightweight, reliable, and premium efficiency specs.',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981'
    },
    {
        name: 'MacBooks',
        icon: 'bi-apple',
        description: 'Sleek aluminum body, Retina displays, and Apple Silicon efficiency.',
        bgColor: 'rgba(107, 114, 128, 0.1)',
        color: '#4b5563'
    }
]
</script>

<style scoped>
.category-title {
    font-size: 46px;
    background: linear-gradient(135deg, #1e293b 0%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.category-card {
    background: white;
    border-radius: 28px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
    overflow: hidden;
}

.category-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
    border-color: rgba(37, 99, 235, 0.2);
}

.icon-circle {
    width: 80px;
    height: 80px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.category-card:hover .icon-circle {
    transform: scale(1.15) rotate(5deg);
}

@media (max-width: 768px) {
    .category-title {
        font-size: 34px;
    }
}
</style>