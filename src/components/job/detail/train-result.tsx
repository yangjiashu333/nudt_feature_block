import type { JobWithValidation } from '@/models/job';

type Props = {
  job: JobWithValidation;
};

export default function TrainResult({ job }: Props) {
  const data = job?.result ?? {};
  return (
    <pre className="whitespace-pre-wrap break-all text-sm">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
