import { Calendar, CalendarDays, Clock3, Edit3, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { AppState, MedicalAppointment, MedicalAppointmentReminder, MedicalAppointmentSpecialty } from '../../types';
import {
  formatReminderLabel,
  getLocalNotificationPermission,
  requestLocalNotificationPermission,
  syncLocalReminderPlans,
} from '../../services/appointments/reminderService';
import { Button, Card, ConfirmDialog, Modal, ResponsibilityNotice } from '../ui';

const specialtyOptions: MedicalAppointmentSpecialty[] = [
  'Traumatología',
  'Rehabilitación',
  'Fisioterapia',
  'Medicina de familia',
  'Neurología',
  'Enfermería',
  'Prueba diagnóstica',
  'Otra',
];

const reminderOptions: MedicalAppointmentReminder[] = ['24h', '2h', '30m', 'none'];

type AppointmentForm = Omit<MedicalAppointment, 'id' | 'createdAt' | 'updatedAt' | 'selectedSessionIds'> & {
  selectedSessionIds: string[];
};

const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

export function MedicalAgendaSection({
  state,
  setState,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
  const [selectedDate, setSelectedDate] = useState(() => formatDateInput(new Date()));
  const [monthCursor, setMonthCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [editorOpen, setEditorOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<string>(() => getLocalNotificationPermission());
  const [plannedReminders, setPlannedReminders] = useState(0);
  const [form, setForm] = useState<AppointmentForm>(() => buildEmptyForm(formatDateInput(new Date())));
  const [editingId, setEditingId] = useState<string | null>(null);

  const sortedAppointments = useMemo(
    () => [...state.medicalAppointments].sort((a, b) => Date.parse(`${a.date}T${a.time || '00:00'}`) - Date.parse(`${b.date}T${b.time || '00:00'}`)),
    [state.medicalAppointments],
  );

  const dayAppointments = sortedAppointments.filter((item) => item.date === selectedDate);
  const upcomingAppointment = sortedAppointments.find((item) => Date.parse(`${item.date}T${item.time || '00:00'}`) >= Date.now()) || null;
  const detailsAppointment = detailsId ? state.medicalAppointments.find((item) => item.id === detailsId) || null : null;

  useEffect(() => {
    const plans = syncLocalReminderPlans(state.medicalAppointments);
    setPlannedReminders(plans.length);
    setNotificationPermission(getLocalNotificationPermission());
  }, [state.medicalAppointments]);

  const openCreate = () => {
    setEditingId(null);
    setForm(buildEmptyForm(selectedDate));
    setEditorOpen(true);
  };

  const openEdit = (appointment: MedicalAppointment) => {
    setEditingId(appointment.id);
    setForm({
      date: appointment.date,
      time: appointment.time,
      specialty: appointment.specialty,
      professionalName: appointment.professionalName,
      medicalCenter: appointment.medicalCenter,
      reason: appointment.reason,
      personalNotes: appointment.personalNotes,
      documentsToBring: appointment.documentsToBring,
      questionsToDiscuss: appointment.questionsToDiscuss,
      reminder: appointment.reminder,
      selectedSessionIds: appointment.selectedSessionIds,
    });
    setEditorOpen(true);
  };

  const saveAppointment = () => {
    if (!form.date || !form.time || !form.specialty || !form.reason) return;
    const now = new Date().toISOString();

    setState((current) => {
      if (editingId) {
        return {
          ...current,
          medicalAppointments: current.medicalAppointments.map((item) => item.id === editingId
            ? {
              ...item,
              ...form,
              updatedAt: now,
            }
            : item),
        };
      }

      return {
        ...current,
        medicalAppointments: [
          {
            id: crypto.randomUUID(),
            ...form,
            createdAt: now,
            updatedAt: now,
          },
          ...current.medicalAppointments,
        ],
      };
    });

    setEditorOpen(false);
  };

  const deleteAppointment = (id: string) => {
    setState((current) => ({
      ...current,
      medicalAppointments: current.medicalAppointments.filter((item) => item.id !== id),
    }));
    if (detailsId === id) setDetailsId(null);
    setDeleteId(null);
  };

  const toggleSessionForAppointment = (appointmentId: string, sessionId: string) => {
    setState((current) => ({
      ...current,
      medicalAppointments: current.medicalAppointments.map((item) => {
        if (item.id !== appointmentId) return item;
        const selected = item.selectedSessionIds.includes(sessionId)
          ? item.selectedSessionIds.filter((id) => id !== sessionId)
          : [...item.selectedSessionIds, sessionId];
        return {
          ...item,
          selectedSessionIds: selected,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  };

  const requestPermission = async () => {
    const permission = await requestLocalNotificationPermission();
    setNotificationPermission(permission);
    const plans = syncLocalReminderPlans(state.medicalAppointments);
    setPlannedReminders(plans.length);
  };

  const monthDays = buildMonthDays(monthCursor.getFullYear(), monthCursor.getMonth());

  return (
    <section>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Agenda médica</p>
      <Card className="mt-3 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-petrol-700">Agenda médica</h3>
            <p className="text-sm text-slate-600">Registra y organiza tus próximas citas sanitarias desde este perfil.</p>
          </div>
          <Button onClick={openCreate}><Plus className="size-4" /> Nueva cita</Button>
        </div>

        <ResponsibilityNotice withEscalation className="mt-4" />

        <div className="mt-4 rounded-2xl border border-petrol-100 bg-petrol-50/70 p-4 text-sm text-slate-700">
          <p>
            Las citas se guardan en este dispositivo mientras no exista una cuenta con sincronización.
          </p>
          <p className="mt-1">No se envían datos a terceros.</p>
          <p className="mt-2 font-semibold text-petrol-700">
            Recordatorios locales: {plannedReminders} planificados. Permiso actual: {formatPermission(notificationPermission)}.
          </p>
          {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
            <Button variant="secondary" className="mt-3" onClick={requestPermission}>Activar permiso de avisos locales</Button>
          )}
          {notificationPermission === 'unsupported' && (
            <p className="mt-2 text-xs font-semibold text-slate-500">Este navegador no permite notificaciones locales.</p>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-petrol-100 bg-white/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="rounded-xl border border-petrol-100 bg-white px-3 py-2 text-sm font-semibold text-petrol-700"
              onClick={() => setMonthCursor((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
            >
              Mes anterior
            </button>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-petrol-700">{formatMonthLabel(monthCursor)}</p>
            <button
              type="button"
              className="rounded-xl border border-petrol-100 bg-white px-3 py-2 text-sm font-semibold text-petrol-700"
              onClick={() => setMonthCursor((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
            >
              Mes siguiente
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            {weekdays.map((day) => <div key={day}>{day}</div>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {monthDays.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} className="min-h-11 rounded-xl bg-transparent" />;
              const dateKey = formatDateInput(day);
              const count = state.medicalAppointments.filter((item) => item.date === dateKey).length;
              const selected = dateKey === selectedDate;
              return (
                <button
                  key={dateKey}
                  type="button"
                  className={`min-h-11 rounded-xl border text-sm font-semibold transition ${selected ? 'border-petrol-500 bg-petrol-500 text-white' : 'border-petrol-100 bg-white text-petrol-700 hover:bg-petrol-50'}`}
                  onClick={() => setSelectedDate(dateKey)}
                >
                  <span>{day.getDate()}</span>
                  {count > 0 && <span className={`ml-1 inline-flex size-2 rounded-full ${selected ? 'bg-white' : 'bg-calmgreen'}`} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-petrol-100 bg-white/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-petrol-700">Citas del {formatHumanDate(selectedDate)}</p>
            {upcomingAppointment && (
              <span className="inline-flex items-center gap-1 rounded-full bg-petrol-50 px-3 py-1 text-xs font-semibold text-petrol-700">
                <CalendarDays className="size-3" /> Próxima: {upcomingAppointment.specialty}
              </span>
            )}
          </div>

          <div className="mt-3 space-y-3">
            {dayAppointments.length ? dayAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-xl border border-petrol-100 bg-white p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-petrol-700">{appointment.specialty}</p>
                    <p className="text-sm text-slate-600">{appointment.time} · {appointment.medicalCenter || 'Centro no indicado'}</p>
                    <p className="text-sm text-slate-600">{appointment.reason}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => setDetailsId(appointment.id)}>Ver detalles</Button>
                    <Button variant="ghost" onClick={() => openEdit(appointment)}><Edit3 className="size-4" /> Editar</Button>
                    <Button variant="danger" onClick={() => setDeleteId(appointment.id)}><Trash2 className="size-4" /> Eliminar</Button>
                  </div>
                </div>
              </div>
            )) : <p className="text-sm text-slate-600">No hay citas para este día.</p>}
          </div>
        </div>
      </Card>

      {editorOpen && (
        <Modal title={editingId ? 'Editar cita médica' : 'Nueva cita médica'} onClose={() => setEditorOpen(false)}>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Fecha
                <input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 px-3" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
              </label>
              <label className="text-sm font-semibold text-slate-700">Hora
                <input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 px-3" type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} />
              </label>
              <label className="text-sm font-semibold text-slate-700">Especialidad
                <select className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 px-3" value={form.specialty} onChange={(event) => setForm((current) => ({ ...current, specialty: event.target.value as MedicalAppointmentSpecialty }))}>
                  {specialtyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">Recordatorio previo
                <select className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 px-3" value={form.reminder} onChange={(event) => setForm((current) => ({ ...current, reminder: event.target.value as MedicalAppointmentReminder }))}>
                  {reminderOptions.map((option) => <option key={option} value={option}>{formatReminderLabel(option)}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">Profesional
                <input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 px-3" value={form.professionalName} onChange={(event) => setForm((current) => ({ ...current, professionalName: event.target.value }))} />
              </label>
              <label className="text-sm font-semibold text-slate-700">Centro médico
                <input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 px-3" value={form.medicalCenter} onChange={(event) => setForm((current) => ({ ...current, medicalCenter: event.target.value }))} />
              </label>
            </div>

            <label className="text-sm font-semibold text-slate-700">Motivo de la cita
              <input className="mt-1 block min-h-11 w-full rounded-xl border border-petrol-100 px-3" value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} />
            </label>

            <details className="rounded-2xl border border-petrol-100 bg-petrol-50/60 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-petrol-700">Más detalles</summary>
              <div className="mt-3 space-y-3">
                <label className="text-sm font-semibold text-slate-700">Notas personales
                  <textarea className="mt-1 block min-h-24 w-full rounded-xl border border-petrol-100 px-3 py-2" value={form.personalNotes} onChange={(event) => setForm((current) => ({ ...current, personalNotes: event.target.value }))} />
                </label>
                <label className="text-sm font-semibold text-slate-700">Documentos que conviene llevar
                  <textarea className="mt-1 block min-h-20 w-full rounded-xl border border-petrol-100 px-3 py-2" value={form.documentsToBring} onChange={(event) => setForm((current) => ({ ...current, documentsToBring: event.target.value }))} />
                </label>
                <label className="text-sm font-semibold text-slate-700">Preguntas para comentar
                  <textarea className="mt-1 block min-h-20 w-full rounded-xl border border-petrol-100 px-3 py-2" value={form.questionsToDiscuss} onChange={(event) => setForm((current) => ({ ...current, questionsToDiscuss: event.target.value }))} />
                </label>
              </div>
            </details>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={saveAppointment}>Guardar cita</Button>
              <Button variant="ghost" onClick={() => setEditorOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}

      {detailsAppointment && (
        <Modal title="Detalle de cita médica" onClose={() => { setDetailsId(null); setPrepareOpen(false); }}>
          <div className="space-y-4">
            <div className="rounded-2xl border border-petrol-100 bg-white/80 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-aqua">Cita programada</p>
              <h4 className="mt-1 text-xl font-semibold text-petrol-700">{detailsAppointment.specialty}</h4>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600"><Calendar className="size-4" /> {formatHumanDate(detailsAppointment.date)}</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-slate-600"><Clock3 className="size-4" /> {detailsAppointment.time}</p>
              <p className="mt-1 text-sm text-slate-600">{detailsAppointment.professionalName || 'Profesional no indicado'} · {detailsAppointment.medicalCenter || 'Centro no indicado'}</p>
              <p className="mt-1 text-sm text-slate-700">Motivo: {detailsAppointment.reason || 'Sin detalle'}</p>
            </div>

            <div className="rounded-2xl border border-petrol-100 bg-petrol-50/70 p-4 text-sm text-slate-700">
              <p className="font-semibold text-petrol-700">Documentos que conviene llevar</p>
              <p className="mt-1 whitespace-pre-wrap">{detailsAppointment.documentsToBring || 'Sin documentos anotados.'}</p>
            </div>

            <div className="rounded-2xl border border-petrol-100 bg-petrol-50/70 p-4 text-sm text-slate-700">
              <p className="font-semibold text-petrol-700">Notas personales</p>
              <p className="mt-1 whitespace-pre-wrap">{detailsAppointment.personalNotes || 'Sin notas personales.'}</p>
            </div>

            <div>
              <Button variant="secondary" onClick={() => setPrepareOpen((value) => !value)}>Preparar mi consulta</Button>
            </div>

            {prepareOpen && (
              <Card className="p-4 sm:p-5">
                <ResponsibilityNotice className="mb-3" />
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-aqua">Preparar mi consulta</p>

                <div className="mt-3 space-y-3">
                  <section className="rounded-xl border border-petrol-100 bg-white/70 p-3">
                    <p className="font-semibold text-petrol-700">Preguntas anotadas</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{detailsAppointment.questionsToDiscuss || 'Sin preguntas anotadas.'}</p>
                  </section>

                  <section className="rounded-xl border border-petrol-100 bg-white/70 p-3">
                    <p className="font-semibold text-petrol-700">Últimos informes añadidos</p>
                    <div className="mt-2 space-y-1 text-sm text-slate-600">
                      {state.medicalDocuments.slice(0, 3).length ? state.medicalDocuments.slice(0, 3).map((doc) => (
                        <p key={doc.id}>{doc.fileName} · {formatHumanDate(doc.uploadedAt.slice(0, 10))}</p>
                      )) : <p>No hay informes guardados todavía.</p>}
                    </div>
                  </section>

                  <section className="rounded-xl border border-petrol-100 bg-white/70 p-3">
                    <p className="font-semibold text-petrol-700">Notas recientes</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{detailsAppointment.personalNotes || 'Sin notas recientes para esta cita.'}</p>
                  </section>

                  <section className="rounded-xl border border-petrol-100 bg-white/70 p-3">
                    <p className="font-semibold text-petrol-700">Registros de evolución seleccionados</p>
                    <div className="mt-2 max-h-48 space-y-2 overflow-auto pr-1 text-sm">
                      {state.sessions.slice(-10).reverse().map((session) => {
                        const checked = detailsAppointment.selectedSessionIds.includes(session.id);
                        return (
                          <label key={session.id} className="flex items-center justify-between gap-2 rounded-lg border border-petrol-100 bg-white p-2 text-slate-700">
                            <span>{formatHumanDate(session.date)} · Dolor {session.painBefore}/{session.painAfter}</span>
                            <input
                              type="checkbox"
                              className="size-4 accent-petrol-500"
                              checked={checked}
                              onChange={() => toggleSessionForAppointment(detailsAppointment.id, session.id)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-900">
                    Esta sección solo organiza tu información. No interpreta síntomas, no modifica medicación y no sustituye a tu profesional sanitario.
                  </section>
                </div>
              </Card>
            )}

            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => openEdit(detailsAppointment)}><Edit3 className="size-4" /> Editar</Button>
              <Button variant="danger" onClick={() => setDeleteId(detailsAppointment.id)}><Trash2 className="size-4" /> Eliminar</Button>
              <Button variant="ghost" onClick={() => setDetailsId(null)}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          title="Eliminar cita"
          body="Esta acción eliminará la cita de tu agenda local."
          onConfirm={() => deleteAppointment(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </section>
  );
}

function buildEmptyForm(date: string): AppointmentForm {
  return {
    date,
    time: '09:00',
    specialty: 'Traumatología',
    professionalName: '',
    medicalCenter: '',
    reason: '',
    personalNotes: '',
    documentsToBring: '',
    questionsToDiscuss: '',
    reminder: '24h',
    selectedSessionIds: [],
  };
}

function buildMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const total = new Date(year, month + 1, 0).getDate();
  const blanks = first.getDay();
  const cells: Array<Date | null> = [];

  for (let i = 0; i < blanks; i += 1) cells.push(null);
  for (let day = 1; day <= total; day += 1) cells.push(new Date(year, month, day));

  return cells;
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(date);
}

function formatHumanDate(dateInput: string) {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${dateInput}T12:00:00`));
}

function formatPermission(permission: string) {
  if (permission === 'granted') return 'Permitido';
  if (permission === 'denied') return 'Denegado';
  if (permission === 'default') return 'Pendiente';
  return 'No compatible';
}
