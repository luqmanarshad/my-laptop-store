<template>
    <section class="container mt-4">

        <div class="hero-box position-relative overflow-hidden">

            <div class="hero-glow hero-glow-left"></div>
            <div class="hero-glow hero-glow-right"></div>

            <!-- Left Arrow -->
            <button class="arrow-btn left-arrow" @click="prevSlide" aria-label="Previous slide">
                <i class="bi bi-chevron-left"></i>
            </button>

            <div class="row align-items-center h-100 gx-5">

                <!-- Text -->
                <div class="col-lg-5 ps-lg-5 text-content">

                    <span class="arrival-badge">
                        {{ slides[currentSlide].badge }}
                    </span>

                    <h1 class="hero-title">
                        {{ slides[currentSlide].title }}
                    </h1>

                    <p class="hero-desc">
                        {{ slides[currentSlide].description }}
                    </p>

                    <div class="hero-features mb-4">
                        <span class="feature-pill">{{ slides[currentSlide].feature1 }}</span>
                        <span class="feature-pill">{{ slides[currentSlide].feature2 }}</span>
                        <span class="feature-pill">{{ slides[currentSlide].feature3 }}</span>
                    </div>

                    <button class="shop-btn" type="button" @click="goToLaptops">
                        {{ slides[currentSlide].buttonText }}
                    </button>

                </div>

                <!-- Laptop -->
                <div class="col-lg-7 position-relative text-center">
                    <div class="image-panel">
                        <img
                            :src="slides[currentSlide].image"
                            class="hero-laptop"
                            :alt="slides[currentSlide].title"
                        />
                    </div>
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
            <button class="arrow-btn right-arrow" @click="nextSlide" aria-label="Next slide">
                <i class="bi bi-chevron-right"></i>
            </button>

        </div>

    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentSlide = ref(0)

const slides = [
    {
        badge: 'NEW ARRIVAL',
        title: 'Power Meets Performance',
        description: 'Explore the latest laptops built for speed, power, and productivity.',
        feature1: 'Intel Core i9',
        feature2: 'Up to 32GB RAM',
        feature3: 'Thunderbolt 4',
        buttonText: 'Shop Now',
        image:
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    },
    {
        badge: 'GAMING TEAM',
        title: 'Gaming Beast Collection',
        description: 'High-refresh gaming rigs with RTX graphics and full RGB power.',
        feature1: 'RTX 4080',
        feature2: '240Hz Display',
        feature3: 'Liquid Cooling',
        buttonText: 'Explore Gaming',
        image:
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80&sat=-20',
    },
    {
        badge: 'FOR CREATORS',
        title: 'Business & Student Laptops',
        description: 'Lightweight laptops for school, office, and remote work.',
        feature1: 'Long Battery',
        feature2: 'Thin Design',
        feature3: 'Fast SSD',
        buttonText: 'Browse Collection',
        image:
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80&blur=2',
    },
]

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
    currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const goToLaptops = () => {
    router.push({ path: '/laptops' })
}

let intervalId = null

onMounted(() => {
    intervalId = window.setInterval(nextSlide, 6000)
})

onUnmounted(() => {
    window.clearInterval(intervalId)
})
</script>

<style scoped>
.hero-box {
    background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 28%),
        radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.16), transparent 25%),
        linear-gradient(135deg, #eef6ff 0%, #f8fbff 45%, #ffffff 100%);
    border-radius: 36px;
    min-height: 560px;
    position: relative;
    padding: 2rem;
    overflow: hidden;
    box-shadow: 0 28px 70px rgba(14, 38, 70, 0.1);
}

.hero-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.7;
}

.hero-glow-left {
    width: 260px;
    height: 260px;
    background: rgba(59, 130, 246, 0.18);
    top: -40px;
    left: -40px;
}

.hero-glow-right {
    width: 320px;
    height: 320px;
    background: rgba(16, 185, 129, 0.14);
    bottom: -80px;
    right: -60px;
}

.hero-title {
    font-size: clamp(3rem, 4.4vw, 4.4rem);
    font-weight: 800;
    color: #0f172a;
    line-height: 1.02;
    margin-bottom: 1rem;
}

.hero-desc {
    color: #475569;
    font-size: 1.05rem;
    max-width: 520px;
    margin-bottom: 1.8rem;
}

.arrival-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #1d4ed8;
    background: rgba(59, 130, 246, 0.12);
    padding: 0.75rem 1.2rem;
    border-radius: 999px;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin-bottom: 1.4rem;
}

.hero-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.8rem;
}

.feature-pill {
    background: rgba(15, 23, 42, 0.06);
    color: #0f172a;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 600;
}

.shop-btn {
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 16px;
    padding: 1rem 2rem;
    font-weight: 700;
    box-shadow: 0 18px 35px rgba(37, 99, 235, 0.22);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.shop-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.3);
}

.image-panel {
    position: relative;
    max-width: 740px;
    margin: 0 auto;
    padding: 1.8rem;
    background: rgba(255, 255, 255, 0.82);
    border-radius: 34px;
    box-shadow: 0 24px 65px rgba(15, 23, 42, 0.08);
}

.hero-laptop {
    width: 100%;
    max-height: 520px;
    object-fit: contain;
    transform: translateY(-10px);
}

.arrow-btn {
    position: absolute;
    top: calc(50% - 1rem);
    transform: translateY(-50%);
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: none;
    background: white;
    color: #0f172a;
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
    display: grid;
    place-items: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    z-index: 2;
}

.arrow-btn:hover {
    transform: translateY(-50%) scale(1.03);
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
}

.left-arrow {
    left: 16px;
}

.right-arrow {
    right: 16px;
}

.slider-dots {
    position: absolute;
    bottom: 18px;
    width: 100%;
    text-align: center;
    z-index: 2;
}

.dot {
    width: 12px;
    height: 12px;
    background: rgba(148, 163, 184, 0.44);
    border-radius: 50%;
    display: inline-block;
    margin: 0 6px;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
}

.dot:hover {
    transform: scale(1.14);
}

.dot.active {
    background: #1d4ed8;
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.12);
}

@media (max-width: 991px) {
    .hero-box {
        min-height: 680px;
        padding: 1.6rem;
    }

    .hero-title {
        font-size: 3rem;
    }

    .hero-desc {
        font-size: 1rem;
    }

    .image-panel {
        padding: 1.4rem;
    }
}

@media (max-width: 767px) {
    .hero-box {
        padding: 1.2rem;
    }

    .hero-glow-left,
    .hero-glow-right {
        display: none;
    }

    .arrow-btn {
        width: 48px;
        height: 48px;
    }

    .hero-title {
        font-size: 2.4rem;
    }

    .hero-features {
        gap: 0.5rem;
    }
}
</style>