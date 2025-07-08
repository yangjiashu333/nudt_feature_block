import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, Filter, Download } from 'lucide-react';

export function DataPreviewPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>数据预览</h2>
        <p className='text-muted-foreground'>查看和管理已上传的数据集</p>
      </div>

      <div className='flex gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
          <Input placeholder='搜索数据集...' className='pl-10' />
        </div>
        <Button variant='outline'>
          <Filter className='h-4 w-4 mr-2' />
          筛选
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {[
          {
            name: '图像分类数据集',
            description: '包含10,000张图像的分类数据集',
            size: '2.5GB',
            samples: '10,000',
            created: '2024-01-15',
            type: 'image',
          },
          {
            name: '文本分析数据',
            description: '社交媒体情感分析数据集',
            size: '456MB',
            samples: '50,000',
            created: '2024-01-10',
            type: 'text',
          },
          {
            name: '时序预测数据',
            description: '股票价格时间序列数据',
            size: '128MB',
            samples: '5,000',
            created: '2024-01-08',
            type: 'timeseries',
          },
          {
            name: '语音识别数据',
            description: '多语言语音识别训练数据',
            size: '1.2GB',
            samples: '8,000',
            created: '2024-01-05',
            type: 'audio',
          },
          {
            name: '推荐系统数据',
            description: '用户行为和偏好数据',
            size: '890MB',
            samples: '100,000',
            created: '2024-01-03',
            type: 'behavior',
          },
          {
            name: '医疗影像数据',
            description: 'X光片诊断数据集',
            size: '3.1GB',
            samples: '15,000',
            created: '2024-01-01',
            type: 'medical',
          },
        ].map((dataset, index) => (
          <Card key={index} className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Eye className='h-5 w-5' />
                {dataset.name}
              </CardTitle>
              <CardDescription>{dataset.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>大小:</span>
                  <span className='font-medium'>{dataset.size}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>样本数:</span>
                  <span className='font-medium'>{dataset.samples}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>创建时间:</span>
                  <span className='font-medium'>{dataset.created}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-500'>类型:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      dataset.type === 'image'
                        ? 'bg-blue-100 text-blue-800'
                        : dataset.type === 'text'
                          ? 'bg-green-100 text-green-800'
                          : dataset.type === 'timeseries'
                            ? 'bg-purple-100 text-purple-800'
                            : dataset.type === 'audio'
                              ? 'bg-orange-100 text-orange-800'
                              : dataset.type === 'behavior'
                                ? 'bg-pink-100 text-pink-800'
                                : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {dataset.type}
                  </span>
                </div>
                <div className='flex gap-2 mt-4'>
                  <Button size='sm' className='flex-1'>
                    <Eye className='h-4 w-4 mr-2' />
                    预览
                  </Button>
                  <Button size='sm' variant='outline'>
                    <Download className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
