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
import AdminOrders from './Pages/AdminOrders.vue'

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
            meta: { requiresAuth: true, requiresAdmin: true },
        },
        {
            path: '/login',
            component: Login,
        },
        {
            path: '/register',
            redirect: '/login', // Registration disabled
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
        },
        {
            path: '/admin/orders',
            component: AdminOrders,
            meta: { requiresAuth: true, requiresAdmin: true }
        }
    ],
})

store.router = router

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('api_token')

    if (to.meta.requiresAuth && !token) {
        return next({ path: '/login' })
    }

    // Wait for user to be populated if token exists but user doesn't
    if (token && !store.user) {
        await store.fetchUser()
    }

    if (to.meta.requiresAdmin) {
        if (!store.user || !store.user.isAdmin) {
            store.addToast('Access Denied: Admins Only', 'danger')
            return next({ path: '/' })
        }
    }

    return next()
})

createApp(App)
.use(router)
.mount('#app')