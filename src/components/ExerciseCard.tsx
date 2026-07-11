import { CheckCircle2, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import type { Exercise } from '../types';
import { Button, Card, ExercisePhoto } from './ui';

export function ExerciseCard({ exercise, onOpen, onAdd, onToggle, onDelete, canAdd = true, availabilityNote }: { exercise: Exercise; onOpen: () => void; onAdd: () => void; onToggle: () => void; onDelete: () => void; canAdd?: boolean; availabilityNote?: string }) {
  const setsLabel = exercise.sets ? `${exercise.sets} ${exercise.sets === 1 ? 'serie' : 'series'}` : 'Por pauta';
  const volumeLabel = exercise.repetitions || exercise.duration || 'Según pauta';
  const materials = exercise.equipmentLabels?.length ? exercise.equipmentLabels.join(' · ') : 'Sin material';

  return (
    <Card className={`${!exercise.enabled ? 'opacity-75' : ''}`}>
      <div className="grid gap-5 md:grid-cols-[220px_1fr]">
        <ExercisePhoto label={exercise.name} src={exercise.photoUrl} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-aqua">{exercise.category}</p>
              <h3 className="mt-1 text-xl font-bold leading-tight text-petrol-700">{exercise.name}</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">Material: {materials}</p>
            </div>
            {exercise.requiresProfessionalApproval && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">Autorización profesional</span>}
            {availabilityNote && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{availabilityNote}</span>}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{exercise.description}</p>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-3">
            <span className="rounded-xl bg-petrol-50 px-3 py-2">{setsLabel}</span>
            <span className="rounded-xl bg-petrol-50 px-3 py-2">{volumeLabel}</span>
            <span className="rounded-xl bg-petrol-50 px-3 py-2">Nivel {exercise.difficulty}</span>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-[1.15fr_1fr_1fr_auto]">
            <Button onClick={onOpen}>Abrir</Button>
            <Button variant="secondary" onClick={onAdd} disabled={!canAdd}><Plus className="size-5" /> Añadir a rutina</Button>
            <Button variant="ghost" onClick={onToggle}>{exercise.enabled ? <EyeOff className="size-5" /> : <Eye className="size-5" />}{exercise.enabled ? 'Ocultar' : 'Mostrar'}</Button>
            <Button variant="danger" className="px-3 sm:min-w-12" onClick={onDelete} aria-label={`Eliminar ${exercise.name}`}><Trash2 className="size-5" /><span className="sm:sr-only lg:not-sr-only">Eliminar</span></Button>
          </div>
          <p className={`mt-3 flex items-center gap-2 text-sm font-semibold ${exercise.enabled ? 'text-calmgreen' : 'text-slate-500'}`}>
            <CheckCircle2 className="size-4" />
            {availabilityNote || (exercise.enabled ? 'Visible para añadir a rutinas' : 'Oculto: no aparece como opción activa')}
          </p>
        </div>
      </div>
    </Card>
  );
}
