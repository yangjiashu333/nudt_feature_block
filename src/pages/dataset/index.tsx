import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useDatasetStore } from '@/models/dataset';
import { DatasetCard } from '@/components/dataset/dataset-card';
import { DatasetViewerDialog } from '@/components/dataset/dataset-viewer-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import type { Dataset } from '@/types/dataset';
import type { Modality } from '@/types/common';

const modalityLabels: Record<Modality, string> = {
  SAR: 'SAR 数据',
  RD: 'RD 数据',
  '1D': '一维数据',
};

const modalityDescriptions: Record<Modality, string> = {
  SAR: '合成孔径雷达图像数据集',
  RD: '距离多普勒雷达信号数据集',
  '1D': '一维信号处理数据集',
};

export default function DatasetPage() {
  const { datasets, isLoading, getDatasetList, setSelectedDataset, toggleViewer } =
    useDatasetStore();

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        await getDatasetList();
      } catch {
        toast.error('获取数据集列表失败');
      }
    };
    loadDatasets();
  }, [getDatasetList]);

  const groupedDatasets = useMemo(() => {
    return datasets.reduce(
      (groups, dataset) => {
        if (!groups[dataset.modality]) {
          groups[dataset.modality] = [];
        }
        groups[dataset.modality].push(dataset);
        return groups;
      },
      {} as Record<Modality, Dataset[]>
    );
  }, [datasets]);

  const handleViewImages = async (dataset: Dataset) => {
    try {
      await setSelectedDataset(dataset);
      toggleViewer(true);
    } catch {
      toast.error('加载数据集图片失败');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  const isEmpty = Object.keys(groupedDatasets).length === 0;

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">数据集</h1>
          <p className="text-sm sm:text-base text-muted-foreground">管理和浏览机器学习训练数据集</p>
        </div>
      </div>

      {/* Content Section */}
      {isEmpty ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Database className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">暂无数据集</h3>
              <p className="text-muted-foreground max-w-sm">
                当前系统中没有可用的数据集，请联系管理员添加数据集
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {(Object.keys(groupedDatasets) as Modality[]).map((modality) => (
            <Card key={modality} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-3">
                      {modalityLabels[modality]}
                      <Badge variant="secondary" className="text-xs">
                        {groupedDatasets[modality].length} 个数据集
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {modalityDescriptions[modality]}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {groupedDatasets[modality].map((dataset) => (
                    <DatasetCard
                      key={dataset.id}
                      dataset={dataset}
                      onViewImages={handleViewImages}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DatasetViewerDialog />
    </div>
  );
}
