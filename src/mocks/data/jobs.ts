import type { TrainJob, ValJob, TrainResult, ValResult } from '@/types/job';

// 模拟训练结果数据
const mockTrainResults: TrainResult[] = [
  {
    epoch: 50,
    accuracy: 89.5,
    loss: 0.25,
    kappa: 0.85,
    precision: 0.88,
    recall: 0.87,
    f1Score: 0.875,
    confusionMatrix: [
      [45, 3, 2],
      [2, 38, 1],
      [1, 2, 47],
    ],
    classAccuracy: [90.0, 92.7, 94.0],
    trainingTime: 3600, // seconds
    bestEpoch: 45,
    learningCurve: {
      epochs: Array.from({ length: 50 }, (_, i) => i + 1),
      trainLoss: Array.from({ length: 50 }, (_, i) => 1.5 - i * 0.025 + Math.random() * 0.1),
      valLoss: Array.from({ length: 50 }, (_, i) => 1.6 - i * 0.024 + Math.random() * 0.15),
      trainAcc: Array.from({ length: 50 }, (_, i) => 0.3 + i * 0.012 + Math.random() * 0.02),
      valAcc: Array.from({ length: 50 }, (_, i) => 0.25 + i * 0.011 + Math.random() * 0.03),
    },
  },
  {
    epoch: 30,
    accuracy: 76.2,
    loss: 0.45,
    kappa: 0.72,
    precision: 0.74,
    recall: 0.73,
    f1Score: 0.735,
    confusionMatrix: [
      [42, 5, 3],
      [4, 35, 2],
      [3, 4, 44],
    ],
    classAccuracy: [84.0, 85.4, 86.3],
    trainingTime: 2400,
    bestEpoch: 28,
    learningCurve: {
      epochs: Array.from({ length: 30 }, (_, i) => i + 1),
      trainLoss: Array.from({ length: 30 }, (_, i) => 1.8 - i * 0.04 + Math.random() * 0.15),
      valLoss: Array.from({ length: 30 }, (_, i) => 1.9 - i * 0.038 + Math.random() * 0.2),
      trainAcc: Array.from({ length: 30 }, (_, i) => 0.2 + i * 0.018 + Math.random() * 0.03),
      valAcc: Array.from({ length: 30 }, (_, i) => 0.18 + i * 0.016 + Math.random() * 0.04),
    },
  },
];

// 模拟验证结果数据
const mockValResults: ValResult[] = [
  {
    accuracy: 91.2,
    kappa: 0.88,
    precision: 0.9,
    recall: 0.89,
    f1Score: 0.895,
    confusionMatrix: [
      [48, 1, 1],
      [1, 39, 1],
      [0, 1, 49],
    ],
    classAccuracy: [96.0, 95.1, 98.0],
    validationTime: 120,
    totalSamples: 140,
    comparison: {
      accuracyDiff: 1.7, // 比训练提高了1.7%
      kappaDiff: 0.03,
      precisionDiff: 0.02,
      recallDiff: 0.02,
      f1Diff: 0.02,
    },
  },
  {
    accuracy: 78.8,
    kappa: 0.75,
    precision: 0.77,
    recall: 0.76,
    f1Score: 0.765,
    confusionMatrix: [
      [43, 4, 3],
      [3, 36, 2],
      [2, 3, 45],
    ],
    classAccuracy: [86.0, 87.8, 90.0],
    validationTime: 95,
    totalSamples: 140,
    comparison: {
      accuracyDiff: 2.6,
      kappaDiff: 0.03,
      precisionDiff: 0.03,
      recallDiff: 0.03,
      f1Diff: 0.03,
    },
  },
];

// 模拟训练任务数据
export const mockTrainJobs: TrainJob[] = [
  {
    id: 1,
    job_id: 'train_001',
    user_id: 1,
    dataset_id: 1,
    nodes: { input: 256, hidden: 128, output: 3 },
    backbone_id: 1,
    classifier_id: 1,
    feature_ids: [1, 2, 3],
    adaptive: true,
    status: 'done',
    progress: 100,
    result: mockTrainResults[0],
    model_path: '/models/train_001/model.pth',
    log_path: '/logs/train_001.log',
    createTime: new Date('2024-12-01T10:00:00Z'),
    updateTime: new Date('2024-12-01T11:30:00Z'),
  },
  {
    id: 2,
    job_id: 'train_002',
    user_id: 1,
    dataset_id: 2,
    nodes: { input: 512, hidden: 256, output: 5 },
    backbone_id: 2,
    classifier_id: 2,
    feature_ids: [2, 3, 4],
    adaptive: false,
    status: 'running',
    progress: 65,
    result: {},
    model_path: '/models/train_002/model.pth',
    log_path: '/logs/train_002.log',
    createTime: new Date('2024-12-02T09:00:00Z'),
    updateTime: new Date('2024-12-02T10:45:00Z'),
  },
  {
    id: 3,
    job_id: 'train_003',
    user_id: 2,
    dataset_id: 3,
    nodes: { input: 128, hidden: 64, output: 2 },
    backbone_id: 1,
    classifier_id: 3,
    feature_ids: [1, 3],
    adaptive: true,
    status: 'pending',
    progress: 0,
    result: {},
    model_path: '/models/train_003/model.pth',
    log_path: '/logs/train_003.log',
    createTime: new Date('2024-12-02T14:00:00Z'),
    updateTime: new Date('2024-12-02T14:00:00Z'),
  },
  {
    id: 4,
    job_id: 'train_004',
    user_id: 1,
    dataset_id: 1,
    nodes: { input: 256, hidden: 128, output: 3 },
    backbone_id: 3,
    classifier_id: 1,
    feature_ids: [1, 2],
    adaptive: true,
    status: 'failed',
    progress: 25,
    result: {},
    model_path: '/models/train_004/model.pth',
    log_path: '/logs/train_004.log',
    createTime: new Date('2024-12-01T15:00:00Z'),
    updateTime: new Date('2024-12-01T15:30:00Z'),
  },
  {
    id: 5,
    job_id: 'train_005',
    user_id: 2,
    dataset_id: 2,
    nodes: { input: 512, hidden: 256, output: 5 },
    backbone_id: 2,
    classifier_id: 2,
    feature_ids: [2, 3, 4, 5],
    adaptive: false,
    status: 'done',
    progress: 100,
    result: mockTrainResults[1],
    model_path: '/models/train_005/model.pth',
    log_path: '/logs/train_005.log',
    createTime: new Date('2024-11-28T08:00:00Z'),
    updateTime: new Date('2024-11-28T10:00:00Z'),
  },
];

// 模拟验证任务数据
export const mockValJobs: ValJob[] = [
  {
    id: 1,
    val_job_id: 'val_001',
    train_job_id: 'train_001',
    user_id: 1,
    config: {
      test_split: 0.2,
      batch_size: 32,
      metrics: ['accuracy', 'kappa', 'f1'],
    },
    result: mockValResults[0],
    status: 'done',
    createTime: new Date('2024-12-01T11:35:00Z'),
    updateTime: new Date('2024-12-01T11:40:00Z'),
  },
  {
    id: 2,
    val_job_id: 'val_002',
    train_job_id: 'train_005',
    user_id: 2,
    config: {
      test_split: 0.15,
      batch_size: 64,
      metrics: ['accuracy', 'kappa', 'precision', 'recall', 'f1'],
    },
    result: mockValResults[1],
    status: 'done',
    createTime: new Date('2024-11-28T10:05:00Z'),
    updateTime: new Date('2024-11-28T10:10:00Z'),
  },
  {
    id: 3,
    val_job_id: 'val_003',
    train_job_id: 'train_002',
    user_id: 1,
    config: {
      test_split: 0.2,
      batch_size: 32,
      metrics: ['accuracy', 'kappa'],
    },
    result: {},
    status: 'pending',
    createTime: new Date('2024-12-02T10:50:00Z'),
    updateTime: new Date('2024-12-02T10:50:00Z'),
  },
];

// 模拟训练日志数据
export const mockTrainLogs = {
  train_001: `[10:00:15] 开始训练
[10:00:20] 初始化模型参数
[10:00:25] epoch:0, OA: 35.24%, Kappa: 0.1970, cls Acc: [89.58, 26.24, 15.0], P:0.4552,R:0.4194,F1:0.3493,loss:1.25
[10:02:30] epoch:1, OA: 42.18%, Kappa: 0.2845, cls Acc: [91.20, 35.80, 22.5], P:0.5234,R:0.4891,F1:0.4321,loss:1.08
[10:04:35] epoch:2, OA: 48.95%, Kappa: 0.3612, cls Acc: [92.15, 44.20, 31.8], P:0.5891,R:0.5445,F1:0.5123,loss:0.95
[10:30:12] epoch:25, OA: 76.32%, Kappa: 0.6847, cls Acc: [95.20, 78.50, 65.4], P:0.7823,R:0.7456,F1:0.7612,loss:0.45
[11:15:45] epoch:45, OA: 89.45%, Kappa: 0.8512, cls Acc: [96.80, 88.20, 83.6], P:0.8934,R:0.8756,F1:0.8823,loss:0.25
[11:28:30] epoch:50, OA: 89.50%, Kappa: 0.8500, cls Acc: [90.0, 92.7, 94.0], P:0.8800,R:0.8700,F1:0.8750,loss:0.25
[11:30:00] 训练完成，保存模型`,

  train_002: `[09:00:10] 开始训练
[09:00:15] 初始化模型参数
[09:00:20] epoch:0, OA: 28.64%, Kappa: 0.1523, cls Acc: [85.20, 22.40, 12.8, 18.5, 25.3], P:0.3845,R:0.3521,F1:0.2987,loss:1.65
[09:02:45] epoch:1, OA: 34.82%, Kappa: 0.2156, cls Acc: [87.50, 28.90, 18.7, 23.2, 31.8], P:0.4234,R:0.3891,F1:0.3456,loss:1.48
[09:04:50] epoch:2, OA: 41.23%, Kappa: 0.2845, cls Acc: [89.20, 35.60, 25.4, 29.8, 38.2], P:0.4789,R:0.4345,F1:0.4012,loss:1.32
[10:45:20] 正在训练中... epoch:32, OA: 65.48%, Kappa: 0.5623, cls Acc: [92.80, 68.20, 58.4, 61.7, 65.9], P:0.6789,R:0.6234,F1:0.6456,loss:0.68`,

  train_003: `[14:00:05] 任务已创建，等待开始`,

  train_004: `[15:00:10] 开始训练
[15:00:15] 初始化模型参数
[15:00:20] epoch:0, OA: 32.15%, Kappa: 0.1845, cls Acc: [88.50, 24.80, 16.2], P:0.4123,R:0.3789,F1:0.3234,loss:1.35
[15:15:25] epoch:5, OA: 45.67%, Kappa: 0.3256, cls Acc: [90.20, 38.40, 28.9], P:0.5012,R:0.4567,F1:0.4234,loss:1.05
[15:30:12] 错误：内存不足，训练中断`,

  train_005: `[08:00:10] 开始训练
[08:00:15] 初始化模型参数
[08:00:20] epoch:0, OA: 24.85%, Kappa: 0.1234, cls Acc: [82.40, 18.60, 10.5, 14.2, 20.8], P:0.3456,R:0.3123,F1:0.2789,loss:1.85
[08:45:30] epoch:15, OA: 58.32%, Kappa: 0.4567, cls Acc: [88.70, 52.40, 45.8, 49.2, 55.5], P:0.6123,R:0.5678,F1:0.5456,loss:0.82
[09:30:45] epoch:28, OA: 76.15%, Kappa: 0.7234, cls Acc: [91.50, 74.20, 68.9, 72.3, 78.1], P:0.7456,R:0.7123,F1:0.7234,loss:0.45
[10:00:00] epoch:30, OA: 76.20%, Kappa: 0.7200, cls Acc: [84.0, 85.4, 86.3], P:0.7400,R:0.7300,F1:0.7350,loss:0.45
[10:00:30] 训练完成，保存模型`,
};

// 模拟实时日志流数据 (用于SSE)
export const generateMockLogStream = (_jobId: string) => {
  const logs = [
    `epoch:33, OA: 66.82%, Kappa: 0.5789, cls Acc: [93.20, 69.50, 59.8, 63.2, 67.4], P:0.6823,R:0.6345,F1:0.6512,loss:0.65`,
    `epoch:34, OA: 67.95%, Kappa: 0.5912, cls Acc: [93.50, 70.80, 61.2, 64.5, 68.7], P:0.6934,R:0.6456,F1:0.6623,loss:0.63`,
    `epoch:35, OA: 69.12%, Kappa: 0.6045, cls Acc: [93.80, 72.10, 62.6, 65.8, 70.1], P:0.7045,R:0.6567,F1:0.6734,loss:0.61`,
    `epoch:36, OA: 70.28%, Kappa: 0.6178, cls Acc: [94.10, 73.40, 64.0, 67.1, 71.4], P:0.7156,R:0.6678,F1:0.6845,loss:0.59`,
    `epoch:37, OA: 71.45%, Kappa: 0.6311, cls Acc: [94.40, 74.70, 65.4, 68.4, 72.7], P:0.7267,R:0.6789,F1:0.6956,loss:0.57`,
  ];

  return logs.map((log) => `[${new Date().toLocaleTimeString()}] ${log}`);
};
