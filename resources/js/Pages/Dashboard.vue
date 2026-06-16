<template>
    <section class="container py-5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
            <div>
                <h1 class="fw-bold text-dark">Admin Product Manager</h1>
                <p class="text-muted">Create, search, edit, and delete laptops from the inventory.</p>
            </div>

            <div class="d-flex gap-2 flex-wrap align-items-center">
                <router-link to="/admin/orders" class="btn btn-primary px-4 rounded-3 fw-bold">
                    <i class="bi bi-box-seam"></i> View All Orders
                </router-link>
                <button class="btn btn-outline-secondary px-4 rounded-3" type="button" @click="logout">
                    Logout
                </button>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-lg-5">
                <div class="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <h3 class="h5 fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                        <span>{{ form.id ? 'Edit Product 📝' : 'Create Product ➕' }}</span>
                    </h3>

                    <div class="mb-3">
                        <label class="form-label fw-semibold text-secondary small">Product Title</label>
                        <input type="text" class="form-control rounded-3" v-model="form.title" placeholder="e.g. MacBook Pro 16" />
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold text-secondary small">Brand</label>
                            <select class="form-select rounded-3" v-model.number="form.brand_id">
                                <option :value="null" disabled>Select a brand</option>
                                <option v-for="brand in availableBrands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold text-secondary small">Category</label>
                            <select class="form-select rounded-3" v-model.number="form.category_id">
                                <option :value="null" disabled>Select a category</option>
                                <option v-for="category in availableCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold text-secondary small">Price (Rs.)</label>
                            <input type="number" class="form-control rounded-3" v-model.number="form.price" placeholder="Base price" />
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold text-secondary small">Sale Price (Rs.)</label>
                            <input type="number" class="form-control rounded-3" v-model.number="form.sale_price" placeholder="Discount price" />
                        </div>
                    </div>

                    <div class="row g-3 mb-3">
                        <div class="col-6">
                            <label class="form-label fw-semibold text-secondary small">Stock Qty</label>
                            <input type="number" class="form-control rounded-3" v-model.number="form.stock" placeholder="Inventory Qty" />
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-semibold text-secondary small">SKU Code</label>
                            <input type="text" class="form-control rounded-3" v-model="form.sku" placeholder="e.g. MBP-16-M3" />
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold text-secondary small">Thumbnail Image URL</label>
                        <input type="text" class="form-control rounded-3" v-model="form.thumbnail" placeholder="https://example.com/image.jpg" />
                    </div>

                    <div class="mb-4">
                        <label class="form-label fw-semibold text-secondary small">Description</label>
                        <textarea class="form-control rounded-3" v-model="form.description" rows="3" placeholder="Enter short specification summary description..."></textarea>
                    </div>

                    <!-- Laptop Standard Specifications Block -->
                    <div class="border-top pt-3 mt-3 mb-4">
                        <h4 class="h6 fw-bold text-uppercase text-primary mb-3 d-flex align-items-center gap-2">
                            <i class="bi bi-cpu"></i> Standard Specifications
                        </h4>
                        
                        <div class="row g-2">
                            <div class="col-md-6 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Processor</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.processor" placeholder="e.g. Apple M3 Pro / Core i7" />
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">RAM Memory</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.ram" placeholder="e.g. 18GB Unified / 16GB" />
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Storage SSD</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.storage" placeholder="e.g. 512GB SSD" />
                            </div>
                            <div class="col-md-6 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Graphics GPU</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.graphics" placeholder="e.g. 14-core GPU / RTX 4050" />
                            </div>
                            <div class="col-md-12 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Screen Display</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.display" placeholder="e.g. 16.2 inch Liquid Retina XDR" />
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Battery</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.battery" placeholder="e.g. 100 Wh" />
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">OS</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.os" placeholder="e.g. macOS / Win 11" />
                            </div>
                            <div class="col-md-4 mb-2">
                                <label class="form-label fw-semibold text-secondary small mb-1">Weight</label>
                                <input type="text" class="form-control form-control-sm rounded-2" v-model="form.weight" placeholder="e.g. 2.14 kg" />
                            </div>
                        </div>
                    </div>

                    <!-- Custom Specifications Block -->
                    <div class="border-top pt-3 mt-3 mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="h6 fw-bold text-uppercase text-primary mb-0 d-flex align-items-center gap-2">
                                <i class="bi bi-plus-circle"></i> Custom Specifications
                            </h4>
                            <button type="button" class="btn btn-sm btn-outline-primary py-1 px-2.5 rounded-3 fw-bold" style="font-size: 0.8rem;" @click="addCustomSpecRow">
                                + Add Spec
                            </button>
                        </div>

                        <div v-for="(spec, index) in form.custom_specs" :key="index" class="d-flex gap-2 align-items-center mb-2">
                            <input type="text" class="form-control form-control-sm rounded-2" style="width: 40%;" v-model="spec.label" placeholder="Label (e.g. Color)" />
                            <input type="text" class="form-control form-control-sm rounded-2" style="width: 50%;" v-model="spec.value" placeholder="Value (e.g. Space Gray)" />
                            <button type="button" class="btn btn-sm btn-outline-danger border-0 p-1 rounded-circle" @click="removeCustomSpecRow(index)">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>

                        <p v-if="!form.custom_specs || form.custom_specs.length === 0" class="text-muted small text-center mb-0 py-2 border border-dashed rounded-3">
                            No custom specifications added. Click "+ Add Spec" to list others.
                        </p>
                    </div>

                    <div class="d-flex gap-4 mb-4">
                        <label class="d-flex align-items-center gap-2 fw-semibold text-secondary small cursor-pointer">
                            <input type="checkbox" class="form-check-input" v-model="form.featured" />
                            Featured Laptop
                        </label>
                        <label class="d-flex align-items-center gap-2 fw-semibold text-secondary small cursor-pointer">
                            <input type="checkbox" class="form-check-input" v-model="form.status" />
                            Active Listing
                        </label>
                    </div>

                    <button class="btn btn-primary w-100 py-2.5 rounded-3 fw-bold" type="button" @click="saveProduct">
                        {{ form.id ? 'Save Changes' : 'Publish Product' }}
                    </button>

                    <button v-if="form.id" class="btn btn-outline-secondary w-100 mt-2 py-2 rounded-3" type="button" @click="resetForm">
                        Cancel Edit
                    </button>

                    <div v-if="alertMessage" class="alert alert-info mt-3 py-2 text-center rounded-3 fw-semibold small" role="alert">
                        {{ alertMessage }}
                    </div>
                </div>
            </div>

            <div class="col-lg-7">
                <div class="card border-0 shadow-sm p-4 rounded-4 bg-white">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <h3 class="h5 fw-bold mb-0 text-dark">Laptops Inventory</h3>
                        <input
                            type="search"
                            class="form-control search-input rounded-3 w-50"
                            placeholder="Search by title..."
                            v-model="searchQuery"
                        />
                    </div>

                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                        <p class="text-muted mt-2">Loading inventory...</p>
                    </div>

                    <div v-else class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th class="text-secondary small">Product</th>
                                    <th class="text-secondary small">Brand</th>
                                    <th class="text-secondary small">Category</th>
                                    <th class="text-secondary small">Price</th>
                                    <th class="text-secondary small">Status</th>
                                    <th class="text-secondary small text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="product in filteredProducts" :key="product.id">
                                    <td>
                                        <div class="fw-semibold text-dark">{{ product.title }}</div>
                                        <div class="text-muted small" style="max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                            {{ product.description }}
                                        </div>
                                    </td>
                                    <td>{{ product.brand?.name }}</td>
                                    <td>{{ product.category?.name }}</td>
                                    <td class="fw-bold text-primary">Rs. {{ product.sale_price || product.price }}</td>
                                    <td>
                                        <span class="badge rounded-pill px-2 py-1" :class="product.status ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                                            {{ product.status ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td class="text-end">
                                        <div class="d-inline-flex gap-2">
                                            <button class="btn btn-sm btn-outline-primary rounded-3 px-3" type="button" @click="editProduct(product)">Edit</button>
                                            <button class="btn btn-sm btn-danger rounded-3 px-3" type="button" @click="deleteProduct(product.id)">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="filteredProducts.length === 0">
                                    <td colspan="6" class="text-center py-4 text-muted">No products found.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db, auth } from '../firebase_config'
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'

const router = useRouter()
const products = ref([])
const availableBrands = ref([
    { id: 'apple', name: 'Apple' },
    { id: 'hp', name: 'HP' },
    { id: 'dell', name: 'Dell' },
    { id: 'lenovo', name: 'Lenovo' },
    { id: 'asus', name: 'ASUS' },
])
const availableCategories = ref([
    { id: 'gaming', name: 'Gaming' },
    { id: 'business', name: 'Business' },
    { id: 'student', name: 'Student' },
    { id: 'creator', name: 'Creator' },
])
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
    processor: '',
    ram: '',
    storage: '',
    graphics: '',
    display: '',
    battery: '',
    os: '',
    weight: '',
    custom_specs: []
})

const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) {
        return products.value
    }
    const term = searchQuery.value.toLowerCase()
    return products.value.filter((product) => {
        return (
            product.title?.toLowerCase().includes(term) ||
            product.brand?.name?.toLowerCase().includes(term) ||
            product.category?.name?.toLowerCase().includes(term)
        )
    })
})

const loadProducts = async () => {
    loading.value = true
    try {
        const querySnapshot = await getDocs(collection(db, "products"))
        const prods = []
        querySnapshot.forEach((doc) => {
            prods.push({ id: doc.id, ...doc.data() })
        })
        products.value = prods
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
        processor: '',
        ram: '',
        storage: '',
        graphics: '',
        display: '',
        battery: '',
        os: '',
        weight: '',
        custom_specs: []
    }
    alertMessage.value = ''
}

const addCustomSpecRow = () => {
    if (!form.value.custom_specs) {
        form.value.custom_specs = []
    }
    form.value.custom_specs.push({ label: '', value: '' })
}

const removeCustomSpecRow = (index) => {
    form.value.custom_specs.splice(index, 1)
}

const saveProduct = async () => {
    try {
        if (!form.value.title) {
            alertMessage.value = 'Product title is required.'
            return
        }

        const cleanedCustomSpecs = (form.value.custom_specs || []).filter(item => item.label.trim() && item.value.trim())
        
        const payload = {
            title: form.value.title,
            description: form.value.description,
            price: form.value.price,
            sale_price: form.value.sale_price,
            stock: form.value.stock,
            sku: form.value.sku,
            thumbnail: form.value.thumbnail,
            featured: form.value.featured,
            status: form.value.status,
            category: availableCategories.value.find(c => c.id === form.value.category_id) || null,
            brand: availableBrands.value.find(b => b.id === form.value.brand_id) || null,
            specification: {
                processor: form.value.processor,
                ram: form.value.ram,
                storage: form.value.storage,
                graphics: form.value.graphics,
                display: form.value.display,
                battery: form.value.battery,
                os: form.value.os,
                weight: form.value.weight,
                custom_specs: cleanedCustomSpecs
            }
        }

        if (form.value.id) {
            await updateDoc(doc(db, "products", form.value.id), payload)
            alertMessage.value = 'Product updated successfully.'
        } else {
            await addDoc(collection(db, "products"), payload)
            alertMessage.value = 'Product created successfully.'
        }

        resetForm()
        await loadProducts()
    } catch (error) {
        console.error('Unable to save product:', error)
        alertMessage.value = 'Unable to save product. Check values and try again.'
    }
}

const editProduct = (product) => {
    let customSpecsParsed = []
    if (product.specification?.custom_specs) {
        customSpecsParsed = Array.isArray(product.specification.custom_specs)
            ? product.specification.custom_specs
            : (typeof product.specification.custom_specs === 'string' ? JSON.parse(product.specification.custom_specs) : [])
    }

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
        processor: product.specification?.processor || '',
        ram: product.specification?.ram || '',
        storage: product.specification?.storage || '',
        graphics: product.specification?.graphics || '',
        display: product.specification?.display || '',
        battery: product.specification?.battery || '',
        os: product.specification?.os || '',
        weight: product.specification?.weight || '',
        custom_specs: JSON.parse(JSON.stringify(customSpecsParsed))
    }
    alertMessage.value = ''
}

const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) {
        return
    }
    try {
        await deleteDoc(doc(db, "products", id))
        products.value = products.value.filter((product) => product.id !== id)
        alertMessage.value = 'Product deleted successfully.'
    } catch (error) {
        console.error('Unable to delete product:', error)
        alertMessage.value = 'Unable to delete product.'
    }
}

const logout = async () => {
    try {
        await auth.signOut()
    } catch (error) {
        console.warn('Logout failed:', error)
    }
    localStorage.removeItem('api_token')
    router.push('/login')
}

onMounted(() => {
    loadProducts()
})
</script>
