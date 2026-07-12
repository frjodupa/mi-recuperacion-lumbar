import { ShieldCheck } from 'lucide-react';
import { InstallPWAButton } from './InstallPWAButton';
import { ThemeSelector } from './ui';
import type { AppState } from '../types';

export function Header({ theme, onThemeChange }: { theme: AppState['preferences']['theme']; onThemeChange: (theme: AppState['preferences']['theme']) => void }) {
  return (
    <header className="no-print mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-aqua">Mi Recuperación Lumbar</p>
        <h1 className="mt-1 text-[30px] font-bold leading-tight tracking-[-0.04em] text-petrol-700 sm:text-[36px]">Panel de recuperación</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ThemeSelector value={theme} onChange={onThemeChange} />
        <div className="hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/72 px-4 py-2.5 text-sm font-semibold text-petrol-700 shadow-card backdrop-blur-xl sm:flex">
          <ShieldCheck className="size-5 text-calmgreen" /> Datos locales
        </div>
        <InstallPWAButton />
      </div>
    </header>
  );
}
