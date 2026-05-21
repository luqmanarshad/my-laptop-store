<template>
    <div class="app-container">
        <router-view />

        <!-- Custom Glassmorphic Toast Notifications -->
        <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 99999;">
            <TransitionGroup name="toast">
                <div 
                    v-for="toast in store.toasts" 
                    :key="toast.id" 
                    class="toast-card d-flex align-items-center p-3 mb-3 rounded-4"
                    :class="`toast-${toast.type}`"
                >
                    <div class="toast-icon-wrapper me-3 d-flex align-items-center justify-content-center">
                        <i v-if="toast.type === 'success'" class="bi bi-check-circle-fill"></i>
                        <i v-else-if="toast.type === 'info'" class="bi bi-info-circle-fill"></i>
                        <i v-else-if="toast.type === 'warning'" class="bi bi-exclamation-triangle-fill"></i>
                        <i v-else class="bi bi-x-circle-fill"></i>
                    </div>
                    <div class="toast-content flex-grow-1">
                        <span class="toast-message fw-semibold text-white">{{ toast.message }}</span>
                    </div>
                    <button @click="store.removeToast(toast.id)" class="btn-close btn-close-white ms-3" aria-label="Close"></button>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup>
import { store } from './utils/store'
</script>

<style>
.toast-card {
    min-width: 320px;
    max-width: 420px;
    background: rgba(17, 24, 39, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1) !important;
    border-left: 5px solid #2563eb !important;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-success {
    border-left-color: #10b981 !important;
}
.toast-success .toast-icon-wrapper {
    color: #10b981;
}

.toast-info {
    border-left-color: #3b82f6 !important;
}
.toast-info .toast-icon-wrapper {
    color: #3b82f6;
}

.toast-warning {
    border-left-color: #f59e0b !important;
}
.toast-warning .toast-icon-wrapper {
    color: #f59e0b;
}

.toast-danger {
    border-left-color: #ef4444 !important;
}
.toast-danger .toast-icon-wrapper {
    color: #ef4444;
}

.toast-icon-wrapper {
    font-size: 22px;
}

.toast-message {
    font-size: 14px;
}

/* Animations */
.toast-enter-from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
}
.toast-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
}
.toast-leave-from {
    opacity: 1;
    transform: scale(1);
}
.toast-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
}
.toast-leave-active {
    position: absolute;
    right: 24px;
}
</style>