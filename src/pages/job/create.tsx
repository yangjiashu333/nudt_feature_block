import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useDatasetStore } from '@/models/dataset';
import { useBackboneStore } from '@/models/backbone';
import { useClassifierStore } from '@/models/classifier';
import { useFeatureStore } from '@/models/feature';
import { useAuthStore } from '@/models/auth';
import { jobApi } from '@/services/api/job';
import { toast } from 'sonner';

const ADAPTIVE_OPTIONS = ['0', '1'] as const;

const formSchema = z.object({
  dataset_id: z.string().min(1, { message: '请选择数据集' }),
  backbone_id: z.string().min(1, { message: '请选择骨干网络' }),
  classifier_id: z.string().min(1, { message: '请选择分类器' }),
  feature_ids: z.array(z.string()).min(1, { message: '请至少选择一个特征' }),
  adaptive: z.enum(ADAPTIVE_OPTIONS, { message: '请选择是否自适应' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateJobPage() {
  const navigate = useNavigate();
  const handleBackClick = () => navigate('/job');

  const { datasets, isLoading: datasetLoading, getDatasetList } = useDatasetStore();
  const { backbones, isLoading: backboneLoading, getBackboneList } = useBackboneStore();
  const { classifiers, isLoading: classifierLoading, getClassifierList } = useClassifierStore();
  const { features, isLoading: featureLoading, getFeatureList } = useFeatureStore();
  const { user } = useAuthStore();

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDatasetList();
    getBackboneList();
    getClassifierList();
    getFeatureList();
  }, [getDatasetList, getBackboneList, getClassifierList, getFeatureList]);

  const isLoading = datasetLoading || backboneLoading || classifierLoading || featureLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataset_id: '',
      backbone_id: '',
      classifier_id: '',
      feature_ids: [],
      adaptive: '0',
    },
  });

  useEffect(() => {
    // 自动选择第一个可用项，提升使用体验
    if (!isLoading) {
      if (datasets[0] && !form.getValues('dataset_id'))
        form.setValue('dataset_id', String(datasets[0].id));
      if (backbones[0] && !form.getValues('backbone_id'))
        form.setValue('backbone_id', String(backbones[0].id));
      if (classifiers[0] && !form.getValues('classifier_id'))
        form.setValue('classifier_id', String(classifiers[0].id));
      if (features.length > 0 && form.getValues('feature_ids').length === 0)
        form.setValue('feature_ids', [String(features[0].id)]);
    }
  }, [isLoading, datasets, backbones, classifiers, features, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!user?.id) {
      toast.error('未获取到用户信息，请先登录');
      return;
    }

    setSubmitting(true);
    try {
      const selectedFeatureIds = values.feature_ids.map((id) => Number(id));
      const payload = {
        user_id: user.id,
        dataset_id: Number(values.dataset_id),
        backbone_id: Number(values.backbone_id),
        classifier_id: Number(values.classifier_id),
        feature_ids:
          selectedFeatureIds.length === 1 ? selectedFeatureIds[0] : selectedFeatureIds,
        adaptive: Number(values.adaptive) as 0 | 1,
        nodes: {},
        config: {},
      };

      await jobApi.startTrain(payload);
      toast.success('训练任务创建成功');
      navigate('/job');
    } catch (e) {
      console.error(e);
      toast.error('创建训练任务失败');
    } finally {
      setSubmitting(false);
    }
  };

  const adaptiveOptions = useMemo(
    () => [
      { value: '0', label: '否' },
      { value: '1', label: '是' },
    ],
    []
  );

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">创建任务</h1>
            <p className="text-muted-foreground">按步骤配置训练所需的参数并提交</p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* 数据集 */}
          <div className="space-y-2">
            <h2 className="text-base font-medium">选择数据集</h2>
            <p className="text-sm text-muted-foreground">用于训练的数据来源。</p>
              <FormField
                control={form.control}
                name="dataset_id"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || submitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择数据集" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {datasets.map((d) => (
                          <SelectItem key={d.id} value={String(d.id)}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

          </div>

          {/* 骨干网络 */}
          <div className="space-y-2">
            <h2 className="text-base font-medium">选择骨干网络</h2>
            <p className="text-sm text-muted-foreground">用于特征提取或表示学习的基础网络。</p>
              <FormField
                control={form.control}
                name="backbone_id"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || submitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择骨干网络" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {backbones.map((b) => (
                          <SelectItem key={b.id} value={String(b.id)}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

          </div>

          {/* 分类器 */}
          <div className="space-y-2">
            <h2 className="text-base font-medium">选择分类器</h2>
            <p className="text-sm text-muted-foreground">用于最终任务输出的判别模块。</p>
              <FormField
                control={form.control}
                name="classifier_id"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading || submitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择分类器" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classifiers.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

          </div>

          {/* 特征（多选） */}
          <div className="space-y-2">
            <h2 className="text-base font-medium">选择特征</h2>
            <p className="text-sm text-muted-foreground">选择用于训练的特征算子（可多选）。</p>
            <FormField
                control={form.control}
                name="feature_ids"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2 border rounded-md p-3 max-h-64 overflow-auto max-w-2xl">
                      {features.map((f) => {
                        const value = String(f.id);
                        const checked = field.value?.includes(value);
                        return (
                          <label key={f.id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const next = new Set(field.value || []);
                                if (isChecked) next.add(value);
                                else next.delete(value);
                                field.onChange(Array.from(next));
                              }}
                              disabled={isLoading || submitting}
                            />
                            <span>{f.name}</span>
                          </label>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          {/* 自适应 */}
          <div className="space-y-2">
            <h2 className="text-base font-medium">是否启用自适应</h2>
            <p className="text-sm text-muted-foreground">根据数据动态调整训练过程。</p>
            <FormField
                control={form.control}
                name="adaptive"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={submitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="是否启用自适应" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {adaptiveOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>

          {/* 提交 */}
          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={submitting || isLoading}>
              {submitting ? '创建中...' : '创建训练任务'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
