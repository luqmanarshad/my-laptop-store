import './bootstrap'
import '../css/app.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import Home from './Pages/Home.vue'
import Laptops from './Pages/Laptops.vue'
import Brands from './Pages/Brands.vue'
import Accessories from './Pages/Accessories.vue'
import Deals from './Pages/Deals.vue'
import Support from './Pages/Support.vue'
import Categories from './Pages/Categories.vue'
import Compare from './Pages/Compare.vue'
import Wishlist from './Pages/Wishlist.vue'
import Dashboard from './Pages/Dashboard.vue'
import Login from './Pages/Login.vue'
import Register from './Pages/Register.vue'
import ProductDetails from './Pages/ProductDetails.vue'
import Cart from './Pages/Cart.vue'
import Orders from './Pages/Orders.vue'

import { store } from './utils/store'


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
            path: '/compare',
            component: Compare,
        },
        {
            path: '/wishlist',
            component: Wishlist,
        },
        {
            path: '/dashboard',
            component: Dashboard,
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/register',
            component: Register,
        },
        {
            path: '/product/:id',
            component: ProductDetails
        },
        {
            path: '/cart',
            component: Cart
        },
        {
            path: '/orders',
            component: Orders,
            meta: { requiresAuth: true }
        }
    ],
})

store.router = router

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('api_token')

    if (to.meta.requiresAuth && !token) {
        return next({ path: '/login' })
    }

    return next()
})

createApp(App)
.use(router)
.mount('#app')