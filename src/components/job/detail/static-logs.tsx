import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useJobStore } from '@/models/job';
import type { JobWithValidation } from '@/models/job';

type Props = {
  job: JobWithValidation;
};

export default function StaticLogs({ job }: Props) {
  const { logs, fetchStaticLogs } = useJobStore();
  useEffect(() => {
    if (job.status === 'done' || job.status === 'failed') {
      fetchStaticLogs(job.job_id);
    }
  }, [job.job_id, job.status, fetchStaticLogs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>训练日志</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full border rounded-md p-4">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">暂无日志</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono break-all">
                  { log.raw }
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
