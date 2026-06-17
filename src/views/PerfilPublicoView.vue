<template>
  <div class="perfil-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/"
          ><img src="../assets/logo-municipalidad.png" alt="Municipalidad" class="nav-logo"
        /></router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">Inicio</router-link>
          <a href="#" class="nav-link">Emprendimientos</a>
          <a href="#" class="nav-link">Publicaciones</a>
        </div>
        <div class="nav-actions">
          <router-link to="/login" class="btn-outline">Iniciar sesión</router-link>
          <router-link to="/registro" class="btn-solid">Registrarse</router-link>
        </div>
        <button class="hamburger" @click="menuAbierto = !menuAbierto" aria-label="Menú">
          <span :class="{ rotar_top: menuAbierto }"></span>
          <span :class="{ ocultar: menuAbierto }"></span>
          <span :class="{ rotar_bot: menuAbierto }"></span>
        </button>
      </div>
      <div class="mobile-drawer" :class="{ abierto: menuAbierto }">
        <router-link to="/" class="drawer-link" @click="menuAbierto = false">Inicio</router-link>
        <a href="#" class="drawer-link" @click="menuAbierto = false">Emprendimientos</a>
        <a href="#" class="drawer-link" @click="menuAbierto = false">Publicaciones</a>
        <div class="drawer-btns">
          <router-link to="/login" class="btn-outline w-full" @click="menuAbierto = false"
            >Iniciar sesión</router-link
          >
          <router-link to="/registro" class="btn-solid w-full" @click="menuAbierto = false"
            >Registrarse</router-link
          >
        </div>
      </div>
    </nav>
    <div v-if="menuAbierto" class="overlay" @click="menuAbierto = false"></div>

    <!-- Loading -->
    <div v-if="cargando" class="estado-vacio">
      <div class="spinner"></div>
      <p>Cargando perfil...</p>
    </div>

    <!-- No encontrado -->
    <div v-else-if="!emprendedor" class="estado-vacio">
      <i class="ti ti-user-off" style="font-size: 48px; color: #ccc"></i>
      <p>No se encontró el emprendedor.</p>
      <router-link to="/" class="btn-solid" style="margin-top: 16px; display: inline-block"
        >Volver al inicio</router-link
      >
    </div>

    <template v-else>
      <!-- Hero perfil -->
      <div class="perfil-hero">
        <div class="perfil-hero-inner">
          <div class="perfil-avatar">{{ iniciales }}</div>
          <div class="perfil-info">
            <h1>{{ emprendedor.nombre }}</h1>
            <p v-if="emprendedor.localidad" class="perfil-localidad">
              <i class="ti ti-map-pin"></i> {{ emprendedor.localidad }}
            </p>
            <p v-if="emprendedor.descripcion" class="perfil-desc">{{ emprendedor.descripcion }}</p>
            <div class="perfil-redes">
              <a
                v-if="emprendedor.whatsapp"
                :href="`https://wa.me/${emprendedor.whatsapp}`"
                target="_blank"
                class="red-btn whatsapp"
              >
                <i class="ti ti-brand-whatsapp"></i> WhatsApp
              </a>
              <a
                v-if="emprendedor.instagram"
                :href="`https://instagram.com/${emprendedor.instagram.replace('@', '')}`"
                target="_blank"
                class="red-btn instagram"
              >
                <i class="ti ti-brand-instagram"></i> Instagram
              </a>
              <a
                v-if="emprendedor.facebook"
                :href="`https://facebook.com/${emprendedor.facebook}`"
                target="_blank"
                class="red-btn facebook"
              >
                <i class="ti ti-brand-facebook"></i> Facebook
              </a>
              <a
                v-if="emprendedor.sitio_web"
                :href="emprendedor.sitio_web"
                target="_blank"
                class="red-btn web"
              >
                <i class="ti ti-world"></i> Sitio web
              </a>
              <a
                v-if="emprendedor.telefono"
                :href="`tel:${emprendedor.telefono}`"
                class="red-btn telefono"
              >
                <i class="ti ti-phone"></i> {{ emprendedor.telefono }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="perfil-body">
        <!-- Emprendimientos -->
        <section class="seccion">
          <h2 class="seccion-title"><i class="ti ti-building-store"></i> Emprendimientos</h2>
          <div v-if="emprendimientos.length === 0" class="estado-mini">
            <p>Este emprendedor aún no tiene emprendimientos aprobados.</p>
          </div>
          <div v-else class="grid">
            <div v-for="emp in emprendimientos" :key="emp.id" class="card">
              <div class="card-img">
                <img v-if="emp.logo" :src="`/api/assets/${emp.logo}`" :alt="emp.nombre" />
                <div v-else class="card-placeholder">🏪</div>
              </div>
              <div class="card-body">
                <span class="card-rubro">{{ emp.rubro }}</span>
                <h3>{{ emp.nombre }}</h3>
                <p>{{ emp.descripcion || 'Sin descripción disponible.' }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Publicaciones -->
        <section class="seccion">
          <h2 class="seccion-title"><i class="ti ti-speakerphone"></i> Publicaciones</h2>
          <div v-if="publicaciones.length === 0" class="estado-mini">
            <p>Este emprendedor aún no tiene publicaciones.</p>
          </div>
          <div v-else class="pub-list">
            <div v-for="pub in publicaciones" :key="pub.id" class="pub-card">
              <div v-if="pub.imagen" class="pub-img">
                <img :src="`/api/assets/${pub.imagen}`" :alt="pub.titulo" />
              </div>
              <div class="pub-body">
                <p class="pub-fecha">{{ formatFecha(pub.date_created) }}</p>
                <h3>{{ pub.titulo }}</h3>
                <p>{{ pub.contenido }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>

    <!-- Footer -->
    <footer class="footer">
      <img src="../assets/logo-municipalidad.png" alt="Municipalidad" class="footer-logo" />
      <p>© 2026 Municipalidad de Lucas González · Entre Ríos</p>
      <p class="footer-sub">Plataforma oficial de emprendimientos locales</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuAbierto = ref(false)
const cargando = ref(true)
const emprendedor = ref(null)
const emprendimientos = ref([])
const publicaciones = ref([])

const iniciales = computed(() => {
  if (!emprendedor.value?.nombre) return 'E'
  return emprendedor.value.nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

onMounted(async () => {
  const id = route.params.id
  try {
    // Cargar emprendedor
    const resEmp = await fetch(`/api/items/emprendedores/${id}`)
    const dataEmp = await resEmp.json()
    emprendedor.value = dataEmp.data

    // Cargar emprendimientos aprobados
    const resEmps = await fetch(
      `/api/items/emprendimientos?filter[emprendedor_id][_eq]=${id}&filter[estado][_eq]=aprobado&fields[]=id,nombre,rubro,descripcion,logo`,
    )
    const dataEmps = await resEmps.json()
    emprendimientos.value = dataEmps.data ?? []

    // Cargar publicaciones
    const resPubs = await fetch(
      `/api/items/publicaciones?filter[emprendedor_id][_eq]=${id}&sort=-date_created&fields[]=id,titulo,contenido,imagen,date_created`,
    )
    const dataPubs = await resPubs.json()
    publicaciones.value = dataPubs.data ?? []
  } catch (e) {
    console.error('Error cargando perfil:', e)
  } finally {
    cargando.value = false
  }
})

function formatFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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

.perfil-page {
  min-height: 100vh;
  background: #f2f2f0;
}

/* ── NAVBAR (igual que HomeView) ── */
.navbar {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 300;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-logo {
  height: 38px;
  display: block;
  flex-shrink: 0;
}
.nav-links {
  display: flex;
  gap: 24px;
  flex: 1;
}
.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  text-decoration: none;
}
.nav-link:hover {
  color: #1a3d2b;
}
.nav-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}
.btn-outline {
  font-size: 13px;
  font-weight: 600;
  color: #1a3d2b;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid #1a3d2b;
}
.btn-solid {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  background: #1a3d2b;
}
.btn-solid:hover {
  background: #2e7d52;
}
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: auto;
}
.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #1a3d2b;
  border-radius: 2px;
  transition:
    transform 0.25s ease,
    opacity 0.2s;
  transform-origin: center;
}
.rotar_top {
  transform: translateY(7px) rotate(45deg) !important;
}
.ocultar {
  opacity: 0 !important;
}
.rotar_bot {
  transform: translateY(-7px) rotate(-45deg) !important;
}
.mobile-drawer {
  display: none;
  flex-direction: column;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}
.mobile-drawer.abierto {
  max-height: 500px;
}
.drawer-link {
  display: block;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #f5f5f5;
}
.drawer-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 24px 20px;
}
.w-full {
  display: block;
  text-align: center;
  width: 100%;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 299;
}

/* ── HERO ── */
.perfil-hero {
  background: #1a3d2b;
  padding: 48px 24px;
}

.perfil-hero-inner {
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 28px;
}

.perfil-avatar {
  width: 88px;
  height: 88px;
  background: #2e7d52;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  flex-shrink: 0;
  border: 3px solid rgba(255, 255, 255, 0.2);
}

.perfil-info {
  flex: 1;
  min-width: 0;
}

.perfil-info h1 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.perfil-localidad {
  font-size: 14px;
  color: #8ab5a0;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 10px;
}

.perfil-desc {
  font-size: 14px;
  color: #a8c8b8;
  line-height: 1.6;
  margin-bottom: 16px;
  max-width: 560px;
}

.perfil-redes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.red-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s;
}
.red-btn:hover {
  opacity: 0.85;
}
.red-btn.whatsapp {
  background: #25d366;
  color: #fff;
}
.red-btn.instagram {
  background: #e1306c;
  color: #fff;
}
.red-btn.facebook {
  background: #1877f2;
  color: #fff;
}
.red-btn.web {
  background: #fff;
  color: #1a3d2b;
}
.red-btn.telefono {
  background: #2e7d52;
  color: #fff;
}

/* ── BODY ── */
.perfil-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

.seccion {
  margin-bottom: 40px;
}

.seccion-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a3d2b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e8e8e8;
}

.estado-mini {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: #aaa;
}

/* Grid emprendimientos */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
.card-img {
  height: 140px;
  background: #eaf3de;
  overflow: hidden;
}
.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}
.card-body {
  padding: 14px;
}
.card-rubro {
  display: inline-block;
  background: #eaf3de;
  color: #27500a;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 8px;
}
.card-body h3 {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.card-body p {
  font-size: 12px;
  color: #888;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Publicaciones */
.pub-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pub-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  display: flex;
  gap: 0;
  transition: box-shadow 0.2s;
}
.pub-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.pub-img {
  width: 180px;
  flex-shrink: 0;
}
.pub-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pub-body {
  padding: 18px 20px;
  flex: 1;
  min-width: 0;
}

.pub-fecha {
  font-size: 11px;
  color: #aaa;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pub-body h3 {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.pub-body p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* Loading / empty */
.estado-vacio {
  text-align: center;
  padding: 80px 24px;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.estado-vacio p {
  font-size: 14px;
}

.spinner {
  width: 32px;
  height: 32px;
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

/* ── FOOTER ── */
.footer {
  background: #1a3d2b;
  padding: 32px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.footer-logo {
  height: 40px;
  background: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  margin-bottom: 8px;
}
.footer p {
  font-size: 13px;
  color: #8ab5a0;
}
.footer-sub {
  font-size: 12px;
  color: #4d7a63 !important;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .nav-actions {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .mobile-drawer {
    display: flex;
  }

  .perfil-hero {
    padding: 32px 16px;
  }
  .perfil-hero-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
  .perfil-info h1 {
    font-size: 22px;
  }
  .perfil-desc {
    margin: 0 auto 16px;
  }
  .perfil-redes {
    justify-content: center;
  }

  .perfil-body {
    padding: 20px 16px 40px;
  }
  .grid {
    grid-template-columns: 1fr 1fr;
  }

  .pub-card {
    flex-direction: column;
  }
  .pub-img {
    width: 100%;
    height: 160px;
  }
}

@media (max-width: 480px) {
  .perfil-avatar {
    width: 64px;
    height: 64px;
    font-size: 22px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .pub-img {
    height: 130px;
  }
}
</style>
