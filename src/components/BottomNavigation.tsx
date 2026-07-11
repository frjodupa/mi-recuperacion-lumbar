import { Activity, BookOpen, ClipboardList, HeartPulse, Home, Info, ListChecks } from 'lucide-react';

const items = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'routine', label: 'Rutina', icon: ListChecks },
  { id: 'exercises', label: 'Biblioteca', icon: Activity },
  { id: 'progress', label: 'Progreso', icon: BookOpen },
  { id: 'history', label: 'Historial', icon: ClipboardList },
  { id: 'info', label: 'Info', icon: Info },
] as const;

export type PageId = typeof items[number]['id'];

export function BottomNavigation({ page, setPage }: { page: PageId; setPage: (page: PageId) => void }) {
  return (
    <>
      <nav className="no-print fixed inset-x-0 bottom-0 z-[1000] border-t border-petrol-100 bg-white/80 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_50px_rgba(15,92,99,0.08)] backdrop-blur-2xl lg:hidden" aria-label="Navegación principal">
        <div className="mx-auto grid max-w-xl grid-cols-6 gap-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`animate-soft flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-semibold transition active:scale-[0.96] ${page === id ? 'bg-petrol-50 text-petrol-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`} aria-current={page === id ? 'page' : undefined}>
              <Icon className="size-5" aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </nav>
      <aside className="no-print order-first hidden w-64 shrink-0 lg:block">
        <div className="sticky top-5 rounded-[24px] border border-app-border bg-white/80 p-3 shadow-card backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-petrol-50 p-3">
            <div className="grid size-11 place-items-center rounded-xl bg-petrol-500 text-white shadow-sm">
              <HeartPulse className="size-6" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-petrol-700">Mi Recuperación</p>
              <p className="text-xs font-semibold text-slate-500">Lumbar</p>
            </div>
          </div>
          <div className="space-y-1.5">
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setPage(id)} className={`animate-soft relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-semibold transition ${page === id ? 'bg-petrol-500 text-white shadow-sm' : 'text-petrol-700 hover:bg-petrol-50'}`} aria-current={page === id ? 'page' : undefined}>
              <span className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full ${page === id ? 'bg-aqua' : 'bg-transparent'}`} />
              <Icon className="ml-1 size-5" aria-hidden />
              {label}
            </button>
          ))}
          </div>
        </div>
      </aside>
    </>
  );
}
