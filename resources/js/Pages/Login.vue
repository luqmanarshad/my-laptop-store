<template>
  <div class="auth-page-wrapper">
    <div class="auth-background">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="glow glow-3"></div>
    </div>
    
    <div class="container position-relative z-1 min-vh-100 d-flex flex-column justify-content-center py-5">
      <!-- Logo -->
      <div class="text-center mb-4 fade-in-up">
        <router-link to="/" class="text-decoration-none d-inline-flex align-items-center gap-2">
          <div class="logo-box">
            <i class="bi bi-laptop"></i>
          </div>
          <h2 class="brand-name mb-0 text-dark fw-bolder">Lapzo</h2>
        </router-link>
      </div>

      <div class="row justify-content-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-5">
          <div class="card auth-card border-0 p-4 p-md-5 fade-in-up" style="animation-delay: 0.1s;">
            <div class="text-center mb-4">
              <h1 class="h3 fw-bold text-dark">Welcome Back</h1>
              <p class="text-muted small">Sign in to your account to continue.</p>
            </div>

            <form @submit.prevent="submitLogin">
              <div class="mb-4">
                <label class="form-label text-muted fw-semibold small tracking-wider text-uppercase">Email Address</label>
                <div class="input-group input-group-custom">
                  <span class="input-group-text bg-transparent border-end-0 text-muted"><i class="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    class="form-control border-start-0 ps-0"
                    v-model="form.email"
                    required
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <label class="form-label text-muted fw-semibold small tracking-wider text-uppercase mb-0">Password</label>
                  <a href="#" class="small text-primary text-decoration-none fw-medium">Forgot password?</a>
                </div>
                <div class="input-group input-group-custom mt-2">
                  <span class="input-group-text bg-transparent border-end-0 text-muted"><i class="bi bi-lock"></i></span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control border-start-0 border-end-0 ps-0"
                    v-model="form.password"
                    required
                    placeholder="Enter your password"
                  />
                  <button type="button" class="btn border-start-0 border text-muted px-3 rounded-end-3 d-flex align-items-center bg-transparent" @click="showPassword = !showPassword">
                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="form-check mb-4">
                <input class="form-check-input custom-checkbox" type="checkbox" id="rememberMe">
                <label class="form-check-label text-muted small" for="rememberMe">
                  Remember me for 30 days
                </label>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm auth-btn" :disabled="processing">
                <span v-if="processing" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ processing ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <!-- Registration disabled for public -->
            <div v-if="errorMessage" class="alert alert-danger mt-4 border-0 rounded-3 d-flex align-items-start small fade-in-up" role="alert">
              <i class="bi bi-exclamation-triangle-fill me-2 mt-1"></i>
              <div>{{ errorMessage }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Back to Home -->
      <div class="text-center mt-5 fade-in-up" style="animation-delay: 0.2s;">
        <router-link to="/" class="text-muted text-decoration-none small hover-primary d-inline-flex align-items-center">
          <i class="bi bi-arrow-left me-2"></i> Back to Home
        </router-link>
      </div>
    </div>
  </div>
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
const showPassword = ref(false)

const submitLogin = async () => {
  processing.value = true
  errorMessage.value = ''

  try {
    const userCredential = await signInWithEmailAndPassword(auth, form.value.email, form.value.password)
    
    localStorage.setItem('api_token', 'firebase-token') // keep for app.js route guards
    
    await store.fetchUser()
    store.addToast(`Welcome back, ${store.user?.name || 'User'}!`, 'success')

    if (form.value.email === 'luqmanarshad469@gmail.com') {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  } catch (error) {
    let msg = 'Login failed. Please check your credentials.'
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.'
    } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Please try again later.'
    }
    errorMessage.value = msg
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
.auth-page-wrapper {
  position: relative;
  min-height: 100vh;
  background-color: #f8fafc;
  overflow: hidden;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}

.glow-1 {
  width: 400px;
  height: 400px;
  background: rgba(59, 130, 246, 0.2);
  top: -100px;
  left: -100px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: rgba(16, 185, 129, 0.15);
  bottom: -150px;
  right: -150px;
}

.glow-3 {
  width: 300px;
  height: 300px;
  background: rgba(139, 92, 246, 0.15);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.logo-box {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 4px 10px rgba(37,99,235,0.2);
}

.auth-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.input-group-custom .form-control,
.input-group-custom .input-group-text,
.input-group-custom .btn {
  border-color: #e2e8f0;
  transition: all 0.3s ease;
  height: 50px;
}

.input-group-custom .input-group-text {
  padding-left: 1rem;
  padding-right: 0.5rem;
}

.input-group-custom:focus-within .form-control,
.input-group-custom:focus-within .input-group-text,
.input-group-custom:focus-within .btn {
  border-color: var(--primary);
}

.input-group-custom:focus-within {
  box-shadow: 0 0 0 4px var(--primary-glow);
  border-radius: 8px;
}

.input-group-custom .form-control:focus {
  box-shadow: none;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.custom-checkbox {
  width: 1.2em;
  height: 1.2em;
  border-color: #cbd5e1;
  cursor: pointer;
}

.custom-checkbox:checked {
  background-color: var(--primary);
  border-color: var(--primary);
}

.auth-btn {
  transition: all 0.3s ease;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3) !important;
}

.hover-primary:hover {
  color: var(--primary) !important;
}

@media (max-width: 575px) {
  .auth-card {
    padding: 2rem 1.5rem !important;
  }
}
</style>
