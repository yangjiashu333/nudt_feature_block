import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { List, Plus, Settings, Play } from 'lucide-react';

export function OperatorListPage() {
  const operators = [
    {
      name: '数据预处理',
      description: '数据清洗和标准化操作',
      version: '1.2.0',
      category: '数据处理',
      status: '活跃',
      lastUsed: '2024-01-15',
    },
    {
      name: '特征提取',
      description: '从原始数据中提取有用特征',
      version: '2.1.0',
      category: '特征工程',
      status: '活跃',
      lastUsed: '2024-01-14',
    },
    {
      name: '模型训练',
      description: '深度学习模型训练算子',
      version: '3.0.0',
      category: '机器学习',
      status: '活跃',
      lastUsed: '2024-01-13',
    },
    {
      name: '模型评估',
      description: '模型性能评估和指标计算',
      version: '1.5.0',
      category: '评估',
      status: '活跃',
      lastUsed: '2024-01-12',
    },
    {
      name: '数据增强',
      description: '图像和文本数据增强技术',
      version: '1.8.0',
      category: '数据处理',
      status: '维护中',
      lastUsed: '2024-01-10',
    },
    {
      name: '超参数优化',
      description: '自动超参数调优算子',
      version: '2.3.0',
      category: '优化',
      status: '活跃',
      lastUsed: '2024-01-09',
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>算子列表</h2>
          <p className='text-muted-foreground'>查看和管理所有可用的算子</p>
        </div>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          添加算子
        </Button>
      </div>

      <div className='grid gap-4'>
        {operators.map((operator, index) => (
          <Card key={index} className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <List className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <CardTitle className='text-lg'>{operator.name}</CardTitle>
                    <CardDescription className='mt-1'>
                      {operator.description}
                    </CardDescription>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant={
                      operator.status === '活跃' ? 'default' : 'secondary'
                    }
                  >
                    {operator.status}
                  </Badge>
                  <Badge variant='outline'>v{operator.version}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-6 text-sm text-muted-foreground'>
                  <div>
                    <span className='font-medium'>类别:</span>{' '}
                    {operator.category}
                  </div>
                  <div>
                    <span className='font-medium'>最后使用:</span>{' '}
                    {operator.lastUsed}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button size='sm' variant='outline'>
                    <Settings className='h-4 w-4 mr-2' />
                    配置
                  </Button>
                  <Button size='sm'>
                    <Play className='h-4 w-4 mr-2' />
                    运行
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
