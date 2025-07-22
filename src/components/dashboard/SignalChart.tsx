import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

interface SignalChartProps {
  data?: Array<{
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }>;
}

const SignalChart: React.FC<SignalChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // Sample data for Bitcoin candlestick chart
  const sampleData = [
    { time: '2024-01-01', open: 42000, high: 42500, low: 41800, close: 42300 },
    { time: '2024-01-02', open: 42300, high: 43000, low: 42100, close: 42800 },
    { time: '2024-01-03', open: 42800, high: 43200, low: 42600, close: 43100 },
    { time: '2024-01-04', open: 43100, high: 43500, low: 42900, close: 43300 },
    { time: '2024-01-05', open: 43300, high: 44000, low: 43200, close: 43800 },
    { time: '2024-01-06', open: 43800, high: 44200, low: 43600, close: 44000 }
  ];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.1)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(148, 163, 184, 0.2)',
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#94a3b8',
          labelBackgroundColor: '#1e293b',
        },
        horzLine: {
          color: '#94a3b8',
          labelBackgroundColor: '#1e293b',
        },
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeries.setData(sampleData);

    // Add price lines for take profit and stop loss
    candlestickSeries.createPriceLine({
      price: 44200,
      color: '#10b981',
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Take Profit',
    });

    candlestickSeries.createPriceLine({
      price: 42000,
      color: '#ef4444',
      lineWidth: 2,
      lineStyle: 2,
      axisLabelVisible: true,
      title: 'Stop Loss',
    });

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    chartRef.current = chart;

    // Simulate live data updates
    const interval = setInterval(() => {
      const lastCandle = sampleData[sampleData.length - 1];
      const change = (Math.random() - 0.5) * 200;
      const newClose = lastCandle.close + change;
      const newHigh = Math.max(lastCandle.high, newClose);
      const newLow = Math.min(lastCandle.low, newClose);
      
      candlestickSeries.update({
        time: lastCandle.time,
        open: lastCandle.open,
        high: newHigh,
        low: newLow,
        close: newClose,
      });
    }, 2000);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-4">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default SignalChart;