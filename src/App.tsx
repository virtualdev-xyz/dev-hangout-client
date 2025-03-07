import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './state/store';
import { AppRoutes } from './routes';
import { PersistGate } from 'redux-persist/integration/react';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { UIDemo } from './components/ui/demo/UIDemo';

export default function App() {
  // For demonstration purposes, we're showing the UIDemo component
  // In a real app, you would use the AppRoutes component
  const showDemo = true;

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <BrowserRouter>
          {showDemo ? <UIDemo /> : <AppRoutes />}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
