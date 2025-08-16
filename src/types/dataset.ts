import type { Modality } from './common';
// DTO

// GET /api/datasets
export type DatasetListReply = Dataset[];

// GET /api/images/<id>
export type ImageListReply = Image[];

// Model

export type Dataset = {
  id: number;
  name: string;
  modality: Modality;
  path: string;
};

export type Image = {
  id: number;
  dataset_id: number;
  name: string;
  modality: Modality;
  path: string;
  label: string;
};
