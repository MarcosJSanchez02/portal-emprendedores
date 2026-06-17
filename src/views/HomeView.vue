<template>
  <div class="home">

    <!-- ═══ NAVBAR ═══ -->
    <nav class="navbar">
      <div class="nav-container">
        <img src="../assets/logo-municipalidad.png" alt="Municipalidad" class="nav-logo" />

        <!-- Links — solo desktop -->
        <div class="nav-links">
          <a href="#" class="nav-link">Inicio</a>
          <a href="#" class="nav-link">Emprendimientos</a>
          <a href="#" class="nav-link">Publicaciones</a>
        </div>

        <!-- Botones — solo desktop -->
        <div class="nav-actions">
          <router-link to="/login" class="btn-outline">Iniciar sesión</router-link>
          <router-link to="/registro" class="btn-solid">Registrarse</router-link>
        </div>

        <!-- Hamburguesa — solo mobile -->
        <button class="hamburger" @click="menuAbierto = !menuAbierto" :aria-expanded="menuAbierto" aria-label="Menú">
          <span :class="{ rotar_top: menuAbierto }"></span>
          <span :class="{ ocultar: menuAbierto }"></span>
          <span :class="{ rotar_bot: menuAbierto }"></span>
        </button>
      </div>

      <!-- Drawer mobile -->
      <div class="mobile-drawer" :class="{ abierto: menuAbierto }">
        <a href="#" class="drawer-link" @click="menuAbierto = false">Inicio</a>
        <a href="#" class="drawer-link" @click="menuAbierto = false">Emprendimientos</a>
        <a href="#" class="drawer-link" @click="menuAbierto = false">Publicaciones</a>
        <div class="drawer-btns">
          <router-link to="/login" class="btn-outline w-full" @click="menuAbierto = false">Iniciar sesión</router-link>
          <router-link to="/registro" class="btn-solid w-full" @click="menuAbierto = false">Registrarse</router-link>
        </div>
      </div>
    </nav>
    <div v-if="menuAbierto" class="overlay" @click="menuAbierto = false"></div>

    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <span class="hero-badge">Municipalidad de Lucas González</span>
      <h1>Descubrí los emprendimientos<br class="br-desktop"> de tu ciudad</h1>
      <p>Apoyá a los emprendedores locales de Entre Ríos y encontrá productos y servicios cerca tuyo.</p>
      <div class="search-wrap">
        <i class="ti ti-search"></i>
        <input v-model="busqueda" type="text" placeholder="Buscar emprendimiento o rubro..." @input="filtrar" />
        <button @click="filtrar">Buscar</button>
      </div>
    </section>

    <!-- ═══ STATS ═══ -->
    <div class="stats">
      <div class="stat"><strong>{{ emprendimientos.length }}+</strong><span>Emprendimientos</span></div>
      <div class="sep"></div>
      <div class="stat"><strong>{{ rubros.length }}</strong><span>Rubros</span></div>
      <div class="sep"></div>
      <div class="stat"><strong>Lucas González</strong><span>Entre Ríos</span></div>
    </div>

    <!-- ═══ FILTROS ═══ -->
    <div class="filtros-wrap">
      <div class="filtros">
        <button class="chip" :class="{ activo: rubroActivo === '' }" @click="limpiarFiltro">Todos</button>
        <button
          v-for="r in rubros" :key="r"
          class="chip" :class="{ activo: rubroActivo === r }"
          @click="seleccionarRubro(r)"
        >{{ r }}</button>
      </div>
    </div>

    <!-- ═══ GRID ═══ -->
    <main class="contenido">
      <div v-if="cargando" class="estado-vacio">
        <div class="spinner"></div>
        <p>Cargando emprendimientos...</p>
      </div>
      <div v-else-if="filtrados.length === 0" class="estado-vacio">
        <i class="ti ti-mood-empty" style="font-size:36px;color:#ccc"></i>
        <p>No se encontraron emprendimientos.</p>
      </div>
      <div v-else class="grid">
        <div v-for="emp in filtrados" :key="emp.id" class="card">
          <div class="card-img">
            <img v-if="emp.logo" :src="`/api/assets/${emp.logo}`" :alt="emp.nombre" />
            <div v-else class="card-placeholder">🏪</div>
          </div>
          <div class="card-body">
            <span class="card-rubro">{{ emp.rubro }}</span>
            <h3>{{ emp.nombre }}</h3>
            <p>{{ emp.descripcion || 'Sin descripción disponible.' }}</p>
            <div class="card-footer">
              <span><i class="ti ti-user"></i> {{ emp.emprendedor_id?.nombre || 'Emprendedor' }}</span>
              <button>Ver más →</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- ═══ FOOTER ═══ -->
    <footer class="footer">
      <img src="../assets/logo-municipalidad.png" alt="Municipalidad" class="footer-logo" />
      <p>© 2026 Municipalidad de Lucas González · Entre Ríos</p>
      <p class="footer-sub">Plataforma oficial de emprendimientos locales</p>
    </footer>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const emprendimientos = ref([])
const filtrados = ref([])
const rubros = ref([])
const cargando = ref(true)
const busqueda = ref('')
const rubroActivo = ref('')
const menuAbierto = ref(false)

onMounted(async () => {
  const res = await fetch(
    '/api/items/emprendimientos?filter[estado][_eq]=aprobado&fields[]=id,nombre,rubro,descripcion,logo,emprendedor_id.nombre',
  )
  const data = await res.json()
  emprendimientos.value = data.data
  filtrados.value = data.data
  rubros.value = [...new Set(data.data.map((e) => e.rubro).filter(Boolean))]
  cargando.value = false
})

function filtrar() {
  filtrados.value = emprendimientos.value.filter((emp) => {
    const mb = busqueda.value === '' ||
      emp.nombre?.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      emp.rubro?.toLowerCase().includes(busqueda.value.toLowerCase())
    const mr = rubroActivo.value === '' || emp.rubro === rubroActivo.value
    return mb && mr
  })
}
function limpiarFiltro() { rubroActivo.value = ''; filtrar() }
function seleccionarRubro(r) { rubroActivo.value = r; filtrar() }
</script>

<style scoped>
/* ── Reset base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.home { min-height: 100vh; background: #f2f2f0; font-family: inherit; }

/* ══════════════════════
   NAVBAR
══════════════════════ */
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

.nav-logo { height: 38px; display: block; flex-shrink: 0; }

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
.nav-link:hover { color: #1a3d2b; }

.nav-actions { display: flex; gap: 10px; flex-shrink: 0; }

.btn-outline {
  font-size: 13px;
  font-weight: 600;
  color: #1a3d2b;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid #1a3d2b;
  transition: background 0.15s;
}
.btn-outline:hover { background: #f0f8f3; }

.btn-solid {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  background: #1a3d2b;
  transition: background 0.15s;
}
.btn-solid:hover { background: #2e7d52; }

/* Hamburguesa */
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
  transition: transform 0.25s ease, opacity 0.2s;
  transform-origin: center;
}

.rotar_top  { transform: translateY(7px) rotate(45deg) !important; }
.ocultar    { opacity: 0 !important; }
.rotar_bot  { transform: translateY(-7px) rotate(-45deg) !important; }

/* Drawer mobile */
.mobile-drawer {
  display: none;
  flex-direction: column;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease;
}

.mobile-drawer.abierto { max-height: 500px; }

.drawer-link {
  display: block;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #f5f5f5;
}
.drawer-link:hover { background: #f8fdf9; color: #1a3d2b; }

.drawer-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 24px 20px;
}

.w-full { display: block; text-align: center; width: 100%; }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  z-index: 299;
}

/* ══════════════════════
   HERO
══════════════════════ */
.hero {
  background: #1a3d2b;
  padding: 72px 24px 80px;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  background: #2e7d52;
  color: #a8d5b5;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 16px;
  border-radius: 20px;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.hero h1 {
  font-size: 38px;
  font-weight: 700;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 16px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero p {
  font-size: 16px;
  color: #8ab5a0;
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.br-desktop { display: block; }

.search-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 6px 6px 6px 16px;
  gap: 8px;
  max-width: 540px;
  margin: 0 auto;
}

.search-wrap i { font-size: 18px; color: #aaa; flex-shrink: 0; }

.search-wrap input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  color: #1a1a1a;
  min-width: 0;
}

.search-wrap button {
  background: #1a3d2b;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}
.search-wrap button:hover { background: #2e7d52; }

/* ══════════════════════
   STATS
══════════════════════ */
.stats {
  background: #152e20;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  padding: 20px 24px;
  flex-wrap: wrap;
}

.stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat strong { font-size: 20px; font-weight: 700; color: #fff; }
.stat span { font-size: 12px; color: #6a9e83; }

.sep { width: 1px; height: 32px; background: #2a4d38; }

/* ══════════════════════
   FILTROS
══════════════════════ */
.filtros-wrap {
  padding: 20px 24px 0;
  /* Scroll horizontal en mobile */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.filtros-wrap::-webkit-scrollbar { display: none; }

.filtros {
  display: flex;
  gap: 8px;
  width: max-content;
  min-width: 100%;
  flex-wrap: wrap;
}

.chip {
  padding: 7px 18px;
  border-radius: 20px;
  border: 1.5px solid #ddd;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: #555;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;
}
.chip.activo { background: #1a3d2b; color: #fff; border-color: #1a3d2b; }
.chip:hover:not(.activo) { border-color: #1a3d2b; color: #1a3d2b; }

/* ══════════════════════
   GRID
══════════════════════ */
.contenido { padding: 20px 24px 48px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

.card-img { height: 160px; background: #eaf3de; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.card-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; }

.card-body { padding: 16px; }

.card-rubro {
  display: inline-block;
  background: #eaf3de;
  color: #27500a;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.card-body h3 { font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }

.card-body p {
  font-size: 13px;
  color: #888;
  line-height: 1.5;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.card-footer span { font-size: 12px; color: #aaa; display: flex; align-items: center; gap: 4px; }
.card-footer button { font-size: 13px; color: #2e7d52; font-weight: 600; background: none; border: none; cursor: pointer; }

/* Loading / empty */
.estado-vacio { text-align: center; padding: 64px 24px; color: #888; }
.estado-vacio p { margin-top: 12px; font-size: 14px; }

.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e0e0e0;
  border-top-color: #2e7d52;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ══════════════════════
   FOOTER
══════════════════════ */
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

.footer p { font-size: 13px; color: #8ab5a0; }
.footer-sub { font-size: 12px; color: #4d7a63 !important; }

/* ══════════════════════════════════
   RESPONSIVE — Tablet ≤ 768px
══════════════════════════════════ */
@media (max-width: 768px) {
  /* Navbar: ocultar links/botones desktop, mostrar hamburguesa */
  .nav-links  { display: none; }
  .nav-actions { display: none; }
  .hamburger  { display: flex; }
  .mobile-drawer { display: flex; }

  .hero { padding: 48px 20px 56px; }
  .hero h1 { font-size: 28px; }
  .br-desktop { display: none; }

  .stats { gap: 24px; }
  .sep { display: none; }

  .filtros-wrap { padding: 16px 20px 0; }
  .filtros { flex-wrap: nowrap; } /* scroll horizontal */

  .contenido { padding: 16px 20px 40px; }
  .grid { grid-template-columns: 1fr 1fr; gap: 12px; }

  .card-img { height: 120px; }
  .card-body { padding: 12px; }
  .card-body h3 { font-size: 14px; }
}

/* ══════════════════════════════════
   RESPONSIVE — Mobile ≤ 480px
══════════════════════════════════ */
@media (max-width: 480px) {
  .hero h1 { font-size: 24px; }
  .hero p  { font-size: 14px; }

  /* Search: vertical */
  .search-wrap {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 10px;
  }
  .search-wrap i { display: none; }
  .search-wrap input {
    border: 1.5px solid #d4e6d6;
    border-radius: 8px;
    padding: 10px 12px;
  }
  .search-wrap button { width: 100%; padding: 12px; }

  /* Stats: 3 en fila igual, más compactos */
  .stats { padding: 14px 16px; gap: 12px; }
  .stat strong { font-size: 16px; }

  /* Grid: 1 columna */
  .grid { grid-template-columns: 1fr; }

  .card-img { height: 150px; }
}
</style>