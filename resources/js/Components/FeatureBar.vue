<template>
    <div class="container mt-4 mb-5">

        <div class="bg-white shadow-sm rounded-4 p-4 p-md-5 feature-bar-container">

            <div class="row text-center g-4">

                <div class="col-6 col-md-3 feature-item">

                    <div class="icon-wrapper mb-3 mx-auto">
                        <i class="bi bi-truck text-primary"></i>
                    </div>

                    <h6 class="fw-bold mb-1 feature-title">
                        Free Shipping
                    </h6>

                    <small class="text-muted feature-desc d-none d-sm-block">
                        Orders over $499
                    </small>

                </div>

                <div class="col-6 col-md-3 feature-item">

                    <div class="icon-wrapper mb-3 mx-auto">
                        <i class="bi bi-shield-check text-primary"></i>
                    </div>

                    <h6 class="fw-bold mb-1 feature-title">
                        2 Years Warranty
                    </h6>
                    
                    <small class="text-muted feature-desc d-none d-sm-block">
                        On all laptops
                    </small>

                </div>

                <div class="col-6 col-md-3 feature-item">

                    <div class="icon-wrapper mb-3 mx-auto">
                        <i class="bi bi-arrow-repeat text-primary"></i>
                    </div>

                    <h6 class="fw-bold mb-1 feature-title">
                        30 Days Return
                    </h6>
                    
                    <small class="text-muted feature-desc d-none d-sm-block">
                        No questions asked
                    </small>

                </div>

                <div class="col-6 col-md-3 feature-item">

                    <div class="icon-wrapper mb-3 mx-auto">
                        <i class="bi bi-headset text-primary"></i>
                    </div>

                    <h6 class="fw-bold mb-1 feature-title">
                        24/7 Support
                    </h6>
                    
                    <small class="text-muted feature-desc d-none d-sm-block">
                        Expert assistance
                    </small>

                </div>

            </div>

        </div>

    </div>
</template>

<style scoped>
.feature-bar-container {
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: var(--transition);
}

.feature-bar-container:hover {
    box-shadow: var(--shadow-md) !important;
}

.icon-wrapper {
    width: 64px;
    height: 64px;
    background: var(--bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    transition: var(--transition);
}

.feature-item:hover .icon-wrapper {
    background: var(--primary-glow);
    transform: translateY(-5px) scale(1.05);
}

.feature-title {
    color: var(--dark);
    font-size: 1rem;
}

@media (max-width: 767px) {
    .icon-wrapper {
        width: 50px;
        height: 50px;
        font-size: 22px;
        margin-bottom: 0.5rem !important;
    }
    
    .feature-title {
        font-size: 0.85rem;
    }
    
    .feature-bar-container {
        padding: 1.2rem !important;
    }
    
    .feature-item {
        margin-bottom: 0.5rem;
    }
}
</style>