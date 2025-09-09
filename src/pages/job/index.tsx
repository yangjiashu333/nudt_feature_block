import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Plus } from 'lucide-react';
import { useJobStore } from '@/models/job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JobTable from '@/components/job/job-table';

export default function JobPage() {
  const navigate = useNavigate();
  const { trainJobs, isLoading, fetchJobs, startPolling, stopPolling } = useJobStore();

  useEffect(() => {
    fetchJobs();
    startPolling();
    return () => stopPolling();
  }, [fetchJobs, startPolling, stopPolling]);

  const stats = useMemo(() => {
    const total = trainJobs.length;
    const running = trainJobs.filter((j) => j.status === 'running').length;
    const pending = trainJobs.filter((j) => j.status === 'pending').length;
    const done = trainJobs.filter((j) => j.status === 'done').length;
    const failed = trainJobs.filter((j) => j.status === 'failed').length;
    return { total, running, pending, done, failed };
  }, [trainJobs]);

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">任务管理</h1>
          <p className="text-muted-foreground">查看训练/验证任务状态与进度</p>
        </div>
        <Button size="lg" className="gap-2" onClick={() => navigate('/job/create')}>
          <Plus className="h-4 w-4" />
          创建任务
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>总任务</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>执行中</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.running}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>待执行</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.pending}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>完成</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.done}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>任务列表</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground">加载中...</div>
          ) : trainJobs.length === 0 ? (
            <div className="text-muted-foreground">暂无任务</div>
          ) : (
            <JobTable jobs={trainJobs} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
