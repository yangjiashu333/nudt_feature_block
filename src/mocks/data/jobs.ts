import type { TrainJob, ValJob, JobStatus } from '@/types/job';

// Mock training jobs with different statuses
export const mockTrainJobs: TrainJob[] = [
  {
    id: 1,
    job_id: 'train_001',
    user_id: 1,
    dataset_id: 1,
    nodes: { node1: 4, node2: 8 },
    backbone_id: 1,
    classifier_id: 1,
    feature_ids: [1, 2],
    adaptive: true,
    status: 'done' as JobStatus,
    progress: 100,
    result: {
      accuracy: 0.8532,
      loss: 0.2134,
      epochs: 50,
      final_metrics: {
        oa: 85.32,
        kappa: 0.8142,
        precision: 0.8456,
        recall: 0.8298,
        f1: 0.8376
      }
    },
    model_path: '/models/train_001/model.pth',
    log_path: '/logs/train_001/training.log',
    createTime: new Date('2024-01-15T10:00:00Z'),
    updateTime: new Date('2024-01-15T12:30:00Z'),
  },
  {
    id: 2,
    job_id: 'train_002',
    user_id: 1,
    dataset_id: 2,
    nodes: { node1: 2 },
    backbone_id: 2,
    classifier_id: 2,
    feature_ids: [2, 3, 4],
    adaptive: false,
    status: 'running' as JobStatus,
    progress: 65,
    result: {},
    model_path: '',
    log_path: '/logs/train_002/training.log',
    createTime: new Date('2024-01-16T09:00:00Z'),
    updateTime: new Date('2024-01-16T11:45:00Z'),
  },
  {
    id: 3,
    job_id: 'train_003',
    user_id: 1,
    dataset_id: 1,
    nodes: { node1: 1, node2: 2, node3: 4 },
    backbone_id: 3,
    classifier_id: 1,
    feature_ids: 1,
    adaptive: true,
    status: 'failed' as JobStatus,
    progress: 25,
    result: {
      error: 'Out of memory during training',
      last_epoch: 12
    },
    model_path: '',
    log_path: '/logs/train_003/training.log',
    createTime: new Date('2024-01-17T14:00:00Z'),
    updateTime: new Date('2024-01-17T14:45:00Z'),
  },
  {
    id: 4,
    job_id: 'train_004',
    user_id: 1,
    dataset_id: 3,
    nodes: { node1: 8 },
    backbone_id: 1,
    classifier_id: 3,
    feature_ids: [1, 3],
    adaptive: false,
    status: 'pending' as JobStatus,
    progress: 0,
    result: {},
    model_path: '',
    log_path: '',
    createTime: new Date('2024-01-18T08:00:00Z'),
    updateTime: new Date('2024-01-18T08:00:00Z'),
  },
];

// Mock validation jobs
export const mockValJobs: ValJob[] = [
  {
    id: 1,
    val_job_id: 'val_001',
    train_job_id: 'train_001',
    user_id: 1,
    config: {
      test_dataset_id: 2,
      batch_size: 32,
      metrics: ['accuracy', 'precision', 'recall', 'f1']
    },
    result: {
      accuracy: 0.8245,
      precision: 0.8156,
      recall: 0.8089,
      f1: 0.8122,
      confusion_matrix: [[120, 15], [18, 132]],
      class_report: {
        'class_0': { precision: 0.8696, recall: 0.8889, f1: 0.8791 },
        'class_1': { precision: 0.8980, recall: 0.8800, f1: 0.8889 }
      }
    },
    status: 'done' as JobStatus,
    createTime: new Date('2024-01-15T13:00:00Z'),
    updateTime: new Date('2024-01-15T13:15:00Z'),
  },
  {
    id: 2,
    val_job_id: 'val_002',
    train_job_id: 'train_002',
    user_id: 1,
    config: {
      test_dataset_id: 3,
      batch_size: 64,
      metrics: ['accuracy', 'kappa']
    },
    result: {},
    status: 'pending' as JobStatus,
    createTime: new Date('2024-01-16T12:00:00Z'),
    updateTime: new Date('2024-01-16T12:00:00Z'),
  },
];

// Mock offline logs for completed jobs
export const mockOfflineLogs = new Map<string, string>([
  ['train_001', `[10:00:15] 开始训练
[10:00:20] 加载数据集完成, 训练样本: 2840, 验证样本: 710
[10:00:25] 初始化模型完成
[10:05:32] epoch:0, OA: 45.23%, Kappa: 0.1234, cls Acc: [78.45, 12.01], P:0.4123,R:0.3987,F1:0.3456,loss:1.234
[10:10:48] epoch:1, OA: 52.67%, Kappa: 0.2156, cls Acc: [81.23, 24.11], P:0.4987,R:0.4654,F1:0.4321,loss:1.087
[10:16:12] epoch:2, OA: 59.34%, Kappa: 0.3287, cls Acc: [83.56, 35.12], P:0.5634,R:0.5298,F1:0.5123,loss:0.952
[10:21:35] epoch:3, OA: 64.89%, Kappa: 0.4156, cls Acc: [85.78, 43.99], P:0.6123,R:0.5987,F1:0.5834,loss:0.845
[10:26:58] epoch:4, OA: 69.45%, Kappa: 0.4923, cls Acc: [87.23, 51.67], P:0.6567,R:0.6432,F1:0.6234,loss:0.756
[11:45:23] epoch:47, OA: 84.56%, Kappa: 0.8089, cls Acc: [92.34, 76.78], P:0.8456,R:0.8298,F1:0.8356,loss:0.215
[11:50:45] epoch:48, OA: 85.01%, Kappa: 0.8123, cls Acc: [92.67, 77.35], P:0.8478,R:0.8321,F1:0.8367,loss:0.213
[11:56:12] epoch:49, OA: 85.32%, Kappa: 0.8142, cls Acc: [92.89, 77.75], P:0.8498,R:0.8343,F1:0.8376,loss:0.212
[12:01:34] 训练完成
[12:05:28] 模型保存至: /models/train_001/model.pth
[12:05:30] 训练日志保存至: /logs/train_001/training.log`],
  
  ['train_003', `[14:00:15] 开始训练
[14:00:20] 加载数据集完成, 训练样本: 5680, 验证样本: 1420
[14:00:25] 初始化模型完成
[14:05:32] epoch:0, OA: 38.12%, Kappa: 0.0987, cls Acc: [65.23, 10.99], P:0.3456,R:0.3123,F1:0.2987,loss:1.456
[14:10:48] epoch:1, OA: 42.34%, Kappa: 0.1234, cls Acc: [68.45, 16.23], P:0.3789,R:0.3456,F1:0.3234,loss:1.324
[14:16:12] epoch:2, OA: 46.78%, Kappa: 0.1567, cls Acc: [71.23, 22.33], P:0.4123,R:0.3789,F1:0.3567,loss:1.198
[14:21:35] epoch:3, OA: 49.56%, Kappa: 0.1789, cls Acc: [73.45, 25.67], P:0.4345,R:0.4023,F1:0.3789,loss:1.087
[14:35:42] epoch:11, OA: 58.23%, Kappa: 0.2987, cls Acc: [78.89, 37.57], P:0.5234,R:0.4987,F1:0.4789,loss:0.854
[14:40:58] epoch:12, 内存不足错误
[14:41:02] 训练中断: CUDA out of memory
[14:41:05] 错误详情: RuntimeError: CUDA out of memory. Tried to allocate 2.34 GiB
[14:41:06] 训练失败`]
]);

// Mock live log events for running jobs
export const mockLiveLogEvents = new Map<string, string[]>([
  ['train_002', [
    '[11:45:12] epoch:32, OA: 72.34%, Kappa: 0.6234, cls Acc: [85.67, 59.01], P:0.7123,R:0.6987,F1:0.6834,loss:0.567',
    '[11:50:25] epoch:33, OA: 73.12%, Kappa: 0.6345, cls Acc: [86.23, 60.01], P:0.7189,R:0.7045,F1:0.6923,loss:0.554',
    '[11:55:38] epoch:34, OA: 73.89%, Kappa: 0.6456, cls Acc: [86.78, 61.00], P:0.7245,R:0.7102,F1:0.7012,loss:0.542',
  ]]
]);

// Utility functions
export const getNextTrainJobId = (): number => {
  return Math.max(...mockTrainJobs.map(job => job.id)) + 1;
};

export const getNextValJobId = (): number => {
  return Math.max(...mockValJobs.map(job => job.id)) + 1;
};

export const findTrainJobById = (jobId: string): TrainJob | undefined => {
  return mockTrainJobs.find(job => job.job_id === jobId);
};

export const findValJobById = (jobId: string): ValJob | undefined => {
  return mockValJobs.find(job => job.val_job_id === jobId);
};

export const updateTrainJobStatus = (jobId: string, status: JobStatus, progress: number): boolean => {
  const job = findTrainJobById(jobId);
  if (job) {
    job.status = status;
    job.progress = progress;
    job.updateTime = new Date();
    return true;
  }
  return false;
};

export const addTrainJob = (job: Omit<TrainJob, 'id'>): TrainJob => {
  const newJob: TrainJob = {
    ...job,
    id: getNextTrainJobId(),
  };
  mockTrainJobs.push(newJob);
  return newJob;
};

export const addValJob = (job: Omit<ValJob, 'id'>): ValJob => {
  const newJob: ValJob = {
    ...job,
    id: getNextValJobId(),
  };
  mockValJobs.push(newJob);
  return newJob;
};