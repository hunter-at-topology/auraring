'use client';

import AuraRing from './components/AuraRing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center p-8">
        <AuraRing />
      </div>
    </QueryClientProvider>
  );
}
