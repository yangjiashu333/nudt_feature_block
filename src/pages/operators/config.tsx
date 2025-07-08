import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Cog, Save, RotateCcw, Play } from 'lucide-react';

export function OperatorConfigPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>算子配置</h2>
        <p className='text-muted-foreground'>配置和自定义算子参数</p>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <div>
                  <CardTitle className='flex items-center gap-2'>
                    <Cog className='h-5 w-5' />
                    模型训练算子
                  </CardTitle>
                  <CardDescription>配置深度学习模型训练参数</CardDescription>
                </div>
                <Badge>v3.0.0</Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <Label htmlFor='learning-rate'>学习率</Label>
                  <Input
                    id='learning-rate'
                    type='number'
                    placeholder='0.001'
                    defaultValue='0.001'
                  />
                </div>
                <div>
                  <Label htmlFor='batch-size'>批次大小</Label>
                  <Input
                    id='batch-size'
                    type='number'
                    placeholder='32'
                    defaultValue='32'
                  />
                </div>
                <div>
                  <Label htmlFor='epochs'>训练轮数</Label>
                  <Input
                    id='epochs'
                    type='number'
                    placeholder='100'
                    defaultValue='100'
                  />
                </div>
                <div>
                  <Label htmlFor='optimizer'>优化器</Label>
                  <Input
                    id='optimizer'
                    placeholder='Adam'
                    defaultValue='Adam'
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='model-config'>模型配置</Label>
                <Textarea
                  id='model-config'
                  placeholder='输入模型配置JSON...'
                  rows={6}
                  defaultValue={`{
  "architecture": "ResNet50",
  "layers": [
    {"type": "conv2d", "filters": 64, "kernel_size": 7},
    {"type": "batch_norm"},
    {"type": "relu"}
  ],
  "dropout": 0.5
}`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>高级设置</CardTitle>
              <CardDescription>专家级配置选项</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <Label htmlFor='gpu-count'>GPU数量</Label>
                  <Input
                    id='gpu-count'
                    type='number'
                    placeholder='1'
                    defaultValue='1'
                  />
                </div>
                <div>
                  <Label htmlFor='memory-limit'>内存限制 (GB)</Label>
                  <Input
                    id='memory-limit'
                    type='number'
                    placeholder='16'
                    defaultValue='16'
                  />
                </div>
                <div>
                  <Label htmlFor='checkpoint-interval'>检查点间隔</Label>
                  <Input
                    id='checkpoint-interval'
                    type='number'
                    placeholder='10'
                    defaultValue='10'
                  />
                </div>
                <div>
                  <Label htmlFor='early-stopping'>早停轮数</Label>
                  <Input
                    id='early-stopping'
                    type='number'
                    placeholder='5'
                    defaultValue='5'
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>操作</CardTitle>
              <CardDescription>配置管理操作</CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button className='w-full'>
                <Save className='h-4 w-4 mr-2' />
                保存配置
              </Button>
              <Button variant='outline' className='w-full'>
                <RotateCcw className='h-4 w-4 mr-2' />
                恢复默认
              </Button>
              <Button variant='secondary' className='w-full'>
                <Play className='h-4 w-4 mr-2' />
                测试运行
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>配置历史</CardTitle>
              <CardDescription>最近的配置版本</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {[
                  { version: '3.0.0', date: '2024-01-15', status: '当前' },
                  { version: '2.9.5', date: '2024-01-10', status: '稳定' },
                  { version: '2.9.0', date: '2024-01-05', status: '历史' },
                ].map((config, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>v{config.version}</p>
                      <p className='text-sm text-gray-500'>{config.date}</p>
                    </div>
                    <Badge
                      variant={
                        config.status === '当前' ? 'default' : 'secondary'
                      }
                    >
                      {config.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
