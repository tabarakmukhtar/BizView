
'use client';

import { useState, useEffect } from 'react';

/**
 * A custom hook to determine if the component is running on the client.
 * This is used to prevent hydration errors by ensuring that client-side
 * logic only runs after the component has mounted.
 *
 * @returns {boolean} `true` if the component is mounted on the client, otherwise `false`.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
