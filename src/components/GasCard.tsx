import React from 'react';
import { ChainData } from '../types';

interface GasCardProps {
  chain: ChainData;
  usdPrice: number;
}

export const GasCard: React.FC<GasCardProps> = ({ chain, usdPrice }) => {
  const totalGas = chain.baseFee + chain.priorityFee;
  const standardTxCost = totalGas * 21000 * usdPrice / 1e9; // Convert from gwei to ETH to USD

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: chain.color }}
          />
          <div>
            <h3 className="text-lg font-semibold text-white">{chain.name}</h3>
            <p className="text-sm text-gray-400">Last updated: {formatTime(chain.lastUpdate)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{totalGas.toFixed(2)}</p>
          <p className="text-sm text-gray-400">gwei</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700/50">
          <p className="text-sm font-medium text-blue-400">Base Fee</p>
          <p className="text-lg font-semibold text-blue-300">{chain.baseFee.toFixed(2)}</p>
        </div>
        <div className="bg-green-900/30 p-3 rounded-lg border border-green-700/50">
          <p className="text-sm font-medium text-green-400">Priority Fee</p>
          <p className="text-lg font-semibold text-green-300">{chain.priorityFee.toFixed(2)}</p>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-300">Standard TX Cost:</span>
          <span className="text-lg font-semibold text-white">${standardTxCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min((totalGas / 100) * 100, 100)}%`,
            backgroundColor: chain.color 
          }}
        />
      </div>
    </div>
  );
};