<template>
  <div class="registro-page">
    <div class="registro-left">
      <div class="registro-header">
        <router-link to="/"
          ><img src="../assets/logo-municipalidad.png" alt="Municipalidad" class="logo-img"
        /></router-link>
      </div>
      <div class="registro-body">
        <span class="left-tag">Plataforma Oficial</span>
        <h2>Registrate como emprendedor</h2>
        <p>
          Creá tu cuenta, registrá tus emprendimientos y llegá a más clientes en Lucas González.
        </p>
        <div class="pasos">
          <div class="paso">
            <div class="paso-num">1</div>
            <div>
              <p class="paso-title">Creá tu cuenta</p>
              <p class="paso-sub">Completá tus datos personales</p>
            </div>
          </div>
          <div class="paso">
            <div class="paso-num">2</div>
            <div>
              <p class="paso-title">Registrá tu emprendimiento</p>
              <p class="paso-sub">Cargá los datos de tu negocio</p>
            </div>
          </div>
          <div class="paso">
            <div class="paso-num">3</div>
            <div>
              <p class="paso-title">Esperá la aprobación</p>
              <p class="paso-sub">La municipalidad lo revisará</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="registro-right">
      <div class="registro-card">
        <div v-if="exito" class="exito">
          <div class="exito-icon">✓</div>
          <p class="exito-title">¡Cuenta creada exitosamente!</p>
          <p class="exito-sub">Ya podés iniciar sesión con tu email y contraseña.</p>
          <router-link to="/login" class="btn-primary">Ir al login</router-link>
        </div>

        <template v-else>
          <h1>Crear cuenta</h1>
          <p class="subtitulo">Completá tus datos para registrarte</p>

          <form @submit.prevent="handleRegistro" class="registro-form">
            <div class="form-grid">
              <div class="campo">
                <label>Nombre *</label>
                <input v-model="form.first_name" placeholder="Tu nombre" required />
              </div>
              <div class="campo">
                <label>Apellido *</label>
                <input v-model="form.last_name" placeholder="Tu apellido" required />
              </div>
            </div>
            <div class="campo">
              <label>Correo electrónico *</label>
              <div class="input-wrap">
                <span class="input-icon">✉</span>
                <input v-model="form.email" type="email" placeholder="tu@email.com" required />
              </div>
            </div>
            <div class="campo">
              <label>Contraseña *</label>
              <div class="input-wrap">
                <span class="input-icon">🔒</span>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minlength="8"
                />
              </div>
            </div>
            <div class="campo">
              <label>Confirmar contraseña *</label>
              <div class="input-wrap">
                <span class="input-icon">🔒</span>
                <input
                  v-model="confirmar"
                  type="password"
                  placeholder="Repetí tu contraseña"
                  required
                />
              </div>
            </div>

            <p v-if="error" class="error">⚠ {{ error }}</p>

            <button type="submit" class="btn-primary" :disabled="cargando">
              {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }}
            </button>
          </form>

          <div class="separador">
            <div class="sep-linea"></div>
            <span>¿Ya tenés cuenta?</span>
            <div class="sep-linea"></div>
          </div>
          <router-link to="/login" class="btn-login">Iniciar sesión</router-link>
        </template>

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

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
})
const confirmar = ref('')
const error = ref('')
const cargando = ref(false)
const exito = ref(false)

async function handleRegistro() {
  error.value = ''

  if (form.value.password !== confirmar.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (form.value.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return
  }

  cargando.value = true
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: form.value.first_name,
        last_name: form.value.last_name,
        email: form.value.email,
        password: form.value.password,
      }),
    })

    const data = await res.json()
    console.log('Respuesta Directus:', data)

    if (!res.ok) {
      error.value = data.errors?.[0]?.message || 'Error al crear la cuenta'
      return
    }

    exito.value = true
  } catch (err) {
    console.log('Error:', err)
    error.value = 'Error de conexión. Intentá de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.registro-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.registro-left {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.registro-header {
  background: #fff;
  padding: 20px 48px;
  border-bottom: 0.5px solid #e0e0e0;
  height: 64px;
  display: flex;
  align-items: center;
}

.logo-img {
  height: 52px;
}

.registro-body {
  background: #1a3d2b;
  flex: 1;
  padding: 64px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.left-tag {
  display: inline-block;
  background: #2e7d52;
  color: #a8d5b5;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 14px;
  border-radius: 20px;
  width: fit-content;
}

.registro-body h2 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
}

.registro-body p {
  font-size: 15px;
  color: #8ab5a0;
  line-height: 1.7;
}

.pasos {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid #2a4d38;
}

.paso {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.paso-num {
  width: 28px;
  height: 28px;
  background: #2e7d52;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.paso-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.paso-sub {
  font-size: 12px;
  color: #6a9e83;
}

.registro-right {
  background: #f2f2f0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.registro-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 440px;
  border: 0.5px solid #e0e0e0;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
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
  margin-bottom: 28px;
}

.registro-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

.campo input {
  border: 0.5px solid #ddd;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  background: #fafafa;
  width: 100%;
}

.input-wrap input {
  padding-left: 36px;
}

.campo input:focus {
  border-color: #2e7d52;
  background: #fff;
  outline: none;
}

.btn-primary {
  background: #1a3d2b;
  color: #fff;
  font-weight: 600;
  padding: 13px;
  border-radius: 10px;
  font-size: 15px;
  border: none;
  cursor: pointer;
  margin-top: 4px;
  width: 100%;
  text-align: center;
  display: block;
  text-decoration: none;
  box-sizing: border-box;
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
  margin: 20px 0 12px;
  font-size: 12px;
  color: #bbb;
}

.sep-linea {
  flex: 1;
  height: 0.5px;
  background: #e8e8e8;
}

.btn-login {
  display: block;
  text-align: center;
  border: 1px solid #2e7d52;
  color: #2e7d52;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-login:hover {
  background: #f0f9f4;
}

.footer-oficial {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
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
}

.error {
  color: #e53935;
  font-size: 13px;
  background: #fff5f5;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #e53935;
}

.exito {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #eaf3de;
  border-radius: 12px;
  padding: 32px 24px;
  gap: 10px;
  margin-bottom: 16px;
}

.exito-icon {
  font-size: 28px;
  color: #2e7d52;
  background: #fff;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.exito-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a3d2b;
}

.exito-sub {
  font-size: 13px;
  color: #2e7d52;
  margin-bottom: 8px;
}
</style>
