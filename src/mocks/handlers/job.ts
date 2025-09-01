import { http, HttpResponse, delay } from 'msw';
import type { 
  TrainStartRequest, 
  TrainStartReply, 
  ValStartRequest, 
  ValStartReply,
  TrainStatusReply,
  TrainLogReply,
  TrainResultReply,
  ValResultReply
} from '@/types/job';
import type { JobStatus } from '@/types/common';
import { mockTrainJobs, mockValJobs, mockTrainLogs, generateMockLogStream } from '@/mocks/data/jobs';

// 模拟任务状态存储（用于模拟状态变化）
const jobStatusMap = new Map<string, { status: JobStatus; progress: number; }>();

// 初始化任务状态
mockTrainJobs.forEach(job => {
  jobStatusMap.set(job.job_id, { 
    status: job.status, 
    progress: job.progress 
  });
});

// 模拟状态变化（仅对运行中的任务）
setInterval(() => {
  mockTrainJobs.forEach(job => {
    const currentStatus = jobStatusMap.get(job.job_id);
    if (currentStatus?.status === 'running') {
      const newProgress = Math.min(100, currentStatus.progress + Math.random() * 5);
      if (newProgress >= 100) {
        jobStatusMap.set(job.job_id, { status: 'done', progress: 100 });
      } else {
        jobStatusMap.set(job.job_id, { 
          status: 'running', 
          progress: Math.floor(newProgress) 
        });
      }
    }
  });
}, 5000); // 每5秒更新一次

export const jobHandlers = [
  // POST /api/train/start - 开始训练任务
  http.post<never, TrainStartRequest>('*/api/train/start', async ({ request }) => {
    await delay(500); // 模拟API延迟
    
    const body = await request.json();
    
    // 生成新的任务ID
    const newJobId = `train_${Date.now()}`;
    const celeryTaskId = `celery_${Date.now()}`;
    
    // 添加到任务列表
    const newJob = {
      id: mockTrainJobs.length + 1,
      job_id: newJobId,
      user_id: body.user_id,
      dataset_id: body.dataset_id,
      nodes: body.nodes as Record<string, number>,
      backbone_id: body.backbone_id,
      classifier_id: body.classifier_id,
      feature_ids: 1, // 简化处理
      adaptive: Boolean(body.adaptive),
      status: 'pending' as JobStatus,
      progress: 0,
      result: {},
      model_path: `/models/${newJobId}/model.pth`,
      log_path: `/logs/${newJobId}.log`,
      createTime: new Date(),
      updateTime: new Date()
    };
    
    mockTrainJobs.push(newJob);
    jobStatusMap.set(newJobId, { status: 'pending', progress: 0 });
    
    // 模拟任务自动开始
    setTimeout(() => {
      jobStatusMap.set(newJobId, { status: 'running', progress: 1 });
    }, 2000);
    
    const response: TrainStartReply = {
      message: 'Training job started successfully',
      celery_task_id: celeryTaskId,
      job_id: newJobId,
      id: newJob.id
    };
    
    return HttpResponse.json(response);
  }),

  // POST /api/val/start - 开始验证任务
  http.post<never, ValStartRequest>('*/api/val/start', async ({ request }) => {
    await delay(300);
    
    const body = await request.json();
    const newValJobId = `val_${Date.now()}`;
    const celeryTaskId = `celery_val_${Date.now()}`;
    
    // 检查训练任务是否存在且完成
    const trainJob = mockTrainJobs.find(job => job.job_id === body.train_job_id);
    if (!trainJob || trainJob.status !== 'done') {
      return new HttpResponse(
        JSON.stringify({ message: 'Training job not found or not completed' }), 
        { status: 400 }
      );
    }
    
    const newValJob = {
      id: mockValJobs.length + 1,
      val_job_id: newValJobId,
      train_job_id: body.train_job_id,
      user_id: body.user_id,
      config: {
        test_split: 0.2,
        batch_size: 32,
        metrics: ['accuracy', 'kappa', 'f1']
      },
      result: {},
      status: 'pending' as JobStatus,
      createTime: new Date(),
      updateTime: new Date()
    };
    
    mockValJobs.push(newValJob);
    
    // 模拟验证任务快速完成
    setTimeout(() => {
      newValJob.status = 'done';
      // 这里可以设置验证结果
    }, 3000);
    
    const response: ValStartReply = {
      message: 'Validation job started successfully',
      celery_task_id: celeryTaskId,
      val_job_id: newValJobId,
      id: newValJob.id
    };
    
    return HttpResponse.json(response);
  }),

  // GET /api/train/status/<job_id> - 获取训练任务状态
  http.get('*/api/train/status/:jobId', async ({ params }) => {
    await delay(50); // 大幅减少延迟
    
    try {
      const { jobId } = params;
      const status = jobStatusMap.get(jobId as string) || { status: 'pending' as JobStatus, progress: 0 };
      
      const response: TrainStatusReply = {
        status: status.status,
        progress: status.progress
      };
      
      return HttpResponse.json(response);
    } catch (error) {
      console.error(`Error getting status for job ${params.jobId}:`, error);
      return new HttpResponse(
        JSON.stringify({ message: 'Failed to get job status' }), 
        { status: 404 }
      );
    }
  }),

  // GET /api/train - 获取训练任务列表
  http.get('*/api/train', async () => {
    await delay(100); // 减少延迟
    
    try {
      // 更新任务状态
      const updatedJobs = mockTrainJobs.map(job => {
        const currentStatus = jobStatusMap.get(job.job_id) || { status: job.status, progress: job.progress };
        return {
          ...job,
          status: currentStatus.status,
          progress: currentStatus.progress,
          updateTime: currentStatus.status !== job.status ? new Date() : job.updateTime
        };
      });
      
      return HttpResponse.json(updatedJobs);
    } catch (error) {
      console.error('Error in /api/train handler:', error);
      return new HttpResponse(
        JSON.stringify({ message: 'Internal server error' }), 
        { status: 500 }
      );
    }
  }),

  // GET /api/val - 获取验证任务列表
  http.get('*/api/val', async () => {
    await delay(100); // 减少延迟
    
    try {
      return HttpResponse.json(mockValJobs);
    } catch (error) {
      console.error('Error in /api/val handler:', error);
      return new HttpResponse(
        JSON.stringify({ message: 'Internal server error' }), 
        { status: 500 }
      );
    }
  }),

  // GET /api/train/logs_file/<job_id> - 获取训练日志文件
  http.get('*/api/train/logs_file/:jobId', async ({ params }) => {
    await delay(400);
    
    const { jobId } = params;
    const log = mockTrainLogs[jobId as keyof typeof mockTrainLogs] || '日志文件不存在';
    
    const response: TrainLogReply = {
      log
    };
    
    return HttpResponse.json(response);
  }),

  // GET /api/train/result/<job_id> - 获取训练结果
  http.get('*/api/train/result/:jobId', async ({ params }) => {
    await delay(300);
    
    const { jobId } = params;
    const job = mockTrainJobs.find(j => j.job_id === jobId);
    
    if (!job || job.status !== 'done') {
      return new HttpResponse(
        JSON.stringify({ message: 'Training result not available' }), 
        { status: 404 }
      );
    }
    
    return HttpResponse.json(job.result as TrainResultReply);
  }),

  // GET /api/val/result/<job_id> - 获取验证结果
  http.get('*/api/val/result/:jobId', async ({ params }) => {
    await delay(250);
    
    const { jobId } = params;
    const valJob = mockValJobs.find(j => j.val_job_id === jobId);
    
    if (!valJob || valJob.status !== 'done') {
      return new HttpResponse(
        JSON.stringify({ message: 'Validation result not available' }), 
        { status: 404 }
      );
    }
    
    return HttpResponse.json(valJob.result as ValResultReply);
  }),

  // SSE /api/train/logs/<job_id> - 实时训练日志流
  http.get('*/api/train/logs/:jobId', async ({ params, request }) => {
    const { jobId } = params;
    
    // 检查任务是否存在且正在运行
    const currentStatus = jobStatusMap.get(jobId as string);
    if (!currentStatus || currentStatus.status !== 'running') {
      return new HttpResponse('Job not running', { status: 404 });
    }
    
    // 创建 SSE 响应
    const stream = new ReadableStream({
      start(controller) {
        const sendLog = () => {
          const logs = generateMockLogStream(jobId as string);
          logs.forEach((log, index) => {
            setTimeout(() => {
              const sseData = `data: ${log}\n\n`;
              controller.enqueue(new TextEncoder().encode(sseData));
            }, index * 2000); // 每2秒发送一条日志
          });
          
          // 5条日志后关闭连接
          setTimeout(() => {
            controller.close();
          }, logs.length * 2000 + 1000);
        };
        
        // 立即发送一条日志，然后开始定时发送
        const initialLog = `[${new Date().toLocaleTimeString()}] 连接成功，开始实时日志流`;
        controller.enqueue(new TextEncoder().encode(`data: ${initialLog}\n\n`));
        
        setTimeout(sendLog, 1000);
        
        // 清理函数
        const cleanup = () => {
          controller.close();
        };
        
        // 监听客户端断开连接
        request.signal.addEventListener('abort', cleanup);
        
        return cleanup;
      }
    });
    
    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    });
  })
];