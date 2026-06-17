<template>
  <div class="login-page">
    <div class="login-left">
      <div class="login-header">
        <router-link to="/"
          ><img
            src="../assets/logo-municipalidad.png"
            alt="Municipalidad de Lucas González"
            class="logo-img"
        /></router-link>
      </div>
      <div class="login-body">
        <span class="left-tag">Plataforma Oficial</span>
        <h2>La plataforma de emprendimientos de Lucas González</h2>
        <p>Registrá tu negocio, publicá tus productos y conectá con la comunidad de Entre Ríos.</p>
        <div class="stats">
          <div class="stat">
            <span class="stat-n">240+</span>
            <span class="stat-l">Emprendimientos</span>
          </div>
          <div class="stat">
            <span class="stat-n">18</span>
            <span class="stat-l">Rubros</span>
          </div>
          <div class="stat">
            <span class="stat-n">5k+</span>
            <span class="stat-l">Vecinos</span>
          </div>
        </div>
      </div>
      <div class="login-footer-left">
        <span>© 2026 Municipalidad de Lucas González</span>
      </div>
    </div>

    <div class="login-right">
      <div class="login-card">
        <div class="card-header">
          <h1>Iniciar sesión</h1>
          <p class="subtitulo">Ingresá con tu cuenta registrada</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="campo">
            <label>Correo electrónico</label>
            <div class="input-wrap">
              <span class="input-icon">✉</span>
              <input v-model="email" type="email" placeholder="tu@email.com" required />
            </div>
          </div>
          <div class="campo">
            <label>Contraseña</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input v-model="password" type="password" placeholder="••••••••" required />
            </div>
          </div>
          <p v-if="error" class="error">⚠ {{ error }}</p>
          <button type="submit" class="btn-primary" :disabled="authStore.loading">
            {{ authStore.loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <div class="separador">
          <div class="sep-linea"></div>
          <span>¿No tenés cuenta?</span>
          <div class="sep-linea"></div>
        </div>

        <router-link to="/registro" class="btn-registro">
          Registrarse como emprendedor
        </router-link>

        <div class="footer-oficial">
          <span class="badge-oficial">✓ Oficial</span>
          <span>Plataforma gestionada por la Municipalidad</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

async function handleLogin() {
  error.value = ''
  try {
    await authStore.iniciarSesion(email.value, password.value)
    router.push('/dashboard')
  } catch {
    error.value = 'Email o contraseña incorrectos'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* ── Lado izquierdo ── */
.login-left {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-header {
  background: #ffffff;
  padding: 20px 48px;
  border-bottom: 0.5px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.logo-img {
  height: 52px;
}

.login-body {
  background: #1a3d2b;
  flex: 1;
  padding: 64px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.login-footer-left {
  background: #152e20;
  padding: 16px 48px;
  font-size: 12px;
  color: #4d7a63;
}

.left-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2e7d52;
  color: #a8d5b5;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  width: fit-content;
  letter-spacing: 0.5px;
}

.login-body h2 {
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.35;
  max-width: 380px;
}

.login-body p {
  font-size: 15px;
  color: #8ab5a0;
  line-height: 1.7;
  max-width: 360px;
}

.stats {
  display: flex;
  gap: 40px;
  margin-top: 16px;
  padding-top: 28px;
  border-top: 1px solid #2a4d38;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.stat-n {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
}

.stat-l {
  font-size: 12px;
  color: #6a9e83;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ── Lado derecho ── */
.login-right {
  background: #f2f2f0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  border: 0.5px solid #e0e0e0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.card-header {
  margin-bottom: 32px;
}

h1 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.subtitulo {
  font-size: 14px;
  color: #888;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  pointer-events: none;
}

.input-wrap input {
  padding-left: 36px;
  background: #fafafa;
  border: 0.5px solid #ddd;
  border-radius: 10px;
  height: 44px;
  font-size: 14px;
  width: 100%;
  transition:
    border 0.2s,
    background 0.2s;
}

.input-wrap input:focus {
  border-color: #2e7d52;
  background: #fff;
  outline: none;
}

.btn-primary {
  background: #1a3d2b;
  color: white;
  font-weight: 600;
  padding: 13px;
  border-radius: 10px;
  font-size: 15px;
  margin-top: 8px;
  letter-spacing: 0.3px;
  width: 100%;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2e7d52;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.separador {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 16px;
  font-size: 12px;
  color: #bbb;
}

.sep-linea {
  flex: 1;
  height: 0.5px;
  background: #e8e8e8;
}

.btn-registro {
  display: block;
  text-align: center;
  border: 1px solid #2e7d52;
  color: #2e7d52;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s;
}

.btn-registro:hover {
  background: #f0f9f4;
}

.footer-oficial {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 0.5px solid #eee;
  font-size: 12px;
  color: #aaa;
}

.badge-oficial {
  background: #eaf3de;
  color: #27500a;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.error {
  color: #e53935;
  font-size: 13px;
  background: #fff5f5;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #e53935;
}

/* ══════════════════════════════════
   RESPONSIVE — Tablet ≤ 768px
══════════════════════════════════ */
@media (max-width: 768px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-left {
    min-height: auto;
  }

  .login-header {
    padding: 16px 24px;
  }

  .login-body {
    padding: 40px 24px;
    gap: 16px;
  }

  .login-body h2 {
    font-size: 24px;
  }

  .login-footer-left {
    padding: 12px 24px;
  }

  .stats {
    gap: 24px;
  }

  .stat-n {
    font-size: 22px;
  }

  .login-right {
    padding: 24px 16px 40px;
  }

  .login-card {
    padding: 32px 24px;
  }
}

/* ══════════════════════════════════
   RESPONSIVE — Mobile ≤ 480px
══════════════════════════════════ */
@media (max-width: 480px) {
  .login-body {
    padding: 32px 20px;
  }

  .login-body h2 {
    font-size: 20px;
  }

  .stats {
    gap: 16px;
  }

  .stat-n {
    font-size: 20px;
  }

  .login-card {
    padding: 24px 16px;
    border-radius: 12px;
  }

  .login-right {
    padding: 16px 12px 32px;
  }
}
</style>
