import type { Exercise } from '../types';
import { Play } from 'lucide-react';
import { Button, ExercisePhoto, Modal } from './ui';

export function ExerciseDetail({ exercise, onClose, onStart }: { exercise: Exercise; onClose: () => void; onStart?: () => void }) {
  const setsLabel = exercise.sets ? `${exercise.sets} ${exercise.sets === 1 ? 'serie' : 'series'}` : 'Series según pauta';
  const approval = exercise.requiresProfessionalApproval
    ? exercise.approvalStatus === 'approved'
      ? 'Autorizado para esta pauta'
      : 'Requiere autorización antes de incorporarlo a una rutina'
    : 'Disponible sin carga externa';
  const material = exercise.equipmentLabels?.length ? exercise.equipmentLabels.join(' · ') : 'Sin material específico';
  const timer = [
    exercise.workSeconds ? `Trabajo: ${exercise.workSeconds} s` : undefined,
    exercise.restSeconds ? `Descanso automático: ${exercise.restSeconds} s` : `Descanso: ${exercise.rest}`,
  ].filter(Boolean) as string[];

  return (
    <Modal title={exercise.name} onClose={onClose}>
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <ExercisePhoto label={`Foto real de referencia: ${exercise.name}`} src={exercise.photoUrl} />
        <div className="space-y-3">
          <section className="rounded-xl bg-petrol-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-calmgreen">{exercise.category}</p>
            <h3 className="mt-1 text-xl font-bold text-petrol-700">{exercise.objective || exercise.description}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{exercise.description}</p>
          </section>
          <Info title="Estado y material" items={[approval, `Material: ${material}`, `Fase: ${exercise.phase.replace('fase-', 'Fase ')}`, `Nivel: ${exercise.difficulty}`]} />
          {exercise.benchAngle && <Info title="Banco" items={[exercise.benchAngle]} />}
          <Info title="Temporizador" items={[...timer, setsLabel, exercise.repetitions || exercise.duration || 'Según pauta']} />
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info title="Posición inicial" items={[exercise.position]} />
        <Info title="Posición final" items={[exercise.illustrationEnd]} />
        <Info title="Animación del movimiento" items={['Movimiento lento y controlado entre la posición inicial y final, sin rebotes ni compensaciones.']} />
        <Info title="Ejecución paso a paso" items={exercise.instructions} />
        <Info title="Respiración" items={[exercise.breathing]} />
        <Info title="Músculos implicados" items={exercise.muscles || inferMuscles(exercise.category)} />
        <Info title="Beneficios" items={exercise.benefits || inferBenefits(exercise.category)} />
        {exercise.supportPoints?.length ? <Info title="Puntos de apoyo" items={exercise.supportPoints} /> : null}
        {exercise.executionTip ? <Info title="Consejo de ejecución" items={[exercise.executionTip]} /> : null}
        {exercise.progressionNotes ? <Info title="Progresión" items={[exercise.progressionNotes]} /> : null}
        <Info title="Errores frecuentes" items={exercise.commonErrors} />
        <Info title="Cuándo detenerse" items={[...exercise.warnings, ...(exercise.avoidIf || [])]} />
      </div>
      <Button className="mt-5 w-full py-4 text-base uppercase" onClick={() => { onStart?.(); onClose(); }}><Play className="size-5" /> Comenzar ejercicio</Button>
    </Modal>
  );
}

function Info({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-xl bg-petrol-50 p-4">
      <h3 className="font-bold text-petrol-700">{title}</h3>
      <ul className="mt-2 space-y-1 text-sm leading-relaxed text-slate-700">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function inferMuscles(category: Exercise['category']) {
  if (category.includes('Glúteos')) return ['Glúteo mayor', 'Glúteo medio', 'Cuádriceps', 'Estabilizadores lumbares'];
  if (category.includes('Banco') || category.includes('Bandas')) return ['Piernas', 'Cintura escapular', 'Core profundo', 'Estabilizadores posturales'];
  if (category.includes('Activación')) return ['Diafragma', 'Transverso abdominal', 'Suelo pélvico', 'Multífidos'];
  if (category.includes('Movilidad')) return ['Columna lumbar en rango cómodo', 'Pelvis', 'Core profundo'];
  return ['Musculatura estabilizadora', 'Core profundo', 'Cadera'];
}

function inferBenefits(category: Exercise['category']) {
  if (category.includes('Estiramientos')) return ['Reduce tensión percibida', 'Mejora tolerancia al movimiento', 'Favorece respiración tranquila'];
  if (category.includes('Caminata')) return ['Mejora tolerancia cardiovascular', 'Favorece circulación', 'Refuerza autonomía progresiva'];
  if (category.includes('Activación')) return ['Prepara la sesión', 'Mejora control respiratorio', 'Reduce compensaciones'];
  return ['Mejora control motor', 'Aumenta tolerancia funcional', 'Favorece una progresión segura'];
}
