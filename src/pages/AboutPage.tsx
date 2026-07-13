import { ArrowLeft, ExternalLink, HeartHandshake, MessageSquareText, Share2, Sparkles, ShieldCheck, UserRound } from 'lucide-react';
import { Button, Card } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';

const developmentItems: Array<{ label: string; value: string; href?: string }> = [
  { label: 'Redcrea24.es', value: 'https://redcrea24.es', href: 'https://redcrea24.es' },
  { label: 'Idea original', value: 'Proyecto personal y experiencia de recuperación' },
  { label: 'Diseño UX/UI', value: 'Diseño de experiencia y dirección visual' },
  { label: 'Desarrollo', value: 'Implementación de la aplicación' },
  { label: 'Dirección del proyecto', value: 'José Duque' },
];

const acknowledgements = ['Traumatólogos', 'Neurocirujanos', 'Fisioterapeutas', 'Rehabilitadores', 'Personal de enfermería', 'Investigadores'];

export function AboutPage({ setPage }: { setPage: (page: PageId) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Acerca de</p>
          <h2 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[var(--color-title)]">Mi Recuperación Lumbar</h2>
        </div>
        <Button variant="ghost" onClick={() => setPage('info')}>
          <ArrowLeft className="size-4" />
          Volver a Ajustes
        </Button>
      </div>

      <Card className="overflow-hidden border-petrol-100/80 bg-gradient-to-br from-white via-petrol-50/60 to-white p-0 sm:p-0">
        <div className="px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-petrol-100 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">
                <Sparkles className="size-3.5" />
                Asistente de recuperación
              </div>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[var(--color-title)] sm:text-4xl">Acerca de</h3>
              <p className="mt-3 text-lg font-semibold text-[var(--color-text-primary)]">Mi Recuperación Lumbar</p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text-secondary)]">Versión v1.0.0</p>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
                Mi Recuperación Lumbar es un asistente inteligente diseñado para acompañar al paciente durante todo el proceso de recuperación tras una artrodesis lumbar.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                Su propósito es ofrecer una experiencia sencilla, clara y humana, ayudando a comprender la evolución, organizar la rehabilitación y mantener toda la información importante en un único lugar.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
                La aplicación acompaña al paciente, pero nunca sustituye el criterio de médicos, fisioterapeutas o rehabilitadores.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:min-w-[220px]">
              <button type="button" className="animate-soft inline-flex items-center justify-center gap-2 rounded-[20px] border border-petrol-100 bg-white/80 px-4 py-3 text-sm font-semibold text-petrol-700 transition hover:-translate-y-0.5 hover:bg-petrol-50" onClick={() => undefined}>
                <Share2 className="size-4" />
                Compartir la aplicación
              </button>
              <button type="button" className="animate-soft inline-flex items-center justify-center gap-2 rounded-[20px] border border-petrol-100 bg-white/80 px-4 py-3 text-sm font-semibold text-petrol-700 transition hover:-translate-y-0.5 hover:bg-petrol-50" onClick={() => undefined}>
                <MessageSquareText className="size-4" />
                Enviar sugerencias
              </button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6 sm:p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Nuestra historia</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-title)]">Nuestra historia</h3>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            Mi Recuperación Lumbar nació de una experiencia real.
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Después de someterme a una artrodesis lumbar viví en primera persona muchas de las dudas, incertidumbres y desafíos que acompañan este proceso: comprender informes médicos, saber qué ejercicios eran adecuados, registrar la evolución y mantener la motivación durante meses de rehabilitación.
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Fue entonces cuando surgió una pregunta:
          </p>
          <blockquote className="mt-4 rounded-[24px] border border-petrol-100 bg-petrol-50/70 px-4 py-4 text-lg font-semibold leading-relaxed text-[var(--color-title)]">
            “¿Y si existiera una aplicación capaz de acompañar al paciente durante toda su recuperación, explicándole cada paso de forma sencilla y adaptándose a su situación?”
          </blockquote>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Así nació Mi Recuperación Lumbar. Cada función de esta aplicación está inspirada en necesidades reales vividas durante mi propia recuperación y continúa evolucionando con un único objetivo: ayudar a otras personas a sentirse acompañadas, informadas y seguras durante uno de los momentos más importantes de su vida.
          </p>
        </Card>

        <Card className="p-6 sm:p-7">
          <div className="rounded-[24px] border border-petrol-100 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-16 shrink-0 place-items-center rounded-[22px] bg-petrol-500 text-lg font-semibold text-white shadow-[0_14px_30px_rgba(15,92,99,0.2)]">
                JD
              </div>
              <div>
                <p className="text-lg font-semibold text-[var(--color-title)]">José Duque</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Creador del proyecto</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-dashed border-petrol-200 bg-petrol-50/70 p-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              <div className="mb-3 flex items-center gap-2 text-[var(--color-title)]">
                <UserRound className="size-4" />
                Placeholder de fotografía
              </div>
              Este espacio está preparado para sustituir el avatar por una fotografía real en futuras versiones.
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Sobre el creador</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-title)]">José Duque</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Creador del proyecto, diseñador de la experiencia de usuario y paciente de artrodesis lumbar.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Esta aplicación nace de una experiencia personal transformada en una herramienta para ayudar a otras personas que recorren el mismo camino.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-petrol-100 bg-petrol-50/80 px-3 py-2 text-sm font-semibold text-[var(--color-title)]">
            <HeartHandshake className="size-4" />
            Creada por un paciente, desarrollada para ayudar a otros pacientes.
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Desarrollo</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {developmentItems.map((item) => (
            <div key={item.label} className="rounded-[22px] border border-petrol-100 bg-white/80 p-4">
              <p className="text-sm font-semibold text-[var(--color-title)]">{item.label}</p>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-aqua transition hover:text-petrol-700">
                  {item.value}
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Agradecimientos</p>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          Mi agradecimiento a todos los profesionales sanitarios que dedican su trabajo a mejorar la calidad de vida de los pacientes:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {acknowledgements.map((item) => (
            <span key={item} className="rounded-full border border-petrol-100 bg-white/80 px-3 py-2 text-sm font-semibold text-[var(--color-title)]">
              {item}
            </span>
          ))}
        </div>
        <p className="mt-4 text-base leading-relaxed text-slate-600">
          Y especialmente a todas las personas que, compartiendo su experiencia, ayudan a mejorar continuamente esta aplicación.
        </p>
      </Card>

      <Card className="border-amber-200/80 bg-amber-50/80 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">Aviso importante</p>
            <p className="mt-2 text-base leading-relaxed text-amber-900">
              Mi Recuperación Lumbar tiene un carácter exclusivamente informativo y de apoyo. La aplicación no realiza diagnósticos, no modifica tratamientos y no sustituye la valoración de un profesional sanitario. Ante cualquier duda relacionada con la salud, consulta siempre con tu médico o fisioterapeuta.
            </p>
          </div>
        </div>
      </Card>

      <div className="rounded-[30px] border border-petrol-100 bg-white/80 px-6 py-8 text-center shadow-sm backdrop-blur">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-aqua">Frase final</p>
        <p className="mt-3 text-2xl font-semibold leading-relaxed tracking-[-0.025em] text-[var(--color-title)] sm:text-3xl">
          “La mejor recuperación no consiste solo en sanar la espalda, sino en recuperar la confianza para volver a vivir.”
        </p>
      </div>

      <footer className="flex flex-col gap-2 border-t border-petrol-100/70 pt-5 text-center text-sm text-[var(--color-text-secondary)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>© 2026 José Duque · Redcrea24.es</p>
        <p>Versión 1.0.0</p>
      </footer>
    </div>
  );
}
