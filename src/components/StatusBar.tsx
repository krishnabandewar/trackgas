import React from 'react';
import { useStore } from '../store/useStore';
import { Wifi, WifiOff, Activity } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const isConnected = useStore(state => state.isConnected);
  const usdPrice = useStore(state => state.usdPrice);
  const mode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-300">
              ETH/USD: ${usdPrice.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setMode('live')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'live'
                  ? 'bg-gray-600 text-blue-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Live Mode
            </button>
            <button
              onClick={() => setMode('simulation')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === 'simulation'
                  ? 'bg-gray-600 text-blue-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Simulation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};