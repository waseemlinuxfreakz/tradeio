import { useState, useEffect, useRef, useCallback } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
} from "lightweight-charts";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useResponsive } from "../lib/useResponsive";
import { normalizeTimeframe } from "../utils/constants";
import { useSignalStore } from "../lib/signalStore";

export type CoinPrice = {
  price: number;
  name: string;
}

type LiveCandlestickChartProps = {
  symbol: string;
  interval?: string;
  onPriceSelect?: (price: number) => void;
  onPriceUpdate?: (price: number) => void;
  priceLines?: {
    takeProfit?: number;
    stopLoss?: number;
    entry?: number;
  };
  consensusData?: {
    topTraders: number;
    community: number;
  };
  setCurrentCoinsPrice?: React.Dispatch<React.SetStateAction<CoinPrice[]>>
};

const LiveCandlestickChart = ({
  symbol = "BTCUSDT",
  interval = "1",
  priceLines,
  consensusData = {
    topTraders: 92,
    community: 80,
  },
  setCurrentCoinsPrice
}: LiveCandlestickChartProps) => {
  const { isMobile } = useResponsive();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const symbolRef = useRef(symbol);
  const lastCandleTimeRef = useRef<number | null>(null);
  const priceLinesRef = useRef<any[]>([]);
  const currentSignalValueRef = useRef(0);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");

  const setCurrentSignalValue = useSignalStore((state) => state.setCurrentSignalValue);

  const [error, setError] = useState<string | null>(null);

  const chartHeight = isMobile ? 280 : 372;

  // useEffect(() => {
  //   if (!chartContainerRef.current) return;
  //   symbolRef.current = symbol;
  //   if (chartRef.current) {
  //     chartRef.current.remove();
  //     chartRef.current = null;
  //   }

  // const chart = createChart(chartContainerRef.current, {
  //   layout: {
  //     background: { type: ColorType.Solid, color: "#131722" },
  //     textColor: "#94a3b8",
  //     fontSize: isMobile ? 10 : 12,
  //   },
  //   grid: {
  //     vertLines: { color: "rgba(148, 163, 184, 0.1)" },
  //     horzLines: { color: "rgba(148, 163, 184, 0.1)" },
  //   },
  //   width: chartContainerRef.current.clientWidth,
  //   height: chartHeight,
  //   timeScale: {
  //     timeVisible: true,
  //     secondsVisible: false,
  //     borderColor: "rgba(148, 163, 184, 0.2)",
  //   },
  //   rightPriceScale: {
  //     borderColor: "rgba(148, 163, 184, 0.2)",
  //     scaleMargins: {
  //       top: 0.1,
  //       bottom: 0.1,
  //     },
  //   },
  //   crosshair: {
  //     mode: 1,
  //     vertLine: {
  //       color: "#94a3b8",
  //       labelBackgroundColor: "#1e293b",
  //     },
  //     horzLine: {
  //       color: "#94a3b8",
  //       labelBackgroundColor: "#1e293b",
  //     },
  //   },
  // });

  //   chartRef.current = chart;

  //   const candlestickSeries = chart.addCandlestickSeries({
  //     upColor: "#10b981",
  //     downColor: "#ef4444",
  //     borderUpColor: "#10b981",
  //     borderDownColor: "#ef4444",
  //     wickUpColor: "#10b981",
  //     wickDownColor: "#ef4444",
  //   });

  //   candlestickSeriesRef.current = candlestickSeries;

  //   priceLinesRef.current.forEach((line) => {
  //     if (candlestickSeries) {
  //       candlestickSeries.removePriceLine(line);
  //     }
  //   });
  //   priceLinesRef.current = [];

  //   if (priceLines) {
  //     if (priceLines.takeProfit) {
  //       const takeProfitLine = candlestickSeries.createPriceLine({
  //         price: priceLines.takeProfit,
  //         color: "#10b981",
  //         lineWidth: 2,
  //         lineStyle: 2,
  //         axisLabelVisible: true,
  //         title: "Take Profit",
  //       });
  //       priceLinesRef.current.push(takeProfitLine);
  //     }

  //     if (priceLines.stopLoss) {
  //       const stopLossLine = candlestickSeries.createPriceLine({
  //         price: priceLines.stopLoss,
  //         color: "#ef4444",
  //         lineWidth: 2,
  //         lineStyle: 2,
  //         axisLabelVisible: true,
  //         title: "Stop Loss",
  //       });
  //       priceLinesRef.current.push(stopLossLine);
  //     }

  //     if (priceLines.entry) {
  //       const entryLine = candlestickSeries.createPriceLine({
  //         price: priceLines.entry,
  //         color: "#60a5fa",
  //         lineWidth: 2,
  //         lineStyle: 0,
  //         axisLabelVisible: true,
  //         title: "Entry",
  //       });
  //       priceLinesRef.current.push(entryLine);
  //     }
  //   }

  //   const fetchHistoricalData = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${normalizeTimeframe(
  //           interval
  //         )}&limit=100`
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       const candleData = data
  //         .map((d: string[]) => ({
  //           time: Number(d[0]) / 1000,
  //           open: parseFloat(d[1]),
  //           high: parseFloat(d[2]),
  //           low: parseFloat(d[3]),
  //           close: parseFloat(d[4]),
  //         }))
  //         .sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
  //       if (candlestickSeriesRef.current) {
  //         candlestickSeriesRef.current.setData(candleData);
  //         const lastCandle = candleData[candleData.length - 1];
  //         lastCandleTimeRef.current = lastCandle.time;
  //         chart.timeScale().fitContent();
  //       }

  //     } catch (error) {
  //       console.error("Failed to fetch historical data:", error);
  //       setError("Failed to load historical data");
  //     }
  //   };

  //   const initWebSocket = () => {
  //     if (wsRef.current?.readyState === WebSocket.OPEN) {
  //       wsRef.current.close();
  //     }
  //     const intr = normalizeTimeframe(interval);
  //     wsRef.current = new WebSocket(
  //       `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${encodeURIComponent(
  //         intr
  //       )}`
  //     );
  //     wsRef.current.onopen = () => {
  //       setConnectionState("connected");
  //       setError(null);
  //     };
  //     wsRef.current.onmessage = (event) => {
  //       if (!candlestickSeriesRef.current) return;

  //       try {
  //         const data = JSON.parse(event.data);
  //         if (data.s.toLowerCase() !== symbolRef.current.toLowerCase()) return;
  //         if (data.k) {
  //           const newCandleTime = data.k.t / 1000;
  //           const candle = {
  //             time: newCandleTime,
  //             open: parseFloat(data.k.o),
  //             high: parseFloat(data.k.h),
  //             low: parseFloat(data.k.l),
  //             close: parseFloat(data.k.c),
  //           };
  //           if (candle.close && symbolRef.current && setCurrentCoinsPrice) {
  //             currentSignalValueRef.current = candle.close;

  //             setCurrentCoinsPrice((prevCoins) => {
  //               const existingIndex = prevCoins.findIndex(
  //                 (coin) => coin.name === symbolRef.current
  //               );

  //               if (existingIndex !== -1) {
  //                 // Update the existing coin's price
  //                 const updatedCoins = [...prevCoins];
  //                 updatedCoins[existingIndex] = {
  //                   ...updatedCoins[existingIndex],
  //                   price: candle.close,
  //                 };
  //                 return updatedCoins;
  //               } else {
  //                 // Add new coin
  //                 return [
  //                   ...prevCoins,
  //                   {
  //                     price: candle.close,
  //                     name: symbolRef.current,
  //                   },
  //                 ];
  //               }
  //             });
  //           }
  //           // if (candle?.close) {
  //           //   setCurrentSignalValue(candle?.close)
  //           // } 
  //           if (lastCandleTimeRef.current === newCandleTime) {
  //             candlestickSeriesRef.current.update(candle);
  //           } else if (newCandleTime > (lastCandleTimeRef.current || 0)) {
  //             candlestickSeriesRef.current.update(candle);
  //             lastCandleTimeRef.current = newCandleTime;
  //             chart.timeScale().scrollToRealTime();
  //           }

  //         }
  //       } catch (error) {
  //         console.error("Error processing WebSocket message:", error);
  //       }
  //     };

  //     wsRef.current.onerror = () => {
  //       setConnectionState("error");
  //       setError("WebSocket connection error");
  //       setTimeout(initWebSocket, 5000);
  //     };

  //     wsRef.current.onclose = () => {
  //       setConnectionState("disconnected");
  //       setTimeout(initWebSocket, 5000);
  //     };
  //   };

  //   const handleResize = () => {
  //     if (!chartContainerRef.current || !chartRef.current) return;
  //     chartRef.current.applyOptions({
  //       width: chartContainerRef.current.clientWidth,
  //       height: chartHeight,
  //     });
  //   };

  //   window.addEventListener("resize", handleResize);

  //   fetchHistoricalData().then(() => {
  //     setConnectionState("connecting");
  //     initWebSocket();
  //   });

  //   return () => {
  //     window.removeEventListener("resize", handleResize);

  //     if (wsRef.current) {
  //       wsRef.current.close();
  //       wsRef.current = null;
  //     }

  //     if (chartRef.current) {
  //       chartRef.current.remove();
  //       chartRef.current = null;
  //     }

  //     candlestickSeriesRef.current = null;
  //     lastCandleTimeRef.current = null;
  //     priceLinesRef.current = [];
  //   };
  // }, [symbol, interval, priceLines, isMobile, chartHeight]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    symbolRef.current = symbol;
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#131722" },
        textColor: "#94a3b8",
        fontSize: isMobile ? 10 : 12,
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.1)" },
        horzLines: { color: "rgba(148, 163, 184, 0.1)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "rgba(148, 163, 184, 0.2)",
      },
      rightPriceScale: {
        borderColor: "rgba(148, 163, 184, 0.2)",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#94a3b8",
          labelBackgroundColor: "#1e293b",
        },
        horzLine: {
          color: "#94a3b8",
          labelBackgroundColor: "#1e293b",
        },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    candlestickSeriesRef.current = candlestickSeries;

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      candlestickSeriesRef.current = null;
    };
  }, [symbol, isMobile, chartHeight]);

  useEffect(() => {
    if (!candlestickSeriesRef.current) return;

    priceLinesRef.current.forEach((line) => {
      candlestickSeriesRef.current?.removePriceLine(line);
    });
    priceLinesRef.current = [];

    if (priceLines) {
      if (priceLines.takeProfit) {
        const takeProfitLine = candlestickSeriesRef.current.createPriceLine({
          price: priceLines.takeProfit,
          color: "#10b981",
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: "Take Profit",
        });
        priceLinesRef.current.push(takeProfitLine);
      }

      if (priceLines.stopLoss) {
        const stopLossLine = candlestickSeriesRef.current.createPriceLine({
          price: priceLines.stopLoss,
          color: "#ef4444",
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: "Stop Loss",
        });
        priceLinesRef.current.push(stopLossLine);
      }
      if (priceLines.entry) {
        const entryLine = candlestickSeriesRef.current.createPriceLine({
          price: priceLines.entry,
          color: "#60a5fa",
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
          title: "Entry",
        });
        priceLinesRef.current.push(entryLine);
      }
    }

    return () => {
      priceLinesRef.current.forEach((line) => {
        candlestickSeriesRef.current?.removePriceLine(line);
      });
      priceLinesRef.current = [];
    };
  }, [priceLines]);

  useEffect(() => {
    if (!candlestickSeriesRef.current) return;

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${normalizeTimeframe(
            interval
          )}&limit=300`
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const candleData = data
          .map((d: string[]) => ({
            time: Number(d[0]) / 1000,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          }))
          .sort((a: { time: number }, b: { time: number }) => a.time - b.time);

        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(candleData);
          const lastCandle = candleData[candleData.length - 1];
          lastCandleTimeRef.current = lastCandle.time;
          chartRef.current?.timeScale().fitContent();
        }
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
        setError("Failed to load historical data");
      }
    };

    const initWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      const intr = normalizeTimeframe(interval);
      wsRef.current = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${intr}`
      );

      wsRef.current.onmessage = (event) => {
        if (!candlestickSeriesRef.current) return;

        try {
          const data = JSON.parse(event.data);
          if (data.s.toLowerCase() !== symbolRef.current.toLowerCase()) return;
          if (data.k) {
            const candle = {
              time: data.k.t / 1000,
              open: parseFloat(data.k.o),
              high: parseFloat(data.k.h),
              low: parseFloat(data.k.l),
              close: parseFloat(data.k.c),
            };

            // Update signal value only if changed significantly
            // if (Math.abs(candle.close - (currentSignalValueRef.current || 0)) > 0.0001) {
            //   currentSignalValueRef.current = candle?.close;
            //   setCurrentSignalValue(candle.close);
            // }
            if(candle?.close){
              setCurrentSignalValue(candle?.close)
            }
            if (candle.close && symbolRef.current && setCurrentCoinsPrice) {
              currentSignalValueRef.current = candle.close;
              setCurrentCoinsPrice((prevCoins) => {
                const existingIndex = prevCoins.findIndex(
                  (coin) => coin.name === symbolRef.current
                );

                if (existingIndex !== -1) {
                  // Update the existing coin's price
                  const updatedCoins = [...prevCoins];
                  updatedCoins[existingIndex] = {
                    ...updatedCoins[existingIndex],
                    price: candle.close,
                  };
                  return updatedCoins;
                } else {
                  // Add new coin
                  return [
                    ...prevCoins,
                    {
                      price: candle.close,
                      name: symbolRef.current,
                    },
                  ];
                }
              });
            }


            // Update chart data
            if (lastCandleTimeRef.current === candle.time) {
              candlestickSeriesRef.current.update(candle);
            } else if (candle.time > (lastCandleTimeRef.current || 0)) {
              candlestickSeriesRef.current.update(candle);
              lastCandleTimeRef.current = candle.time;
              chartRef.current?.timeScale().scrollToRealTime();
            }
          }
        } catch (error) {
          console.error("WebSocket error:", error);
        }
      };

      // ... rest of your WebSocket handlers
    };

    fetchHistoricalData().then(() => {
      setConnectionState("connecting");
      initWebSocket();
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      lastCandleTimeRef.current = null;
    };
  }, [symbol, interval]);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartHeight]);

  return (
    <div className="relative">
      <div
        ref={chartContainerRef}
        className="w-full transition-all duration-300"
        style={{ height: chartHeight }}
      />

      {/* Status Indicators */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {connectionState === "connecting" && (
          <div className="flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            Connecting...
          </div>
        )}

        {error && (
          <div className="flex items-center gap-1 bg-rose-500/10 text-rose-400 px-2 py-1 rounded text-xs">
            <AlertTriangle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>

      {/* Consensus Indicators */}
      <div className="absolute top-4 left-4 space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-slate-400">Top 10%:</span>
          <span className="font-medium">{consensusData.topTraders}%</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-slate-400">Community:</span>
          <span className="font-medium">{consensusData.community}%</span>
        </div>
      </div>
    </div>
  );
};

export default LiveCandlestickChart;
