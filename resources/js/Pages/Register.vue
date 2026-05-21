<template>
  <section class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm p-4">
          <div class="text-center mb-4">
            <h1 class="h3">Create an Account</h1>
            <p class="text-muted">Sign up to manage products and access the dashboard.</p>
          </div>

          <form @submit.prevent="submitRegister">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input
                type="text"
                class="form-control"
                v-model="form.name"
                required
                placeholder="Your name"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model="form.email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                v-model="form.password"
                required
                placeholder="Password"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input
                type="password"
                class="form-control"
                v-model="form.password_confirmation"
                required
                placeholder="Confirm password"
              />
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="processing">
              {{ processing ? 'Signing up…' : 'Sign Up' }}
            </button>
          </form>

          <div class="text-center mt-3">
            <span class="text-muted">Already registered?</span>
            <router-link to="/login" class="ms-2">Sign In</router-link>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { store } from '../utils/store'

const router = useRouter()
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})
const processing = ref(false)
const errorMessage = ref('')

const submitRegister = async () => {
  processing.value = true
  errorMessage.value = ''

  try {
    const response = await axios.post('/api/register', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    })

    localStorage.setItem('api_token', response.data.token)
    axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`

    await store.fetchUser()
    store.addToast(`Account created successfully! Welcome, ${store.user?.name}!`, 'success')

    router.push('/')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please check your information.'
  } finally {
    processing.value = false
  }
}
</script>
