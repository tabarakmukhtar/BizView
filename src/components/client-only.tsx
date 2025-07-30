
'use client';

import { useIsClient } from '@/hooks/use-is-client';
import type { ReactNode } from 'react';

export function ClientOnly({ children }: { children: ReactNode }) {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
}
