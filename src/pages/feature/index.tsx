import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useFeatureStore } from '@/models/feature';
import FeatureBlock from '@/components/feature/feature-block';
import type { Feature } from '@/types/feature';
import type { Modality } from '@/types/common';

const modalityLabels: Record<Modality, string> = {
  SAR: 'SAR 数据',
  RD: 'RD 数据',
  '1D': '一维数据',
};

export default function FeaturePage() {
  const { features, isLoading, getFeatureList, openModal } = useFeatureStore();

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">特征算子</h1>
      </div>

      {Object.keys(groupedFeatures).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无特征数据</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.keys(groupedFeatures) as Modality[]).map((modality) => (
            <div key={modality} className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">{modalityLabels[modality]}</h2>
              <div className="space-y-3">
                {groupedFeatures[modality].map((feature) => (
                  <FeatureBlock
                    key={feature.id}
                    feature={feature}
                    showCheckbox={true}
                    showEditAction={true}
                    showDeleteAction={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
