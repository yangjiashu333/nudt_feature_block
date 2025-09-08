import type { TrainJob, ValJob } from '@/types/job';

type Props = {
  trainJob: TrainJob;
  valJob: ValJob;
};

export default function TrainValResult({ trainJob, valJob }: Props) {
  const combined = {
    training: trainJob?.result ?? {},
    testing: valJob?.result ?? {},
  };

  return (
    <pre className="whitespace-pre-wrap break-all text-sm">
      {JSON.stringify(combined, null, 2)}
    </pre>
  );
}
