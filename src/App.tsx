import { AppRoutes } from './routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster richColors />
      <AppRoutes />
    </>
  );
}

export default App;