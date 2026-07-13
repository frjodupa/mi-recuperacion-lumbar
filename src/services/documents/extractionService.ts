import type { MedicalExtractedFields } from '../../types';

export const NOT_DETECTED = 'No detectada';

export function createEmptyExtractedFields(): MedicalExtractedFields {
  return {
    reportDate: NOT_DETECTED,
    hospitalOrCenter: NOT_DETECTED,
    specialty: NOT_DETECTED,
    documentType: NOT_DETECTED,
    doctor: NOT_DETECTED,
    surgeryDate: NOT_DETECTED,
    interventionType: NOT_DETECTED,
    vertebralLevel: NOT_DETECTED,
    writtenRestrictions: NOT_DETECTED,
    nextReview: NOT_DETECTED,
    mentionedMedication: NOT_DETECTED,
  };
}

export function extractMedicalFields(text: string, fileName: string, mimeType: string): MedicalExtractedFields {
  const fields = createEmptyExtractedFields();
  const normalized = text.replace(/\s+/g, ' ').trim();
  const firstDate = findFirstDate(normalized);

  fields.reportDate = firstDate || NOT_DETECTED;
  fields.hospitalOrCenter = extractHospital(normalized);
  fields.specialty = extractSpecialty(normalized);
  fields.documentType = detectDocumentType(normalized, fileName, mimeType);
  fields.doctor = extractDoctor(normalized);
  fields.surgeryDate = extractSurgeryDate(normalized);
  fields.interventionType = extractIntervention(normalized);
  fields.vertebralLevel = extractVertebralLevel(normalized);
  fields.writtenRestrictions = extractRestrictions(normalized);
  fields.nextReview = extractNextReview(normalized);
  fields.mentionedMedication = extractMedication(normalized);

  return fields;
}

function detectDocumentType(text: string, fileName: string, mimeType: string) {
  const source = `${text} ${fileName}`.toLowerCase();
  if (source.includes('informe quir')) return 'Informe quirúrgico';
  if (source.includes('alta')) return 'Informe de alta';
  if (source.includes('consulta')) return 'Consulta';
  if (source.includes('resonancia') || source.includes('rmn')) return 'Resonancia';
  if (source.includes('tac')) return 'TAC';
  if (source.includes('rehabilit')) return 'Informe de rehabilitación';
  if (mimeType.includes('pdf')) return 'PDF clínico';
  if (mimeType.startsWith('image/')) return 'Imagen clínica';
  return NOT_DETECTED;
}

function extractHospital(text: string) {
  const match = text.match(/(?:hospital|cl[ií]nica|centro|instituto)\s+[a-záéíóúñ0-9\-\s]{3,60}/i);
  return match ? compact(match[0]) : NOT_DETECTED;
}

function extractSpecialty(text: string) {
  const specialties = [
    'Traumatolog[íi]a',
    'Neurocirug[íi]a',
    'Rehabilitaci[oó]n',
    'Fisioterapia',
    'Medicina interna',
    'Neurolog[íi]a',
    'Unidad del dolor',
  ];
  for (const specialty of specialties) {
    const regex = new RegExp(specialty, 'i');
    if (regex.test(text)) return specialty.replace('[íi]', 'í').replace('[oó]', 'ó');
  }
  return NOT_DETECTED;
}

function extractDoctor(text: string) {
  const match = text.match(/(?:dr\.?|dra\.?|doctor|doctora)\s+[a-záéíóúñ\-\s]{3,50}/i);
  return match ? compact(match[0]) : NOT_DETECTED;
}

function extractSurgeryDate(text: string) {
  const surgeryContext = text.match(/(?:cirug[íi]a|intervenci[oó]n|operaci[oó]n)[^\.\n]{0,80}/i)?.[0] || '';
  const date = findFirstDate(surgeryContext);
  return date || NOT_DETECTED;
}

function extractIntervention(text: string) {
  const interventions = [
    'Artrodesis lumbar',
    'Microdiscectom[ií]a',
    'Laminectom[ií]a',
    'Discectom[ií]a',
  ];
  for (const intervention of interventions) {
    const regex = new RegExp(intervention, 'i');
    if (regex.test(text)) return intervention.replace('[ií]', 'í');
  }
  return NOT_DETECTED;
}

function extractVertebralLevel(text: string) {
  const match = text.match(/\b(?:c|l|s)\d(?:\s*[-/]\s*(?:c|l|s)?\d)?\b/i);
  return match ? compact(match[0].toUpperCase()) : NOT_DETECTED;
}

function extractRestrictions(text: string) {
  const match = text.match(/(?:restricci[oó]n|evitar|no\s+realizar|reposo)[^\.\n]{0,120}/i);
  return match ? compact(match[0]) : NOT_DETECTED;
}

function extractNextReview(text: string) {
  const match = text.match(/(?:pr[oó]xima\s+revisi[oó]n|pr[oó]ximo\s+control)[^\.\n]{0,80}/i);
  if (match) {
    const withDate = findFirstDate(match[0]);
    return withDate ? withDate : compact(match[0]);
  }
  return NOT_DETECTED;
}

function extractMedication(text: string) {
  const match = text.match(/(?:medicaci[oó]n|tratamiento\s+farmacol[oó]gico|f[aá]rmaco)[^\.\n]{0,140}/i);
  return match ? compact(match[0]) : NOT_DETECTED;
}

function findFirstDate(text: string) {
  const formats = [
    /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/,
    /\b\d{1,2}\s+de\s+[a-záéíóúñ]+\s+de\s+\d{4}\b/i,
    /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/,
  ];
  for (const format of formats) {
    const match = text.match(format);
    if (match) return compact(match[0]);
  }
  return '';
}

function compact(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}
