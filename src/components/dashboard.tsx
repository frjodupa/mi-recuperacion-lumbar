import { CalendarDays, Clock3, Footprints, HeartPulse, Moon, Play, Sparkles, Target } from 'lucide-react';
import { Button, Card, ProgressRing } from './ui';
import type { AppState, DailyCheckIn, Exercise, Routine } from '../types';
import type { PageId } from './BottomNavigation';

export function DashboardHeader({ greeting, name, date, message }: { greeting: string; name: string; date: string; message: string }) {
  return (
    <div>
      <p className="inline-flex items-center gap-2 rounded-full border border-petrol-100 bg-white/70 px-3 py-1 text-sm font-bold text-petrol-700 shadow-sm"><CalendarDays className="size-4" /> Asistente diario</p>
      <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-petrol-700 sm:text-5xl">{greeting}, {name}</h2>
      <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-petrol-700">Tu recuperación, paso a paso</p>
      <p className="mt-3 text-lg text-slate-600">{date}</p>
      <p className="motivational-message mt-2 flex items-start gap-2 text-sm font-medium leading-relaxed text-slate-500 sm:items-center sm:text-base">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-aqua sm:mt-0" aria-hidden />
        <span>{message}</span>
      </p>
    </div>
  );
}

export function StatusTodayCard({ checkIn, onRegister }: { checkIn: DailyCheckIn; onRegister: () => void }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Estado de hoy</p>
      <h3 className="mt-1 text-xl font-bold text-petrol-700">Cómo te encuentras</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <MiniStat icon={<HeartPulse className="size-4" />} label="Dolor" value={`${checkIn.pain}/10`} />
        <MiniStat icon={<Moon className="size-4" />} label="Sueño" value={`${checkIn.sleepQuality ?? 7}/10`} />
        <MiniStat icon={<Sparkles className="size-4" />} label="Ánimo" value={checkIn.mood || 'Tranquilo'} />
      </div>
      <Button className="mt-4 w-full" variant="secondary" onClick={onRegister}>Registrar cómo me encuentro</Button>
    </Card>
  );
}

export function RecoveryProgressCard({ days, phase, percent }: { days: number | null; phase: string; percent: number }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Recuperación</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <ProgressRing percent={percent} />
        <div>
          <p className="text-3xl font-bold tracking-[-0.04em] text-petrol-700">{days === null ? 'Configurar' : `${days} días`}</p>
          <p className="mt-1 font-semibold text-slate-600">{phase}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">Seguimiento prudente de constancia y registro. La app no interpreta clínicamente tu evolución ni cambia fases sin autorización.</p>
        </div>
      </div>
    </Card>
  );
}

export function TodayPlanCard({ routine, completed, onStart, onExplore }: { routine: Routine; completed: number; onStart: () => void; onExplore: () => void }) {
  const total = routine.exercises.length;
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Plan de hoy</p>
      <h3 className="mt-1 text-xl font-bold text-petrol-700">{routine.name}</h3>
      <p className="mt-2 text-sm text-slate-600">{total} ejercicios previstos · {completed} completados · {Math.max(0, total - completed)} pendientes</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={onStart}><Play className="size-5" /> Comenzar sesión</Button>
        <Button className="flex-1" variant="ghost" onClick={onExplore}>Explorar ejercicios</Button>
      </div>
    </Card>
  );
}

export function NextActivityCard({ routine, exercises }: { routine: Routine; exercises: Exercise[] }) {
  const nextRoutineExercise = routine.exercises[0];
  const next = exercises.find((exercise) => exercise.id === nextRoutineExercise?.exerciseId);
  const plannedDuration = nextRoutineExercise?.duration ?? next?.duration ?? nextRoutineExercise?.repetitions ?? next?.repetitions ?? 'Según pauta';
  const equipmentLabel = next?.equipmentLabels?.join(', ') || 'Sin material específico';
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Próxima actividad</p>
      <h3 className="mt-1 text-xl font-bold text-petrol-700">{next?.name ?? 'Sin actividad programada'}</h3>
      <div className="mt-4 grid gap-3 text-sm text-slate-600">
        <MiniStat icon={<Clock3 className="size-4" />} label="Hora estimada" value="Cuando te encuentres preparado" />
        <MiniStat icon={<Target className="size-4" />} label="Duración" value={plannedDuration} />
        <MiniStat icon={<Footprints className="size-4" />} label="Material" value={equipmentLabel} />
      </div>
    </Card>
  );
}

export function WeeklySummaryCard({ sessions, setPage }: { sessions: AppState['sessions']; setPage: (page: PageId) => void }) {
  const last7 = sessions.filter((session) => Date.now() - new Date(session.date).getTime() <= 7 * 86400000);
  const completed = last7.filter((session) => session.completedExerciseIds.length > 0);
  const painValues = completed.map((session) => session.painAfter);
  const walks = completed.filter((session) => session.walked).length;
  const trend = painValues.length >= 2 ? painValues[painValues.length - 1] - painValues[0] : null;
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Resumen semanal</p>
      {completed.length ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <MiniStat label="Sesiones" value={completed.length} />
            <MiniStat label="Días activos" value={new Set(completed.map((session) => session.date)).size} />
            <MiniStat label="Dolor" value={trend === null ? 'Sin tendencia' : trend <= 0 ? 'Estable/mejor' : 'Más alto'} />
            <MiniStat label="Caminatas" value={walks} />
          </div>
          <Button className="mt-4 w-full" variant="ghost" onClick={() => setPage('progress')}>Ver evolución</Button>
        </>
      ) : (
        <p className="mt-3 rounded-2xl bg-petrol-50 p-4 text-sm font-semibold text-slate-600">Todavía no hay suficientes registros. Completa tu primer seguimiento para ver tu evolución.</p>
      )}
    </Card>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-petrol-100 bg-white/60 p-3">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{icon}{label}</p>
      <p className="mt-1 text-lg font-bold text-petrol-700">{value}</p>
    </div>
  );
}
