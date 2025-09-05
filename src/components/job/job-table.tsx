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
  const handleTaskTitleClick = (job: JobWithValidation) => {
    selectJob(job);
    navigate('/job/detail');
  };

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
          <TableRow key={job.job_id}>
            <TableCell className="font-medium max-w-[220px] truncate">
              <button
                onClick={() => handleTaskTitleClick(job)}
                className="text-left hover:text-primary hover:underline transition-colors"
              >
                {job.job_id}
              </button>
            </TableCell>
            <TableCell>
              <JobStatusBadge status={job.status} />
            </TableCell>
            <TableCell className="min-w-[160px]">
              <Progress value={Math.round(job.progress)} />
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
