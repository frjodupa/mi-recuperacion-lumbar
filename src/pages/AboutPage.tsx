import { ArrowLeft, ExternalLink, HeartHandshake, MessageSquareText, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { clearState } from '../utils/storage';
import { Button, Card, ConfirmDialog } from '../components/ui';
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
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Acerca de</p>
          <h2 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[var(--color-title)]">Mi Recuperación Lumbar</h2>
        </div>
        <Button variant="ghost" onClick={() => setPage('profile')}>
          <ArrowLeft className="size-4" />
          Volver a Mi perfil
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
              <a href="mailto:info@redcrea24.es?subject=Sugerencias%20Mi%20Recuperaci%C3%B3n%20Lumbar" className="animate-soft inline-flex items-center justify-center gap-2 rounded-[20px] border border-petrol-100 bg-white/80 px-4 py-3 text-sm font-semibold text-petrol-700 transition hover:-translate-y-0.5 hover:bg-petrol-50">
                <MessageSquareText className="size-4" />
                Enviar sugerencias
              </a>
              <a href="mailto:info@redcrea24.es" className="animate-soft inline-flex items-center justify-center gap-2 rounded-[20px] border border-petrol-100 bg-white/80 px-4 py-3 text-sm font-semibold text-petrol-700 transition hover:-translate-y-0.5 hover:bg-petrol-50">
                Contactar
              </a>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Origen y propósito</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--color-title)]">Cómo nació Mi Recuperación Lumbar</h3>
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
          Así nació Mi Recuperación Lumbar. El objetivo de la aplicación es ayudar a organizar la recuperación de forma clara, práctica y humana, sin sustituir nunca el criterio de profesionales sanitarios.
        </p>
      </Card>

      <Card className="p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Gestión de datos</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-petrol-100 bg-white/80 px-4 py-3">
            <span className="text-sm font-semibold text-petrol-700">Estado</span>
            <span className="text-sm text-slate-600">Datos locales</span>
          </div>
          <button type="button" disabled className="inline-flex w-full items-center justify-between rounded-xl border border-petrol-100 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-slate-500 opacity-80">
            <span>Exportar copia</span>
            <span>(Próximamente)</span>
          </button>
          <button type="button" disabled className="inline-flex w-full items-center justify-between rounded-xl border border-petrol-100 bg-white/70 px-4 py-3 text-left text-sm font-semibold text-slate-500 opacity-80">
            <span>Importar copia</span>
            <span>(Próximamente)</span>
          </button>
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="size-4" />
            Restablecer aplicación
          </Button>
        </div>
      </Card>

      <Card className="p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Información</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button variant="ghost" onClick={() => setPage('privacy-policy')}>Política de privacidad</Button>
          <Button variant="ghost" onClick={() => setPage('legal-notice')}>Aviso legal</Button>
          <Button variant="ghost" onClick={() => setPage('security-privacy')}>Seguridad y privacidad</Button>
          <a href="mailto:info@redcrea24.es?subject=Sugerencias%20Mi%20Recuperaci%C3%B3n%20Lumbar" className="ui-button ui-button-ghost animate-soft inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[20px] border border-app-border bg-white/60 px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-app-primaryDark transition hover:bg-app-primaryLight active:scale-[0.98]">Enviar sugerencias</a>
          <a href="mailto:info@redcrea24.es" className="ui-button ui-button-ghost animate-soft inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[20px] border border-app-border bg-white/60 px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] text-app-primaryDark transition hover:bg-app-primaryLight active:scale-[0.98] sm:col-span-2">Contactar</a>
        </div>
      </Card>

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

      {confirmReset && (
        <ConfirmDialog
          title="Restablecer aplicación"
          body="Esta acción borrará todos los datos guardados en este dispositivo. No se puede deshacer."
          onConfirm={() => {
            clearState();
            location.reload();
          }}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
