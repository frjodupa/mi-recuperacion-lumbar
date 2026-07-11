import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button, Card } from './ui';

export function SessionTimer({ running }: { running: boolean }) {
  const [seconds, setSeconds] = useState(0);
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500">Cronómetro general</p>
        <p className="text-3xl font-bold text-petrol-700">{minutes}:{rest}</p>
      </div>
      <Button variant="ghost" onClick={() => setSeconds(0)} aria-label="Reiniciar cronómetro"><RotateCcw className="size-5" /></Button>
    </Card>
  );
}

export function RestTimer({ soundEnabled, vibrationEnabled, finishTimer }: { soundEnabled: boolean; vibrationEnabled: boolean; finishTimer: (sound: boolean, vibration: boolean) => void }) {
  const [seconds, setSeconds] = useState(45);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (seconds === 0) {
      setActive(false);
      finishTimer(soundEnabled, vibrationEnabled);
      return;
    }
    const id = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [active, seconds, soundEnabled, vibrationEnabled, finishTimer]);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">Temporizador descanso/isométrico</p>
          <p className="text-2xl font-bold text-petrol-700">{seconds}s</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setActive((value) => !value)}>{active ? <Pause className="size-5" /> : <Play className="size-5" />}{active ? 'Pausar' : 'Iniciar'}</Button>
          <Button variant="ghost" onClick={() => { setActive(false); setSeconds(45); }}>45s</Button>
          <Button variant="ghost" onClick={() => { setActive(false); setSeconds(20); }}>20s</Button>
        </div>
      </div>
    </Card>
  );
}
