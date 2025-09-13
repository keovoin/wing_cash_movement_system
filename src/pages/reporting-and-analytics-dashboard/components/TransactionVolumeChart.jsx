import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const TransactionVolumeChart = ({ data, isLoading, timeframe = 'daily' }) => {
  const chartData = data || [
    { name: 'Mon', USD: 245000, KHR: 980000000, requests: 45 },
    { name: 'Tue', USD: 312000, KHR: 1250000000, requests: 62 },
    { name: 'Wed', USD: 189000, KHR: 756000000, requests: 38 },
    { name: 'Thu', USD: 278000, KHR: 1112000000, requests: 55 },
    { name: 'Fri', USD: 356000, KHR: 1424000000, requests: 71 },
    { name: 'Sat', USD: 198000, KHR: 792000000, requests: 39 },
    { name: 'Sun', USD: 167000, KHR: 668000000, requests: 33 }
  ];

  const formatCurrency = (value, currency) => {
    if (currency === 'USD') {
      return `$${(value / 1000)?.toFixed(0)}K`;
    } else {
      return `${(value / 1000000000)?.toFixed(1)}B KHR`;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-4">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-muted-foreground">{entry?.dataKey}:</span>
              <span className="font-medium text-popover-foreground">
                {entry?.dataKey === 'requests' 
                  ? `${entry?.value} requests`
                  : formatCurrency(entry?.value, entry?.dataKey)
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={18} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Transaction Volume</h3>
            <p className="text-sm text-muted-foreground">
              Daily transaction volumes by currency
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted-foreground">USD</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-muted-foreground">KHR</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => formatCurrency(value, 'USD')}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="USD" 
                fill="hsl(var(--primary))" 
                name="USD Volume"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="KHR" 
                fill="hsl(var(--secondary))" 
                name="KHR Volume"
                radius={[2, 2, 0, 0]}
                yAxisId="right"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">$2.4M</div>
          <div className="text-sm text-muted-foreground">Total USD</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">9.8B</div>
          <div className="text-sm text-muted-foreground">Total KHR</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">343</div>
          <div className="text-sm text-muted-foreground">Total Requests</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionVolumeChart;