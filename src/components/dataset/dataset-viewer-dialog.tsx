import { useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useDatasetStore } from '@/models/dataset';
import { FileExplorerPanel } from './file-explorer-panel';
import { ImageViewerPanel } from './image-viewer-panel';
import { Separator } from '@/components/ui/separator';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

export function DatasetViewerDialog() {
  const { isViewerOpen, toggleViewer, images, selectedImageId, setSelectedImage } =
    useDatasetStore();

  const selectedImage = images.find((img) => img.id === selectedImageId);

  const handleImageSelect = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const handlePreviousImage = useCallback(() => {
    if (!selectedImageId || images.length === 0) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImageId);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setSelectedImage(images[previousIndex].id);
  }, [selectedImageId, images, setSelectedImage]);

  const handleNextImage = useCallback(() => {
    if (!selectedImageId || images.length === 0) return;
    const currentIndex = images.findIndex((img) => img.id === selectedImageId);
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(images[nextIndex].id);
  }, [selectedImageId, images, setSelectedImage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isViewerOpen) return;

      switch (event.key) {
        case 'Escape':
          toggleViewer(false);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePreviousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextImage();
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          event.preventDefault();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isViewerOpen, selectedImageId, images, handlePreviousImage, handleNextImage, toggleViewer]);

  return (
    <Dialog open={isViewerOpen} onOpenChange={(open) => toggleViewer(open)}>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogContent
        className="p-0 gap-0 !max-w-6xl max-h-[90vh] w-[95vw] h-[85vh]"
        showCloseButton={false}
      >
        <div className="flex flex-1 min-h-0">
          <div className="w-1/4 min-w-[280px]">
            <FileExplorerPanel
              images={images}
              selectedImageId={selectedImageId}
              onImageSelect={handleImageSelect}
            />
          </div>

          <Separator orientation="vertical" />

          <div className="flex-1 flex flex-col min-w-0">
            <ImageViewerPanel
              image={selectedImage}
              onPrevious={handlePreviousImage}
              onNext={handleNextImage}
              canNavigate={images.length > 1}
              currentIndex={
                selectedImageId ? images.findIndex((img) => img.id === selectedImageId) + 1 : 0
              }
              totalCount={images.length}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
