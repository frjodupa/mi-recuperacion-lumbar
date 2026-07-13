import type { MedicalExtractedFields } from '../../types';
import { NOT_DETECTED } from './extractionService';

export function buildSimpleDocumentSummary(fields: MedicalExtractedFields) {
  const type = fields.documentType !== NOT_DETECTED ? fields.documentType : 'documento clínico';
  const specialty = fields.specialty !== NOT_DETECTED ? fields.specialty : 'especialidad no detectada';
  const date = fields.reportDate !== NOT_DETECTED ? fields.reportDate : 'fecha no detectada';

  return `Este documento corresponde a ${type.toLowerCase()} de ${specialty.toLowerCase()} con fecha ${date}.`;
}

export const MEDICAL_DISCLAIMER = 'Este resumen se genera automáticamente para ayudarte a comprender el documento. No sustituye la valoración de un profesional sanitario.';
