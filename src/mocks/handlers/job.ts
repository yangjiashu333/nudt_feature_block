import { http, HttpResponse } from 'msw';
import type {
  TrainStartRequest,
  TrainStartReply,
  ValStartRequest,
  ValStartReply,
  TrainStatusReply,
  TrainJobList,
  ValJobLIst,
  TrainLogReply,
  TrainResultReply,
  ValResultReply,
} from '@/types/job';
import {
  mockTrainJobs,
  mockValJobs,
  mockOfflineLogs,
  mockLiveLogEvents,
  addTrainJob,
  addValJob,
  findTrainJobById,
  findValJobById,
  updateTrainJobStatus,
} from '../data/jobs';
import { mockSession } from '../data/session';

const eventStreamClients: Map<
  string,
  { controller: ReadableStreamDefaultController; interval: NodeJS.Timeout }
> = new Map();

export const jobHandlers = [
  // 开始训练任务
  http.post('*/api/train/start', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const data = (await request.json()) as Partial<TrainStartRequest>;

    // 生成新的任务ID
    const jobId = `train_${String(Date.now()).slice(-6)}`;
    const celeryTaskId = `celery_${jobId}`;

    // 创建新的训练任务
    const cfg = (data.config as Record<string, unknown> | undefined) ?? {};
    const featureIdsRaw = cfg?.feature_ids;
    const featureIds = Array.isArray(featureIdsRaw)
      ? featureIdsRaw
      : featureIdsRaw != null
        ? [featureIdsRaw]
        : [1];

    const newJob = addTrainJob({
      job_id: jobId,
      user_id: data.user_id ?? 1,
      dataset_id: data.dataset_id ?? 1,
      nodes: (data.nodes as Record<string, number>) ?? {},
      backbone_id: data.backbone_id ?? 1,
      classifier_id: data.classifier_id ?? 1,
      feature_ids: featureIds,
      adaptive: data.adaptive === 1,
      status: 'pending',
      progress: 0,
      result: {},
      model_path: '',
      log_path: `/logs/${jobId}/training.log`,
      createTime: new Date(),
      updateTime: new Date(),
    });

    // 模拟训练开始
    setTimeout(() => {
      updateTrainJobStatus(jobId, 'running', 5);
    }, 2000);

    const response: TrainStartReply = {
      message: '训练任务已启动',
      celery_task_id: celeryTaskId,
      job_id: jobId,
      id: newJob.id,
    };

    return HttpResponse.json(response);
  }),

  // 获取训练任务列表
  http.get('*/api/train', async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const response: TrainJobList = [...mockTrainJobs];
    return HttpResponse.json(response);
  }),

  // 获取训练状态
  http.get('*/api/train/status/:jobId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const jobId = params.jobId as string;
    const job = findTrainJobById(jobId);

    if (!job) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    const response: TrainStatusReply = {
      progress: job.progress,
      status: job.status,
    };

    return HttpResponse.json(response);
  }),

  // 获取离线日志文件
  http.get('*/api/train/logs_file/:jobId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const jobId = params.jobId as string;
    const job = findTrainJobById(jobId);

    if (!job) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    const logContent = mockOfflineLogs.get(jobId) || '暂无日志数据';

    const response: TrainLogReply = {
      log: logContent,
    };

    return HttpResponse.json(response);
  }),

  // 获取训练结果
  http.get('*/api/train/result/:jobId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const jobId = params.jobId as string;
    const job = findTrainJobById(jobId);

    if (!job) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    if (job.status !== 'done') {
      return HttpResponse.json({ message: '任务尚未完成' }, { status: 400 });
    }

    const response: TrainResultReply = job.result;
    return HttpResponse.json(response);
  }),

  // SSE实时日志流
  http.get('*/api/train/logs/:jobId', ({ params }) => {
    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const jobId = params.jobId as string;
    const job = findTrainJobById(jobId);

    if (!job) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    // 创建SSE流
    const stream = new ReadableStream({
      start(controller) {
        // 模拟实时日志推送
        const logLines = mockLiveLogEvents.get(jobId) || [];
        let lineIndex = 0;

        const interval = setInterval(() => {
          if (lineIndex < logLines.length) {
            const line = logLines[lineIndex];
            const data = `data: ${line}\n\n`;
            controller.enqueue(new TextEncoder().encode(data));
            lineIndex++;
          } else {
            // 继续生成新的日志行（模拟进行中的训练）
            if (job.status === 'running') {
              const currentEpoch = 35 + Math.floor(Math.random() * 20);
              const oa = 74 + Math.random() * 10;
              const kappa = 0.65 + Math.random() * 0.15;
              const loss = 0.5 - Math.random() * 0.2;

              const timestamp = new Date().toTimeString().slice(0, 8);
              const logLine = `[${timestamp}] epoch:${currentEpoch}, OA: ${oa.toFixed(2)}%, Kappa: ${kappa.toFixed(4)}, cls Acc: [${(85 + Math.random() * 5).toFixed(2)}, ${(60 + Math.random() * 10).toFixed(2)}], P:${(0.7 + Math.random() * 0.1).toFixed(4)},R:${(0.7 + Math.random() * 0.1).toFixed(4)},F1:${(0.7 + Math.random() * 0.1).toFixed(4)},loss:${loss.toFixed(3)}`;

              const data = `data: ${logLine}\n\n`;
              controller.enqueue(new TextEncoder().encode(data));

              // 模拟进度更新
              if (Math.random() > 0.7) {
                job.progress = Math.min(100, job.progress + Math.floor(Math.random() * 5));
                if (job.progress >= 100) {
                  job.status = 'done';
                  clearInterval(interval);
                  controller.close();
                }
              }
            } else {
              // 任务已结束，关闭流
              clearInterval(interval);
              controller.close();
            }
          }
        }, 2000); // 每2秒推送一条日志

        // 保存引用以便后续清理
        eventStreamClients.set(jobId, { controller, interval });
      },
      cancel() {
        const client = eventStreamClients.get(jobId);
        if (client) {
          clearInterval(client.interval);
          eventStreamClients.delete(jobId);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  }),

  // 开始验证任务
  http.post('*/api/val/start', async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const data = (await request.json()) as ValStartRequest;

    // 检查训练任务是否存在且已完成
    const trainJob = findTrainJobById(data.train_job_id);
    if (!trainJob) {
      return HttpResponse.json({ message: '训练任务不存在' }, { status: 404 });
    }

    if (trainJob.status !== 'done') {
      return HttpResponse.json({ message: '训练任务尚未完成' }, { status: 400 });
    }

    // 生成新的验证任务ID
    const valJobId = `val_${String(Date.now()).slice(-6)}`;
    const celeryTaskId = `celery_${valJobId}`;

    // 创建新的验证任务
    const newJob = addValJob({
      val_job_id: valJobId,
      train_job_id: data.train_job_id,
      user_id: data.user_id,
      config: {
        test_dataset_id: trainJob.dataset_id,
        batch_size: 32,
        metrics: ['accuracy', 'precision', 'recall', 'f1'],
      },
      result: {},
      status: 'pending',
      createTime: new Date(),
      updateTime: new Date(),
    });

    // 模拟验证开始并快速完成
    setTimeout(() => {
      newJob.status = 'done';
      newJob.result = {
        accuracy: 0.82 + Math.random() * 0.05,
        precision: 0.81 + Math.random() * 0.05,
        recall: 0.8 + Math.random() * 0.05,
        f1: 0.805 + Math.random() * 0.05,
      };
      newJob.updateTime = new Date();
    }, 3000);

    const response: ValStartReply = {
      message: '验证任务已启动',
      celery_task_id: celeryTaskId,
      val_job_id: valJobId,
      id: newJob.id,
    };

    return HttpResponse.json(response);
  }),

  // 获取验证任务列表
  http.get('*/api/val', async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const response: ValJobLIst = [...mockValJobs];
    return HttpResponse.json(response);
  }),

  // 获取验证结果
  http.get('*/api/val/result/:jobId', async ({ params }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockSession.isAuthenticated()) {
      return HttpResponse.json({ message: '未登录或登录已过期' }, { status: 401 });
    }

    const jobId = params.jobId as string;
    const job = findValJobById(jobId);

    if (!job) {
      return HttpResponse.json({ message: '验证任务不存在' }, { status: 404 });
    }

    if (job.status !== 'done') {
      return HttpResponse.json({ message: '验证任务尚未完成' }, { status: 400 });
    }

    const response: ValResultReply = job.result;
    return HttpResponse.json(response);
  }),
];

// 清理函数，在需要时调用
export const cleanupEventStreams = () => {
  eventStreamClients.forEach(({ interval }) => {
    clearInterval(interval);
  });
  eventStreamClients.clear();
};
