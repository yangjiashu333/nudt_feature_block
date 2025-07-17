import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import './App.css';
import { ReactFlow, Background, Panel, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState, useCallback, useEffect } from 'react';
import { DroppableNode } from './components/custom-node/droppable-node';
import { FlowPanel } from './components/flow-panel';
import type { BlockItem } from './components/droppable-container';
import type { DroppableNodeData } from './components/custom-node/droppable-node';

const createInitialNodes = (
  handleRemoveBlock: (blockId: string, nodeId: string) => void
) => [
  {
    id: 'n1',
    position: { x: 400, y: 100 },
    type: 'droppableNode',
    data: {
      blocks: [] as BlockItem[],
      onRemoveBlock: handleRemoveBlock,
    },
  },
];

const nodeTypes = {
  droppableNode: DroppableNode,
};

// Fixed panel blocks that always remain in the same order
const fixedPanelBlocks: BlockItem[] = [
  { id: '1', content: '任务 1' },
  { id: '2', content: '任务 2' },
  { id: '3', content: '任务 3' },
  { id: '4', content: '任务 4' },
  { id: '5', content: '任务 5' },
  { id: '6', content: '任务 6' },
  { id: '7', content: '任务 7' },
];

export default function App() {
  const [panelBlocks, setPanelBlocks] = useState<BlockItem[]>(fixedPanelBlocks);

  // Configure drag sensors with activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 20, // 20px threshold
      },
    })
  );

  // Initialize nodes with a placeholder function
  const [nodes, setNodes] = useNodesState(createInitialNodes(() => {}));

  const handleRemoveBlock = useCallback(
    (blockId: string, nodeId: string) => {
      // Remove block from node and add back to panel maintaining original order
      setNodes(currentNodes => {
        const updatedNodes = currentNodes.map(node => {
          if (node.id === nodeId) {
            const nodeData = node.data as DroppableNodeData;
            return {
              ...node,
              data: {
                ...nodeData,
                blocks: nodeData.blocks.filter(block => block.id !== blockId),
                onRemoveBlock: handleRemoveBlock,
              },
            };
          }
          return {
            ...node,
            data: {
              ...node.data,
              onRemoveBlock: handleRemoveBlock,
            },
          };
        });
        return updatedNodes;
      });

      // Add the block back to panel maintaining original order
      const newPanelBlocks = fixedPanelBlocks.filter(
        block =>
          panelBlocks.some(pb => pb.id === block.id) || block.id === blockId
      );

      setPanelBlocks(newPanelBlocks);
    },
    [panelBlocks, setNodes]
  );

  // Update nodes with the handleRemoveBlock function
  useEffect(() => {
    setNodes(currentNodes =>
      currentNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onRemoveBlock: handleRemoveBlock,
        },
      }))
    );
  }, [handleRemoveBlock, setNodes]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Only allow dragging from panel to nodes
    const activeBlock = panelBlocks.find(block => block.id === activeId)!;

    // Move block from panel to node
    setPanelBlocks(panelBlocks.filter(block => block.id !== activeId));
    setNodes(
      nodes.map(node => {
        if (node.id === overId) {
          const nodeData = node.data as DroppableNodeData;
          return {
            ...node,
            data: {
              ...nodeData,
              blocks: [...nodeData.blocks, activeBlock],
              onRemoveBlock: handleRemoveBlock,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div className="h-screen w-screen">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          panOnDrag={false}
          zoomOnScroll={false}
        >
          <Panel position="top-left">
            <FlowPanel blocks={panelBlocks} />
          </Panel>
          <Background />
        </ReactFlow>
      </DndContext>
    </div>
  );
}
