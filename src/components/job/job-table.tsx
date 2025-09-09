import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useJobStore } from '@/models/job';
import JobStatusBadge from './job-status-badge';
import type { JobWithValidation } from '@/models/job';

type Props = {
  jobs: JobWithValidation[];
};

export default function JobTable({ jobs }: Props) {
  const navigate = useNavigate();
  const { selectJob } = useJobStore();
  const handleRowClick = (job: JobWithValidation) => {
    selectJob(job);
    navigate('/job/detail');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>训练进度</TableHead>
          <TableHead>测试任务</TableHead>
          <TableHead>创建时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow
            key={job.job_id}
            onClick={() => handleRowClick(job)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell className="font-medium max-w-[220px] truncate">
              {job.job_id}
            </TableCell>
            <TableCell>
              <JobStatusBadge status={job.status} />
            </TableCell>
            <TableCell className="min-w-[200px]">
              <div className="flex items-center gap-2">
                <Progress value={Math.round(job.progress)} />
                <span className="text-sm text-muted-foreground tabular-nums">
                  {Math.round(job.progress)}%
                </span>
              </div>
            </TableCell>
            <TableCell>
              {job.validationJob ? (
                <Badge variant="secondary">已测试</Badge>
              ) : (
                <Badge variant="outline">未测试</Badge>
              )}
            </TableCell>
            <TableCell>{new Date(job.createTime).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
