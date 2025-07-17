export interface GasPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  baseFee: number;
  priorityFee: number;
}

export interface ChainData {
  name: string;
  symbol: string;
  rpcUrl: string;
  baseFee: number;
  priorityFee: number;
  history: GasPoint[];
  lastUpdate: number;
  color: string;
}

export interface AppState {
  mode: 'live' | 'simulation';
  chains: {
    ethereum: ChainData;
    polygon: ChainData;
    arbitrum: ChainData;
  };
  usdPrice: number;
  simulationValue: number;
  isConnected: boolean;
  setMode: (mode: 'live' | 'simulation') => void;
  setSimulationValue: (value: number) => void;
  updateChainData: (chain: keyof AppState['chains'], data: Partial<ChainData>) => void;
  updateUsdPrice: (price: number) => void;
  setConnected: (connected: boolean) => void;
  addGasPoint: (chain: keyof AppState['chains'], point: GasPoint) => void;
}

export interface SimulationResult {
  chain: string;
  gasLimit: number;
  gasCostETH: number;
  gasCostUSD: number;
  totalCostUSD: number;
}