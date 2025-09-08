import type { TrainJob, ValJob } from '@/types/job';

// 模拟训练任务数据（根据你提供的数据构造），状态 completed 映射为 done
export const mockTrainJobs: TrainJob[] = [
  {
    backbone_id: 1,
    classifier_id: 1,
    createTime: new Date('2025-08-08T20:45:36'),
    dataset_id: 1,
    feature_ids: 1,
    id: 20,
    job_id: 'c0b19cdd-175e-40d5-acf1-e74cf200bac3',
    model_path:
      'C:/Users/Fang Hao/PycharmProjects/demo/model_ckp/c0b19cdd-175e-40d5-acf1-e74cf200bac3/model_best.pth',
    log_path:
      'C:/Users/Fang Hao/PycharmProjects/demo/logs/c0b19cdd-175e-40d5-acf1-e74cf200bac3.log',
    nodes: {},
    progress: 100,
    result: {
      Best: { OA: 40.785, ep: 0, kappa: 0.0 },
      Metrics: [
        {
          Class_Accuracy: [100.0, 0.0, 0.0],
          F1: 0.1931,
          Kappa: 0.0,
          OA: 40.785,
          Precision: 0.1359,
          Recall: 0.3333,
          Test_Loss: 1.2078,
          Train_Loss: 1.1668,
          epoch: 0,
        },
        {
          Class_Accuracy: [100.0, 0.0, 0.0],
          F1: 0.1931,
          Kappa: 0.0,
          OA: 40.785,
          Precision: 0.1359,
          Recall: 0.3333,
          Test_Loss: 1.0082,
          Train_Loss: 0.971,
          epoch: 1,
        },
      ],
      Test_Loss: [1.207814395427704, 1.008150935173035],
      Train_Loss: [1.166832983493805, 0.970952719449997],
    },
    status: 'done',
    updateTime: new Date('2025-08-08T20:45:56'),
    user_id: 1,
    adaptive: false,
  },
  {
    backbone_id: 1,
    classifier_id: 1,
    createTime: new Date('2025-08-11T18:37:17'),
    dataset_id: 1,
    feature_ids: 1,
    id: 21,
    job_id: '750c7c47-df45-4393-86e8-8f50a80bad0e',
    model_path:
      'C:/Users/Fang Hao/PycharmProjects/demo/model_ckp/750c7c47-df45-4393-86e8-8f50a80bad0e/model_best.pth',
    log_path: 'C:/Users/Fang Hao/PycharmProjects/demo/logs/750c7c47-df45-4393-86e8-8f50a80bad0e.log',
    nodes: {},
    progress: 100,
    result: {
      Best: { OA: 41.6382, ep: 1, kappa: 0.0121 },
      Metrics: [
        {
          Class_Accuracy: [99.16, 0.0, 0.0],
          F1: 0.1932,
          Kappa: -0.003,
          OA: 40.4437,
          Precision: 0.1364,
          Recall: 0.3305,
          Test_Loss: 1.0668,
          Train_Loss: 1.1496,
          epoch: 0,
        },
        {
          Class_Accuracy: [99.58, 2.13, 0.0],
          F1: 0.2106,
          Kappa: 0.0121,
          OA: 41.6382,
          Precision: 0.2457,
          Recall: 0.339,
          Test_Loss: 0.9062,
          Train_Loss: 1.134,
          epoch: 1,
        },
      ],
      Test_Loss: [1.0667852878570556, 0.9062122166156767],
      Train_Loss: [1.1496276259422302, 1.1340494453907013],
    },
    status: 'done',
    updateTime: new Date('2025-08-11T18:38:06'),
    user_id: 1,
    adaptive: false,
  },
];

// 模拟验证任务数据（根据你提供的数据构造），状态 completed 映射为 done
export const mockValJobs: ValJob[] = [
  {
    config: {
      data: {
        batch_size: 64,
        img_size: [128, 128],
        is_aug: true,
        mode: 'SAR',
        name: 'FUSAR',
        num_classes: 3,
        num_workers: 0,
        root: 'data/FUSAR_Ship1.0',
        shuffle: true,
        train_ratio: 0.1,
      },
      feature_combinations: [
        'extract_HOG_energy_features',
        'extract_ring_energy_features',
        'extract_stmf05',
        'get_band_energy_ratio',
        'micro_uniform_mean_features',
        'motion_uniform_mean_features',
      ],
      is_nas: false,
      is_ssl: false,
      model: {
        Cross_attention: { is_attention: true },
        GNN: { dropout: 0.1, is_GNN: true, k: 4, n_blocks: 4, n_nodes: 64 },
        backbone: 'resnet18',
        d_model: 128,
        output_layer: 'fc',
        pretrained: false,
      },
      training: {
        checkpoint_dir: 'model_ckp',
        device: 'cuda',
        epochs: 2,
        optimizer: { lr: 0.001, momentum: 0.9, type: 'Adam', weight_decay: 0.0001 },
      },
    },
    createTime: new Date('2025-08-12T18:00:04'),
    id: 6,
    result: { error: "type Tensor doesn't define __round__ method" },
    status: 'failed',
    train_job_id: '750c7c47-df45-4393-86e8-8f50a80bad0e',
    updateTime: new Date('2025-08-12T18:00:31'),
    user_id: 1,
    val_job_id: '55b492fd-6e23-4e3b-841e-187e1b5ea86b',
  },
  {
    config: {
      data: {
        batch_size: 64,
        img_size: [128, 128],
        is_aug: true,
        mode: 'SAR',
        name: 'FUSAR',
        num_classes: 3,
        num_workers: 0,
        root: 'data/FUSAR_Ship1.0',
        shuffle: true,
        train_ratio: 0.1,
      },
      feature_combinations: [
        'extract_HOG_energy_features',
        'extract_ring_energy_features',
        'extract_stmf05',
        'get_band_energy_ratio',
        'micro_uniform_mean_features',
        'motion_uniform_mean_features',
      ],
      is_nas: false,
      is_ssl: false,
      model: {
        Cross_attention: { is_attention: true },
        GNN: { dropout: 0.1, is_GNN: true, k: 4, n_blocks: 4, n_nodes: 64 },
        backbone: 'resnet18',
        d_model: 128,
        output_layer: 'fc',
        pretrained: false,
      },
      training: {
        checkpoint_dir: 'model_ckp',
        device: 'cuda',
        epochs: 2,
        optimizer: { lr: 0.001, momentum: 0.9, type: 'Adam', weight_decay: 0.0001 },
      },
    },
    createTime: new Date('2025-08-12T22:14:58'),
    id: 7,
    result: {
      Loss: [
        0.9441893100738524,
        0.8810076117515564,
        0.914731502532959,
        0.9688717126846312,
        0.9309383630752563,
        0.866421639919281,
        0.8599544167518616,
        0.930332362651825,
        0.9246468544006348,
        0.8683145642280579,
      ],
      Metrics: {
        Class_Accuracy: [99.58, 2.13, 0.0],
        F1: 0.2106,
        Kappa: 0.0121,
        OA: 41.6382,
        Precision: 0.2457,
        Recall: 0.339,
      },
    },
    status: 'done',
    train_job_id: '750c7c47-df45-4393-86e8-8f50a80bad0e',
    updateTime: new Date('2025-08-12T22:15:19'),
    user_id: 1,
    val_job_id: '4fc9e072-54b1-4376-8195-88c780292e0a',
  },
];

// 静态训练日志（为上述两个任务提供示例）
export const mockTrainLogs = {
  'c0b19cdd-175e-40d5-acf1-e74cf200bac3': `[10:00:10] 开始训练
[10:00:20] epoch:0, OA: 40.785%, Kappa: 0.0000, cls Acc: [100.0, 0.0, 0.0], P:0.1359,R:0.3333,F1:0.1931,loss:1.1668
[10:01:20] epoch:1, OA: 40.785%, Kappa: 0.0000, cls Acc: [100.0, 0.0, 0.0], P:0.1359,R:0.3333,F1:0.1931,loss:0.9710
[10:02:00] 训练完成，保存模型`,
  '750c7c47-df45-4393-86e8-8f50a80bad0e': `[18:37:20] 开始训练
[18:37:40] epoch:0, OA: 40.4437%, Kappa: -0.0030, cls Acc: [99.16, 0.0, 0.0], P:0.1364,R:0.3305,F1:0.1932,loss:1.1496
[18:38:00] epoch:1, OA: 41.6382%, Kappa: 0.0121, cls Acc: [99.58, 2.13, 0.0], P:0.2457,R:0.3390,F1:0.2106,loss:1.1340
[18:38:10] 训练完成，保存模型`,
};

// 模拟实时日志流数据 (用于SSE)
export const generateMockLogStream = (_jobId: string) => {
  const logs = [
    `epoch:0, OA: 40.44%, Kappa: -0.0030, cls Acc: [99.16, 0.0, 0.0], P:0.1364,R:0.3305,F1:0.1932,loss:1.1496`,
    `epoch:1, OA: 41.64%, Kappa: 0.0121, cls Acc: [99.58, 2.13, 0.0], P:0.2457,R:0.3390,F1:0.2106,loss:1.1340`,
  ];
  return logs.map((log) => `[${new Date().toLocaleTimeString()}] ${log}`);
};
