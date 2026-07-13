import type { MedicalDocument } from '../../types';

export function DocumentsTimeline({ documents }: { documents: MedicalDocument[] }) {
  if (!documents.length) {
    return <p className="text-sm text-slate-600">La línea temporal aparecerá cuando guardes tu primer informe.</p>;
  }

  const grouped = documents.reduce<Record<string, MedicalDocument[]>>((acc, document) => {
    const year = getYear(document);
    acc[year] = acc[year] || [];
    acc[year].push(document);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-4">
      {years.map((year) => (
        <div key={year}>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.12em] text-aqua">{year}</p>
          <div className="space-y-2">
            {grouped[year]
              .sort((a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt))
              .map((document) => (
                <div key={document.id} className="rounded-xl border border-petrol-100 bg-white/70 p-3 text-sm">
                  <p className="font-semibold text-petrol-700">{document.analysis.confirmed.documentType}</p>
                  <p className="text-slate-600">{document.analysis.confirmed.specialty} · {document.analysis.confirmed.hospitalOrCenter}</p>
                  <p className="text-xs text-slate-500">{formatDate(document.uploadedAt)}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function getYear(document: MedicalDocument) {
  const reportDate = document.analysis.confirmed.reportDate;
  const reportYear = reportDate.match(/\b(19|20)\d{2}\b/);
  if (reportYear) return reportYear[0];
  return String(new Date(document.uploadedAt).getFullYear());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(value));
}
