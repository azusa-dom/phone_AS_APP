import React from 'react';
import ASRedesign from './components/ASRedesign';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <ASRedesign />
      </div>
    </ErrorBoundary>
  );
}

export default App;
