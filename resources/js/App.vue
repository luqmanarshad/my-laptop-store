<template>
    <div class="app-container">
        <router-view />

        <!-- Modern Sonner-style Toast Notifications (Top Position) -->
        <div class="toast-container position-fixed top-0 end-0 p-4 d-flex flex-column align-items-end" style="z-index: 99999; gap: 10px; pointer-events: none;">
            <TransitionGroup name="toast">
                <div 
                    v-for="toast in store.toasts" 
                    :key="toast.id" 
                    class="toast-card d-flex align-items-center px-3 py-3 rounded-3 shadow-lg bg-white border"
                    :class="`toast-${toast.type}`"
                    style="pointer-events: auto;"
                >
                    <div class="toast-icon-wrapper me-3 d-flex align-items-center justify-content-center flex-shrink-0" :class="`text-${toast.type === 'danger' ? 'danger' : toast.type}`">
                        <i v-if="toast.type === 'success'" class="bi bi-check-circle-fill"></i>
                        <i v-else-if="toast.type === 'info'" class="bi bi-info-circle-fill"></i>
                        <i v-else-if="toast.type === 'warning'" class="bi bi-exclamation-triangle-fill"></i>
                        <i v-else class="bi bi-x-circle-fill"></i>
                    </div>
                    <div class="toast-content flex-grow-1 pe-3">
                        <span class="toast-message fw-semibold text-dark m-0" style="font-size: 0.95rem;">{{ toast.message }}</span>
                    </div>
                    <button @click="store.removeToast(toast.id)" class="btn-close ms-auto" aria-label="Close" style="font-size: 0.75rem; opacity: 0.5;"></button>
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
    width: 100%;
    min-width: 320px;
    max-width: 400px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.2) !important;
    border: 1px solid rgba(226, 232, 240, 0.8) !important;
    transition: all 0.4s cubic-bezier(0.21, 1.02, 0.73, 1);
    transform-origin: bottom right;
}

@media (max-width: 575px) {
    .toast-container {
        left: 0;
        right: 0;
        top: 0;
        bottom: auto;
        align-items: center !important;
        padding: 1rem !important;
    }
    .toast-card {
        min-width: 100%;
        max-width: 100%;
        transform-origin: bottom center;
    }
}

.toast-icon-wrapper {
    font-size: 20px;
}

/* Animations */
.toast-enter-from {
    opacity: 0;
    transform: translateY(-100%) scale(0.9);
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
    transform: scale(0.85) translateY(-20px);
}
.toast-leave-active {
    position: absolute;
}
</style>