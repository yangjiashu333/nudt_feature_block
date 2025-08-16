import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen } from 'lucide-react';
import type { Dataset } from '@/types/dataset';
import { cn } from '@/lib/utils';

interface DatasetCardProps {
  dataset: Dataset;
  onViewImages: (dataset: Dataset) => void;
  className?: string;
}

export function DatasetCard({ dataset, onViewImages, className }: DatasetCardProps) {
  const handleViewClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onViewImages(dataset);
  };

  return (
    <Card
      className={cn(
        'relative min-w-[200px] max-w-[400px] h-18 p-2 transition-all hover:shadow-md',
        className
      )}
    >
      <CardContent className="h-full px-2 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm truncate">{dataset.name}</h3>
        </div>

        <div className="flex gap-1">
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary"
            onClick={handleViewClick}
          >
            <FolderOpen className="h-4 w-4" />
            <span>查看数据</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
