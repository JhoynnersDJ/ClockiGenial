import React from 'react';
import Navigation from './src/Navigation';
import AuthProvider from './src/controladores/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}