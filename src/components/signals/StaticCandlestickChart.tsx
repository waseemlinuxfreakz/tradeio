import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { useResponsive } from '../../lib/useResponsive';

interface StaticCandlestickChartProps {
  data?: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
  height?: number;
  priceLines?: {
    takeProfit?: number;
    stopLoss?: number;
    entry?: number;
  };
}

const generateSampleData = () => {
  const basePrice = 45000;
  const volatility = basePrice * 0.02;
  const data = [];
  let time = new Date(Date.now() - (15 * 60 * 1000 * 20));
  
  for (let i = 0; i < 20; i++) {
    const open = basePrice + (Math.random() - 0.5) * volatility;
    const close = basePrice + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    data.push({
      time: time.getTime() / 1000,
      open,
      high,
      low,
      close
    });
    
    time = new Date(time.getTime() + 15 * 60 * 1000);
  }
  
  return data;
};

const StaticCandlestickChart: React.FC<StaticCandlestickChartProps> = ({
  height = 240, // Adjusted default height to match the red rectangle
  data = generateSampleData(),
  priceLines
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Chart configuration
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94A3B8',
        fontSize: isMobile ? 10 : 11, // Slightly reduced font size
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.1)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
        },
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: {
          top: 0.1, // Reduced margins to fit more content
          bottom: 0.1,
        },
        ticksVisible: true,
        autoScale: true,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#64748B',
          labelBackgroundColor: '#1E293B',
        },
        horzLine: {
          color: '#64748B',
          labelBackgroundColor: '#1E293B',
        },
      },
      handleScroll: false,
      handleScale: false,
    });

    chartRef.current = chart;

    // Candlestick series configuration
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10B981',
      downColor: '#EF4444',
      borderUpColor: '#10B981',
      borderDownColor: '#EF4444',
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });

    candlestickSeries.setData(data);

    // Add price lines with enhanced styling
    if (priceLines) {
      if (priceLines.entry) {
        candlestickSeries.createPriceLine({
          price: priceLines.entry,
          color: '#60A5FA',
          lineWidth: 1,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Entry',
          axisLabelTextColor: '#FFFFFF',
          axisLabelBackgroundColor: 'rgba(96, 165, 250, 0.35)',
        });
      }

      if (priceLines.stopLoss) {
        candlestickSeries.createPriceLine({
          price: priceLines.stopLoss,
          color: '#EF4444',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'SL',
          axisLabelTextColor: '#FFFFFF',
          axisLabelBackgroundColor: 'rgba(239, 68, 68, 0.35)',
        });
      }

      if (priceLines.takeProfit) {
        candlestickSeries.createPriceLine({
          price: priceLines.takeProfit,
          color: '#10B981',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'TP',
          axisLabelTextColor: '#FFFFFF',
          axisLabelBackgroundColor: 'rgba(16, 185, 129, 0.35)',
        });
      }
    }

    // Handle window resize
    const handleResize = () => {
      if (!chartContainerRef.current || !chartRef.current) return;
      
      const { width } = chartContainerRef.current.getBoundingClientRect();
      chartRef.current.applyOptions({
        width,
        height: height,
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [data, height, priceLines, isMobile]);

  return (
    <div className="relative w-full">
      <div 
        ref={chartContainerRef} 
        className="w-full"
        style={{ 
          height: height,
        }} 
      />
    </div>
  );
};

export default StaticCandlestickChart;