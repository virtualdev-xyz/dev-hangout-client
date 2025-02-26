import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your page components here
// import { HomePage } from '../pages/HomePage';
// import { GamePage } from '../pages/GamePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<div>Home Page</div>} />
      {/* Add more routes as needed */}
    </Routes>
  );
};
