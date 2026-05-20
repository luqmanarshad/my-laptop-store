import './bootstrap'
import '../css/app.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import Home from './pages/Home.vue'
import Laptops from './pages/Laptops.vue'
import Brands from './pages/Brands.vue'
import Accessories from './pages/Accessories.vue'
import Deals from './pages/Deals.vue'
import Support from './pages/Support.vue'
import Categories from './pages/Categories.vue'
import ProductDetails
from './pages/ProductDetails.vue'
import Cart
from './pages/Cart.vue'

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/',
            component: Home,
        },

        {
            path: '/laptops',
            component: Laptops,
        },

        {
            path: '/brands',
            component: Brands,
        },

        {
            path: '/accessories',
            component: Accessories,
        },

        {
            path: '/deals',
            component: Deals,
        },

        {
            path: '/support',
            component: Support,
        },
        {
            path: '/categories',
            component: Categories,
        },
        {
            path: '/product/:id',
            component: ProductDetails
        },
        {
            path: '/cart',
            component: Cart
        }
    ],
})

createApp(App)
.use(router)
.mount('#app')