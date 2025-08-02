import App from 'App';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MetamaskStateProvider } from "use-metamask";
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <MetamaskStateProvider>
      <App />
    </MetamaskStateProvider>
  </BrowserRouter>
);
