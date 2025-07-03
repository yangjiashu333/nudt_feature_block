'use client';
import dynamic from 'next/dynamic';

const Workflow = dynamic(() => import('../../components/workflow'), {
  ssr: false,
});

export default function Page() {
  return <Workflow />;
}
