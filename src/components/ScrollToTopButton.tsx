import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [hasScrollableArea, setHasScrollableArea] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + 1;
      setHasScrollableArea(scrollable);
      setVisible(scrollable && window.scrollY > 120);
    };

    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    return () => {
      window.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`no-print fixed bottom-24 right-4 z-[1150] inline-flex min-h-11 items-center gap-2 rounded-full border border-petrol-100 bg-white/88 px-4 text-sm font-semibold text-petrol-700 shadow-card backdrop-blur-xl transition-all duration-300 lg:bottom-6 ${visible && hasScrollableArea ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
      aria-label="Volver arriba"
    >
      <ChevronUp className="size-4" />
      Volver arriba
    </button>
  );
}
