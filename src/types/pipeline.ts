// DTO

export interface PipelineAnalyzeRequest {
  nodes: (
    | DataLoaderNode
    | FeatureExtractorNode
    | FeatureSelectorNode
    | BackboneNode
    | ClassifierNode
  )[];
}

export type PipelineAnalyzeReply = {
  success: boolean;
  node_output: Record<string, { type: string; output_dim: number | string }>;
};

// Model

export type DataLoaderNode = {
  id: string;
  type: 'DataLoader';
  params: {
    modality: string;
    path: string;
  };
};

export type FeatureExtractorNode = {
  id: string;
  type: 'FeatureExtractor';
  params: {
    features: string[];
  };
};

export type FeatureSelectorNode = {
  id: string;
  type: 'FeatureSelector';
  params: {
    select_features: string[];
  };
};

export type BackboneNode = {
  id: string;
  type: 'Backbone';
  params: {
    model: string;
    pretrained: boolean;
  };
};

export type ClassifierNode = {
  id: string;
  type: 'Classifier';
  params: {
    model: string;
    kernel: string;
  };
};
