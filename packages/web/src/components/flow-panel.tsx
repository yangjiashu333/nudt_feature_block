import { DroppableContainer } from './droppable-container';
import type { BlockItem } from './droppable-container';

export interface FlowPanelProps {
  blocks: BlockItem[];
}

export function FlowPanel({ blocks }: FlowPanelProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-80">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">面板</h3>
      <DroppableContainer id="panel" blocks={blocks} />
    </div>
  );
}
