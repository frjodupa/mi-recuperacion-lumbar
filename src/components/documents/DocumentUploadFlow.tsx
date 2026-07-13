import { FileText, ImagePlus, Loader2, UploadCloud } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { MedicalDocumentAnalysis, MedicalExtractedFields } from '../../types';
import { analyzeMedicalDocument, ensureNotDetected } from '../../services/documents/pipelineService';
import { MEDICAL_DISCLAIMER } from '../../services/documents/summaryService';
import { Button, Modal } from '../ui';

type FlowStep = 'select' | 'preview' | 'analyzing' | 'result';

type UploadResult = {
  file: File;
  analysis: MedicalDocumentAnalysis;
  thumbnailDataUrl?: string;
};

export function DocumentUploadFlow({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (result: UploadResult) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<FlowStep>('select');
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | undefined>();
  const [analysis, setAnalysis] = useState<MedicalDocumentAnalysis | null>(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);

  const handlePicked = async (nextFile?: File) => {
    if (!nextFile) return;
    setFile(nextFile);
    setAnalysis(null);
    setProgress(0);
    setStep('preview');

    if (nextFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailDataUrl(typeof reader.result === 'string' ? reader.result : undefined);
      };
      reader.readAsDataURL(nextFile);
    } else {
      setThumbnailDataUrl(undefined);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setStep('analyzing');
    setProgress(10);
    const result = await analyzeMedicalDocument(file, setProgress);
    setAnalysis(result);
    setStep('result');
  };

  const updateField = (key: keyof MedicalExtractedFields, value: string) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      confirmed: {
        ...analysis.confirmed,
        [key]: ensureNotDetected(value),
      },
    });
  };

  const confirmSave = async () => {
    if (!file || !analysis) return;
    setSaving(true);
    await onConfirm({ file, analysis, thumbnailDataUrl });
    setSaving(false);
    onClose();
  };

  return (
    <Modal title="Añadir informe" onClose={onClose}>
      {step === 'select' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Selecciona un PDF o imagen clínica para organizar y comprender mejor tu documentación.</p>
          <div className="rounded-2xl border border-petrol-100 bg-petrol-50/70 p-4 text-sm text-slate-700">
            Formatos compatibles: PDF, JPG, PNG, HEIC.
          </div>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,application/pdf,image/jpeg,image/png,image/heic,image/heif"
            onChange={(event) => handlePicked(event.target.files?.[0])}
          />
          <Button onClick={() => inputRef.current?.click()}><UploadCloud className="size-5" /> Añadir informe</Button>
        </div>
      )}

      {step === 'preview' && file && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Revisa el archivo antes de analizarlo.</p>
          <div className="rounded-2xl border border-petrol-100 bg-white p-4">
            <p className="text-sm font-semibold text-petrol-700">{file.name}</p>
            <p className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</p>
            {file.type.startsWith('image/') && previewUrl && (
              <img src={previewUrl} alt="Vista previa del informe" className="mt-3 max-h-72 w-full rounded-xl object-contain" />
            )}
            {(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-petrol-50 p-3 text-sm font-semibold text-petrol-700"><FileText className="size-4" /> Vista previa PDF preparada</div>
            )}
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-900">
            El análisis se ejecutará localmente en este dispositivo. Si en el futuro activas un servicio externo de IA, te lo notificaremos antes de enviar cualquier documento.
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={startAnalysis}>Confirmar y analizar</Button>
            <Button variant="ghost" onClick={() => inputRef.current?.click()}><ImagePlus className="size-4" /> Cambiar archivo</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-petrol-50 px-4 py-2 text-sm font-semibold text-petrol-700">
            <Loader2 className="size-4 animate-spin" /> Analizando documento...
          </div>
          <div className="h-2.5 rounded-full bg-petrol-100">
            <div className="h-full rounded-full bg-petrol-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-slate-600">Estamos preparando un resumen del documento.</p>
        </div>
      )}

      {step === 'result' && analysis && (
        <div className="space-y-4">
          {analysis.warning && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">{analysis.warning}</div>}
          <div className="rounded-xl border border-petrol-100 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-aqua">Resumen</p>
            <p className="mt-2 text-sm text-slate-700">{analysis.summary}</p>
          </div>
          <p className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm text-amber-900">{MEDICAL_DISCLAIMER}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            {fieldEntries.map(([key, label]) => (
              <label key={key} className="rounded-xl border border-petrol-100 bg-white p-3 text-sm font-semibold text-slate-700">
                {label}
                <input
                  className="mt-2 block min-h-10 w-full rounded-lg border border-petrol-100 px-3 text-sm"
                  value={analysis.confirmed[key]}
                  onChange={(event) => updateField(key, event.target.value)}
                />
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={confirmSave} disabled={saving}>{saving ? 'Guardando...' : 'Confirmar y guardar'}</Button>
            <Button variant="ghost" onClick={() => setStep('preview')}>Cambiar archivo</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

const fieldEntries: Array<[keyof MedicalExtractedFields, string]> = [
  ['reportDate', 'Fecha del informe'],
  ['hospitalOrCenter', 'Hospital o centro'],
  ['specialty', 'Especialidad'],
  ['documentType', 'Tipo de documento'],
  ['doctor', 'Médico'],
  ['surgeryDate', 'Fecha de cirugía'],
  ['interventionType', 'Tipo de intervención'],
  ['vertebralLevel', 'Nivel vertebral'],
  ['writtenRestrictions', 'Restricciones escritas'],
  ['nextReview', 'Próxima revisión'],
  ['mentionedMedication', 'Medicación mencionada'],
];
