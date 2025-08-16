// DTO

export type ClassifierListReply = Classifier[];

// Model

export type Classifier = {
  id: number;
  name: string;
  description?: string;
  params_schema?: string;
};
