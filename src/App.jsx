import React from 'react';
import RadioPlayer from './components/RadioPlayer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Lecteur Radio
          </h1>
          <p className="text-gray-600">
            Écoutez le flux audio en direct
          </p>
        </div>
        
        <RadioPlayer />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Diffusion continue • Qualité audio optimisée
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
