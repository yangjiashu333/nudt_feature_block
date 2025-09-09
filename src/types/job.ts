import type { CommonReply, JobStatus } from './common';

// DTO

// POST /api/train/start
export interface TrainStartRequest {
  user_id: number;
  dataset_id: number;
  feature_ids: number | number[];
  nodes: Record<string, unknown>;
  backbone_id: number;
  classifier_id: number;
  adaptive: 0 | 1;
  config: TrainConfig;
}

export type TrainStartReply = CommonReply & {
  celery_task_id: string;
  job_id: string;
  id: number;
};

// POST /api/val/start
export interface ValStartRequest {
  user_id: number;
  train_job_id: string;
}

export type ValStartReply = CommonReply & {
  celery_task_id: string;
  val_job_id: string;
  id: number;
};

// GET api/train/status/<job_id>
export type TrainStatusReply = {
  progress: number;
  status: JobStatus;
};

// GET /api/train
export type TrainJobList = TrainJob[];

// GET /api/val
export type ValJobLIst = ValJob[];

// GET SSE /api/train/logs/<job_id>

// GET /api/train/logs_file/<job_id>
export type TrainLogReply = {
  log: string;
};

// GET /api/train/result/<job_id>
export type TrainResultReply = TrainResult;

// GET /api/val/result/<job_id>
export type ValResultReply = ValResult;

// SSE: Training log stream
export type TrainLogEvent = TrainLogMetricEntry | TrainLogMessageEntry;

export type TrainLogBase = {
  // 原始行文本
  raw: string;
  // 可选的时间戳字符串，如 13:27:10
  timestamp?: string;
};

export type TrainLogMetricEntry = TrainLogBase & {
  type: 'metrics';
  epoch: number;
  // 百分比数值，例如 53.24 表示 53.24%
  oa?: number;
  kappa?: number;
  // 分类准确率数组（若服务端提供）
  clsAcc?: number[];
  precision?: number;
  recall?: number;
  f1?: number;
  loss?: number;
};

export type TrainLogMessageEntry = TrainLogBase & {
  type: 'message';
  message: string;
};

// Models
export type TrainJob = {
  id: number;
  job_id: string;
  user_id: number;
  dataset_id: number;
  nodes: Record<string, number>;
  backbone_id: number;
  classifier_id: number;
  feature_ids: number | number[];
  adaptive: boolean;
  status: JobStatus;
  progress: number;
  result: TrainResult;
  model_path: string;
  log_path: string;
  createTime: Date;
  updateTime: Date;
};

export type TrainConfig = Record<string, unknown> & {};

export type TrainResult = Record<string, unknown> & {};

export type ValJob = {
  id: number;
  val_job_id: string;
  train_job_id: string;
  user_id: number;
  config: ValConfig;
  result: ValResult;
  status: JobStatus;
  createTime: Date;
  updateTime: Date;
};

export type ValConfig = Record<string, unknown> & {};

export type ValResult = Record<string, unknown> & {};
