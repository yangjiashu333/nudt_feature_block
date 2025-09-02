import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useJobStore } from '@/models/job';
import type { JobWithValidation } from '@/models/job';
import type { TrainLogEvent } from '@/types/job';

type Props = {
  job: JobWithValidation;
};

export default function DynamicLogs({ job }: Props) {
  const { logs, sseConnection, connectToLogs, disconnectFromLogs } = useJobStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (job.status === 'running') {
      connectToLogs(job.job_id);
    }

    return () => {
      if (job.status !== 'running') {
        disconnectFromLogs();
      }
    };
  }, [job.job_id, job.status, connectToLogs, disconnectFromLogs]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const formatLogEntry = (log: TrainLogEvent) => {
    if (log.type === 'metrics') {
      const metrics = [];
      if (log.oa !== undefined) metrics.push(`OA: ${log.oa.toFixed(2)}%`);
      if (log.kappa !== undefined) metrics.push(`Kappa: ${log.kappa.toFixed(4)}`);
      if (log.loss !== undefined) metrics.push(`Loss: ${log.loss.toFixed(4)}`);
      if (log.precision !== undefined) metrics.push(`Precision: ${log.precision.toFixed(4)}`);
      if (log.recall !== undefined) metrics.push(`Recall: ${log.recall.toFixed(4)}`);
      if (log.f1 !== undefined) metrics.push(`F1: ${log.f1.toFixed(4)}`);

      return `[${log.timestamp || ''}] Epoch ${log.epoch}: ${metrics.join(', ')}`;
    }

    return log.raw || log.message || JSON.stringify(log);
  };

  const getConnectionStatus = () => {
    if (!sseConnection) {
      return { status: 'disconnected', text: '未连接', variant: 'outline' as const };
    }

    switch (sseConnection.readyState) {
      case EventSource.CONNECTING:
        return { status: 'connecting', text: '连接中', variant: 'secondary' as const };
      case EventSource.OPEN:
        return { status: 'connected', text: '已连接', variant: 'default' as const };
      case EventSource.CLOSED:
        return { status: 'disconnected', text: '已断开', variant: 'outline' as const };
      default:
        return { status: 'unknown', text: '未知状态', variant: 'destructive' as const };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>动态日志</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={connectionStatus.variant}>{connectionStatus.text}</Badge>
            <Badge variant="secondary">运行中</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea ref={scrollAreaRef} className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">
                {connectionStatus.status === 'connected' ? '等待日志数据...' : '正在连接日志流...'}
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono break-all">
                  {formatLogEntry(log)}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
          <span>实时日志总数: {logs.length} 条</span>
          <span>自动滚动至最新</span>
        </div>
      </CardContent>
    </Card>
  );
}
