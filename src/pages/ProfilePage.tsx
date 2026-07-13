import type { PageId } from '../components/BottomNavigation';
import type { AppState } from '../types';
import { InfoPage } from './InfoPage';

export function ProfilePage({
  state,
  setState,
  setPage,
}: {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  setPage: (page: PageId) => void;
}) {
  return <InfoPage state={state} setState={setState} setPage={setPage} />;
}
