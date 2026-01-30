
export interface ArtifactAnalysis {
  id: string;
  name: string;
  estimatedPeriod: string;
  origin: string;
  material: string;
  condition: string;
  decorativeElements: string;
  detectedFeatures: string[];
  historicalSignificance: string;
  conservationAdvice: string;
  knowledgeBaseSummary: string;
  confidenceScore: number;
  imageUrl: string;
  timestamp: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ANALYZED = 'ANALYZED',
  ERROR = 'ERROR'
}
