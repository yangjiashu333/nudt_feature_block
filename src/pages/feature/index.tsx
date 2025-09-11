import { useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useFeatureStore } from '@/models/feature';
import FeatureBlock from '@/components/feature/feature-block';
import { AddFeatureModal } from '@/components/feature/add-feature-modal';
import { EditFeatureModal } from '@/components/feature/edit-feature-modal';
import { DeleteFeatureDialog } from '@/components/feature/delete-feature-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Feature } from '@/types/feature';
import type { Modality } from '@/types/common';

const modalityLabels: Record<Modality, string> = {
  SAR: 'SAR 数据',
  RD: 'RD 数据',
  '1D': '一维数据',
};


export default function FeaturePage() {
  const {
    features,
    isLoading,
    selectedFeature,
    addFeatureModalOpen,
    deleteFeatureModalOpen,
    getFeatureList,
    openModal,
    closeModal,
  } = useFeatureStore();

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        await getFeatureList();
      } catch {
        toast.error('获取特征列表失败');
      }
    };
    loadFeatures();
  }, [getFeatureList]);

  const groupedFeatures = useMemo(() => {
    return features.reduce(
      (groups, feature) => {
        if (!groups[feature.modality]) {
          groups[feature.modality] = [];
        }
        groups[feature.modality].push(feature);
        return groups;
      },
      {} as Record<Modality, Feature[]>
    );
  }, [features]);

  const handleEdit = (feature: Feature) => {
    openModal('editFeature', feature);
  };

  const handleDelete = (feature: Feature) => {
    openModal('deleteFeature', feature);
  };

  const handleAddFeature = () => {
    openModal('addFeature');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  const isEmpty = Object.keys(groupedFeatures).length === 0;

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">特征算子</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            管理和组织数据管道中的特征处理算子
          </p>
        </div>
        <Button onClick={handleAddFeature} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          添加特征
        </Button>
      </div>

      {/* Content Section */}
      {isEmpty ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">暂无特征算子</h3>
              <p className="text-muted-foreground max-w-sm">
                开始创建您的第一个特征算子来构建数据处理管道
              </p>
              <Button onClick={handleAddFeature} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                创建特征算子
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {(Object.keys(groupedFeatures) as Modality[]).map((modality) => (
            <Card key={modality} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-3">
                      {modalityLabels[modality]}
                      <Badge variant="secondary" className="text-xs">
                        {groupedFeatures[modality].length} 个算子
                      </Badge>
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {groupedFeatures[modality].map((feature) => (
                    <FeatureBlock
                      key={feature.id}
                      feature={feature}
                      showEditAction={true}
                      showDeleteAction={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      className="w-full"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddFeatureModal open={addFeatureModalOpen} onOpenChange={() => closeModal('addFeature')} />
      <EditFeatureModal />
      <DeleteFeatureDialog
        open={deleteFeatureModalOpen}
        onOpenChange={() => closeModal('deleteFeature')}
        feature={selectedFeature}
      />
    </div>
  );
}
