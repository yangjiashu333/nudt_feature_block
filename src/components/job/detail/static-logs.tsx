import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { JobWithValidation } from '@/models/job';

type Props = {
  job: JobWithValidation;
};

export default function StaticLogs({ job }: Props) {
  const [logs] = useState<string[]>([
    '[13:27:10] Starting training process...',
    '[13:27:15] Loading dataset...',
    '[13:27:20] Dataset loaded: 1000 samples',
    '[13:27:25] Initializing model...',
    '[13:27:30] Model initialized successfully',
    '[13:27:35] Starting epoch 1/10',
    '[13:28:00] Epoch 1 completed - Loss: 0.856, Accuracy: 65.2%',
    '[13:28:05] Starting epoch 2/10',
    '[13:28:30] Epoch 2 completed - Loss: 0.743, Accuracy: 71.8%',
    '[13:28:35] Training completed successfully',
    '[13:27:10] Starting training process...',
    '[13:27:15] Loading dataset...',
    '[13:27:20] Dataset loaded: 1000 samples',
    '[13:27:25] Initializing model...',
    '[13:27:30] Model initialized successfully',
    '[13:27:35] Starting epoch 1/10',
    '[13:28:00] Epoch 1 completed - Loss: 0.856, Accuracy: 65.2%',
    '[13:28:05] Starting epoch 2/10',
    '[13:28:30] Epoch 2 completed - Loss: 0.743, Accuracy: 71.8%',
    '[13:28:35] Training completed successfully',
    '[13:27:10] Starting training process...',
    '[13:27:15] Loading dataset...',
    '[13:27:20] Dataset loaded: 1000 samples',
    '[13:27:25] Initializing model...',
    '[13:27:30] Model initialized successfully',
    '[13:27:35] Starting epoch 1/10',
    '[13:28:00] Epoch 1 completed - Loss: 0.856, Accuracy: 65.2%',
    '[13:28:05] Starting epoch 2/10',
    '[13:28:30] Epoch 2 completed - Loss: 0.743, Accuracy: 71.8%',
    '[13:28:35] Training completed successfully',
  ]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>训练日志</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full border rounded-md p-4">
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">暂无日志</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono break-all">
                  {log}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
