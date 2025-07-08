import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Database, Settings, Network, PlayCircle } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>仪表盘</h2>
        <p className='text-muted-foreground'>
          欢迎使用 AI 训练平台，管理您的机器学习项目
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>数据集</CardTitle>
            <Database className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>+2 个新数据集</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>算子</CardTitle>
            <Settings className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>8</div>
            <p className='text-xs text-muted-foreground'>+1 个新算子</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>网络模型</CardTitle>
            <Network className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>5</div>
            <p className='text-xs text-muted-foreground'>正在训练中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>训练任务</CardTitle>
            <PlayCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3</div>
            <p className='text-xs text-muted-foreground'>任务运行中</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>训练进度</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-4'>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-blue-600 h-2 rounded-full'
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <span className='text-sm'>75%</span>
              </div>
              <p className='text-sm text-muted-foreground'>
                当前训练：ResNet-50 模型
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>您的最新操作记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center space-x-4'>
                <div className='w-2 h-2 bg-blue-600 rounded-full'></div>
                <div>
                  <p className='text-sm font-medium'>上传新数据集</p>
                  <p className='text-xs text-muted-foreground'>2小时前</p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <div className='w-2 h-2 bg-green-600 rounded-full'></div>
                <div>
                  <p className='text-sm font-medium'>训练任务完成</p>
                  <p className='text-xs text-muted-foreground'>4小时前</p>
                </div>
              </div>
              <div className='flex items-center space-x-4'>
                <div className='w-2 h-2 bg-yellow-600 rounded-full'></div>
                <div>
                  <p className='text-sm font-medium'>配置新算子</p>
                  <p className='text-xs text-muted-foreground'>1天前</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
