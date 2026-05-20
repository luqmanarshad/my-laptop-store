<template>
    <MainLayout>

        <section class="container py-5">

            <div class="row">

                <!-- Image -->
                <div class="col-lg-6">

                    <img
                        :src="product.thumbnail"
                        class="img-fluid rounded-4 shadow"
                    >

                </div>

                <!-- Content -->
                <div class="col-lg-6">

                    <h1 class="fw-bold">
                        {{ product.title }}
                    </h1>

                    <p class="text-muted">
                        {{ product.brand?.name }}
                    </p>

                    <div class="mb-3">

                        <span
                            class="fs-2 fw-bold text-primary"
                        >
                            ${{ product.sale_price }}
                        </span>

                        <span
                            class="text-decoration-line-through ms-3 text-muted"
                        >
                            ${{ product.price }}
                        </span>

                    </div>

                    <p class="text-muted">
                        {{ product.description }}
                    </p>

                    <button
                        class="btn btn-primary btn-lg rounded-pill px-5"
                        @click="addToCart"
                    >
                        Add To Cart
                    </button>

                </div>

            </div>

            <!-- Specifications -->
            <div class="mt-5">

                <h3 class="fw-bold mb-4">
                    Specifications
                </h3>

                <table
                    class="table table-bordered"
                >

                    <tbody>

                        <tr>
                            <th>Processor</th>
                            <td>
                                {{ product.specification?.processor }}
                            </td>
                        </tr>

                        <tr>
                            <th>RAM</th>
                            <td>
                                {{ product.specification?.ram }}
                            </td>
                        </tr>

                        <tr>
                            <th>Storage</th>
                            <td>
                                {{ product.specification?.storage }}
                            </td>
                        </tr>

                        <tr>
                            <th>Graphics</th>
                            <td>
                                {{ product.specification?.graphics }}
                            </td>
                        </tr>

                        <tr>
                            <th>Display</th>
                            <td>
                                {{ product.specification?.display }}
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>

        </section>

    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

import MainLayout from '../Layouts/MainLayout.vue'

const route = useRoute()

const product = ref({})
const addToCart = async () => {

    try {

        const response =
            await axios.post(
                'http://127.0.0.1:8000/api/cart/add',
                {
                    product_id:
                        product.value.id
                }
            )

        alert(
            response.data.message
        )

    } catch (error) {

        console.error(error)
    }
}
const getProduct = async () => {

    const response =
        await axios.get(
            `http://127.0.0.1:8000/api/products/${route.params.id}`
        )

    product.value =
        response.data
}

onMounted(() => {
    getProduct()
})
</script>