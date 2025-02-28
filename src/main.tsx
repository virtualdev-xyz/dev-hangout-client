import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Component to load SVG filters and apply theme
const AppWithTheme = () => {
  useEffect(() => {
    // Add arcade theme class to body
    document.body.classList.add('arcade-theme');
    
    // Load SVG filters
    const filtersSvg = document.createElement('object');
    filtersSvg.setAttribute('type', 'image/svg+xml');
    filtersSvg.setAttribute('data', '/pixel-filters.svg');
    filtersSvg.classList.add('pixel-filters');
    document.body.appendChild(filtersSvg);
    
    return () => {
      document.body.classList.remove('arcade-theme');
      document.body.removeChild(filtersSvg);
    };
  }, []);
  
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithTheme />
  </StrictMode>
);
