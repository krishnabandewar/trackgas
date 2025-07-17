import { ethers } from 'ethers';
import { useStore } from '../store/useStore';

class UniswapService {
  private provider: ethers.JsonRpcProvider | null = null;
  private readonly poolAddress = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640'; // ETH/USDC pool
  private readonly poolAbi = [
    'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)'
  ];

  async initialize() {
    try {
      // Use HTTP provider for better stability
      this.provider = new ethers.JsonRpcProvider('https://ethereum-rpc.publicnode.com');
      // Initial price fetch
      await this.fetchCurrentPrice();
      // Start periodic price updates
      this.startPricePolling();
    } catch (error) {
      console.error('Failed to initialize Uniswap HTTP service, falling back to periodic price updates:', error);
      this.startPricePolling();
    }
  }

  private async fetchCurrentPrice() {
    try {
      if (!this.provider) return;
      const pool = new ethers.Contract(this.poolAddress, this.poolAbi, this.provider);
      const slot0 = await pool.slot0();
      const sqrtPriceX96 = slot0[0];
      // Calculate price using: price = (sqrtPriceX96 ** 2 * 1e12) / 2 ** 192
      // sqrtPriceX96 is a BigNumber, so use .mul and .div
      const sqrtPrice = BigInt(sqrtPriceX96.toString());
      const priceX192 = sqrtPrice * sqrtPrice * 1000000000000n;
      const denominator = 0x1000000000000000000000000000000000000000000000000n;
      const price = Number(priceX192 / denominator);
      // Update Zustand store
      const { updateUsdPrice } = useStore.getState();
      updateUsdPrice(price);
    } catch (error) {
      console.error('Error fetching Uniswap V3 price:', error);
    }
  }

  private startPricePolling() {
    setInterval(async () => {
      await this.fetchCurrentPrice();
    }, 10000); // Update every 10 seconds
  }

  disconnect() {
    if (this.provider) {
      this.provider = null;
    }
  }
}

export const uniswapService = new UniswapService();