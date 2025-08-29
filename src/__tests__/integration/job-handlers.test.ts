import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { mockSession } from '@/mocks/data/session';
import { jobApi } from '@/services/api/job';
import type { TrainStartRequest, ValStartRequest } from '@/types/job';

describe('Job Handlers Integration Tests', () => {
  beforeEach(() => {
    // 重置 Mock 会话并登录
    mockSession.clear();
    mockSession.setCurrentUser({
      id: 1,
      userAccount: 'testuser',
      userName: 'Test User',
      userRole: 'admin'
    });
  });

  afterEach(() => {
    // 确保每个测试后session都是已登录状态
    if (!mockSession.isAuthenticated()) {
      mockSession.setCurrentUser({
        id: 1,
        userAccount: 'testuser',
        userName: 'Test User',
        userRole: 'admin'
      });
    }
  });

  describe('Training Job Flow', () => {
    it('should complete full training job lifecycle', async () => {
      // 1. Start training
      const trainRequest: TrainStartRequest = {
        user_id: 1,
        dataset_id: 1,
        nodes: { node1: 4 },
        backbone_id: 1,
        classifier_id: 1,
        adaptive: 1,
        config: {
          epochs: 10,
          batch_size: 32,
        },
      };

      const startResult = await jobApi.startTrain(trainRequest);
      expect(startResult.job_id).toBeDefined();
      const jobId = startResult.job_id;

      // 2. Check initial status
      const initialStatus = await jobApi.getTrainStatus(jobId);
      expect(initialStatus.progress).toBeGreaterThanOrEqual(0);
      expect(['pending', 'running']).toContain(initialStatus.status);

      // 3. Get jobs list (should include our new job)
      const jobs = await jobApi.getTrainJobs();
      const ourJob = jobs.find(job => job.job_id === jobId);
      expect(ourJob).toBeDefined();
      expect(ourJob?.user_id).toBe(1);

      // 4. Get logs (should work even for new jobs)
      const logs = await jobApi.getTrainLogs(jobId);
      expect(logs.log).toBeDefined();
    });

    it('should handle SSE log subscription', () => {
      // This is a basic test for SSE setup
      const jobId = 'train_002';
      const eventSource = jobApi.getTrainLogsSSE(jobId);
      
      expect(eventSource).toBeInstanceOf(EventSource);
      expect(eventSource.url).toContain(jobId);
      
      eventSource.close();
    });
  });

  describe('Validation Job Flow', () => {
    it('should complete full validation job lifecycle', async () => {
      // 1. Use existing completed training job
      const completedTrainJobId = 'train_001';

      // 2. Start validation
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: completedTrainJobId,
      };

      const startResult = await jobApi.startValidation(valRequest);
      expect(startResult.val_job_id).toBeDefined();
      const valJobId = startResult.val_job_id;

      // 3. Get validation jobs list
      const valJobs = await jobApi.getValidationJobs();
      const ourValJob = valJobs.find(job => job.val_job_id === valJobId);
      expect(ourValJob).toBeDefined();
      expect(ourValJob?.train_job_id).toBe(completedTrainJobId);

      // 4. Wait a bit for validation to complete (mock completes in 3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3500));

      // 5. Get validation result
      const result = await jobApi.getValidationResult(valJobId);
      expect(result.accuracy).toBeDefined();
      expect(result.precision).toBeDefined();
      expect(result.recall).toBeDefined();
      expect(result.f1).toBeDefined();
    });

    it('should fail validation for incomplete training job', async () => {
      const runningTrainJobId = 'train_002'; // Running job
      
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: runningTrainJobId,
      };

      await expect(jobApi.startValidation(valRequest)).rejects.toThrow();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle 401 errors when not authenticated', async () => {
      // Logout
      mockSession.clear();

      await expect(jobApi.getTrainJobs()).rejects.toMatchObject({
        status: 401,
      });
    });

    it('should handle 404 errors for non-existent jobs', async () => {
      // 确保已认证
      mockSession.setCurrentUser({
        id: 1,
        userAccount: 'testuser',
        userName: 'Test User',
        userRole: 'admin'
      });
      
      await expect(jobApi.getTrainStatus('non-existent-job')).rejects.toMatchObject({
        status: 404,
      });
    });

    it('should handle 400 errors for incomplete jobs', async () => {
      // 确保已认证
      mockSession.setCurrentUser({
        id: 1,
        userAccount: 'testuser',
        userName: 'Test User',
        userRole: 'admin'
      });
      
      const runningJobId = 'train_002';
      
      await expect(jobApi.getTrainResult(runningJobId)).rejects.toMatchObject({
        status: 400,
      });
    });
  });

  describe('Mock Handler Edge Cases', () => {
    it('should handle server errors gracefully', async () => {
      // Override handler to return 500
      server.use(
        http.get('*/api/train', () => {
          return HttpResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
          );
        })
      );

      await expect(jobApi.getTrainJobs()).rejects.toMatchObject({
        status: 500,
      });
    });

    it('should handle malformed requests', async () => {
      // 确保已认证
      mockSession.setCurrentUser({
        id: 1,
        userAccount: 'testuser',
        userName: 'Test User',
        userRole: 'admin'
      });
      
      const malformedRequest = {} as TrainStartRequest;

      // This should still work with MSW but the handler might create a job with default values
      const result = await jobApi.startTrain(malformedRequest);
      expect(result.job_id).toBeDefined();
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle multiple concurrent training jobs', async () => {
      // 确保已认证
      mockSession.setCurrentUser({
        id: 1,
        userAccount: 'testuser',
        userName: 'Test User',
        userRole: 'admin'
      });
      
      // Start multiple training jobs
      const requests = Array.from({ length: 3 }, (_, i) => ({
        user_id: 1,
        dataset_id: i + 1,
        nodes: { [`node${i + 1}`]: 2 },
        backbone_id: 1,
        classifier_id: 1,
        adaptive: 0 as 0 | 1,
        config: { epochs: 5 },
      }));

      const results = await Promise.all(
        requests.map(req => jobApi.startTrain(req))
      );

      // All should succeed
      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.job_id).toBeDefined();
        expect(result.message).toBe('训练任务已启动');
      });

      // Check that jobs list includes all new jobs
      const jobs = await jobApi.getTrainJobs();
      const newJobIds = results.map(r => r.job_id);
      newJobIds.forEach(jobId => {
        expect(jobs.find(job => job.job_id === jobId)).toBeDefined();
      });
    });

    it('should handle training -> validation pipeline', async () => {
      // 确保已认证
      mockSession.setCurrentUser({
        id: 1,
        userAccount: 'testuser',
        userName: 'Test User',
        userRole: 'admin'
      });
      
      // 1. Start training
      const trainRequest: TrainStartRequest = {
        user_id: 1,
        dataset_id: 1,
        nodes: { node1: 2 },
        backbone_id: 1,
        classifier_id: 1,
        adaptive: 0,
        config: { epochs: 5 },
      };

      const _trainResult = await jobApi.startTrain(trainRequest);

      // 2. Wait for training to "complete" (we'll simulate this)
      // In reality, we'd poll getTrainStatus until it's done
      // For this test, we'll use an existing completed job instead
      const completedJobId = 'train_001';

      // 3. Start validation
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: completedJobId,
      };

      const valResult = await jobApi.startValidation(valRequest);
      expect(valResult.val_job_id).toBeDefined();

      // 4. Get both jobs and verify relationship
      const [_trainJobs, valJobs] = await Promise.all([
        jobApi.getTrainJobs(),
        jobApi.getValidationJobs(),
      ]);

      const ourValJob = valJobs.find(job => job.val_job_id === valResult.val_job_id);
      expect(ourValJob?.train_job_id).toBe(completedJobId);
    });
  });
});