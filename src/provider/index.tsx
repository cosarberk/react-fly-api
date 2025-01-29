import React, { useMemo, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ReactFlyApiProviderProps {
  client?: QueryClient;
  children: ReactNode; // React elemanlarını veya herhangi bir render edilebilir içeriği kabul eder
}

export const ReactFlyApiProvider: React.FC<ReactFlyApiProviderProps> = ({ children, client }) => {
  const queryClient = useMemo(() => client ?? new QueryClient(), [client]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};