import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const handleBackClick = () => navigate('/job');
  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">创建任务</h1>
            <p className="text-muted-foreground">配置数据集、骨干网络与分类器以启动训练</p>
          </div>
        </div>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>内容占位符</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">表单与配置区域将稍后添加。</div>
        </CardContent>
      </Card>
    </div>
  );
}
