import { AppRouter } from './routes';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './state/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  );
};
