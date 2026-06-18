// Modelo de datos central. Refleja el schema de Supabase (ver supabase/schema.sql).

export type Role = "admin" | "kinesiologo" | "paciente";

export type AppointmentStatus = "pendiente" | "confirmada" | "cancelada" | "realizada";
export type TreatmentStatus = "activo" | "pausado" | "finalizado";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  // referencia opcional al perfil de dominio
  professional_id?: string | null;
  patient_id?: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration_min: number;
  price_clp: number;
  icon: string; // nombre del icono lucide
  active: boolean;
}

export interface Professional {
  id: string;
  full_name: string;
  title: string; // ej. "Kinesiólogo, Mg. en Rehabilitación"
  specialties: string[];
  bio: string;
  photo_url?: string | null;
  active: boolean;
}

export interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  rut: string;
  birth_date?: string | null;
  address?: string | null;
  reason?: string | null; // motivo de consulta inicial
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  professional_id: string;
  service_id: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:mm
  status: AppointmentStatus;
  notes?: string | null;
  created_at: string;
}

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  professional_id: string;
  diagnosis: string;
  objective: string;
  status: TreatmentStatus;
  sessions_planned: number;
  start_date: string;
  created_at: string;
}

export interface TreatmentSession {
  id: string;
  plan_id: string;
  patient_id: string;
  professional_id: string;
  date: string;
  pain_level: number;        // 1-10 reportado por paciente
  exercises_done: string;
  observations: string;
  progress_note: string;     // avance
  next_recommendation: string;
  attachments?: string[];    // urls
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  body_area: string;
  default_sets: number;
  default_reps: number;
  video_url?: string | null;
}

export interface PatientExercise {
  id: string;
  patient_id: string;
  exercise_id: string;
  plan_id: string;
  sets: number;
  reps: number;
  frequency: string; // ej. "2 veces al día"
  notes?: string | null;
  assigned_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  read: boolean;
  type: "cita" | "tratamiento" | "sistema";
  created_at: string;
}

// Tipos compuestos para vistas
export interface AppointmentDetailed extends Appointment {
  patient?: Patient;
  professional?: Professional;
  service?: Service;
}
