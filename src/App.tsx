import { BottomNavigation, type PageId } from './components/BottomNavigation';
import { Header } from './components/Header';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { RoutinePage } from './pages/RoutinePage';
import { ExercisesPage } from './pages/ExercisesPage';
import { ProgressPage } from './pages/ProgressPage';
import { MedicalHistoryPage } from './pages/MedicalHistoryPage';
import { InfoPage } from './pages/InfoPage';
import { usePersistentState } from './hooks/usePersistentState';
import { useMemo, useState } from 'react';

export default function App() {
  const [state, setState] = usePersistentState();
  const [page, setPage] = useState<PageId>(() => {
    const screen = new URLSearchParams(window.location.search).get('screen');
    return screen === 'routine' || screen === 'exercises' || screen === 'progress' || screen === 'history' || screen === 'info' ? screen : 'home';
  });
  const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  const darkMode = state.preferences.theme === 'dark' || (state.preferences.theme === 'system' && prefersDark);
  const pageClass = useMemo(() => [
    darkMode ? 'theme-dark' : 'theme-light',
    state.preferences.textSize === 'large' ? 'text-large' : '',
    state.preferences.textSize === 'xlarge' ? 'text-xlarge' : '',
    state.preferences.highContrast ? 'high-contrast' : '',
  ].filter(Boolean).join(' '), [darkMode, state.preferences.highContrast, state.preferences.textSize]);

  if (!state.preferences.onboarded) {
    return <Onboarding onFinish={() => setState((current) => ({ ...current, preferences: { ...current.preferences, onboarded: true, acceptedMedicalNotice: true } }))} />;
  }

  return (
    <div className={`app-surface min-h-screen ${pageClass}`}>
      <div className="safe-area-shell mx-auto flex w-full max-w-[1500px] gap-6 px-4 py-6 pb-36 lg:px-6 lg:pb-10">
        <main className="w-full min-w-0 flex-1">
          <Header />
          {page === 'home' && <Home state={state} setState={setState} setPage={setPage} />}
          {page === 'routine' && <RoutinePage state={state} setState={setState} />}
          {page === 'exercises' && <ExercisesPage state={state} setState={setState} />}
          {page === 'progress' && <ProgressPage state={state} />}
          {page === 'history' && <MedicalHistoryPage state={state} />}
          {page === 'info' && <InfoPage state={state} setState={setState} />}
        </main>
        <BottomNavigation page={page} setPage={setPage} />
      </div>
    </div>
  );
}
