import { BarChart3, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { MedicalHistoryPage } from './MedicalHistoryPage';
import { ProgressPage } from './ProgressPage';
import type { AppState } from '../types';

type ProgressView = 'summary' | 'history';

export function ProgressHubPage({ state }: { state: AppState }) {
  const [view, setView] = useState<ProgressView>('summary');

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 rounded-2xl border border-petrol-100/80 bg-white/78 p-1.5 shadow-soft backdrop-blur">
        <ProgressTab current={view} value="summary" onClick={setView} icon={BarChart3} label="Resumen" />
        <ProgressTab current={view} value="history" onClick={setView} icon={ClipboardList} label="Historial" />
      </div>

      {view === 'summary' && <ProgressPage state={state} />}
      {view === 'history' && <MedicalHistoryPage state={state} />}
    </div>
  );
}

function ProgressTab({
  current,
  value,
  onClick,
  icon: Icon,
  label,
}: {
  current: ProgressView;
  value: ProgressView;
  onClick: (view: ProgressView) => void;
  icon: typeof BarChart3;
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
