import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { SimulationResult } from '../types';

export const SimulationPanel: React.FC = () => {
  const isSimulationMode = useStore(state => state.isSimulationMode());
  const { chains, usdPrice, simulationValue, setSimulationValue } = useStore();
  const [results, setResults] = useState<SimulationResult[]>([]);

  React.useEffect(() => {
    if (!isSimulationMode) return;
    if (usdPrice > 0) {
      calculateSimulation();
    }
    // eslint-disable-next-line
  }, [chains, usdPrice, simulationValue, isSimulationMode]);

  const calculateSimulation = () => {
    const gasLimit = 21000; // Standard ETH transfer
    const newResults: SimulationResult[] = [];
    Object.entries(chains).forEach(([chainKey, chainData]) => {
      const totalGasFee = chainData.baseFee + chainData.priorityFee;
      const gasCostETH = (totalGasFee * gasLimit) / 1e9; // Convert from gwei to ETH
      const gasCostUSD = gasCostETH * usdPrice;
      const totalCostUSD = (simulationValue * usdPrice) + gasCostUSD;
      newResults.push({
        chain: chainData.name,
        gasLimit,
        gasCostETH,
        gasCostUSD,
        totalCostUSD,
      });
    });
    setResults(newResults);
  };

  if (!isSimulationMode) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 text-center text-gray-400">
        Switch to <span className="text-blue-400 font-semibold">Simulation Mode</span> to use the transaction simulator.
      </div>
    );
  }

  if (usdPrice === 0) {
    return (
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 text-center text-gray-400">
        Loading live ETH/USD price...
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold text-white mb-4">Transaction Simulation</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Transaction Value (ETH)
        </label>
        <input
          type="number"
          value={simulationValue}
          onChange={(e) => setSimulationValue(Number(e.target.value))}
          step="0.01"
          min="0"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter ETH amount"
        />
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-white">{result.chain}</h3>
              <span className="text-lg font-bold text-gray-900">
                <span className="text-white">${result.totalCostUSD.toFixed(2)}</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Gas Cost (ETH):</span>
                <span className="ml-2 font-medium text-gray-200">{result.gasCostETH.toFixed(6)}</span>
              </div>
              <div>
                <span className="text-gray-400">Gas Cost (USD):</span>
                <span className="ml-2 font-medium text-gray-200">${result.gasCostUSD.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Gas Limit:</span>
                <span className="ml-2 font-medium text-gray-200">{result.gasLimit.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Value (USD):</span>
                <span className="ml-2 font-medium text-gray-200">${(simulationValue * usdPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700/50">
        <p className="text-sm text-blue-300">
          <strong>Note:</strong> Calculations based on current gas prices and ETH/USD rate of ${usdPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};