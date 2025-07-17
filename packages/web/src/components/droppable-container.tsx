import { useDroppable } from '@dnd-kit/core';
import { DraggableBlock } from './draggable-block';

export interface BlockItem {
  id: string;
  content: string;
}

export interface DroppableContainerProps {
  id: string;
  blocks: BlockItem[];
  isInNode?: boolean;
  onRemoveBlock?: (blockId: string) => void;
}

export function DroppableContainer({
  id,
  blocks,
  isInNode,
  onRemoveBlock,
}: DroppableContainerProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full max-w-md min-h-32 p-4 border-2 border-dashed rounded-lg
        transition-all duration-200 ease-in-out
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
      `}
    >
      <div className="flex flex-col gap-2">
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            将块拖拽到这里
          </div>
        ) : (
          blocks.map(block => (
            <DraggableBlock
              key={block.id}
              id={block.id}
              content={block.content}
              isInNode={isInNode}
              onRemove={onRemoveBlock}
            />
          ))
        )}
      </div>
    </div>
  );
}
