import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Image as ImageIcon, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Image } from '@/types/dataset';

interface FileExplorerPanelProps {
  images: Image[];
  selectedImageId: number | null;
  onImageSelect: (imageId: number) => void;
}

export function FileExplorerPanel({
  images,
  selectedImageId,
  onImageSelect,
}: FileExplorerPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredImages = useMemo(() => {
    if (!searchQuery.trim()) return images;

    return images.filter(
      (image) =>
        image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, searchQuery]);

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

    return imageExtensions.includes(extension || '') ? (
      <ImageIcon className="h-4 w-4 text-blue-500" />
    ) : (
      <FileText className="h-4 w-4 text-gray-500" />
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Input
          placeholder="搜索文件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        {filteredImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? '未找到匹配的文件' : '暂无文件'}
            </p>
          </div>
        ) : (
          <div>
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => onImageSelect(image.id)}
                className={cn(
                  'flex items-center gap-1 p-3 cursor-pointer transition-colors hover:bg-muted',
                  selectedImageId === image.id && 'bg-secondary'
                )}
              >
                <div className="flex-shrink-0">{getFileIcon(image.name)}</div>
                <p
                  className={cn(
                    'text-sm truncate',
                    selectedImageId === image.id ? 'font-medium' : 'font-normal'
                  )}
                  title={image.name}
                >
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
