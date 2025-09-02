import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jobApi } from '@/services/api/job';
import type { TrainJob, ValJob, TrainLogEvent } from '@/types/job';
import type { JobStatus } from '@/types/common';

export interface JobWithValidation extends TrainJob {
  validationJob?: ValJob;
}

interface JobState {
  // 任务列表
  trainJobs: JobWithValidation[];
  validationJobs: ValJob[];

  // 选中的任务
  selectedJob: JobWithValidation | null;

  // 加载状态
  isLoading: boolean;
  isPolling: boolean;

  // SSE 连接状态
  sseConnection: EventSource | null;
  logs: TrainLogEvent[];

  // 错误状态
  error: string | null;

  // Actions
  fetchJobs: () => Promise<void>;
  selectJob: (job: JobWithValidation) => void;
  clearSelectedJob: () => void;

  // 状态轮询
  startPolling: () => void;
  stopPolling: () => void;

  // SSE 连接管理
  connectToLogs: (jobId: string) => void;
  disconnectFromLogs: () => void;
  clearLogs: () => void;

  // 任务状态更新
  updateJobStatus: (jobId: string, status: JobStatus, progress: number) => void;

  // 清理函数
  cleanup: () => void;
}

let pollingInterval: NodeJS.Timeout | null = null;

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      // 初始状态
      trainJobs: [],
      validationJobs: [],
      selectedJob: null,
      isLoading: false,
      isPolling: false,
      sseConnection: null,
      logs: [],
      error: null,

      // 获取任务列表
      fetchJobs: async () => {
        set({ isLoading: true, error: null });

        try {
          const [trainJobsResponse, valJobsResponse] = await Promise.all([
            jobApi.getTrainJobs(),
            jobApi.getValidationJobs(),
          ]);

          // 将验证任务与训练任务关联
          const jobsWithValidation: JobWithValidation[] = trainJobsResponse.map((trainJob) => {
            const validationJob = valJobsResponse.find(
              (val) => val.train_job_id === trainJob.job_id
            );
            return {
              ...trainJob,
              validationJob,
            };
          });

          // 成功后确保清空错误状态
          set({
            trainJobs: jobsWithValidation,
            validationJobs: valJobsResponse,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch jobs',
            isLoading: false,
          });
        }
      },

      // 选择任务
      selectJob: (job: JobWithValidation) => {
        const { disconnectFromLogs, clearLogs } = get();

        // 清理之前的连接
        disconnectFromLogs();
        clearLogs();

        set({ selectedJob: job });

        // 如果是运行中的任务，自动连接到日志流
        if (job.status === 'running') {
          get().connectToLogs(job.job_id);
        }
      },

      // 清除选中的任务
      clearSelectedJob: () => {
        const { disconnectFromLogs, clearLogs } = get();
        disconnectFromLogs();
        clearLogs();
        set({ selectedJob: null });
      },

      // 开始轮询
      startPolling: () => {
        const { stopPolling } = get();

        // 清除之前的轮询
        stopPolling();

        set({ isPolling: true });

        const poll = async () => {
          const { trainJobs, updateJobStatus } = get();

          // 只轮询非完成状态的任务
          const activeJobs = trainJobs.filter(
            (job) => job.status === 'pending' || job.status === 'running'
          );

          if (activeJobs.length === 0) {
            get().stopPolling();
            return;
          }

          // 并发获取任务状态
          const statusPromises = activeJobs.map(async (job) => {
            try {
              const status = await jobApi.getTrainStatus(job.job_id);
              return {
                jobId: job.job_id,
                status: status.status,
                progress: status.progress,
              };
            } catch (error) {
              console.warn(`Failed to get status for job ${job.job_id}:`, error);
              return null;
            }
          });

          const results = await Promise.allSettled(statusPromises);

          // 更新任务状态
          results.forEach((result) => {
            if (result.status === 'fulfilled' && result.value) {
              const { jobId, status, progress } = result.value;
              updateJobStatus(jobId, status, progress);
            }
          });
        };

        // 立即执行一次
        poll();

        // 设置定时器，每10秒轮询一次
        pollingInterval = setInterval(poll, 10000);
      },

      // 停止轮询
      stopPolling: () => {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
        set({ isPolling: false });
      },

      // 连接到日志流
      connectToLogs: (jobId: string) => {
        const { disconnectFromLogs } = get();

        // 先断开之前的连接
        disconnectFromLogs();

        try {
          const { es, close } = jobApi.subscribeTrainLogs(
            jobId,
            (event: TrainLogEvent) => {
              set((state) => ({
                logs: [...state.logs, event],
              }));
            },
            (_error) => {
              console.error('SSE connection error:', _error);
              set({ error: 'Log connection failed' });
            }
          );

          set({ sseConnection: es });

          // 存储关闭函数到连接对象上，方便后续调用
          (es as EventSource & { _closeFunction?: () => void })._closeFunction = close;
        } catch {
          set({ error: 'Failed to connect to logs' });
        }
      },

      // 断开日志流连接
      disconnectFromLogs: () => {
        const { sseConnection } = get();
        if (sseConnection) {
          // 使用存储的关闭函数
          const closeFunction = (sseConnection as EventSource & { _closeFunction?: () => void })
            ._closeFunction;
          if (closeFunction) {
            closeFunction();
          } else {
            sseConnection.close();
          }
          set({ sseConnection: null });
        }
      },

      // 清除日志
      clearLogs: () => {
        set({ logs: [] });
      },

      // 更新任务状态
      updateJobStatus: (jobId: string, status: JobStatus, progress: number) => {
        set((state) => ({
          trainJobs: state.trainJobs.map((job) =>
            job.job_id === jobId ? { ...job, status, progress } : job
          ),
          // 如果是当前选中的任务，也要更新
          selectedJob:
            state.selectedJob?.job_id === jobId
              ? { ...state.selectedJob, status, progress }
              : state.selectedJob,
        }));

        // 如果任务状态变为运行中，且是当前选中的任务，自动连接日志
        const { selectedJob } = get();
        if (selectedJob?.job_id === jobId && status === 'running') {
          get().connectToLogs(jobId);
        }

        // 如果任务完成，断开日志连接
        if (selectedJob?.job_id === jobId && (status === 'done' || status === 'failed')) {
          get().disconnectFromLogs();
        }
      },

      // 清理所有资源
      cleanup: () => {
        const { stopPolling, disconnectFromLogs } = get();
        stopPolling();
        disconnectFromLogs();
        set({
          trainJobs: [],
          validationJobs: [],
          selectedJob: null,
          logs: [],
          error: null,
          isLoading: false,
          isPolling: false,
          sseConnection: null,
        });
      },
    }),
    {
      name: 'job-storage',
      // 只持久化基本数据，不持久化连接和临时状态
      partialize: (state) => ({
        selectedJob: state.selectedJob,
        trainJobs: state.trainJobs,
        validationJobs: state.validationJobs,
      }),
    }
  )
);

// 页面卸载时清理资源
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    useJobStore.getState().cleanup();
  });
}
