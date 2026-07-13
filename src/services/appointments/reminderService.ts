import type { MedicalAppointment, MedicalAppointmentReminder } from '../../types';

const REMINDERS_KEY = 'mi-recuperacion-lumbar-appointment-reminders-v1';

export interface LocalReminderPlan {
  appointmentId: string;
  triggerAt: string;
  title: string;
  body: string;
}

export function getReminderOffsetMinutes(reminder: MedicalAppointmentReminder) {
  if (reminder === '24h') return 24 * 60;
  if (reminder === '2h') return 2 * 60;
  if (reminder === '30m') return 30;
  return 0;
}

export function buildLocalReminderPlan(appointment: MedicalAppointment): LocalReminderPlan | null {
  if (appointment.reminder === 'none') return null;
  const startsAt = new Date(`${appointment.date}T${appointment.time || '09:00'}`);
  if (Number.isNaN(startsAt.getTime())) return null;

  const offsetMinutes = getReminderOffsetMinutes(appointment.reminder);
  const triggerAt = new Date(startsAt.getTime() - offsetMinutes * 60_000);

  return {
    appointmentId: appointment.id,
    triggerAt: triggerAt.toISOString(),
    title: `Cita: ${appointment.specialty}`,
    body: `${formatReminderLabel(appointment.reminder)} antes en ${appointment.medicalCenter || 'tu centro medico'}.`,
  };
}

export function canUseLocalNotifications() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getLocalNotificationPermission() {
  if (!canUseLocalNotifications()) return 'unsupported';
  return Notification.permission;
}

export async function requestLocalNotificationPermission() {
  if (!canUseLocalNotifications()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
}

export function syncLocalReminderPlans(appointments: MedicalAppointment[]) {
  const permission = getLocalNotificationPermission();
  if (permission !== 'granted') {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify({ permission, plans: [] }));
    return [] as LocalReminderPlan[];
  }

  const plans = appointments
    .map(buildLocalReminderPlan)
    .filter((plan): plan is LocalReminderPlan => Boolean(plan))
    .filter((plan) => Date.parse(plan.triggerAt) > Date.now());

  localStorage.setItem(REMINDERS_KEY, JSON.stringify({ permission, plans }));
  return plans;
}

export function formatReminderLabel(reminder: MedicalAppointmentReminder) {
  if (reminder === '24h') return '24 horas';
  if (reminder === '2h') return '2 horas';
  if (reminder === '30m') return '30 minutos';
  return 'Sin recordatorio';
}
