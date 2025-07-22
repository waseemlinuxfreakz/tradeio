import React, { useState, useEffect, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Users } from 'lucide-react';
import { createChart, ColorType, IChartApi, CandlestickData } from 'lightweight-charts';
import { Signals } from '../../types/signal';
import useAddUserVote from '../../hooks/useAddUserVote';
import { useQueryClient } from '@tanstack/react-query';

interface VoteDataType {
  totalVotes: number;
  userVote: string;
  consensus: number;
  validator: {
    validatorPositive: number,
    validatorNegative: number,
    verifiedValidators: number,
    validatorPercentage: string,
  },
  community: {
    communityPositive: number,
    communityNegative: number,
    votes: number,
    consensus: number,
    verifiedCommunity: number
  },
}
interface ChartSectionProps {
  onQuickTrade?: () => void;
  signal?: Signals;
  priceLines?: {
    takeProfit: number;
    stopLoss: number;
    currentPrice: number;
  };
  voteData?: VoteDataType
  isValidator?: boolean

}

const ChartSection: React.FC<ChartSectionProps> = ({
  signal,
  priceLines = {
    takeProfit: 98000,
    stopLoss: 94000,
    currentPrice: 96500
  },
  voteData,
  isValidator
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const isComponentMounted = useRef(true);

  const { createUserVote } = useAddUserVote();
  const queryClient = useQueryClient();

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || !isComponentMounted.current) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(148, 163, 184, 0.1)' },
        horzLines: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 372,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(148, 163, 184, 0.2)',
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(148, 163, 184, 0.2)',
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
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
      handleScroll: false,
      handleScale: false,
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries;
    if (priceLines) {
      if (priceLines.takeProfit) {
        candlestickSeries.createPriceLine({
          price: priceLines.takeProfit,
          color: '#10b981',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'Take Profit',
        });
      }

      if (priceLines.stopLoss) {
        candlestickSeries.createPriceLine({
          price: priceLines.stopLoss,
          color: '#ef4444',
          lineWidth: 2,
          lineStyle: 2,
          axisLabelVisible: true,
          title: 'Stop Loss',
        });
      }

      if (priceLines.currentPrice) {
        candlestickSeries.createPriceLine({
          price: priceLines.currentPrice,
          color: '#60a5fa',
          lineWidth: 2,
          lineStyle: 0,
          axisLabelVisible: true,
          title: 'Entry Price',
        });
      }
    }

    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${signal?.pair}&interval=${1}m&limit=1000`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const candleData = data.map((d: any) => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4])
        }));

        if (isComponentMounted.current && candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(candleData);
        }
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      }
    };

    const initWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(
        `wss://stream.binance.com:9443/ws/${signal?.pair?.toLowerCase()}@kline_${1}m`
      );

      wsRef.current.onmessage = (event) => {
        if (!isComponentMounted.current || !candlestickSeriesRef.current) return;

        const data = JSON.parse(event.data);
        if (data.k) {
          const candle: CandlestickData = {
            time: data.k.t / 1000 as import('lightweight-charts').Time,
            open: parseFloat(data.k.o),
            high: parseFloat(data.k.h),
            low: parseFloat(data.k.l),
            close: parseFloat(data.k.c)
          };
          candlestickSeriesRef.current.update(candle);
        }
      };

      wsRef.current.onerror = () => {
        setTimeout(initWebSocket, 5000);
      };
    };

    const handleResize = () => {
      if (!isComponentMounted.current || !chartContainerRef.current || !chartRef.current) return;

      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    fetchHistoricalData().then(() => {
      if (isComponentMounted.current) {
        initWebSocket();
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }

      candlestickSeriesRef.current = null;
    };
  }, [signal?.pair, priceLines]);
  const handleVote = async (type: "like" | "dislike") => {
    if (!signal) return;

    try {
      await createUserVote({
        signalId: signal.id,
        type,
        consensus: "community"
      });
      queryClient.invalidateQueries({ queryKey: ["SignalDetails", signal.id] })
    } catch (error) {
      console.error('Failed to cast vote:', error);
    }
  };
  const CommunityPositiveVotes = voteData?.community?.communityPositive || 0;
  const CommunityNegative = voteData?.community?.communityNegative || 0;
  const totalVotes = CommunityPositiveVotes + CommunityNegative;
  return (
    <div className="bg-[#131722]">
      <div className="relative">
        {/* Chart Container with Border */}
        <div className="relative mx-4 mt-4 rounded-lg border border-slate-700/30 overflow-hidden">
          <div ref={chartContainerRef} className="w-full h-[372px]" />
        </div>

        {/* Community Consensus */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Community Consensus</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                {signal?.status === "PENDING" ? "Live" : signal?.status === "COMPLETE" ? "Completed" : "Expired"}
              </span>
            </div>
            <div className="text-sm">
              Total Votes: {(totalVotes)}
            </div>
          </div>

          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
            {totalVotes > 0 && (<>
              <div
                className="absolute left-0 top-0 h-full bg-blue-500 transition-all"
                style={{
                  width: `${(CommunityPositiveVotes / totalVotes) * 100}%`,
                }}
              />
              <div
                className="absolute left-0 top-0 h-full bg-rose-500 transition-all"
                style={{
                  width: `${(CommunityNegative / totalVotes) * 100}%`,
                  marginLeft: `${(CommunityPositiveVotes / totalVotes) * 100}%`,
                }}
              />
            </>
            )}


          </div>
          <div className=" text-[10px] text-blue-500 whitespace-nowrap mt-2"
            style={{ left: `0%`, transform: 'translateX(0%)' }}>
            Community {voteData?.consensus && voteData?.consensus.toFixed(2)}%
          </div>
          {/* Voting Buttons */}
          <div className="flex justify-between items-center mt-5">
            {signal?.status === "PENDING" &&
              <button
                onClick={() => {
                  handleVote('dislike');

                }}
                disabled={signal?.userVoteCommunityConsensus === "dislike"}

                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
                ${signal?.userVoteCommunityConsensus === "dislike" ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'}

              `}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>Dislike</span>
              </button>
            }


            <div className="text-sm text-slate-400">
              {/* {consensusData.totalVotes.toLocaleString()} votes */}
            </div>
            {signal?.status === "PENDING" && (

              <button
                onClick={() => {
                  handleVote('like');
                }}
                disabled={signal?.userVoteCommunityConsensus === "like" }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors 
                ${signal?.userVoteCommunityConsensus === "like" ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-400'}
              `}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>Like</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default ChartSection;