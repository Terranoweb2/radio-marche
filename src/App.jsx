import React from 'react';
import RadioPlayer from './components/RadioPlayer';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm mx-auto">
        {/* Phone-like container to match the design screenshot */}
        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[10px] rounded-[2.5rem] h-[700px] w-[350px] shadow-xl">
          <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[13px] top-[124px] rounded-s-lg"></div>
          <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[13px] top-[178px] rounded-s-lg"></div>
          <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[13px] top-[142px] rounded-e-lg"></div>
          <div className="rounded-[2rem] overflow-hidden w-full h-full bg-player-dark">
            <RadioPlayer />
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm mt-4">
          Conçu par Dualite Alpha
        </p>
      </div>
    </div>
  );
}

export default App;
