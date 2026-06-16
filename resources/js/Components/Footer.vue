<template>
    <footer class="footer-premium mt-5">
        <!-- Top Wave Divider -->
        <div class="footer-wave">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
            </svg>
        </div>

        <div class="container footer-content pt-5 pb-4">
            <div class="row g-4 mb-5">
                <!-- Column 1: Brand & About -->
                <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <div class="d-flex align-items-center mb-4">
                        <div class="logo-box-footer me-2">
                            <i class="bi bi-laptop"></i>
                        </div>
                        <h2 class="brand-name-footer mb-0">Lapzo</h2>
                    </div>
                    <p class="text-gray-400 mb-4 pe-lg-4">
                        Your ultimate destination for high-performance laptops. We bring you the best deals on gaming, business, and creator laptops with worldwide shipping.
                    </p>
                    <div class="social-links d-flex gap-3">
                        <a href="#" class="social-icon" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="social-icon" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" class="social-icon" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="social-icon" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>

                <!-- Column 2: Quick Links -->
                <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h5 class="footer-title mb-4">Quick Links</h5>
                    <ul class="footer-links list-unstyled">
                        <li><router-link to="/">Home</router-link></li>
                        <li><router-link to="/laptops">All Laptops</router-link></li>
                        <li><router-link to="/deals">Special Deals</router-link></li>
                        <li><router-link to="/support">Support Center</router-link></li>
                        <li><router-link to="/login">Sign In</router-link></li>
                    </ul>
                </div>

                <!-- Column 3: Categories -->
                <div class="col-lg-2 col-md-6 mb-4 mb-md-0">
                    <h5 class="footer-title mb-4">Categories</h5>
                    <ul class="footer-links list-unstyled">
                        <li><router-link to="/laptops?category=Gaming">Gaming</router-link></li>
                        <li><router-link to="/laptops?category=Business">Business</router-link></li>
                        <li><router-link to="/laptops?category=Student">Student</router-link></li>
                        <li><router-link to="/laptops?brand=Apple">MacBooks</router-link></li>
                        <li><router-link to="/accessories">Accessories</router-link></li>
                    </ul>
                </div>

                <!-- Column 4: Newsletter -->
                <div class="col-lg-4 col-md-6">
                    <h5 class="footer-title mb-4">Stay Updated</h5>
                    <p class="text-gray-400 mb-3">Subscribe to our newsletter for the latest tech news and exclusive offers.</p>
                    <form @submit.prevent="subscribe" class="newsletter-form position-relative mb-4">
                        <input type="email" class="form-control" placeholder="Enter your email" required>
                        <button type="submit" class="btn btn-primary subscribe-btn">
                            <i class="bi bi-send-fill"></i>
                        </button>
                    </form>
                    <div class="payment-methods mt-4">
                        <span class="text-gray-400 d-block mb-2 small">Secure Payments</span>
                        <div class="d-flex gap-2 text-gray-500 fs-3">
                            <i class="bi bi-credit-card-2-front-fill"></i>
                            <i class="bi bi-paypal"></i>
                            <i class="bi bi-stripe"></i>
                            <i class="bi bi-apple"></i>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="footer-divider mb-4">

            <div class="row align-items-center">
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <p class="mb-0 text-gray-500 small">
                        &copy; 2026 Lapzo Store. All rights reserved.
                    </p>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <ul class="list-inline mb-0 small text-gray-500">
                        <li class="list-inline-item"><a href="#" class="text-gray-500 text-decoration-none hover-white">Privacy Policy</a></li>
                        <li class="list-inline-item mx-2">&bull;</li>
                        <li class="list-inline-item"><a href="#" class="text-gray-500 text-decoration-none hover-white">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <!-- Back to Top Button -->
        <button @click="scrollToTop" class="back-to-top" :class="{ 'show': showBackToTop }" aria-label="Back to top">
            <i class="bi bi-arrow-up"></i>
        </button>
    </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showBackToTop = ref(false);

const handleScroll = () => {
    showBackToTop.value = window.scrollY > 500;
};

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const subscribe = () => {
    // Basic interaction for demo
    alert('Thank you for subscribing to our newsletter!');
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.footer-premium {
    background-color: var(--dark);
    position: relative;
    margin-top: 100px;
}

.footer-wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
    transform: translateY(-99%);
}

.footer-wave svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 60px;
}

.footer-wave .shape-fill {
    fill: var(--dark);
}

.logo-box-footer {
    width: 44px;
    height: 44px;
    background: var(--primary);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
}

.brand-name-footer {
    color: white;
    font-weight: 800;
    font-size: 28px;
    letter-spacing: -0.5px;
}

.text-gray-400 {
    color: #9ca3af;
    line-height: 1.7;
}

.text-gray-500 {
    color: #6b7280;
}

.footer-title {
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    position: relative;
    padding-bottom: 12px;
}

.footer-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background: var(--primary);
    border-radius: 2px;
}

.footer-links li {
    margin-bottom: 12px;
}

.footer-links a {
    color: #9ca3af;
    text-decoration: none;
    transition: var(--transition);
    display: inline-block;
}

.footer-links a:hover {
    color: var(--primary-light);
    transform: translateX(5px);
}

.social-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: var(--transition);
    font-size: 18px;
}

.social-icon:hover {
    background: var(--primary);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(37,99,235,0.3);
    color: white;
}

.newsletter-form .form-control {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    padding: 14px 20px;
    padding-right: 60px;
    border-radius: 12px;
}

.newsletter-form .form-control:focus {
    background: rgba(255,255,255,0.08);
    border-color: var(--primary);
    box-shadow: none;
}

.newsletter-form .form-control::placeholder {
    color: #6b7280;
}

.subscribe-btn {
    position: absolute;
    right: 5px;
    top: 5px;
    height: calc(100% - 10px);
    width: 44px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
}

.footer-divider {
    border-color: rgba(255,255,255,0.1);
    opacity: 1;
}

.hover-white:hover {
    color: white !important;
}

.payment-methods i {
    transition: var(--transition);
}

.payment-methods i:hover {
    color: white;
    transform: scale(1.1);
}

/* Back to top button */
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
    z-index: 999;
}

.back-to-top.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    background: var(--primary-dark);
    transform: translateY(-5px);
}

@media (max-width: 767px) {
    .footer-premium {
        margin-top: 60px;
    }
    
    .footer-wave svg {
        height: 30px;
    }
    
    .footer-content {
        padding-top: 2rem !important;
    }
    
    .footer-title {
        margin-top: 1.5rem;
    }
    
    .back-to-top {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
    }
}
</style>