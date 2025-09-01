import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useJobStore, type JobWithValidation } from '@/models/job';
import { mockTrainJobs, mockValJobs } from '@/mocks/data/jobs';
import type { TrainLogEvent } from '@/types/job';

describe('JobStore - Core Logic Tests', () => {
  beforeEach(() => {
    // Reset the store before each test
    useJobStore.setState({
      trainJobs: [],
      validationJobs: [],
      selectedJob: null,
      isLoading: false,
      isPolling: false,
      sseConnection: null,
      logs: [],
      error: null,
    });
  });

  afterEach(() => {
    // Clean up after each test
    const { cleanup } = useJobStore.getState();
    cleanup();
  });

  describe('State Management', () => {
    it('should have correct initial state', () => {
      const initialState = useJobStore.getState();

      expect(initialState.trainJobs).toEqual([]);
      expect(initialState.validationJobs).toEqual([]);
      expect(initialState.selectedJob).toBe(null);
      expect(initialState.isLoading).toBe(false);
      expect(initialState.isPolling).toBe(false);
      expect(initialState.sseConnection).toBe(null);
      expect(initialState.logs).toEqual([]);
      expect(initialState.error).toBe(null);

      // Check that all required functions exist
      expect(typeof initialState.fetchJobs).toBe('function');
      expect(typeof initialState.selectJob).toBe('function');
      expect(typeof initialState.clearSelectedJob).toBe('function');
      expect(typeof initialState.startPolling).toBe('function');
      expect(typeof initialState.stopPolling).toBe('function');
      expect(typeof initialState.connectToLogs).toBe('function');
      expect(typeof initialState.disconnectFromLogs).toBe('function');
      expect(typeof initialState.clearLogs).toBe('function');
      expect(typeof initialState.updateJobStatus).toBe('function');
      expect(typeof initialState.cleanup).toBe('function');
    });

    it('should select a job correctly', () => {
      // Arrange
      const mockJob: JobWithValidation = {
        ...mockTrainJobs[0],
        validationJob: mockValJobs[0]
      };

      // Act
      const { selectJob } = useJobStore.getState();
      selectJob(mockJob);

      // Assert
      const state = useJobStore.getState();
      expect(state.selectedJob).toEqual(mockJob);
    });

    it('should clear selected job', () => {
      // Arrange
      const mockJob: JobWithValidation = mockTrainJobs[0];
      useJobStore.setState({ 
        selectedJob: mockJob,
        logs: [{ type: 'message', raw: 'test', message: 'test' }] as TrainLogEvent[]
      });

      // Act
      const { clearSelectedJob } = useJobStore.getState();
      clearSelectedJob();

      // Assert
      const state = useJobStore.getState();
      expect(state.selectedJob).toBe(null);
      expect(state.logs).toHaveLength(0);
    });

    it('should update job status correctly', () => {
      // Arrange
      const mockJobs = [...mockTrainJobs];
      useJobStore.setState({
        trainJobs: mockJobs,
        selectedJob: mockJobs[0]
      });

      // Act
      const { updateJobStatus } = useJobStore.getState();
      updateJobStatus('train_001', 'running', 50);

      // Assert
      const state = useJobStore.getState();
      const updatedJob = state.trainJobs.find(job => job.job_id === 'train_001');
      expect(updatedJob?.status).toBe('running');
      expect(updatedJob?.progress).toBe(50);
      
      // Also check selected job is updated
      expect(state.selectedJob?.status).toBe('running');
      expect(state.selectedJob?.progress).toBe(50);
    });

    it('should not update unrelated jobs', () => {
      // Arrange
      const mockJobs = [...mockTrainJobs];
      useJobStore.setState({ trainJobs: mockJobs });

      // Act
      const { updateJobStatus } = useJobStore.getState();
      updateJobStatus('train_001', 'done', 100);

      // Assert - other jobs should remain unchanged
      const state = useJobStore.getState();
      const unchangedJob = state.trainJobs.find(job => job.job_id === 'train_002');
      expect(unchangedJob?.status).toBe(mockTrainJobs[1].status);
      expect(unchangedJob?.progress).toBe(mockTrainJobs[1].progress);
    });
  });

  describe('Log Management', () => {
    it('should clear logs', () => {
      // Arrange
      useJobStore.setState({
        logs: [
          { type: 'message', raw: 'test1', message: 'test1' },
          { type: 'message', raw: 'test2', message: 'test2' }
        ] as TrainLogEvent[]
      });

      // Act
      const { clearLogs } = useJobStore.getState();
      clearLogs();

      // Assert
      const state = useJobStore.getState();
      expect(state.logs).toHaveLength(0);
    });

    it('should clear logs when selecting a new job', () => {
      // Arrange
      const mockJob: JobWithValidation = mockTrainJobs[0];
      useJobStore.setState({ 
        logs: [
          { type: 'message', raw: 'test log', message: 'test' }
        ] as TrainLogEvent[]
      });

      // Act
      const { selectJob } = useJobStore.getState();
      selectJob(mockJob);

      // Assert
      const state = useJobStore.getState();
      expect(state.logs).toHaveLength(0);
      expect(state.selectedJob).toEqual(mockJob);
    });
  });

  describe('Error Handling', () => {
    it('should handle error states', () => {
      // Act
      useJobStore.setState({ error: 'Test error message' });

      // Assert
      const state = useJobStore.getState();
      expect(state.error).toBe('Test error message');
    });

    it('should clear error when resetting', () => {
      // Arrange
      useJobStore.setState({ error: 'Test error' });

      // Act
      const { cleanup } = useJobStore.getState();
      cleanup();

      // Assert
      const state = useJobStore.getState();
      expect(state.error).toBe(null);
    });
  });

  describe('Polling State', () => {
    it('should track polling state', () => {
      // Initially not polling
      expect(useJobStore.getState().isPolling).toBe(false);

      // Set polling state
      useJobStore.setState({ isPolling: true });
      expect(useJobStore.getState().isPolling).toBe(true);

      // Stop polling
      const { stopPolling } = useJobStore.getState();
      stopPolling();
      expect(useJobStore.getState().isPolling).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup all resources', () => {
      // Arrange
      useJobStore.setState({
        trainJobs: mockTrainJobs,
        validationJobs: mockValJobs,
        selectedJob: mockTrainJobs[0],
        logs: [{ type: 'message', raw: 'test', message: 'test' }] as TrainLogEvent[],
        error: 'some error',
        isLoading: true,
        isPolling: true
      });

      // Act
      const { cleanup } = useJobStore.getState();
      cleanup();

      // Assert
      const state = useJobStore.getState();
      expect(state.trainJobs).toHaveLength(0);
      expect(state.validationJobs).toHaveLength(0);
      expect(state.selectedJob).toBe(null);
      expect(state.logs).toHaveLength(0);
      expect(state.error).toBe(null);
      expect(state.isLoading).toBe(false);
      expect(state.isPolling).toBe(false);
      expect(state.sseConnection).toBe(null);
    });
  });

  describe('Job Association Logic', () => {
    it('should handle jobs with and without validation jobs', () => {
      // Arrange
      const jobsWithValidation = [
        { ...mockTrainJobs[0], validationJob: mockValJobs[0] },
        { ...mockTrainJobs[1], validationJob: undefined },
        { ...mockTrainJobs[2], validationJob: mockValJobs[1] }
      ];

      useJobStore.setState({ trainJobs: jobsWithValidation });

      // Assert
      const state = useJobStore.getState();
      expect(state.trainJobs[0].validationJob).toBeDefined();
      expect(state.trainJobs[1].validationJob).toBeUndefined();
      expect(state.trainJobs[2].validationJob).toBeDefined();
    });

    it('should maintain validation job relationship on status updates', () => {
      // Arrange
      const jobWithValidation: JobWithValidation = {
        ...mockTrainJobs[0],
        validationJob: mockValJobs[0]
      };
      
      useJobStore.setState({
        trainJobs: [jobWithValidation],
        selectedJob: jobWithValidation
      });

      // Act
      const { updateJobStatus } = useJobStore.getState();
      updateJobStatus('train_001', 'done', 100);

      // Assert
      const state = useJobStore.getState();
      const updatedJob = state.trainJobs[0];
      expect(updatedJob.validationJob).toBeDefined();
      expect(updatedJob.validationJob?.val_job_id).toBe(mockValJobs[0].val_job_id);
      
      // Check selected job also maintains the relationship
      expect(state.selectedJob?.validationJob).toBeDefined();
    });
  });
});