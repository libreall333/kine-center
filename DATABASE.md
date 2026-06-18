# Modelo de datos · KineVida

Esquema relacional (PostgreSQL / Supabase). El SQL ejecutable está en [`supabase/schema.sql`](./supabase/schema.sql); los tipos TypeScript equivalentes en [`src/lib/types.ts`](./src/lib/types.ts).

## Diagrama de relaciones (resumen)

```
users (auth) ──┬── professional_id ──▶ professionals
               └── patient_id ──────▶ patients

patients ──1:N──▶ appointments ──N:1──▶ professionals
                          └────N:1────▶ services

patients ──1:N──▶ treatment_plans ──1:N──▶ treatment_sessions
                          └──────1:N───────▶ patient_exercises ──N:1──▶ exercises

users ──1:N──▶ notifications
```

## Tablas y campos

### `users`
Perfil de aplicación ligado a `auth.users` de Supabase.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | = `auth.users.id` |
| email | text | único |
| full_name | text | |
| role | enum | `admin` · `kinesiologo` · `paciente` |
| professional_id | uuid | FK opcional → professionals |
| patient_id | uuid | FK opcional → patients |
| created_at | timestamptz | |

### `services`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| name | text | |
| slug | text | único |
| description | text | |
| duration_min | int | duración de la sesión |
| price_clp | int | valor referencial |
| icon | text | nombre de icono lucide |
| active | boolean | |

### `professionals`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| full_name | text | |
| title | text | grado/título |
| specialties | text[] | especialidades |
| bio | text | |
| photo_url | text | |
| active | boolean | |

### `patients`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| full_name | text | |
| email | text | |
| phone | text | |
| rut | text | único (RUT chileno) |
| birth_date | date | |
| address | text | |
| reason | text | motivo de consulta inicial |
| created_at | timestamptz | |

### `appointments`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| patient_id | uuid (FK) | → patients |
| professional_id | uuid (FK) | → professionals |
| service_id | uuid (FK) | → services |
| date | date | |
| time | text | "HH:mm" |
| status | enum | `pendiente` · `confirmada` · `cancelada` · `realizada` |
| notes | text | |
| created_at | timestamptz | |

### `treatment_plans`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| patient_id | uuid (FK) | → patients |
| professional_id | uuid (FK) | → professionals |
| diagnosis | text | diagnóstico |
| objective | text | objetivo terapéutico |
| status | enum | `activo` · `pausado` · `finalizado` |
| sessions_planned | int | sesiones planificadas |
| start_date | date | |
| created_at | timestamptz | |

### `treatment_sessions`
Registro de evolución por sesión (seguimiento clínico).

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| plan_id | uuid (FK) | → treatment_plans |
| patient_id | uuid (FK) | → patients |
| professional_id | uuid (FK) | → professionals |
| date | date | fecha de sesión |
| pain_level | int | dolor reportado 1–10 |
| exercises_done | text | ejercicios indicados/realizados |
| observations | text | observaciones internas |
| progress_note | text | avance del tratamiento |
| next_recommendation | text | próxima recomendación |
| attachments | text[] | archivos/notas (URLs) |
| created_at | timestamptz | |

### `exercises`
Catálogo de ejercicios.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| name | text | |
| description | text | |
| body_area | text | zona corporal |
| default_sets | int | |
| default_reps | int | |
| video_url | text | |

### `patient_exercises`
Ejercicios asignados a un paciente dentro de un plan.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| patient_id | uuid (FK) | → patients |
| exercise_id | uuid (FK) | → exercises |
| plan_id | uuid (FK) | → treatment_plans |
| sets | int | |
| reps | int | |
| frequency | text | ej. "2 veces al día" |
| notes | text | |
| assigned_at | timestamptz | |

### `notifications`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid (PK) | |
| user_id | uuid (FK) | → users |
| title | text | |
| body | text | |
| read | boolean | |
| type | text | `cita` · `tratamiento` · `sistema` |
| created_at | timestamptz | |

## Seguridad (RLS)

`schema.sql` habilita Row Level Security con un esquema base:

- **Staff** (`admin`, `kinesiologo`): acceso total a citas, pacientes, planes y sesiones.
- **Paciente**: lectura solo de sus propios registros (citas, sesiones, ejercicios, notificaciones).
- **services / professionals**: lectura pública (necesaria para la landing y el agendamiento).

Ajusta las políticas a las necesidades regulatorias de tu centro (datos sensibles de salud).
