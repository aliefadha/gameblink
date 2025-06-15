import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from './providers/AuthProviders.tsx';
import { BrowserRouter } from 'react-router';

// This mocking logic remains unchanged
async function enableMocking() {
  if (import.meta.env.VITE_API_MOCKING !== 'true') {
    return;
  }
  const { worker } = await import('./mocks/browser.ts');
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

const queryClient = new QueryClient();

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {/* 1. Global Providers */}
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {/* 2. Render the Main App Component */}
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
});