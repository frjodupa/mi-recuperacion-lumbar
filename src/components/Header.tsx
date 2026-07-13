import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { InstallPWAButton } from './InstallPWAButton';
import { ThemeSelector } from './ui';
import type { AppState } from '../types';

export function Header({
  theme,
  onThemeChange,
  title,
}: {
  theme: AppState['preferences']['theme'];
  onThemeChange: (theme: AppState['preferences']['theme']) => void;
  title: string;
}) {
  const [showLocalInfo, setShowLocalInfo] = useState(false);
  const isProfileHeader = title === 'Mi perfil';

  return (
    <header className="no-print mb-6 flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/70 px-4 py-4 shadow-card backdrop-blur-xl sm:flex-row sm:items-start sm:justify-between sm:px-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-aqua">Mi Recuperación Lumbar</p>
        <h1 className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.03em] text-[var(--color-title)] sm:text-[28px]">{title}</h1>
      </div>
      <div className={`flex w-full flex-col gap-2 sm:w-auto ${isProfileHeader ? 'items-end' : 'items-start sm:items-end'}`}>
        <ThemeSelector value={theme} onChange={onThemeChange} />
        <div
          className="relative w-full sm:w-auto"
          onMouseEnter={() => setShowLocalInfo(true)}
          onMouseLeave={() => setShowLocalInfo(false)}
        >
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-petrol-700"
            aria-label="Estado de almacenamiento local"
            aria-expanded={showLocalInfo}
            aria-controls="local-storage-info"
            onClick={() => setShowLocalInfo((current) => !current)}
          >
            <ShieldCheck className="size-4.5 text-calmgreen" />
            <span className="text-slate-600">Estado:</span>
            <span>Datos locales</span>
          </button>
          {showLocalInfo && (
            <div id="local-storage-info" className="relative z-[1200] mt-2 w-full rounded-2xl border border-petrol-100 bg-white p-4 text-left shadow-card sm:w-[min(92vw,420px)]">
              <p className="text-sm font-semibold text-[var(--color-title)]">Almacenamiento local</p>
              <ul className="mt-2 space-y-2 pl-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                <li>Actualmente la información se guarda únicamente en este dispositivo.</li>
                <li>Los datos no se envían automáticamente a servidores externos.</li>
                <li>Nadie puede acceder a ellos salvo el propio usuario.</li>
                <li>En futuras versiones podrá activarse, de forma opcional, una copia de seguridad cifrada y sincronización entre dispositivos.</li>
                <li>Puedes eliminar tus datos cuando lo desees desde la aplicación.</li>
                <li>Esta aplicación no realiza diagnósticos ni sustituye el criterio de un profesional sanitario.</li>
              </ul>
            </div>
          )}
        </div>
        <InstallPWAButton />
      </div>
    </header>
  );
}
