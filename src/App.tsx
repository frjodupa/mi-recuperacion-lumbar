import type { PageId } from './components/BottomNavigation';
import { AppShell } from './components/AppShell';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { RoutinePage } from './pages/RoutinePage';
import { ExercisesPage } from './pages/ExercisesPage';
import { ProgressPage } from './pages/ProgressPage';
import { MedicalHistoryPage } from './pages/MedicalHistoryPage';
import { InfoPage } from './pages/InfoPage';
import { usePersistentState } from './hooks/usePersistentState';
import { useMemo, useState } from 'react';
import type { AppState, PatientProfile } from './types';

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
  const setTheme = (theme: AppState['preferences']['theme']) => {
    setState((current) => ({ ...current, preferences: { ...current.preferences, theme } }));
  };

  const finishOnboarding = (patientProfile: PatientProfile) => {
    setState((current) => ({
      ...current,
      patientProfile,
      preferences: {
        ...current.preferences,
        onboarded: true,
        acceptedMedicalNotice: true,
        patientName: patientProfile.name,
        surgeryDate: patientProfile.surgeryDate || current.preferences.surgeryDate,
      },
    }));
  };

  if (!state.preferences.onboarded) {
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return (
    <AppShell page={page} setPage={setPage} theme={state.preferences.theme} onThemeChange={setTheme} className={pageClass}>
      {page === 'home' && <Home state={state} setState={setState} setPage={setPage} />}
      {page === 'routine' && <RoutinePage state={state} setState={setState} />}
      {page === 'exercises' && <ExercisesPage state={state} setState={setState} />}
      {page === 'progress' && <ProgressPage state={state} />}
      {page === 'history' && <MedicalHistoryPage state={state} />}
      {page === 'info' && <InfoPage state={state} setState={setState} />}
    </AppShell>
  );
}
