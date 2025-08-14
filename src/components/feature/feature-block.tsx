import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { Feature } from '@/types/feature';

interface FeatureBlockProps {
  feature: Feature;
  showCheckbox?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  onEdit?: (feature: Feature) => void;
  onDelete?: (feature: Feature) => void;
  onSelect?: (feature: Feature, selected: boolean) => void;
  className?: string;
}

export default function FeatureBlock({
  feature,
  showCheckbox = false,
  showEditAction = false,
  showDeleteAction = false,
  onEdit,
  onDelete,
  onSelect,
  className,
}: FeatureBlockProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = (checked: boolean) => {
    setIsSelected(checked);
    onSelect?.(feature, checked);
  };

  const handleEdit = () => {
    onEdit?.(feature);
  };

  const handleDelete = () => {
    onDelete?.(feature);
  };

  return (
    <Card
      className={cn(
        'relative min-w-[200px] max-w-[400px] h-18 p-2 transition-all hover:shadow-md',
        className
      )}
    >
      <CardContent className="h-full px-2 flex items-center justify-between">
        {showCheckbox && (
          <Checkbox checked={isSelected} onCheckedChange={handleSelect} className="mr-4" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-sm truncate">{feature.name}</h3>
          {feature.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{feature.description}</p>
          )}
        </div>

        <div className="flex gap-1">
          {showEditAction && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit />
            </Button>
          )}
          {showDeleteAction && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
