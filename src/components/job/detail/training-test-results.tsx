import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TrainJob, ValJob } from '@/types/job';

type Props = {
  trainJob: TrainJob;
  valJob: ValJob;
};

export default function TrainingTestResults({ trainJob: job, valJob: validationJob }: Props) {
  // TODO: Replace with actual result data from job.result and validationJob.result
  const mockResults = {
    training: {
      accuracy: 87.5,
      kappa: 0.8432,
      precision: 0.8756,
      recall: 0.8634,
      f1: 0.8695,
      loss: 0.2456,
    },
    testing: {
      accuracy: 84.2,
      kappa: 0.8124,
      precision: 0.8534,
      recall: 0.8412,
      f1: 0.8473,
      loss: 0.2891,
    },
    classComparison: [
      {
        className: 'Class 1',
        trainPrecision: 0.89,
        testPrecision: 0.86,
        trainRecall: 0.87,
        testRecall: 0.84,
        trainF1: 0.88,
        testF1: 0.85,
      },
      {
        className: 'Class 2',
        trainPrecision: 0.85,
        testPrecision: 0.83,
        trainRecall: 0.91,
        testRecall: 0.89,
        trainF1: 0.88,
        testF1: 0.86,
      },
      {
        className: 'Class 3',
        trainPrecision: 0.92,
        testPrecision: 0.88,
        trainRecall: 0.84,
        testRecall: 0.81,
        trainF1: 0.88,
        testF1: 0.84,
      },
      {
        className: 'Class 4',
        trainPrecision: 0.81,
        testPrecision: 0.79,
        trainRecall: 0.86,
        testRecall: 0.83,
        trainF1: 0.83,
        testF1: 0.81,
      },
    ],
  };

  const getDifferenceColor = (trainValue: number, testValue: number) => {
    const diff = trainValue - testValue;
    if (Math.abs(diff) < 0.02) return 'text-green-600';
    if (diff > 0.05) return 'text-red-600';
    return 'text-yellow-600';
  };

  const formatDifference = (trainValue: number, testValue: number) => {
    const diff = trainValue - testValue;
    return diff > 0 ? `+${diff.toFixed(4)}` : diff.toFixed(4);
  };

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">整体对比</TabsTrigger>
            <TabsTrigger value="detailed">详细对比</TabsTrigger>
            <TabsTrigger value="analysis">性能分析</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Training Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">训练结果</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">准确率</p>
                    <p className="text-xl font-bold text-blue-600">
                      {mockResults.training.accuracy.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Kappa</p>
                    <p className="text-xl font-bold text-blue-600">
                      {mockResults.training.kappa.toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">F1分数</p>
                    <p className="text-xl font-bold text-blue-600">
                      {mockResults.training.f1.toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">损失</p>
                    <p className="text-xl font-bold text-blue-600">
                      {mockResults.training.loss.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Testing Results */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">测试结果</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">准确率</p>
                    <p className="text-xl font-bold text-green-600">
                      {mockResults.testing.accuracy.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Kappa</p>
                    <p className="text-xl font-bold text-green-600">
                      {mockResults.testing.kappa.toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">F1分数</p>
                    <p className="text-xl font-bold text-green-600">
                      {mockResults.testing.f1.toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">损失</p>
                    <p className="text-xl font-bold text-green-600">
                      {mockResults.testing.loss.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={2} className="border-r">
                      类别
                    </TableHead>
                    <TableHead colSpan={3} className="text-center border-r">
                      训练结果
                    </TableHead>
                    <TableHead colSpan={3} className="text-center border-r">
                      测试结果
                    </TableHead>
                    <TableHead colSpan={3} className="text-center">
                      差异
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead>精确率</TableHead>
                    <TableHead>召回率</TableHead>
                    <TableHead className="border-r">F1分数</TableHead>
                    <TableHead>精确率</TableHead>
                    <TableHead>召回率</TableHead>
                    <TableHead className="border-r">F1分数</TableHead>
                    <TableHead>精确率</TableHead>
                    <TableHead>召回率</TableHead>
                    <TableHead>F1分数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockResults.classComparison.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium border-r">{metric.className}</TableCell>
                      <TableCell>{metric.trainPrecision.toFixed(4)}</TableCell>
                      <TableCell>{metric.trainRecall.toFixed(4)}</TableCell>
                      <TableCell className="border-r">{metric.trainF1.toFixed(4)}</TableCell>
                      <TableCell>{metric.testPrecision.toFixed(4)}</TableCell>
                      <TableCell>{metric.testRecall.toFixed(4)}</TableCell>
                      <TableCell className="border-r">{metric.testF1.toFixed(4)}</TableCell>
                      <TableCell
                        className={getDifferenceColor(metric.trainPrecision, metric.testPrecision)}
                      >
                        {formatDifference(metric.trainPrecision, metric.testPrecision)}
                      </TableCell>
                      <TableCell
                        className={getDifferenceColor(metric.trainRecall, metric.testRecall)}
                      >
                        {formatDifference(metric.trainRecall, metric.testRecall)}
                      </TableCell>
                      <TableCell className={getDifferenceColor(metric.trainF1, metric.testF1)}>
                        {formatDifference(metric.trainF1, metric.testF1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">模型泛化能力</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>准确率下降</span>
                    <span className="font-mono text-orange-600">
                      {(mockResults.training.accuracy - mockResults.testing.accuracy).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>F1分数下降</span>
                    <span className="font-mono text-orange-600">
                      {(mockResults.training.f1 - mockResults.testing.f1).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>损失增加</span>
                    <span className="font-mono text-red-600">
                      +{(mockResults.testing.loss - mockResults.training.loss).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">性能评估</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">泛化性能</p>
                    <p className="text-lg font-bold text-green-600">良好</p>
                    <p className="text-xs text-green-600">准确率下降 5%</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">过拟合风险</p>
                    <p className="text-lg font-bold text-blue-600">较低</p>
                    <p className="text-xs text-blue-600">各指标下降幅度适中</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-muted-foreground">
          测试任务ID: {validationJob.val_job_id}
        </div>
      </CardContent>
    </Card>
  );
}
