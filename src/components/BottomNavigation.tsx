import { Activity, BookOpen, ClipboardList, HeartPulse, Home, Info, ListChecks } from 'lucide-react';
import { ThemeSelector } from './ui';
import type { AppState } from '../types';

const items = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'routine', label: 'Rutina', icon: ListChecks },
  { id: 'exercises', label: 'Biblioteca', icon: Activity },
  { id: 'progress', label: 'Progreso', icon: BookOpen },
  { id: 'history', label: 'Historial', icon: ClipboardList },
  { id: 'info', label: 'Info', icon: Info },
] as const;

export type PageId = typeof items[number]['id'];

export function BottomNavigation({ page, setPage, theme, onThemeChange }: { page: PageId; setPage: (page: PageId) => void; theme: AppState['preferences']['theme']; onThemeChange: (theme: AppState['preferences']['theme']) => void }) {
  return (
    <>
      <nav className="mobile-nav no-print fixed inset-x-0 bottom-0 z-[1000] px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 lg:hidden" aria-label="Navegación principal">
        <div className="mobile-nav-inner mx-auto grid max-w-xl grid-cols-6 gap-1 rounded-[24px] border p-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`animate-soft flex min-h-14 flex-col items-center justify-center rounded-[20px] text-xs font-semibold transition active:scale-[0.96] ${page === id ? 'bg-petrol-500 text-white shadow-[0_10px_26px_rgba(15,92,99,0.18)]' : 'text-slate-500 hover:bg-white/80 hover:text-petrol-700'}`} aria-current={page === id ? 'page' : undefined}>
              <Icon className="size-5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </nav>
      <aside className="no-print order-first hidden w-64 shrink-0 lg:block">
        <div className="sidebar-shell sticky top-5 rounded-[30px] border p-3 shadow-card backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-3 rounded-[24px] border border-app-border bg-app-primaryLight/80 p-3">
            <div className="grid size-12 place-items-center rounded-[20px] bg-petrol-500 text-white shadow-[0_12px_30px_rgba(15,92,99,0.22)]">
              <HeartPulse className="size-6" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight tracking-[-0.01em] text-petrol-700">Mi Recuperación</p>
              <p className="text-xs font-semibold text-slate-500">Lumbar</p>
            </div>
          </div>
          <div className="space-y-1.5">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`animate-soft relative flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-left font-semibold transition ${page === id ? 'bg-petrol-500 text-white shadow-[0_12px_30px_rgba(15,92,99,0.18)]' : 'text-petrol-700 hover:bg-petrol-50/80 hover:pl-4'}`} aria-current={page === id ? 'page' : undefined}>
              <span className={`grid size-9 place-items-center rounded-2xl ${page === id ? 'bg-white/16 text-white' : 'bg-white/60 text-petrol-700'}`}><Icon className="size-5" aria-hidden /></span>
              {label}
            </button>
          ))}
          </div>
          <div className="mt-5 border-t border-app-border pt-4">
            <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-slate-500">Modo visual</p>
            <ThemeSelector value={theme} onChange={onThemeChange} />
          </div>
        </div>
      </aside>
    </>
  );
}
