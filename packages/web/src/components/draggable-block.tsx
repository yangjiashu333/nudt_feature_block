import { useDraggable } from '@dnd-kit/core';

export interface DraggableBlockProps {
  id: string;
  content: string;
  isInNode?: boolean;
  onRemove?: (id: string) => void;
}

export function DraggableBlock({
  id,
  content,
  isInNode,
  onRemove,
}: DraggableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      disabled: isInNode, // Disable dragging if in node
    });

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      data-dragging={isDragging}
      className={`
        border rounded p-3 bg-white cursor-move select-none
        hover:border-blue-300
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{content}</span>
        {isInNode && onRemove && (
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove(id);
            }}
            className="text-gray-400 hover:text-red-500 text-xs ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
