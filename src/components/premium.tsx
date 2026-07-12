import type { ReactNode } from 'react';
import { Button, Card } from './ui';

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <Card className="border-dashed p-6 text-center">
      <p className="font-bold text-petrol-700">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

export function LoadingScreen() {
  return (
    <div className="app-loading-screen" role="status" aria-live="polite">
      <div className="app-loading-mark" aria-hidden="true" />
      <p>Preparando tu recuperación...</p>
    </div>
  );
}

export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / Math.max(1, total)) * 100);
  return (
    <div className="space-y-2" aria-label={`Paso ${current} de ${total}`}>
      <div className="h-2 overflow-hidden rounded-full bg-petrol-100">
        <div className="h-full rounded-full bg-petrol-500 transition-all duration-300 ease-out" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Paso {current} de {total}</p>
    </div>
  );
}

export function AccessibleDialog({ title, body, onClose }: { title: string; body: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[1100] grid place-items-center bg-petrol-900/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="accessible-dialog-title">
      <Card className="w-full max-w-md">
        <h2 id="accessible-dialog-title" className="text-xl font-bold text-petrol-700">{title}</h2>
        <p className="mt-2 leading-relaxed text-slate-600">{body}</p>
        <Button className="mt-5 w-full" onClick={onClose}>Cerrar</Button>
      </Card>
    </div>
  );
}
