import { ShieldCheck } from 'lucide-react';
import { InstallPWAButton } from './InstallPWAButton';
import { ThemeSelector } from './ui';
import type { AppState } from '../types';

export function Header({ theme, onThemeChange }: { theme: AppState['preferences']['theme']; onThemeChange: (theme: AppState['preferences']['theme']) => void }) {
  return (
    <header className="no-print mb-6 flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/70 px-4 py-4 shadow-card backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Mi Recuperación Lumbar</p>
        <h1 className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.03em] text-[var(--color-title)] sm:text-[28px]">Hoy</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ThemeSelector value={theme} onChange={onThemeChange} />
        <div className="hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/72 px-3.5 py-2 text-sm font-semibold text-petrol-700 shadow-sm backdrop-blur-xl sm:flex">
          <ShieldCheck className="size-4.5 text-calmgreen" /> Datos locales
        </div>
        <InstallPWAButton />
      </div>
    </header>
  );
}
