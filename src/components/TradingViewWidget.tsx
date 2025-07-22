import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView?: {
      widget: any;
    };
  }
}

interface TradingViewWidgetProps {
  symbol: string;
  theme?: 'light' | 'dark';
  interval?: string;
  timezone?: string;
  style?: '1' | '2' | '3' | '4';
  locale?: string;
  hide_legend?: boolean;
  studies?: string[];
  show_popup_button?: boolean;
  takeProfit?: number;
  stopLoss?: number;
  currentPrice?: number;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = 'BINANCE:BTCUSDT',
  theme = 'dark',
  interval = '15',
  timezone = 'Etc/UTC',
  style = '1',
  locale = 'en',
  hide_legend = false,
  studies = [],
  show_popup_button = false,
  takeProfit,
  stopLoss,
  currentPrice,
}) => {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (window.TradingView) {
      initWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      scriptRef.current = script;
      document.head.appendChild(script);
    }

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      if (container.current) {
        container.current.innerHTML = '';
      }
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.error('Error removing widget:', e);
        }
      }
    };
  }, [symbol, interval, timezone, theme, style, locale, hide_legend, studies, show_popup_button, takeProfit, stopLoss, currentPrice]);

  const initWidget = () => {
    if (!window.TradingView || !container.current) return;

    const containerId = `tradingview_${Math.random().toString(36).substring(7)}`;
    container.current.id = containerId;

    try {
      if (widgetRef.current) {
        widgetRef.current.remove();
      }

      const widget = new window.TradingView.widget({
        symbol,
        interval,
        timezone,
        theme,
        style,
        locale,
        toolbar_bg: '#1e222d',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: containerId,
        autosize: true,
        studies_overrides: {},
        hide_legend,
        studies,
        show_popup_button,
        hide_top_toolbar: false,
        withdateranges: true,
        hide_side_toolbar: false,
        details: true,
        hotlist: true,
        calendar: true,
        width: '100%',
        height: '100%',
        save_image: false,
        disabled_features: [
          'use_localstorage_for_settings',
          'header_symbol_search',
          'symbol_search_hot_key',
          'header_compare',
          'header_undo_redo',
          'header_screenshot',
          'header_saveload'
        ],
        enabled_features: ['study_templates'],
        overrides: {
          "mainSeriesProperties.candleStyle.upColor": "#26a69a",
          "mainSeriesProperties.candleStyle.downColor": "#ef5350",
          "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
          "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
          "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
          "paneProperties.background": "#131722",
          "paneProperties.vertGridProperties.color": "#1e222d",
          "paneProperties.horzGridProperties.color": "#1e222d",
          "scalesProperties.textColor": "#64748b"
        },
        loading_screen: { backgroundColor: "#131722" },
        custom_css_url: 'https://s3.tradingview.com/chart.css',
        drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
        onChartReady: () => {
          const chart = widget.chart();
          if (!chart) return;

          if (takeProfit) {
            chart.createShape(
              { price: takeProfit },
              {
                shape: "horizontal_line",
                lock: true,
                disableSelection: true,
                disableSave: true,
                overrides: {
                  linecolor: "#10b981",
                  linestyle: 2,
                  linewidth: 2,
                  showPrice: true,
                  text: "Take Profit",
                  textcolor: "#10b981"
                }
              }
            );
          }

          if (stopLoss) {
            chart.createShape(
              { price: stopLoss },
              {
                shape: "horizontal_line",
                lock: true,
                disableSelection: true,
                disableSave: true,
                overrides: {
                  linecolor: "#ef4444",
                  linestyle: 2,
                  linewidth: 2,
                  showPrice: true,
                  text: "Stop Loss",
                  textcolor: "#ef4444"
                }
              }
            );
          }

          if (currentPrice) {
            chart.createShape(
              { price: currentPrice },
              {
                shape: "horizontal_line",
                lock: true,
                disableSelection: true,
                disableSave: true,
                overrides: {
                  linecolor: "#60a5fa",
                  linestyle: 0,
                  linewidth: 2,
                  showPrice: true,
                  text: "Current",
                  textcolor: "#60a5fa"
                }
              }
            );
          }
        }
      });

      widgetRef.current = widget;
    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
    }
  };

  return (
    <div 
      ref={container}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
};

export default TradingViewWidget;