import { useState, type ReactNode } from 'react';
import {
  Activity,
  Check,
  Clock3,
  Footprints,
  Gauge,
  MapPin,
  Minus,
  Plus,
  Route,
} from 'lucide-react';

import {
  DEFAULT_WALKING_PLAN,
  type WalkingFeelingBefore,
  type WalkingPlan,
} from './walkingTypes';

interface WalkingSetupProps {
  initialPlan?: WalkingPlan;
  onStart: (plan: WalkingPlan) => void;
}

interface SelectionCardProps {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

interface CounterProps {
  label: string;
  value: string;
  helper: string;
  onDecrease: () => void;
  onIncrease: () => void;
}

const feelings: Array<{
  value: WalkingFeelingBefore;
  label: string;
  description: string;
}> = [
  {
    value: 'very-good',
    label: 'Muy bien',
    description: 'Me encuentro con energía y sin molestias relevantes.',
  },
  {
    value: 'good',
    label: 'Bien',
    description: 'Estoy preparado para caminar con tranquilidad.',
  },
  {
    value: 'normal',
    label: 'Normal',
    description: 'Prefiero mantener un ritmo suave y controlado.',
  },
  {
    value: 'mild-discomfort',
    label: 'Molestias leves',
    description: 'Hoy necesito reducir el esfuerzo y escuchar mi cuerpo.',
  },
  {
    value: 'difficult-day',
    label: 'Día complicado',
    description: 'Prefiero realizar una caminata breve o descansar.',
  },
];

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function WalkingSetup({
  initialPlan = DEFAULT_WALKING_PLAN,
  onStart,
}: WalkingSetupProps) {
  const [plan, setPlan] = useState<WalkingPlan>(initialPlan);

  const updatePlan = <Key extends keyof WalkingPlan>(
    key: Key,
    value: WalkingPlan[Key],
  ) => {
    setPlan((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const adjustMinutes = (amount: number) => {
    const currentMinutes = plan.targetMinutes ?? 15;

    updatePlan(
      'targetMinutes',
      clamp(currentMinutes + amount, 5, 120),
    );
  };

  const adjustDistance = (amount: number) => {
    const currentDistance = plan.targetDistanceMeters ?? 1000;

    updatePlan(
      'targetDistanceMeters',
      clamp(currentDistance + amount, 250, 20000),
    );
  };

  const adjustSpeed = (amount: number) => {
    const currentSpeed = plan.treadmillSpeedKmh ?? 3;

    updatePlan(
      'treadmillSpeedKmh',
      Number(clamp(currentSpeed + amount, 1, 8).toFixed(1)),
    );
  };

  const selectedFeeling = feelings.find(
    (feeling) => feeling.value === plan.feelingBefore,
  );

  const needsReducedGoal =
    plan.feelingBefore === 'mild-discomfort' ||
    plan.feelingBefore === 'difficult-day';

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 pb-28">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-petrol-200 bg-petrol-50 px-3 py-1.5 text-sm font-semibold text-petrol-700">
          <Footprints className="size-4" />
          Caminata terapéutica
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Prepara tu caminata
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Personaliza el objetivo según cómo te encuentres hoy. La constancia
          es más importante que la velocidad o la distancia.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          ¿Dónde vas a caminar?
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <SelectionCard
            active={plan.location === 'outdoor'}
            icon={<MapPin className="size-6" />}
            title="En el exterior"
            description="Un recorrido llano, seguro y sin prisas."
            onClick={() => updatePlan('location', 'outdoor')}
          />

          <SelectionCard
            active={plan.location === 'treadmill'}
            icon={<Gauge className="size-6" />}
            title="En cinta"
            description="Una sesión controlada dentro de casa."
            onClick={() => updatePlan('location', 'treadmill')}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Elige tu objetivo
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <GoalButton
            active={plan.goalType === 'time'}
            icon={<Clock3 className="size-5" />}
            label="Por tiempo"
            onClick={() => updatePlan('goalType', 'time')}
          />

          <GoalButton
            active={plan.goalType === 'distance'}
            icon={<Route className="size-5" />}
            label="Por distancia"
            onClick={() => updatePlan('goalType', 'distance')}
          />

          <GoalButton
            active={plan.goalType === 'free'}
            icon={<Activity className="size-5" />}
            label="Caminata libre"
            onClick={() => updatePlan('goalType', 'free')}
          />
        </div>

        {plan.goalType === 'time' && (
          <Counter
            label="Tiempo objetivo"
            value={`${plan.targetMinutes ?? 15} min`}
            helper="Puedes aumentarlo o reducirlo antes de comenzar."
            onDecrease={() => adjustMinutes(-5)}
            onIncrease={() => adjustMinutes(5)}
          />
        )}

        {plan.goalType === 'distance' && (
          <Counter
            label="Distancia objetivo"
            value={`${(
              (plan.targetDistanceMeters ?? 1000) / 1000
            ).toFixed(2)} km`}
            helper="La distancia es orientativa y puede modificarse."
            onDecrease={() => adjustDistance(-250)}
            onIncrease={() => adjustDistance(250)}
          />
        )}

        {plan.goalType === 'free' && (
          <div className="mt-5 rounded-2xl border border-petrol-100 bg-petrol-50 p-4">
            <p className="font-semibold text-petrol-800">
              Camina sin un objetivo cerrado
            </p>

            <p className="mt-1 text-sm leading-relaxed text-petrol-700">
              Finaliza cuando consideres que has completado una caminata cómoda
              y segura.
            </p>
          </div>
        )}
      </div>

      {plan.location === 'treadmill' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-slate-900">
            Configuración de la cinta
          </h2>

          <Counter
            label="Velocidad inicial"
            value={`${(plan.treadmillSpeedKmh ?? 3).toFixed(1)} km/h`}
            helper="Empieza siempre a una velocidad cómoda."
            onDecrease={() => adjustSpeed(-0.5)}
            onIncrease={() => adjustSpeed(0.5)}
          />

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-950">
              Inclinación recomendada: 0 %
            </p>

            <p className="mt-1 text-sm leading-relaxed text-amber-900">
              No aumentes la inclinación salvo indicación de tu médico o
              fisioterapeuta.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold text-slate-900">
          ¿Cómo te encuentras hoy?
        </h2>

        <div className="mt-4 grid gap-3">
          {feelings.map((feeling) => {
            const active = plan.feelingBefore === feeling.value;

            return (
              <button
                key={feeling.value}
                type="button"
                onClick={() =>
                  updatePlan('feelingBefore', feeling.value)
                }
                className={[
                  'flex min-h-16 w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition',
                  active
                    ? 'border-petrol-500 bg-petrol-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-petrol-300 hover:bg-slate-50',
                ].join(' ')}
              >
                <span
                  className={[
                    'grid size-9 shrink-0 place-items-center rounded-full border',
                    active
                      ? 'border-petrol-500 bg-petrol-500 text-white'
                      : 'border-slate-300 bg-white text-transparent',
                  ].join(' ')}
                >
                  <Check className="size-5" />
                </span>

                <span>
                  <span className="block font-bold text-slate-900">
                    {feeling.label}
                  </span>

                  <span className="mt-0.5 block text-sm leading-relaxed text-slate-600">
                    {feeling.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {needsReducedGoal && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-bold text-amber-950">
            Hoy puede ser conveniente reducir el objetivo
          </p>

          <p className="mt-1 text-sm leading-relaxed text-amber-900">
            Realiza una caminata más corta, mantén un ritmo muy suave o
            descansa. Detén la actividad si aumentan claramente las molestias.
          </p>
        </div>
      )}

      <div className="sticky bottom-4 z-10 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-slate-700">
            {plan.location === 'outdoor' ? 'Exterior' : 'Cinta'}
          </span>

          <span className="text-slate-500">
            Estado: {selectedFeeling?.label ?? 'Normal'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onStart(plan)}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-petrol-600 px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-petrol-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-petrol-500"
        >
          <Footprints className="size-5" />
          Comenzar caminata
        </button>
      </div>
    </section>
  );
}

function SelectionCard({
  active,
  icon,
  title,
  description,
  onClick,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition',
        active
          ? 'border-petrol-500 bg-petrol-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-petrol-300 hover:bg-slate-50',
      ].join(' ')}
    >
      <span
        className={[
          'grid size-12 shrink-0 place-items-center rounded-2xl',
          active
            ? 'bg-petrol-500 text-white'
            : 'bg-slate-100 text-slate-600',
        ].join(' ')}
      >
        {icon}
      </span>

      <span>
        <span className="block font-bold text-slate-900">{title}</span>

        <span className="mt-1 block text-sm leading-relaxed text-slate-600">
          {description}
        </span>
      </span>
    </button>
  );
}

function GoalButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-semibold transition',
        active
          ? 'border-petrol-500 bg-petrol-500 text-white'
          : 'border-slate-200 bg-white text-slate-700 hover:border-petrol-300',
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  );
}

function Counter({
  label,
  value,
  helper,
  onDecrease,
  onIncrease,
}: CounterProps) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-700">{label}</p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDecrease}
          aria-label={`Reducir ${label.toLowerCase()}`}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-petrol-400 hover:text-petrol-700"
        >
          <Minus className="size-5" />
        </button>

        <strong className="text-center text-3xl font-bold text-slate-900">
          {value}
        </strong>

        <button
          type="button"
          onClick={onIncrease}
          aria-label={`Aumentar ${label.toLowerCase()}`}
          className="grid size-12 shrink-0 place-items-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-petrol-400 hover:text-petrol-700"
        >
          <Plus className="size-5" />
        </button>
      </div>

      <p className="mt-3 text-center text-sm text-slate-500">
        {helper}
      </p>
    </div>
  );
}