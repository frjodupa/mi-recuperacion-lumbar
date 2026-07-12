import type { HTMLAttributes, ReactNode } from 'react';
import { AlertTriangle, Check, Monitor, Moon, Sun, X } from 'lucide-react';
import { safetyNotice } from '../data/initialData';
import type { UserPreferences } from '../types';

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return <section className={`print-card animate-soft glass-card premium-card-enter rounded-[28px] border p-6 hover:-translate-y-0.5 ${className}`} {...props}>{children}</section>;
}

export function Button({ children, variant = 'primary', className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const variants = {
    primary: 'bg-app-primary text-white shadow-[0_10px_28px_rgba(15,92,99,0.18)] hover:bg-app-primaryDark hover:shadow-[0_14px_36px_rgba(15,92,99,0.24)] active:scale-[0.98]',
    secondary: 'bg-app-secondary/14 text-app-primaryDark ring-1 ring-app-secondary/20 hover:bg-app-secondary/22 active:scale-[0.98]',
    ghost: 'bg-white/60 text-app-primaryDark border border-app-border hover:bg-app-primaryLight active:scale-[0.98]',
    danger: 'bg-white/85 text-app-danger border border-red-100 hover:bg-red-50 active:scale-[0.98]',
  };
  return <button className={`ui-button ui-button-${variant} animate-soft inline-flex items-center justify-center gap-2 rounded-[18px] px-4 py-2.5 font-semibold tracking-[-0.01em] transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>{children}</button>;
}

export function ThemeSelector({ value, onChange }: { value: UserPreferences['theme']; onChange: (theme: UserPreferences['theme']) => void }) {
  const options: { value: UserPreferences['theme']; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 rounded-2xl border border-petrol-100/70 bg-white/70 p-1 shadow-card backdrop-blur-xl" role="group" aria-label="Modo visual">
      {options.map(({ value: option, label, icon: Icon }) => (
        <button
          key={option}
          type="button"
          className={`animate-soft inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition ${value === option ? 'bg-petrol-500 text-white shadow-sm' : 'text-petrol-700 hover:bg-petrol-50'}`}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
        >
          <Icon className="size-4" aria-hidden />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export function SafetyNotice() {
  return (
    <div className="rounded-[24px] border border-amber-200/80 bg-amber-50/80 p-4 text-amber-900 shadow-sm backdrop-blur">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
        <p className="m-0 text-sm font-semibold leading-relaxed">{safetyNotice}</p>
      </div>
    </div>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-petrol-700/40 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-[30px] border border-app-border bg-app-surface/95 p-6 shadow-2xl backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-app-primaryDark">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Cerrar"><X className="size-5" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, body, onConfirm, onCancel }: { title: string; body: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mb-5 leading-relaxed text-slate-700">{body}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onConfirm}><Check className="size-5" /> Confirmar</Button>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </Modal>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="rounded-[26px] border border-dashed border-petrol-100 bg-white/48 p-8 text-center"><p className="font-bold text-petrol-700">{title}</p><p className="mt-1 text-sm text-slate-600">{body}</p></div>;
}

export function PainScale({ value, onChange, label = 'Dolor' }: { value: number; onChange: (value: number) => void; label?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-app-primaryDark">{label}</span>
        <span className="rounded-full border border-petrol-100 bg-white/70 px-3 py-1 font-bold text-petrol-700 shadow-sm">{value}/10</span>
      </div>
      <input aria-label={`${label} de 0 a 10`} className="w-full" type="range" min="0" max="10" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="mt-1 flex justify-between text-xs text-slate-500"><span>0</span><span>10</span></div>
    </div>
  );
}

export function ProgressRing({ percent }: { percent: number }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="premium-ring grid size-32 shrink-0 place-items-center rounded-full shadow-soft" style={{ background: `conic-gradient(#2f8f69 ${clamped}%, var(--ring-track) 0)` }} aria-label={`${clamped}% completado`}>
      <div className="grid size-24 place-items-center rounded-full border border-app-border bg-app-surface/95 text-2xl font-bold tracking-[-0.03em] text-app-primaryDark shadow-inner">{clamped}%</div>
    </div>
  );
}

export function ExercisePhoto({ label, src }: { label: string; src?: string }) {
  if (src) {
    return (
      <figure className="overflow-hidden rounded-xl border border-petrol-100 bg-petrol-50">
        <img className="aspect-[4/3] w-full bg-petrol-50 object-cover" src={src} alt={label} loading="lazy" />
        <figcaption className="px-3 py-2 text-center text-xs font-semibold text-app-primaryDark">{label}</figcaption>
      </figure>
    );
  }

  return (
    <div className="rounded-xl border border-petrol-100 bg-petrol-50 p-3">
      <svg viewBox="0 0 220 130" className="h-28 w-full" role="img" aria-label={label}>
        <rect x="20" y="95" width="180" height="10" rx="5" fill="#caebec" />
        <circle cx="65" cy="48" r="16" fill="#0f5c63" />
        <path d="M80 58 C105 65 122 75 152 70" fill="none" stroke="#0f5c63" strokeWidth="12" strokeLinecap="round" />
        <path d="M118 74 L98 95 M138 72 L164 94" stroke="#2bbdc1" strokeWidth="11" strokeLinecap="round" />
        <path d="M92 66 L70 88" stroke="#2bbdc1" strokeWidth="10" strokeLinecap="round" />
      </svg>
      <p className="mt-2 text-center text-xs font-semibold text-petrol-700">{label}</p>
    </div>
  );
}
