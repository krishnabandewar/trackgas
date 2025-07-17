import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, Time, ColorType } from 'lightweight-charts';
import { useStore } from '../store/useStore';
import { GasPoint } from '../types';

const CHAIN_OPTIONS = [
  { key: 'ethereum', label: 'Ethereum' },
  { key: 'polygon', label: 'Polygon' },
  { key: 'arbitrum', label: 'Arbitrum' },
] as const;

type ChainKey = typeof CHAIN_OPTIONS[number]['key'];

export const GasChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [selectedChain, setSelectedChain] = useState<ChainKey>('ethereum');
  const { getCandlestickHistory, chains } = useStore();

  // Helper to get color for chain
  const getChainColor = (chain: ChainKey) => chains[chain].color;

  // Chart initialization
  useEffect(() => {
    if (!chartContainerRef.current) return;
    if (chartRef.current) return; // Only create once

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#1f2937' },
        textColor: '#e5e7eb',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#6b7280' },
      timeScale: {
        borderColor: '#6b7280',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderDownColor: '#EF4444',
      borderUpColor: '#10B981',
      wickDownColor: '#EF4444',
      wickUpColor: '#10B981',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Update chart data when selectedChain or history changes
  useEffect(() => {
    if (!seriesRef.current) return;
    const data = getCandlestickHistory(selectedChain).map((point: GasPoint) => ({
      time: point.time as Time,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
    }));
    // Sort and dedupe
    const sorted = data.sort((a, b) => (a.time as number) - (b.time as number));
    const deduped = sorted.filter((point, idx, arr) => idx === 0 || point.time !== arr[idx - 1].time);
    seriesRef.current.setData(deduped);
  }, [getCandlestickHistory, selectedChain]);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Gas Price Volatility</h2>
        <div className="flex items-center space-x-4">
          {CHAIN_OPTIONS.map((chain) => (
            <button
              key={chain.key}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${selectedChain === chain.key ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              onClick={() => setSelectedChain(chain.key)}
              style={{ border: `2px solid ${getChainColor(chain.key)}` }}
            >
              {chain.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};