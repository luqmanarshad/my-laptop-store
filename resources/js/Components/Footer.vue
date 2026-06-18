<template>
    <footer class="footer-premium mt-auto">
        <!-- Clean Gradient Divider -->
        <div class="footer-divider-top"></div>

        <div class="container footer-content py-4 py-md-5">
            <div class="row g-4 mb-4">
                <!-- Column 1: Brand & About -->
                <div class="col-12 col-lg-4 col-md-6">
                    <div class="d-flex align-items-center mb-3 mb-md-4 gap-2">
                        <div class="logo-box-footer me-1 me-md-2">
                            <i class="bi bi-laptop"></i>
                        </div>
                        <h2 class="brand-name-footer mb-0">Lapzo</h2>
                    </div>
                    <p class="text-gray-400 mb-4 mb-md-4 pe-lg-4" style="line-height:1.7;">
                        Your ultimate destination for high-performance laptops. We bring you the best deals on gaming, business, and creator laptops.
                    </p>
                    <div class="social-links d-flex gap-2 gap-md-3 flex-wrap">
                        <a href="#" class="social-icon" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="social-icon" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
                        <a href="#" class="social-icon" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="social-icon" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                    </div>
                </div>

                <!-- Column 2: Quick Links -->
                <div class="col-6 col-lg-2 col-md-3">
                    <h5 class="footer-title mb-3 mb-md-4">Quick Links</h5>
                    <ul class="footer-links list-unstyled">
                        <li><router-link to="/">Home</router-link></li>
                        <li><router-link to="/laptops">All Laptops</router-link></li>
                        <li><router-link to="/deals">Special Deals</router-link></li>
                        <li><router-link to="/support">Support</router-link></li>
                        <li><router-link to="/login">Sign In</router-link></li>
                    </ul>
                </div>

                <!-- Column 3: Categories -->
                <div class="col-6 col-lg-2 col-md-3">
                    <h5 class="footer-title mb-3 mb-md-4">Categories</h5>
                    <ul class="footer-links list-unstyled">
                        <li><router-link to="/laptops?category=Gaming">Gaming</router-link></li>
                        <li><router-link to="/laptops?category=Business">Business</router-link></li>
                        <li><router-link to="/laptops?category=Student">Student</router-link></li>
                        <li><router-link to="/laptops?brand=Apple">MacBooks</router-link></li>
                        <li><router-link to="/accessories">Accessories</router-link></li>
                    </ul>
                </div>

                <!-- Column 4: Contact & Newsletter -->
                <div class="col-12 col-lg-4 col-md-6">
                    <h5 class="footer-title mb-3 mb-md-4">Stay Updated</h5>
                    <p class="text-gray-400 mb-3" style="font-size:0.85rem;">Subscribe for the latest tech news and exclusive offers.</p>
                    <form @submit.prevent="subscribe" class="newsletter-form position-relative mb-4">
                        <input type="email" class="form-control" placeholder="Enter your email" required>
                        <button type="submit" class="btn btn-primary subscribe-btn">
                            <i class="bi bi-send-fill"></i>
                        </button>
                    </form>
                    <div class="contact-info">
                        <div class="d-flex align-items-center gap-2 mb-2 text-gray-400" style="font-size:0.8rem;">
                            <i class="bi bi-telephone-fill text-primary"></i>
                            <span>+92 336 400 3281</span>
                        </div>
                        <div class="d-flex align-items-center gap-2 text-gray-400" style="font-size:0.8rem;">
                            <i class="bi bi-geo-alt-fill text-primary"></i>
                            <span>Narowal, Punjab, Pakistan</span>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="footer-hr mb-3 mb-md-4">

            <div class="row align-items-center g-2">
                <div class="col-12 col-md-6 text-center text-md-start">
                    <p class="mb-2 mb-md-0 text-gray-500 small">
                        &copy; 2026 <span class="text-white fw-semibold">Lapzo</span> Store. All rights reserved.
                    </p>
                </div>
                <div class="col-12 col-md-6 text-center text-md-end">
                    <ul class="list-inline mb-0 small text-gray-500">
                        <li class="list-inline-item"><a href="#" class="text-gray-500 text-decoration-none hover-white">Privacy Policy</a></li>
                        <li class="list-inline-item mx-1 mx-md-2">&bull;</li>
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
    background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%);
    position: relative;
}

.footer-divider-top {
    height: 4px;
    background: linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #0ea5e9 100%);
    width: 100%;
}

.logo-box-footer {
    width: 38px;
    height: 38px;
    background: var(--primary);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    flex-shrink: 0;
}

.brand-name-footer {
    color: white;
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
}

.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }

.footer-title {
    color: white;
    font-weight: 700;
    font-size: 0.95rem;
    position: relative;
    padding-bottom: 8px;
}

.footer-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 28px;
    height: 2px;
    background: var(--primary);
    border-radius: 2px;
}

.footer-links li { margin-bottom: 8px; }

.footer-links a {
    color: #9ca3af;
    text-decoration: none;
    font-size: 0.85rem;
    transition: var(--transition);
    display: inline-block;
}

.footer-links a:hover {
    color: #60a5fa;
    transform: translateX(4px);
}

.social-icon {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    text-decoration: none;
    transition: var(--transition);
    font-size: 14px;
    border: 1px solid rgba(255,255,255,0.08);
}

.social-icon:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(37,99,235,0.35);
    border-color: transparent;
}

.newsletter-form .form-control {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: white;
    padding: 10px 14px;
    padding-right: 44px;
    border-radius: 8px;
    font-size: 0.85rem;
}

.newsletter-form .form-control:focus {
    background: rgba(255,255,255,0.09);
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37,99,235,0.2);
    color: white;
}

.newsletter-form .form-control::placeholder { color: #6b7280; }

.subscribe-btn {
    position: absolute;
    right: 4px;
    top: 4px;
    height: calc(100% - 8px);
    width: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 0.8rem;
}

.footer-hr {
    border-color: rgba(255,255,255,0.08);
    opacity: 1;
}

.hover-white:hover { color: white !important; }

/* Back to top */
.back-to-top {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(16px);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 8px 24px rgba(37,99,235,0.4);
    z-index: 999;
}

.back-to-top.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.back-to-top:hover {
    background: var(--primary-dark);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(37,99,235,0.5);
}

@media (max-width: 575px) {
    .brand-name-footer { font-size: 1.35rem; }
    .logo-box-footer { width: 34px; height: 34px; font-size: 18px; }
    .footer-content { padding-top: 1.25rem !important; padding-bottom: 1.25rem !important; }
    .footer-title { font-size: 0.9rem; margin-top: 1.25rem; }
    .footer-links a { font-size: 0.8rem; }
    .social-icon { width: 32px; height: 32px; font-size: 13px; }
    .back-to-top { bottom: 16px; right: 16px; width: 38px; height: 38px; }
}

@media (min-width: 768px) {
    .brand-name-footer { font-size: 1.6rem; }
    .logo-box-footer { width: 42px; height: 42px; font-size: 22px; }
    .footer-title { font-size: 1rem; margin-top: 0; }
}
</style>