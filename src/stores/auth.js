import { defineStore } from 'pinia'
import { ref } from 'vue'

const BASE_URL = '/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const token = ref(null)

  async function iniciarSesion(email, password) {
    loading.value = true
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.[0]?.message || 'Error')
      token.value = data.data.access_token
      const meRes = await fetch(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = (await meRes.json()).data
    } catch (error) {
      console.log('Error login:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function cerrarSesion() {
    token.value = null
    user.value = null
  }

  return { user, loading, token, iniciarSesion, cerrarSesion }
})
