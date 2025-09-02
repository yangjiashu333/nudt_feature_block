import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { JobWithValidation } from '@/models/job';

type Props = {
  job: JobWithValidation;
};

export default function TrainingResults({ job }: Props) {
  // TODO: Replace with actual result data from job.result
  const mockTrainingResults = {
    finalMetrics: {
      accuracy: 87.5,
      kappa: 0.8432,
      precision: 0.8756,
      recall: 0.8634,
      f1: 0.8695,
      loss: 0.2456,
    },
    classMetrics: [
      { className: 'Class 1', precision: 0.89, recall: 0.87, f1: 0.88, support: 150 },
      { className: 'Class 2', precision: 0.85, recall: 0.91, f1: 0.88, support: 120 },
      { className: 'Class 3', precision: 0.92, recall: 0.84, f1: 0.88, support: 180 },
      { className: 'Class 4', precision: 0.81, recall: 0.86, f1: 0.83, support: 95 },
    ],
    trainingInfo: {
      totalEpochs: 10,
      bestEpoch: 8,
      trainingTime: '02:34:12',
      modelSize: '45.2 MB',
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>训练结果</CardTitle>
          <Badge variant="default">仅训练结果</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-4">整体指标</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">准确率</p>
              <p className="text-2xl font-bold text-green-600">
                {mockTrainingResults.finalMetrics.accuracy.toFixed(1)}%
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">Kappa系数</p>
              <p className="text-2xl font-bold">
                {mockTrainingResults.finalMetrics.kappa.toFixed(4)}
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">F1分数</p>
              <p className="text-2xl font-bold">{mockTrainingResults.finalMetrics.f1.toFixed(4)}</p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">精确率</p>
              <p className="text-2xl font-bold">
                {mockTrainingResults.finalMetrics.precision.toFixed(4)}
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">召回率</p>
              <p className="text-2xl font-bold">
                {mockTrainingResults.finalMetrics.recall.toFixed(4)}
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">损失</p>
              <p className="text-2xl font-bold text-orange-600">
                {mockTrainingResults.finalMetrics.loss.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Class-wise Metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-4">各类别指标</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类别</TableHead>
                  <TableHead>精确率</TableHead>
                  <TableHead>召回率</TableHead>
                  <TableHead>F1分数</TableHead>
                  <TableHead>样本数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTrainingResults.classMetrics.map((metric, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{metric.className}</TableCell>
                    <TableCell>{metric.precision.toFixed(4)}</TableCell>
                    <TableCell>{metric.recall.toFixed(4)}</TableCell>
                    <TableCell>{metric.f1.toFixed(4)}</TableCell>
                    <TableCell>{metric.support}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Training Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">训练信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">总轮数</p>
              <p className="text-lg font-semibold">
                {mockTrainingResults.trainingInfo.totalEpochs}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">最佳轮数</p>
              <p className="text-lg font-semibold">{mockTrainingResults.trainingInfo.bestEpoch}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">训练时长</p>
              <p className="text-lg font-semibold">
                {mockTrainingResults.trainingInfo.trainingTime}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">模型大小</p>
              <p className="text-lg font-semibold">{mockTrainingResults.trainingInfo.modelSize}</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {/* TODO: Add download model, export results functionality */}
          提示：实际数据将从 job.result 获取
        </div>
      </CardContent>
    </Card>
  );
}
