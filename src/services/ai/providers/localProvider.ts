import type { AiAnalysisInput, AiAnalysisOutput, AiProvider } from '../aiProvider';

export const localProvider: AiProvider = {
  id: 'local-fallback',
  label: 'Local',
  async analyze(input: AiAnalysisInput): Promise<AiAnalysisOutput> {
    const clean = input.text.replace(/\s+/g, ' ').trim();
    if (!clean) {
      return { summary: 'No hemos podido extraer texto suficiente para generar un resumen.' };
    }
    const snippet = clean.slice(0, 220);
    return {
      summary: `Resumen automático local: ${snippet}${clean.length > 220 ? '...' : ''}`,
    };
  },
};
