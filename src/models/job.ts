import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jobApi } from '@/services/api/job';
import type { TrainJob, ValJob, TrainLogEvent } from '@/types/job';
import type { JobStatus } from '@/types/common';

export interface JobWithValidation extends TrainJob {
  validationJob?: ValJob;
}

interface JobState {
  trainJobs: JobWithValidation[];
  validationJobs: ValJob[];
  selectedJob: JobWithValidation | null;
  isLoading: boolean;
  isPolling: boolean;
  sseConnection: EventSource | null;
  logs: TrainLogEvent[];
  error: string | null;
  fetchJobs: () => Promise<void>;
  selectJob: (job: JobWithValidation) => void;
  startPolling: () => void;
  stopPolling: () => void;
  connectToLogs: (jobId: string) => void;
  disconnectFromLogs: () => void;
  fetchStaticLogs: (jobId: string) => Promise<void>;
  updateJobStatus: (jobId: string, status: JobStatus, progress: number) => void;
  cleanup: () => void;
}

let pollingInterval: NodeJS.Timeout | null = null;

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      trainJobs: [],
      validationJobs: [],
      selectedJob: null,
      isLoading: false,
      isPolling: false,
      sseConnection: null,
      logs: [],
      error: null,

      fetchJobs: async () => {
        set({ isLoading: true, error: null });
        try {
          const [trainJobsResponse, valJobsResponse] = await Promise.all([
            jobApi.getTrainJobs(),
            jobApi.getValidationJobs(),
          ]);
          const jobsWithValidation: JobWithValidation[] = trainJobsResponse.map((t) => ({
            ...t,
            validationJob: valJobsResponse.find((v) => v.train_job_id === t.job_id),
          }));
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

      selectJob: (job: JobWithValidation) => {
        const { disconnectFromLogs } = get();
        disconnectFromLogs();
        set({ logs: [] });
        set({ selectedJob: job });
      },

      startPolling: () => {
        const { stopPolling } = get();
        stopPolling();
        set({ isPolling: true });
        const poll = async () => {
          const { trainJobs, updateJobStatus } = get();
          const activeJobs = trainJobs.filter((j) => j.status === 'pending' || j.status === 'running');
          if (activeJobs.length === 0) {
            get().stopPolling();
            return;
          }
          const statusPromises = activeJobs.map(async (j) => {
            try {
              const s = await jobApi.getTrainStatus(j.job_id);
              return { jobId: j.job_id, status: s.status, progress: s.progress };
            } catch (e) {
              console.warn(`Failed to get status for job ${j.job_id}:`, e);
              return null;
            }
          });
          const results = await Promise.allSettled(statusPromises);
          results.forEach((r) => {
            if (r.status === 'fulfilled' && r.value) {
              const { jobId, status, progress } = r.value;
              updateJobStatus(jobId, status, progress);
            }
          });
        };
        poll();
        pollingInterval = setInterval(poll, 10000);
      },

      stopPolling: () => {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
        set({ isPolling: false });
      },

      connectToLogs: (jobId: string) => {
        const { disconnectFromLogs } = get();
        disconnectFromLogs();
        try {
          const es = jobApi.subscribeTrainLogs(
            jobId,
            (event: TrainLogEvent) => set((state) => ({ logs: [...state.logs, event] })),
            (_error) => {
              console.error('SSE connection error:', _error);
              set({ error: 'Log connection failed' });
            }
          );
          set({ sseConnection: es });
        } catch {
          set({ error: 'Failed to connect to logs' });
        }
      },

      disconnectFromLogs: () => {
        const { sseConnection } = get();
        if (sseConnection) {
          sseConnection.close();
          set({ sseConnection: null });
        }
      },

      fetchStaticLogs: async (jobId: string) => {
        try {
          set({ logs: [] });
          const events = await jobApi.getTrainLogs(jobId);
          set({ logs: events, error: null });
        } catch (e) {
          console.error('Failed to fetch static logs', e);
          set({ error: 'Failed to fetch static logs' });
        }
      },

      updateJobStatus: (jobId: string, status: JobStatus, progress: number) => {
        set((state) => ({
          trainJobs: state.trainJobs.map((j) => (j.job_id === jobId ? { ...j, status, progress } : j)),
          selectedJob:
            state.selectedJob?.job_id === jobId ? { ...state.selectedJob, status, progress } : state.selectedJob,
        }));
      },

      cleanup: () => {
        const { stopPolling, disconnectFromLogs } = get();
        stopPolling();
        disconnectFromLogs();
        set({ logs: [], error: null, isLoading: false, isPolling: false, sseConnection: null });
      },
    }),
    {
      name: 'job-storage',
      partialize: (state) => ({ selectedJob: state.selectedJob, trainJobs: state.trainJobs, validationJobs: state.validationJobs }),
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    useJobStore.getState().cleanup();
  });
}
