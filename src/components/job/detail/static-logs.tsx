import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { JobWithValidation } from '@/models/job';

type Props = {
  job: JobWithValidation;
};

export default function StaticLogs({ job }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual log fetching API call
      // const response = await jobApi.getTrainLogs(job.job_id);
      // setLogs(response.logs);

      // Mock data for now
      const mockLogs = [
        '[13:27:10] Starting training process...',
        '[13:27:15] Loading dataset...',
        '[13:27:20] Dataset loaded: 1000 samples',
        '[13:27:25] Initializing model...',
        '[13:27:30] Model initialized successfully',
        '[13:27:35] Starting epoch 1/10',
        '[13:28:00] Epoch 1 completed - Loss: 0.856, Accuracy: 65.2%',
        '[13:28:05] Starting epoch 2/10',
        '[13:28:30] Epoch 2 completed - Loss: 0.743, Accuracy: 71.8%',
        '[13:28:35] Training completed successfully',
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs(['Failed to load logs']);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (job.status === 'done' || job.status === 'failed') {
      fetchLogs();
    }
  }, [job.job_id, job.status]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>静态日志</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{job.status === 'done' ? '已完成' : '已失败'}</Badge>
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
              {isLoading ? '加载中...' : '刷新'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">暂无日志</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono break-all">
                  {log}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 text-xs text-muted-foreground">
          {/* TODO: Add log search/filter functionality */}
          日志总数: {logs.length} 行
        </div>
      </CardContent>
    </Card>
  );
}
