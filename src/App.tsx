import type { PageId } from './components/BottomNavigation';
import { AppShell } from './components/AppShell';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { SessionPage } from './pages/SessionPage';
import { ProgressHubPage } from './pages/ProgressHubPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { LegalNoticePage } from './pages/LegalNoticePage';
import { SecurityPrivacyPage } from './pages/SecurityPrivacyPage';
import { usePersistentState } from './hooks/usePersistentState';
import { useMemo, useState } from 'react';
import type { AppState, PatientProfile } from './types';
import { WalkingSetup } from './features/walking/WalkingSetup';
import { Modal, Button } from './components/ui';

const VALID_PAGES: ReadonlySet<PageId> = new Set([
  'home',
  'routine',
  'progress',
  'profile',
  'about',
  'walking',
  'privacy-policy',
  'legal-notice',
  'security-privacy',
]);

function isPageId(value: string): value is PageId {
  return VALID_PAGES.has(value as PageId);
}

export default function App() {
  const [state, setState] = usePersistentState();
  const [showPrivacyFirstOpen, setShowPrivacyFirstOpen] = useState(() => !window.localStorage.getItem('privacy-notice-seen-v1'));
  const [page, setPage] = useState<PageId>(() => {
    const screen = new URLSearchParams(window.location.search).get('screen');
    if (!screen) return 'home';
    const normalized = normalizeLegacyPage(screen);
    return isPageId(normalized) ? normalized : 'home';
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
  const pageTitle = getPageTitle(page);

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
    <>
      <AppShell
        page={page}
        setPage={setPage}
        theme={state.preferences.theme}
        onThemeChange={setTheme}
        className={pageClass}
        title={pageTitle}
      >
        {page === 'home' && (
          <Home state={state} setState={setState} setPage={setPage} />
        )}

        {page === 'routine' && (
          <SessionPage state={state} setState={setState} />
        )}

        {page === 'progress' && (
          <ProgressHubPage state={state} />
        )}

        {page === 'profile' && (
          <ProfilePage
            state={state}
            setState={setState}
            setPage={setPage}
          />
        )}

        {page === 'about' && (
          <AboutPage setPage={setPage} />
        )}

        {page === 'walking' && (
          <WalkingSetup
            onStart={(_plan) => {
              setPage('routine');
            }}
          />
        )}

        {page === 'privacy-policy' && (
          <PrivacyPolicyPage setPage={setPage} />
        )}

        {page === 'legal-notice' && (
          <LegalNoticePage setPage={setPage} />
        )}

        {page === 'security-privacy' && (
          <SecurityPrivacyPage setPage={setPage} />
        )}
      </AppShell>

      {showPrivacyFirstOpen && (
        <Modal title="Privacidad y datos locales" onClose={() => {
          window.localStorage.setItem('privacy-notice-seen-v1', '1');
          setShowPrivacyFirstOpen(false);
        }}>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Tus datos se almacenan localmente en este dispositivo. Esta aplicación no envía información automáticamente a servidores externos.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Puedes consultar más detalle en la Política de Privacidad y en el Aviso Legal.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="secondary" onClick={() => setPage('privacy-policy')}>Política de Privacidad</Button>
            <Button variant="secondary" onClick={() => setPage('legal-notice')}>Aviso Legal</Button>
            <Button onClick={() => {
              window.localStorage.setItem('privacy-notice-seen-v1', '1');
              setShowPrivacyFirstOpen(false);
            }}>Entendido</Button>
          </div>
        </Modal>
      )}
    </>
  );
}

function normalizeLegacyPage(page: string): string {
  if (page === 'exercises' || page === 'training') return 'routine';
  if (page === 'history') return 'progress';
  if (page === 'info') return 'profile';
  return page;
}

function getPageTitle(page: PageId) {
  if (page === 'routine') return 'Mi sesión';
  if (page === 'progress') return 'Progreso';
  if (page === 'profile') return 'Mi perfil';
  if (page === 'about') return 'Acerca de';
  if (page === 'walking') return 'Caminata';
  if (page === 'privacy-policy') return 'Política de Privacidad';
  if (page === 'legal-notice') return 'Aviso Legal';
  if (page === 'security-privacy') return 'Seguridad y Privacidad';
  return 'Hoy';
}