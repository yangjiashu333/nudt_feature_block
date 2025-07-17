import type { NodeProps, Node } from '@xyflow/react';
import { DroppableContainer } from '../droppable-container';
import type { BlockItem } from '../droppable-container';

export interface DroppableNodeData extends Record<string, unknown> {
  blocks: BlockItem[];
  onRemoveBlock: (blockId: string, nodeId: string) => void;
}

export type DroppableNode = Node<DroppableNodeData>;

export function DroppableNode({ id, data }: NodeProps<DroppableNode>) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 min-w-64">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">节点 {id}</h3>
      <div className="nodrag">
        <DroppableContainer
          id={`${id}`}
          blocks={data.blocks}
          isInNode={true}
          onRemoveBlock={blockId => data.onRemoveBlock(blockId, id)}
        />
      </div>
    </div>
  );
}
