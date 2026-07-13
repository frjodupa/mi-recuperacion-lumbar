import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button, Card, ResponsibilityNotice } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';

export function PrivacyPolicyPage({ setPage }: { setPage: (page: PageId) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Información legal</p>
          <h2 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[var(--color-title)]">Política de Privacidad</h2>
        </div>
        <Button variant="ghost" onClick={() => setPage('profile')}>
          <ArrowLeft className="size-4" />
          Volver a Mi perfil
        </Button>
      </div>

      <Card className="border-petrol-100/80 bg-gradient-to-br from-white via-petrol-50/60 to-white p-6 sm:p-7">
        <p className="text-base leading-relaxed text-slate-700">
          Esta aplicación es una herramienta de apoyo para organizar la recuperación del paciente. No realiza diagnósticos, no interpreta pruebas médicas y no sustituye la valoración de médicos, fisioterapeutas u otros profesionales sanitarios.
        </p>
      </Card>

      <Card className="p-6 sm:p-7">
        <Section title="Qué datos puede almacenar la aplicación">
          Se pueden guardar datos de perfil, evolución, hábitos de rehabilitación, documentos que el usuario decida incorporar y ajustes de uso.
        </Section>
        <Section title="Finalidad del tratamiento de datos">
          La finalidad es ayudar a organizar el proceso de recuperación, consultar información personal de seguimiento y facilitar la continuidad del uso diario.
        </Section>
        <Section title="Almacenamiento local">
          La información se guarda localmente en este dispositivo. No se envía automáticamente a servidores externos.
        </Section>
        <Section title="Conservación de la información">
          Los datos permanecen disponibles mientras el usuario mantenga la aplicación y no solicite su eliminación mediante las opciones internas.
        </Section>
        <Section title="Derechos del usuario">
          El usuario puede acceder, corregir o eliminar su información en cualquier momento desde la propia aplicación.
        </Section>
        <Section title="Eliminación de datos">
          Existe una opción de borrado de datos para eliminar el contenido almacenado localmente cuando el usuario lo decida.
        </Section>
        <Section title="Futuras sincronizaciones opcionales">
          En versiones futuras podrá ofrecerse, de forma opcional, sincronización cifrada y copia de seguridad entre dispositivos, previa aceptación expresa del usuario.
        </Section>
        <Section title="Cumplimiento normativo (RGPD/GDPR)">
          Esta aplicación se diseña siguiendo principios de minimización, transparencia, control del usuario y protección de datos conforme al Reglamento (UE) 2016/679 (RGPD) y normativa europea aplicable.
        </Section>
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
