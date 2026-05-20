<template>
    <section class="container mt-4">

        <div class="hero-box position-relative overflow-hidden">

            <!-- Left Arrow -->
            <button class="arrow-btn left-arrow" @click="prevSlide">
                <i class="bi bi-chevron-left"></i>
            </button>

            <div class="row align-items-center h-100">

                <!-- Text -->
                <div class="col-lg-5 ps-lg-5 text-content">

                    <span class="arrival-badge">
                        NEW ARRIVAL
                    </span>

                    <h1 class="hero-title">
                        {{ slides[currentSlide].title }}
                    </h1>

                    <p class="hero-desc">
                        {{ slides[currentSlide].description }}
                    </p>

                    <button class="shop-btn">
                        Shop Now →
                    </button>

                </div>

                <!-- Laptop -->
                <div class="col-lg-7 text-center">

                    <img
                        src="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/macbook-air-og-202503?wid=1200&hei=630&fmt=jpeg&qlt=95"
                        class="hero-laptop"
                    />

                </div>

            </div>

            <!-- Dots -->
            <div class="slider-dots">

                <span
                    v-for="(slide,index) in slides"
                    :key="index"
                    class="dot"
                    :class="{ active: currentSlide === index }"
                    @click="currentSlide = index"
                ></span>

            </div>

            <!-- Right Arrow -->
            <button class="arrow-btn right-arrow" @click="nextSlide">
                <i class="bi bi-chevron-right"></i>
            </button>

        </div>

    </section>
</template>

<script setup>
import { ref } from 'vue'

const currentSlide = ref(0)

const slides = [
    {
        title: 'Power Meets Performance',
        description:
            'Explore the latest laptops built for speed and productivity.',
        image: '/images/laptops/hero-laptop.png',
    },

    {
        title: 'Gaming Beast Collection',
        description:
            'Premium gaming laptops with RTX graphics.',
        image: '/images/laptops/laptop1.png',
    },

    {
        title: 'Business & Student Laptops',
        description:
            'Affordable and professional laptops for work.',
        image: '/images/laptops/laptop2.png',
    },
]

const nextSlide = () => {
    currentSlide.value =
        (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
    currentSlide.value =
        (currentSlide.value - 1 + slides.length)
        % slides.length
}
</script>

<style scoped>
.hero-box{
    background:linear-gradient(90deg,#f3f7ff,#dfe8fb);
    border-radius:30px;
    min-height:500px;
    position:relative;
}

.hero-title{
    font-size:64px;
    font-weight:800;
    color:#091b50;
    line-height:1.1;
}

.hero-desc{
    color:#6b7280;
    font-size:20px;
    margin:20px 0;
}

.hero-laptop{
    width:95%;
    max-height:500px;
    object-fit:contain;
    transform:scale(1.15);
}

.arrival-badge{
    background:white;
    color:#2563eb;
    padding:8px 18px;
    border-radius:30px;
    font-weight:700;
}

.shop-btn{
    background:#2563eb;
    color:white;
    border:none;
    border-radius:14px;
    padding:14px 28px;
}

.arrow-btn{
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    width:52px;
    height:52px;
    border-radius:50%;
    border:none;
    background:white;
    box-shadow:0 4px 20px rgba(0,0,0,.08);
}

.left-arrow{left:20px}
.right-arrow{right:20px}

.slider-dots{
    position:absolute;
    bottom:20px;
    width:100%;
    text-align:center;
}

.dot{
    width:10px;
    height:10px;
    background:#cbd5e1;
    border-radius:50%;
    display:inline-block;
    margin:0 5px;
    cursor:pointer;
}

.dot.active{
    background:#2563eb;
}
</style>