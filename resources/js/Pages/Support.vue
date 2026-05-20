<template>
    <MainLayout>

        <section class="container py-5">

            <div class="text-center mb-5">

                <h1 class="display-4 fw-bold">
                    Customer Support
                </h1>

                <p class="text-muted">
                    Need help? We are here for you.
                </p>

            </div>

            <div class="row g-4">

                <div class="col-lg-4">

                    <div class="support-card">

                        <i class="bi bi-headset icon"></i>

                        <h4>
                            Live Chat
                        </h4>

                        <p class="text-muted">
                            24/7 customer assistance
                        </p>

                    </div>

                </div>

                <div class="col-lg-4">

                    <div class="support-card">

                        <i class="bi bi-envelope icon"></i>

                        <h4>
                            Email Support
                        </h4>

                        <p class="text-muted">
                            support@lapzo.com
                        </p>

                    </div>

                </div>

                <div class="col-lg-4">

                    <div class="support-card">

                        <i class="bi bi-telephone icon"></i>

                        <h4>
                            Call Us
                        </h4>

                        <p class="text-muted">
                            +92 300 1234567
                        </p>

                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import MainLayout from '../Layouts/MainLayout.vue'
</script>

<style scoped>
.support-card{
    background:white;
    border-radius:30px;
    text-align:center;
    padding:50px 30px;
    box-shadow:0 5px 30px rgba(0,0,0,.05);
}

.icon{
    font-size:50px;
    color:#2563eb;
    margin-bottom:20px;
}
</style>