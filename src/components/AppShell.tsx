import type { ReactNode } from 'react';
import { BottomNavigation, type PageId } from './BottomNavigation';
import { Header } from './Header';
import type { AppState } from '../types';

export function AppShell({
  children,
  page,
  setPage,
  theme,
  onThemeChange,
  className,
}: {
  children: ReactNode;
  page: PageId;
  setPage: (page: PageId) => void;
  theme: AppState['preferences']['theme'];
  onThemeChange: (theme: AppState['preferences']['theme']) => void;
  className: string;
}) {
  return (
    <div className={`app-surface min-h-screen ${className}`}>
      <div className="safe-area-shell mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-6 pb-36 lg:px-6 lg:pb-10">
        <main className="w-full min-w-0 flex-1">
          <Header theme={theme} onThemeChange={onThemeChange} />
          {children}
        </main>
        <BottomNavigation page={page} setPage={setPage} theme={theme} onThemeChange={onThemeChange} />
      </div>
    </div>
  );
}
