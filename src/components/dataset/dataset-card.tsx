import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';
import type { Dataset } from '@/types/dataset';

interface DatasetCardProps {
  dataset: Dataset;
  onViewImages: (dataset: Dataset) => void;
  imageCount?: number;
}

export function DatasetCard({ dataset, onViewImages, imageCount = 0 }: DatasetCardProps) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg font-semibold truncate">
          <div className="flex items-center justify-between">
            <span>{dataset.name}</span>
            <Button
              variant="link"
              className="text-muted-foreground"
              onClick={() => onViewImages(dataset)}
            >
              <FolderOpen className="h-4 w-4" />
              <span>{imageCount} 条数据</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
