'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional dev tools

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  // Use useState to ensure QueryClient is only created once per component instance
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Configure default options for queries if needed
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
      {/* Optional: Add React Query Devtools for debugging */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </TanstackQueryClientProvider>
  );
}
