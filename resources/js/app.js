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
import Compare from './pages/Compare.vue'
import Wishlist from './pages/Wishlist.vue'
import Dashboard from './pages/Dashboard.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ProductDetails from './pages/ProductDetails.vue'
import Cart from './pages/Cart.vue'
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