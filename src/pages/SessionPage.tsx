import { Layers3, ListChecks, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { ExercisesPage } from './ExercisesPage';
import { RoutinePage } from './RoutinePage';
import { TrainingCenterPage } from './TrainingCenterPage';
import type { AppState } from '../types';
import { ResponsibilityNotice } from '../components/ui';

type SessionView = 'daily' | 'library' | 'center';

export function SessionPage({
  state,
  setState,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}) {
  const [view, setView] = useState<SessionView>('daily');

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 rounded-2xl border border-petrol-100/80 bg-white/78 p-1.5 shadow-soft backdrop-blur">
        <SessionTab current={view} value="daily" onClick={setView} icon={ListChecks} label="Sesión diaria" />
        <SessionTab current={view} value="library" onClick={setView} icon={Sparkles} label="Biblioteca" />
        <SessionTab current={view} value="center" onClick={setView} icon={Layers3} label="Centro" />
      </div>

      <ResponsibilityNotice withEscalation />

      {view === 'daily' && <RoutinePage state={state} setState={setState} />}
      {view === 'library' && <ExercisesPage state={state} setState={setState} />}
      {view === 'center' && <TrainingCenterPage state={state} setState={setState} />}
    </div>
  );
}

function SessionTab({
  current,
  value,
  onClick,
  icon: Icon,
  label,
}: {
  current: SessionView;
  value: SessionView;
  onClick: (view: SessionView) => void;
  icon: typeof Sparkles;
  label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      className={`min-h-11 rounded-xl px-4 text-sm font-semibold transition ${active ? 'bg-petrol-500 text-white shadow-sm' : 'text-petrol-700 hover:bg-petrol-50'}`}
      onClick={() => onClick(value)}
      aria-pressed={active}
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="size-4" />
        {label}
      </span>
    </button>
  );
}
