import type { CommonReply } from './common';

// DTO
export type FeatureListReply = Feature[];

export interface FeatureCreateRequest {
  name: string;
  modality: string;
  params_schema: string;
  description?: string;
}

export type FeatureCreateReply = CommonReply & {
  id: number;
};

export interface FeatureUpdateRequest {
  name?: string;
  modality?: string;
  params_schema?: string;
  description?: string;
}

// Model

export type Feature = {
  id: number;
  name: string;
  description: string;
  modality: string;
  params_schema: Record<string, unknown>;
};
