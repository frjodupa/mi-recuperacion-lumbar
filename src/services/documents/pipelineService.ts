import type { MedicalDocumentAnalysis } from '../../types';
import { extractDocumentText } from './ocrService';
import { createEmptyExtractedFields, extractMedicalFields, NOT_DETECTED } from './extractionService';
import { buildSimpleDocumentSummary } from './summaryService';

export async function analyzeMedicalDocument(file: File, onProgress?: (progress: number) => void): Promise<MedicalDocumentAnalysis> {
  onProgress?.(5);
  try {
    const fullText = await extractDocumentText(file, (value) => {
      onProgress?.(Math.max(10, Math.min(80, value)));
    });

    if (!fullText || fullText.trim().length < 10) {
      const empty = createEmptyExtractedFields();
      onProgress?.(100);
      return {
        status: 'completed',
        processingMode: 'local',
        progress: 100,
        fullText: '',
        summary: 'No hemos podido leer correctamente el documento.',
        extracted: empty,
        confirmed: { ...empty },
        warning: 'No hemos podido leer correctamente el documento.',
      };
    }

    const extracted = extractMedicalFields(fullText, file.name, file.type);
    const summary = buildSimpleDocumentSummary(extracted);

    onProgress?.(100);
    return {
      status: 'completed',
      processingMode: 'local',
      progress: 100,
      fullText,
      summary,
      extracted,
      confirmed: { ...extracted },
    };
  } catch (error) {
    const fallback = createEmptyExtractedFields();
    onProgress?.(100);
    return {
      status: 'failed',
      processingMode: 'local',
      progress: 100,
      fullText: '',
      summary: 'No hemos podido leer correctamente el documento.',
      extracted: fallback,
      confirmed: { ...fallback },
      warning: 'No hemos podido leer correctamente el documento.',
      error: error instanceof Error ? error.message : 'Error no controlado en el análisis del documento.',
    };
  }
}

export function ensureNotDetected(value: string) {
  return value?.trim() ? value : NOT_DETECTED;
}
