import type {
  User, Service, Professional, Patient, Appointment,
  TreatmentPlan, TreatmentSession, Exercise, PatientExercise, Notification,
} from "@/lib/types";

// Fechas relativas para que el demo siempre tenga "hoy / próximas / pasadas"
const today = new Date();
const iso = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const services: Service[] = [
  { id: "svc-1", name: "Kinesiología Traumatológica", slug: "traumatologica", description: "Rehabilitación de lesiones musculoesqueléticas, post-operatorios y fracturas.", duration_min: 45, price_clp: 28000, icon: "Bone", active: true },
  { id: "svc-2", name: "Kinesiología Deportiva", slug: "deportiva", description: "Prevención y recuperación de lesiones deportivas, retorno seguro a la actividad.", duration_min: 45, price_clp: 30000, icon: "Activity", active: true },
  { id: "svc-3", name: "Kinesiología Respiratoria", slug: "respiratoria", description: "Tratamiento de patologías respiratorias agudas y crónicas en todas las edades.", duration_min: 40, price_clp: 26000, icon: "Wind", active: true },
  { id: "svc-4", name: "Rehabilitación Neurológica", slug: "neurologica", description: "Recuperación funcional post ACV, lesiones medulares y trastornos del movimiento.", duration_min: 60, price_clp: 35000, icon: "Brain", active: true },
  { id: "svc-5", name: "Evaluación Postural", slug: "postural", description: "Análisis biomecánico y plan correctivo para dolores de espalda y postura.", duration_min: 40, price_clp: 25000, icon: "PersonStanding", active: true },
  { id: "svc-6", name: "Terapia Manual", slug: "terapia-manual", description: "Técnicas manuales para aliviar dolor, mejorar movilidad y función articular.", duration_min: 45, price_clp: 29000, icon: "Hand", active: true },
];

export const professionals: Professional[] = [
  { id: "pro-1", full_name: "Dra. Carla Méndez", title: "Kinesióloga, Mg. en Rehabilitación Musculoesquelética", specialties: ["Traumatológica", "Terapia Manual"], bio: "Más de 12 años de experiencia en rehabilitación traumatológica y deportiva.", photo_url: null, active: true },
  { id: "pro-2", full_name: "Klgo. Diego Soto", title: "Kinesiólogo Deportivo, Cert. en Punción Seca", specialties: ["Deportiva", "Terapia Manual"], bio: "Especialista en retorno deportivo y prevención de lesiones en deportistas.", photo_url: null, active: true },
  { id: "pro-3", full_name: "Klga. Antonia Rivas", title: "Kinesióloga Respiratoria, Diplomada en Rehab. Cardiorrespiratoria", specialties: ["Respiratoria"], bio: "Experiencia clínica y domiciliaria en pacientes respiratorios de todas las edades.", photo_url: null, active: true },
  { id: "pro-4", full_name: "Klgo. Felipe Araya", title: "Kinesiólogo, Mg. en Neurorrehabilitación", specialties: ["Neurológica", "Postural"], bio: "Enfocado en recuperación funcional neurológica y reeducación del movimiento.", photo_url: null, active: true },
];

export const patients: Patient[] = [
  { id: "pat-1", full_name: "María González", email: "maria.gonzalez@example.com", phone: "+56 9 8765 4321", rut: "12.345.678-5", birth_date: "1988-04-12", address: "Av. Providencia 1234, Santiago", reason: "Dolor lumbar crónico", created_at: iso(-60) },
  { id: "pat-2", full_name: "Juan Pérez", email: "juan.perez@example.com", phone: "+56 9 1234 5678", rut: "9.876.543-2", birth_date: "1995-11-03", address: "Los Leones 456, Providencia", reason: "Esguince de tobillo grado II", created_at: iso(-30) },
  { id: "pat-3", full_name: "Sofía Castro", email: "sofia.castro@example.com", phone: "+56 9 5555 1212", rut: "15.111.222-3", birth_date: "2000-07-21", address: "Irarrázaval 789, Ñuñoa", reason: "Rehabilitación post-operatoria de rodilla (LCA)", created_at: iso(-20) },
  { id: "pat-4", full_name: "Roberto Díaz", email: "roberto.diaz@example.com", phone: "+56 9 4444 8989", rut: "8.222.333-4", birth_date: "1972-02-09", address: "Vicuña Mackenna 100, Santiago", reason: "Cervicalgia y mala postura laboral", created_at: iso(-12) },
];

export const appointments: Appointment[] = [
  { id: "apt-1", patient_id: "pat-1", professional_id: "pro-1", service_id: "svc-1", date: iso(0), time: "09:00", status: "confirmada", notes: null, created_at: iso(-3) },
  { id: "apt-2", patient_id: "pat-2", professional_id: "pro-2", service_id: "svc-2", date: iso(0), time: "10:30", status: "confirmada", notes: null, created_at: iso(-2) },
  { id: "apt-3", patient_id: "pat-3", professional_id: "pro-1", service_id: "svc-1", date: iso(0), time: "12:00", status: "pendiente", notes: "Trae imágenes de resonancia", created_at: iso(-1) },
  { id: "apt-4", patient_id: "pat-4", professional_id: "pro-4", service_id: "svc-5", date: iso(1), time: "16:00", status: "confirmada", notes: null, created_at: iso(-1) },
  { id: "apt-5", patient_id: "pat-1", professional_id: "pro-1", service_id: "svc-6", date: iso(3), time: "09:30", status: "pendiente", notes: null, created_at: iso(0) },
  { id: "apt-6", patient_id: "pat-2", professional_id: "pro-2", service_id: "svc-2", date: iso(-2), time: "11:00", status: "realizada", notes: null, created_at: iso(-9) },
  { id: "apt-7", patient_id: "pat-3", professional_id: "pro-1", service_id: "svc-1", date: iso(-5), time: "15:00", status: "realizada", notes: null, created_at: iso(-12) },
  { id: "apt-8", patient_id: "pat-4", professional_id: "pro-4", service_id: "svc-5", date: iso(-1), time: "17:00", status: "cancelada", notes: "Reagenda paciente", created_at: iso(-6) },
];

export const treatmentPlans: TreatmentPlan[] = [
  { id: "plan-1", patient_id: "pat-1", professional_id: "pro-1", diagnosis: "Lumbalgia mecánica crónica", objective: "Reducir dolor a <3/10 y recuperar rango de movimiento lumbar completo.", status: "activo", sessions_planned: 10, start_date: iso(-50), created_at: iso(-50) },
  { id: "plan-2", patient_id: "pat-2", professional_id: "pro-2", diagnosis: "Esguince lateral tobillo grado II", objective: "Retorno deportivo seguro en 6 semanas sin inestabilidad.", status: "activo", sessions_planned: 8, start_date: iso(-25), created_at: iso(-25) },
  { id: "plan-3", patient_id: "pat-3", professional_id: "pro-1", diagnosis: "Post-operatorio reconstrucción LCA", objective: "Recuperar fuerza de cuádriceps y estabilidad de rodilla.", status: "activo", sessions_planned: 16, start_date: iso(-18), created_at: iso(-18) },
  { id: "plan-4", patient_id: "pat-4", professional_id: "pro-4", diagnosis: "Cervicalgia postural", objective: "Corregir postura y eliminar dolor cervical.", status: "pausado", sessions_planned: 6, start_date: iso(-10), created_at: iso(-10) },
];

export const treatmentSessions: TreatmentSession[] = [
  { id: "ses-1", plan_id: "plan-1", patient_id: "pat-1", professional_id: "pro-1", date: iso(-45), pain_level: 7, exercises_done: "Movilidad lumbar, activación de core", observations: "Buena tolerancia, leve molestia al final.", progress_note: "Mejora inicial en rango de flexión.", next_recommendation: "Progresar carga de core en próxima sesión.", attachments: [], created_at: iso(-45) },
  { id: "ses-2", plan_id: "plan-1", patient_id: "pat-1", professional_id: "pro-1", date: iso(-30), pain_level: 5, exercises_done: "Puente glúteo, bird-dog, estiramientos", observations: "Reporta menos dolor matinal.", progress_note: "Reducción del dolor reportado de 7 a 5.", next_recommendation: "Incorporar fortalecimiento de cadena posterior.", attachments: [], created_at: iso(-30) },
  { id: "ses-3", plan_id: "plan-1", patient_id: "pat-1", professional_id: "pro-1", date: iso(-12), pain_level: 3, exercises_done: "Sentadilla asistida, plancha, marcha", observations: "Mayor confianza en movimientos.", progress_note: "Objetivo de dolor casi alcanzado.", next_recommendation: "Iniciar reintegro a actividad física habitual.", attachments: [], created_at: iso(-12) },
  { id: "ses-4", plan_id: "plan-2", patient_id: "pat-2", professional_id: "pro-2", date: iso(-20), pain_level: 6, exercises_done: "Movilidad de tobillo, propiocepción básica", observations: "Edema leve persistente.", progress_note: "Inflamación en descenso.", next_recommendation: "Progresar propiocepción con superficies inestables.", attachments: [], created_at: iso(-20) },
  { id: "ses-5", plan_id: "plan-2", patient_id: "pat-2", professional_id: "pro-2", date: iso(-2), pain_level: 3, exercises_done: "Bosu, saltos controlados, fortalecimiento peroneos", observations: "Sin dolor en marcha.", progress_note: "Listo para iniciar trote progresivo.", next_recommendation: "Plan de carrera progresiva la próxima semana.", attachments: [], created_at: iso(-2) },
];

export const exercises: Exercise[] = [
  { id: "ex-1", name: "Puente de glúteos", description: "Acostado boca arriba, eleva la cadera contrayendo glúteos.", body_area: "Lumbar/Glúteo", default_sets: 3, default_reps: 12, video_url: null },
  { id: "ex-2", name: "Bird-dog", description: "En cuadrupedia, extiende brazo y pierna opuestos manteniendo el core estable.", body_area: "Core", default_sets: 3, default_reps: 10, video_url: null },
  { id: "ex-3", name: "Propiocepción en una pierna", description: "Equilibrio sobre una pierna, progresar con ojos cerrados.", body_area: "Tobillo", default_sets: 3, default_reps: 30, video_url: null },
  { id: "ex-4", name: "Sentadilla asistida", description: "Sentadilla controlada con apoyo, cuidando alineación de rodilla.", body_area: "Rodilla/Cuádriceps", default_sets: 3, default_reps: 12, video_url: null },
  { id: "ex-5", name: "Retracción cervical", description: "Lleva el mentón hacia atrás manteniendo la mirada al frente.", body_area: "Cervical", default_sets: 3, default_reps: 10, video_url: null },
];

export const patientExercises: PatientExercise[] = [
  { id: "pe-1", patient_id: "pat-1", exercise_id: "ex-1", plan_id: "plan-1", sets: 3, reps: 15, frequency: "2 veces al día", notes: "Sin dolor; detener si molesta.", assigned_at: iso(-12) },
  { id: "pe-2", patient_id: "pat-1", exercise_id: "ex-2", plan_id: "plan-1", sets: 3, reps: 10, frequency: "1 vez al día", notes: null, assigned_at: iso(-12) },
  { id: "pe-3", patient_id: "pat-2", exercise_id: "ex-3", plan_id: "plan-2", sets: 4, reps: 30, frequency: "Diario", notes: "Progresar a superficie inestable.", assigned_at: iso(-2) },
  { id: "pe-4", patient_id: "pat-3", exercise_id: "ex-4", plan_id: "plan-3", sets: 3, reps: 12, frequency: "Día por medio", notes: "Cuidar valgo de rodilla.", assigned_at: iso(-5) },
];

export const notifications: Notification[] = [
  { id: "not-1", user_id: "user-pat-1", title: "Cita confirmada", body: "Tu cita del " + iso(0) + " a las 09:00 fue confirmada.", read: false, type: "cita", created_at: iso(-1) },
  { id: "not-2", user_id: "user-pat-1", title: "Nuevos ejercicios asignados", body: "Tu kinesiólogo asignó nuevos ejercicios a tu plan.", read: false, type: "tratamiento", created_at: iso(-12) },
];

export const users: User[] = [
  { id: "user-admin", email: "admin@kinesiologiakbody.cl", full_name: "Administración Kbody Sport", role: "admin", created_at: iso(-90) },
  { id: "user-kine", email: "kine@kinesiologiakbody.cl", full_name: "Dra. Carla Méndez", role: "kinesiologo", professional_id: "pro-1", created_at: iso(-90) },
  { id: "user-pat-1", email: "maria.gonzalez@example.com", full_name: "María González", role: "paciente", patient_id: "pat-1", created_at: iso(-60) },
];
