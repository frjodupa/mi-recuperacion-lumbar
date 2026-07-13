import { ArrowLeft } from 'lucide-react';
import { Button, Card, ResponsibilityNotice } from '../components/ui';
import type { PageId } from '../components/BottomNavigation';

export function SecurityPrivacyPage({ setPage }: { setPage: (page: PageId) => void }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-aqua">Información legal</p>
          <h2 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-[var(--color-title)]">Seguridad y Privacidad</h2>
        </div>
        <Button variant="ghost" onClick={() => setPage('profile')}>
          <ArrowLeft className="size-4" />
          Volver a Mi perfil
        </Button>
      </div>

      <Card className="p-6 sm:p-7">
        <Section title="Cómo protege la aplicación la información">
          La aplicación prioriza el tratamiento local de datos, limita el acceso al propio dispositivo y evita transferencias automáticas no necesarias.
        </Section>
        <Section title="Qué significa almacenamiento local">
          Significa que la información se guarda en este dispositivo y bajo el control del usuario, sin envío automático a servidores externos.
        </Section>
        <Section title="Qué ocurre si se cambia de dispositivo">
          Al no existir sincronización automática en esta versión, los datos no se trasladan solos a otro dispositivo salvo exportación/importación manual por parte del usuario.
        </Section>
        <Section title="Cómo eliminar toda la información">
          Puedes borrar tus datos desde la aplicación cuando lo desees, eliminando la información local almacenada.
        </Section>
        <Section title="Futuras copias de seguridad cifradas">
          En próximas versiones podrá habilitarse opcionalmente una copia de seguridad cifrada y sincronización entre dispositivos, siempre bajo consentimiento del usuario.
        </Section>
        <Section title="Buenas prácticas de privacidad">
          Usa bloqueo de pantalla, no compartas tu dispositivo sin control, revisa periódicamente tus datos y elimina la información cuando ya no la necesites.
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
