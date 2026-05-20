import axios from 'axios'

window.axios = axios

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true

const storedToken = localStorage.getItem('api_token')
if (storedToken) {
    window.axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
}