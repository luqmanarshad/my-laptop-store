<template>
  <section class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm p-4">
          <div class="text-center mb-4">
            <h1 class="h3">Admin Sign In</h1>
            <p class="text-muted">Use your account credentials to manage the catalog.</p>
          </div>

          <form @submit.prevent="submitLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                v-model="form.email"
                required
                placeholder="admin@example.com"
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

            <button type="submit" class="btn btn-primary w-100" :disabled="processing">
              {{ processing ? 'Signing in…' : 'Sign In' }}
            </button>
          </form>

          <div class="text-center mt-3">
            <span class="text-muted">Don't have an account?</span>
            <router-link to="/register" class="ms-2">Sign Up</router-link>
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
import { auth } from '../firebase_config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { store } from '../utils/store'

const router = useRouter()
const form = ref({
  email: '',
  password: '',
})
const processing = ref(false)
const errorMessage = ref('')

const submitLogin = async () => {
  processing.value = true
  errorMessage.value = ''

  try {
    const userCredential = await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
    
    localStorage.setItem('api_token', 'firebase-token') // keep for app.js route guards
    
    await store.fetchUser()
    store.addToast(`Welcome back, ${store.user?.name || 'User'}!`, 'success')

    if (form.value.email === 'admin@example.com') {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please check your credentials.'
  } finally {
    processing.value = false
  }
}
</script>
