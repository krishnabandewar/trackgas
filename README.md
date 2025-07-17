# Gas Tracker Pro - Real-Time Cross-Chain Gas Price Tracker

## 🚀 Live Demo
[Gas Tracker Pro](https://project-omega-ebon-35.vercel.app/)

A comprehensive Web3 dashboard for monitoring real-time gas prices across Ethereum, Polygon, and Arbitrum networks with advanced simulation capabilities.

## Features

### Real-Time Gas Monitoring
- **Multi-Chain Support**: Live gas price tracking for Ethereum, Polygon, and Arbitrum
- **WebSocket Connections**: Real-time updates via RPC endpoints
- **Historical Data**: 15-minute candlestick charts showing gas price volatility
- **Advanced Metrics**: Base fees, priority fees, and total transaction costs

### Price Integration
- **Uniswap V3 Integration**: Direct ETH/USD price feeds from Uniswap V3 ETH/USDC pool
- **Live Price Updates**: Real-time price parsing from swap events
- **USD Cost Calculations**: Automatic conversion of gas costs to USD

### Simulation Engine
- **Transaction Simulation**: Calculate costs for custom transaction values
- **Cross-Chain Comparison**: Compare transaction costs across all supported chains
- **Real-Time Updates**: Simulations update automatically with live gas prices

### Technical Implementation
- **State Management**: Zustand for efficient state management with live/simulation modes
- **Chart Visualization**: Lightweight Charts for interactive candlestick displays
- **Responsive Design**: Modern, production-ready UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Web3**: Ethers.js v6 for blockchain interactions
- **State Management**: Zustand for global state
- **Charts**: Lightweight Charts for data visualization
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for modern iconography

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Live Mode
- Monitor real-time gas prices across all supported chains
- View historical price volatility in interactive charts
- Track ETH/USD exchange rates from Uniswap V3

### Simulation Mode
- Enter transaction values to calculate cross-chain costs
- Compare gas fees and total transaction costs
- Make informed decisions about which chain to use

## Architecture

### Services
- **GasService**: Manages WebSocket connections and gas price updates
- **UniswapService**: Handles ETH/USD price tracking from Uniswap V3

### State Management
- **Zustand Store**: Centralized state for gas data, prices, and simulation results
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures

### Components
- **GasCard**: Individual chain gas price display
- **GasChart**: Interactive candlestick chart
- **SimulationPanel**: Transaction cost calculator
- **StatusBar**: Connection status and mode switching

## Data Sources

- **Ethereum**: Mainnet RPC endpoints
- **Polygon**: Polygon mainnet RPC endpoints  
- **Arbitrum**: Arbitrum One RPC endpoints
- **Price Data**: Uniswap V3 ETH/USDC pool (0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640)

## Development

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Demo

Live deployment: [https://project-hlezrbczb-krishnabandewars-projects.vercel.app](https://project-hlezrbczb-krishnabandewars-projects.vercel.app)

This application demonstrates:
- Real-time WebSocket connections to multiple blockchain networks
- Advanced state management with mode switching
- Interactive data visualization with professional charting
- Complex Web3 calculations and simulations
- Production-ready UI/UX design

Perfect for traders, developers, and anyone who needs to monitor gas prices across multiple chains in real-time.
