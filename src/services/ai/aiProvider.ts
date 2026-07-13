export interface AiAnalysisInput {
  text: string;
}

export interface AiAnalysisOutput {
  summary: string;
}

export interface AiProvider {
  id: string;
  label: string;
  analyze(input: AiAnalysisInput): Promise<AiAnalysisOutput>;
}

export interface AiProviderRegistry {
  getDefaultProvider(): AiProvider;
}
