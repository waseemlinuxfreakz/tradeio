import React, { useEffect, useRef } from 'react';
import { widget } from '../lib/charting_library/charting_library.min';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  containerId: string;
  libraryPath?: string;
  chartsStorageUrl?: string;
  chartsStorageApiVersion?: string;
  clientId?: string;
  userId?: string;
  fullscreen?: boolean;
  autosize?: boolean;
  studiesOverrides?: object;
  priceLines?: {
    takeProfit?: number;
    stopLoss?: number;
    entry?: number;
  };
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol = 'BTCUSDT',
  interval = '15',
  containerId = 'tv_chart_container',
  libraryPath = '/charting_library/',
  chartsStorageUrl = 'https://saveload.tradingview.com',
  chartsStorageApiVersion = '1.1',
  clientId = 'tradingview.com',
  userId = 'public_user_id',
  fullscreen = false,
  autosize = true,
  studiesOverrides = {},
  priceLines
}) => {
  const tvWidgetRef = useRef<any>(null);
  const chartReadyRef = useRef<boolean>(false);

  useEffect(() => {
    const widgetOptions = {
      symbol,
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
      interval,
      container: containerId,
      library_path: libraryPath,
      locale: 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'header_symbol_search',
        'header_saveload',
        'header_screenshot',
        'header_chart_type',
        'header_compare',
        'header_undo_redo',
        'timeframes_toolbar',
        'volume_force_overlay'
      ],
      enabled_features: [
        'study_templates',
        'hide_left_toolbar_by_default'
      ],
      charts_storage_url: chartsStorageUrl,
      charts_storage_api_version: chartsStorageApiVersion,
      client_id: clientId,
      user_id: userId,
      fullscreen,
      autosize,
      studies_overrides: studiesOverrides,
      theme: 'Dark',
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#26a69a',
        'mainSeriesProperties.candleStyle.downColor': '#ef5350',
        'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
        'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
        'paneProperties.background': '#131722',
        'paneProperties.vertGridProperties.color': '#363c4e',
        'paneProperties.horzGridProperties.color': '#363c4e',
        'scalesProperties.textColor': '#AAA'
      },
      loading_screen: { backgroundColor: '#131722' }
    };

    const tvWidget = new widget(widgetOptions);
    tvWidgetRef.current = tvWidget;

    tvWidget.onChartReady(() => {
      chartReadyRef.current = true;
      const chart = tvWidget.chart();

      // Add price lines if provided
      if (priceLines) {
        if (priceLines.takeProfit) {
          chart.createShape(
            { price: priceLines.takeProfit },
            {
              shape: 'horizontal_line',
              lock: true,
              disableSelection: true,
              disableSave: true,
              overrides: {
                linecolor: '#26a69a',
                linestyle: 2,
                linewidth: 2,
                showPrice: true,
                text: 'Take Profit'
              }
            }
          );
        }

        if (priceLines.stopLoss) {
          chart.createShape(
            { price: priceLines.stopLoss },
            {
              shape: 'horizontal_line',
              lock: true,
              disableSelection: true,
              disableSave: true,
              overrides: {
                linecolor: '#ef5350',
                linestyle: 2,
                linewidth: 2,
                showPrice: true,
                text: 'Stop Loss'
              }
            }
          );
        }

        if (priceLines.entry) {
          chart.createShape(
            { price: priceLines.entry },
            {
              shape: 'horizontal_line',
              lock: true,
              disableSelection: true,
              disableSave: true,
              overrides: {
                linecolor: '#60a5fa',
                linestyle: 0,
                linewidth: 2,
                showPrice: true,
                text: 'Entry'
              }
            }
          );
        }
      }
    });

    // WebSocket connection for real-time data
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}m`);
    
    ws.onmessage = (event) => {
      if (!chartReadyRef.current) return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.k) {
          const { t: time, o: open, h: high, l: low, c: close, v: volume } = data.k;
          tvWidgetRef.current.chart().update({
            time: time / 1000,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume)
          });
        }
      } catch (error) {
        console.error('WebSocket data processing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Implement reconnection logic
      setTimeout(() => {
        if (ws.readyState === WebSocket.CLOSED) {
          // Attempt to reconnect
          ws.close();
          // The effect cleanup will handle reconnection
        }
      }, 5000);
    };

    // Cleanup
    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
      ws.close();
    };
  }, [symbol, interval, containerId, priceLines]);

  return (
    <div 
      id={containerId} 
      className="w-full" 
      style={{ height: '372px' }} // Matches the reduced height from ChartSection
    />
  );
};

export default TradingViewChart;