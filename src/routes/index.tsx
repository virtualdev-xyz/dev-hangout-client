import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DevWorkspace } from '../pages/DevWorkspace';

// Mock user data - in a real app, this would come from authentication
const mockUser = {
  id: 'user-1',
  name: 'Developer',
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/workspace/:roomId"
          element={<DevWorkspace roomId={window.location.pathname.split('/').pop() || 'default'} userId={mockUser.id} />}
        />
        <Route
          path="/"
          element={<Navigate to="/workspace/default" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};
