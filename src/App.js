import React, { useState } from 'react';
import ASRedesign from './components/ASRedesign';
import TestStorage from './components/TestStorage';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';

function App() {
  const [showTest, setShowTest] = useState(true);

  return (
    <ErrorBoundary>
      <div className="App">
        {showTest ? (
          <div>
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={() => setShowTest(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                返回主应用
              </button>
            </div>
            <TestStorage />
          </div>
        ) : (
          <div>
            <div className="fixed top-4 right-4 z-50">
              <button
                onClick={() => setShowTest(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                测试功能
              </button>
            </div>
            <ASRedesign />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
