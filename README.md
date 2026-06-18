# Kbody Sport · Plataforma para Centro Kinesiológico

Plataforma web moderna para un centro kinesiológico: sitio público de presentación, **agendamiento de horas**, **panel de administración**, **gestión de pacientes**, **seguimiento de tratamientos** y **portal del paciente**, con autenticación por roles.

Construida con **Next.js 14 (App Router) + TypeScript + Tailwind CSS + componentes estilo shadcn/ui**, lista para desplegar en **Vercel** y preparada para conectar **Supabase** sin reescribir la interfaz.

> Esta entrega corre **out-of-the-box con datos mock** (sin configurar nada). La capa de datos está abstraída para migrar a Supabase cambiando una sola capa.

---

## ✨ Funcionalidades

- **Landing page** completa: hero, servicios, cómo funciona, beneficios, profesionales, testimonios, FAQ, contacto, ubicación (mapa) y footer.
- **Agendamiento** multi-paso: servicio → profesional → fecha/hora disponible → datos del paciente (con validación de RUT chileno) → confirmación. Estados de cita: `pendiente`, `confirmada`, `cancelada`, `realizada`.
- **Dashboard privado** (admin / kinesiólogo): resumen del día, próximas citas, métricas (agendadas, realizadas, canceladas, pacientes, planes activos), gestión de citas, pacientes, profesionales y servicios.
- **Gestión de pacientes**: ficha, contacto, historial de citas, diagnóstico, plan de tratamiento, ejercicios y estado del tratamiento.
- **Seguimiento de tratamiento**: bitácora de evolución por sesión con dolor reportado (1–10), ejercicios, observaciones, avance y próxima recomendación.
- **Portal del paciente**: próximas citas, estado y progreso del tratamiento, ejercicios recomendados, recomendaciones del kinesiólogo y solicitud de nueva hora.
- **Autenticación por roles**: `admin`, `kinesiologo`, `paciente`, con protección de rutas vía middleware.

---

## 🧱 Stack y arquitectura

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router, RSC) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + design tokens (CSS variables) |
| Componentes | Estilo shadcn/ui sobre Radix UI |
| Iconos | lucide-react |
| Validación | Zod |
| Backend (opcional) | Supabase (Postgres + Auth) |
| Deploy | Vercel |

### Principio clave: capa de datos desacoplada

Toda la UI consume **únicamente** las funciones de `src/lib/data/store.ts`. Hoy operan sobre datos mock en memoria; mañana, cambiando el cuerpo de esas funciones (ver `src/lib/data/supabase-repo.ts`) se conecta a Supabase **sin tocar ninguna pantalla**.

```
src/
├── app/
│   ├── page.tsx                 # Landing
│   ├── servicios/               # Detalle de servicios
│   ├── agendar/                 # Flujo de agendamiento
│   ├── login/                   # Acceso por rol
│   ├── dashboard/               # Panel privado (admin/kine)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Resumen + métricas
│   │   ├── citas/
│   │   ├── pacientes/
│   │   │   └── [id]/            # Ficha + tratamiento + evolución
│   │   ├── profesionales/
│   │   └── servicios/
│   └── portal/                  # Portal del paciente
├── components/
│   ├── ui/                      # Botones, cards, inputs, select, tabs, dialog…
│   ├── layout/                  # Header, footer, shells, iconos
│   ├── landing/                 # Secciones de la landing
│   ├── booking/                 # Wizard de agendamiento
│   └── dashboard/               # StatCard, PageTitle, formulario de sesión
├── lib/
│   ├── types.ts                 # Modelo de datos
│   ├── utils.ts                 # Helpers (RUT, fechas, estados)
│   ├── auth/                    # AuthProvider + roles
│   ├── data/                    # mock-data, store (capa de datos), supabase-repo
│   └── supabase/                # Cliente Supabase
└── middleware.ts                # Protección de rutas por rol
supabase/
├── schema.sql                   # Esquema completo + RLS
└── seed.sql                     # Datos de ejemplo
```

Ver **[DATABASE.md](./DATABASE.md)** para el modelo de datos y relaciones.

---

## 🚀 Correr localmente

Requisitos: **Node.js 18.17+** y npm.

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) variables de entorno — la app corre sin esto en modo mock
cp .env.example .env.local

# 3. Levantar el entorno de desarrollo
npm run dev
```

Abre **http://localhost:3000**.

### Cuentas demo (modo mock)

En `/login` puedes entrar con un clic usando las cuentas demo:

| Rol | Correo | Destino |
|-----|--------|---------|
| Administrador | `admin@kinesiologiakbody.cl` | `/dashboard` |
| Kinesiólogo | `kine@kinesiologiakbody.cl` | `/dashboard` |
| Paciente | `maria.gonzalez@example.com` | `/portal` |

Scripts disponibles: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

---

## ▲ Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub/GitLab/Bitbucket.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo.
3. Vercel detecta Next.js automáticamente (Build: `next build`, Output: `.next`). No requiere configuración extra.
4. (Opcional) En **Settings → Environment Variables** agrega las variables de Supabase si vas a conectarlo.
5. **Deploy**. Cada push a `main` genera un nuevo despliegue.

```bash
# Alternativa por CLI
npm i -g vercel
vercel        # preview
vercel --prod # producción
```

---

## 🗄️ Conectar Supabase (opcional)

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecuta `supabase/schema.sql` (y `supabase/seed.sql` para datos de ejemplo).
3. Copia la URL y las claves desde **Project Settings → API** a `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   NEXT_PUBLIC_USE_SUPABASE=true
   ```
4. Implementa las consultas en `src/lib/data/supabase-repo.ts` (hay plantillas comentadas) y enruta `store.ts` hacia ellas cuando `useSupabase` sea `true`.
5. Las políticas **RLS** base ya vienen en `schema.sql`: staff ve todo; cada paciente solo sus datos. Ajústalas a tu operación.

> En Vercel, replica estas variables en **Settings → Environment Variables**.

---

## 🔮 Mejoras futuras recomendadas

- **Notificaciones reales**: correo/SMS/WhatsApp al confirmar o recordar citas (Resend, Twilio).
- **Calendario real de disponibilidad** por profesional (bloques, vacaciones, feriados).
- **Pagos en línea** (Webpay/Transbank, MercadoPago, Stripe) y emisión de boleta.
- **Carga de archivos** clínicos (imágenes, informes) en Supabase Storage.
- **Gráficos de evolución** del dolor y adherencia a ejercicios (Recharts).
- **App móvil / PWA** para que el paciente registre dolor y ejercicios desde casa.
- **Reportes y exportación** (PDF/Excel) de fichas y métricas del centro.
- **Multi-sede** y agenda por box/sala.
- **Tests** (unitarios con Vitest, e2e con Playwright) y CI.
- **Auditoría y trazabilidad** clínica + cumplimiento de protección de datos de salud.

---

## ⚠️ Notas

- Los datos son **mock en memoria**: se reinician al recargar/redeploy. Sirven para demo y desarrollo de UI.
- Validación de RUT chileno incluida (`src/lib/utils.ts`).
- Hecho como base **funcional y escalable** para convertirse en un sistema real, no solo una maqueta.
