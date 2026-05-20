<template>
    <section class="container py-5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
            <div>
                <h1 class="fw-bold">Admin Product Manager</h1>
                <p class="text-muted">Create, search, edit, and delete laptops from the inventory.</p>
            </div>

            <div class="d-flex gap-2 flex-wrap">
                <button class="btn btn-outline-secondary" type="button" @click="logout">
                    Logout
                </button>
                <router-link to="/wishlist" class="btn btn-outline-primary">Wishlist</router-link>
                <router-link to="/compare" class="btn btn-outline-primary">Compare</router-link>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm p-4">
                    <h3 class="h5 mb-3">Product Form</h3>

                    <div class="mb-3">
                        <label class="form-label">Title</label>
                        <input type="text" class="form-control" v-model="form.title" placeholder="Laptop title" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Brand</label>
                        <select class="form-select" v-model.number="form.brand_id">
                            <option value="" disabled>Select a brand</option>
                            <option v-for="brand in availableBrands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Category</label>
                        <select class="form-select" v-model.number="form.category_id">
                            <option value="" disabled>Select a category</option>
                            <option v-for="category in availableCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Price</label>
                        <input type="number" class="form-control" v-model.number="form.price" placeholder="Base price" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Sale Price</label>
                        <input type="number" class="form-control" v-model.number="form.sale_price" placeholder="Sale price (optional)" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Stock</label>
                        <input type="number" class="form-control" v-model.number="form.stock" placeholder="Inventory count" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Thumbnail URL</label>
                        <input type="text" class="form-control" v-model="form.thumbnail" placeholder="Image URL" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">SKU</label>
                        <input type="text" class="form-control" v-model="form.sku" placeholder="SKU" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" v-model="form.description" rows="4" placeholder="Product description"></textarea>
                    </div>

                    <div class="d-flex gap-2 flex-wrap mb-3">
                        <label class="d-flex align-items-center gap-2">
                            <input type="checkbox" v-model="form.featured" />
                            Featured
                        </label>
                        <label class="d-flex align-items-center gap-2">
                            <input type="checkbox" v-model="form.status" />
                            Active
                        </label>
                    </div>

                    <button class="btn btn-primary w-100" type="button" @click="saveProduct">
                        {{ form.id ? 'Update Product' : 'Create Product' }}
                    </button>

                    <button v-if="form.id" class="btn btn-outline-secondary w-100 mt-2" type="button" @click="resetForm">
                        Clear Form
                    </button>

                    <div v-if="alertMessage" class="alert alert-success mt-3" role="alert">
                        {{ alertMessage }}
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="card border-0 shadow-sm p-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <h3 class="h5 mb-0">Products</h3>
                        <input
                            type="search"
                            class="form-control search-input"
                            placeholder="Search products..."
                            v-model="searchQuery"
                        />
                    </div>

                    <div v-if="loading" class="text-center py-5">Loading products...</div>

                    <table v-else class="table table-hover">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="product in filteredProducts" :key="product.id">
                                <td>{{ product.title }}</td>
                                <td>{{ product.brand?.name }}</td>
                                <td>{{ product.category?.name }}</td>
                                <td>${{ product.sale_price || product.price }}</td>
                                <td>{{ product.status ? 'Active' : 'Inactive' }}</td>
                                <td class="text-end">
                                    <button class="btn btn-sm btn-outline-primary me-2" type="button" @click="editProduct(product)">Edit</button>
                                    <button class="btn btn-sm btn-danger" type="button" @click="deleteProduct(product.id)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const products = ref([])
const loading = ref(true)
const searchQuery = ref('')
const alertMessage = ref('')

const form = ref({
    id: null,
    category_id: null,
    brand_id: null,
    title: '',
    description: '',
    price: 0,
    sale_price: null,
    stock: 0,
    sku: '',
    thumbnail: '',
    featured: false,
    status: true,
})

const availableBrands = computed(() => {
    const brands = []

    products.value.forEach((product) => {
        if (product.brand && !brands.some((item) => item.id === product.brand.id)) {
            brands.push(product.brand)
        }
    })

    return brands
})

const availableCategories = computed(() => {
    const categories = []

    products.value.forEach((product) => {
        if (product.category && !categories.some((item) => item.id === product.category.id)) {
            categories.push(product.category)
        }
    })

    return categories
})

const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) {
        return products.value
    }

    return products.value.filter((product) => {
        const term = searchQuery.value.toLowerCase()
        return (
            product.title.toLowerCase().includes(term) ||
            product.brand?.name.toLowerCase().includes(term) ||
            product.category?.name.toLowerCase().includes(term) ||
            String(product.price).includes(term) ||
            String(product.sale_price || '').includes(term)
        )
    })
})

const loadProducts = async () => {
    loading.value = true

    try {
        const response = await axios.get('/api/products', {
            params: {
                all: true,
            },
        })
        products.value = response.data
    } catch (error) {
        console.error('Unable to load products:', error)
    } finally {
        loading.value = false
    }
}

const resetForm = () => {
    form.value = {
        id: null,
        category_id: null,
        brand_id: null,
        title: '',
        description: '',
        price: 0,
        sale_price: null,
        stock: 0,
        sku: '',
        thumbnail: '',
        featured: false,
        status: true,
    }
    alertMessage.value = ''
}

const saveProduct = async () => {
    try {
        if (!form.value.title || !form.value.category_id || !form.value.brand_id) {
            alertMessage.value = 'Title, brand, and category are required.'
            return
        }

        if (form.value.id) {
            const response = await axios.put(`/api/products/${form.value.id}`, form.value)
            products.value = products.value.map((product) => (product.id === response.data.id ? response.data : product))
            alertMessage.value = 'Product updated successfully.'
        } else {
            const response = await axios.post('/api/products', form.value)
            products.value.unshift(response.data)
            alertMessage.value = 'Product created successfully.'
        }

        resetForm()
        await loadProducts()
    } catch (error) {
        console.error('Unable to save product:', error)
        alertMessage.value = 'Unable to save product. Check your values and try again.'
    }
}

const editProduct = (product) => {
    form.value = {
        id: product.id,
        category_id: product.category?.id || null,
        brand_id: product.brand?.id || null,
        title: product.title,
        description: product.description || '',
        price: product.price,
        sale_price: product.sale_price,
        stock: product.stock,
        sku: product.sku || '',
        thumbnail: product.thumbnail || '',
        featured: product.featured,
        status: product.status,
    }
    alertMessage.value = ''
}

const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) {
        return
    }

    try {
        await axios.delete(`/api/products/${id}`)
        products.value = products.value.filter((product) => product.id !== id)
        alertMessage.value = 'Product deleted successfully.'
    } catch (error) {
        console.error('Unable to delete product:', error)
        alertMessage.value = 'Unable to delete product.'
    }
}

const logout = async () => {
    try {
        await axios.post('/api/logout')
    } catch (error) {
        console.warn('Logout failed:', error)
    }

    localStorage.removeItem('api_token')
    delete axios.defaults.headers.common.Authorization
    router.push('/login')
}

onMounted(() => {
    loadProducts()
})
</script>
