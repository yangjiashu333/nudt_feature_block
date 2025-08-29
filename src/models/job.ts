import { create } from 'zustand';
import { jobApi } from '@/services/api/job';
import type {
  TrainJob,
  ValJob,
  TrainStartRequest,
  ValStartRequest,
  TrainLogEvent,
} from '@/types/job';

interface JobState {
  // 任务列表
  trainJobs: TrainJob[];
  valJobs: ValJob[];
  
  // 当前选中的任务
  selectedTrainJob: TrainJob | null;
  selectedValJob: ValJob | null;
  
  // 加载状态
  isLoading: boolean;
  
  // 日志管理
  liveLogStreams: Map<string, TrainLogEvent[]>;
  offlineLogs: Map<string, string>;
  activeLogStreams: Map<string, { es: EventSource; close: () => void }>;
  
  // 训练任务操作
  startTrain: (request: TrainStartRequest) => Promise<void>;
  getTrainJobs: () => Promise<void>;
  selectTrainJob: (job: TrainJob | null) => void;
  getTrainStatus: (jobId: string) => Promise<void>;
  getTrainResult: (jobId: string) => Promise<import('@/types/job').TrainResultReply>;
  
  // 验证任务操作
  startValidation: (request: ValStartRequest) => Promise<void>;
  getValJobs: () => Promise<void>;
  selectValJob: (job: ValJob | null) => void;
  getValResult: (jobId: string) => Promise<import('@/types/job').ValResultReply>;
  
  // 日志操作
  subscribeTrainLogs: (jobId: string, onEvent?: (event: TrainLogEvent) => void) => Promise<void>;
  unsubscribeTrainLogs: (jobId: string) => void;
  getTrainLogs: (jobId: string) => Promise<void>;
  
  // 清理操作
  clearLogs: (jobId?: string) => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  // 初始状态
  trainJobs: [],
  valJobs: [],
  selectedTrainJob: null,
  selectedValJob: null,
  isLoading: false,
  liveLogStreams: new Map(),
  offlineLogs: new Map(),
  activeLogStreams: new Map(),
  
  // 训练任务操作
  startTrain: async (request: TrainStartRequest) => {
    set({ isLoading: true });
    try {
      const result = await jobApi.startTrain(request);
      console.log('Training started:', result);
      await get().getTrainJobs();
    } finally {
      set({ isLoading: false });
    }
  },
  
  getTrainJobs: async () => {
    set({ isLoading: true });
    try {
      const jobs = await jobApi.getTrainJobs();
      set({ trainJobs: jobs });
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectTrainJob: (job: TrainJob | null) => {
    set({ selectedTrainJob: job });
  },
  
  getTrainStatus: async (jobId: string) => {
    try {
      const status = await jobApi.getTrainStatus(jobId);
      const { trainJobs } = get();
      const updatedJobs = trainJobs.map(job => 
        job.job_id === jobId 
          ? { ...job, status: status.status, progress: status.progress }
          : job
      );
      set({ trainJobs: updatedJobs });
    } catch (error) {
      console.error('Failed to get train status:', error);
    }
  },
  
  getTrainResult: async (jobId: string) => {
    try {
      return await jobApi.getTrainResult(jobId);
    } catch (error) {
      console.error('Failed to get train result:', error);
      throw error;
    }
  },
  
  // 验证任务操作
  startValidation: async (request: ValStartRequest) => {
    set({ isLoading: true });
    try {
      const result = await jobApi.startValidation(request);
      console.log('Validation started:', result);
      await get().getValJobs();
    } finally {
      set({ isLoading: false });
    }
  },
  
  getValJobs: async () => {
    set({ isLoading: true });
    try {
      const jobs = await jobApi.getValidationJobs();
      set({ valJobs: jobs });
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectValJob: (job: ValJob | null) => {
    set({ selectedValJob: job });
  },
  
  getValResult: async (jobId: string) => {
    try {
      return await jobApi.getValidationResult(jobId);
    } catch (error) {
      console.error('Failed to get validation result:', error);
      throw error;
    }
  },
  
  // 实时日志订阅（适用于运行中的任务）
  subscribeTrainLogs: async (jobId: string, onEvent?: (event: TrainLogEvent) => void) => {
    const { activeLogStreams, liveLogStreams } = get();
    
    // 如果已经有活跃的流，先关闭
    if (activeLogStreams.has(jobId)) {
      get().unsubscribeTrainLogs(jobId);
    }
    
    try {
      const subscription = jobApi.subscribeTrainLogs(
        jobId,
        (event: TrainLogEvent) => {
          // 更新本地缓存
          const currentLogs = liveLogStreams.get(jobId) || [];
          const updatedLogs = [...currentLogs, event];
          liveLogStreams.set(jobId, updatedLogs);
          set({ liveLogStreams: new Map(liveLogStreams) });
          
          // 调用回调函数
          onEvent?.(event);
        },
        (error) => {
          console.error('Log stream error:', error);
        }
      );
      
      activeLogStreams.set(jobId, subscription);
      set({ activeLogStreams: new Map(activeLogStreams) });
      
    } catch (error) {
      console.error('Failed to subscribe to logs:', error);
    }
  },
  
  unsubscribeTrainLogs: (jobId: string) => {
    const { activeLogStreams } = get();
    const subscription = activeLogStreams.get(jobId);
    
    if (subscription) {
      subscription.close();
      activeLogStreams.delete(jobId);
      set({ activeLogStreams: new Map(activeLogStreams) });
    }
  },
  
  // 离线日志获取（适用于已完成的任务）
  getTrainLogs: async (jobId: string) => {
    try {
      const logResponse = await jobApi.getTrainLogs(jobId);
      const { offlineLogs } = get();
      offlineLogs.set(jobId, logResponse.log);
      set({ offlineLogs: new Map(offlineLogs) });
    } catch (error) {
      console.error('Failed to get offline logs:', error);
      throw error;
    }
  },
  
  // 清理日志缓存
  clearLogs: (jobId?: string) => {
    const { liveLogStreams, offlineLogs, activeLogStreams } = get();
    
    if (jobId) {
      // 清理指定任务的日志
      liveLogStreams.delete(jobId);
      offlineLogs.delete(jobId);
      
      // 关闭活跃的流
      const subscription = activeLogStreams.get(jobId);
      if (subscription) {
        subscription.close();
        activeLogStreams.delete(jobId);
      }
      
      set({ 
        liveLogStreams: new Map(liveLogStreams),
        offlineLogs: new Map(offlineLogs),
        activeLogStreams: new Map(activeLogStreams)
      });
    } else {
      // 清理所有日志
      activeLogStreams.forEach(subscription => subscription.close());
      set({ 
        liveLogStreams: new Map(),
        offlineLogs: new Map(),
        activeLogStreams: new Map()
      });
    }
  },
}));
