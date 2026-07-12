import { Activity, BarChart3, ClipboardList, Home, ListChecks, Settings } from 'lucide-react';
import { ThemeSelector } from './ui';
import type { AppState } from '../types';

const items = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'routine', label: 'Mi plan', icon: ListChecks },
  { id: 'history', label: 'Seguimiento', icon: ClipboardList },
  { id: 'progress', label: 'Evolución', icon: BarChart3 },
  { id: 'info', label: 'Perfil', icon: Settings },
  { id: 'exercises', label: 'Ejercicios', icon: Activity },
] as const;
const mobileItems = items.filter((item) => item.id !== 'exercises');

export type PageId = typeof items[number]['id'];

export function BottomNavigation({ page, setPage, theme, onThemeChange }: { page: PageId; setPage: (page: PageId) => void; theme: AppState['preferences']['theme']; onThemeChange: (theme: AppState['preferences']['theme']) => void }) {
  return (
    <>
      <nav className="no-print fixed inset-x-0 bottom-0 z-[1000] border-t border-white/70 bg-white/78 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_50px_rgba(15,92,99,0.08)] backdrop-blur-2xl lg:hidden" aria-label="Navegación principal">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 rounded-[24px] border border-petrol-100/70 bg-white/50 p-1">
          {mobileItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`app-nav-button animate-soft flex min-h-14 flex-col items-center justify-center rounded-[20px] text-xs font-semibold transition active:scale-[0.96] ${page === id ? 'bg-petrol-500 text-white shadow-[0_10px_26px_rgba(15,92,99,0.18)]' : 'text-slate-500 hover:bg-white/80 hover:text-petrol-700'}`} aria-current={page === id ? 'page' : undefined}>
              <Icon className="size-5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </nav>
      <aside className="no-print order-first hidden w-64 shrink-0 lg:block">
        <div className="sticky top-5 rounded-[34px] border border-white/70 bg-white/72 p-4 shadow-card backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-3 rounded-[26px] border border-petrol-100/70 bg-gradient-to-br from-petrol-50/90 to-white/70 p-3 shadow-soft">
            <div className="grid size-14 place-items-center rounded-[22px] bg-petrol-500 text-white shadow-[0_14px_34px_rgba(15,92,99,0.24)]">
              <SpineMark className="size-8" />
            </div>
            <div>
              <p className="text-base font-bold leading-tight tracking-[-0.02em] text-petrol-700">Mi Recuperación</p>
              <p className="text-sm font-semibold text-slate-500">Lumbar</p>
            </div>
          </div>
          <div className="space-y-2">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`app-nav-button animate-soft relative flex w-full items-center gap-3 rounded-[22px] px-3 py-3.5 text-left font-semibold transition ${page === id ? 'bg-petrol-500 text-white shadow-[0_14px_32px_rgba(15,92,99,0.22)]' : 'text-petrol-700 hover:bg-petrol-50/80 hover:pl-4'}`} aria-current={page === id ? 'page' : undefined}>
              <span className={`grid size-10 place-items-center rounded-2xl ${page === id ? 'bg-white/16 text-white' : 'bg-white/70 text-petrol-700 shadow-sm'}`}><Icon className="size-5" aria-hidden /></span>
              {label}
            </button>
          ))}
          </div>
          <div className="mt-5 border-t border-petrol-100/70 pt-4">
            <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Modo visual</p>
            <ThemeSelector value={theme} onChange={onThemeChange} />
          </div>
        </div>
      </aside>
    </>
  );
}

function SpineMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Columna vertebral">
      <path d="M24 7c-4.9 0-8.9 4-8.9 8.9 0 3.1 1.6 5.8 4 7.4-2.4 1.6-4 4.3-4 7.4 0 4.9 4 8.9 8.9 8.9s8.9-4 8.9-8.9c0-3.1-1.6-5.8-4-7.4 2.4-1.6 4-4.3 4-7.4C32.9 11 28.9 7 24 7Z" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" opacity=".95" />
      <path d="M24 10.4v26.8M19.4 16.2h9.2M19.4 23.5h9.2M19.4 30.8h9.2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M13.5 18.2c-3.5.7-6 2.6-6 5.1 0 3.7 5.9 6 13.2 5.3M34.5 18.2c3.5.7 6 2.6 6 5.1 0 3.7-5.9 6-13.2 5.3" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" opacity=".9" />
    </svg>
  );
}
