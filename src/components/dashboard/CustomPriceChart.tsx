import React from 'react';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PricePoint {
  timestamp: string;
  price: number;
}

interface CustomPriceChartProps {
  data: PricePoint[];
  takeProfit: number;
  stopLoss: number;
  currentPrice: number;
  height?: number;
}

const CustomPriceChart: React.FC<CustomPriceChartProps> = ({
  data,
  takeProfit,
  stopLoss,
  currentPrice,
  height = 400
}) => {
  const minPrice = Math.min(...data.map(d => d.price), stopLoss);
  const maxPrice = Math.max(...data.map(d => d.price), takeProfit);
  const priceRange = maxPrice - minPrice;
  
  // Add padding to price range
  const yDomain = [
    minPrice - (priceRange * 0.1),
    maxPrice + (priceRange * 0.1)
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <p className="text-slate-400 text-xs">{payload[0].payload.timestamp}</p>
          <p className="text-white font-bold">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full h-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          {/* Price Gradient */}
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Take Profit Line */}
          <ReferenceLine
            y={takeProfit}
            stroke="#10b981"
            strokeDasharray="3 3"
            label={{
              value: `Take Profit $${takeProfit}`,
              fill: '#10b981',
              position: 'right'
            }}
          />

          {/* Stop Loss Line */}
          <ReferenceLine
            y={stopLoss}
            stroke="#ef4444"
            strokeDasharray="3 3"
            label={{
              value: `Stop Loss $${stopLoss}`,
              fill: '#ef4444',
              position: 'right'
            }}
          />

          {/* Current Price Line */}
          <ReferenceLine
            y={currentPrice}
            stroke="#60a5fa"
            label={{
              value: `Current $${currentPrice}`,
              fill: '#60a5fa',
              position: 'right'
            }}
          />

          <XAxis
            dataKey="timestamp"
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
            tickLine={{ stroke: '#64748b' }}
          />
          
          <YAxis
            domain={yDomain}
            stroke="#64748b"
            tick={{ fill: '#64748b' }}
            tickLine={{ stroke: '#64748b' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#ec4899"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPriceChart;