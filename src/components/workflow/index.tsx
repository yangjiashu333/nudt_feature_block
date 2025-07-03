import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';

export default function Workflow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div ref={containerRef} className="h-[calc(100vh-5rem)] w-full">
      {size.width > 0 && size.height > 0 && (
        <Stage width={size.width} height={size.height}>
          <Layer>
            <Group x={20} y={20}>
              <Rect
                width={120}
                height={size.height - 40}
                fill="#f0f0f0"
                stroke="#cccccc"
                strokeWidth={1}
                cornerRadius={10}
              />
            </Group>
          </Layer>
        </Stage>
      )}
    </div>
  );
}
