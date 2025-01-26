import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store, {persistor} from './store/store.js'
import { PersistGate } from "redux-persist/integration/react";

// Register service worker for Firebase Cloud Messaging
try {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed: ', error);
      });
  }
} catch (error) {
  console.error('Error registering service worker:', error);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
    </Provider>

  </StrictMode>,
)
