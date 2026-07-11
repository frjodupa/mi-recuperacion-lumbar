import { Activity, Footprints, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button, Card, SafetyNotice } from '../components/ui';

const slides = [
  { title: 'Organiza tu recuperación', body: 'Consulta tus ejercicios, registra tus sesiones y observa tu evolución.', icon: Activity },
  { title: 'Avanza con seguridad', body: 'Utiliza únicamente las actividades autorizadas por tu equipo sanitario.', icon: ShieldCheck },
  { title: 'Paso a paso', body: 'La constancia y el control son más importantes que la intensidad.', icon: Footprints },
];

export function Onboarding({ onFinish }: { onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const SlideIcon = slides[index].icon;
  const final = index === slides.length - 1;

  return (
    <main className="grid min-h-screen place-items-center bg-petrol-50 p-4">
      <Card className="w-full max-w-xl">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-2xl bg-petrol-500 text-white"><SlideIcon className="size-8" /></div>
        <h1 className="text-center text-3xl font-bold text-petrol-700">{slides[index].title}</h1>
        <p className="mx-auto mt-3 max-w-md text-center text-lg leading-relaxed text-slate-600">{slides[index].body}</p>
        <div className="my-6"><SafetyNotice /></div>
        {final && (
          <label className="flex gap-3 rounded-xl border border-petrol-100 p-3 text-sm font-semibold text-slate-700">
            <input className="mt-1 size-5 accent-petrol-500" type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
            He leído y comprendo que esta aplicación no sustituye el consejo médico.
          </label>
        )}
        <div className="mt-5 flex gap-3">
          {index > 0 && <Button className="flex-1" variant="ghost" onClick={() => setIndex(index - 1)}>Atrás</Button>}
          <Button className="flex-1" disabled={final && !accepted} onClick={() => final ? onFinish() : setIndex(index + 1)}>{final ? 'Empezar' : 'Continuar'}</Button>
        </div>
      </Card>
    </main>
  );
}
