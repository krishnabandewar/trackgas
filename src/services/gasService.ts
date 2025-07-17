import { ethers } from 'ethers';
import { useStore } from '../store/useStore';
import { GasPoint } from '../types';

type ChainKey = 'ethereum' | 'polygon' | 'arbitrum';

class GasService {
  private providers: Map<ChainKey, ethers.JsonRpcProvider | ethers.WebSocketProvider> = new Map();
  private wsListeners: Map<ChainKey, () => void> = new Map();
  private intervals: Map<ChainKey, NodeJS.Timeout> = new Map();

  async initializeConnections() {
    const { chains, setConnected } = useStore.getState();
    try {
      (Object.keys(chains) as ChainKey[]).forEach(async (chainKey) => {
        await this.connectToChain(chainKey, chains[chainKey]);
      });
      setConnected(true);
    } catch (error) {
      console.error('Failed to initialize connections:', error);
      setConnected(false);
    }
  }

  private async connectToChain(chainKey: ChainKey, chainData: any) {
    const wsRpcs: Record<ChainKey, string> = {
      ethereum: 'wss://ethereum-rpc.publicnode.com',
      polygon: 'wss://polygon-bor-rpc.publicnode.com',
      arbitrum: 'wss://arbitrum-one-rpc.publicnode.com',
    };
    const fallbackRpcs: Record<ChainKey, string> = {
      ethereum: 'https://ethereum-rpc.publicnode.com',
      polygon: 'https://polygon-bor-rpc.publicnode.com',
      arbitrum: 'https://arbitrum-one-rpc.publicnode.com',
    };
    // Force HTTP polling for Ethereum
    if (chainKey === 'ethereum') {
      console.warn('[GasService] Forcing HTTP polling for Ethereum');
      const httpProvider = new ethers.JsonRpcProvider(fallbackRpcs[chainKey]);
      this.providers.set(chainKey, httpProvider);
      this.startPolling(chainKey);
      return;
    }
    try {
      console.log(`[GasService] Attempting WebSocket connection for ${chainKey}`);
      const wsUrl = wsRpcs[chainKey];
      const wsProvider = new ethers.WebSocketProvider(wsUrl);
      this.providers.set(chainKey, wsProvider);
      // Subscribe to new blocks
      const listener = async (blockNumber: number) => {
        await this.updateGasPrice(chainKey, wsProvider, blockNumber);
      };
      wsProvider.on('block', listener);
      // Store unsubscribe function
      this.wsListeners.set(chainKey, () => wsProvider.off('block', listener));
      console.log(`[GasService] WebSocket connection established for ${chainKey}`);
    } catch (error) {
      console.error(`[GasService] WebSocket connection failed for ${chainKey}, falling back to HTTP polling.`, error);
      // Fallback to HTTP polling
      const httpProvider = new ethers.JsonRpcProvider(fallbackRpcs[chainKey]);
      this.providers.set(chainKey, httpProvider);
      this.startPolling(chainKey);
    }
  }

  private startPolling(chainKey: ChainKey) {
    // Clear any existing interval
    if (this.intervals.has(chainKey)) {
      clearInterval(this.intervals.get(chainKey)!);
    }
    const provider = this.providers.get(chainKey);
    const interval = setInterval(async () => {
      try {
        if (!provider) return;
        await this.updateGasPrice(chainKey, provider);
      } catch (error) {
        console.error(`Polling error for ${chainKey}:`, error);
      }
    }, 10000); // Poll every 10 seconds
    this.intervals.set(chainKey, interval);
  }

  private async updateGasPrice(chainKey: ChainKey, provider: any, blockNumber?: number) {
    const { addGasPoint } = useStore.getState();
    const block = await provider.getBlock(blockNumber || 'latest');
    if (!block) return;
    const baseFee = block.baseFeePerGas ? Number(ethers.formatUnits(block.baseFeePerGas, 'gwei')) : 0;
    // Estimate priority fee based on recent transactions
    const priorityFee = await this.estimatePriorityFee(provider, chainKey);
    const gasPoint: GasPoint = {
      time: block.timestamp,
      open: baseFee,
      high: baseFee + priorityFee,
      low: baseFee,
      close: baseFee + priorityFee,
      baseFee,
      priorityFee,
    };
    addGasPoint(chainKey, gasPoint);
  }

  private async estimatePriorityFee(provider: any, chainKey: ChainKey): Promise<number> {
    try {
      const feeData = await provider.getFeeData();
      const maxPriorityFee = feeData.maxPriorityFeePerGas;
      if (maxPriorityFee) {
        return Number(ethers.formatUnits(maxPriorityFee, 'gwei'));
      }
      // Fallback estimates based on chain
      const fallbackFees: Record<ChainKey, number> = {
        ethereum: 2,
        polygon: 30,
        arbitrum: 0.01,
      };
      return fallbackFees[chainKey] || 2;
    } catch (error) {
      console.error('Error estimating priority fee:', error);
      return 2;
    }
  }

  disconnect() {
    for (const [chainKey, provider] of this.providers.entries()) {
      // Remove WebSocket listeners if present
      if (this.wsListeners.has(chainKey)) {
        this.wsListeners.get(chainKey)!();
      }
      // ethers.WebSocketProvider will close automatically on dereference
    }
    this.providers.clear();
    this.wsListeners.clear();
    for (const interval of this.intervals.values()) {
      clearInterval(interval);
    }
    this.intervals.clear();
  }
}

export const gasService = new GasService();