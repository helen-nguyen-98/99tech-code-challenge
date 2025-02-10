import SwapForm from './components/SwapForm/SwapForm';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="App">
      <h1>Token Swap</h1>
      <SwapForm />
      <Toaster position="top-right" />
    </div>
  );
}

export default App; 