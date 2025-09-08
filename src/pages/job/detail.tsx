import { useNavigate } from 'react-router';
import { useJobStore } from '@/models/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TaskBasicInfo from '@/components/job/detail/task-basic-info';
import StaticLogs from '@/components/job/detail/static-logs';
import DynamicLogs from '@/components/job/detail/dynamic-logs';
import TrainResult from '@/components/job/detail/train-result';
import TrainValResult from '@/components/job/detail/train-val-result';

export default function TaskDetailPage() {
  const navigate = useNavigate();
  const { selectedJob } = useJobStore();

  const handleBackClick = () => {
    // 返回列表时清空选中任务
    useJobStore.setState({ selectedJob: null });
    navigate('/job');
  };

  if (!selectedJob) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>任务详情</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">请先选择一个任务</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderDetailComponents = () => {
    const { status, validationJob } = selectedJob;

    switch (status) {
      case 'running':
        return (
          <>
            <TaskBasicInfo job={selectedJob} />
            <DynamicLogs job={selectedJob} />
          </>
        );

      case 'done':
      case 'failed':
        if (validationJob) {
          return (
            <>
              <TaskBasicInfo job={selectedJob} />
              <StaticLogs job={selectedJob} />
              <TrainValResult trainJob={selectedJob} valJob={validationJob} />
            </>
          );
        } else {
          return (
            <>
              <TaskBasicInfo job={selectedJob} />
              <StaticLogs job={selectedJob} />
              <TrainResult job={selectedJob} />
            </>
          );
        }

      default:
        return <TaskBasicInfo job={selectedJob} />;
    }
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">任务详情</h1>
            <p className="text-muted-foreground">查看任务详细信息、日志和结果</p>
          </div>
        </div>
      </div>

      {renderDetailComponents()}
    </div>
  );
}
