import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDatasetStore } from '@/models/dataset';
import { useBackboneStore } from '@/models/backbone';
import { useClassifierStore } from '@/models/classifier';
import { useFeatureStore } from '@/models/feature';
import JobStatusBadge from '../job-status-badge';
import type { JobWithValidation } from '@/models/job';

type Props = {
  job: JobWithValidation;
};

export default function TaskBasicInfo({ job }: Props) {
  const { datasets } = useDatasetStore();
  const { backbones } = useBackboneStore();
  const { classifiers } = useClassifierStore();
  const { features } = useFeatureStore();

  const jobDetails = useMemo(() => {
    const dataset = datasets.find(d => d.id === job.dataset_id);
    const backbone = backbones.find(b => b.id === job.backbone_id);
    const classifier = classifiers.find(c => c.id === job.classifier_id);
    
    // Handle feature_ids which could be number or number[]
    let featureNames: string[] = [];
    if (job.feature_ids) {
      const featureIds = Array.isArray(job.feature_ids) ? job.feature_ids : [job.feature_ids];
      featureNames = featureIds
        .map(id => features.find(f => f.id === id)?.name)
        .filter(Boolean) as string[];
    }

    return {
      datasetName: dataset?.name || `ID: ${job.dataset_id}`,
      backboneName: backbone?.name || `ID: ${job.backbone_id}`,
      classifierName: classifier?.name || `ID: ${job.classifier_id}`,
      featureNames: featureNames.length > 0 ? featureNames : ['未指定特征']
    };
  }, [job, datasets, backbones, classifiers, features]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>任务基本信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">任务ID</p>
            <p className="text-sm font-mono break-all">{job.job_id}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">状态</p>
            <div><JobStatusBadge status={job.status} /></div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">创建时间</p>
            <p className="text-sm">{new Date(job.createTime).toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">数据集</p>
            <p className="text-sm">{jobDetails.datasetName}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">骨干网络</p>
            <p className="text-sm">{jobDetails.backboneName}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">分类器</p>
            <p className="text-sm">{jobDetails.classifierName}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">特征</p>
            <div className="flex flex-wrap gap-2">
              {jobDetails.featureNames.map((name, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">自适应</p>
            <p className="text-sm">{job.adaptive ? '是' : '否'}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">测试情况</p>
            <div>
              {job.validationJob ? (
                <Badge variant="secondary">已测试</Badge>
              ) : (
                <Badge variant="outline">未测试</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">进度</p>
            <span className="text-sm font-medium">{Math.round(job.progress)}%</span>
          </div>
          <Progress value={job.progress} className="w-full" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">节点配置</p>
          <div className="bg-muted p-3 rounded-md">
            <pre className="text-xs overflow-x-auto">
              {/* TODO: Format nodes configuration properly */}
              {JSON.stringify(job.nodes, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
