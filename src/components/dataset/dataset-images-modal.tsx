import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Image as ImageIcon, Tag, Folder } from 'lucide-react';
import { useDatasetStore } from '@/models/dataset';
import type { Dataset } from '@/types/dataset';
import type { Modality } from '@/types/common';

const modalityColors: Record<Modality, string> = {
  SAR: 'bg-blue-50 text-blue-700 border-blue-200',
  RD: 'bg-green-50 text-green-700 border-green-200',
  '1D': 'bg-purple-50 text-purple-700 border-purple-200',
};

interface DatasetImagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataset: Dataset | null;
}

export function DatasetImagesModal({ open, onOpenChange, dataset }: DatasetImagesModalProps) {
  const { images, isLoading, getImageList } = useDatasetStore();

  useEffect(() => {
    if (open && dataset) {
      getImageList(dataset.id);
    }
  }, [open, dataset, getImageList]);

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-semibold">
                {dataset?.name}
              </DialogTitle>
              {dataset && (
                <Badge 
                  variant="outline" 
                  className={modalityColors[dataset.modality]}
                >
                  {dataset.modality}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              共 {images.length} 个文件
            </div>
          </div>
          
          {dataset && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Folder className="h-4 w-4" />
              <span>{dataset.path}</span>
            </div>
          )}
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">暂无图像文件</h3>
              <p className="text-muted-foreground">该数据集中没有发现图像文件</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    {/* Placeholder for image - in real implementation, would show actual image */}
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-3">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm truncate">{image.name}</h4>
                      
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                          {image.label}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate" title={image.path}>
                        {image.path}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}