import { useState } from 'react';

export function useStatus() {
  const [status, setStatus] = useState<string>('idle');
  const loading = status === 'loading';
  return { status, loading, setStatus };
}
