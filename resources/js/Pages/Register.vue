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
              <h1 class="h3 fw-bold text-dark">Create Account</h1>
              <p class="text-muted small">Join Lapzo to manage orders and access deals.</p>
            </div>

            <form @submit.prevent="submitRegister">
              <div class="mb-3">
                <label class="form-label text-muted fw-semibold small tracking-wider text-uppercase">Full Name</label>
                <div class="input-group input-group-custom">
                  <span class="input-group-text bg-transparent border-end-0 text-muted"><i class="bi bi-person"></i></span>
                  <input
                    type="text"
                    class="form-control border-start-0 ps-0"
                    v-model="form.name"
                    required
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div class="mb-3">
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

              <div class="mb-3">
                <label class="form-label text-muted fw-semibold small tracking-wider text-uppercase">Password</label>
                <div class="input-group input-group-custom">
                  <span class="input-group-text bg-transparent border-end-0 text-muted"><i class="bi bi-lock"></i></span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control border-start-0 border-end-0 ps-0"
                    v-model="form.password"
                    required
                    placeholder="Create a password"
                  />
                  <button type="button" class="btn border-start-0 border text-muted px-3 rounded-end-3 d-flex align-items-center bg-transparent" @click="showPassword = !showPassword">
                    <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label text-muted fw-semibold small tracking-wider text-uppercase">Confirm Password</label>
                <div class="input-group input-group-custom">
                  <span class="input-group-text bg-transparent border-end-0 text-muted"><i class="bi bi-shield-check"></i></span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control border-start-0 ps-0"
                    v-model="form.password_confirmation"
                    required
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm auth-btn" :disabled="processing">
                <span v-if="processing" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ processing ? 'Creating Account...' : 'Sign Up' }}
              </button>
            </form>

            <div class="text-center mt-4 pt-3 border-top">
              <span class="text-muted small">Already have an account?</span>
              <router-link to="/login" class="text-primary text-decoration-none fw-bold ms-2 small">Sign In here</router-link>
            </div>

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
import { auth, db } from '../firebase_config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
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
const showPassword = ref(false)

const submitRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
     errorMessage.value = 'Passwords do not match!'
     return
  }
  
  if (form.value.password.length < 6) {
     errorMessage.value = 'Password should be at least 6 characters.'
     return
  }
  
  processing.value = true
  errorMessage.value = ''

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password)
    const user = userCredential.user
    
    await updateProfile(user, { displayName: form.value.name })
    
    await setDoc(doc(db, 'users', user.uid), {
        name: form.value.name,
        email: form.value.email,
        createdAt: new Date()
    })

    localStorage.setItem('api_token', 'firebase-token')
    
    await store.fetchUser()
    store.addToast(`Account created successfully! Welcome, ${form.value.name}!`, 'success')

    router.push('/')
  } catch (error) {
    let msg = 'Registration failed.'
    if (error.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.'
    } else if (error.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.'
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
  background: rgba(245, 158, 11, 0.15);
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
