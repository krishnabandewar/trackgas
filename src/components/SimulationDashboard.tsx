import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { GasChart } from './GasChart';

const GAS_LIMITS = {
  ethereum: 21000,
  polygon: 21000,
  arbitrum: 25000, // estimate
};

const CHAIN_LABELS = {
  ethereum: 'Ethereum',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
};

export const SimulationDashboard: React.FC = () => {
  const { chains, usdPrice, simulationValue, setSimulationValue } = useStore();
  const [txValue, setTxValue] = useState(simulationValue || 0.1);

  // Calculate per-chain gas cost in USD
  const rows = useMemo(() => {
    return Object.entries(chains).map(([key, chain]) => {
      const gasLimit = GAS_LIMITS[key as keyof typeof GAS_LIMITS] || 21000;
      const baseFee = chain.baseFee;
      const priorityFee = chain.priorityFee;
      const gasCostUSD = (baseFee + priorityFee) * gasLimit * usdPrice / 1e9;
      return {
        key,
        name: CHAIN_LABELS[key as keyof typeof CHAIN_LABELS] || key,
        baseFee,
        priorityFee,
        gasLimit,
        gasCostUSD,
      };
    });
  }, [chains, usdPrice]);

  // Bar chart data
  const maxCost = Math.max(...rows.map(r => r.gasCostUSD));

  return (
    <div className="space-y-8">
      {/* Transaction Value Input */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 flex flex-col md:flex-row items-center gap-4">
        <label className="text-white font-semibold text-lg mr-4">Transaction Value:</label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={txValue}
          onChange={e => {
            const val = parseFloat(e.target.value);
            setTxValue(val);
            setSimulationValue(val);
          }}
          className="bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white w-32 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <span className="text-gray-400 ml-2">ETH / MATIC</span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-xl shadow-lg border border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">Chain</th>
              <th className="px-4 py-2 text-left text-gray-300">Base Fee (Gwei)</th>
              <th className="px-4 py-2 text-left text-gray-300">Priority Fee (Gwei)</th>
              <th className="px-4 py-2 text-left text-gray-300">Gas Limit</th>
              <th className="px-4 py-2 text-left text-gray-300">Gas Cost (USD)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.key} className="border-t border-gray-700">
                <td className="px-4 py-2 text-white font-semibold">{row.name}</td>
                <td className="px-4 py-2 text-gray-200">{row.baseFee.toFixed(2)}</td>
                <td className="px-4 py-2 text-gray-200">{row.priorityFee.toFixed(2)}</td>
                <td className="px-4 py-2 text-gray-200">{row.gasLimit}</td>
                <td className="px-4 py-2 text-green-400 font-bold">${row.gasCostUSD.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart View */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
        <h3 className="text-white text-lg font-semibold mb-4">Gas Cost Comparison (USD)</h3>
        <div className="flex justify-center items-end gap-16 h-64">
          {rows.map(row => (
            <div key={row.key} className="flex flex-col items-center w-32">
              <div
                className="w-10 rounded-t-lg mb-4"
                style={{
                  height: `${(row.gasCostUSD / (maxCost || 1)) * 140}px`,
                  background: chains[row.key as keyof typeof chains].color,
                  minHeight: '16px',
                  transition: 'height 0.3s',
                }}
                title={`$${row.gasCostUSD.toFixed(4)}`}
              />
              <span className="text-gray-300 font-medium mt-4">{row.name}</span>
              <span className="text-green-400 font-bold text-sm mt-4 break-all text-center max-w-full" style={{wordBreak: 'break-all'}}>${row.gasCostUSD.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Static Candlestick Chart (no live updates) */}
      <div>
        <GasChart />
      </div>
    </div>
  );
}; 