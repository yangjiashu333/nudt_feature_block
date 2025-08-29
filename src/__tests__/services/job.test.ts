import { describe, it, expect, beforeEach } from 'vitest';
import { jobApi, parseTrainLogLine } from '@/services/api/job';
import { mockSession } from '@/mocks/data/session';
import type { TrainStartRequest, ValStartRequest } from '@/types/job';

describe('Job API Service', () => {
  beforeEach(() => {
    // 重置 Mock 会话并登录
    mockSession.clear();
    mockSession.setCurrentUser({
      id: 1,
      userAccount: 'testuser',
      userName: 'Test User',
      userAvatar: '',
      createTime: new Date(),
      updateTime: new Date(),
    });
  });

  describe('Training Job APIs', () => {
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
      const result = await jobApi.startTrain(trainRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.message).toBe('训练任务已启动');
      expect(result.job_id).toBeDefined();
      expect(result.celery_task_id).toBeDefined();
      expect(result.id).toBeTypeOf('number');
    });

    it('should get training jobs list', async () => {
      // Act
      const jobs = await jobApi.getTrainJobs();

      // Assert
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0]).toHaveProperty('job_id');
      expect(jobs[0]).toHaveProperty('status');
      expect(jobs[0]).toHaveProperty('progress');
    });

    it('should get training status', async () => {
      // Arrange
      const jobId = 'train_001';

      // Act
      const status = await jobApi.getTrainStatus(jobId);

      // Assert
      expect(status).toBeDefined();
      expect(status.progress).toBeTypeOf('number');
      expect(status.status).toBeDefined();
      expect(status.progress).toBeGreaterThanOrEqual(0);
      expect(status.progress).toBeLessThanOrEqual(100);
    });

    it('should get offline training logs', async () => {
      // Arrange
      const jobId = 'train_001';

      // Act
      const logs = await jobApi.getTrainLogs(jobId);

      // Assert
      expect(logs).toBeDefined();
      expect(logs.log).toBeTypeOf('string');
      expect(logs.log.length).toBeGreaterThan(0);
    });

    it('should get training result for completed job', async () => {
      // Arrange
      const jobId = 'train_001'; // Completed job in mock data

      // Act
      const result = await jobApi.getTrainResult(jobId);

      // Assert
      expect(result).toBeDefined();
      expect(result.accuracy).toBeDefined();
      expect(result.final_metrics).toBeDefined();
    });

    it('should handle non-existent training job', async () => {
      // Arrange
      const jobId = 'non-existent-job';

      // Act & Assert
      await expect(jobApi.getTrainStatus(jobId)).rejects.toThrow();
    });

    it('should handle training result for incomplete job', async () => {
      // Arrange
      const jobId = 'train_002'; // Running job in mock data

      // Act & Assert
      await expect(jobApi.getTrainResult(jobId)).rejects.toThrow();
    });
  });

  describe('Validation Job APIs', () => {
    it('should start validation successfully', async () => {
      // Arrange
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: 'train_001', // Completed training job
      };

      // Act
      const result = await jobApi.startValidation(valRequest);

      // Assert
      expect(result).toBeDefined();
      expect(result.message).toBe('验证任务已启动');
      expect(result.val_job_id).toBeDefined();
      expect(result.celery_task_id).toBeDefined();
      expect(result.id).toBeTypeOf('number');
    });

    it('should not start validation for incomplete training job', async () => {
      // Arrange
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: 'train_002', // Running job
      };

      // Act & Assert
      await expect(jobApi.startValidation(valRequest)).rejects.toThrow();
    });

    it('should not start validation for non-existent training job', async () => {
      // Arrange
      const valRequest: ValStartRequest = {
        user_id: 1,
        train_job_id: 'non-existent-job',
      };

      // Act & Assert
      await expect(jobApi.startValidation(valRequest)).rejects.toThrow();
    });

    it('should get validation jobs list', async () => {
      // Act
      const jobs = await jobApi.getValidationJobs();

      // Assert
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0]).toHaveProperty('val_job_id');
      expect(jobs[0]).toHaveProperty('train_job_id');
      expect(jobs[0]).toHaveProperty('status');
    });

    it('should get validation result for completed job', async () => {
      // Arrange
      const jobId = 'val_001'; // Completed validation job in mock data

      // Act
      const result = await jobApi.getValidationResult(jobId);

      // Assert
      expect(result).toBeDefined();
      expect(result.accuracy).toBeDefined();
      expect(result.precision).toBeDefined();
      expect(result.recall).toBeDefined();
      expect(result.f1).toBeDefined();
    });

    it('should handle validation result for incomplete job', async () => {
      // Arrange
      const jobId = 'val_002'; // Pending validation job in mock data

      // Act & Assert
      await expect(jobApi.getValidationResult(jobId)).rejects.toThrow();
    });
  });

  describe('SSE Log Subscription', () => {
    it('should create EventSource for live logs', () => {
      // Arrange
      const jobId = 'train_002';

      // Act
      const eventSource = jobApi.getTrainLogsSSE(jobId);

      // Assert
      expect(eventSource).toBeInstanceOf(EventSource);
      expect(eventSource.url).toContain('/api/train/logs/train_002');
      
      // Clean up
      eventSource.close();
    });

    it('should subscribe to training logs with callback', () => {
      // Arrange
      const jobId = 'train_002';
      const mockCallback = vi.fn();
      const mockErrorCallback = vi.fn();

      // Act
      const subscription = jobApi.subscribeTrainLogs(jobId, mockCallback, mockErrorCallback);

      // Assert
      expect(subscription).toBeDefined();
      expect(subscription.es).toBeInstanceOf(EventSource);
      expect(typeof subscription.close).toBe('function');
      
      // Clean up
      subscription.close();
    });
  });

  describe('Authentication', () => {
    it('should handle unauthenticated requests', async () => {
      // Arrange - logout user
      mockSession.clear();

      // Act & Assert
      await expect(jobApi.getTrainJobs()).rejects.toThrow();
    });
  });
});

describe('parseTrainLogLine', () => {
  describe('Metrics Log Parsing', () => {
    it('should parse complete metrics log line', () => {
      // Arrange
      const logLine = '[13:27:10] epoch:0, OA: 53.24%, Kappa: 0.1970, cls Acc: [99.58, 26.24, 0.0], P:0.4552,R:0.4194,F1:0.3493,loss:0.93';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('metrics');
      if (result.type === 'metrics') {
        expect(result.timestamp).toBe('13:27:10');
        expect(result.epoch).toBe(0);
        expect(result.oa).toBe(53.24);
        expect(result.kappa).toBe(0.1970);
        expect(result.clsAcc).toEqual([99.58, 26.24, 0.0]);
        expect(result.precision).toBe(0.4552);
        expect(result.recall).toBe(0.4194);
        expect(result.f1).toBe(0.3493);
        expect(result.loss).toBe(0.93);
        expect(result.raw).toBe(logLine);
      }
    });

    it('should parse metrics log with different format variations', () => {
      // Arrange - test with spaces and different case
      const logLine = '[14:30:15] EPOCH: 5, oa: 78.56 %, kappa: 0.7123, P : 0.8123 , R : 0.7456 , F1 : 0.7789 , loss : 0.456';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('metrics');
      if (result.type === 'metrics') {
        expect(result.epoch).toBe(5);
        expect(result.oa).toBe(78.56);
        expect(result.kappa).toBe(0.7123);
        expect(result.precision).toBe(0.8123);
        expect(result.recall).toBe(0.7456);
        expect(result.f1).toBe(0.7789);
        expect(result.loss).toBe(0.456);
      }
    });

    it('should parse partial metrics log', () => {
      // Arrange - only epoch and loss
      const logLine = '[15:45:30] epoch:12, loss:0.234';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('metrics');
      if (result.type === 'metrics') {
        expect(result.epoch).toBe(12);
        expect(result.loss).toBe(0.234);
        expect(result.oa).toBeUndefined();
        expect(result.kappa).toBeUndefined();
      }
    });

    it('should handle malformed cls Acc array', () => {
      // Arrange
      const logLine = '[16:20:45] epoch:3, cls Acc: [invalid, data], loss:0.567';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('metrics');
      if (result.type === 'metrics') {
        expect(result.epoch).toBe(3);
        expect(result.clsAcc).toEqual([0, 0]); // toNumber returns 0 for invalid strings
        expect(result.loss).toBe(0.567);
      }
    });
  });

  describe('Message Log Parsing', () => {
    it('should parse simple message log', () => {
      // Arrange
      const logLine = '[13:27:04] 开始训练';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('message');
      if (result.type === 'message') {
        expect(result.timestamp).toBe('13:27:04');
        expect(result.message).toBe('开始训练');
        expect(result.raw).toBe(logLine);
      }
    });

    it('should parse message log without timestamp', () => {
      // Arrange
      const logLine = '训练完成';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('message');
      if (result.type === 'message') {
        expect(result.timestamp).toBeUndefined();
        expect(result.message).toBe('训练完成');
        expect(result.raw).toBe(logLine);
      }
    });

    it('should handle empty log line', () => {
      // Arrange
      const logLine = '';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('message');
      if (result.type === 'message') {
        expect(result.message).toBe('');
        expect(result.raw).toBe('');
      }
    });

    it('should handle null/undefined log line', () => {
      // Act
      const result1 = parseTrainLogLine(null);
      const result2 = parseTrainLogLine(undefined);

      // Assert
      expect(result1.type).toBe('message');
      expect(result2.type).toBe('message');
    });
  });

  describe('Edge Cases', () => {
    it('should handle log line with epoch but no metrics', () => {
      // Arrange - has epoch keyword but not in expected format
      const logLine = '[12:00:00] Starting epoch 5 training process';

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('message');
      if (result.type === 'message') {
        expect(result.message).toBe('Starting epoch 5 training process');
      }
    });

    it('should handle very long log line', () => {
      // Arrange
      const longMessage = 'A'.repeat(1000);
      const logLine = `[10:00:00] ${longMessage}`;

      // Act
      const result = parseTrainLogLine(logLine);

      // Assert
      expect(result.type).toBe('message');
      if (result.type === 'message') {
        expect(result.message).toBe(longMessage);
      }
    });
  });
});
