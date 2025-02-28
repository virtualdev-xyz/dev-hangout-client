import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './state/store';
import { AppRoutes } from './routes';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingScreen } from './components/ui/LoadingScreen';
import RetroDemo from './components/RetroDemo';

export default function App() {
  // For demonstration purposes, we're showing the RetroDemo component
  // In a real app, you would use the AppRoutes component
  const showDemo = true;

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <BrowserRouter>
          {showDemo ? <RetroDemo /> : <AppRoutes />}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
