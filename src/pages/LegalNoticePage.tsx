import { ArrowLeft } from 'lucide-react';
import { Button, Card, ResponsibilityNotice } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';

export function LegalNoticePage({ setPage }: { setPage: (page: PageId) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Información legal</p>
          <h2 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[var(--color-title)]">Aviso Legal</h2>
        </div>
        <Button variant="ghost" onClick={() => setPage('profile')}>
          <ArrowLeft className="size-4" />
          Volver a Mi perfil
        </Button>
      </div>

      <Card className="p-6 sm:p-7">
        <Section title="Finalidad de la aplicación">
          Esta aplicación tiene una finalidad exclusivamente informativa y organizativa para apoyar la recuperación del paciente.
        </Section>
        <Section title="Exclusión de responsabilidad médica">
          No realiza diagnósticos, no interpreta pruebas médicas y no sustituye la valoración de médicos, fisioterapeutas u otros profesionales sanitarios. Ante cualquier duda o empeoramiento, el usuario debe consultar con un profesional sanitario.
        </Section>
        <Section title="Responsabilidad del usuario">
          El usuario es responsable de la veracidad y actualización de la información que introduce en la aplicación.
        </Section>
        <Section title="Propiedad intelectual">
          Los contenidos, diseño, estructura, marcas y elementos técnicos de la aplicación están protegidos por la normativa de propiedad intelectual e industrial aplicable.
        </Section>
        <Section title="Limitación de responsabilidad">
          El titular no responde de decisiones tomadas por el usuario a partir del contenido de la aplicación, ni de daños derivados de un uso inadecuado o contrario a este aviso legal.
        </Section>
        <Section title="Legislación aplicable y jurisdicción">
          Este aviso legal se rige por la legislación de España y de la Unión Europea, incluyendo la normativa de protección de consumidores y de protección de datos.
        </Section>
      </Card>

      <Card className="border-petrol-100/80 bg-gradient-to-br from-white via-petrol-50/60 to-white p-6 sm:p-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Datos del titular (pendiente de completar)</p>
        <div className="mt-4 space-y-3">
          <DataRow label="Titular" value="RedCrea24" />
          <DataRow label="Correo" value="info@redcrea24.es" />
          <DataRow label="Web" value="https://redcrea24.es" />
        </div>
      </Card>

      <Card className="border-amber-200/80 bg-amber-50/80 p-6 sm:p-7">
        <ResponsibilityNotice withEscalation />
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: string }) {
  return (
    <div className="mb-5 rounded-2xl border border-petrol-100 bg-white/80 p-4 last:mb-0">
      <p className="text-sm font-semibold text-petrol-700">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-petrol-100 bg-white/80 px-4 py-3">
      <span className="text-sm font-semibold text-petrol-700">{label}</span>
      <span className="text-sm text-slate-600">{value}</span>
    </div>
  );
}
