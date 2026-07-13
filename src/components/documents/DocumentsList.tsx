import { CalendarDays, Eye } from 'lucide-react';
import type { MedicalDocument } from '../../types';
import { Button, Card } from '../ui';

export function DocumentsList({
  documents,
  onOpen,
}: {
  documents: MedicalDocument[];
  onOpen: (documentId: string) => void;
}) {
  if (!documents.length) {
    return <p className="text-sm text-slate-600">Todavía no hay informes guardados.</p>;
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <Card key={document.id} className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-3">
              {document.thumbnailDataUrl ? (
                <img src={document.thumbnailDataUrl} alt="Miniatura del informe" className="size-14 rounded-xl object-cover" />
              ) : (
                <div className="grid size-14 place-items-center rounded-xl bg-petrol-50 text-petrol-700">PDF</div>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold text-petrol-700">{document.fileName}</p>
                <p className="mt-1 text-sm text-slate-600">{document.analysis.confirmed.documentType} · {document.analysis.confirmed.specialty}</p>
                <p className="mt-1 text-xs text-slate-500">{document.analysis.confirmed.hospitalOrCenter}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500"><CalendarDays className="size-3" /> {formatDate(document.uploadedAt)}</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => onOpen(document.id)}><Eye className="size-4" /> Ver resumen</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
