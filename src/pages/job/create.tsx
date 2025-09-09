import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDatasetStore } from '@/models/dataset';
import { useBackboneStore } from '@/models/backbone';
import { useClassifierStore } from '@/models/classifier';
import { useAuthStore } from '@/models/auth';
import { jobApi } from '@/services/api/job';
import { toast } from 'sonner';

const ADAPTIVE_OPTIONS = ['0', '1'] as const;

const formSchema = z.object({
  dataset_id: z.string().min(1, { message: '请选择数据集' }),
  backbone_id: z.string().min(1, { message: '请选择骨干网络' }),
  classifier_id: z.string().min(1, { message: '请选择分类器' }),
  adaptive: z.enum(ADAPTIVE_OPTIONS, { message: '请选择是否自适应' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateJobPage() {
  const navigate = useNavigate();
  const handleBackClick = () => navigate('/job');

  const { datasets, isLoading: datasetLoading, getDatasetList } = useDatasetStore();
  const { backbones, isLoading: backboneLoading, getBackboneList } = useBackboneStore();
  const { classifiers, isLoading: classifierLoading, getClassifierList } = useClassifierStore();
  const { user } = useAuthStore();

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDatasetList();
    getBackboneList();
    getClassifierList();
  }, [getDatasetList, getBackboneList, getClassifierList]);

  const isLoading = datasetLoading || backboneLoading || classifierLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataset_id: '',
      backbone_id: '',
      classifier_id: '',
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
    }
  }, [isLoading, datasets, backbones, classifiers, form]);

  const handleSubmit = async (values: FormValues) => {
    if (!user?.id) {
      toast.error('未获取到用户信息，请先登录');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        dataset_id: Number(values.dataset_id),
        backbone_id: Number(values.backbone_id),
        classifier_id: Number(values.classifier_id),
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
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">创建任务</h1>
            <p className="text-muted-foreground">选择数据集、骨干网络与分类器以启动训练</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>训练任务配置</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="dataset_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>数据集</FormLabel>
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

              <FormField
                control={form.control}
                name="backbone_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>骨干网络</FormLabel>
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

              <FormField
                control={form.control}
                name="classifier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类器</FormLabel>
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

              <FormField
                control={form.control}
                name="adaptive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>自适应</FormLabel>
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

              <div className="sm:col-span-2 flex justify-end gap-3">
                <Button type="submit" disabled={submitting || isLoading}>
                  {submitting ? '创建中...' : '创建训练任务'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
