import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useFeatureStore } from '@/models/feature';
import type { Feature } from '@/types/feature';

interface DeleteFeatureDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  feature: Feature | null;
}

export function DeleteFeatureDialog({ open, onOpenChange, feature }: DeleteFeatureDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { deleteFeature } = useFeatureStore();

  const handleDelete = async () => {
    if (!feature) return;

    setIsLoading(true);

    try {
      await deleteFeature(feature.id);
      onOpenChange(false);
    } catch (error) {
      console.error('删除特征失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-semibold">删除特征</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除特征 <strong>{feature?.name}</strong> 吗？
            <br />
            删除后将无法恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? '删除中...' : '确认删除'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
