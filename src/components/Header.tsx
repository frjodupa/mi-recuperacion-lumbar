import { ShieldCheck } from 'lucide-react';
import { InstallPWAButton } from './InstallPWAButton';

export function Header() {
  return (
    <header className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-aqua">Mi Recuperación Lumbar</p>
        <h1 className="text-[28px] font-bold leading-tight text-petrol-700 sm:text-[32px]">Panel de recuperación</h1>
      </div>
      <div className="flex gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-app-border bg-white px-3 py-2 text-sm font-semibold text-petrol-700 shadow-card sm:flex">
          <ShieldCheck className="size-5 text-calmgreen" /> Datos locales
        </div>
        <InstallPWAButton />
      </div>
    </header>
  );
}
