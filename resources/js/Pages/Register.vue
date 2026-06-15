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

const submitRegister = async () => {
  if (form.value.password !== form.value.password_confirmation) {
     errorMessage.value = 'Passwords do not match!'
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
    errorMessage.value = error.message || 'Registration failed.'
  } finally {
    processing.value = false
  }
}
</script>
