<template>
    <MainLayout>

        <div class="container py-5">

            <h1 class="fw-bold mb-4">
                All Categories
            </h1>

            <div class="row g-4">

                <div class="col-lg-3 col-md-6">

                    <div class="card p-4 rounded-4 shadow-sm text-center border-0 h-100">
                        <i class="bi bi-controller fs-1 text-primary mb-3"></i>

                        <h4>
                            Gaming Laptops
                        </h4>
                    </div>

                </div>

                <div class="col-lg-3 col-md-6">

                    <div class="card p-4 rounded-4 shadow-sm text-center border-0 h-100">
                        <i class="bi bi-briefcase fs-1 text-primary mb-3"></i>

                        <h4>
                            Business Laptops
                        </h4>
                    </div>

                </div>

                <div class="col-lg-3 col-md-6">

                    <div class="card p-4 rounded-4 shadow-sm text-center border-0 h-100">
                        <i class="bi bi-book fs-1 text-primary mb-3"></i>

                        <h4>
                            Student Laptops
                        </h4>
                    </div>

                </div>

                <div class="col-lg-3 col-md-6">

                    <div class="card p-4 rounded-4 shadow-sm text-center border-0 h-100">
                        <i class="bi bi-apple fs-1 text-primary mb-3"></i>

                        <h4>
                            MacBooks
                        </h4>
                    </div>

                </div>

            </div>

        </div>

    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'
</script>