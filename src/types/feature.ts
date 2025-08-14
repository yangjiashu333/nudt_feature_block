import type { CommonReply, Modality } from './common';

// DTO
export type FeatureListReply = Feature[];

export interface FeatureCreateRequest {
  name: string;
  modality: Modality;
  description?: string;
}

export type FeatureCreateReply = CommonReply & {
  id: number;
};

export interface FeatureUpdateRequest {
  name?: string;
  modality?: Modality;
  description?: string;
}

// Model

export type Feature = {
  id: number;
  name: string;
  description?: string;
  modality: Modality;
};
