import { Badge } from '@/components/ui/badge';
import type { JobStatus } from '@/types/common';

type Props = {
  status: JobStatus;
  size?: 'sm' | 'default' | 'lg';
};

export default function JobStatusBadge({ status, size = 'default' }: Props) {
  const getVariant = (status: JobStatus) => {
    switch (status) {
      case 'running':
        return 'secondary' as const;
      case 'pending':
        return 'outline' as const;
      case 'failed':
        return 'destructive' as const;
      case 'done':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  const getStatusText = (status: JobStatus) => {
    switch (status) {
      case 'running':
        return '运行中';
      case 'pending':
        return '等待中';
      case 'failed':
        return '失败';
      case 'done':
        return '完成';
      default:
        return status;
    }
  };

  return (
    <Badge 
      variant={getVariant(status)}
      className={size === 'sm' ? 'text-xs px-2 py-0.5' : ''}
    >
      {getStatusText(status)}
    </Badge>
  );
}