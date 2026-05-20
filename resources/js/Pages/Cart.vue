<template>
    <MainLayout>

        <section class="container py-5">

            <h1 class="fw-bold mb-4">
                Shopping Cart
            </h1>

            <div class="row">

                <!-- Cart Items -->
                <div class="col-lg-8">

                    <div
                        class="card border-0 shadow-sm rounded-4 p-4"
                    >

                        <div
                            v-if="cart.length === 0"
                            class="text-center py-5"
                        >
                            Cart is empty
                        </div>

                        <div
                            v-for="item in cart"
                            :key="item.id"
                            class="d-flex align-items-center border-bottom py-4"
                        >

                            <img
                                :src="item.product.thumbnail"
                                class="cart-image"
                            >

                            <div class="ms-4 flex-grow-1">

                                <h5 class="fw-bold">
                                    {{ item.product.title }}
                                </h5>

                                <p class="text-muted">
                                    Qty:
                                    {{ item.quantity }}
                                </p>

                                <div class="fw-bold text-primary">
                                    $
                                    {{ item.price }}
                                </div>

                            </div>

                            <button
                                class="btn btn-danger rounded-pill"
                                @click="removeItem(item.id)"
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

                <!-- Summary -->
                <div class="col-lg-4">

                    <div
                        class="card border-0 shadow rounded-4 p-4"
                    >

                        <h4 class="fw-bold mb-4">
                            Order Summary
                        </h4>

                        <div
                            class="d-flex justify-content-between mb-3"
                        >
                            <span>Total</span>

                            <strong>
                                ${{ grandTotal }}
                            </strong>
                        </div>

                        <button
                            class="btn btn-primary w-100 rounded-pill py-3"
                        >
                            Checkout
                        </button>

                    </div>

                </div>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

import MainLayout from '../Layouts/MainLayout.vue'

const cart = ref([])

const getCart = async () => {

    const response =
        await axios.get(
            'http://127.0.0.1:8000/api/cart'
        )

    cart.value =
        response.data
}

const removeItem =
async (id) => {

    await axios.delete(
        `http://127.0.0.1:8000/api/cart/${id}`
    )

    getCart()
}

const grandTotal =
computed(() => {

    return cart.value.reduce(
        (total, item) => {

            return total +
                (
                    item.price *
                    item.quantity
                )
        },
        0
    )
})

onMounted(() => {
    getCart()
})
</script>

<style scoped>
.cart-image{
    width:120px;
    height:90px;
    object-fit:cover;
    border-radius:20px;
}
</style>