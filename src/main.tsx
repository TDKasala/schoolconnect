import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, initializeInstallPrompt } from './utils/serviceWorker'
import initializeAnalytics from './lib/analytics'
import './lib/sentry'

// Initialize error monitoring and analytics
initializeAnalytics();

// Register service worker for PWA
registerServiceWorker();
initializeInstallPrompt();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
