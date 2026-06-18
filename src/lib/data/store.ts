// Capa de datos abstraída.
//
// Hoy: opera sobre datos mock en memoria (cliente). Mañana: reemplaza el
// cuerpo de cada función por consultas a Supabase (ver lib/data/supabase-repo.ts
// como referencia) sin tocar ninguna pantalla. Toda la UI consume SOLO estas funciones.

import {
  appointments as seedAppointments,
  patients as seedPatients,
  professionals as seedProfessionals,
  services as seedServices,
  treatmentPlans as seedPlans,
  treatmentSessions as seedSessions,
  exercises as seedExercises,
  patientExercises as seedPatientExercises,
  notifications as seedNotifications,
  users as seedUsers,
} from "./mock-data";
import type {
  Appointment, AppointmentDetailed, AppointmentStatus, Patient, Professional,
  Service, TreatmentPlan, TreatmentSession, Exercise, PatientExercise, Notification, User,
} from "@/lib/types";

// Copias mutables en memoria (simulan la base de datos durante la sesión)
let appointments = [...seedAppointments];
let patients = [...seedPatients];
let professionals = [...seedProfessionals];
let services = [...seedServices];
let plans = [...seedPlans];
let sessions = [...seedSessions];
let patientExercises = [...seedPatientExercises];
let notifications = [...seedNotifications];

const exercises = [...seedExercises];
const users = [...seedUsers];

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));
const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

// ---------- Lecturas ----------
export async function getServices(): Promise<Service[]> {
  await delay(); return services.filter((s) => s.active);
}
export async function getProfessionals(): Promise<Professional[]> {
  await delay(); return professionals.filter((p) => p.active);
}
export async function getPatients(): Promise<Patient[]> {
  await delay(); return patients;
}
export async function getPatient(id: string): Promise<Patient | undefined> {
  await delay(); return patients.find((p) => p.id === id);
}
export async function getExercises(): Promise<Exercise[]> {
  await delay(); return exercises;
}

function decorate(a: Appointment): AppointmentDetailed {
  return {
    ...a,
    patient: patients.find((p) => p.id === a.patient_id),
    professional: professionals.find((p) => p.id === a.professional_id),
    service: services.find((s) => s.id === a.service_id),
  };
}

export async function getAppointments(): Promise<AppointmentDetailed[]> {
  await delay(); return appointments.map(decorate).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}
export async function getAppointmentsByPatient(patientId: string): Promise<AppointmentDetailed[]> {
  await delay(); return appointments.filter((a) => a.patient_id === patientId).map(decorate)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export async function getTreatmentPlansByPatient(patientId: string): Promise<TreatmentPlan[]> {
  await delay(); return plans.filter((p) => p.patient_id === patientId);
}
export async function getSessionsByPlan(planId: string): Promise<TreatmentSession[]> {
  await delay(); return sessions.filter((s) => s.plan_id === planId).sort((a, b) => b.date.localeCompare(a.date));
}
export async function getSessionsByPatient(patientId: string): Promise<TreatmentSession[]> {
  await delay(); return sessions.filter((s) => s.patient_id === patientId).sort((a, b) => b.date.localeCompare(a.date));
}
export async function getPatientExercises(patientId: string): Promise<(PatientExercise & { exercise?: Exercise })[]> {
  await delay(); return patientExercises.filter((p) => p.patient_id === patientId)
    .map((pe) => ({ ...pe, exercise: exercises.find((e) => e.id === pe.exercise_id) }));
}
export async function getNotifications(userId: string): Promise<Notification[]> {
  await delay(); return notifications.filter((n) => n.user_id === userId);
}

// ---------- Horarios disponibles (mock) ----------
const SLOTS = ["09:00", "09:45", "10:30", "11:15", "12:00", "15:00", "15:45", "16:30", "17:15"];
export async function getAvailableSlots(professionalId: string, date: string): Promise<string[]> {
  await delay();
  const taken = appointments
    .filter((a) => a.professional_id === professionalId && a.date === date && a.status !== "cancelada")
    .map((a) => a.time);
  return SLOTS.filter((s) => !taken.includes(s));
}

// ---------- Escrituras ----------
export interface NewAppointmentInput {
  patient: { full_name: string; email: string; phone: string; rut: string; reason: string };
  professional_id: string;
  service_id: string;
  date: string;
  time: string;
}

export async function createAppointment(input: NewAppointmentInput): Promise<AppointmentDetailed> {
  await delay(400);
  let patient = patients.find((p) => p.rut === input.patient.rut || p.email === input.patient.email);
  if (!patient) {
    patient = {
      id: uid("pat"), full_name: input.patient.full_name, email: input.patient.email,
      phone: input.patient.phone, rut: input.patient.rut, reason: input.patient.reason,
      created_at: new Date().toISOString().slice(0, 10),
    };
    patients = [patient, ...patients];
  }
  const appt: Appointment = {
    id: uid("apt"), patient_id: patient.id, professional_id: input.professional_id,
    service_id: input.service_id, date: input.date, time: input.time,
    status: "pendiente", notes: input.patient.reason, created_at: new Date().toISOString().slice(0, 10),
  };
  appointments = [appt, ...appointments];
  return decorate(appt);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  await delay(200);
  appointments = appointments.map((a) => (a.id === id ? { ...a, status } : a));
}

export async function addTreatmentSession(s: Omit<TreatmentSession, "id" | "created_at">): Promise<TreatmentSession> {
  await delay(300);
  const session: TreatmentSession = { ...s, id: uid("ses"), created_at: new Date().toISOString().slice(0, 10) };
  sessions = [session, ...sessions];
  return session;
}

// ---------- Métricas para dashboard ----------
export async function getDashboardStats() {
  await delay();
  const todayStr = new Date().toISOString().slice(0, 10);
  return {
    todayCount: appointments.filter((a) => a.date === todayStr && a.status !== "cancelada").length,
    scheduled: appointments.filter((a) => a.status === "pendiente" || a.status === "confirmada").length,
    done: appointments.filter((a) => a.status === "realizada").length,
    cancelled: appointments.filter((a) => a.status === "cancelada").length,
    patients: patients.length,
    activePlans: plans.filter((p) => p.status === "activo").length,
  };
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await delay(150); return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
