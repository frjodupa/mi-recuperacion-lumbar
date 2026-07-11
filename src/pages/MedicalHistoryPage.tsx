import { FileText } from 'lucide-react';
import { Button, Card } from '../components/ui';
import type { AppState, Session } from '../types';

export function MedicalHistoryPage({ state }: { state: AppState }) {
  const history = state.sessions.slice().sort((a, b) => (b.savedAt || b.date).localeCompare(a.savedAt || a.date));
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-petrol-700">Historial médico</h2>
          <p className="text-slate-600">Registro clínico detallado de síntomas, ejercicios, cargas, incidencias y observaciones.</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()}><FileText className="size-5" /> PDF profesional</Button>
      </div>
      <Card>
        <div className="grid gap-3 sm:grid-cols-4">
          <Metric label="Sesiones" value={history.length} />
          <Metric label="Dolor medio" value={average(history.map((item) => item.painAfter)).toFixed(1)} />
          <Metric label="Fatiga media" value={average(history.map((item) => item.fatigue)).toFixed(1)} />
          <Metric label="Duración total" value={`${history.reduce((sum, item) => sum + item.durationMinutes, 0)} min`} />
        </div>
      </Card>
      <div className="space-y-3">
        {history.map((session) => <HistoryEntry key={session.id} session={session} state={state} />)}
        {!history.length && <Card><p className="text-slate-600">Aún no hay sesiones registradas.</p></Card>}
      </div>
    </div>
  );
}

function HistoryEntry({ session, state }: { session: Session; state: AppState }) {
  const routine = state.routines.find((item) => item.id === session.routineId);
  const time = session.savedAt ? new Intl.DateTimeFormat('es-ES', { timeStyle: 'short' }).format(new Date(session.savedAt)) : 'Sin hora';
  const weight = session.strengthLogs?.map((item) => `${item.exerciseName}: ${item.weightKg} kg`).join(' · ') || 'Sin peso registrado';
  return (
    <Card>
      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-sm font-bold uppercase text-calmgreen">{formatDate(session.date)} · {time}</p>
          <h3 className="mt-1 text-xl font-bold text-petrol-700">{routine?.name || 'Rutina'}</h3>
          <p className="mt-2 text-sm text-slate-600">Duración {session.durationMinutes} min · dolor {session.painBefore}→{session.painAfter} · fatiga {session.fatigue}/10 · rigidez {session.stiffness ?? '-'}/10</p>
          <p className="mt-2 text-sm text-slate-700">Peso utilizado: {weight}</p>
          <p className="mt-2 text-sm text-slate-700">Observaciones: {session.observations || 'Sin observaciones.'}</p>
          <p className="mt-1 text-sm text-slate-700">Incidencias: {session.incidents || 'Sin incidencias registradas.'}</p>
        </div>
        <div className="rounded-xl bg-petrol-50 p-3 text-sm text-slate-700">
          <p className="font-bold text-petrol-700">Ejercicios realizados</p>
          <ul className="mt-2 space-y-1">
            {(session.exerciseLogs || []).map((log) => <li key={log.exerciseId}>{log.exerciseName} · {log.setsCompleted} series · {log.repetitions || log.duration || 'según pauta'}</li>)}
            {!session.exerciseLogs?.length && session.completedExerciseIds.map((id) => <li key={id}>{state.exercises.find((exercise) => exercise.id === id)?.name || id}</li>)}
          </ul>
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-petrol-100 bg-petrol-50 p-3"><p className="text-xs font-bold uppercase text-slate-500">{label}</p><p className="mt-1 text-xl font-bold text-petrol-700">{value}</p></div>;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(date));
}
