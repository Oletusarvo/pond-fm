import { useState } from 'react';

export function useStatus(initialStatus?: string) {
  const [status, setStatus] = useState<string>(initialStatus);
  const loading = status === 'loading';
  return { status, loading, setStatus };
}
