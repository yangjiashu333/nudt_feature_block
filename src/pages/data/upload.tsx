import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Image, Database } from 'lucide-react';

export function DataUploadPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>数据上传</h2>
        <p className='text-muted-foreground'>上传训练数据集到平台</p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Upload className='h-5 w-5' />
              文件上传
            </CardTitle>
            <CardDescription>选择要上传的数据集文件</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
              <Upload className='mx-auto h-12 w-12 text-gray-400' />
              <p className='mt-2 text-sm text-gray-600'>
                点击选择文件或拖拽文件到此区域
              </p>
              <p className='text-xs text-gray-500'>
                支持 CSV, JSON, TXT 格式文件
              </p>
            </div>
            <Input type='file' className='mt-2' />
            <Button className='w-full'>开始上传</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Database className='h-5 w-5' />
              数据集信息
            </CardTitle>
            <CardDescription>配置数据集的基本信息</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>数据集名称</label>
              <Input placeholder='输入数据集名称' />
            </div>
            <div>
              <label className='text-sm font-medium'>描述</label>
              <Input placeholder='输入数据集描述' />
            </div>
            <div>
              <label className='text-sm font-medium'>标签</label>
              <Input placeholder='输入标签，用逗号分隔' />
            </div>
            <Button variant='outline' className='w-full'>
              保存配置
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>上传历史</CardTitle>
          <CardDescription>最近上传的数据集</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[
              {
                name: '图像分类数据集',
                type: 'image',
                size: '2.5GB',
                status: '已完成',
              },
              {
                name: '文本分析数据',
                type: 'text',
                size: '456MB',
                status: '处理中',
              },
              {
                name: '时序预测数据',
                type: 'csv',
                size: '128MB',
                status: '已完成',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  {item.type === 'image' && (
                    <Image className='h-5 w-5 text-blue-500' />
                  )}
                  {item.type === 'text' && (
                    <FileText className='h-5 w-5 text-green-500' />
                  )}
                  {item.type === 'csv' && (
                    <Database className='h-5 w-5 text-orange-500' />
                  )}
                  <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-sm text-gray-500'>{item.size}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === '已完成'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
