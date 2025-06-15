import { BrowserRouter } from 'react-router';
import { AppRoutes } from './routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;