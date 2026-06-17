<template>
  <div class="dashboard">
    <!-- Overlay mobile -->
    <div v-if="sidebarAbierto" class="sidebar-overlay" @click="sidebarAbierto = false"></div>

    <!-- ═══ SIDEBAR ═══ -->
    <aside class="sidebar" :class="{ abierto: sidebarAbierto }">
      <div class="sidebar-header">
        <router-link to="/"
          ><img src="../assets/logo-municipalidad.png" alt="Municipalidad" class="sidebar-logo"
        /></router-link>
        <button class="sidebar-close" @click="sidebarAbierto = false">
          <i class="ti ti-x"></i>
        </button>
      </div>

      <div class="sidebar-user">
        <div class="user-avatar">{{ iniciales }}</div>
        <div class="user-info">
          <p class="user-name">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
          <p class="user-role">Emprendedor registrado</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-section">Principal</p>
        <div class="nav-item" :class="{ active: seccion === 'panel' }" @click="ir('panel')">
          <i class="ti ti-layout-dashboard"></i> Mi panel
        </div>
        <div
          class="nav-item"
          :class="{ active: seccion === 'emprendimientos' }"
          @click="ir('emprendimientos')"
        >
          <i class="ti ti-building-store"></i> Mis emprendimientos
        </div>
        <div
          class="nav-item"
          :class="{ active: seccion === 'publicaciones' }"
          @click="ir('publicaciones')"
        >
          <i class="ti ti-speakerphone"></i> Publicaciones
        </div>
        <p class="nav-section">Cuenta</p>
        <div class="nav-item" :class="{ active: seccion === 'perfil' }" @click="ir('perfil')">
          <i class="ti ti-user-circle"></i> Mi perfil
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="logout" @click="handleLogout"><i class="ti ti-logout"></i> Cerrar sesión</div>
      </div>
    </aside>

    <!-- ═══ MAIN ═══ -->
    <div class="main">
      <!-- Topbar -->
      <div class="topbar">
        <div class="topbar-left">
          <button class="hamburger-btn" @click="sidebarAbierto = true">
            <i class="ti ti-menu-2"></i>
          </button>
          <p class="topbar-title">Panel de emprendedor</p>
        </div>
        <div class="topbar-right">
          <div class="topbar-notif">
            <i class="ti ti-bell"></i>
          </div>
          <button class="btn-new" @click="abrirFormulario">
            <i class="ti ti-plus"></i>
            <span class="btn-new-text">Nuevo emprendimiento</span>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="main-body">
        <!-- ── PANEL ── -->
        <template v-if="seccion !== 'perfil'">
          <div class="welcome">
            <h2>Bienvenido, {{ authStore.user?.first_name }} 👋</h2>
            <p>Gestioná tus emprendimientos y publicaciones desde acá</p>
          </div>

          <div class="metrics">
            <div class="metric">
              <div class="metric-top">
                <p class="metric-label">Emprendimientos</p>
                <div class="metric-icon green"><i class="ti ti-building-store"></i></div>
              </div>
              <p class="metric-value">{{ emprendimientos.length }}</p>
              <p class="metric-sub">Total registrados</p>
            </div>
            <div class="metric">
              <div class="metric-top">
                <p class="metric-label">Pendientes</p>
                <div class="metric-icon amber"><i class="ti ti-clock"></i></div>
              </div>
              <p class="metric-value">{{ pendientes }}</p>
              <p class="metric-sub">Esperando aprobación</p>
            </div>
            <div class="metric">
              <div class="metric-top">
                <p class="metric-label">Aprobados</p>
                <div class="metric-icon blue"><i class="ti ti-circle-check"></i></div>
              </div>
              <p class="metric-value">{{ aprobados }}</p>
              <p class="metric-sub">Activos</p>
            </div>
          </div>

          <div v-if="mostrarFormulario" class="form-card">
            <div class="form-card-header">
              <h3><i class="ti ti-plus"></i> Nuevo emprendimiento</h3>
              <button class="form-close" @click="mostrarFormulario = false">
                <i class="ti ti-x"></i>
              </button>
            </div>
            <div class="form-grid">
              <div class="campo">
                <label>Nombre *</label>
                <input v-model="form.nombre" placeholder="Nombre del emprendimiento" />
              </div>
              <div class="campo">
                <label>Rubro *</label>
                <input v-model="form.rubro" placeholder="Ej: Gastronomía, Servicios..." />
              </div>
            </div>
            <div class="campo">
              <label>Descripción</label>
              <textarea
                v-model="form.descripcion"
                placeholder="Contá de qué se trata tu emprendimiento..."
                rows="3"
              ></textarea>
            </div>
            <p v-if="errorForm" class="error-form">⚠ {{ errorForm }}</p>
            <div class="form-actions">
              <button class="btn-cancelar" @click="mostrarFormulario = false">Cancelar</button>
              <button class="btn-guardar" @click="crearEmprendimiento" :disabled="guardando">
                {{ guardando ? 'Guardando...' : 'Guardar emprendimiento' }}
              </button>
            </div>
          </div>

          <div class="section-header">
            <p class="section-title">Mis emprendimientos</p>
            <button v-if="emprendimientos.length > 0" class="btn-new-sm" @click="abrirFormulario">
              <i class="ti ti-plus"></i> Nuevo
            </button>
          </div>

          <div v-if="cargando" class="estado-box">
            <div class="spinner"></div>
            <p>Cargando...</p>
          </div>

          <div v-else-if="emprendimientos.length === 0" class="estado-box">
            <i class="ti ti-building-store" style="font-size: 36px; color: #ccc"></i>
            <p>Todavía no tenés emprendimientos registrados.</p>
            <button class="btn-new" @click="abrirFormulario" style="margin-top: 12px">
              <i class="ti ti-plus"></i> Crear el primero
            </button>
          </div>

          <div v-else class="emp-list">
            <div v-for="emp in emprendimientos" :key="emp.id" class="emp-card">
              <div class="emp-card-main">
                <div class="emp-left">
                  <div class="emp-icon">🏪</div>
                  <div>
                    <p class="emp-name">{{ emp.nombre }}</p>
                    <p class="emp-rubro">{{ emp.rubro }}</p>
                  </div>
                </div>
                <span class="badge" :class="`badge-${emp.estado}`">
                  {{
                    emp.estado === 'aprobado'
                      ? '✓ Aprobado'
                      : emp.estado === 'pendiente'
                        ? '⏳ Pendiente'
                        : '✗ Rechazado'
                  }}
                </span>
              </div>
              <div v-if="emp.nota_municipalidad" class="nota">
                <i class="ti ti-alert-triangle"></i>
                <span>Nota: {{ emp.nota_municipalidad }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- ── MI PERFIL ── -->
        <template v-else>
          <div class="welcome">
            <h2>Mi perfil</h2>
            <p>Editá tus datos personales y de contacto</p>
          </div>

          <div v-if="cargandoPerfil" class="estado-box">
            <div class="spinner"></div>
            <p>Cargando perfil...</p>
          </div>

          <div v-else class="perfil-card">
            <!-- Avatar -->
            <div class="perfil-avatar-section">
              <div class="perfil-avatar">{{ iniciales }}</div>
              <div>
                <p class="perfil-nombre-display">
                  {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
                </p>
                <p class="perfil-email-display">{{ authStore.user?.email }}</p>
              </div>
            </div>

            <div class="perfil-divider"></div>

            <!-- Formulario -->
            <div class="perfil-form">
              <p class="perfil-section-title"><i class="ti ti-user"></i> Datos personales</p>
              <div class="form-grid">
                <div class="campo">
                  <label>Nombre</label>
                  <input v-model="perfil.nombre" placeholder="Tu nombre completo" />
                </div>
                <div class="campo">
                  <label>Teléfono</label>
                  <input v-model="perfil.telefono" placeholder="Ej: 3435 123456" />
                </div>
              </div>
              <div class="campo">
                <label>Localidad</label>
                <input v-model="perfil.localidad" placeholder="Ej: Lucas González, Entre Ríos" />
              </div>
              <div class="campo">
                <label>Descripción</label>
                <textarea
                  v-model="perfil.descripcion"
                  placeholder="Contá un poco sobre vos..."
                  rows="3"
                ></textarea>
              </div>

              <p class="perfil-section-title" style="margin-top: 20px">
                <i class="ti ti-brand-instagram"></i> Redes sociales
              </p>
              <div class="form-grid">
                <div class="campo">
                  <label>Facebook</label>
                  <input v-model="perfil.facebook" placeholder="Usuario de Facebook" />
                </div>
                <div class="campo">
                  <label>Instagram</label>
                  <input v-model="perfil.instagram" placeholder="@usuario" />
                </div>
                <div class="campo">
                  <label>WhatsApp</label>
                  <input v-model="perfil.whatsapp" placeholder="Número con código de área" />
                </div>
                <div class="campo">
                  <label>Sitio web</label>
                  <input v-model="perfil.sitio_web" placeholder="https://..." />
                </div>
              </div>

              <p v-if="errorPerfil" class="error-form">⚠ {{ errorPerfil }}</p>
              <p v-if="exitoPerfil" class="exito-form">✓ Perfil actualizado correctamente</p>

              <div class="form-actions" style="margin-top: 20px">
                <button class="btn-guardar" @click="guardarPerfil" :disabled="guardandoPerfil">
                  {{ guardandoPerfil ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const emprendimientos = ref([])
const cargando = ref(true)
const mostrarFormulario = ref(false)
const guardando = ref(false)
const errorForm = ref('')
const seccion = ref('panel')
const sidebarAbierto = ref(false)
const form = ref({ nombre: '', rubro: '', descripcion: '' })

// Perfil
const cargandoPerfil = ref(false)
const guardandoPerfil = ref(false)
const errorPerfil = ref('')
const exitoPerfil = ref(false)
const perfilId = ref(null)
const perfil = ref({
  nombre: '',
  telefono: '',
  localidad: '',
  descripcion: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
  sitio_web: '',
})

const iniciales = computed(() => {
  const u = authStore.user
  if (!u) return 'U'
  return `${u.first_name?.[0] ?? ''}${u.last_name?.[0] ?? ''}`.toUpperCase()
})

const pendientes = computed(
  () => emprendimientos.value.filter((e) => e.estado === 'pendiente').length,
)
const aprobados = computed(
  () => emprendimientos.value.filter((e) => e.estado === 'aprobado').length,
)

onMounted(async () => {
  if (!authStore.user) {
    router.push('/login')
    return
  }
  await cargarEmprendimientos()
  await cargarPerfil()
})

function ir(s) {
  seccion.value = s
  sidebarAbierto.value = false
  if (s === 'perfil') exitoPerfil.value = false
}

function abrirFormulario() {
  errorForm.value = ''
  mostrarFormulario.value = true
}

async function cargarEmprendimientos() {
  cargando.value = true
  const res = await fetch(
    '/api/items/emprendimientos?filter[user_created][_eq]=$CURRENT_USER&fields[]=id,nombre,rubro,estado,nota_municipalidad',
    { headers: { Authorization: `Bearer ${authStore.token}` } },
  )
  const data = await res.json()
  emprendimientos.value = data.data ?? []
  cargando.value = false
}

async function crearEmprendimiento() {
  errorForm.value = ''
  if (!form.value.nombre.trim()) {
    errorForm.value = 'El nombre es obligatorio'
    return
  }
  if (!form.value.rubro.trim()) {
    errorForm.value = 'El rubro es obligatorio'
    return
  }

  guardando.value = true
  const res = await fetch('/api/items/emprendimientos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
    body: JSON.stringify(form.value),
  })
  guardando.value = false

  if (res.ok) {
    form.value = { nombre: '', rubro: '', descripcion: '' }
    mostrarFormulario.value = false
    await cargarEmprendimientos()
  } else {
    errorForm.value = 'Error al guardar. Intentá de nuevo.'
  }
}

async function cargarPerfil() {
  cargandoPerfil.value = true
  try {
    const res = await fetch(`/api/items/emprendedores?filter[user_id][_eq]=$CURRENT_USER&limit=1`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    const data = await res.json()
    if (data.data?.length > 0) {
      const p = data.data[0]
      perfilId.value = p.id
      perfil.value = {
        nombre: p.nombre || '',
        telefono: p.telefono || '',
        localidad: p.localidad || '',
        descripcion: p.descripcion || '',
        facebook: p.facebook || '',
        instagram: p.instagram || '',
        whatsapp: p.whatsapp || '',
        sitio_web: p.sitio_web || '',
      }
    }
  } catch (e) {
    console.error('Error cargando perfil:', e)
  } finally {
    cargandoPerfil.value = false
  }
}

async function guardarPerfil() {
  errorPerfil.value = ''
  exitoPerfil.value = false
  guardandoPerfil.value = true

  try {
    let res
    if (perfilId.value) {
      // Actualizar existente
      res = await fetch(`/api/items/emprendedores/${perfilId.value}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
        body: JSON.stringify(perfil.value),
      })
    } else {
      // Crear nuevo
      res = await fetch('/api/items/emprendedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
        body: JSON.stringify({ ...perfil.value, user_id: authStore.user.id }),
      })
      const data = await res.json()
      if (data.data?.id) perfilId.value = data.data.id
    }
    if (res.ok) {
      exitoPerfil.value = true
      setTimeout(() => (exitoPerfil.value = false), 3000)
    } else {
      errorPerfil.value = 'Error al guardar. Intentá de nuevo.'
    }
  } catch (e) {
    errorPerfil.value = 'Error de conexión.'
  } finally {
    guardandoPerfil.value = false
  }
}

async function handleLogout() {
  authStore.cerrarSesion()
  router.push('/')
}
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.dashboard {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #f2f2f0;
}

/* ═══ SIDEBAR ═══ */
.sidebar {
  background: #1a3d2b;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 200;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 199;
}

.sidebar-header {
  background: #fff;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.sidebar-logo {
  height: 36px;
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #555;
  padding: 4px;
}

.sidebar-user {
  padding: 18px 20px;
  border-bottom: 1px solid #2a4d38;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.user-avatar {
  width: 42px;
  height: 42px;
  background: #2e7d52;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.user-info {
  min-width: 0;
}
.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 11px;
  color: #6a9e83;
  margin-top: 2px;
}

.sidebar-nav {
  padding: 12px 0;
  flex: 1;
}

.nav-section {
  font-size: 10px;
  color: #4d7a63;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px 20px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 20px;
  font-size: 13px;
  color: #8ab5a0;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.15s;
}
.nav-item.active {
  background: #2a4d38;
  color: #fff;
  border-left-color: #4caf50;
}
.nav-item:hover:not(.active) {
  background: #1f4a33;
  color: #c8e6c9;
}
.nav-item i {
  font-size: 18px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #2a4d38;
  flex-shrink: 0;
}

.logout {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6a9e83;
  cursor: pointer;
}
.logout:hover {
  color: #fff;
}

/* ═══ MAIN ═══ */
.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  color: #1a3d2b;
  padding: 4px;
}

.topbar-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-notif {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  font-size: 18px;
  color: #888;
}

.btn-new {
  background: #1a3d2b;
  color: #fff;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}
.btn-new:hover {
  background: #2e7d52;
}

.main-body {
  padding: 28px 32px;
  flex: 1;
}

/* Bienvenida */
.welcome {
  margin-bottom: 24px;
}
.welcome h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}
.welcome p {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

/* ═══ MÉTRICAS ═══ */
.metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.metric {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 20px;
  transition: box-shadow 0.2s;
}
.metric:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.metric-label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.metric-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.metric-icon i {
  font-size: 18px;
}
.metric-icon.green {
  background: #eaf3de;
}
.metric-icon.green i {
  color: #2e7d52;
}
.metric-icon.amber {
  background: #fff8e1;
}
.metric-icon.amber i {
  color: #f57f17;
}
.metric-icon.blue {
  background: #e3f2fd;
}
.metric-icon.blue i {
  color: #1565c0;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
  line-height: 1;
}
.metric-sub {
  font-size: 12px;
  color: #aaa;
}

/* ═══ FORMULARIO ═══ */
.form-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.form-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-card-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #aaa;
  padding: 4px;
  border-radius: 6px;
}
.form-close:hover {
  background: #f5f5f5;
  color: #555;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
}
.campo label {
  font-size: 13px;
  font-weight: 600;
  color: #444;
}
.campo input,
.campo textarea {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  background: #fafafa;
  font-family: inherit;
  transition: border-color 0.15s;
}
.campo input:focus,
.campo textarea:focus {
  border-color: #2e7d52;
  background: #fff;
  outline: none;
}
.campo textarea {
  resize: vertical;
  min-height: 80px;
}

.error-form {
  color: #e53935;
  font-size: 13px;
  background: #fff5f5;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #e53935;
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.btn-cancelar {
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}
.btn-cancelar:hover {
  background: #f5f5f5;
}

.btn-guardar {
  background: #1a3d2b;
  color: #fff;
  border: none;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-guardar:hover {
  background: #2e7d52;
}
.btn-guardar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ═══ LISTA ═══ */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

.btn-new-sm {
  background: none;
  border: 1px solid #1a3d2b;
  color: #1a3d2b;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}
.btn-new-sm:hover {
  background: #1a3d2b;
  color: #fff;
}

.estado-box {
  text-align: center;
  padding: 48px 24px;
  color: #888;
  font-size: 14px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #e0e0e0;
  border-top-color: #2e7d52;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.emp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.emp-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  padding: 14px 18px;
  transition: box-shadow 0.15s;
}
.emp-card:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.emp-card-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.emp-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.emp-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #eaf3de;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.emp-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.emp-rubro {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}
.badge-pendiente {
  background: #fff8e1;
  color: #f57f17;
}
.badge-aprobado {
  background: #eaf3de;
  color: #27500a;
}
.badge-rechazado {
  background: #ffebee;
  color: #c62828;
}

.nota {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: #fff8e1;
  border-left: 3px solid #f57f17;
  border-radius: 0 8px 8px 0;
  padding: 8px 12px;
  font-size: 12px;
  color: #7a5c00;
  margin-top: 10px;
}

/* ══════════════════════════════════
   RESPONSIVE — Tablet ≤ 900px
══════════════════════════════════ */
@media (max-width: 900px) {
  .metrics {
    grid-template-columns: repeat(3, 1fr);
  }
  .main-body {
    padding: 20px;
  }
  .topbar {
    padding: 0 20px;
  }
}

/* ══════════════════════════════════
   RESPONSIVE — Mobile ≤ 768px
══════════════════════════════════ */
@media (max-width: 768px) {
  /* Dashboard pasa a 1 columna */
  .dashboard {
    grid-template-columns: 1fr;
  }

  /* Sidebar como drawer lateral */
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 280px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar.abierto {
    transform: translateX(0);
  }
  .sidebar-overlay {
    display: block;
  }
  .sidebar-close {
    display: flex;
  }

  /* Hamburguesa visible */
  .hamburger-btn {
    display: flex;
  }

  /* Topbar */
  .topbar {
    padding: 0 16px;
  }
  .topbar-title {
    font-size: 14px;
  }

  /* Ocultar texto del botón nuevo en mobile */
  .btn-new-text {
    display: none;
  }
  .btn-new {
    padding: 9px 12px;
  }

  /* Main body */
  .main-body {
    padding: 16px;
  }

  /* Métricas: 1 fila de 3 más compacta */
  .metrics {
    gap: 8px;
  }
  .metric {
    padding: 14px;
  }
  .metric-value {
    font-size: 24px;
  }
  .metric-sub {
    display: none;
  }

  /* Formulario */
  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .form-actions {
    flex-direction: column;
  }
  .btn-cancelar,
  .btn-guardar {
    width: 100%;
    padding: 12px;
    text-align: center;
  }

  /* Cards */
  .emp-name {
    font-size: 13px;
  }
}

/* ══════════════════════════════════
   RESPONSIVE — Mobile ≤ 480px
══════════════════════════════════ */
@media (max-width: 480px) {
  .metrics {
    grid-template-columns: 1fr;
  }
  .metric {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    gap: 16px;
  }
  .metric-top {
    margin-bottom: 0;
    flex-shrink: 0;
  }
  .metric-label {
    display: none;
  }
  .metric-value {
    font-size: 28px;
  }
  .metric-sub {
    display: block;
    font-size: 11px;
  }
}

/* ═══ PERFIL ═══ */
.perfil-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.perfil-avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: #1a3d2b;
}

.perfil-avatar {
  width: 64px;
  height: 64px;
  background: #2e7d52;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 24px;
  flex-shrink: 0;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.perfil-nombre-display {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.perfil-email-display {
  font-size: 13px;
  color: #8ab5a0;
  margin-top: 3px;
}

.perfil-divider {
  height: 1px;
  background: #f0f0f0;
}

.perfil-form {
  padding: 24px;
}

.perfil-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #1a3d2b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.exito-form {
  color: #2e7d52;
  font-size: 13px;
  background: #eaf3de;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid #2e7d52;
  margin-bottom: 12px;
}

@media (max-width: 480px) {
  .perfil-avatar-section {
    padding: 16px;
  }
  .perfil-form {
    padding: 16px;
  }
  .perfil-avatar {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }
}
</style>
