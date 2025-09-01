import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { JobWithValidation } from '@/models/job';

type Props = {
  jobs: JobWithValidation[];
  onRowClick?: (job: JobWithValidation) => void;
};

export default function JobTable({ jobs, onRowClick }: Props) {
  const statusBadge = (s: JobWithValidation['status']) => (
    <Badge
      variant={s === 'running' ? 'secondary' : s === 'pending' ? 'outline' : s === 'failed' ? 'destructive' : 'default'}
    >
      {s}
    </Badge>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>任务ID</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>进度</TableHead>
          <TableHead>测试情况</TableHead>
          <TableHead>创建时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.job_id} onClick={() => onRowClick?.(job)} className="cursor-pointer">
            <TableCell className="font-medium max-w-[220px] truncate">{job.job_id}</TableCell>
            <TableCell>{statusBadge(job.status)}</TableCell>
            <TableCell className="min-w-[160px]">
              <Progress value={Math.round(job.progress)} />
            </TableCell>
            <TableCell>
              {job.validationJob ? <Badge variant="secondary">已测试</Badge> : <Badge variant="outline">未测试</Badge>}
            </TableCell>
            <TableCell>{new Date(job.createTime).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

