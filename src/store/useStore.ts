import { create } from 'zustand';
import { AppState, ChainData, GasPoint } from '../types';

const initialChainData: Omit<ChainData, 'name' | 'symbol' | 'rpcUrl' | 'color'> = {
  baseFee: 0,
  priorityFee: 0,
  history: [],
  lastUpdate: 0,
};

// Utility to aggregate history into 15-min candlesticks
function aggregateCandles(points: GasPoint[], intervalSec = 15 * 60): GasPoint[] {
  if (!points.length) return [];
  const sorted = [...points].sort((a, b) => a.time - b.time);
  const buckets: Record<number, GasPoint[]> = {};
  for (const pt of sorted) {
    const bucket = Math.floor(pt.time / intervalSec) * intervalSec;
    if (!buckets[bucket]) buckets[bucket] = [];
    buckets[bucket].push(pt);
  }
  return Object.entries(buckets).map(([start, arr]) => ({
    time: Number(start),
    open: arr[0].open,
    high: Math.max(...arr.map(p => p.high)),
    low: Math.min(...arr.map(p => p.low)),
    close: arr[arr.length - 1].close,
    baseFee: arr[arr.length - 1].baseFee,
    priorityFee: arr[arr.length - 1].priorityFee,
  }));
}

type AppStateMachine = AppState & {
  state: 'live' | 'simulation';
  setState: (state: 'live' | 'simulation') => void;
  isLiveMode: () => boolean;
  isSimulationMode: () => boolean;
  getCandlestickHistory: (chain: keyof AppState['chains']) => GasPoint[];
};

export const useStore = create<AppStateMachine>((set, get) => ({
  // State machine state
  state: 'live',
  setState: (state) => set({ state }),
  isLiveMode: () => get().state === 'live',
  isSimulationMode: () => get().state === 'simulation',

  // AppState
  mode: 'live',
  chains: {
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      rpcUrl: 'wss://ethereum-rpc.publicnode.com',
      color: '#627EEA',
      ...initialChainData,
    },
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      rpcUrl: 'wss://polygon-bor-rpc.publicnode.com',
      color: '#8247E5',
      ...initialChainData,
    },
    arbitrum: {
      name: 'Arbitrum',
      symbol: 'ETH',
      rpcUrl: 'wss://arbitrum-one-rpc.publicnode.com',
      color: '#28A0F0',
      ...initialChainData,
    },
  },
  usdPrice: 0,
  simulationValue: 0.1,
  isConnected: false,

  setMode: (mode) => set({ mode }),
  setSimulationValue: (value) => set({ simulationValue: value }),
  updateChainData: (chain, data) =>
    set((state) => ({
      chains: {
        ...state.chains,
        [chain]: { ...state.chains[chain], ...data },
      },
    })),
  updateUsdPrice: (price) => set({ usdPrice: price }),
  setConnected: (connected) => set({ isConnected: connected }),
  addGasPoint: (chain, point) =>
    set((state) => {
      // Debug: Log when addGasPoint is called
      console.log('addGasPoint called:', { chain, point });
      const history = [...state.chains[chain].history, point];
      if (history.length > 0 && history[history.length - 1].time === point.time) {
        history[history.length - 1] = {
          ...history[history.length - 1],
          high: Math.max(history[history.length - 1].high, point.high),
          low: Math.min(history[history.length - 1].low, point.low),
          close: point.close,
          baseFee: point.baseFee,
          priorityFee: point.priorityFee,
        };
      } else {
        history.push(point);
      }
      const trimmedHistory = history.slice(-100);
      return {
        chains: {
          ...state.chains,
          [chain]: {
            ...state.chains[chain],
            history: trimmedHistory,
            baseFee: point.baseFee,
            priorityFee: point.priorityFee,
            lastUpdate: Date.now(),
          },
        },
      };
    }),
  getCandlestickHistory: (chain) => {
    const points = get().chains[chain].history;
    // Debug: Log the raw history array before aggregation
    console.log('Raw history for', chain, ':', points);
    return aggregateCandles(points);
  },
}));