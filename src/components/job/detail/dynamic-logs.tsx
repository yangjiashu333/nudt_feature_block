import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useJobStore } from '@/models/job';
import type { JobWithValidation } from '@/models/job';

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
      // 离开详情页时，无论状态如何，清理 SSE 连接
      disconnectFromLogs();
    };
  }, [job.job_id, job.status, connectToLogs, disconnectFromLogs]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

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
        return { status: 'unknown', text: '未知', variant: 'default' as const };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>训练日志</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={connectionStatus.variant}>{connectionStatus.text}</Badge>
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
                  {log.raw}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
