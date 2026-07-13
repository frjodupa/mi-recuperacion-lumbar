import type { MedicalDocument } from '../../types';
import { MEDICAL_DISCLAIMER } from '../../services/documents/summaryService';
import { Modal } from '../ui';

export function DocumentSummaryView({
  document,
  onClose,
}: {
  document: MedicalDocument;
  onClose: () => void;
}) {
  return (
    <Modal title="Resumen del informe" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-700">{document.analysis.summary}</p>
        <p className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-900">{MEDICAL_DISCLAIMER}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(document.analysis.confirmed).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-petrol-100 bg-white/70 p-3 text-sm">
              <p className="font-semibold text-petrol-700">{labels[key as keyof typeof labels]}</p>
              <p className="text-slate-600">{value}</p>
            </div>
          ))}
        </div>
        <details className="rounded-xl border border-petrol-100 bg-white/70 p-3">
          <summary className="cursor-pointer text-sm font-semibold text-petrol-700">Texto extraído</summary>
          <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs text-slate-700">{document.analysis.fullText || 'No hemos podido leer correctamente el documento.'}</pre>
        </details>
      </div>
    </Modal>
  );
}

const labels = {
  reportDate: 'Fecha del informe',
  hospitalOrCenter: 'Hospital o centro',
  specialty: 'Especialidad',
  documentType: 'Tipo de documento',
  doctor: 'Médico',
  surgeryDate: 'Fecha de cirugía',
  interventionType: 'Tipo de intervención',
  vertebralLevel: 'Nivel vertebral',
  writtenRestrictions: 'Restricciones escritas',
  nextReview: 'Próxima revisión',
  mentionedMedication: 'Medicación mencionada',
};
