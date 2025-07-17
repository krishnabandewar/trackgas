import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { gasService } from './services/gasService';
import { uniswapService } from './services/uniswapService';
import { StatusBar } from './components/StatusBar';
import { GasCard } from './components/GasCard';
import { GasChart } from './components/GasChart';
import { SimulationPanel } from './components/SimulationPanel';
import { BarChart3, TrendingUp, Zap } from 'lucide-react';
import { SimulationDashboard } from './components/SimulationDashboard';

function App() {
  const { chains, usdPrice, mode } = useStore();

  useEffect(() => {
    // Initialize services
    gasService.initializeConnections();
    uniswapService.initialize();

    // Cleanup on unmount
    return () => {
      gasService.disconnect();
      uniswapService.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <StatusBar />
      
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gas Tracker Pro</h1>
                <p className="text-sm text-gray-400">Real-time cross-chain gas price monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-300">Multi-chain</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-300">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Gas Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(chains).map(([key, chain]) => (
            <GasCard key={key} chain={chain} usdPrice={usdPrice} />
          ))}
        </div>

        {/* Chart and Simulation */}
        {mode === 'simulation' ? (
          <SimulationDashboard />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2">
              <GasChart />
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Network Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(chains).map(([key, chain]) => {
              const totalGas = chain.baseFee + chain.priorityFee;
              const txCost = totalGas * 21000 * usdPrice / 1e9;
              
              return (
                <div key={key} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3" style={{ backgroundColor: chain.color + '20' }}>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: chain.color }} />
                  </div>
                  <h3 className="font-semibold text-white">{chain.name}</h3>
                  <p className="text-2xl font-bold text-white">{totalGas.toFixed(1)} gwei</p>
                  <p className="text-sm text-gray-400">${txCost.toFixed(2)} per TX</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              © 2025 Gas Tracker Pro - Real-time Web3 monitoring
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by</span>
              <span className="text-sm font-medium text-gray-300">Ethers.js • Uniswap V3 • Zustand</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;