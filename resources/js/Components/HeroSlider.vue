<template>
    <section class="container mt-4">

        <div class="hero-box position-relative overflow-hidden">

            <div class="hero-glow hero-glow-left"></div>
            <div class="hero-glow hero-glow-right"></div>

            <!-- Left Arrow -->
            <button class="arrow-btn left-arrow d-none d-md-grid" @click="prevSlide" aria-label="Previous slide">
                <i class="bi bi-chevron-left"></i>
            </button>

            <div class="row align-items-center h-100 gx-4 gx-lg-5 flex-column-reverse flex-md-row">

                <!-- Text -->
                <div class="col-md-6 col-lg-5 ps-md-4 ps-lg-5 text-content text-center text-md-start mt-4 mt-md-0 z-1">

                    <span class="arrival-badge mx-auto mx-md-0 fade-in-up" :key="'badge'+currentSlide">
                        {{ slides[currentSlide].badge }}
                    </span>

                    <h1 class="hero-title fade-in-up" style="animation-delay: 0.1s;" :key="'title'+currentSlide">
                        {{ slides[currentSlide].title }}
                    </h1>

                    <p class="hero-desc mx-auto mx-md-0 fade-in-up" style="animation-delay: 0.2s;" :key="'desc'+currentSlide">
                        {{ slides[currentSlide].description }}
                    </p>

                    <div class="hero-features mb-4 justify-content-center justify-content-md-start fade-in-up" style="animation-delay: 0.3s;" :key="'feat'+currentSlide">
                        <span class="feature-pill">{{ slides[currentSlide].feature1 }}</span>
                        <span class="feature-pill">{{ slides[currentSlide].feature2 }}</span>
                        <span class="feature-pill">{{ slides[currentSlide].feature3 }}</span>
                    </div>

                    <button class="shop-btn fade-in-up w-100 w-sm-auto mx-auto mx-md-0" style="animation-delay: 0.4s;" type="button" @click="goToLaptops" :key="'btn'+currentSlide">
                        {{ slides[currentSlide].buttonText }}
                    </button>

                </div>

                <!-- Laptop -->
                <div class="col-md-6 col-lg-7 position-relative text-center z-1">
                    <div class="image-panel">
                        <transition name="fade" mode="out-in">
                            <img
                                :key="currentSlide"
                                :src="slides[currentSlide].image"
                                class="hero-laptop"
                                :alt="slides[currentSlide].title"
                            />
                        </transition>
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
            <button class="arrow-btn right-arrow d-none d-md-grid" @click="nextSlide" aria-label="Next slide">
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
let touchStartX = 0

const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    if (touchStartX - touchEndX > 50) {
        nextSlide() // swipe left
    } else if (touchEndX - touchStartX > 50) {
        prevSlide() // swipe right
    }
}

onMounted(() => {
    intervalId = window.setInterval(nextSlide, 6000)
    const heroBox = document.querySelector('.hero-box')
    if (heroBox) {
        heroBox.addEventListener('touchstart', handleTouchStart, { passive: true })
        heroBox.addEventListener('touchend', handleTouchEnd, { passive: true })
    }
})

onUnmounted(() => {
    window.clearInterval(intervalId)
    const heroBox = document.querySelector('.hero-box')
    if (heroBox) {
        heroBox.removeEventListener('touchstart', handleTouchStart)
        heroBox.removeEventListener('touchend', handleTouchEnd)
    }
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
    box-shadow: 0 28px 70px rgba(14, 38, 70, 0.08);
}

.hero-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.7;
    z-index: 0;
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
    font-size: clamp(2.5rem, 4.4vw, 4.4rem);
    font-weight: 800;
    color: #0f172a;
    line-height: 1.1;
    margin-bottom: 1rem;
    letter-spacing: -1px;
}

.hero-desc {
    color: #475569;
    font-size: 1.05rem;
    max-width: 520px;
    margin-bottom: 1.8rem;
    line-height: 1.6;
}

.arrival-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #1d4ed8;
    background: rgba(59, 130, 246, 0.12);
    padding: 0.6rem 1rem;
    border-radius: 999px;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    margin-bottom: 1.2rem;
    border: 1px solid rgba(59, 130, 246, 0.2);
}

.hero-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 1.8rem;
}

.feature-pill {
    background: white;
    color: #334155;
    padding: 0.6rem 0.9rem;
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
    border: 1px solid #f1f5f9;
}

.shop-btn {
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 14px;
    padding: 1rem 2rem;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: 0 15px 30px rgba(37, 99, 235, 0.25);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.shop-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.35);
    background: var(--primary-dark);
}

.image-panel {
    position: relative;
    max-width: 740px;
    margin: 0 auto;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 34px;
    box-shadow: 0 24px 65px rgba(15, 23, 42, 0.05);
    border: 1px solid rgba(255,255,255,0.8);
}

.hero-laptop {
    width: 100%;
    max-height: 480px;
    object-fit: contain;
    transform: translateY(-5px);
    filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
}

.arrow-btn {
    position: absolute;
    top: calc(50% - 1rem);
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: white;
    color: #0f172a;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
    display: grid;
    place-items: center;
    transition: all 0.2s ease;
    z-index: 5;
    font-size: 1.2rem;
}

.arrow-btn:hover {
    transform: translateY(-50%) scale(1.08);
    box-shadow: 0 15px 30px rgba(15, 23, 42, 0.15);
    color: var(--primary);
}

.left-arrow { left: 16px; }
.right-arrow { right: 16px; }

.slider-dots {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    z-index: 5;
}

.dot {
    width: 10px;
    height: 10px;
    background: #cbd5e1;
    border-radius: 50%;
    display: inline-block;
    margin: 0 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot.active {
    background: var(--primary);
    transform: scale(1.3);
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from {
    opacity: 0;
    transform: translateX(30px);
}
.fade-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

/* Mobile Adjustments */
@media (max-width: 991px) {
    .hero-title { font-size: 2.8rem; }
    .hero-laptop { max-height: 380px; }
}

@media (max-width: 767px) {
    .hero-box {
        padding: 1.5rem 1rem 3rem 1rem;
        border-radius: 28px;
        min-height: auto;
    }

    .hero-title {
        font-size: 2.2rem;
        line-height: 1.2;
    }

    .hero-desc {
        font-size: 0.95rem;
        margin-bottom: 1.5rem;
    }
    
    .image-panel {
        padding: 0.5rem;
        border-radius: 24px;
        margin-bottom: 2rem;
        background: transparent;
        box-shadow: none;
        border: none;
    }
    
    .hero-laptop {
        max-height: 280px;
        filter: drop-shadow(0 15px 25px rgba(0,0,0,0.1));
    }

    .feature-pill {
        font-size: 0.75rem;
        padding: 0.5rem 0.8rem;
    }
    
    .shop-btn {
        padding: 0.9rem 1.5rem;
        font-size: 1rem;
    }
    
    .slider-dots {
        bottom: 15px;
    }
}
</style>