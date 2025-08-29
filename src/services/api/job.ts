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
import { httpService } from '@/services/http';
import { apiConfig } from '@/config/env';
import type { TrainLogEvent, TrainLogMetricEntry, TrainLogMessageEntry } from '@/types/job';

export const jobApi = {
  // Training Job APIs
  async startTrain(data: TrainStartRequest): Promise<TrainStartReply> {
    return await httpService.post<TrainStartReply>('/api/train/start', data);
  },

  async getTrainStatus(jobId: string): Promise<TrainStatusReply> {
    return await httpService.get<TrainStatusReply>(`/api/train/status/${jobId}`);
  },

  async getTrainJobs(): Promise<TrainJobList> {
    return await httpService.get<TrainJobList>('/api/train');
  },

  async getTrainLogs(jobId: string): Promise<TrainLogReply> {
    return await httpService.get<TrainLogReply>(`/api/train/logs_file/${jobId}`);
  },

  async getTrainResult(jobId: string): Promise<TrainResultReply> {
    return await httpService.get<TrainResultReply>(`/api/train/result/${jobId}`);
  },

  // Validation Job APIs
  async startValidation(data: ValStartRequest): Promise<ValStartReply> {
    return await httpService.post<ValStartReply>('/api/val/start', data);
  },

  async getValidationJobs(): Promise<ValJobLIst> {
    return await httpService.get<ValJobLIst>('/api/val');
  },

  async getValidationResult(jobId: string): Promise<ValResultReply> {
    return await httpService.get<ValResultReply>(`/api/val/result/${jobId}`);
  },

  // SSE for real-time training logs
  getTrainLogsSSE(jobId: string): EventSource {
    const url = apiConfig.getUrl(`/api/train/logs/${jobId}`);
    return new EventSource(url, { withCredentials: true });
  },

  // High-level SSE helper with parsing
  // Usage: const { es, close } = jobApi.subscribeTrainLogs(jobId, onEvent, onError)
  subscribeTrainLogs(
    jobId: string,
    onEvent: (event: TrainLogEvent) => void,
    onError?: (error: Event) => void
  ) {
    const es = this.getTrainLogsSSE(jobId);

    es.onmessage = (e: MessageEvent<string>) => {
      const parsed = parseTrainLogLine(e.data);
      onEvent(parsed);
    };

    es.onerror = (err) => {
      onError?.(err);
      // 注意：EventSource 会自动重连；如需手动停止，可调用 close()
    };

    return {
      es,
      close: () => es.close(),
    };
  },
};

// Utilities
function toNumber(input: string | undefined | null): number | undefined {
  if (input == null) return undefined;
  const v = Number(input);
  return Number.isFinite(v) ? v : undefined;
}

// Robust parser for backend log lines.
// Examples:
// [13:27:10] epoch:0, OA: 53.24%, Kappa: 0.1970, cls Acc: [99.58, 26.24, 0.0], P:0.4552,R:0.4194,F1:0.3493,loss:0.93
// [13:27:04] 开始训练
export function parseTrainLogLine(line: string): TrainLogEvent {
  const raw = line ?? '';
  let rest = raw.trim();

  // timestamp like [13:27:10]
  const tsMatch = rest.match(/^\[(.*?)\]\s*/);
  const timestamp = tsMatch?.[1];
  if (tsMatch) rest = rest.slice(tsMatch[0].length).trim();

  // Detect metrics presence by keyword
  const hasEpoch = /\bepoch\s*:\s*\d+/i.test(rest);
  if (hasEpoch) {
    // Extract numbers via regex; tolerate spaces
    const epoch = toNumber(rest.match(/epoch\s*:\s*(\d+)/i)?.[1]) ?? 0;

    // OA may have percent sign
    const oaStr = rest.match(/OA\s*:\s*([\d.]+)\s*%?/i)?.[1];
    const oa = toNumber(oaStr);

    const kappa = toNumber(rest.match(/Kappa\s*:\s*([\d.]+)/i)?.[1]);

    // cls Acc array
    const clsStr = rest.match(/cls\s*Acc\s*:\s*\[([^\]]*)\]/i)?.[1];
    const clsAcc = clsStr
      ? clsStr
          .split(',')
          .map((s) => toNumber(s.trim()) ?? 0)
          .filter((n) => Number.isFinite(n))
      : undefined;

    const precision = toNumber(rest.match(/(?:\bP|Precision)\s*:\s*([\d.]+)/i)?.[1]);
    const recall = toNumber(rest.match(/(?:\bR|Recall)\s*:\s*([\d.]+)/i)?.[1]);
    const f1 = toNumber(rest.match(/(?:\bF1|F\s*1)\s*:\s*([\d.]+)/i)?.[1]);
    const loss = toNumber(rest.match(/loss\s*:\s*([\d.]+)/i)?.[1]);

    const metrics: TrainLogMetricEntry = {
      type: 'metrics',
      raw,
      timestamp,
      epoch,
      oa,
      kappa,
      clsAcc,
      precision,
      recall,
      f1,
      loss,
    };
    return metrics;
  }

  // Fallback: plain message
  const message: TrainLogMessageEntry = {
    type: 'message',
    raw,
    timestamp,
    message: rest,
  };
  return message;
}
