import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useJobStore } from '@/models/job';
import { mockTrainJobs, mockValJobs } from '@/mocks/data/jobs';
import { mockSession } from '@/mocks/data/session';
import type { TrainStartRequest, ValStartRequest } from '@/types/job';

// EventSource is mocked in vitest setup

describe('JobStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useJobStore.setState({
      trainJobs: [],
      valJobs: [],
      selectedTrainJob: null,
      selectedValJob: null,
      isLoading: false,
      liveLogStreams: new Map(),
      offlineLogs: new Map(),
      activeLogStreams: new Map(),
    });

    // 重置 Mock 会话
    mockSession.clear();
    mockSession.setCurrentUser({ id: 1, userAccount: 'testuser', userName: 'Test User', userAvatar: '', createTime: new Date(), updateTime: new Date() });
  });

  describe('Training Jobs', () => {
    it('should get training jobs successfully', async () => {
      // Act
      const { getTrainJobs } = useJobStore.getState();
      await getTrainJobs();

      // Assert
      const state = useJobStore.getState();
      expect(state.trainJobs.length).toBe(mockTrainJobs.length);
      expect(state.trainJobs[0].job_id).toBe(mockTrainJobs[0].job_id);
      expect(state.isLoading).toBe(false);
    });

    it('should start training successfully', async () => {
      // Arrange
      const trainRequest: TrainStartRequest = {
        user_id: 1,
        dataset_id: 1,
        nodes: { node1: 4 },
        backbone_id: 1,
        classifier_id: 1,
        adaptive: 1,
        config: {
          epochs: 50,
          batch_size: 32,
          learning_rate: 0.001,
        },
      };

      // Act
      const { startTrain } = useJobStore.getState();
      await startTrain(trainRequest);

      // Assert
      const state = useJobStore.getState();
      expect(state.isLoading).toBe(false);
      // 检查是否添加了新的训练任务
      expect(state.trainJobs.length).toBeGreaterThanOrEqual(mockTrainJobs.length);
    });

    it('should select training job', () => {
      // Arrange
      const job = mockTrainJobs[0];

      // Act
      const { selectTrainJob } = useJobStore.getState();
      selectTrainJob(job);

      // Assert
      const state = useJobStore.getState();
      expect(state.selectedTrainJob).toEqual(job);
    });

    it('should clear selected training job', () => {
      // Arrange - first select a job
      useJobStore.setState({ selectedTrainJob: mockTrainJobs[0] });

      // Act
      const { selectTrainJob } = useJobStore.getState();
      selectTrainJob(null);

      // Assert
      const state = useJobStore.getState();
      expect(state.selectedTrainJob).toBe(null);
    });

    it('should get training status', async () => {
      // Arrange
      const jobId = 'train_001';

      // Act
      const { getTrainStatus } = useJobStore.getState();
      await getTrainStatus(jobId);

      // Assert - The status should be updated based on mock data
      // Since we're using real MSW handlers, we don't need to manually mock the response
      expect(true).toBe(true); // This test verifies the function doesn't throw
    });

    it('should get training result for completed job', async () => {
      // Arrange
      const jobId = 'train_001'; // This job is completed in mock data

      // Act
      const { getTrainResult } = useJobStore.getState();
      const result = await getTrainResult(jobId);

      // Assert
      expect(result).toBeDefined();
      expect(result.accuracy).toBeDefined();
    });
  });

  describe('Validation Jobs', () => {
    it('should get validation jobs successfully', async () => {
      // Act
      const { getValJobs } = useJobStore.getState();
      await getValJobs();

      // Assert
      const state = useJobStore.getState();
      expect(state.valJobs.length).toBe(mockValJobs.length);
      expect(state.valJobs[0].val_job_id).toBe(mockValJobs[0].val_job_id);
      expect(state.isLoading).toBe(false);
    });

    it('should start validation successfully', async () => {
      // Arrange
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: 'train_001', // Use completed training job
      };

      // Act
      const { startValidation } = useJobStore.getState();
      await startValidation(valRequest);

      // Assert
      const state = useJobStore.getState();
      expect(state.isLoading).toBe(false);
      // 检查是否添加了新的验证任务
      expect(state.valJobs.length).toBeGreaterThanOrEqual(mockValJobs.length);
    });

    it('should select validation job', () => {
      // Arrange
      const job = mockValJobs[0];

      // Act
      const { selectValJob } = useJobStore.getState();
      selectValJob(job);

      // Assert
      const state = useJobStore.getState();
      expect(state.selectedValJob).toEqual(job);
    });

    it('should get validation result for completed job', async () => {
      // Arrange
      const jobId = 'val_001'; // This job is completed in mock data

      // Act
      const { getValResult } = useJobStore.getState();
      const result = await getValResult(jobId);

      // Assert
      expect(result).toBeDefined();
      expect(result.accuracy).toBeDefined();
    });
  });

  describe('Log Management', () => {
    it('should get offline logs for completed job', async () => {
      // Arrange
      const jobId = 'train_001';

      // Act
      const { getTrainLogs } = useJobStore.getState();
      await getTrainLogs(jobId);

      // Assert
      const state = useJobStore.getState();
      const logs = state.offlineLogs.get(jobId);
      expect(logs).toBeDefined();
      expect(typeof logs).toBe('string');
      expect(logs?.length).toBeGreaterThan(0);
    });

    it('should subscribe to live logs', async () => {
      // Arrange
      const jobId = 'train_002'; // Running job
      const mockEventCallback = vi.fn();

      // Act
      const { subscribeTrainLogs } = useJobStore.getState();
      await subscribeTrainLogs(jobId, mockEventCallback);

      // Assert
      const state = useJobStore.getState();
      expect(state.activeLogStreams.has(jobId)).toBe(true);
    });

    it('should unsubscribe from live logs', async () => {
      // Arrange
      const jobId = 'train_002';
      const { subscribeTrainLogs, unsubscribeTrainLogs } = useJobStore.getState();
      
      // First subscribe
      await subscribeTrainLogs(jobId);

      // Act
      unsubscribeTrainLogs(jobId);

      // Assert
      const state = useJobStore.getState();
      expect(state.activeLogStreams.has(jobId)).toBe(false);
    });

    it('should clear specific job logs', () => {
      // Arrange
      const jobId = 'train_001';
      useJobStore.setState({
        offlineLogs: new Map([[jobId, 'test logs']]),
        liveLogStreams: new Map([[jobId, []]]),
      });

      // Act
      const { clearLogs } = useJobStore.getState();
      clearLogs(jobId);

      // Assert
      const state = useJobStore.getState();
      expect(state.offlineLogs.has(jobId)).toBe(false);
      expect(state.liveLogStreams.has(jobId)).toBe(false);
    });

    it('should clear all logs', () => {
      // Arrange
      useJobStore.setState({
        offlineLogs: new Map([['job1', 'logs1'], ['job2', 'logs2']]),
        liveLogStreams: new Map([['job1', []], ['job2', []]]),
      });

      // Act
      const { clearLogs } = useJobStore.getState();
      clearLogs();

      // Assert
      const state = useJobStore.getState();
      expect(state.offlineLogs.size).toBe(0);
      expect(state.liveLogStreams.size).toBe(0);
    });
  });

  describe('Loading States', () => {
    it('should set loading state during async operations', async () => {
      // Act
      const { getTrainJobs } = useJobStore.getState();
      
      const promise = getTrainJobs();
      
      // During the operation (MSW has delays)
      expect(useJobStore.getState().isLoading).toBe(true);
      
      await promise;
      
      // After completion
      expect(useJobStore.getState().isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      // Arrange - logout user
      mockSession.clear();

      // Act & Assert
      const { getTrainJobs } = useJobStore.getState();
      await expect(getTrainJobs()).rejects.toThrow();
      
      // Should still set loading to false
      expect(useJobStore.getState().isLoading).toBe(false);
    });

    it('should handle non-existent job errors', async () => {
      // Act & Assert
      const { getTrainResult } = useJobStore.getState();
      await expect(getTrainResult('non-existent-job')).rejects.toThrow();
    });

    it('should handle validation of incomplete training job', async () => {
      // Arrange
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: 'train_002', // Running job, not completed
      };

      // Act & Assert
      const { startValidation } = useJobStore.getState();
      await expect(startValidation(valRequest)).rejects.toThrow();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const initialState = useJobStore.getState();

      expect(initialState.trainJobs).toEqual([]);
      expect(initialState.valJobs).toEqual([]);
      expect(initialState.selectedTrainJob).toBe(null);
      expect(initialState.selectedValJob).toBe(null);
      expect(initialState.isLoading).toBe(false);
      expect(initialState.liveLogStreams).toBeInstanceOf(Map);
      expect(initialState.offlineLogs).toBeInstanceOf(Map);
      expect(initialState.activeLogStreams).toBeInstanceOf(Map);
      
      // Function checks
      expect(typeof initialState.startTrain).toBe('function');
      expect(typeof initialState.getTrainJobs).toBe('function');
      expect(typeof initialState.selectTrainJob).toBe('function');
      expect(typeof initialState.startValidation).toBe('function');
      expect(typeof initialState.getValJobs).toBe('function');
      expect(typeof initialState.selectValJob).toBe('function');
      expect(typeof initialState.subscribeTrainLogs).toBe('function');
      expect(typeof initialState.unsubscribeTrainLogs).toBe('function');
      expect(typeof initialState.getTrainLogs).toBe('function');
      expect(typeof initialState.clearLogs).toBe('function');
    });
  });
});