import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceDot 
} from 'recharts';
import { Trade } from '../types';

interface TradeChartProps {
  data: {
    date: string;
    value: number;
    accumulatedValue: number;
    symbol: string;
    id: number;
    isInitialInvestment?: boolean;
  }[];
  onPointClick: (trade: Trade) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const isInitialInvestment = payload[0].payload.isInitialInvestment;
    
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
        <p className="font-medium">{new Date(label).toLocaleDateString()}</p>
        <p className="text-sm text-gray-600">
          {isInitialInvestment ? (
            <span className="font-medium text-orange-600">Initial Investment</span>
          ) : (
            <>Symbol: <span className="font-medium">{payload[0].payload.symbol}</span></>
          )}
        </p>
        <p className="text-sm text-blue-600">
          Value: <span className="font-medium">${payload[0].value.toFixed(2)}</span>
        </p>
        <p className="text-sm text-green-600">
          Accumulated: <span className="font-medium">${payload[1].value.toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const TradeChart: React.FC<TradeChartProps> = ({ data, onPointClick }) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  // Validate data before processing
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-80 md:h-96 flex items-center justify-center">
        <p className="text-gray-500">No data available to display</p>
      </div>
    );
  }

  // Format dates for better display
  const formattedData = data.map(item => {
    if (!item || typeof item.date !== 'string') {
      return null;
    }
    return {
      ...item,
      date: new Date(item.date).toLocaleDateString(),
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);

  // If all items were invalid, show empty state
  if (formattedData.length === 0) {
    return (
      <div className="w-full h-80 md:h-96 flex items-center justify-center">
        <p className="text-gray-500">Invalid data format</p>
      </div>
    );
  }

  const handleMouseOver = (data: any, index: number) => {
    setActivePoint(index);
  };
  
  const handleMouseLeave = () => {
    setActivePoint(null);
  };

  const handleClick = (data: any) => {
    if (!data.isInitialInvestment) {
      const trade: Trade = {
        id: data.id,
        symbol: data.symbol,
        date: data.date,
        value: data.value,
        accumulatedValue: data.accumulatedValue
      };
      onPointClick(trade);
    }
  };

  return (
    <div className="w-full h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1E40AF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#1E40AF" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            dot={(props: any) => {
              const isInitial = props.payload.isInitialInvestment;
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={isInitial ? 6 : 4}
                  fill={isInitial ? "#F97316" : "#1E40AF"}
                  stroke={isInitial ? "#F97316" : "#1E40AF"}
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ 
              r: 6, 
              onClick: handleClick,
              onMouseOver: handleMouseOver,
              onMouseLeave: handleMouseLeave
            }}
          />
          <Area 
            type="monotone" 
            dataKey="accumulatedValue" 
            stroke="#10B981" 
            fillOpacity={1} 
            fill="url(#colorAccumulated)" 
            dot={(props: any) => {
              const isInitial = props.payload.isInitialInvestment;
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={isInitial ? 6 : 4}
                  fill={isInitial ? "#F97316" : "#10B981"}
                  stroke={isInitial ? "#F97316" : "#10B981"}
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ 
              r: 6, 
              onClick: handleClick,
              onMouseOver: handleMouseOver,
              onMouseLeave: handleMouseLeave
            }}
          />
          {activePoint !== null && formattedData[activePoint] && (
            <ReferenceDot
              x={formattedData[activePoint].date}
              y={formattedData[activePoint].accumulatedValue}
              r={8}
              fill="#F59E0B"
              stroke="#F59E0B"
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradeChart;